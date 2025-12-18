import { getTenantContext } from "@/lib/auth";
import { Link } from "@/i18n/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Warehouse, ShoppingCart, FileText, TrendingUp, DollarSign } from "lucide-react";

export default async function DashboardLandingPage() {
    await getTenantContext();

    const quickLinks = [
        { href: "/dashboard/products", label: "المنتجات", icon: Package, color: "bg-blue-500" },
        { href: "/dashboard/warehouses", label: "المخازن", icon: Warehouse, color: "bg-green-500" },
        { href: "/dashboard/sales", label: "المبيعات", icon: ShoppingCart, color: "bg-purple-500" },
        { href: "/dashboard/invoices", label: "الفواتير", icon: FileText, color: "bg-orange-500" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">مرحباً بك في مخزنكو</h1>
                <p className="text-muted-foreground mt-2">
                    نظام إدارة شامل للمخازن والمحاسبة والمبيعات
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">إجمالي المنتجات</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">-</div>
                        <p className="text-xs text-muted-foreground">سيتم تحديثها قريباً</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">المبيعات</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">-</div>
                        <p className="text-xs text-muted-foreground">سيتم تحديثها قريباً</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">الإيرادات</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">-</div>
                        <p className="text-xs text-muted-foreground">سيتم تحديثها قريباً</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">المخازن</CardTitle>
                        <Warehouse className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">-</div>
                        <p className="text-xs text-muted-foreground">سيتم تحديثها قريباً</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>روابط سريعة</CardTitle>
                    <CardDescription>الوصول السريع إلى الأقسام الرئيسية</CardDescription>
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
