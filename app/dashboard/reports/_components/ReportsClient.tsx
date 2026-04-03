"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Package, Download, Calendar, FileText, PieChart as PieChartIcon, LineChart as LineChartIcon, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import { formatCurrency, cn } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Badge } from "@/components/ui/badge";
import { downloadCSV } from "@/lib/utils/export";

interface ReportsClientProps {
    sales: any[];
    valuation: { totalValue: number; totalItems: number };
    bestSellers: any[];
    chartData: any;
}

export function ReportsClient({ sales, valuation, bestSellers, chartData }: ReportsClientProps) {
    const { t } = useI18n();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const totalSales = sales.reduce((sum: number, s: any) => sum + Number(s.total), 0);
    const averageOrderValue = sales.length > 0 ? totalSales / sales.length : 0;

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            className="max-w-7xl mx-auto py-12 px-4 space-y-12 text-start"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 text-start">
                <motion.div variants={item} className="relative">
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-primary/20 rounded-full blur-sm" />
                    <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent italic">
                        {t("Reports.title")}
                    </h1>
                    <p className="text-muted-foreground mt-3 text-lg font-medium max-w-2xl">
                        {t("Reports.description")}
                    </p>
                </motion.div>
                <div className="flex gap-4">
                    <Button variant="outline" className="rounded-2xl h-12 border-primary/10 hover:bg-primary/5 font-black uppercase tracking-widest text-xs gap-2">
                        <Download className="h-4 w-4" />
                        {t("Reports.export_pdf")}
                    </Button>
                    <Button 
                        variant="outline" 
                        onClick={() => downloadCSV(sales, "Makhzanko_Sales_Report")}
                        className="rounded-2xl h-12 border-primary/10 hover:bg-primary/5 font-black uppercase tracking-widest text-xs gap-2"
                    >
                        <FileText className="h-4 w-4" />
                        {t("Reports.export_csv")}
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-none shadow-xl bg-card/40 backdrop-blur-xl rounded-[2rem]">
                    <CardHeader className="p-6 pb-2">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">{t("Reports.total_revenue_30d")}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="text-3xl font-black text-primary tracking-tighter">{formatCurrency(totalSales)}</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-xl bg-card/40 backdrop-blur-xl rounded-[2rem]">
                    <CardHeader className="p-6 pb-2">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">{t("Reports.avg_order_value")}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="text-3xl font-black text-primary tracking-tighter">{formatCurrency(averageOrderValue)}</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-xl bg-card/40 backdrop-blur-xl rounded-[2rem]">
                    <CardHeader className="p-6 pb-2">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">{t("Reports.inventory_value")}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="text-3xl font-black text-primary tracking-tighter">{formatCurrency(valuation.totalValue)}</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-xl bg-card/40 backdrop-blur-xl rounded-[2rem]">
                    <CardHeader className="p-6 pb-2">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">{t("Reports.items_in_stock")}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="text-3xl font-black text-primary tracking-tighter">{valuation.totalItems}</div>
                    </CardContent>
                </Card>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Chart */}
                <motion.div variants={item} className="lg:col-span-2">
                    <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-3xl rounded-[3rem] overflow-hidden">
                        <CardHeader className="p-10 border-b border-primary/5 bg-primary/5">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-primary/10 rounded-2xl text-primary shadow-xl shadow-primary/5">
                                    <BarChart3 className="h-7 w-7" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-black italic">{t("Reports.revenue_analytics")}</CardTitle>
                                    <CardDescription className="text-base font-medium mt-1">{t("Reports.revenue_analytics_desc")}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-10 h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData.revenueData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary))" opacity={0.1} />
                                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1)' }}
                                        labelStyle={{ color: 'hsl(var(--muted-foreground))', fontWeight: 'bold', marginBottom: '0.5rem' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Best Sellers */}
                <motion.div variants={item}>
                    <Card className="h-full border-none shadow-3xl bg-card/60 backdrop-blur-3xl rounded-[3rem] overflow-hidden">
                        <CardHeader className="p-10 border-b border-primary/5 bg-primary/5">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-primary/10 rounded-2xl text-primary shadow-xl shadow-primary/5">
                                    <TrendingUp className="h-7 w-7" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-black italic">{t("Reports.top_products")}</CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="flex flex-col">
                                {bestSellers.map((product, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-8 hover:bg-primary/[0.02] border-b border-primary/5 last:border-0 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center font-black text-primary">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <div className="font-bold text-lg leading-none mb-1">{product.name}</div>
                                                <div className="text-xs font-black uppercase tracking-widest text-muted-foreground/40">{t("Reports.units_sold")}</div>
                                            </div>
                                        </div>
                                        <div className="font-black text-2xl tracking-tighter text-primary">
                                            {product.quantity}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Recent Sales Table (Mini) */}
                <motion.div variants={item}>
                    <Card className="h-full border-none shadow-3xl bg-card/60 backdrop-blur-3xl rounded-[3rem] overflow-hidden">
                        <CardHeader className="p-10 border-b border-primary/5 bg-primary/5">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-primary/10 rounded-2xl text-primary shadow-xl shadow-primary/5">
                                    <DollarSign className="h-7 w-7" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-black italic">{t("Reports.recent_transactions")}</CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="flex flex-col">
                                {sales.slice(0, 5).map((sale) => (
                                    <div key={sale.id} className="flex items-center justify-between p-8 hover:bg-primary/[0.02] border-b border-primary/5 last:border-0 transition-colors">
                                        <div>
                                            <div className="font-bold text-lg leading-none mb-1">#{sale.number}</div>
                                            <div className="text-xs font-black uppercase tracking-widest text-muted-foreground/40 text-nowrap">
                                                {new Date(sale.date).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-black text-lg tracking-tighter text-emerald-500">
                                                {formatCurrency(Number(sale.total))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}
