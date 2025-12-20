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

export async function getDashboardChartData() {
    const context = await getTenantContext();
    const today = new Date();
    // Get last 7 months
    const startDate = new Date(today.getFullYear(), today.getMonth() - 6, 1);

    // 1. Monthly Revenue
    const sales = await db.sale.findMany({
        where: {
            tenantId: context.tenantId,
            date: { gte: startDate },
            status: "COMPLETED"
        },
        select: {
            date: true,
            total: true
        }
    });

    // 2. Monthly New Users (Staff/Admins)
    const users = await db.user.findMany({
        where: {
            tenantId: context.tenantId,
            createdAt: { gte: startDate }
        },
        select: {
            createdAt: true
        }
    });

    // Process data into months
    const months = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
        months.push({
            date: d,
            name: d.toLocaleString('ar-SA', { month: 'long' }),
            key: `${d.getFullYear()}-${d.getMonth()}`
        });
    }

    const revenueMap = new Map();
    sales.forEach(s => {
        const d = new Date(s.date);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        const current = revenueMap.get(key) || 0;
        revenueMap.set(key, current + Number(s.total));
    });

    const userMap = new Map();
    users.forEach(u => {
        const d = new Date(u.createdAt);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        const current = userMap.get(key) || 0;
        userMap.set(key, current + 1);
    });

    return {
        revenueData: months.map(m => ({
            name: m.name,
            value: revenueMap.get(m.key) || 0
        })),
        userGrowthData: months.map(m => ({
            name: m.name,
            users: userMap.get(m.key) || 0
        }))
    };
}

export async function getDashboardSummary() {
    const context = await getTenantContext();

    const [productsCount, salesCount, warehousesCount, salesData] = await Promise.all([
        db.product.count({ where: { tenantId: context.tenantId } }),
        db.sale.count({ where: { tenantId: context.tenantId, status: "COMPLETED" } }),
        db.warehouse.count({ where: { tenantId: context.tenantId } }),
        db.sale.aggregate({
            where: { tenantId: context.tenantId, status: "COMPLETED" },
            _sum: { total: true }
        })
    ]);

    return {
        totalProducts: productsCount,
        totalSales: salesCount,
        totalRevenue: Number(salesData._sum.total || 0),
        totalWarehouses: warehousesCount
    };
}
