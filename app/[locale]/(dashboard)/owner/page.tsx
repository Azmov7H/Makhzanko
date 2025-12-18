import { requireOwner } from "@/lib/auth-role";
import { getOwnerAnalytics } from "@/actions/owner/analytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Building2, CreditCard, DollarSign, TrendingUp, Activity, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function OwnerDashboardPage() {
    await requireOwner();
    const analytics = await getOwnerAnalytics();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <Shield className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold tracking-tight">لوحة المالك</h1>
                    </div>
                    <p className="text-muted-foreground mt-2">نظرة عامة على منصة SaaS الخاصة بك</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">إجمالي العملاء</CardTitle>
                        <Building2 className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{analytics.totalTenants}</div>
                        <p className="text-xs text-muted-foreground mt-1">منظمة نشطة</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">المستخدمون النشطون</CardTitle>
                        <Users className="h-5 w-5 text-accent" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{analytics.activeUsers}</div>
                        <p className="text-xs text-muted-foreground mt-1">نشط حالياً</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">الاشتراكات</CardTitle>
                        <CreditCard className="h-5 w-5 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{analytics.activeSubscriptions}</div>
                        <p className="text-xs text-muted-foreground mt-1">اشتراك نشط</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
                        <DollarSign className="h-5 w-5 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{analytics.totalRevenue.toFixed(2)} ر.س</div>
                        <p className="text-xs text-muted-foreground mt-1">إيرادات كل الوقت</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            معدل التحويل
                        </CardTitle>
                        <CardDescription>من التجربة إلى الاشتراك المدفوع</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-primary">{analytics.conversionRate}%</div>
                        <p className="text-sm text-muted-foreground mt-2">
                            {analytics.activeSubscriptions} تحويل من التجارب
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-accent" />
                            أكثر الإجراءات استخداماً
                        </CardTitle>
                        <CardDescription>الإجراءات الأكثر تنفيذاً</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {analytics.topActions.map((stat, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors">
                                    <span className="text-sm font-medium">{stat.action}</span>
                                    <Badge variant="secondary">{stat._count.action}</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle>توزيع الخطط</CardTitle>
                    <CardDescription>توزيع العملاء حسب الخطط</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {analytics.planDistribution.map((dist, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors">
                                <div className="flex items-center gap-3">
                                    <Badge variant="outline" className="font-semibold">
                                        {dist.plan}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">خطة</span>
                                </div>
                                <span className="text-lg font-bold">{dist._count.plan}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
    </div>
  );
}

