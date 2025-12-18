"use server";

import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";

export async function getSalesReport(range: string = "30days") {
    const context = await getTenantContext();

    const startDate = new Date();
    if (range === "7days") startDate.setDate(startDate.getDate() - 7);
    if (range === "30days") startDate.setDate(startDate.getDate() - 30);
    if (range === "90days") startDate.setDate(startDate.getDate() - 90);

    const sales = await db.sale.findMany({
        where: {
            tenantId: context.tenantId,
            date: { gte: startDate },
            status: "COMPLETED"
        },
        include: { items: true },
        orderBy: { date: "asc" }
    });

    return sales;
}

export async function getInventoryValuation() {
    const context = await getTenantContext();

    const stocks = await db.stock.findMany({
        where: { tenantId: context.tenantId },
        include: { product: true }
    });

    const totalValue = stocks.reduce((sum, stock) => {
        return sum + (stock.quantity * Number(stock.product.cost));
    }, 0);

    const totalItems = stocks.reduce((sum, stock) => sum + stock.quantity, 0);

    return { totalValue, totalItems };
}

export async function getBestSellingProducts() {
    const context = await getTenantContext();

    const result = await db.saleItem.groupBy({
        by: ['productId'],
        where: {
            sale: {
                tenantId: context.tenantId,
                status: "COMPLETED"
            }
        },
        _sum: {
            quantity: true,
        },
        orderBy: {
            _sum: {
                quantity: 'desc'
            }
        },
        take: 5
    });

    const products = await db.product.findMany({
        where: { id: { in: result.map(r => r.productId) } }
    });

    return result.map(r => {
        const p = products.find(prod => prod.id === r.productId);
        return {
            name: p?.name || "Unknown",
            quantity: r._sum.quantity || 0,
        };
    });
}
