"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/context";

// Data interfaces
interface RevenueData {
    name: string;
    value: number;
}

interface UserGrowthData {
    name: string;
    users: number;
}

interface ChartsContentProps {
    revenueData: RevenueData[];
    userGrowthData: UserGrowthData[];
    revenueLabel?: string;
    usersLabel?: string;
}

export default function ChartsContent({
    revenueData,
    userGrowthData,
    revenueLabel,
    usersLabel
}: ChartsContentProps) {
    const { t } = useI18n();

    const rLabel = revenueLabel || t("Charts.revenue_label");
    const uLabel = usersLabel || t("Charts.users_label");

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                    <CardTitle>{t("Charts.monthly_revenue")}</CardTitle>
                    <CardDescription>{t("Charts.revenue_overview")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) => `${value} ${t("Common.currency")}`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    formatter={(value: any) => [`${value || 0} ${t("Common.currency")}`, rLabel]}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#8884d8"
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                    <CardTitle>{t("Charts.user_growth")}</CardTitle>
                    <CardDescription>{t("Charts.new_users_monthly")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={userGrowthData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    formatter={(value: any) => [value || 0, uLabel]}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="users"
                                    stroke="#82ca9d"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: "#82ca9d" }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
