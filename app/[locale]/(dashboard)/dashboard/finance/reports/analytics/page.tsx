import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import { getEmployeePerformance } from "@/actions/advanced-features";
import AdvancedAnalyticsClient from "./AdvancedAnalyticsClient";

export default async function AdvancedAnalyticsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const context = await getTenantContext();
    const performance = await getEmployeePerformance();

    // Fetch some top products
    const topProducts = await db.saleItem.groupBy({
        by: ['productId'],
        where: { sale: { tenantId: context.tenantId, status: "COMPLETED" } },
        _sum: { quantity: true, total: true },
        orderBy: { _sum: { total: "desc" } },
        take: 5
    });

    const productDetails = await db.product.findMany({
        where: { id: { in: topProducts.map(p => p.productId) } }
    });

    const analyticsData = topProducts.map(tp => {
        const p = productDetails.find(prod => prod.id === tp.productId);
        return {
            ...tp,
            name: p?.name || "Unknown",
            sku: p?.sku || "N/A"
        };
    });

    return (
        <AdvancedAnalyticsClient
            params={params}
            data={{ performance, analyticsData }}
        />
    );
}
