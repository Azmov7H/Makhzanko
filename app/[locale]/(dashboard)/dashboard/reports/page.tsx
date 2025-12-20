import { getSalesReport, getInventoryValuation, getBestSellingProducts, getDashboardChartData } from "@/actions/reports";
import { checkPlanAccess } from "@/lib/plan-access";
import { getTenantContext } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ReportsChartsClient from "./ReportsChartsClient";


export default async function ReportsPage() {
    const context = await getTenantContext();

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
            <div>
                <h1 className="text-2xl font-bold tracking-tight">التحليلات والتقارير</h1>
                <p className="text-muted-foreground text-sm">المقاييس الرئيسية لعملك.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-t-4 border-t-primary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">إجمالي المبيعات (30 يوم)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalRevenue.toFixed(2)} ج.م</div>
                        <p className="text-xs text-muted-foreground">
                            {sales?.length} عملية بيع
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-t-4 border-t-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">تقييم المخزون</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{valuation?.totalValue.toFixed(2)} ج.م</div>
                        <p className="text-xs text-muted-foreground">
                            {valuation?.totalItems} قطعة في المخزن
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 shadow-md">
                    <CardHeader>
                        <CardTitle>اتجاه المبيعات</CardTitle>
                        <CardDescription>نمو المبيعات خلال الـ 7 أشهر الماضية</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ReportsChartsClient data={chartData.revenueData} />
                    </CardContent>
                </Card>
                <Card className="col-span-3 shadow-md">
                    <CardHeader>
                        <CardTitle>الأكثر مبيعاً</CardTitle>
                        <CardDescription>أفضل 5 منتجات حسب الكمية.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {bestSellers.map((item, i) => (
                                <div key={i} className="flex items-center justify-between group">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">{item.name}</p>
                                    </div>
                                    <div className="font-bold flex items-center gap-2">
                                        <span className="text-primary">{item.quantity}</span>
                                        <span className="text-xs text-muted-foreground font-normal">تم بيعها</span>
                                    </div>
                                </div>
                            ))}
                            {bestSellers.length === 0 && (
                                <p className="text-center text-muted-foreground py-10">لا توجد بيانات متاحة حالياً</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

