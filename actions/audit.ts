"use server";

import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import { checkLimit } from "@/lib/limits";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createInventoryCountAction(warehouseId: string) {
    const context = await getTenantContext();

    // Limit Check
    try {
        await checkLimit(context.tenantId, "audit");
    } catch (error) {
        const err = error as Error;
        return { error: err.message };
    }

    // 1. Create Count Header
    const count = await db.inventoryCount.create({
        data: {
            tenantId: context.tenantId,
            warehouseId,
            status: "DRAFT",
        }
    });

    // 2. Snapshot current system quantity
    const stocks = await db.stock.findMany({
        where: {
            warehouseId,
            tenantId: context.tenantId
        }
    });

    await db.inventoryCountLine.createMany({
        data: stocks.map(stock => ({
            countId: count.id,
            productId: stock.productId,
            systemQty: stock.quantity,
            countedQty: 0,
            difference: -stock.quantity
        }))
    });

    revalidatePath("/dashboard/inventory/audits");
    return { success: true, countId: count.id };
}

export async function updateCountLineAction(lineId: string, countedQty: number) {
    const context = await getTenantContext();

    const line = await db.inventoryCountLine.findUnique({
        where: { id: lineId },
        include: {
            count: true
        }
    });

    if (!line || line.count.tenantId !== context.tenantId) {
        return { error: "Line not found" };
    }

    const diff = countedQty - line.systemQty;

    await db.inventoryCountLine.update({
        where: { id: lineId },
        data: {
            countedQty,
            difference: diff
        }
    });

    revalidatePath(`/dashboard/inventory/audits/${line.countId}`);
}

export async function finalizeInventoryCountAction(countId: string) {
    const context = await getTenantContext();

    const count = await db.inventoryCount.findUnique({
        where: { id: countId },
        include: { lines: true }
    });

    if (!count || count.tenantId !== context.tenantId || count.status !== "DRAFT") {
        return { error: "Invalid count" };
    }

    // Apply adjustments
    await db.$transaction(async (tx) => {
        for (const line of count.lines) {
            if (line.difference !== 0) {
                await tx.stock.update({
                    where: {
                        warehouseId_productId: {
                            warehouseId: count.warehouseId,
                            productId: line.productId
                        }
                    },
                    data: {
                        quantity: line.countedQty
                    }
                });
            }
        }

        await tx.inventoryCount.update({
            where: { id: countId },
            data: { status: "COMPLETED" }
        });
    });

    revalidatePath("/dashboard/inventory/audits");
    redirect("/dashboard/inventory/audits");
}
