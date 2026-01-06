import { getTenantContext } from "@/lib/auth";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Warehouse, ShoppingCart, FileText, TrendingUp, DollarSign, AlertTriangle, TrendingDown, Clock, Plus, Sparkles, ExternalLink } from "lucide-react";
import { getDashboardSummary, getInventoryAlerts } from "@/actions/reports";
import { prisma } from "@/lib/prisma";
import { getI18n, getLocale } from "@/lib/i18n/server";
import { Badge } from "@/components/ui/badge";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { LowStockAlert } from "./_components/LowStockAlert";
import { Overview } from "./_components/Overview";
import { RecentSales } from "./_components/RecentSales";

export default async function DashboardLandingPage() {
    const locale = await getLocale();
    await getTenantContext();
    const t = await getI18n(locale);

    const quickLinks = [
        { href: `/dashboard/sales-flow/sales/new`, label: t("Sales.new_sale"), icon: Plus, color: "bg-primary text-primary-foreground", border: "border-primary/20" },
        { href: `/dashboard/inventory/products`, label: t("Dashboard.products"), icon: Package, color: "bg-blue-500/10 text-blue-600", border: "border-blue-200 dark:border-blue-900" },
        { href: `/dashboard/sales-flow/sales`, label: t("Dashboard.sales"), icon: ShoppingCart, color: "bg-purple-500/10 text-purple-600", border: "border-purple-200 dark:border-purple-900" },
        { href: `/dashboard/reports`, label: t("Dashboard.reports"), icon: FileText, color: "bg-orange-500/10 text-orange-600", border: "border-orange-200 dark:border-orange-900" },
    ];

    return (
        <div className="space-y-8 text-start px-4 md:px-0">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight text-foreground">
                        {t("Dashboard.welcome")}
                    </h1>
                    <p className="text-muted-foreground font-medium">
                        {t("Dashboard.welcome_desc")}
                    </p>
                </div>
                <div className="flex gap-2">
                    {quickLinks.map((link) => (
                        <Link key={link.href} href={link.href}>
                            <Button
                                variant="outline"
                                className={`gap-2 h-10 px-4 rounded-xl border ${link.border} bg-background/50 backdrop-blur-sm hover:translate-y-[-2px] transition-all duration-300 shadow-sm`}
                            >
                                <link.icon className={`h-4 w-4 ${link.color.split(" ")[1]}`} />
                                <span className="font-bold text-xs uppercase tracking-wider">{link.label}</span>
                            </Button>
                        </Link>
                    ))}
                </div>
            </div>

            <Suspense fallback={<Skeleton className="h-24 w-full rounded-3xl" />}>
                <AnnouncementSection locale={locale as "en" | "ar"} />
            </Suspense>

            <Suspense fallback={<StatsSkeleton />}>
                <StatsSection locale={locale as "en" | "ar"} />
            </Suspense>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12">
                <Overview locale={locale} />
                <RecentSales locale={locale} />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12">
                <div className="col-span-full lg:col-span-7 space-y-6">
                    <LowStockAlert />
                </div>
                <div className="col-span-full lg:col-span-5 space-y-6">
                    <Suspense fallback={<DashboardCardSkeleton />}>
                        <DemandForecastSection locale={locale as "en" | "ar"} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

async function StatsSection({ locale }: { locale: any }) {
    const stats = await getDashboardSummary();
    const t = await getI18n(locale);

    const statItems = [
        { title: t("Dashboard.total_sales"), value: stats.totalSales, desc: t("Dashboard.sales_desc"), icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10", glow: "shadow-purple-500/10" },
        { title: t("Dashboard.total_revenue"), value: `${stats.totalRevenue.toLocaleString()} ${t("Common.currency")}`, desc: t("Dashboard.revenue_desc"), icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10", glow: "shadow-green-500/10" },
        { title: t("Dashboard.total_products"), value: stats.totalProducts, desc: t("Dashboard.products_desc"), icon: Package, color: "text-blue-500", bg: "bg-blue-500/10", glow: "shadow-blue-500/10" },
        { title: t("Dashboard.total_warehouses"), value: stats.totalWarehouses, desc: t("Dashboard.warehouses_desc"), icon: Warehouse, color: "text-orange-500", bg: "bg-orange-500/10", glow: "shadow-orange-500/10" },
    ];

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {statItems.map((item, i) => (
                <Card key={i} className={`hover:shadow-2xl transition-all duration-500 border-none bg-card/50 backdrop-blur-xl rounded-3xl group overflow-hidden relative ${item.glow}`}>
                    <div className={`absolute top-0 right-0 w-32 h-32 ${item.bg} rounded-full -mr-10 -mt-10 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{item.title}</CardTitle>
                        <div className={`p-2.5 ${item.bg} rounded-xl group-hover:${item.color.replace('text-', 'bg-')} group-hover:text-white transition-all duration-300 group-hover:rotate-6`}>
                            <item.icon className={`h-5 w-5 ${item.color} group-hover:text-white transition-colors`} />
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-black tabular-nums tracking-tight group-hover:scale-105 transition-transform origin-left duration-300">{item.value}</div>
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
                <Skeleton key={i} className="h-32 w-full rounded-3xl" />
            ))}
        </div>
    );
}

async function DemandForecastSection({ locale }: { locale: any }) {
    const alerts = await getInventoryAlerts();
    const t = await getI18n(locale);

    return (
        <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl rounded-3xl h-full">
            <CardHeader className="flex flex-row items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-xl">
                    <TrendingDown className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                    <CardTitle className="text-lg font-bold">{t("Dashboard.alerts.forecast_title")}</CardTitle>
                    <CardDescription>{t("Dashboard.alerts.forecast_desc")}</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {alerts.forecasts.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-8 text-center bg-muted/20 rounded-2xl border border-dashed border-muted">
                            {t("Dashboard.alerts.no_forecasts")}
                        </p>
                    ) : (
                        alerts.forecasts.map(f => (
                            <div key={f.id} className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-border/50 group/item hover:bg-muted/50 transition-colors">
                                <div>
                                    <p className="font-bold text-sm group-hover/item:text-primary transition-colors">{f.name}</p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{t("Dashboard.alerts.lasts_for", { days: f.daysLeft })}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-primary">
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

async function AnnouncementSection({ locale }: { locale: any }) {
    const t = await getI18n(locale);
    const announcement = await prisma.announcement.findFirst({
        where: {
            isActive: true,
            OR: [
                { expiresAt: null },
                { expiresAt: { gt: new Date() } }
            ]
        },
        orderBy: { createdAt: 'desc' }
    });

    if (!announcement) return null;

    return (
        <Card className="border-none shadow-2xl shadow-primary/10 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-700 rounded-[2.5rem] overflow-hidden group">
            <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="h-16 w-16 rounded-[1.5rem] bg-primary text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500 shrink-0">
                        <Sparkles className="h-8 w-8 animate-pulse" />
                    </div>
                    <div className="space-y-2 flex-grow">
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="rounded-xl px-4 py-1 border-primary/20 bg-primary/10 text-primary font-black tracking-widest text-[10px] uppercase">
                                {t("Common.new") || "NEW UPDATE"}
                            </Badge>
                            <h3 className="text-xl font-black italic tracking-tight">{announcement.title}</h3>
                        </div>
                        <p className="text-muted-foreground font-medium text-lg min-w-0">{announcement.content}</p>
                    </div>
                    {announcement.link && (
                        <Link href={announcement.link}>
                            <Button className="h-14 px-10 rounded-[1.5rem] font-black group-hover:shadow-2xl transition-all duration-500 whitespace-nowrap">
                                {announcement.linkText || t("Common.learn_more") || "Learn More"}
                                <ExternalLink className="h-5 w-5 ml-2 group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

const statsSkeleton = StatsSkeleton; // Reuse or keep as is

function DashboardCardSkeleton() {
    return (
        <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl rounded-3xl h-[400px]">
            <CardHeader className="flex flex-row items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-16 w-full rounded-2xl" />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
