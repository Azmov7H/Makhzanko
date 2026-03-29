"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Plus, MoreHorizontal, Trash2, Edit, History, TrendingUp, Box, Layout, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TableRow, TableCell } from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { BulkExportProducts } from "./_components/BulkExportProducts";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { ResponsiveTable } from "@/components/ui/ResponsiveTable";

import { useI18n } from "@/lib/i18n/context";
import { useProducts } from "./useProducts";

export function ProductsClient() {
    const { t } = useI18n();
    const [page, setPage] = useState(1);
    const { products, totalStock, loading, totalPages, deleteProduct } = useProducts(page);


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
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
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
                        {t("Products.title")}
                    </h1>
                    <p className="text-muted-foreground font-medium text-lg md:text-xl max-w-2xl leading-relaxed">
                        {t("Products.description")}
                    </p>
                </motion.div>
                
                <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                    <BulkExportProducts />
                    <Button asChild size="lg" className="h-14 px-8 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/10 hover:translate-y-[-2px] transition-all gap-3">
                        <Link href="/dashboard/inventory/products/new">
                            <Plus className="h-5 w-5" />
                            {t("Products.add_product")}
                        </Link>
                    </Button>
                </motion.div>
            </div>

            {products.length === 0 ? (
                <motion.div variants={itemVariants}>
                    <Card className="luxury-card p-24">
                         <EmptyState
                            icon={<Package className="h-20 w-20 text-muted/20" />}
                            title={t("Products.no_products")}
                            description={t("Products.empty_desc")}
                            action={{
                                label: t("Products.add_product"),
                                href: "/dashboard/inventory/products/new",
                            }}
                        />
                    </Card>
                </motion.div>
            ) : (
                <>
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.div variants={itemVariants}>
                            <Card className="luxury-card p-8 group overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
                                <div className="flex items-center gap-6">
                                    <div className="size-14 rounded-lg bg-accent flex items-center justify-center text-primary transition-transform group-hover:scale-110">
                                        <Box className="h-7 w-7 stroke-[1.5]" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t("Products.total_products")}</p>
                                        <div className="text-4xl font-black tracking-tighter">{products.length}</div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Card className="luxury-card p-8 group overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
                                <div className="flex items-center gap-6">
                                    <div className="size-14 rounded-lg bg-accent flex items-center justify-center text-secondary transition-transform group-hover:scale-110">
                                        <BarChart3 className="h-7 w-7 stroke-[1.5]" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t("Products.total_stock")}</p>
                                        <div className="text-4xl font-black tracking-tighter">{totalStock}</div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Table */}
                    <motion.div variants={itemVariants}>
                        <Card className="luxury-card overflow-hidden">
                             <CardHeader className="p-10 border-b border-border/40">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 rounded-lg bg-accent flex items-center justify-center text-primary">
                                        <History className="h-6 w-6 stroke-[1.5]" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl font-black tracking-tight" style={{ fontFamily: "var(--font-amiri), serif" }}>{t("Products.list_title")}</CardTitle>
                                        <CardDescription className="text-base font-medium">{t("Products.list_desc")}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <ResponsiveTable
                                    headers={[
                                        { label: t("Products.product_name"), className: "px-10" },
                                        { label: t("Products.sku") },
                                        { label: t("Products.price") },
                                        { label: t("Products.cost") },
                                        { label: t("Products.stock") },
                                        { label: t("Products.actions"), className: "px-10 text-end w-[120px]" },
                                    ]}
                                    data={products}
                                    keyExtractor={(product) => product.id}
                                    page={page}
                                    totalPages={totalPages}
                                    onPageChange={setPage}
                                    renderCard={(product) => {
                                        const productStock = (product.stocks as any[]).reduce(
                                            (acc: number, s: any) => acc + s.quantity,
                                            0
                                        );
                                        return (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-lg">{product.name}</span>
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{product.category}</span>
                                                    </div>
                                                    <Badge variant="outline" className={cn("rounded-md border-none", productStock > 5 ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500")}>
                                                        {productStock}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-baseline justify-between pt-2 border-t border-border/20">
                                                    <span className="text-sm font-bold text-primary">{formatCurrency(Number(product.price))}</span>
                                                    <span className="text-xs font-mono text-muted-foreground">{product.sku}</span>
                                                </div>
                                            </div>
                                        );
                                    }}
                                    renderRow={(product) => {

                                        const productStock = (product.stocks as any[]).reduce(
                                            (acc: number, s: any) => acc + s.quantity,
                                            0
                                        );
                                        return (
                                            <TableRow key={product.id} className="group hover:bg-accent/30 transition-all border-border/40 h-24">
                                                <TableCell className="px-10">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{product.name}</span>
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{product.category}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-mono text-xs font-bold bg-muted px-2 py-1 rounded">
                                                        {product.sku}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="font-bold text-xl tracking-tighter text-primary">
                                                    {formatCurrency(Number(product.price))}
                                                </TableCell>
                                                <TableCell className="font-medium text-lg tracking-tighter text-muted-foreground/60">
                                                    {formatCurrency(Number(product.cost))}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={cn(
                                                            "rounded-md px-3 py-1 font-bold text-xs border-none",
                                                            productStock > (product.minStock || 5) ? "bg-emerald-500/10 text-emerald-500" :
                                                                productStock > 0 ? "bg-amber-500/10 text-amber-500" :
                                                                    "bg-destructive/10 text-destructive"
                                                        )}
                                                    >
                                                        {productStock}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-10 text-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-accent rounded-lg transition-all">
                                                                <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="luxury-card border-none p-2 w-[180px]">
                                                            <DropdownMenuItem asChild className="rounded-lg py-2 focus:bg-accent cursor-pointer transition-all">
                                                                <Link href={`/dashboard/inventory/products/${product.id}/edit`} className="flex items-center gap-3">
                                                                    <Edit className="h-4 w-4 text-primary" />
                                                                    <span className="font-bold text-xs uppercase tracking-widest">{t("Common.edit")}</span>
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild className="rounded-lg py-2 focus:bg-destructive/10 cursor-pointer transition-all text-destructive">
                                                                <button 
                                                                    onClick={async () => { 
                                                                        if (confirm(t("Common.confirm_delete") || "Are you sure?")) {
                                                                            await deleteProduct(product.id); 
                                                                        }
                                                                    }} 
                                                                    className="w-full flex items-center gap-3 font-bold text-xs uppercase tracking-widest px-2"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                    <span>{t("Common.delete")}</span>
                                                                </button>
                                                            </DropdownMenuItem>

                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </motion.div>
                </>
            )}
        </motion.div>
    );
}
