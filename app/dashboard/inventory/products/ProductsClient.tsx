"use client";

import { motion } from "framer-motion";
import { Package, Plus, MoreHorizontal, Trash2, Edit, History, TrendingUp, ShoppingBag, Box, Layout, ArrowRight, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { BulkExportProducts } from "./_components/BulkExportProducts";
import Link from "next/link";
import { formatCurrency, cn } from "@/lib/utils";
import { deleteProductAction } from "@/actions/products";
import { ResponsiveTable } from "@/components/ui/ResponsiveTable";
import { useI18n } from "@/lib/i18n/context";

interface ProductsClientProps {
    products: any[];
    totalStock: number;
}

export function ProductsClient({ products, totalStock }: ProductsClientProps) {
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

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            className="space-y-8 md:space-y-12 text-start px-0"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <motion.div variants={item} className="relative">
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-12 bg-primary/20 rounded-full blur-sm" />
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent italic">
                        {t("Products.title")}
                    </h1>
                    <p className="text-muted-foreground mt-2 text-base md:text-lg font-medium max-w-2xl">
                        {t("Products.description")}
                    </p>
                </motion.div>
                <motion.div variants={item} className="flex flex-wrap gap-3 w-full md:w-auto">
                    <BulkExportProducts />
                    <Button asChild className="h-12 md:h-14 flex-1 md:flex-none px-6 md:px-8 rounded-xl md:rounded-2xl bg-primary shadow-2xl shadow-primary/20 hover:scale-105 transition-all gap-2 md:gap-3 font-black text-[10px] md:text-xs uppercase tracking-widest group">
                        <Link href="/dashboard/inventory/products/new">
                            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-500" />
                            {t("Products.add_product")}
                        </Link>
                    </Button>
                </motion.div>
            </div>

            {products.length === 0 ? (
                <motion.div variants={item}>
                    <Card className="border-none shadow-sm bg-card rounded-[3rem] overflow-hidden">
                        <CardContent className="p-24">
                            <EmptyState
                                icon={<Package className="h-24 w-24 text-primary/10 animate-bounce" />}
                                title={t("Products.no_products")}
                                description={t("Products.empty_desc")}
                                action={{
                                    label: t("Products.add_product"),
                                    href: "/dashboard/inventory/products/new",
                                }}
                            />
                        </CardContent>
                    </Card>
                </motion.div>
            ) : (
                <>
                    <div className="grid gap-4 md:gap-8 grid-cols-1 sm:grid-cols-2">
                        <motion.div variants={item}>
                            <Card className="border-none shadow-sm bg-card rounded-[2rem] md:rounded-[2.5rem] overflow-hidden group hover:shadow-primary/5 transition-all duration-500 relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/2 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/5 transition-colors" />
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 md:pb-6">
                                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                                        {t("Products.total_products")}
                                    </CardTitle>
                                    <div className="p-2 md:p-3 bg-primary/10 rounded-xl md:rounded-2xl text-primary group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                                        <Box className="h-5 w-5 md:h-6 md:w-6" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl md:text-5xl font-black tracking-tighter">{products.length}</div>
                                    <p className="text-xs font-bold text-primary mt-1 md:mt-2 flex items-center gap-2">
                                        <Layout className="h-3 w-3 md:h-4 md:w-4 opacity-40" />
                                        {t("Products.list_title")}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                        <motion.div variants={item}>
                            <Card className="border-none shadow-sm bg-card rounded-[2rem] md:rounded-[2.5rem] overflow-hidden group hover:shadow-primary/5 transition-all duration-500 relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/2 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-emerald-500/5 transition-colors" />
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 md:pb-6">
                                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                                        {t("Products.total_stock")}
                                    </CardTitle>
                                    <div className="p-2 md:p-3 bg-emerald-500/10 rounded-xl md:rounded-2xl text-emerald-500 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                                        <BarChart3 className="h-5 w-5 md:h-6 md:w-6" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl md:text-5xl font-black tracking-tighter">{totalStock}</div>
                                    <p className="text-xs font-bold text-emerald-500 mt-1 md:mt-2 flex items-center gap-2">
                                        <TrendingUp className="h-3 w-3 md:h-4 md:w-4 opacity-40" />
                                        {t("Products.total_stock")}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    <motion.div variants={item}>
                        <Card className="border-none shadow-sm bg-card rounded-[3rem] overflow-hidden group">
                            <CardHeader className="p-6 md:p-10 border-b border-primary/5 bg-primary/5/30">
                                <div className="flex items-center gap-4 md:gap-5">
                                    <div className="p-3 md:p-4 bg-primary/10 rounded-xl md:rounded-2xl text-primary shadow-xl shadow-primary/5 group-hover:scale-110 transition-transform duration-500">
                                        <History className="h-6 w-6 md:h-7 md:w-7" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl md:text-2xl font-black italic">{t("Products.list_title")}</CardTitle>
                                        <CardDescription className="text-sm md:text-base font-medium mt-1">{t("Products.list_desc")}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="p-4 md:p-0">
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
                                        renderRow={(product) => {
                                            const productStock = (product.stocks as any[]).reduce(
                                                (acc: number, s: any) => acc + s.quantity,
                                                0
                                            );
                                            return (
                                                <TableRow key={product.id} className="group/row hover:bg-primary/[0.02] transition-all duration-500 border-primary/5 h-24">
                                                    <TableCell className="px-10">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="font-black text-lg group-hover/row:text-primary transition-colors">{product.name}</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 bg-muted/50 px-2 py-0.5 rounded-md">{product.category}</span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-mono text-xs font-black bg-primary/5 text-primary/60 px-2.5 py-1.5 rounded-xl border border-primary/5">
                                                            {product.sku}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-black text-2xl tracking-tighter text-primary">
                                                            {formatCurrency(Number(product.price))}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-black text-lg tracking-tighter text-muted-foreground/30">
                                                            {formatCurrency(Number(product.cost))}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                "rounded-xl px-4 py-2 font-black text-sm tracking-tighter border-none shadow-sm",
                                                                productStock > product.minStock ? "bg-emerald-500/10 text-emerald-500" :
                                                                    productStock > 0 ? "bg-amber-500/10 text-amber-500 shadow-amber-500/5" :
                                                                        "bg-destructive/10 text-destructive shadow-destructive/5"
                                                            )}
                                                        >
                                                            {productStock}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="px-10 text-end">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-12 w-12 hover:bg-primary/10 rounded-2xl transition-all group-hover/row:scale-110">
                                                                    <MoreHorizontal className="h-6 w-6 text-muted-foreground/40 group-hover/row:text-primary" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-[200px] p-2 bg-card/60 backdrop-blur-3xl border-none rounded-[1.5rem] shadow-3xl animate-in zoom-in-95 duration-200">
                                                                <DropdownMenuItem asChild className="rounded-xl focus:bg-primary/10 cursor-pointer py-3 transition-all">
                                                                    <Link href={`/dashboard/inventory/products/${product.id}/edit`} className="flex items-center gap-3">
                                                                        <div className="p-1.5 bg-primary/5 text-primary rounded-lg"><Edit className="h-4 w-4" /></div>
                                                                        <span className="font-black text-xs uppercase tracking-widest">{t("Common.edit")}</span>
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="rounded-xl focus:bg-destructive/10 cursor-pointer py-3 transition-all text-destructive">
                                                                    <form action={async (formData) => { await deleteProductAction(formData); }} className="w-full">
                                                                        <input type="hidden" name="id" value={product.id} />
                                                                        <button type="submit" className="w-full flex items-center gap-3 font-black text-xs uppercase tracking-widest">
                                                                            <div className="p-1.5 bg-destructive/10 rounded-lg"><Trash2 className="h-4 w-4" /></div>
                                                                            <span>{t("Common.delete")}</span>
                                                                        </button>
                                                                    </form>
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        }}
                                        renderCard={(product) => {
                                            const productStock = (product.stocks as any[]).reduce(
                                                (acc: number, s: any) => acc + s.quantity,
                                                0
                                            );

                                            return (
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="font-black text-lg text-foreground">{product.name}</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 bg-muted px-2 py-0.5 rounded-md">{product.category}</span>
                                                                <span className="font-mono text-[10px] font-bold bg-primary/5 text-primary px-2 py-0.5 rounded-md border border-primary/10">
                                                                    {product.sku}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                                                                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-[180px]">
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/dashboard/inventory/products/${product.id}/edit`}>
                                                                        <Edit className="h-4 w-4 mr-2" />
                                                                        {t("Common.edit")}
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="text-destructive">
                                                                    <form action={async (formData) => { await deleteProductAction(formData); }} className="w-full">
                                                                        <input type="hidden" name="id" value={product.id} />
                                                                        <button type="submit" className="w-full flex items-center">
                                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                                            {t("Common.delete")}
                                                                        </button>
                                                                    </form>
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[10px] uppercase font-bold text-muted-foreground">{t("Products.price")}</span>
                                                            <span className="font-black text-xl text-primary">{formatCurrency(Number(product.price))}</span>
                                                        </div>
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[10px] uppercase font-bold text-muted-foreground">{t("Products.cost")}</span>
                                                            <span className="font-bold text-base text-muted-foreground">{formatCurrency(Number(product.cost))}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                                        <span className="text-xs font-bold text-muted-foreground">{t("Products.stock")}</span>
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                "rounded-lg px-2 py-1 font-bold text-xs border-none",
                                                                productStock > product.minStock ? "bg-emerald-500/10 text-emerald-500" :
                                                                    productStock > 0 ? "bg-amber-500/10 text-amber-500" :
                                                                        "bg-destructive/10 text-destructive"
                                                            )}
                                                        >
                                                            {productStock} {t("Products.units")}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </>
            )}
        </motion.div>
    );
}
