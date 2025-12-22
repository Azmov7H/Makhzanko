import { getTenantContext } from "@/lib/auth";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Warehouse, ShoppingCart, FileText, TrendingUp, DollarSign } from "lucide-react";
import { getDashboardSummary, getInventoryAlerts } from "@/actions/reports";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";
import { AlertTriangle, TrendingDown, Clock, MoveRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function DashboardLandingPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    await getTenantContext();
    const [stats, alerts] = await Promise.all([
        getDashboardSummary(),
        getInventoryAlerts()
    ]);
    const t = await getI18n(locale as Locale);

    const quickLinks = [
        { href: `/${locale}/dashboard/inventory/products`, label: t("Dashboard.products"), icon: Package, color: "bg-blue-500" },
        { href: `/${locale}/dashboard/inventory/warehouses`, label: t("Dashboard.warehouses"), icon: Warehouse, color: "bg-green-500" },
        { href: `/${locale}/dashboard/sales-flow/sales`, label: t("Dashboard.sales"), icon: ShoppingCart, color: "bg-purple-500" },
        { href: `/${locale}/dashboard/sales-flow/invoices`, label: t("Dashboard.invoices"), icon: FileText, color: "bg-orange-500" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t("Dashboard.welcome")}</h1>
                <p className="text-muted-foreground mt-2">
                    {t("Dashboard.welcome_desc")}
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-md transition-shadow border-t-4 border-t-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("Dashboard.total_products")}</CardTitle>
                        <Package className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalProducts}</div>
                        <p className="text-xs text-muted-foreground">{t("Dashboard.products_desc")}</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow border-t-4 border-t-purple-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("Dashboard.total_sales")}</CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalSales}</div>
                        <p className="text-xs text-muted-foreground">{t("Dashboard.sales_desc")}</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow border-t-4 border-t-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("Dashboard.total_revenue")}</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} {t("Common.currency")}</div>
                        <p className="text-xs text-muted-foreground">{t("Dashboard.revenue_desc")}</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow border-t-4 border-t-orange-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("Dashboard.total_warehouses")}</CardTitle>
                        <Warehouse className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalWarehouses}</div>
                        <p className="text-xs text-muted-foreground">{t("Dashboard.warehouses_desc")}</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t("Dashboard.quick_links")}</CardTitle>
                    <CardDescription>{t("Dashboard.quick_links_desc")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                        {quickLinks.map((link) => (
                            <Link key={link.href} href={link.href}>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start gap-3 h-auto py-4 hover:bg-accent transition-colors"
                                >
                                    <div className={`${link.color} p-2 rounded-lg`}>
                                        <link.icon className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="font-medium">{link.label}</span>
                                </Button>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Low Stock Alerts */}
                <Card className="border-red-100 dark:border-red-900/30">
                    <CardHeader className="flex flex-row items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <div>
                            <CardTitle className="text-lg">{t("Dashboard.alerts.low_stock_title")}</CardTitle>
                            <CardDescription>{t("Dashboard.alerts.low_stock_desc")}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {alerts.lowStock.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-4 text-center">
                                    {t("Dashboard.alerts.no_alerts")}
                                </p>
                            ) : (
                                alerts.lowStock.map(p => (
                                    <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-red-50 dark:bg-red-900/10">
                                        <div>
                                            <p className="font-bold text-sm">{p.name}</p>
                                            <p className="text-xs text-muted-foreground">{p.sku}</p>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="destructive">{p.totalStock} / {p.minStock}</Badge>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Demand Forecast */}
                <Card className="border-blue-100 dark:border-blue-900/30">
                    <CardHeader className="flex flex-row items-center gap-2">
                        <TrendingDown className="h-5 w-5 text-blue-500" />
                        <div>
                            <CardTitle className="text-lg">{t("Dashboard.alerts.forecast_title")}</CardTitle>
                            <CardDescription>{t("Dashboard.alerts.forecast_desc")}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {alerts.forecasts.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-4 text-center">
                                    {t("Dashboard.alerts.no_forecasts")}
                                </p>
                            ) : (
                                alerts.forecasts.map(f => (
                                    <div key={f.id} className="flex items-center justify-between p-2 rounded-lg bg-blue-50 dark:bg-blue-900/10">
                                        <div>
                                            <p className="font-bold text-sm">{f.name}</p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                <Clock className="h-3 w-3" />
                                                <span>{locale === "ar" ? `يكفي لـ ${f.daysLeft} أيام` : `Lasts for ${f.daysLeft} days`}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
                                                {locale === "ar" ? `${f.weeklySales} قطعة/أسبوع` : `${f.weeklySales} units/week`}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
