import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle, PackageX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";

export async function LowStockAlerts({ locale }: { locale: string }) {
    const context = await getTenantContext();
    const t = await getI18n(locale as Locale);

    const products = await db.product.findMany({
        where: { tenantId: context.tenantId },
        include: { stocks: true },
    });

    const lowStockProducts = products.filter(product => {
        const totalStock = product.stocks.reduce((acc, stock) => acc + stock.quantity, 0);
        return totalStock <= product.minStock;
    });

    if (lowStockProducts.length === 0) return null;

    return (
        <Card className="border-orange-500/20 shadow-orange-500/5 bg-orange-500/5">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                    <AlertTriangle className="h-5 w-5" />
                    <CardTitle className="text-lg font-bold">{t("Dashboard.low_stock_alerts")}</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {lowStockProducts.slice(0, 5).map(product => {
                        const totalStock = product.stocks.reduce((acc, stock) => acc + stock.quantity, 0);
                        return (
                            <div key={product.id} className="flex items-center justify-between p-3 bg-background/50 rounded-xl border border-orange-500/10">
                                <div className="flex flex-col">
                                    <span className="font-medium">{product.name}</span>
                                    <span className="text-xs text-muted-foreground">{t("Products.sku")}: {product.sku}</span>
                                </div>
                                <Badge variant="destructive" className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-none hover:bg-orange-500/20">
                                    {totalStock} / {product.minStock}
                                </Badge>
                            </div>
                        );
                    })}
                    {lowStockProducts.length > 5 && (
                        <Link
                            href={`/${locale}/dashboard/inventory/products`}
                            className="block text-center text-sm font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
                        >
                            {t("Dashboard.view_all_low_stock")}
                        </Link>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
