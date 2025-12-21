import { requireOwner } from "@/lib/auth-role";
import { getOwnerAnalytics } from "@/actions/owner/analytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Building2, CreditCard, TrendingUp, Activity, Shield, ArrowUp, ArrowDown, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LocaleLink } from "@/components/ui/LocaleLink";
import { DashboardCharts } from "./DashboardCharts";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";

export default async function OwnerDashboardPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    await requireOwner();
    const analytics = await getOwnerAnalytics();
    const t = await getI18n(locale as Locale);

    const stats = [
        {
            title: t("OwnerPanel.total_tenants"),
            value: analytics.totalTenants,
            subtitle: t("OwnerPanel.tenants_unit"),
            icon: Building2,
            gradient: "from-blue-500 to-cyan-500",
            change: "+12%",
            trend: "up"
        },
        {
            title: t("OwnerPanel.active_users"),
            value: analytics.activeUsers,
            subtitle: t("OwnerPanel.users_unit"),
            icon: Users,
            gradient: "from-purple-500 to-pink-500",
            change: "+8%",
            trend: "up"
        },
        {
            title: t("OwnerPanel.active_subscriptions"),
            value: analytics.activeSubscriptions,
            subtitle: t("OwnerPanel.subs_unit"),
            icon: CreditCard,
            gradient: "from-orange-500 to-red-500",
            change: "+23%",
            trend: "up"
        },
        {
            title: t("OwnerPanel.conversion_rate"),
            value: `${analytics.conversionRate}%`,
            subtitle: t("OwnerPanel.conversion_desc"),
            icon: TrendingUp,
            gradient: "from-green-500 to-emerald-500",
            change: "+5%",
            trend: "up"
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center md:text-start">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 backdrop-blur-md border border-primary/10 shadow-xl">
                            <Shield className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                {t("OwnerPanel.title")}
                            </h1>
                            <p className="text-muted-foreground text-lg">{t("OwnerPanel.subtitle")}</p>
                        </div>
                    </div>
                </div>
                <Button asChild size="lg" className="gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all rounded-full px-6">
                    <LocaleLink href="/owner/promo-codes">
                        <Sparkles className="h-4 w-4" />
                        {t("OwnerPanel.promo_codes")}
                    </LocaleLink>
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
                            className="relative overflow-hidden border-none bg-background/60 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group ring-1 ring-border/50"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            {/* Gradient Background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500`} />

                            {/* Decorative Circle */}
                            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${stat.gradient} opacity-[0.1] blur-2xl group-hover:opacity-[0.2] transition-opacity duration-500`} />

                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg ring-1 ring-black/5`}>
                                    <Icon className="h-5 w-5 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="text-4xl font-black mb-2 tracking-tight">{stat.value}</div>
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.subtitle}</p>
                                    <Badge
                                        variant="secondary"
                                        className={`gap-1 px-2 py-0.5 text-xs font-semibold backdrop-blur-sm border-0 ${stat.trend === "up"
                                            ? "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400 dark:bg-emerald-500/20"
                                            : "text-rose-600 bg-rose-500/10 dark:text-rose-400 dark:bg-rose-500/20"
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
            <div className="rounded-[2rem] border border-border/50 bg-background/50 backdrop-blur-xl shadow-2xl overflow-hidden p-1">
                <DashboardCharts />
            </div>

            {/* Additional Info Cards */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Top Actions */}
                <Card className="shadow-xl bg-background/60 backdrop-blur-xl border-border/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Activity className="h-5 w-5 text-primary" />
                            {t("OwnerPanel.top_actions")}
                        </CardTitle>
                        <CardDescription>{t("OwnerPanel.top_actions_desc")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {analytics.topActions.map((stat, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-accent/50 hover:border-primary/20 transition-all duration-300 group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary ring-4 ring-primary/5 group-hover:ring-primary/20 transition-all">
                                            {idx + 1}
                                        </div>
                                        <span className="font-semibold text-foreground/90">{stat.action}</span>
                                    </div>
                                    <Badge variant="outline" className="text-base font-mono bg-background/50">
                                        {stat._count.action}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Plan Distribution */}
                <Card className="shadow-xl bg-background/60 backdrop-blur-xl border-border/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Users className="h-5 w-5 text-purple-500" />
                            {t("OwnerPanel.plan_distribution")}
                        </CardTitle>
                        <CardDescription>{t("OwnerPanel.plan_dist_desc")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {analytics.planDistribution.map((dist, idx) => {
                                const colors = {
                                    FREE: "from-slate-500 to-slate-600 shadow-slate-500/25",
                                    PRO: "from-blue-500 to-indigo-600 shadow-blue-500/25",
                                    BUSINESS: "from-purple-500 to-pink-600 shadow-purple-500/25",
                                };

                                return (
                                    <div key={idx} className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <Badge
                                                className={`bg-gradient-to-r ${colors[dist.plan as keyof typeof colors]} text-white border-none px-3 py-1`}
                                            >
                                                {dist.plan}
                                            </Badge>
                                            <span className="text-2xl font-black text-foreground/80">{dist._count.plan}</span>
                                        </div>
                                        <div className="h-3 bg-muted/50 rounded-full overflow-hidden p-0.5 backdrop-blur-sm">
                                            <div
                                                className={`h-full bg-gradient-to-r ${colors[dist.plan as keyof typeof colors]} rounded-full transition-all duration-1000 shadow-sm`}
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
