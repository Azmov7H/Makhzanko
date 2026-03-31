"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Package, Warehouse } from "lucide-react";

interface StatsSectionProps {
    stats: {
        totalSales: number;
        totalRevenue: number;
        totalProducts: number;
        totalWarehouses: number;
    };
    t: any;
}

export function StatsSection({ stats, t }: StatsSectionProps) {
    const statItems = [
        { title: t("Dashboard.total_sales"), value: stats.totalSales, icon: TrendingUp, color: "text-primary" },
        { title: t("Dashboard.total_revenue"), value: `${stats.totalRevenue.toLocaleString()} ${t("Common.currency")}`, icon: DollarSign, color: "text-secondary" },
        { title: t("Dashboard.total_products"), value: stats.totalProducts, icon: Package, color: "text-primary" },
        { title: t("Dashboard.total_warehouses"), value: stats.totalWarehouses, icon: Warehouse, color: "text-secondary" },
    ];

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {statItems.map((item, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                    <Card className="luxury-card p-6 border-none shadow-sm hover:translate-y-[-4px] transition-all">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-lg bg-accent flex items-center justify-center">
                                <item.icon className={`h-6 w-6 ${item.color} stroke-[1.5]`} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{item.title}</p>
                                <div className="text-2xl font-black tabular-nums tracking-tighter text-foreground">{item.value}</div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
