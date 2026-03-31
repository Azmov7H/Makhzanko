"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Plus, Calendar, User, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableRow, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency, cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import { ResponsiveTable } from "@/components/ui/ResponsiveTable";
import { useSales } from "./useSales";

export function SalesClient() {
    const { t } = useI18n();
    const [page, setPage] = useState(1);
    const { sales, loading, totalPages } = useSales(page);

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-muted-foreground font-bold tracking-widest text-xs uppercase animate-pulse">
                        {t("Common.loading") || "LOADING..."}
                    </p>
                </div>
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
    };

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="space-y-12 text-start"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                <motion.div variants={itemVariants} className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground" style={{ fontFamily: "var(--font-amiri), serif" }}>
                        {t("Sales.title")}
                    </h1>
                    <p className="text-muted-foreground font-medium text-lg md:text-xl max-w-2xl leading-relaxed">
                        {t("Sales.description")}
                    </p>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                    <Button asChild size="lg" className="h-14 px-8 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/10 hover:translate-y-[-2px] transition-all gap-3">
                        <Link href="/dashboard/sales-flow/sales/new">
                            <Plus className="h-5 w-5" />
                            {t("Sales.new_sale")}
                        </Link>
                    </Button>
                </motion.div>
            </div>

            {/* Sales Table Card */}
            <motion.div variants={itemVariants}>
                <Card className="luxury-card overflow-hidden border-none shadow-3xl bg-card/60 backdrop-blur-3xl rounded-[3rem]">
                    <CardHeader className="p-10 border-b border-border/40">
                        <div className="flex items-center gap-5">
                            <div className="size-14 rounded-lg bg-accent flex items-center justify-center text-primary shadow-xl shadow-primary/5">
                                <ShoppingCart className="h-7 w-7 stroke-[1.5]" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black tracking-tight" style={{ fontFamily: "var(--font-amiri), serif" }}>
                                    {t("Sales.recent_sales")}
                                </CardTitle>
                                <CardDescription className="text-base font-medium">
                                    {t("Sales.manage_sales_desc")}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <ResponsiveTable
                            headers={[
                                { label: t("Sales.invoice_no"), className: "px-10" },
                                { label: t("Sales.date") },
                                { label: t("Sales.customer") },
                                { label: t("Sales.items") },
                                { label: t("Sales.total"), className: "text-end" },
                                { label: t("Sales.status"), className: "px-10 text-center" },
                            ]}
                            data={sales}
                            keyExtractor={(sale) => sale.id}
                            page={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                            renderCard={(sale) => (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="rounded-md border-primary/20 bg-primary/5 text-primary font-bold">
                                            #{sale.number}
                                        </Badge>
                                        <Badge variant="outline" className={cn("rounded-md border-none", sale.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500")}>
                                            {sale.status}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm text-foreground">{sale.customerId || t("Sales.walk_in")}</span>
                                            <span className="text-xs text-muted-foreground">{new Date(sale.date).toLocaleDateString("ar-EG")}</span>
                                        </div>
                                        <span className="font-black text-xl text-primary">{formatCurrency(Number(sale.total))}</span>
                                    </div>
                                </div>
                            )}
                            emptyState={
                                <div className="py-24 text-center">
                                    <EmptyState
                                        icon={<ShoppingCart className="h-20 w-20 text-muted/20" />}
                                        title={t("Sales.no_sales")}
                                        description={t("Sales.empty_desc") || "No sales found yet."}
                                        action={{
                                            label: t("Sales.new_sale"),
                                            href: "/dashboard/sales-flow/sales/new",
                                        }}
                                    />
                                </div>
                            }
                            renderRow={(sale) => (
                                <TableRow key={sale.id} className="group hover:bg-accent/30 transition-all border-border/40 h-24">
                                    <TableCell className="px-10">
                                        <Badge variant="outline" className="rounded-md border-primary/20 bg-primary/5 text-primary font-bold px-3 py-1">
                                            #{sale.number}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-muted-foreground font-medium">
                                            <Calendar className="h-4 w-4 opacity-50" />
                                            {new Date(sale.date).toLocaleDateString("ar-EG", { dateStyle: 'medium' })}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 font-bold text-foreground">
                                            <User className="h-4 w-4 opacity-50 text-secondary" />
                                            {sale.customerId || t("Sales.walk_in")}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 font-medium text-muted-foreground">
                                            <Package className="h-4 w-4 opacity-50" />
                                            {t("Sales.items_count", { count: sale.items.length })}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-end font-black text-2xl tracking-tighter text-primary">
                                        {formatCurrency(Number(sale.total))}
                                    </TableCell>
                                    <TableCell className="px-10">
                                        <div className="flex justify-center">
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "rounded-md px-3 py-1 font-bold text-[10px] uppercase tracking-widest border-none",
                                                    sale.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                                                )}
                                            >
                                                {sale.status}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        />
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
