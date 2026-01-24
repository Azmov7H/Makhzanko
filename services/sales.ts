import { prisma } from "@/lib/prisma";
import { createJournalEntry } from "@/lib/accounting";
import { ACCOUNTS } from "@/lib/accounting-constants";
import { NotificationService } from "./notifications";

export interface CreateSaleInput {
    warehouseId: string;
    items: { productId: string; quantity: number; price: number }[];
    customerId?: string;
    customerName?: string;
    discountType?: "percentage" | "fixed";
    discountValue?: number;
    paymentType?: "CASH" | "BANK_TRANSFER" | "DEFERRED";
}

export class SalesService {
    static async createSale(tenantId: string, userId: string, data: CreateSaleInput, status: string = "COMPLETED") {
        const { warehouseId, items, customerId, customerName, discountType, discountValue, paymentType = "CASH" } = data;

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
                    status: status,
                    paymentType,
                    amountPaid: (paymentType === "DEFERRED") ? 0 : total,
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
                // Check if total stock is low for this product across all warehouses
                const totalStock = await tx.stock.aggregate({
                    where: { tenantId, productId: item.productId },
                    _sum: { quantity: true }
                });

                const product = productMap.get(item.productId);
                if (product && totalStock._sum.quantity !== null && totalStock._sum.quantity <= product.minStock) {
                    await tx.notification.create({
                        data: {
                            tenantId,
                            title: `نقص في المخزون: ${product.name}`,
                            message: `وصل رصيد المنتج ${product.name} إلى ${totalStock._sum.quantity} قطعة، وهو أقل من أو يساوي الحد الأدنى (${product.minStock})`,
                            type: "warning",
                            status: "unread",
                            link: `/dashboard/inventory/products`
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

            // 7. GL Entries (Only if COMPLETED)
            const totalCost = items.reduce((sum: number, item: any) => {
                const product = productMap.get(item.productId);
                return sum + (Number(product?.cost || 0) * item.quantity);
            }, 0);

            let debitAccount: string = ACCOUNTS.ASSETS.CASH;
            if (paymentType === "BANK_TRANSFER") debitAccount = ACCOUNTS.ASSETS.BANK;
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
}
