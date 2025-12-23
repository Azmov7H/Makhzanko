import { getTenantContext } from "@/lib/auth";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Warehouse, ShoppingCart, FileText, TrendingUp, DollarSign } from "lucide-react";
import { getDashboardSummary, getInventoryAlerts } from "@/actions/reports";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";
import { AlertTriangle, TrendingDown, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function DashboardLandingPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    await getTenantContext();
    const t = await getI18n(locale as Locale);

    const quickLinks = [
        { href: `/${locale}/dashboard/inventory/products`, label: t("Dashboard.products"), icon: Package, color: "bg-blue-500" },
        { href: `/${locale}/dashboard/inventory/warehouses`, label: t("Dashboard.warehouses"), icon: Warehouse, color: "bg-green-500" },
        { href: `/${locale}/dashboard/sales-flow/sales`, label: t("Dashboard.sales"), icon: ShoppingCart, color: "bg-purple-500" },
        { href: `/${locale}/dashboard/sales-flow/invoices`, label: t("Dashboard.invoices"), icon: FileText, color: "bg-orange-500" },
    ];

    return (
        <div className="space-y-8 text-start">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {t("Dashboard.welcome")}
                </h1>
                <p className="text-muted-foreground text-lg font-medium">
                    {t("Dashboard.welcome_desc")}
                </p>
            </div>

            <Suspense fallback={<StatsSkeleton />}>
                <StatsSection locale={locale} />
            </Suspense>

            <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl overflow-hidden rounded-3xl">
                <CardHeader className="pb-2">
                    <CardTitle className="text-2xl font-bold">{t("Dashboard.quick_links")}</CardTitle>
                    <CardDescription>{t("Dashboard.quick_links_desc")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {quickLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="group">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start gap-4 h-auto py-5 px-6 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 rounded-2xl group-hover:scale-[1.02]"
                                >
                                    <div className={`${link.color} p-3 rounded-xl shadow-lg shadow-black/10 transition-transform group-hover:rotate-12`}>
                                        <link.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <span className="font-bold text-lg">{link.label}</span>
                                </Button>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-8 md:grid-cols-2">
                <Suspense fallback={<DashboardCardSkeleton />}>
                    <StockAlertsSection locale={locale} />
                </Suspense>
                <Suspense fallback={<DashboardCardSkeleton />}>
                    <DemandForecastSection locale={locale} />
                </Suspense>
            </div>
        </div>
    );
}

async function StatsSection({ locale }: { locale: string }) {
    const stats = await getDashboardSummary();
    const t = await getI18n(locale as Locale);

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-2xl transition-all duration-500 border-none bg-card/40 backdrop-blur-xl rounded-3xl group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{t("Dashboard.total_products")}</CardTitle>
                    <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <Package className="h-5 w-5 text-blue-500 group-hover:text-white" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-black tabular-nums">{stats.totalProducts}</div>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">{t("Dashboard.products_desc")}</p>
                </CardContent>
            </Card>
            <Card className="hover:shadow-2xl transition-all duration-500 border-none bg-card/40 backdrop-blur-xl rounded-3xl group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{t("Dashboard.total_sales")}</CardTitle>
                    <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500 group-hover:text-white transition-colors">
                        <TrendingUp className="h-5 w-5 text-purple-500 group-hover:text-white" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-black tabular-nums">{stats.totalSales}</div>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">{t("Dashboard.sales_desc")}</p>
                </CardContent>
            </Card>
            <Card className="hover:shadow-2xl transition-all duration-500 border-none bg-card/40 backdrop-blur-xl rounded-3xl group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{t("Dashboard.total_revenue")}</CardTitle>
                    <div className="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500 group-hover:text-white transition-colors">
                        <DollarSign className="h-5 w-5 text-green-500 group-hover:text-white" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-black tabular-nums">{stats.totalRevenue.toLocaleString()} {t("Common.currency")}</div>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">{t("Dashboard.revenue_desc")}</p>
                </CardContent>
            </Card>
            <Card className="hover:shadow-2xl transition-all duration-500 border-none bg-card/40 backdrop-blur-xl rounded-3xl group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{t("Dashboard.total_warehouses")}</CardTitle>
                    <div className="p-2 bg-orange-500/10 rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors">
                        <Warehouse className="h-5 w-5 text-orange-500 group-hover:text-white" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-black tabular-nums">{stats.totalWarehouses}</div>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">{t("Dashboard.warehouses_desc")}</p>
                </CardContent>
            </Card>
        </div>
    );
}

function StatsSkeleton() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-32 w-full rounded-2xl" />
            ))}
        </div>
    );
}

async function StockAlertsSection({ locale }: { locale: string }) {
    const alerts = await getInventoryAlerts();
    const t = await getI18n(locale as Locale);

    return (
        <Card className="border-red-100 dark:border-red-900/30 h-full">
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
    );
}

async function DemandForecastSection({ locale }: { locale: string }) {
    const alerts = await getInventoryAlerts();
    const t = await getI18n(locale as Locale);

    return (
        <Card className="border-blue-100 dark:border-blue-900/30 h-full">
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
    );
}

function DashboardCardSkeleton() {
    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center gap-2">
                <Skeleton className="h-5 w-5 rounded" />
                <div className="space-y-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-3 w-48" />
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
            </CardContent>
        </Card>
    );
}

