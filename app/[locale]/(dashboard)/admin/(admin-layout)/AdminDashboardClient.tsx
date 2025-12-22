"use client";

import { motion } from "framer-motion";
import {
    Users,
    Building2,
    CreditCard,
    TrendingUp,
    Activity,
    ArrowUpRight,
    LayoutDashboard,
    PieChart as PieChartIcon,
    Shield
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/context";
import DashboardChartsClient from "./DashboardChartsClient";
import { Badge } from "@/components/ui/badge";

interface AdminDashboardClientProps {
    analytics: {
        totalTenants: number;
        activeUsers: number;
        activeSubscriptions: number;
        totalRevenue: number;
        conversionRate: number;
        topActions: any[];
        planDistribution: any[];
    };
    chartData: {
        revenueData: any[];
        userGrowthData: any[];
    };
    locale: string;
}

export default function AdminDashboardClient({ analytics, chartData }: AdminDashboardClientProps) {
    const { t } = useI18n();

    const stats = [
        {
            title: t("Admin.total_tenants"),
            value: analytics.totalTenants,
            icon: Building2,
            color: "from-blue-500 to-cyan-500",
            description: t("Admin.tenants_desc")
        },
        {
            title: t("Admin.active_users"),
            value: analytics.activeUsers,
            icon: Users,
            color: "from-purple-500 to-pink-500",
            description: t("Admin.users_desc")
        },
        {
            title: t("Admin.total_revenue"),
            value: `${analytics.totalRevenue.toLocaleString()} ${t("Common.currency")}`,
            icon: TrendingUp,
            color: "from-emerald-500 to-teal-500",
            description: t("Admin.revenue_desc")
        },
        {
            title: t("Admin.conversion_rate"),
            value: `${analytics.conversionRate}%`,
            icon: ArrowUpRight,
            color: "from-orange-500 to-amber-500",
            description: t("Admin.conversion_desc")
        }
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="flex flex-col gap-8 p-6 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
                        <Shield className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {t("Admin.welcome")}
                    </h1>
                </div>
                <p className="text-muted-foreground text-lg ml-1">
                    {t("Admin.overview_desc")}
                </p>
            </div>

            {/* Stats Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            >
                {stats.map((stat, idx) => (
                    <motion.div key={idx} variants={item}>
                        <Card className="relative overflow-hidden border-none shadow-xl shadow-primary/5 group hover:scale-[1.02] transition-transform duration-300">
                            {/* Decorative background gradient */}
                            <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full bg-gradient-to-br ${stat.color} opacity-10 group-hover:scale-150 transition-transform duration-700`} />

                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative">
                                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg shadow-primary/10`}>
                                    <stat.icon className="h-4 w-4 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent className="relative">
                                <div className="text-3xl font-black tracking-tight mb-1">{stat.value}</div>
                                <p className="text-xs text-muted-foreground font-medium">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Charts Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-bold">{t("Admin.performance_charts")}</h2>
                    </div>
                    <DashboardChartsClient
                        revenueData={chartData.revenueData}
                        userGrowthData={chartData.userGrowthData}
                        revenueLabel={t("Admin.total_revenue")}
                        usersLabel={t("Admin.tenants_unit")}
                    />
                </div>

                {/* Right Column: Top Actions & Plan Distribution */}
                <div className="space-y-6">
                    {/* Top Actions */}
                    <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <LayoutDashboard className="h-5 w-5 text-primary" />
                                {t("Admin.top_actions")}
                            </CardTitle>
                            <CardDescription>{t("Admin.most_frequent_tasks")}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {analytics.topActions.map((action, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-primary/5 hover:border-primary/20 transition-colors">
                                        <span className="text-sm font-bold truncate max-w-[150px]">{action.action}</span>
                                        <Badge variant="secondary" className="font-mono bg-primary/10 text-primary border-none">
                                            {action._count.action}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Plan Distribution */}
                    <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <PieChartIcon className="h-5 w-5 text-primary" />
                                {t("Admin.plan_distribution")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {analytics.planDistribution.map((plan, i) => (
                                    <div key={i} className="space-y-1">
                                        <div className="flex justify-between text-sm font-bold">
                                            <span>{plan.plan}</span>
                                            <span>{plan._count.plan}</span>
                                        </div>
                                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(plan._count.plan / analytics.totalTenants) * 100}%` }}
                                                transition={{ duration: 1, delay: i * 0.1 }}
                                                className={`h-full bg-gradient-to-r ${plan.plan === 'PRO' ? 'from-purple-500 to-pink-500' :
                                                    plan.plan === 'ENTERPRISE' ? 'from-emerald-500 to-teal-500' :
                                                        'from-blue-500 to-cyan-500'
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
