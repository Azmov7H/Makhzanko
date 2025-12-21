"use server";

import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createJournalEntry } from "@/lib/accounting";

interface PurchaseItemInput {
    productId: string;
    quantity: number;
    cost: number;
}

export async function createPurchaseAction(prevState: unknown, formData: FormData) {
    const context = await getTenantContext();

    const warehouseId = formData.get("warehouseId") as string;
    const itemsJson = formData.get("items") as string;
    const supplier = formData.get("supplier") as string;

    if (!warehouseId || !itemsJson) {
        return { error: "Missing required fields" };
    }

    const items: PurchaseItemInput[] = JSON.parse(itemsJson);

    if (items.length === 0) {
        return { error: "No items in purchase order" };
    }

    try {
        await db.$transaction(async (tx) => {
            // 1. Get atomic number
            const lastPO = await tx.purchaseOrder.findFirst({
                where: { tenantId: context.tenantId },
                orderBy: { number: "desc" },
            });
            const nextNumber = (lastPO?.number || 0) + 1;

            // 2. Calculate Total
            const total = items.reduce((sum, item) => sum + (item.cost * item.quantity), 0);

            // 3. Create PO
            const po = await tx.purchaseOrder.create({
                data: {
                    tenantId: context.tenantId,
                    warehouseId,
                    number: nextNumber,
                    supplier: supplier || "Unknown",
                    total: total,
                    status: "RECEIVED",
                }
            });

            // 4. Create Items and Update Stock
            for (const item of items) {
                await tx.purchaseItem.create({
                    data: {
                        purchaseId: po.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        cost: item.cost,
                    }
                });

                await tx.product.update({
                    where: { id: item.productId },
                    data: { cost: item.cost }
                });

                // Upsert Stock
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
                        data: { quantity: existingStock.quantity + item.quantity }
                    });
                } else {
                    await tx.stock.create({
                        data: {
                            tenantId: context.tenantId,
                            warehouseId,
                            productId: item.productId,
                            quantity: item.quantity
                        }
                    });
                }
            }

            // 5. GL Entry
            await createJournalEntry({
                tenantId: context.tenantId,
                description: `Purchase Order #${nextNumber}`,
                reference: po.id,
                date: new Date(),
                transactions: [
                    { accountCode: "1300", type: "DEBIT", amount: Number(total) },
                    { accountCode: "2001", type: "CREDIT", amount: Number(total) },
                ]
            }, tx);
        });

    } catch (error) {
        console.error("Purchase Creation Error:", error);
        return { error: "Failed to process purchase order" };
    }

    revalidatePath("/dashboard/finance/purchases");
    redirect("/dashboard/finance/purchases");
}
