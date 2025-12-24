"use client";

import { use } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Users, Target, BarChart3, Activity, ArrowUpRight, Sparkles } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";
import { Badge } from "@/components/ui/badge";

interface AnalyticsProps {
    params: Promise<{ locale: string }>;
    data: {
        performance: any[];
        analyticsData: any[];
    };
}

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

export default function AdvancedAnalyticsClient({
    params,
    data
}: AnalyticsProps) {
    const { locale } = use(params);
    const { performance, analyticsData } = data;
    const { t } = useI18n(); // Assuming we use useI18n hook or similar. Let's check imports.

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8 px-4 md:px-0 max-w-6xl mx-auto text-start pb-10"
        >
            <div className="flex flex-col gap-2">
                <motion.div variants={item} className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                    </div>
                    <span className="text-sm font-bold tracking-widest uppercase text-muted-foreground/60">{t("Analytics.subtitle")}</span>
                </motion.div>
                <motion.h1
                    variants={item}
                    className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent"
                >
                    {t("Analytics.title")}
                </motion.h1>
                <motion.p variants={item} className="text-muted-foreground text-lg">
                    {t("Analytics.description")}
                </motion.p>
            </div>

            <Separator className="bg-primary/10" />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: t("Analytics.growth_rate"), value: "+12.5%", desc: t("Analytics.growth_desc"), icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                    { title: t("Analytics.sales_target"), value: "84%", desc: t("Analytics.target_desc"), icon: Target, color: "text-accent", bg: "bg-accent/10" },
                    { title: t("Analytics.active_staff"), value: performance.length.toString(), desc: t("Analytics.staff_desc"), icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
                    { title: t("Analytics.top_product"), value: analyticsData[0]?.name || "N/A", desc: t("Analytics.product_desc"), icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
                ].map((stat, i) => (
                    <motion.div key={i} variants={item}>
                        <Card className="border-none shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-2xl group hover:scale-[1.05] hover:shadow-primary/10 transition-all duration-500 overflow-hidden relative">
                            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-full -mr-10 -mt-10 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity`} />
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                    {stat.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className={`text-3xl font-black ${i === 0 ? stat.color : ''}`}>{stat.value}</div>
                                <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1 font-medium">
                                    <ArrowUpRight className="h-3 w-3" />
                                    {stat.desc}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                <motion.div variants={item}>
                    <Card className="border-none shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-2xl overflow-hidden rounded-3xl group">
                        <CardHeader className="bg-primary/5 border-b border-primary/5 py-8 px-8">
                            <CardTitle className="flex items-center gap-3 text-2xl font-black">
                                <div className="p-3 bg-primary/10 rounded-2xl group-hover:rotate-12 transition-transform duration-500">
                                    <Users className="h-7 w-7 text-primary" />
                                </div>
                                {t("Analytics.employee_performance")}
                            </CardTitle>
                            <CardDescription className="text-base font-medium">{t("Analytics.employee_desc")}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/10">
                                    <TableRow className="hover:bg-transparent border-primary/5">
                                        <TableHead className="py-5 px-8 font-bold text-xs uppercase tracking-widest">{t("Analytics.staff_name")}</TableHead>
                                        <TableHead className="text-center font-bold text-xs uppercase tracking-widest">{t("Analytics.sales_count")}</TableHead>
                                        <TableHead className="text-right px-8 font-bold text-xs uppercase tracking-widest">{t("Analytics.total_revenue")}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {performance.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-48 text-center text-muted-foreground italic font-medium">
                                                <Users className="h-12 w-12 mx-auto mb-4 opacity-10" />
                                                {t("Analytics.no_performance")}
                                            </TableCell>
                                        </TableRow>
                                    ) : performance.map((staff) => (
                                        <TableRow key={staff.id} className="border-primary/5 hover:bg-primary/5 transition-all duration-300 group/row">
                                            <TableCell className="font-bold py-5 px-8 text-lg">{staff.name}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline" className="font-mono text-sm px-3 py-1 bg-primary/5 border-primary/10">
                                                    {staff.salesCount}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-black text-xl text-primary px-8 group-hover/row:scale-105 transition-transform">
                                                {formatCurrency(staff.totalRevenue)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card className="border-none shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-2xl overflow-hidden rounded-3xl group">
                        <CardHeader className="bg-accent/5 border-b border-primary/5 py-8 px-8">
                            <CardTitle className="flex items-center gap-3 text-2xl font-black">
                                <div className="p-3 bg-accent/10 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                                    <BarChart3 className="h-7 w-7 text-accent" />
                                </div>
                                {t("Analytics.top_revenue_products")}
                            </CardTitle>
                            <CardDescription className="text-base font-medium">{t("Analytics.top_revenue_desc")}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/10">
                                    <TableRow className="hover:bg-transparent border-primary/5">
                                        <TableHead className="py-5 px-8 font-bold text-xs uppercase tracking-widest">{t("Analytics.product_info")}</TableHead>
                                        <TableHead className="text-center font-bold text-xs uppercase tracking-widest">{t("Analytics.qty_sold")}</TableHead>
                                        <TableHead className="text-right px-8 font-bold text-xs uppercase tracking-widest">{t("Analytics.total_value")}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {analyticsData.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-48 text-center text-muted-foreground italic font-medium">
                                                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-10" />
                                                {t("Analytics.no_sales")}
                                            </TableCell>
                                        </TableRow>
                                    ) : analyticsData.map((p) => (
                                        <TableRow key={p.productId} className="border-primary/5 hover:bg-primary/5 transition-all duration-300 group/row">
                                            <TableCell className="py-5 px-8">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-bold text-lg group-hover/row:text-accent transition-colors">{p.name}</span>
                                                    <Badge variant="outline" className="w-fit text-[10px] uppercase font-mono tracking-tighter opacity-70">
                                                        SKU: {p.sku}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className="font-black text-lg text-muted-foreground">{p._sum.quantity}</span>
                                            </TableCell>
                                            <TableCell className="text-right font-black uppercase text-2xl text-accent px-8 group-hover/row:scale-110 transition-transform origin-right">
                                                {formatCurrency(Number(p._sum.total))}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}
