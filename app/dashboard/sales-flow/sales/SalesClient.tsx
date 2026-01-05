"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Plus, FileText, Calendar, User, ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { formatCurrency, cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import { ResponsiveTable } from "@/components/ui/ResponsiveTable";

interface SalesClientProps {
    sales: any[];
}

export function SalesClient({ sales }: SalesClientProps) {
    const { t } = useI18n();

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
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
    } as const;

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-start space-y-12"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative">
                <motion.div variants={item} className="relative">
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-primary/20 rounded-full blur-sm" />
                    <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent italic">
                        {t("Sales.title")}
                    </h1>
                    <p className="text-muted-foreground mt-3 text-lg font-medium max-w-2xl">
                        {t("Sales.description")}
                    </p>
                </motion.div>
                <motion.div variants={item}>
                    <Button asChild className="h-16 px-10 rounded-[2rem] bg-primary shadow-2xl shadow-primary/20 hover:scale-105 transition-all duration-500 group relative overflow-hidden">
                        <Link href="/dashboard/sales-flow/sales/new">
                            <span className="relative z-10 flex items-center gap-3">
                                <Plus className="h-6 w-6 transition-transform group-hover:rotate-90 duration-500" />
                                <span className="font-black text-xs uppercase tracking-widest">{t("Sales.new_sale")}</span>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </Link>
                    </Button>
                </motion.div>
            </div>

            <motion.div variants={item}>
                <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-3xl rounded-[3rem] overflow-hidden group">
                    <CardHeader className="p-10 border-b border-primary/5 bg-primary/5">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-primary/10 rounded-2xl text-primary shadow-xl shadow-primary/5 group-hover:scale-110 transition-all duration-500">
                                <ShoppingCart className="h-8 w-8" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black italic tracking-tight">
                                    {t("Sales.recent_sales")}
                                </CardTitle>
                                <CardDescription className="text-base font-medium">
                                    {t("Sales.manage_sales_desc")}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="p-4 md:p-0">
                            <ResponsiveTable
                                headers={[
                                    { label: t("Sales.invoice_no"), className: "px-10 text-muted-foreground/60" },
                                    { label: t("Sales.date"), className: "text-muted-foreground/60" },
                                    { label: t("Sales.customer"), className: "text-muted-foreground/60" },
                                    { label: t("Sales.items"), className: "text-muted-foreground/60" },
                                    { label: t("Sales.total"), className: "text-muted-foreground/60 text-right" },
                                    { label: t("Sales.status"), className: "px-10 text-muted-foreground/60 text-center" },
                                ]}
                                data={sales}
                                keyExtractor={(sale) => sale.id}
                                emptyState={
                                    <div className="h-80 text-center flex flex-col items-center justify-center gap-6 text-muted-foreground/30">
                                        <div className="p-8 bg-muted/30 rounded-full">
                                            <ShoppingCart className="h-16 w-16" />
                                        </div>
                                        <p className="font-black italic text-xl uppercase tracking-widest">{t("Sales.no_sales")}</p>
                                        <Button asChild variant="outline" className="rounded-2xl border-primary/10 hover:bg-primary hover:text-white transition-all">
                                            <Link href="/dashboard/sales-flow/sales/new">{t("Sales.new_sale")}</Link>
                                        </Button>
                                    </div>
                                }
                                renderRow={(sale) => (
                                    <TableRow key={sale.id} className="group/row hover:bg-primary/[0.02] transition-all duration-500 border-primary/5 h-24">
                                        <TableCell className="px-10 font-black">
                                            <Badge variant="outline" className="rounded-xl px-4 py-1 font-black text-primary border-primary/10 bg-primary/5 tracking-tighter text-base">
                                                #{sale.number}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-bold text-muted-foreground/80">
                                            <div className="flex items-center gap-3">
                                                <Calendar className="h-4 w-4 opacity-40 text-primary" />
                                                {new Date(sale.date).toLocaleDateString("ar-EG", { dateStyle: 'medium' })}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-black text-lg group-hover/row:text-primary transition-colors">
                                            <div className="flex items-center gap-3">
                                                <User className="h-4 w-4 opacity-40 text-primary" />
                                                {sale.customerId || t("Sales.walk_in")}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3 font-bold text-muted-foreground">
                                                <Package className="h-4 w-4 opacity-40 text-primary" />
                                                {t("Sales.items_count", { count: sale.items.length })}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="font-black text-2xl tracking-tighter text-primary">
                                                    {formatCurrency(Number(sale.total))}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-10">
                                            <div className="flex items-center justify-center">
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "rounded-xl px-5 py-1.5 font-black text-[10px] uppercase tracking-widest border-none shadow-sm",
                                                        sale.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                                                    )}
                                                >
                                                    {sale.status}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                                renderCard={(sale) => (
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-start justify-between border-b border-border/50 pb-3">
                                            <div className="flex flex-col gap-1">
                                                <Badge variant="outline" className="w-fit rounded-lg px-2 py-0.5 font-black text-primary border-primary/10 bg-primary/5 tracking-tighter text-xs">
                                                    #{sale.number}
                                                </Badge>
                                                <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(sale.date).toLocaleDateString("ar-EG", { dateStyle: 'medium' })}
                                                </span>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "rounded-lg px-2 py-1 font-bold text-[10px] uppercase border-none",
                                                    sale.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                                                )}
                                            >
                                                {sale.status}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-bold text-sm text-foreground">{sale.customerId || t("Sales.walk_in")}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Package className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium text-sm text-muted-foreground">{t("Sales.items_count", { count: sale.items.length })}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                            <span className="text-xs uppercase font-bold text-muted-foreground">{t("Sales.total")}</span>
                                            <span className="font-black text-xl text-primary tracking-tighter">
                                                {formatCurrency(Number(sale.total))}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
