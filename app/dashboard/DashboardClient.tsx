"use client";

import { motion } from "framer-motion";
import { Plus, Package, ShoppingCart, FileText, TrendingUp, TrendingDown, Users, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { useI18n } from "@/lib/i18n/context";
import { useDashboard } from "@/hooks/useDashboard";
import { formatCurrency, cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const CHART_DATA = [
    { name: 'Jan', sales: 4000, stock: 2400 },
    { name: 'Feb', sales: 3000, stock: 1398 },
    { name: 'Mar', sales: 2000, stock: 9800 },
    { name: 'Apr', sales: 2780, stock: 3908 },
    { name: 'May', sales: 1890, stock: 4800 },
    { name: 'Jun', sales: 2390, stock: 3800 },
];

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
                        <Card className="luxury-card p-6 group hover:translate-y-[-4px] transition-all duration-300 overflow-hidden relative border-none shadow-xl bg-card/40 backdrop-blur-xl rounded-[2rem]">
                             <div className={`absolute top-0 right-0 w-24 h-24 ${item.bg} blur-2xl rounded-full -mr-12 -mt-12 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity`} />
                            <div className="flex items-center gap-4">
                                <div className={`size-12 rounded-xl ${item.bg} flex items-center justify-center ${item.color} shadow-lg shadow-current/5`}>
                                    <item.icon className="h-6 w-6 stroke-[1.5]" />
                                </div>
                                <div className="space-y-0.5 text-start">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.label}</p>
                                    <div className="text-2xl font-black tracking-tighter">{item.value}</div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Charts & Activity */}
            <div className="grid gap-10 lg:grid-cols-3">
                {/* Sales Performance Chart */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2"
                >
                    <Card className="luxury-card h-full border-none shadow-3xl bg-card/60 backdrop-blur-3xl rounded-[3rem] overflow-hidden">
                        <div className="p-10 border-b border-primary/5 flex items-center justify-between">
                            <div className="space-y-1">
                                <h3 className="text-2xl font-black tracking-tight italic">{t("Dashboard.sales_overview") || "Performance Overview"}</h3>
                                <p className="text-sm text-muted-foreground font-medium">{t("Dashboard.sales_desc") || "Daily sales and stock movement tracking"}</p>
                            </div>
                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 rounded-full px-4 py-1.5 font-bold uppercase tracking-widest text-[10px]">Live</Badge>
                        </div>
                        <div className="p-10 h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={CHART_DATA}>
                                    <defs>
                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartGrid vertical={false} strokeDasharray="3 3" stroke="#88888820" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
                                        itemStyle={{ fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="sales" stroke="var(--primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <Card className="luxury-card h-full border-none shadow-3xl bg-card/60 backdrop-blur-3xl rounded-[3rem] overflow-hidden">
                        <div className="p-10 border-b border-primary/5">
                            <h3 className="text-2xl font-black tracking-tight italic">{t("Dashboard.recent_activity") || "Latest Activity"}</h3>
                        </div>
                        <div className="p-8 space-y-8">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex gap-4 group/item cursor-pointer">
                                    <div className="relative">
                                        <div className="size-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover/item:scale-110 transition-transform shadow-lg shadow-primary/5">
                                            <Package className="size-5" />
                                        </div>
                                        {i !== 4 && <div className="absolute top-10 left-1/2 -translate-x-1/2 w-px h-10 bg-primary/10" />}
                                    </div>
                                    <div className="space-y-1 pt-1 text-start">
                                        <p className="text-sm font-bold leading-none">Stock Update: #PRD-9032</p>
                                        <p className="text-xs text-muted-foreground font-medium italic">Warehouse Alpha • 2 mins ago</p>
                                    </div>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full h-12 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary/5 hover:text-primary transition-all">
                                {t("Common.view_all") || "View Full Logs"}
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}

function CartGrid({ vertical, strokeDasharray, stroke }: any) {
    return <CartesianGrid vertical={vertical} strokeDasharray={strokeDasharray} stroke={stroke} />;
}

function Badge({ children, variant, className }: any) {
    return <div className={cn("inline-flex items-center border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)}>{children}</div>;
}
