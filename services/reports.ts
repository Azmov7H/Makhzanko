import { prisma } from "@/lib/prisma";

export class ReportService {
    static async getSalesReport(tenantId: string, range: string = "30days") {
        const startDate = new Date();
        if (range === "7days") startDate.setDate(startDate.getDate() - 7);
        if (range === "30days") startDate.setDate(startDate.getDate() - 30);
        if (range === "90days") startDate.setDate(startDate.getDate() - 90);

        return await prisma.sale.findMany({
            where: {
                tenantId,
                date: { gte: startDate },
                status: "COMPLETED"
            },
            include: { items: true },
            orderBy: { date: "asc" }
        });
    }

    static async getInventoryValuation(tenantId: string) {
        const stocks = await prisma.stock.findMany({
            where: { tenantId },
            include: { product: true }
        });

        const totalValue = stocks.reduce((sum, stock) => {
            return sum + (stock.quantity * Number(stock.product.cost));
        }, 0);

        const totalItems = stocks.reduce((sum, stock) => sum + stock.quantity, 0);

        return { totalValue, totalItems };
    }

    static async getBestSellingProducts(tenantId: string) {
        const result = await prisma.saleItem.groupBy({
            by: ['productId'],
            where: {
                sale: {
                    tenantId,
                    status: "COMPLETED"
                }
            },
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take: 5
        });

        const products = await prisma.product.findMany({
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

    static async getDashboardChartData(tenantId: string, locale: string = "ar") {
        const today = new Date();
        const startDate = new Date(today.getFullYear(), today.getMonth() - 6, 1);

        const [sales, users] = await Promise.all([
            prisma.sale.findMany({
                where: {
                    tenantId,
                    date: { gte: startDate },
                    status: "COMPLETED"
                },
                select: { date: true, total: true }
            }),
            prisma.user.findMany({
                where: {
                    tenantId,
                    createdAt: { gte: startDate }
                },
                select: { createdAt: true }
            })
        ]);

        const months = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
            months.push({
                date: d,
                name: d.toLocaleString(locale === "ar" ? 'ar-EG' : 'en-US', { month: 'long' }),
                key: `${d.getFullYear()}-${d.getMonth()}`
            });
        }

        const revenueMap = new Map();
        sales.forEach(s => {
            const d = new Date(s.date);
            const key = `${d.getFullYear()}-${d.getMonth()}`;
            revenueMap.set(key, (revenueMap.get(key) || 0) + Number(s.total));
        });

        const userMap = new Map();
        users.forEach(u => {
            const d = new Date(u.createdAt);
            const key = `${d.getFullYear()}-${d.getMonth()}`;
            userMap.set(key, (userMap.get(key) || 0) + 1);
        });

        return {
            revenueData: months.map(m => ({ name: m.name, value: revenueMap.get(m.key) || 0 })),
            userGrowthData: months.map(m => ({ name: m.name, users: userMap.get(m.key) || 0 }))
        };
    }

    static async getDashboardSummary(tenantId: string) {
        const [productsCount, salesCount, warehousesCount, salesData] = await Promise.all([
            prisma.product.count({ where: { tenantId } }),
            prisma.sale.count({ where: { tenantId, status: "COMPLETED" } }),
            prisma.warehouse.count({ where: { tenantId } }),
            prisma.sale.aggregate({
                where: { tenantId, status: "COMPLETED" },
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
}
