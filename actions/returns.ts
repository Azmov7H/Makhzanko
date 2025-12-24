"use server";

import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createJournalEntry } from "@/lib/accounting";
import {
    generateReturnToken,
    calculateProportionalRefund,
    getReturnableQuantities,
} from "@/lib/invoice-utils";

interface CreateReturnInput {
    invoiceId: string;
    items: { productId: string; quantity: number }[];
    reason: string;
    notes?: string;
    paymentType?: "CASH" | "BANK_TRANSFER" | "DEFERRED";
}

export async function createReturnAction(data: CreateReturnInput) {
    const context = await getTenantContext();
    const { invoiceId, items, reason, notes, paymentType: refundPaymentType } = data;

    if (!items || items.length === 0) return { error: "No items to return" };
    if (!reason) return { error: "Return reason is required" };

    try {
        const result = await db.$transaction(async (tx) => {
            const invoice = await tx.invoice.findUnique({
                where: { id: invoiceId, tenantId: context.tenantId },
                include: {
                    sale: { include: { items: { include: { product: true } } } },
                    returns: { 
                        where: { status: { in: ["PENDING", "APPROVED", "COMPLETED"] } },
                        include: { items: true },
                    },
                },
            });

            if (!invoice) throw new Error("Invoice not found");
            if (invoice.status === "REFUNDED" || invoice.status === "CANCELLED") {
                throw new Error("Invoice is already fully refunded or cancelled");
            }

            // Maps
            const originalQtyMap = new Map<string, number>();
            const priceMap = new Map<string, number>();
            const costMap = new Map<string, number>();

            for (const item of invoice.sale?.items ?? []) {
                originalQtyMap.set(item.productId, item.quantity ?? 0);
                priceMap.set(item.productId, Number(item.price ?? 0));
                costMap.set(item.productId, Number(item.product?.cost ?? 0));
            }

            for (const existingReturn of invoice.returns ?? []) {
                for (const returnItem of existingReturn.items ?? []) {
                    const current = originalQtyMap.get(returnItem.productId) ?? 0;
                    originalQtyMap.set(returnItem.productId, current - (returnItem.quantity ?? 0));
                }
            }

            // Validate return quantities
            for (const item of items) {
                const available = originalQtyMap.get(item.productId) ?? 0;
                if (item.quantity > available) {
                    const product = invoice.sale.items.find(si => si.productId === item.productId);
                    throw new Error(
                        `Cannot return ${item.quantity} of ${product?.product?.name ?? "item"}. Only ${available} available.`
                    );
                }
                if (item.quantity <= 0) throw new Error("Return quantity must be positive");
            }

            // Calculate totals
            const itemsTotal = items.reduce((sum, item) => sum + ((priceMap.get(item.productId) ?? 0) * item.quantity), 0);
            const itemsCost = items.reduce((sum, item) => sum + ((costMap.get(item.productId) ?? 0) * item.quantity), 0);

            const invoiceSubtotal = Number(invoice.subtotal ?? 0);
            const invoiceDiscountAmount = Number(invoice.discountAmount ?? 0);
            const { discountShare, refundAmount } = calculateProportionalRefund(itemsTotal, invoiceSubtotal, invoiceDiscountAmount);

            const totalOriginalItems = invoice.sale.items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
            const totalAlreadyReturned = invoice.returns.reduce(
                (sum, ret) => sum + ret.items.reduce((s, i) => s + (i.quantity ?? 0), 0), 0
            );
            const totalReturning = items.reduce((sum, item) => sum + item.quantity, 0);
            const returnType = (totalAlreadyReturned + totalReturning >= totalOriginalItems) ? "FULL" : "PARTIAL";

            const returnToken = await generateReturnToken(context.tenantId);

            const newReturn = await tx.return.create({
                data: {
                    token: returnToken,
                    invoiceId,
                    tenantId: context.tenantId,
                    returnType,
                    reason,
                    notes,
                    itemsTotal,
                    discountShare,
                    refundAmount,
                    status: "COMPLETED",
                    paymentType: refundPaymentType ?? invoice.paymentType ?? "CASH",
                    processedAt: new Date(),
                    processedBy: context.userId,
                    items: {
                        create: items.map(item => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: priceMap.get(item.productId) ?? 0,
                            cost: costMap.get(item.productId) ?? 0,
                        })),
                    },
                },
            });

            const newStatus = returnType === "FULL" ? "REFUNDED" : "PARTIAL_REFUND";
            await tx.invoice.update({ where: { id: invoiceId }, data: { status: newStatus } });

            // Restore stock
            for (const item of items) {
                const existingStock = await tx.stock.findFirst({
                    where: { productId: item.productId, tenantId: context.tenantId },
                });
                if (existingStock) {
                    await tx.stock.update({
                        where: { id: existingStock.id },
                        data: { quantity: { increment: item.quantity } },
                    });
                }
            }

            // Journal Entry
            let creditAccount = "1101"; 
            const effectivePaymentType = refundPaymentType ?? invoice.paymentType ?? "CASH";
            if (effectivePaymentType === "BANK_TRANSFER") creditAccount = "1102";
            if (effectivePaymentType === "DEFERRED") creditAccount = "1200";

            await createJournalEntry({
                tenantId: context.tenantId,
                description: `Return ${returnToken} for Invoice ${invoice.token} (${effectivePaymentType})`,
                reference: newReturn.id,
                date: new Date(),
                transactions: [
                    { accountCode: "4001", type: "DEBIT", amount: refundAmount },
                    { accountCode: creditAccount, type: "CREDIT", amount: refundAmount },
                    { accountCode: "1300", type: "DEBIT", amount: itemsCost },
                    { accountCode: "5001", type: "CREDIT", amount: itemsCost },
                ],
            }, tx);

            return newReturn;
        });

        revalidatePath("/dashboard/sales-flow/invoices");
        revalidatePath(`/dashboard/sales-flow/invoices/${data.invoiceId}`);
        revalidatePath("/dashboard/sales-flow/returns");

        return { success: true, returnId: result.id, token: result.token };
    } catch (error) {
        console.error("Return Processing Error:", error);
        const err = error as Error;
        return { error: err.message ?? "Failed to process return" };
    }
}

