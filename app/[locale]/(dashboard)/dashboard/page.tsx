import { getTenantContext } from "@/lib/auth";
import { Link } from "@/i18n/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Warehouse, ShoppingCart, FileText, TrendingUp, DollarSign } from "lucide-react";
import { getDashboardSummary } from "@/actions/reports";
import { getTranslations } from "next-intl/server";

export default async function DashboardLandingPage() {
    await getTenantContext();
    const stats = await getDashboardSummary();
    const t = await getTranslations("Dashboard");
    const tc = await getTranslations("Common");

    const quickLinks = [
        { href: "/dashboard/products", label: t("products"), icon: Package, color: "bg-blue-500" },
        { href: "/dashboard/warehouses", label: t("warehouses"), icon: Warehouse, color: "bg-green-500" },
        { href: "/dashboard/sales", label: t("sales"), icon: ShoppingCart, color: "bg-purple-500" },
        { href: "/dashboard/invoices", label: t("invoices"), icon: FileText, color: "bg-orange-500" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t("welcome")}</h1>
                <p className="text-muted-foreground mt-2">
                    {t("welcome_desc")}
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-md transition-shadow border-t-4 border-t-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("total_products")}</CardTitle>
                        <Package className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalProducts}</div>
                        <p className="text-xs text-muted-foreground">{t("products_desc")}</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow border-t-4 border-t-purple-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("total_sales")}</CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalSales}</div>
                        <p className="text-xs text-muted-foreground">{t("sales_desc")}</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow border-t-4 border-t-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("total_revenue")}</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} {tc("currency")}</div>
                        <p className="text-xs text-muted-foreground">{t("revenue_desc")}</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow border-t-4 border-t-orange-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("total_warehouses")}</CardTitle>
                        <Warehouse className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalWarehouses}</div>
                        <p className="text-xs text-muted-foreground">{t("warehouses_desc")}</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t("quick_links")}</CardTitle>
                    <CardDescription>{t("quick_links_desc")}</CardDescription>
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

