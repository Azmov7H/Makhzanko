"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Package, Plus, MoreHorizontal, Trash2, Edit, 
    Box, LayoutGrid, Table as TableIcon, BarChart3, Search, 
    AlertTriangle, Filter, Download, ArrowUpDown, ChevronRight,
    CheckSquare, Square, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TableRow, TableCell } from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { ResponsiveTable } from "@/components/ui/ResponsiveTable";
import { useI18n } from "@/lib/i18n/context";
import { formatCurrency, cn } from "@/lib/utils";
import { useProducts, Product } from "./useProducts";

export function ProductsClient() {
    const { t, locale } = useI18n();
    const isRtl = locale === 'ar';
    
    // UI States
    const [page, setPage] = useState(1);
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    
    // Filter States
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [categoryFilter, setCategoryFilter] = useState<string>("");
    const [sort, setSort] = useState<string>("name:asc");

    const filters = useMemo(() => ({
        search,
        status: statusFilter === "all" ? undefined : statusFilter,
        category: categoryFilter || undefined
    }), [search, statusFilter, categoryFilter]);

    const { 
        products, 
        totalStock, 
        loading, 
        totalPages, 
        deleteProduct, 
        bulkDelete, 
        exportCSV 
    } = useProducts(page, 10, filters, sort);

    // Derived States
    const allSelected = products.length > 0 && selectedIds.length === products.length;
    
    const toggleSelectAll = () => {
        if (allSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(products.map(p => p.id));
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = async () => {
        if (window.confirm(t("Common.confirm_delete") || "Are you sure?")) {
            await bulkDelete(selectedIds);
            setSelectedIds([]);
        }
    };

    if (loading && products.length === 0) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="size-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
                    <p className="text-muted-foreground font-black tracking-widest text-xs uppercase animate-pulse">
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
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } }
    };

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="space-y-8 text-start pb-20"
        >
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <motion.div variants={itemVariants} className="space-y-1">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground flex items-center gap-4" style={{ fontFamily: "var(--font-amiri), serif" }}>
                        <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Package className="h-6 w-6" />
                        </div>
                        {t("Products.title")}
                    </h1>
                    <p className="text-muted-foreground font-medium text-base md:text-lg max-w-xl opacity-70">
                        {t("Products.description")}
                    </p>
                </motion.div>
                
                <motion.div variants={itemVariants} className="flex gap-3">
                    <Button 
                        onClick={exportCSV}
                        variant="outline" 
                        size="lg" 
                        className="h-14 px-6 rounded-2xl font-bold gap-2 border-primary/10 hover:bg-primary/5 transition-all"
                    >
                        <Download className="h-5 w-5" />
                        <span className="hidden sm:inline">{t("Products.export_csv")}</span>
                    </Button>
                    <Button asChild size="lg" className="h-14 px-8 rounded-2xl bg-primary text-white font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all gap-3">
                        <Link href="/dashboard/inventory/products/new">
                            <Plus className="h-5 w-5" />
                            {t("Products.add_product")}
                        </Link>
                    </Button>
                </motion.div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: t("Products.total_products"), value: products.length, icon: Box, color: "text-primary", bg: "bg-primary/5" },
                    { label: t("Products.total_stock"), value: totalStock, icon: BarChart3, color: "text-blue-500", bg: "bg-blue-500/5" },
                    { label: t("Products.status_low_stock"), value: products.filter(p => p.stocks.reduce((acc, s) => acc + s.quantity, 0) <= p.min_stock).length, icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/5" },
                ].map((stat, i) => (
                    <motion.div key={i} variants={itemVariants}>
                        <Card className="luxury-card h-full border-none bg-card/40 backdrop-blur-md shadow-sm rounded-3xl p-6 group hover:shadow-md transition-all">
                            <div className="flex items-center gap-4">
                                <div className={cn("size-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                                    <div className="text-2xl font-black">{stat.value}</div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Productivity Toolbar */}
            <motion.div variants={itemVariants} className="sticky top-4 z-30">
                <Card className="luxury-card border-none bg-card/60 backdrop-blur-2xl shadow-2xl rounded-[2rem] p-2">
                    <div className="flex flex-col lg:flex-row items-center gap-4 px-2">
                        {/* Bulk Selection or Search */}
                        <AnimatePresence mode="wait">
                            {selectedIds.length > 0 ? (
                                <motion.div 
                                    key="bulk"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex items-center gap-4 flex-1 bg-primary/10 rounded-2xl px-4 py-2"
                                >
                                    <span className="font-bold text-primary text-sm whitespace-nowrap">
                                        {t("Products.delete_selected", { count: selectedIds.length })}
                                    </span>
                                    <div className="flex gap-2">
                                        <Button variant="destructive" size="sm" onClick={handleBulkDelete} className="rounded-xl h-10 px-4 font-bold uppercase tracking-tighter text-[10px]">
                                            {t("Common.delete")}
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])} className="rounded-xl h-10 w-10 p-0">
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="search"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="relative flex-1 group w-full"
                                >
                                    <Search className={cn("absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary", isRtl ? "right-4" : "left-4")} />
                                    <input 
                                        type="text" 
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder={t("Products.search_sku") || "Search by product name or SKU..."}
                                        className={cn(
                                            "w-full h-14 bg-transparent outline-none font-bold text-sm rounded-2xl transition-all border-2 border-transparent focus:border-primary/10",
                                            isRtl ? "pr-14 pl-4" : "pl-14 pr-4"
                                        )}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Filters Controls */}
                        <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="h-12 px-5 rounded-2xl gap-2 font-bold text-xs bg-background/50 border-primary/5">
                                        <Filter className="h-4 w-4 text-primary" />
                                        {statusFilter === "all" ? t("Products.status_all") : t(`Products.status_${statusFilter}`)}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="luxury-card min-w-[200px] p-2 rounded-2xl border-none shadow-2xl bg-card/80 backdrop-blur-xl">
                                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest px-3 py-2 text-muted-foreground">{t("Common.status")}</DropdownMenuLabel>
                                    {["all", "in_stock", "low_stock", "out_of_stock"].map((s) => (
                                        <DropdownMenuItem key={s} onClick={() => setStatusFilter(s)} className="rounded-xl py-3 focus:bg-primary/5 cursor-pointer font-bold text-sm">
                                            {t(`Products.status_${s}`)}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="h-12 px-5 rounded-2xl gap-2 font-bold text-xs bg-background/50 border-primary/5">
                                        <ArrowUpDown className="h-4 w-4 text-primary" />
                                        {t("Products.sort")}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="luxury-card min-w-[200px] p-2 rounded-2xl border-none shadow-2xl bg-card/80 backdrop-blur-xl">
                                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest px-3 py-2 text-muted-foreground">{t("Products.sort")}</DropdownMenuLabel>
                                    {[
                                        { label: "Name (A-Z)", value: "name:asc" },
                                        { label: "Name (Z-A)", value: "name:desc" },
                                        { label: "Price (Low-High)", value: "price:asc" },
                                        { label: "Price (High-Low)", value: "price:desc" },
                                        { label: "Stock (Low-High)", value: "stock:asc" }
                                    ].map((opt) => (
                                        <DropdownMenuItem key={opt.value} onClick={() => setSort(opt.value)} className="rounded-xl py-3 focus:bg-primary/5 cursor-pointer font-bold text-sm">
                                            {opt.label}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <div className="h-8 w-px bg-border/40 mx-2 hidden lg:block" />

                            <div className="flex bg-muted/50 p-1 rounded-2xl border border-primary/5">
                                <Button 
                                    variant={viewMode === 'table' ? 'secondary' : 'ghost'} 
                                    size="sm" 
                                    onClick={() => setViewMode('table')}
                                    className="rounded-xl h-10 w-12 p-0"
                                >
                                    <TableIcon className="h-4 w-4" />
                                </Button>
                                <Button 
                                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                                    size="sm" 
                                    onClick={() => setViewMode('grid')}
                                    className="rounded-xl h-10 w-12 p-0"
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Main Content Area */}
            <AnimatePresence mode="wait">
                {products.length === 0 ? (
                    <motion.div 
                        key="empty"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        <Card className="luxury-card border-none bg-card/40 backdrop-blur-xl shadow-2xl rounded-[3rem] p-20 flex flex-col items-center text-center">
                            <div className="size-24 rounded-[2rem] bg-muted/20 flex items-center justify-center mb-8">
                                <Package className="h-12 w-12 text-muted-foreground/30" />
                            </div>
                            <h3 className="text-3xl font-black mb-2" style={{ fontFamily: "var(--font-amiri), serif" }}>{t("Products.no_products")}</h3>
                            <p className="text-muted-foreground max-w-sm mb-10 font-medium opacity-60">{t("Products.empty_desc")}</p>
                            <Button asChild size="lg" className="h-14 px-10 rounded-2xl bg-primary font-bold shadow-lg shadow-primary/20">
                                <Link href="/dashboard/inventory/products/new">{t("Products.add_product")}</Link>
                            </Button>
                        </Card>
                    </motion.div>
                ) : viewMode === 'grid' ? (
                    <motion.div 
                        key="grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {products.map((product) => {
                            const stock = product.stocks.reduce((acc, s) => acc + s.quantity, 0);
                            const isSelected = selectedIds.includes(product.id);
                            return (
                                <motion.div key={product.id} variants={itemVariants}>
                                    <Card 
                                        className={cn(
                                            "luxury-card h-full border-none bg-card/40 backdrop-blur-md shadow-xl rounded-[2.5rem] overflow-hidden group cursor-pointer transition-all",
                                            isSelected && "ring-2 ring-primary bg-primary/[0.02]"
                                        )}
                                        onClick={() => toggleSelect(product.id)}
                                    >
                                        <div className="p-8 space-y-6">
                                            <div className="flex justify-between items-start">
                                                <div className="size-16 rounded-3xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                    <Package className="h-8 w-8" />
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <Badge 
                                                        variant="secondary" 
                                                        className={cn(
                                                            "rounded-lg border-none px-3 py-1 font-black text-[10px] uppercase tracking-widest",
                                                            stock > product.min_stock ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                                                        )}
                                                    >
                                                        {stock} {t("Products.units")}
                                                    </Badge>
                                                    <div className="flex gap-1">
                                                        <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-background shadow-sm hover:text-primary transition-all">
                                                            <Link href={`/dashboard/inventory/products/${product.id}/edit`}>
                                                                <Edit className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <h3 className="text-xl font-bold tracking-tight line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{product.category || "General"}</p>
                                            </div>

                                            <div className="pt-4 border-t border-primary/[0.05] flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">{t("Products.price")}</p>
                                                    <p className="text-2xl font-black tracking-tighter text-primary">{formatCurrency(product.price)}</p>
                                                </div>
                                                <div className="text-end">
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">{t("Products.sku")}</p>
                                                    <p className="text-xs font-mono font-bold opacity-40">{product.sku}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                ) : (
                    <motion.div 
                        key="table"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <Card className="luxury-card border-none bg-card/40 backdrop-blur-3xl shadow-2xl rounded-[2.5rem] overflow-hidden">
                            <ResponsiveTable
                                headers={[
                                    { 
                                        label: (
                                            <button onClick={toggleSelectAll} className="hover:text-primary transition-colors">
                                                {allSelected ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
                                            </button>
                                        ), 
                                        className: "w-16 px-8" 
                                    },
                                    { label: t("Products.product_name"), className: "px-2" },
                                    { label: t("Products.sku") },
                                    { label: t("Products.category") },
                                    { label: t("Products.price") },
                                    { label: t("Products.stock") },
                                    { label: "", className: "w-20 px-8" },
                                ]}
                                data={products}
                                page={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                                keyExtractor={(p) => p.id}
                                renderRow={(product) => {
                                    const stock = product.stocks.reduce((acc, s) => acc + s.quantity, 0);
                                    const isSelected = selectedIds.includes(product.id);
                                    return (
                                        <TableRow key={product.id} className={cn("group hover:bg-primary/[0.02] border-primary/[0.03] transition-all h-24", isSelected && "bg-primary/[0.04]")}>
                                            <TableCell className="px-8">
                                                <button onClick={() => toggleSelect(product.id)} className="text-muted-foreground hover:text-primary transition-colors">
                                                    {isSelected ? <CheckSquare className="h-5 w-5 text-primary" /> : <Square className="h-5 w-5 opacity-40" />}
                                                </button>
                                            </TableCell>
                                            <TableCell className="px-2">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                        <Package className="h-6 w-6" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{product.name}</span>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">{product.category || "General"}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-mono text-xs font-bold text-muted-foreground/60 bg-muted px-2 py-1 rounded-lg border border-primary/5">
                                                    {product.sku}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="rounded-xl border-primary/10 bg-primary/5 text-primary font-bold text-[10px] px-3">
                                                    {product.category || "General"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-xl font-black tracking-tighter">{formatCurrency(product.price)}</span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className={cn("size-2 rounded-full", stock > product.min_stock ? "bg-emerald-500 animate-pulse" : stock > 0 ? "bg-amber-500" : "bg-destructive")} />
                                                    <span className={cn("font-black text-sm", stock > product.min_stock ? "text-emerald-500" : stock > 0 ? "text-amber-500" : "text-destructive")}>
                                                        {stock}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-8 text-end">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                                                            <MoreHorizontal className="h-5 w-5" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="luxury-card min-w-[200px] border-none p-2 bg-card/80 backdrop-blur-2xl rounded-2xl shadow-3xl">
                                                        <DropdownMenuItem asChild className="rounded-xl py-3 focus:bg-primary/5 cursor-pointer font-bold gap-3 px-4">
                                                            <Link href={`/dashboard/inventory/products/${product.id}/edit`}>
                                                                <Edit className="h-4 w-4 text-primary" />
                                                                <span>{t("Common.edit")}</span>
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-primary/5 mx-2" />
                                                        <DropdownMenuItem 
                                                            onClick={() => {
                                                                if (confirm(t("Common.confirm_delete"))) deleteProduct(product.id);
                                                            }}
                                                            className="rounded-xl py-3 focus:bg-destructive/10 cursor-pointer font-bold gap-3 px-4 text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            <span>{t("Common.delete")}</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                }}
                            />
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
