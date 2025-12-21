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
}) {
    const context = await getTenantContext();

    const { warehouseId, items, customerId } = data;

    if (!items || items.length === 0) return { error: "No items in sale" };
    if (!warehouseId) return { error: "Warehouse required" };

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
            });
            const nextNumber = (lastSale?.number || 0) + 1;

            // 2. Calculate Total & Create Sale
            const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            const newSale = await tx.sale.create({
                data: {
                    number: nextNumber,
                    total: total,
                    tenantId: context.tenantId,
                    userId: context.userId,
                    customerId: customerId,
                    status: "COMPLETED",
                    items: {
                        create: items.map(item => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.price,
                            cost: 0,
                        }))
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

            // 4. Create Invoice placeholder
            await tx.invoice.create({
                data: {
                    saleId: newSale.id,
                    tenantId: context.tenantId,
                    jsonSnapshot: { ...newSale, items }
                }
            });

            // 5. GL Entries
            const productIds = items.map(i => i.productId);
            const products = await tx.product.findMany({
                where: { id: { in: productIds } }
            });
            const productMap = new Map(products.map(p => [p.id, p]));

            const totalCost = items.reduce((sum, item) => {
                const product = productMap.get(item.productId);
                return sum + (Number(product?.cost || 0) * item.quantity);
            }, 0);

            await createJournalEntry({
                tenantId: context.tenantId,
                description: `Sale #${nextNumber}`,
                reference: newSale.id,
                date: new Date(),
                transactions: [
                    { accountCode: "1200", type: "DEBIT", amount: Number(total) },
                    { accountCode: "4001", type: "CREDIT", amount: Number(total) },
                    { accountCode: "5001", type: "DEBIT", amount: Number(totalCost) },
                    { accountCode: "1300", type: "CREDIT", amount: Number(totalCost) },
                ]
            }, tx);

            return newSale;
        });

        revalidatePath("/dashboard/sales-flow/sales");
        return { success: true, saleId: sale.id };

    } catch (error) {
        console.error("Sale Transaction Error:", error);
        return { error: "Failed to process sale" };
    }
}
