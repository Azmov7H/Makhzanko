import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import { getEmployeePerformance } from "@/actions/advanced-features";
import AdvancedAnalyticsClient from "./AdvancedAnalyticsClient";

interface TopProduct {
  productId: string;
  _sum: {
    quantity: number | null;
    price: any; // Prisma Decimal
  };
}

export default async function AdvancedAnalyticsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const context = await getTenantContext();
  const performance = await getEmployeePerformance();

  // Fetch top products
  const topProducts = await db.saleItem.groupBy({
    by: ["productId"],
    where: { sale: { tenantId: context.tenantId, status: "COMPLETED" } },
    _sum: { quantity: true, price: true },
    orderBy: { _sum: { price: "desc" } },
    take: 5,
  }) as unknown as TopProduct[];

  const topProductsWithTotal = topProducts.map((p) => {
    const quantity = p._sum.quantity ?? 0;
    const price =
      typeof p._sum.price === "object" && p._sum.price !== null && "toNumber" in p._sum.price
        ? (p._sum.price as any).toNumber()
        : p._sum.price ?? 0;

    return {
      productId: p.productId,
      totalQuantity: quantity,
      totalAmount: quantity * price,
    };
  });

  const productDetails = await db.product.findMany({
    where: { id: { in: topProducts.map((p: TopProduct) => p.productId) } },
  });

  // Fetch growth rate data (last 30 days vs previous 30 days)
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const [currentSales, previousSales] = await Promise.all([
    db.sale.aggregate({
      where: {
        tenantId: context.tenantId,
        status: "COMPLETED",
        date: { gte: thirtyDaysAgo }
      },
      _sum: { total: true }
    }),
    db.sale.aggregate({
      where: {
        tenantId: context.tenantId,
        status: "COMPLETED",
        date: { gte: sixtyDaysAgo, lt: thirtyDaysAgo }
      },
      _sum: { total: true }
    })
  ]);

  const currentTotal = Number(currentSales._sum.total || 0);
  const previousTotal = Number(previousSales._sum.total || 0);

  const growthRate = previousTotal > 0
    ? ((currentTotal - previousTotal) / previousTotal) * 100
    : (currentTotal > 0 ? 100 : 0);

  // Simple target calculation (e.g., target is 10% more than previous period)
  const target = previousTotal * 1.1 || 5000; // Fallback target
  const targetAchievement = Math.min(Math.round((currentTotal / target) * 100), 100);

  const analyticsData = topProductsWithTotal.map((tp) => {
    const p = productDetails.find((prod) => prod.id === tp.productId);
    return {
      productId: tp.productId,
      name: p?.name || "Unknown",
      sku: p?.sku || "N/A",
      _sum: {
        quantity: tp.totalQuantity,
        total: tp.totalAmount
      }
    };
  });

  const stats = {
    growthRate: growthRate.toFixed(1) + "%",
    targetAchievement: targetAchievement + "%",
    growthStatus: (growthRate >= 0 ? "up" : "down") as "up" | "down"
  };

  return (
    <AdvancedAnalyticsClient
      params={params}
      data={{ performance, analyticsData, stats }}
    />
  );
}
