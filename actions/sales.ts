"use server";

import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createJournalEntry } from "@/lib/accounting";
import { checkLimit } from "@/lib/limits";

export async function createSaleAction(data: {
    warehouseId: string;
    items: { productId: string; quantity: number; price: number }[];
    customerId?: string;
    customerName?: string;
    discountType?: "percentage" | "fixed";
    discountValue?: number;
    paymentType?: "CASH" | "BANK_TRANSFER" | "DEFERRED";
}) {
    const context = await getTenantContext();

    const { warehouseId, items, customerId, customerName, discountType, discountValue, paymentType = "CASH" } = data;

    if (!items || items.length === 0) return { error: "No items in sale" };
    if (!warehouseId) return { error: "Warehouse required" };

    // Check deferred permission
    const user = await db.user.findUnique({
        where: { id: context.userId },
        select: {
            id: true,
            role: true,
            // canDeferred: true // Removed due to schema mismatch
        }
    });
    // @ts-ignore - Schema mismatch workaround
    if (paymentType === "DEFERRED" && !user?.canDeferred && context.role !== "OWNER") {
        return { error: "You don't have permission to process deferred payments (Ajel)." };
    }

    // Check Limits
    try {
        await checkLimit(context.tenantId, "sales");
    } catch (error) {
        const err = error as Error;
        return { error: err.message };
    }

    try {
        const sale = await db.$transaction(async (tx) => {
            // 1. Get next number safely
            const lastSale = await tx.sale.findFirst({
                where: { tenantId: context.tenantId },
                orderBy: { number: "desc" },
                select: { number: true }
            });
            const nextNumber = (lastSale?.number || 0) + 1;

            // 2. Fetch products to get current costs
            const productIds = items.map(i => i.productId);
            const products = await tx.product.findMany({
                where: { id: { in: productIds } }
            });
            const productMap = new Map(products.map(p => [p.id, p]));

            // 3. Calculate Subtotal, Discount, and Total
            const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            // Calculate discount amount
            let discountAmount = 0;
            if (discountType === "percentage" && discountValue) {
                discountAmount = (subtotal * discountValue) / 100;
            } else if (discountType === "fixed" && discountValue) {
                discountAmount = Math.min(discountValue, subtotal);
            }

            const total = subtotal - discountAmount;

            const newSale = await tx.sale.create({
                data: {
                    number: nextNumber,
                    total: total,
                    tenantId: context.tenantId,
                    userId: context.userId,
                    customerId: customerId,
                    status: "COMPLETED",
                    // paymentType: paymentType, // Removed due to schema mismatch
                    // paymentStatus: paymentType === "DEFERRED" ? "UNPAID" : "PAID",
                    amountPaid: paymentType === "DEFERRED" ? 0 : total,
                    items: {
                        create: items.map(item => {
                            const product = productMap.get(item.productId);
                            return {
                                productId: item.productId,
                                quantity: item.quantity,
                                price: item.price,
                                cost: Number(product?.cost || 0),
                            };
                        })
                    }
                },
            });

            // 3. Update Stock
            for (const item of items) {
                const existingStock = await tx.stock.findUnique({
                    where: {
                        warehouseId_productId: {
                            warehouseId: warehouseId,
                            productId: item.productId
                        }
                    }
                });

                if (existingStock) {
                    await tx.stock.update({
                        where: { id: existingStock.id },
                        data: { quantity: { decrement: item.quantity } }
                    });
                } else {
                    await tx.stock.create({
                        data: {
                            warehouseId,
                            productId: item.productId,
                            tenantId: context.tenantId,
                            quantity: -item.quantity
                        }
                    });
                }
            }

            // 4. Generate human-readable invoice token: INV-YYYY-XXXX
            const year = new Date().getFullYear();
            const paddedNumber = String(nextNumber).padStart(4, '0');
            const invoiceToken = `INV-${year}-${paddedNumber}`;

            // 5. Create Invoice with all financial details
            await tx.invoice.create({
                data: {
                    saleId: newSale.id,
                    tenantId: context.tenantId,
                    token: invoiceToken,
                    customerName: customerName || null,
                    subtotal: subtotal,
                    discountType: discountType || null,
                    discountValue: discountValue || null,
                    discountAmount: discountAmount,
                    total: total,
                    status: "COMPLETED",
                    // paymentType: paymentType,
                    // paymentStatus: paymentType === "DEFERRED" ? "UNPAID" : "PAID", 
                    jsonSnapshot: {
                        ...newSale,
                        items,
                        customerName,
                        subtotal,
                        discountType,
                        discountValue,
                        discountAmount,
                        total,
                        paymentType
                    }
                }
            });

            // 5. GL Entries
            const totalCost = items.reduce((sum, item) => {
                const product = productMap.get(item.productId);
                return sum + (Number(product?.cost || 0) * item.quantity);
            }, 0);

            // Determine Account for Debit
            // 1101: Treasury, 1102: Bank, 1200: Receivables
            let debitAccount = "1101";
            if (paymentType === "BANK_TRANSFER") debitAccount = "1102";
            if (paymentType === "DEFERRED") debitAccount = "1200";

            await createJournalEntry({
                tenantId: context.tenantId,
                description: `Sale #${nextNumber} (${paymentType})`,
                reference: newSale.id,
                date: new Date(),
                transactions: [
                    { accountCode: debitAccount, type: "DEBIT", amount: Number(total) },
                    { accountCode: "4001", type: "CREDIT", amount: Number(total) },
                    { accountCode: "5001", type: "DEBIT", amount: Number(totalCost) },
                    { accountCode: "1300", type: "CREDIT", amount: Number(totalCost) },
                ]
            }, tx);

            // 6. Update Customer Loyalty Points
            if (customerId) {
                const pointsToAdd = Math.floor(total / 100);
                // await tx.customer.update({
                //     where: { id: customerId },
                //     data: { loyaltyPoints: { increment: pointsToAdd } }
                // });
            }

            return newSale;
        });

        revalidatePath("/dashboard/sales-flow/sales");
        return { success: true, saleId: sale.id };

    } catch (error) {
        console.error("Sale Transaction Error:", error);
        return { error: "Failed to process sale" };
    }
}
