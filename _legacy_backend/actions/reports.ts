"use server";

import { getTenantContext } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ReportService } from "@/_legacy_backend/services/reports";

export async function getSalesReport(range: string = "30days") {
    const context = await getTenantContext();
    const data = await ReportService.getSalesReport(context.tenantId, range);
    return JSON.parse(JSON.stringify(data));
}

export async function getInventoryValuation() {
    const context = await getTenantContext();
    const data = await ReportService.getInventoryValuation(context.tenantId);
    return JSON.parse(JSON.stringify(data));
}

export async function getBestSellingProducts() {
    const context = await getTenantContext();
    const data = await ReportService.getBestSellingProducts(context.tenantId);
    return JSON.parse(JSON.stringify(data));
}

export async function getDashboardChartData(locale: string = "ar") {
    const context = await getTenantContext();
    const data = await ReportService.getDashboardChartData(context.tenantId, locale);
    return JSON.parse(JSON.stringify(data));
}

export async function getDashboardSummary() {
    const context = await getTenantContext();
    const data = await ReportService.getDashboardSummary(context.tenantId);
    return JSON.parse(JSON.stringify(data));
}

export async function getInventoryAlerts() {
    const context = await getTenantContext();

    const products = await prisma.product.findMany({
        where: { tenantId: context.tenantId },
        include: { stocks: true }
    });

    const lowStock = products.map(p => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        totalStock: p.stocks.reduce((sum: number, s: any) => sum + s.quantity, 0),
        minStock: p.minStock
    })).filter(p => p.totalStock <= p.minStock && p.minStock > 0);

    // Placeholder for forecasts - can be expanded with real AI/ML logic later
    const forecasts: any[] = [];

    return {
        lowStock: JSON.parse(JSON.stringify(lowStock)),
        forecasts
    };
}

export async function getInvoiceFinancialSummary(invoiceId: string) {
    const context = await getTenantContext();

    const invoice = await prisma.invoice.findUnique({
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
    const returnedItemsMap = new Map<string, number>();
    invoice.returns.forEach((ret: any) => {
        if (ret.status === "COMPLETED") {
            ret.items.forEach((item: any) => {
                const current = returnedItemsMap.get(item.productId) || 0;
                returnedItemsMap.set(item.productId, current + item.quantity);
            });
        }
    });

    let totalCost = 0;
    invoice.sale.items.forEach((item: any) => {
        const returnedQty = returnedItemsMap.get(item.productId) || 0;
        const soldQty = Math.max(0, item.quantity - returnedQty);
        totalCost += (soldQty * Number(item.cost || item.product.cost));
    });

    const totalRefunded = invoice.returns
        .filter((r: any) => r.status === "COMPLETED")
        .reduce((sum: number, r: any) => sum + Number(r.refundAmount), 0);

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
