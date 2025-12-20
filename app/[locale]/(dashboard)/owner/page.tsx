import { requireOwner } from "@/lib/auth-role";
import { getOwnerAnalytics } from "@/actions/owner/analytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Building2, CreditCard, TrendingUp, Activity, Shield, ArrowUp, ArrowDown, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { DashboardCharts } from "./DashboardCharts";
import { getTranslations } from "next-intl/server";

export default async function OwnerDashboardPage() {
    await requireOwner();
    const analytics = await getOwnerAnalytics();
    const t = await getTranslations("OwnerPanel");

    const stats = [
        {
            title: t("total_tenants"),
            value: analytics.totalTenants,
            subtitle: t("tenants_unit"),
            icon: Building2,
            gradient: "from-blue-500 to-cyan-500",
            change: "+12%",
            trend: "up"
        },
        {
            title: t("active_users"),
            value: analytics.activeUsers,
            subtitle: t("users_unit"),
            icon: Users,
            gradient: "from-purple-500 to-pink-500",
            change: "+8%",
            trend: "up"
        },
        {
            title: t("active_subscriptions"),
            value: analytics.activeSubscriptions,
            subtitle: t("subs_unit"),
            icon: CreditCard,
            gradient: "from-orange-500 to-red-500",
            change: "+23%",
            trend: "up"
        },
        {
            title: t("conversion_rate"),
            value: `${analytics.conversionRate}%`,
            subtitle: t("conversion_desc"),
            icon: TrendingUp,
            gradient: "from-green-500 to-emerald-500",
            change: "+5%",
            trend: "up"
        },
    ];

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
                            <Shield className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
                            <p className="text-muted-foreground">{t("subtitle")}</p>
                        </div>
                    </div>
                </div>
                <Button asChild className="gap-2">
                    <Link href="/owner/promo-codes">
                        <Sparkles className="h-4 w-4" />
                        {t("promo_codes")}
                    </Link>
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    const TrendIcon = stat.trend === "up" ? ArrowUp : ArrowDown;

                    return (
                        <Card
                            key={idx}
                            className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            {/* Gradient Background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />

                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                                    <Icon className="h-5 w-5 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                                    <Badge
                                        variant="secondary"
                                        className={`gap-1 ${stat.trend === "up" ? "text-green-600 bg-green-50 dark:bg-green-950" : "text-red-600 bg-red-50 dark:bg-red-950"
                                            }`}
                                    >
                                        <TrendIcon className="h-3 w-3" />
                                        {stat.change}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Charts Section */}
            <DashboardCharts />

            {/* Additional Info Cards */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Top Actions */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-primary" />
                            {t("top_actions")}
                        </CardTitle>
                        <CardDescription>{t("top_actions_desc")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {analytics.topActions.map((stat, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-3 rounded-lg border hover:border-primary/50 hover:bg-accent/50 transition-all duration-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                                            {idx + 1}
                                        </div>
                                        <span className="font-medium">{stat.action}</span>
                                    </div>
                                    <Badge variant="secondary" className="text-base">
                                        {stat._count.action}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Plan Distribution */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>{t("plan_distribution")}</CardTitle>
                        <CardDescription>{t("plan_dist_desc")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {analytics.planDistribution.map((dist, idx) => {
                                const colors = {
                                    FREE: "from-gray-500 to-gray-600",
                                    PRO: "from-blue-500 to-blue-600",
                                    BUSINESS: "from-purple-500 to-purple-600",
                                };

                                return (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Badge
                                                className={`bg-gradient-to-r ${colors[dist.plan as keyof typeof colors]} text-white border-none`}
                                            >
                                                {dist.plan}
                                            </Badge>
                                            <span className="text-2xl font-bold">{dist._count.plan}</span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className={`h-full bg-gradient-to-r ${colors[dist.plan as keyof typeof colors]} rounded-full transition-all duration-1000`}
                                                style={{
                                                    width: `${(dist._count.plan / analytics.totalTenants) * 100}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

