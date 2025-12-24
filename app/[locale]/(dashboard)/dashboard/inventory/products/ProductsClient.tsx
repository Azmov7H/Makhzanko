"use client";

import { motion } from "framer-motion";
import { Package, Plus, MoreHorizontal, FileDown, Trash2, Edit } from "lucide-react";
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
import { formatCurrency } from "@/lib/utils";
import { deleteProductAction } from "@/actions/products";
import { useI18n } from "@/lib/i18n/context";

interface ProductsClientProps {
    products: any[];
    totalStock: number;
    locale: string;
}

export function ProductsClient({ products, totalStock, locale }: ProductsClientProps) {
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
                        {t("Products.title")}
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg font-medium max-w-2xl">
                        {t("Products.description")}
                    </p>
                </motion.div>
                <motion.div variants={item} className="flex flex-wrap gap-3">
                    <BulkExportProducts />
                    <Button asChild className="gap-2 px-8 h-12 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300">
                        <Link href={`/${locale}/dashboard/inventory/products/new`}>
                            <Plus className="h-5 w-5" />
                            <span className="font-bold">{t("Products.add_product")}</span>
                        </Link>
                    </Button>
                </motion.div>
            </div>

            {products.length === 0 ? (
                <motion.div variants={item}>
                    <Card className="border-none shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-xl rounded-3xl overflow-hidden">
                        <CardContent className="p-12">
                            <EmptyState
                                icon={<Package className="h-16 w-16 text-primary/20" />}
                                title={t("Products.no_products")}
                                description={t("Products.empty_desc")}
                                action={{
                                    label: t("Products.add_product"),
                                    href: `/${locale}/dashboard/inventory/products/new`,
                                }}
                            />
                        </CardContent>
                    </Card>
                </motion.div>
            ) : (
                <>
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        <motion.div variants={item}>
                            <Card className="border-none shadow-xl shadow-primary/5 bg-blue-500/5 backdrop-blur-xl rounded-3xl overflow-hidden group hover:bg-blue-500 transition-all duration-500">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors">
                                        {t("Products.total_products")}
                                    </CardTitle>
                                    <div className="p-2 bg-blue-500/10 rounded-xl group-hover:bg-white/20 transition-colors">
                                        <Package className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:text-white" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-black group-hover:text-white transition-colors">{products.length}</div>
                                    <p className="text-xs text-blue-600/60 dark:text-blue-400/60 mt-1 font-bold group-hover:text-white/60 transition-colors">
                                        {t("Products.list_title")}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                        <motion.div variants={item}>
                            <Card className="border-none shadow-xl shadow-primary/5 bg-purple-500/5 backdrop-blur-xl rounded-3xl overflow-hidden group hover:bg-purple-500 transition-all duration-500">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 group-hover:text-white transition-colors">
                                        {t("Products.total_stock")}
                                    </CardTitle>
                                    <div className="p-2 bg-purple-500/10 rounded-xl group-hover:bg-white/20 transition-colors">
                                        <Package className="h-5 w-5 text-purple-600 dark:text-purple-400 group-hover:text-white" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-black group-hover:text-white transition-colors">{totalStock}</div>
                                    <p className="text-xs text-purple-600/60 dark:text-purple-400/60 mt-1 font-bold group-hover:text-white/60 transition-colors">
                                        {t("Products.total_stock")}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    <motion.div variants={item}>
                        <Card className="border-none shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-xl rounded-3xl overflow-hidden">
                            <CardHeader className="px-8 pt-8">
                                <CardTitle className="text-2xl font-black">{t("Products.list_title")}</CardTitle>
                                <CardDescription className="text-base font-medium">{t("Products.list_desc")}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0 sm:p-8">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="hover:bg-transparent border-primary/5">
                                                <TableHead className="text-start font-bold py-5 px-6 uppercase tracking-wider text-xs">{t("Products.product_name")}</TableHead>
                                                <TableHead className="text-start font-bold py-5 px-6 uppercase tracking-wider text-xs">{t("Products.sku")}</TableHead>
                                                <TableHead className="text-start font-bold py-5 px-6 uppercase tracking-wider text-xs">{t("Products.price")}</TableHead>
                                                <TableHead className="text-start font-bold py-5 px-6 uppercase tracking-wider text-xs">{t("Products.cost")}</TableHead>
                                                <TableHead className="text-start font-bold py-5 px-6 uppercase tracking-wider text-xs">{t("Products.stock")}</TableHead>
                                                <TableHead className="text-center font-bold py-5 px-6 uppercase tracking-wider text-xs">{t("Products.actions")}</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {products.map((product) => {
                                                const productStock = (product.stocks as any[]).reduce(
                                                    (acc: number, s: any) => acc + s.quantity,
                                                    0
                                                );

                                                return (
                                                    <TableRow key={product.id} className="group hover:bg-primary/5 transition-all duration-300 border-primary/5">
                                                        <TableCell className="py-4 px-6">
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-base group-hover:text-primary transition-colors">{product.name}</span>
                                                                <span className="text-xs text-muted-foreground">{product.category}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-4 px-6 font-mono text-sm">
                                                            <Badge variant="outline" className="rounded-lg font-bold border-primary/10">
                                                                {product.sku}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="py-4 px-6">
                                                            <span className="font-black text-primary">
                                                                {formatCurrency(Number(product.price))}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="py-4 px-6 text-muted-foreground font-medium">
                                                            {formatCurrency(Number(product.cost))}
                                                        </TableCell>
                                                        <TableCell className="py-4 px-6">
                                                            <Badge
                                                                variant={productStock > product.minStock ? "default" : productStock > 0 ? "secondary" : "destructive"}
                                                                className="rounded-full px-4 py-1 font-black text-xs"
                                                            >
                                                                {productStock}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="py-4 px-6 text-center">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" className="h-10 w-10 p-0 hover:bg-primary/20 rounded-xl transition-all">
                                                                        <MoreHorizontal className="h-5 w-5" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="w-[200px] p-2 bg-card/95 backdrop-blur-2xl border-primary/10 rounded-2xl shadow-2xl">
                                                                    <DropdownMenuItem asChild className="rounded-xl focus:bg-primary/10 cursor-pointer py-3 transition-colors">
                                                                        <Link href={`/${locale}/dashboard/inventory/products/${product.id}/edit`} className="flex items-center gap-3">
                                                                            <div className="p-1.5 bg-muted rounded-lg"><Edit className="h-4 w-4" /></div>
                                                                            <span className="font-bold text-sm">{t("Common.edit")}</span>
                                                                        </Link>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem className="rounded-xl focus:bg-destructive/10 cursor-pointer py-3 transition-colors text-destructive">
                                                                        <form action={deleteProductAction} className="w-full">
                                                                            <input type="hidden" name="id" value={product.id} />
                                                                            <button type="submit" className="w-full flex items-center gap-3 font-bold text-sm">
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
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </>
            )}
        </motion.div>
    );
}
