"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useI18n } from "@/lib/i18n/context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getDashboardChartData } from "@/actions/reports";

export function Overview({ locale }: { locale: string }) {
    const { t } = useI18n();
    const [data, setData] = useState<{ name: string; value: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDashboardChartData().then(res => {
            setData(res.revenueData);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="h-[350px] w-full animate-pulse bg-muted/20 rounded-xl" />;

    return (
        <Card className="col-span-full lg:col-span-7 border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl rounded-3xl">
            <CardHeader>
                <CardTitle>{t("Charts.monthly_revenue")}</CardTitle>
                <CardDescription>{t("Charts.revenue_overview")}</CardDescription>
            </CardHeader>
            <CardContent className="pl-0 md:pl-2">
                <ResponsiveContainer width="100%" height={300} className="md:h-[350px]">
                    <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                            cursor={{ fill: 'transparent' }}
                        />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                        <Bar
                            dataKey="value"
                            fill="currentColor"
                            radius={[4, 4, 0, 0]}
                            className="fill-primary"
                            barSize={30}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
