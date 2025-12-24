"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Plus, MoreHorizontal, FileText, Calendar, User } from "lucide-react";
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
import { formatCurrency } from "@/lib/utils";

interface SalesClientProps {
    sales: any[];
    locale: string;
    t: any;
}

export function SalesClient({ sales, locale, t }: SalesClientProps) {
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
        <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            className="space-y-8 text-start"
        >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <motion.div variants={item}>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        {t("Sales.title")}
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg font-medium max-w-2xl">
                        {t("Sales.description")}
                    </p>
                </motion.div>
                <motion.div variants={item}>
                    <Button asChild className="gap-2 px-8 h-12 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300">
                        <Link href={`/${locale}/dashboard/sales-flow/sales/new`}>
                            <Plus className="h-5 w-5" />
                            <span className="font-bold">{t("Sales.new_sale")}</span>
                        </Link>
                    </Button>
                </motion.div>
            </div>

            <motion.div variants={item}>
                <Card className="border-none shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-xl rounded-3xl overflow-hidden">
                    <CardHeader className="px-8 pt-8 flex flex-row items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-black flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-xl">
                                    <ShoppingCart className="h-6 w-6 text-primary" />
                                </div>
                                {t("Sales.recent_sales")}
                            </CardTitle>
                            <CardDescription className="text-base font-medium">
                                {t("Sales.manage_sales_desc")}
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 sm:p-8">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-primary/5">
                                        <TableHead className="text-start font-bold py-5 px-6 uppercase tracking-wider text-xs">{t("Sales.invoice_no")}</TableHead>
                                        <TableHead className="text-start font-bold py-5 px-6 uppercase tracking-wider text-xs">{t("Sales.date")}</TableHead>
                                        <TableHead className="text-start font-bold py-5 px-6 uppercase tracking-wider text-xs">{t("Sales.customer")}</TableHead>
                                        <TableHead className="text-start font-bold py-5 px-6 uppercase tracking-wider text-xs">{t("Sales.items")}</TableHead>
                                        <TableHead className="text-start font-bold py-5 px-6 uppercase tracking-wider text-xs">{t("Sales.total")}</TableHead>
                                        <TableHead className="text-center font-bold py-5 px-6 uppercase tracking-wider text-xs">{t("Sales.status")}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sales.map((sale) => (
                                        <TableRow key={sale.id} className="group hover:bg-primary/5 transition-all duration-300 border-primary/5">
                                            <TableCell className="py-4 px-6">
                                                <Badge variant="outline" className="font-black text-primary border-primary/20 bg-primary/5 rounded-lg px-3 py-1">
                                                    #{sale.number}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-4 px-6 font-medium text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 opacity-40" />
                                                    {new Date(sale.date).toLocaleDateString(locale, { dateStyle: 'medium' })}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 px-6 font-bold">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 opacity-40" />
                                                    {sale.customerId || t("Sales.walk_in")}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 opacity-40" />
                                                    {t("Sales.items_count", { count: sale.items.length })}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 px-6">
                                                <span className="font-black text-primary text-lg">
                                                    {formatCurrency(Number(sale.total))}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-4 px-6 text-center">
                                                <Badge
                                                    variant={sale.status === "COMPLETED" ? "default" : "secondary"}
                                                    className={cn(
                                                        "rounded-full px-4 py-1 font-black text-[10px] uppercase tracking-wider shadow-sm",
                                                        sale.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : ""
                                                    )}
                                                >
                                                    {sale.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {sales.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-48 text-center">
                                                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                                    <ShoppingCart className="h-12 w-12 opacity-10" />
                                                    <p className="font-bold">{t("Sales.no_sales")}</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}

// Helper to use cn without importing from lib/utils if preferred, but we have it.
import { cn } from "@/lib/utils";
