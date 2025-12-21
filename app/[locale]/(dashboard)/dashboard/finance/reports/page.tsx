import { getSalesReport, getInventoryValuation, getBestSellingProducts, getDashboardChartData } from "@/actions/reports";
import { checkPlanAccess } from "@/lib/plan-access";
import { getTenantContext } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ReportsChartsClient from "./ReportsChartsClient";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";
import { TrendingUp, Package, BarChart3, Award } from "lucide-react";

export default async function ReportsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const context = await getTenantContext();
    const t = await getI18n(locale as Locale);

    await checkPlanAccess(context.tenantId, "reports");

    const [valuation, bestSellers, sales, chartData] = await Promise.all([
        getInventoryValuation(),
        getBestSellingProducts(),
        getSalesReport("30days"),
        getDashboardChartData()
    ]);

    const totalRevenue = sales?.reduce((sum, s) => sum + Number(s.total), 0) || 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight">{t("reports.title")}</h1>
                <p className="text-muted-foreground">{t("reports.description")}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="relative overflow-hidden border-none shadow-sm bg-primary/5">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <TrendingUp className="h-16 w-16" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            {t("reports.sales_30d")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-primary">
                            {totalRevenue.toLocaleString()} <span className="text-sm font-normal">{t("Common.currency")}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 font-medium">
                            {t("reports.sales_count", { count: sales?.length || 0 })}
                        </p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-none shadow-sm bg-green-500/5">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Package className="h-16 w-16 text-green-600" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            {t("reports.inventory_valuation")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-green-600">
                            {valuation?.totalValue.toLocaleString()} <span className="text-sm font-normal">{t("Common.currency")}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 font-medium">
                            {t("reports.inventory_items", { count: valuation?.totalItems || 0 })}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 border-primary/5 shadow-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            {t("reports.sales_trend")}
                        </CardTitle>
                        <CardDescription>{t("reports.sales_trend_desc")}</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px] pl-0">
                        <ReportsChartsClient data={chartData.revenueData} />
                    </CardContent>
                </Card>

                <Card className="col-span-3 border-primary/5 shadow-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Award className="h-5 w-5 text-primary" />
                            {t("reports.best_sellers")}
                        </CardTitle>
                        <CardDescription>{t("reports.best_sellers_desc")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-5 mt-2">
                            {bestSellers.map((item, i) => (
                                <div key={i} className="flex items-center justify-between group p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                                    <div className="flex flex-col gap-0.5">
                                        <p className="text-sm font-bold group-hover:text-primary transition-colors">{item.name}</p>
                                        <p className="text-[10px] text-muted-foreground font-mono uppercase">#{i + 1} Best Seller</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-black text-primary">
                                            {item.quantity.toLocaleString()}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground font-medium uppercase">
                                            {t("reports.sold")}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {bestSellers.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-xl border border-dashed">
                                    <p className="text-muted-foreground text-sm">{t("Common.no_data")}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
