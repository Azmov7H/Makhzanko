import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import { getEmployeePerformance } from "@/actions/advanced-features";
import AdvancedAnalyticsClient from "./AdvancedAnalyticsClient";
import { Decimal } from "@prisma/client/runtime";

export default async function AdvancedAnalyticsPage({
  params,
}: {
  params: { locale: string }; // اصلاح type
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
      price: true, // افترض أن هذا حقل رقمي موجود
    },
    orderBy: {
      _sum: { price: "desc" },
    },
    take: 5,
  });

  // Compute totalAmount (convert Decimal to number)
  const topProductsWithTotal = topProducts.map((p) => {
    const quantity = p._sum.quantity ?? 0;
    const price = p._sum.price instanceof Decimal ? p._sum.price.toNumber() : p._sum.price ?? 0;
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
