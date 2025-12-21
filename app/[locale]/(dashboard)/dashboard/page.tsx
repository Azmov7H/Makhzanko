import { getTenantContext } from "@/lib/auth";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Warehouse, ShoppingCart, FileText, TrendingUp, DollarSign } from "lucide-react";
import { getDashboardSummary } from "@/actions/reports";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";

export default async function DashboardLandingPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    await getTenantContext();
    const stats = await getDashboardSummary();
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
        </div>
    );
}
