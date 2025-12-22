import { getPlatformResourceUsage } from "@/actions/admin/analytics";
import { requireOwner } from "@/lib/auth-role";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";
import {
    Zap,
    HardDrive,
    Users,
    Warehouse,
    TrendingUp,
    AlertTriangle,
    ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

export default async function AdminUsagePage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    await requireOwner();
    const t = await getI18n(locale as Locale);
    const usage = await getPlatformResourceUsage();

    return (
        <div className="space-y-8 p-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
                        <Zap className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        تتبع الموارد
                    </h1>
                </div>
                <p className="text-muted-foreground text-lg ml-1">
                    مراقبة استهلاك الموارد واكتشاف المؤسسات الأكثر استهلاكاً للمنصة.
                </p>
            </div>

            {/* Averages Section */}
            <div className="grid gap-6 md:grid-cols-3">
                {usage.planStats.map((plan) => (
                    <Card key={plan.name} className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl">
                        <CardHeader className="pb-2">
                            <Badge variant="outline" className="w-fit mb-2">{plan.name}</Badge>
                            <CardTitle className="text-3xl font-black">{plan.totalTenants}</CardTitle>
                            <CardDescription>إجمالي المؤسسات</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 pt-4 border-t">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">متوسط المنتجات</span>
                                    <span className="font-bold">{plan.avgProducts}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">متوسط المستخدمين</span>
                                    <span className="font-bold">{plan.avgUsers}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Top by Products */}
                <Card className="border-none shadow-xl shadow-primary/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HardDrive className="h-5 w-5 text-primary" />
                            الأكثر استهلاكاً للمخزون
                        </CardTitle>
                        <CardDescription>أفضل 5 مؤسسات من حيث عدد المنتجات المسجلة</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {usage.topByProducts.map((tenant: any) => (
                                <div key={tenant.id} className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <div className="flex flex-col">
                                            <span className="font-bold">{tenant.name}</span>
                                            <span className="text-xs text-muted-foreground">{tenant.slug}</span>
                                        </div>
                                        <Badge>{tenant._count.products} منتج</Badge>
                                    </div>
                                    <Progress value={Math.min((tenant._count.products / 1500) * 100, 100)} className="h-2 rounded-full" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top by Users */}
                <Card className="border-none shadow-xl shadow-primary/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-accent" />
                            الأكثر استهلاكاً للمستخدمين
                        </CardTitle>
                        <CardDescription>أفضل 5 مؤسسات من حيث عدد حسابات الفريق</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {usage.topByUsers.map((tenant: any) => (
                                <div key={tenant.id} className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <div className="flex flex-col">
                                            <span className="font-bold">{tenant.name}</span>
                                            <span className="text-xs text-muted-foreground">{tenant.slug}</span>
                                        </div>
                                        <Badge variant="secondary">{tenant._count.users} مستخدم</Badge>
                                    </div>
                                    <Progress value={Math.min((tenant._count.users / 50) * 100, 100)} className="h-2 rounded-full" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
