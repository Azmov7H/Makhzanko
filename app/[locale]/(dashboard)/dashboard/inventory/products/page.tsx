import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductsClient } from "./ProductsClient";
import { Card, CardHeader } from "@/components/ui/card";

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <ProductsContent locale={locale} />
    </Suspense>
  );
}

async function ProductsContent({ locale }: { locale: string }) {
  const context = await getTenantContext();
  const t = await getI18n(locale as Locale);

  let products: any[] = [];

  try {
    products = await db.product.findMany({
      where: { tenantId: context.tenantId },
      orderBy: { name: "asc" },
      include: { stocks: true },
    });
  } catch (error) {
    console.error("Database error:", error);
    products = [];
  }

  const totalStock = products.reduce((sum: number, p: any) => {
    return sum + (p.stocks as any[]).reduce((s: number, stock: any) => s + stock.quantity, 0);
  }, 0);

  return (
    <ProductsClient
      products={JSON.parse(JSON.stringify(products))}
      totalStock={totalStock}
      locale={locale}
      locale={locale}
    />
  );
}

function ProductsSkeleton() {
  return (
    <div className="space-y-8 text-start">
      <div className="flex justify-between items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-12 w-64 rounded-xl" />
          <Skeleton className="h-6 w-96 rounded-lg" />
        </div>
        <Skeleton className="h-12 w-48 rounded-2xl" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-32 w-full rounded-3xl" />
        <Skeleton className="h-32 w-full rounded-3xl" />
      </div>
      <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl rounded-3xl">
        <CardHeader className="p-8">
          <Skeleton className="h-8 w-48 rounded-xl mb-2" />
          <Skeleton className="h-4 w-64 rounded-lg" />
        </CardHeader>
        <div className="px-8 pb-8 space-y-4">
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
        </div>
      </Card>
    </div>
  );
}
