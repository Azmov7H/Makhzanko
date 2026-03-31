import { getSalesReport, getInventoryValuation, getBestSellingProducts, getDashboardChartData } from "@/actions/reports";
import { getTenantContext } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ReportsChartsClient from "./ReportsChartsClient";
import { getI18n, getLocale } from "@/lib/i18n/server";
import { TrendingUp, Package, BarChart3, Award } from "lucide-react";

interface SaleReportItem {
    id: string;
    total: number | string;
    date: Date | string;
}

interface InventoryValuation {
    totalValue: number;
    totalItems: number;
}

interface BestSeller {
    name: string;
    quantity: number;
}

interface ChartData {
    revenueData: { name: string; value: number }[];
    userGrowthData: { name: string; users: number }[];
}

export default async function ReportsPage() {
    const locale = await getLocale();
    await getTenantContext();
    const t = await getI18n(locale);

    const [valuation, bestSellers, sales, chartData] = await Promise.all([
        getInventoryValuation(),
        getBestSellingProducts(),
        getSalesReport("30days"),
        getDashboardChartData()
    ]) as [InventoryValuation, BestSeller[], SaleReportItem[], ChartData];

    const totalRevenue = sales?.reduce((sum, s) => sum + Number(s.total), 0) || 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-700 text-start pb-10">
            <div className="relative">
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-12 bg-primary rounded-full" />
                <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent italic" style={{ fontFamily: "var(--font-amiri), serif" }}>
                    {t("reports.title")}
                </h1>
                <p className="text-muted-foreground mt-2 text-lg font-medium">{t("reports.description")}</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <Card className="relative overflow-hidden border-none shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-xl rounded-[2rem] group transition-all hover:shadow-primary/10">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                        <TrendingUp className="h-20 w-20 text-primary" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">
                            {t("reports.sales_30d")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-primary tracking-tighter">
                            {totalRevenue.toLocaleString()} <span className="text-base font-bold opacity-70 ml-1">{t("Common.currency")}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-3 font-bold flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            {t("reports.sales_count", { count: sales?.length || 0 })}
                        </p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-none shadow-2xl shadow-emerald-500/5 bg-card/50 backdrop-blur-xl rounded-[2rem] group transition-all hover:shadow-emerald-500/10">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                        <Package className="h-20 w-20 text-emerald-600" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">
                            {t("reports.inventory_valuation")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-emerald-600 tracking-tighter">
                            {valuation?.totalValue.toLocaleString()} <span className="text-base font-bold opacity-70 ml-1">{t("Common.currency")}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-3 font-bold flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            {t("reports.inventory_items", { count: valuation?.totalItems || 0 })}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-8 lg:grid-cols-7">
                <Card className="lg:col-span-4 border-none shadow-3xl bg-card rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <BarChart3 className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black italic">{t("reports.sales_trend")}</CardTitle>
                                <CardDescription className="text-base font-medium">{t("reports.sales_trend_desc")}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 h-[300px] md:h-[450px]">
                        <ReportsChartsClient data={chartData.revenueData} />
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3 border-none shadow-3xl bg-card rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <Award className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black italic">{t("reports.best_sellers")}</CardTitle>
                                <CardDescription className="text-base font-medium">{t("reports.best_sellers_desc")}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                        <div className="space-y-4 mt-6">
                            {bestSellers.map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between group p-4 rounded-2xl hover:bg-primary/5 transition-all duration-300 border border-primary/5 hover:border-primary/10 hover:-translate-x-1"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center font-black text-sm text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <p className="text-base font-black group-hover:text-primary transition-colors">{item.name}</p>
                                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">{t("reports.best_seller_rank", { rank: i + 1 }) || "Top selling product"}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-black text-primary tracking-tighter">
                                            {item.quantity.toLocaleString()}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.1em]">
                                            {t("reports.sold")}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {bestSellers.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-24 bg-muted/20 rounded-[2rem] border-2 border-dashed border-primary/10">
                                    <Package className="h-12 w-12 text-muted-foreground/30 mb-4" />
                                    <p className="text-muted-foreground font-bold">{t("Common.no_data")}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
