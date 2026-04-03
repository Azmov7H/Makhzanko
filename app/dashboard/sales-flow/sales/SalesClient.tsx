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
import { Search, Filter, Eye, Truck, CheckCircle2, Clock, XCircle, MoreVertical } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const STATUS_CONFIG: Record<string, { label: string, color: string, bg: string, icon: any }> = {
    "DRAFT": { label: "Draft", color: "text-muted-foreground", bg: "bg-muted/10", icon: Clock },
    "PENDING": { label: "Pending", color: "text-amber-500", bg: "bg-amber-500/10", icon: Clock },
    "SHIPPED": { label: "Shipped", color: "text-blue-500", bg: "bg-blue-500/10", icon: Truck },
    "COMPLETED": { label: "Completed", color: "text-emerald-500", bg: "bg-emerald-500/10", icon: CheckCircle2 },
    "CANCELLED": { label: "Cancelled", color: "text-destructive", bg: "bg-destructive/10", icon: XCircle },
};

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
                <Button asChild size="lg" className="h-14 px-8 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all gap-3 border-none">
                    <Link href="/dashboard/sales-flow/sales/new">
                        <Plus className="h-5 w-5" />
                        {t("Sales.new_sale")}
                    </Link>
                </Button>
            </motion.div>
        </div>

        {/* Search & Filters */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 bg-muted/30 p-2 rounded-2xl border border-primary/5">
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                    type="text" 
                    placeholder={t("Sales.search_placeholder") || "Search order ID, invoice # or customer..."}
                    className="w-full h-12 pl-12 pr-4 bg-transparent outline-none font-bold text-sm"
                />
            </div>
            <div className="flex gap-2">
                <Button variant="outline" className="h-12 px-6 rounded-xl gap-2 font-bold text-xs uppercase tracking-widest bg-background border-primary/5">
                    <Filter className="h-4 w-4" />
                    {t("Common.filter") || "Filter"}
                </Button>
                <Button variant="outline" className="h-12 px-6 rounded-xl gap-2 font-bold text-xs uppercase tracking-widest bg-background border-primary/5">
                    {t("Sales.status_fulfillment") || "Delivery"}
                </Button>
            </div>
        </motion.div>

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
                            renderRow={(sale) => {
                                const status = STATUS_CONFIG[sale.status as string] || STATUS_CONFIG.PENDING;
                                return (
                                    <TableRow key={sale.id} className="group hover:bg-accent/30 transition-all border-border/40 h-24">
                                        <TableCell className="px-10">
                                            <Badge variant="outline" className="rounded-md border-primary/20 bg-primary/5 text-primary font-black px-4 py-1.5 shadow-sm">
                                                #{sale.number}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-muted-foreground font-bold text-sm">
                                                <Calendar className="h-4 w-4 opacity-50" />
                                                {new Date(sale.date).toLocaleDateString("ar-EG", { dateStyle: 'medium' })}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3 font-black text-lg">
                                                <div className="size-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                                                    <User className="h-4 w-4" />
                                                </div>
                                                {sale.customerId || t("Sales.walk_in")}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 font-bold text-muted-foreground">
                                                <Package className="h-4 w-4 opacity-30" />
                                                {t("Sales.items_count", { count: sale.items.length })}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-end font-black text-2xl tracking-tighter text-foreground">
                                            {formatCurrency(Number(sale.total))}
                                        </TableCell>
                                        <TableCell className="px-10">
                                            <div className="flex justify-center flex-col items-center gap-2">
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "rounded-full px-4 py-1.5 font-black text-[10px] uppercase tracking-widest border-none shadow-sm flex items-center gap-2",
                                                        status.bg,
                                                        status.color
                                                    )}
                                                >
                                                    <status.icon className="h-3 w-3" />
                                                    {status.label}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-end px-10">
                                            <OrderDetailsDrawer sale={sale} t={t} />
                                        </TableCell>
                                    </TableRow>
                                );
                            }}
                        />
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
function OrderDetailsDrawer({ sale, t }: { sale: any, t: any }) {
    const status = STATUS_CONFIG[sale.status as string] || STATUS_CONFIG.PENDING;
    
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-primary/10 rounded-xl group/btn transition-all">
                    <Eye className="h-5 w-5 text-muted-foreground group-hover/btn:text-primary transition-colors" />
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md bg-card/95 backdrop-blur-3xl border-none shadow-3xl p-0">
                <SheetHeader className="p-8 border-b border-primary/5">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Badge variant="outline" className="rounded-md border-primary/20 bg-primary/5 text-primary font-black mb-2">
                                #{sale.number}
                            </Badge>
                            <SheetTitle className="text-3xl font-black italic tracking-tight">{t("Sales.order_details") || "Order Details"}</SheetTitle>
                        </div>
                        <Badge
                            className={cn(
                                "rounded-full px-4 py-1.5 font-black text-[10px] uppercase tracking-widest border-none shadow-sm flex items-center gap-2",
                                status.bg,
                                status.color
                            )}
                        >
                            <status.icon className="h-3 w-3" />
                            {status.label}
                        </Badge>
                    </div>
                </SheetHeader>

                <ScrollArea className="h-[calc(100vh-120px)] p-8">
                    <div className="space-y-10">
                        {/* Customer & Info Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shadow-lg shadow-secondary/5">
                                    <User className="h-6 w-6" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("Sales.customer")}</p>
                                    <p className="text-lg font-black">{sale.customerId || t("Sales.walk_in")}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6 bg-muted/20 p-6 rounded-3xl border border-primary/5">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">{t("Sales.date")}</p>
                                    <p className="text-sm font-bold tracking-tight">{new Date(sale.date).toLocaleDateString("ar-EG", { dateStyle: 'long' })}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">{t("Sales.method") || "Payment"}</p>
                                    <p className="text-sm font-bold tracking-tight">{sale.paymentMethod || "Cash"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Items Section */}
                        <div className="space-y-6">
                            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-primary/40 px-1">{t("Sales.items") || "Itemized List"}</h4>
                            <div className="space-y-4">
                                {sale.items.map((item: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-muted/10 rounded-2xl border border-transparent hover:border-primary/5 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-xl bg-background border border-primary/5 flex items-center justify-center text-primary/40">
                                                <Package className="h-5 w-5" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-sm font-bold truncate max-w-[150px]">{item.productName || "Product Name"}</p>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-black text-md">{formatCurrency(Number(item.price * item.quantity))}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator className="bg-primary/5" />

                        {/* Summary Section */}
                        <div className="space-y-4 bg-primary/[0.02] p-8 rounded-[2.5rem] border border-primary/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
                            <div className="flex justify-between items-center opacity-60">
                                <span className="text-xs font-bold uppercase tracking-widest">{t("Sales.subtotal") || "Subtotal"}</span>
                                <span className="font-bold">{formatCurrency(Number(sale.total))}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-y border-primary/5">
                                <span className="text-xs font-bold uppercase tracking-widest opacity-60">{t("Sales.tax") || "VAT (0%)"}</span>
                                <span className="font-bold">$0.00</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-sm font-black uppercase tracking-[0.2em] text-primary">{t("Sales.total") || "Grand Total"}</span>
                                <span className="text-3xl font-black italic tracking-tighter text-primary">{formatCurrency(Number(sale.total))}</span>
                            </div>
                        </div>

                        {/* Actions Section */}
                        <div className="space-y-3 pt-4">
                            <Button className="w-full h-14 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all gap-3">
                                <Truck className="h-5 w-5" />
                                {t("Sales.mark_shipped") || "Start Fulfillment"}
                            </Button>
                            <Button variant="outline" className="w-full h-14 rounded-2xl border-primary/10 bg-transparent font-black text-xs uppercase tracking-widest hover:bg-primary/5 transition-all">
                                {t("Sales.print_invoice") || "Print Thermal Invoice"}
                            </Button>
                        </div>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
