import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import { getEmployeePerformance } from "@/actions/advanced-features";
import AdvancedAnalyticsClient from "./AdvancedAnalyticsClient";

export default async function AdvancedAnalyticsPage({
  params,
}: {
  params: { locale: string };
}) {
  const context = await getTenantContext();
  const performance = await getEmployeePerformance();

  // Fetch top products
  const topProducts = await db.saleItem.groupBy({
    by: ["productId"],
    where: {
      sale: { tenantId: context.tenantId, status: "COMPLETED" },
    },
    _sum: {
      quantity: true,
      price: true, // حقل رقمي موجود في schema
    },
    orderBy: {
      _sum: { price: "desc" },
    },
    take: 5,
  });

  // Compute totalAmount (convert Decimal to number if necessary)
  const topProductsWithTotal = topProducts.map((p) => {
    const quantity = p._sum.quantity ?? 0;
    // Prisma يعيد Decimal objects في بعض الحقول المالية، حولها باستخدام toNumber()
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

  // Fetch product details
  const productDetails = await db.product.findMany({
    where: { id: { in: topProducts.map((p) => p.productId) } },
  });

  // Merge with names & SKUs
  const analyticsData = topProductsWithTotal.map((tp) => {
    const p = productDetails.find((prod) => prod.id === tp.productId);
    return {
      ...tp,
      name: p?.name || "Unknown",
      sku: p?.sku || "N/A",
    };
  });

  return (
    <AdvancedAnalyticsClient
      params={params}
      data={{ performance, analyticsData }}
    />
  );
}
