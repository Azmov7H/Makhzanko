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

export async function getInventoryAlerts() {
    const context = await getTenantContext();

    // 1. Low Stock Alerts
    const products = await db.product.findMany({
        where: { tenantId: context.tenantId },
        include: { stocks: true }
    });

    const lowStock = products.map(p => {
        const totalStock = p.stocks.reduce((sum, s) => sum + s.quantity, 0);
        return {
            id: p.id,
            name: p.name,
            sku: p.sku,
            totalStock,
            minStock: p.minStock
        };
    }).filter(p => p.totalStock <= p.minStock && p.minStock > 0);

    // 2. Basic Demand Forecast (Simple moving average of last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentSales = await db.saleItem.findMany({
        where: {
            sale: {
                tenantId: context.tenantId,
                date: { gte: sevenDaysAgo },
                status: "COMPLETED"
            }
        },
        select: {
            productId: true,
            quantity: true
        }
    });

    const salesMap = new Map();
    recentSales.forEach(s => {
        const current = salesMap.get(s.productId) || 0;
        salesMap.set(s.productId, current + s.quantity);
    });

    const forecasts = products.map(p => {
        const weeklySales = salesMap.get(p.id) || 0;
        const dailyAvg = weeklySales / 7;
        const totalStock = p.stocks.reduce((sum, s) => sum + s.quantity, 0);

        return {
            id: p.id,
            name: p.name,
            weeklySales,
            dailyAvg: dailyAvg.toFixed(2),
            daysLeft: dailyAvg > 0 ? Math.floor(totalStock / dailyAvg) : Infinity
        };
    }).filter(f => f.weeklySales > 0).sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 5);

    return { lowStock, forecasts };
}
export async function getInvoiceFinancialSummary(invoiceId: string) {
    const context = await getTenantContext();

    const invoice = await db.invoice.findUnique({
        where: { id: invoiceId, tenantId: context.tenantId },
        include: {
            sale: {
                include: {
                    items: { include: { product: true } }
                }
            },
            returns: {
                include: { items: true }
            }
        }
    });

    if (!invoice) return { error: "Invoice not found" };

    const itemsTotal = Number(invoice.subtotal);
    const discountAmount = Number(invoice.discountAmount);

    // Calculate actual cost of items sold (COGS)
    // Note: Items returned should be deducted from the cost
    const returnedItemsMap = new Map();
    invoice.returns.forEach(ret => {
        if (ret.status === "COMPLETED") {
            ret.items.forEach(item => {
                const current = returnedItemsMap.get(item.productId) || 0;
                returnedItemsMap.set(item.productId, current + item.quantity);
            });
        }
    });

    let totalCost = 0;
    invoice.sale.items.forEach(item => {
        const returnedQty = returnedItemsMap.get(item.productId) || 0;
        const soldQty = Math.max(0, item.quantity - returnedQty);
        totalCost += (soldQty * Number(item.cost || item.product.cost));
    });

    const totalRefunded = invoice.returns
        .filter(r => r.status === "COMPLETED")
        .reduce((sum, r) => sum + Number(r.refundAmount), 0);

    const netRevenue = Number(invoice.total) - totalRefunded;
    const netProfit = netRevenue - totalCost;

    return {
        itemsTotal,
        discountAmount,
        totalRefunded,
        netRevenue,
        totalCost,
        netProfit,
        profitMargin: netRevenue > 0 ? (netProfit / netRevenue) * 100 : 0
    };
}
