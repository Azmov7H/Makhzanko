"use client";

import { motion } from "framer-motion";
import { Plus, Package, ShoppingCart, FileText, TrendingUp, TrendingDown, Users, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { useI18n } from "@/lib/i18n/context";
import { useDashboard } from "@/hooks/useDashboard";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardClient() {
    const { t } = useI18n();
    const { stats, loading } = useDashboard();

    const quickLinks = [
        { href: `/dashboard/sales-flow/sales/new`, label: t("Sales.new_sale"), icon: Plus, color: "text-primary", border: "border-primary/20", bg: "bg-primary/5" },
        { href: `/dashboard/inventory/products`, label: t("Dashboard.products"), icon: Package, color: "text-secondary", border: "border-secondary/20", bg: "bg-secondary/5" },
        { href: `/dashboard/sales-flow/sales`, label: t("Dashboard.sales"), icon: ShoppingCart, color: "text-primary", border: "border-primary/20", bg: "bg-primary/5" },
        { href: `/dashboard/reports`, label: t("Dashboard.reports"), icon: FileText, color: "text-secondary", border: "border-secondary/20", bg: "bg-secondary/5" },
    ];

    if (loading) {
        return (
            <div className="space-y-12">
                <div className="flex flex-col lg:flex-row justify-between gap-10">
                    <div className="space-y-4">
                        <Skeleton className="h-16 w-96 rounded-2xl" />
                        <Skeleton className="h-6 w-[30rem] rounded-lg opacity-50" />
                    </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-32 rounded-[2rem]" />
                    ))}
                </div>
            </div>
        );
    }

    const statItems = [
        { 
            label: t("Dashboard.total_sales"), 
            value: formatCurrency(Number(stats?.total_sales || 0)), 
            icon: TrendingUp, 
            color: "text-primary", 
            bg: "bg-primary/5" 
        },
        { 
            label: t("Dashboard.total_purchases"), 
            value: formatCurrency(Number(stats?.total_purchases || 0)), 
            icon: TrendingDown, 
            color: "text-secondary", 
            bg: "bg-secondary/5" 
        },
        { 
            label: t("Dashboard.expenses"), 
            value: formatCurrency(Number(stats?.total_expenses || 0)), 
            icon: Wallet, 
            color: "text-destructive", 
            bg: "bg-destructive/5" 
        },
        { 
            label: t("Dashboard.new_customers"), 
            value: stats?.new_customers || 0, 
            icon: Users, 
            color: "text-blue-500", 
            bg: "bg-blue-500/5" 
        },
    ];

    return (
        <div className="space-y-12 text-start">
            {/* Minimalist Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground" style={{ fontFamily: "var(--font-amiri), serif" }}>
                        {t("Dashboard.welcome")}
                    </h1>
                    <p className="text-muted-foreground font-medium text-lg md:text-xl max-w-2xl leading-relaxed">
                        {t("Dashboard.welcome_desc")}
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    {quickLinks.map((link) => (
                        <Link key={link.href} href={link.href} className="flex-1 sm:flex-none">
                            <Button
                                variant="outline"
                                className={`w-full group gap-2 h-12 px-6 rounded-lg border ${link.border} ${link.bg} hover:bg-background transition-all duration-300 shadow-sm`}
                            >
                                <link.icon className={`h-4 w-4 ${link.color} transition-transform group-hover:scale-110`} />
                                <span className="font-bold text-xs uppercase tracking-widest whitespace-nowrap">{link.label}</span>
                            </Button>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {statItems.map((item, i) => (
                    <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="luxury-card p-6 group hover:translate-y-[-4px] transition-all duration-300 overflow-hidden relative">
                             <div className={`absolute top-0 right-0 w-24 h-24 ${item.bg} blur-2xl rounded-full -mr-12 -mt-12 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity`} />
                            <div className="flex items-center gap-4">
                                <div className={`size-12 rounded-xl ${item.bg} flex items-center justify-center ${item.color}`}>
                                    <item.icon className="h-6 w-6 stroke-[1.5]" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.label}</p>
                                    <div className="text-2xl font-black tracking-tighter">{item.value}</div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
