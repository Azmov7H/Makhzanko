import { prisma } from "@/lib/prisma";

export class AuditService {
    static async createCount(tenantId: string, warehouseId: string) {
        // 1. Create Count Header
        const count = await prisma.inventoryCount.create({
            data: {
                tenantId,
                warehouseId,
                status: "DRAFT",
            }
        });

        // 2. Snapshot current system quantity
        const stocks = await prisma.stock.findMany({
            where: {
                warehouseId,
                tenantId
            }
        });

        await prisma.inventoryCountLine.createMany({
            data: stocks.map(stock => ({
                countId: count.id,
                productId: stock.productId,
                systemQty: stock.quantity,
                countedQty: 0,
                difference: -stock.quantity
            }))
        });

        return count;
    }

    static async updateLine(lineId: string, tenantId: string, countedQty: number) {
        const line = await prisma.inventoryCountLine.findFirst({
            where: { id: lineId, count: { tenantId } },
            include: { count: true }
        });

        if (!line) throw new Error("Line not found");

        const diff = countedQty - line.systemQty;

        return await prisma.inventoryCountLine.update({
            where: { id: lineId },
            data: {
                countedQty,
                difference: diff
            }
        });
    }

    static async finalizeCount(countId: string, tenantId: string) {
        const count = await prisma.inventoryCount.findUnique({
            where: { id: countId },
            include: { lines: true }
        });

        if (!count || count.tenantId !== tenantId || count.status !== "DRAFT") {
            throw new Error("Invalid count");
        }

        // Apply adjustments
        return await prisma.$transaction(async (tx) => {
            for (const line of count.lines) {
                if (line.difference !== 0) {
                    await tx.stock.upsert({
                        where: {
                            warehouseId_productId: {
                                warehouseId: count.warehouseId,
                                productId: line.productId
                            }
                        },
                        update: {
                            quantity: line.countedQty
                        },
                        create: {
                            warehouseId: count.warehouseId,
                            productId: line.productId,
                            quantity: line.countedQty,
                            tenantId
                        }
                    });
                }
            }

            await tx.inventoryCount.update({
                where: { id: countId },
                data: { status: "COMPLETED" }
            });
        });
    }
}
