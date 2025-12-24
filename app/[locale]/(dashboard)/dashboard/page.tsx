import { getTenantContext } from "@/lib/auth";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Warehouse, ShoppingCart, FileText, TrendingUp, DollarSign, AlertTriangle, TrendingDown, Clock } from "lucide-react";
import { getDashboardSummary, getInventoryAlerts } from "@/actions/reports";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";
import { Badge } from "@/components/ui/badge";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { LowStockAlert } from "./_components/LowStockAlert";

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

            <LowStockAlert />

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

            {/* New grid structure */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <div className="md:col-span-4 space-y-6">
                    <Suspense fallback={<DashboardCardSkeleton />}>
                        <StockAlertsSection locale={locale} />
                    </Suspense>
                </div>
                <div className="md:col-span-3 space-y-6">
                    <Suspense fallback={<DashboardCardSkeleton />}>
                        <DemandForecastSection locale={locale} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

async function StatsSection({ locale }: { locale: string }) {
    const stats = await getDashboardSummary();
    const t = await getI18n(locale as Locale);

    const statItems = [
        { title: t("Dashboard.total_products"), value: stats.totalProducts, desc: t("Dashboard.products_desc"), icon: Package, color: "text-blue-500", bg: "bg-blue-500/10", glow: "shadow-blue-500/10" },
        { title: t("Dashboard.total_sales"), value: stats.totalSales, desc: t("Dashboard.sales_desc"), icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10", glow: "shadow-purple-500/10" },
        { title: t("Dashboard.total_revenue"), value: `${stats.totalRevenue.toLocaleString()} ${t("Common.currency")}`, desc: t("Dashboard.revenue_desc"), icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10", glow: "shadow-green-500/10" },
        { title: t("Dashboard.total_warehouses"), value: stats.totalWarehouses, desc: t("Dashboard.warehouses_desc"), icon: Warehouse, color: "text-orange-500", bg: "bg-orange-500/10", glow: "shadow-orange-500/10" },
    ];

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {statItems.map((item, i) => (
                <Card key={i} className={`hover:shadow-2xl transition-all duration-500 border-none bg-card/40 backdrop-blur-xl rounded-2xl group overflow-hidden relative ${item.glow}`}>
                    <div className={`absolute top-0 right-0 w-24 h-24 ${item.bg} rounded-full -mr-12 -mt-12 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{item.title}</CardTitle>
                        <div className={`p-2 ${item.bg} rounded-lg group-hover:${item.color.replace('text-', 'bg-')} group-hover:text-white transition-all duration-300 group-hover:rotate-12`}>
                            <item.icon className={`h-5 w-5 ${item.color} group-hover:text-white`} />
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-black tabular-nums group-hover:scale-105 transition-transform origin-left duration-300">{item.value}</div>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">{item.desc}</p>
                    </CardContent>
                </Card>
            ))}
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
                            <div key={f.id} className="flex items-center justify-between p-3 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-900/20 group/item hover:bg-blue-100/50 transition-colors">
                                <div>
                                    <p className="font-bold text-sm group-hover/item:text-blue-600 transition-colors">{f.name}</p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{t("Dashboard.alerts.lasts_for", { days: f.daysLeft })}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
                                        {t("Dashboard.alerts.units_per_week", { count: f.weeklySales })}
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