export async function getReturnsAction() {
    const context = await getTenantContext();
    const returns = await db.return.findMany({
        where: { tenantId: context.tenantId },
        include: { invoice: true, items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
    });
    return returns;
}

export async function getReturnByIdAction(returnId: string) {
    const context = await getTenantContext();
    const returnRecord = await db.return.findUnique({
        where: { id: returnId, tenantId: context.tenantId },
        include: { invoice: { include: { tenant: true } }, items: { include: { product: true } } },
    });
    return returnRecord;
}

export async function getReturnableItemsAction(invoiceId: string) {
    const context = await getTenantContext();
    const invoice = await db.invoice.findUnique({
        where: { id: invoiceId, tenantId: context.tenantId },
        include: {
            sale: { include: { items: { include: { product: true } } } },
            returns: { where: { status: { in: ["PENDING","APPROVED","COMPLETED"] } }, include: { items: true } },
        },
    });

    if (!invoice) return { error: "Invoice not found" };

    const returnableItems = (invoice.sale?.items ?? []).map(item => {
        const originalQty = item.quantity ?? 0;
        const returnedQty = (invoice.returns ?? []).reduce((sum, ret) => {
            const ri = ret.items?.find(ri => ri.productId === item.productId);
            return sum + (ri?.quantity ?? 0);
        }, 0);

        return {
            productId: item.productId,
            productName: item.product?.name ?? "",
            productSku: item.product?.sku ?? "",
            originalQuantity: originalQty,
            returnedQuantity: returnedQty,
            returnableQuantity: originalQty - returnedQty,
            price: Number(item.price ?? 0),
        };
    }).filter(item => item.returnableQuantity > 0);

    return {
        invoiceToken: invoice.token ?? "",
        invoiceSubtotal: Number(invoice.subtotal ?? 0),
        invoiceDiscountAmount: Number(invoice.discountAmount ?? 0),
        invoiceTotal: Number(invoice.total ?? 0),
        items: returnableItems,
    };
}
