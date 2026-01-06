import { prisma } from "@/lib/prisma";
import { createJournalEntry } from "@/lib/accounting";
import { ACCOUNTS } from "@/lib/accounting-constants";

export interface CreateSaleInput {
    warehouseId: string;
    items: { productId: string; quantity: number; price: number }[];
    customerId?: string;
    customerName?: string;
    discountType?: "percentage" | "fixed";
    discountValue?: number;
    paymentType?: "CASH" | "BANK_TRANSFER" | "DEFERRED" | "ONLINE";
    paymobOrderId?: string;
}

export class SalesService {
    static async createSale(tenantId: string, userId: string, data: CreateSaleInput, status: string = "COMPLETED") {
        const { warehouseId, items, customerId, customerName, discountType, discountValue, paymentType = "CASH", paymobOrderId } = data;

        return await prisma.$transaction(async (tx) => {
            // 1. Get next number safely
            const lastSale = await tx.sale.findFirst({
                where: { tenantId },
                orderBy: { number: "desc" },
                select: { number: true }
            });
            const nextNumber = (lastSale?.number || 0) + 1;

            // 2. Fetch products to get current costs
            const productIds = items.map((i: any) => i.productId);
            const products = await tx.product.findMany({
                where: { id: { in: productIds } }
            });
            const productMap = new Map(products.map(p => [p.id, p]));

            // 3. Calculate Subtotal, Discount, and Total
            const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

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
                    tenantId,
                    userId,
                    customerId,
                    status: status, // PENDING_PAYMENT or COMPLETED
                    paymentType,
                    paymobOrderId,
                    // If ONLINE + PENDING, amountPaid is 0 initially in terms of "Cash Received", 
                    // but usually for accounting we might track it differently. For now 0.
                    amountPaid: (paymentType === "DEFERRED" || status === "PENDING_PAYMENT") ? 0 : total,
                    items: {
                        create: items.map((item: any) => {
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

            // 4. Update Stock (ALWAYS deduct stock, even if pending payment)
            // If payment fails later, we must trigger a cancel/return to restore stock.
            for (const item of items) {
                const existingStock = await tx.stock.findUnique({
                    where: {
                        warehouseId_productId: {
                            warehouseId,
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
                            tenantId,
                            quantity: -item.quantity
                        }
                    });
                }
            }

            // 5. Generate human-readable invoice token
            const year = new Date().getFullYear();
            const paddedNumber = String(nextNumber).padStart(4, '0');
            const invoiceToken = `INV-${year}-${paddedNumber}`;

            // 6. Create Invoice (ALWAYS create invoice, effectively as a "Draft/Pending" if not paid)
            // This preserves the full snapshot of the transaction details (discount, customer name, etc.)
            const newInvoice = await tx.invoice.create({
                data: {
                    saleId: newSale.id,
                    tenantId,
                    token: invoiceToken,
                    customerName: customerName || null,
                    subtotal,
                    discountType: discountType || null,
                    discountValue: discountValue || null,
                    discountAmount,
                    total,
                    status: status === "PENDING_PAYMENT" ? "PENDING" : "COMPLETED",
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
                    } as any
                }
            });

            // If pending payment, we STOP here. accounting entries are deferred.
            if (status === "PENDING_PAYMENT") {
                return newSale;
            }

            // 7. GL Entries (Only if COMPLETED)
            const totalCost = items.reduce((sum: number, item: any) => {
                const product = productMap.get(item.productId);
                return sum + (Number(product?.cost || 0) * item.quantity);
            }, 0);

            let debitAccount: string = ACCOUNTS.ASSETS.CASH;
            if (paymentType === "BANK_TRANSFER") debitAccount = ACCOUNTS.ASSETS.BANK;
            if (paymentType === "ONLINE") debitAccount = ACCOUNTS.ASSETS.ONLINE_GATEWAY;
            if (paymentType === "DEFERRED") debitAccount = ACCOUNTS.ASSETS.ACCOUNTS_RECEIVABLE;

            await createJournalEntry({
                tenantId,
                description: `Sale #${nextNumber} (${paymentType})`,
                reference: newSale.id,
                date: new Date(),
                transactions: [
                    { accountCode: debitAccount, type: "DEBIT", amount: Number(total) },
                    { accountCode: ACCOUNTS.REVENUE.SALES, type: "CREDIT", amount: Number(total) },
                    { accountCode: ACCOUNTS.EXPENSE.COGS, type: "DEBIT", amount: Number(totalCost) },
                    { accountCode: ACCOUNTS.ASSETS.INVENTORY, type: "CREDIT", amount: Number(totalCost) },
                ]
            }, tx);

            return newSale;
        });
    }

    static async finalizeSale(saleId: string) {
        return await prisma.$transaction(async (tx) => {
            const sale = await tx.sale.findUnique({
                where: { id: saleId },
                include: { items: true, invoice: true, tenant: true }
            });
            if (!sale) throw new Error("Sale not found");
            if (sale.status === "COMPLETED") return sale;

            // Update Sale status
            await tx.sale.update({
                where: { id: saleId },
                data: {
                    status: "COMPLETED",
                    amountPaid: sale.total
                }
            });

            // Update Invoice status
            if (sale.invoice) {
                await tx.invoice.update({
                    where: { id: sale.invoice.id },
                    data: { status: "COMPLETED" }
                });
            }

            // Fetch product costs for GL
            const productIds = sale.items.map((i) => i.productId);
            const products = await tx.product.findMany({
                where: { id: { in: productIds } },
                select: { id: true, cost: true }
            });
            const productMap = new Map(products.map(p => [p.id, p]));

            const totalCost = sale.items.reduce((sum, item) => {
                const product = productMap.get(item.productId);
                return sum + (Number(product?.cost || 0) * item.quantity);
            }, 0);

            // GL Entries
            // Default to Online Gateway since this is finalized from online payment
            const debitAccount = ACCOUNTS.ASSETS.ONLINE_GATEWAY;

            await createJournalEntry({
                tenantId: sale.tenantId,
                description: `Sale #${sale.number} (ONLINE)`,
                reference: sale.id,
                date: new Date(),
                transactions: [
                    { accountCode: debitAccount, type: "DEBIT", amount: Number(sale.total) },
                    { accountCode: ACCOUNTS.REVENUE.SALES, type: "CREDIT", amount: Number(sale.total) },
                    { accountCode: ACCOUNTS.EXPENSE.COGS, type: "DEBIT", amount: Number(totalCost) },
                    { accountCode: ACCOUNTS.ASSETS.INVENTORY, type: "CREDIT", amount: Number(totalCost) },
                ]
            }, tx);

            return sale;
        });
    }
}
