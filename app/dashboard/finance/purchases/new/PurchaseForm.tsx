"use client"

import { createPurchaseAction } from "@/_legacy_backend/actions/purchases";
import { useActionState, useState } from "react";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { Plus, Trash2, Truck, Warehouse as WarehouseIcon, ShoppingCart, ArrowLeft, Save, Sparkles, Package, CreditCard, Clock, DollarSign, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useI18n } from "@/lib/i18n/context";
import { formatCurrency, cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface Product {
    id: string;
    name: string;
    sku: string;
    cost: any;
}

interface Warehouse {
    id: string;
    name: string;
}

interface Supplier {
    id: string;
    name: string;
}

interface PurchaseItem {
    productId: string;
    name: string;
    quantity: number;
    cost: number;
}

export default function PurchaseForm({ products, warehouses, suppliers }: { products: Product[], warehouses: Warehouse[], suppliers: Supplier[] }) {
    const { t, locale } = useI18n();
    const [state, action, isPending] = useActionState(createPurchaseAction, null);
    const [items, setItems] = useState<PurchaseItem[]>([]);

    const [selectedProduct, setSelectedProduct] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(1);
    const [cost, setCost] = useState<number>(0);

    const [paymentType, setPaymentType] = useState<"CASH" | "DEFERRED">("CASH");
    const [installmentCount, setInstallmentCount] = useState(3);
    const [installmentInterval, setInstallmentInterval] = useState(1);
    const [selectedSupplierId, setSelectedSupplierId] = useState<string>("");
    const [manualSupplier, setManualSupplier] = useState("");

    const handleAddStart = () => {
        if (!selectedProduct) return;
        const product = products.find(p => p.id === selectedProduct);
        if (!product) return;

        setItems([...items, {
            productId: product.id,
            name: product.name,
            quantity: Number(quantity),
            cost: Number(cost)
        }]);

        // Reset
        setSelectedProduct("");
        setQuantity(1);
        setCost(0);
    };

    const handleRemove = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const total = items.reduce((sum: number, item) => sum + (item.cost * item.quantity), 0);

    return (
        <form action={action} className="space-y-12 animate-in fade-in duration-700 pb-20 max-w-5xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="relative">
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-primary/20 rounded-full blur-sm" />
                    <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent italic">
                        {t("Purchases.new_po")}
                    </h1>
                    <p className="text-muted-foreground mt-3 text-lg font-medium max-w-2xl">{t("Purchases.create_desc")}</p>
                </div>
                <div className="flex gap-4">
                    <Button asChild variant="outline" className="h-14 px-8 rounded-2xl border-primary/10 bg-card/40 backdrop-blur-xl hover:bg-primary/5 transition-all font-black text-xs uppercase tracking-widest">
                        <Link href="/dashboard/finance/purchases">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {t("Common.cancel")}
                        </Link>
                    </Button>
                    <Button
                        type="submit"
                        disabled={isPending || items.length === 0}
                        className="h-14 px-10 rounded-2xl bg-primary shadow-2xl shadow-primary/20 hover:scale-105 transition-all font-black text-xs uppercase tracking-widest gap-3"
                    >
                        <Save className="h-5 w-5" />
                        {isPending ? t("Purchases.creating") : t("Purchases.create_button")}
                    </Button>
                </div>
            </div>

            {state?.error && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl bg-destructive/10 border border-destructive/20 p-6 text-sm text-destructive font-bold flex items-center gap-4 shadow-xl shadow-destructive/5"
                >
                    <div className="p-2 bg-destructive/20 rounded-xl">
                        <Trash2 className="h-5 w-5 text-destructive" />
                    </div>
                    {state.error}
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column: Form Details */}
                <div className="lg:col-span-8 space-y-10">
                    <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-3xl rounded-[3rem] overflow-hidden group">
                        <CardHeader className="bg-primary/5 border-b border-primary/5 p-10">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-primary/10 rounded-2xl text-primary shadow-xl shadow-primary/5 group-hover:scale-110 transition-transform duration-500">
                                    <WarehouseIcon className="h-8 w-8" />
                                </div>
                                <CardTitle className="text-2xl font-black italic">{t("Purchases.general_info")}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <Label className="text-xs font-black uppercase tracking-widest text-primary/70 ml-1">{t("Purchases.warehouse")}</Label>
                                <Select name="warehouseId" required>
                                    <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-primary/5 focus:ring-primary/20 transition-all font-bold text-base">
                                        <SelectValue placeholder={t("Purchases.select_warehouse")} />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-primary/10 shadow-2xl">
                                        {warehouses.map(w => <SelectItem key={w.id} value={w.id} className="h-12 font-medium">{w.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-xs font-black uppercase tracking-widest text-primary/70 ml-1">{t("Purchases.supplier")}</Label>
                                <div className="flex gap-2">
                                    <Select
                                        name="supplierId"
                                        value={selectedSupplierId}
                                        onValueChange={setSelectedSupplierId}
                                    >
                                        <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-primary/5 focus:ring-primary/20 transition-all font-bold text-base">
                                            <SelectValue placeholder={t("Purchases.select_supplier") || "Select Supplier"} />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-primary/10 shadow-2xl">
                                            {suppliers.map(s => <SelectItem key={s.id} value={s.id} className="h-12 font-medium">{s.name}</SelectItem>)}
                                            <SelectItem value="manual" className="font-black text-primary italic border-t border-primary/10 mt-2">{t("Purchases.manual_entry") || "Manual Entry"}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {selectedSupplierId === "manual" && (
                                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1">
                                            <Input
                                                name="supplier"
                                                value={manualSupplier}
                                                onChange={e => setManualSupplier(e.target.value)}
                                                placeholder={t("Purchases.supplier_name") || "Enter name..."}
                                                className="h-14 rounded-2xl bg-muted/30 border-primary/5 focus:ring-primary/20 transition-all font-bold text-base"
                                            />
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-3xl rounded-[3rem] overflow-hidden group">
                        <CardHeader className="bg-primary/5 border-b border-primary/5 p-10">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-primary/10 rounded-2xl text-primary shadow-xl shadow-primary/5 group-hover:scale-110 transition-transform duration-500">
                                    <Plus className="h-8 w-8" />
                                </div>
                                <CardTitle className="text-2xl font-black italic">{t("Purchases.add_items")}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-10 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                                <div className="md:col-span-5 space-y-3">
                                    <Label className="text-xs font-black uppercase tracking-widest text-primary/70 ml-1">{t("Purchases.product")}</Label>
                                    <Select
                                        value={selectedProduct}
                                        onValueChange={(val) => {
                                            setSelectedProduct(val);
                                            const p = products.find(x => x.id === val);
                                            if (p) setCost(Number(p.cost));
                                        }}
                                    >
                                        <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-primary/5 font-bold text-base">
                                            <SelectValue placeholder={t("Purchases.select_product")} />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-primary/10">
                                            {products.map(p => (
                                                <SelectItem key={p.id} value={p.id} className="h-12 font-medium">
                                                    {p.name} <span className="text-primary/40 font-mono ml-2">({p.sku})</span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="md:col-span-3 space-y-3">
                                    <Label className="text-xs font-black uppercase tracking-widest text-primary/70 ml-1">{t("Purchases.cost")}</Label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={cost}
                                            onChange={e => setCost(Number(e.target.value))}
                                            className="h-14 pl-10 rounded-2xl bg-muted/30 border-primary/5 font-black text-lg"
                                        />
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 font-black">{t("Common.currency")}</span>
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <Label className="text-xs font-black uppercase tracking-widest text-primary/70 ml-1">{t("Purchases.qty")}</Label>
                                    <Input
                                        type="number"
                                        value={quantity}
                                        onChange={e => setQuantity(Number(e.target.value))}
                                        className="h-14 rounded-2xl bg-muted/30 border-primary/5 font-black text-lg text-center"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={handleAddStart}
                                        disabled={!selectedProduct}
                                        className="w-full h-14 rounded-2xl bg-primary/10 hover:bg-primary hover:text-white text-primary transition-all font-black"
                                    >
                                        <Plus className="h-6 w-6" />
                                    </Button>
                                </div>
                            </div>

                            <div className="rounded-[2rem] border border-primary/5 bg-muted/10 overflow-hidden shadow-inner">
                                <Table>
                                    <TableHeader className="bg-primary/5">
                                        <TableRow className="h-16 border-primary/5 hover:bg-transparent">
                                            <TableHead className="px-8 text-xs font-black uppercase tracking-widest opacity-50">{t("Purchases.product")}</TableHead>
                                            <TableHead className="text-right text-xs font-black uppercase tracking-widest opacity-50">{t("Purchases.cost")}</TableHead>
                                            <TableHead className="text-right text-xs font-black uppercase tracking-widest opacity-50">{t("Purchases.qty")}</TableHead>
                                            <TableHead className="text-right text-xs font-black uppercase tracking-widest opacity-50">{t("Purchases.total")}</TableHead>
                                            <TableHead className="w-[80px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <AnimatePresence mode="popLayout">
                                            {items.map((item, idx) => (
                                                <motion.tr
                                                    key={`${item.productId}-${idx}`}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="h-20 border-primary/5 hover:bg-primary/[0.02] transition-colors group/row"
                                                >
                                                    <TableCell className="px-8 font-bold text-base">{item.name}</TableCell>
                                                    <TableCell className="text-right font-black text-primary/60">{formatCurrency(item.cost)}</TableCell>
                                                    <TableCell className="text-right font-black text-lg">
                                                        <Badge variant="outline" className="rounded-lg px-3 py-1 font-black bg-primary/5 text-primary border-primary/10">
                                                            {item.quantity}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right font-black text-xl text-primary">
                                                        {formatCurrency(item.cost * item.quantity)}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleRemove(idx)}
                                                            className="text-destructive/30 hover:text-destructive hover:bg-destructive/10 h-10 w-10 rounded-xl transition-all"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                        {items.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-40 text-center">
                                                    <div className="flex flex-col items-center justify-center gap-3 opacity-20">
                                                        <ShoppingCart className="h-12 w-12" />
                                                        <p className="font-black italic uppercase tracking-widest text-sm">{t("Purchases.no_items")}</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Summary Card */}
                <div className="lg:col-span-4 space-y-10">
                    <Card className="border-none shadow-3xl bg-primary text-primary-foreground rounded-[3rem] overflow-hidden sticky top-32">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                        <CardHeader className="p-10 pb-6">
                            <CardTitle className="text-2xl font-black italic flex items-center gap-3">
                                <Sparkles className="h-6 w-6" />
                                {t("Purchases.summary")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 space-y-8">
                            <div className="space-y-6">
                                <div className="flex justify-between items-center opacity-70">
                                    <span className="text-sm font-black uppercase tracking-widest">{t("Purchases.subtotal")}</span>
                                    <span className="font-bold">{formatCurrency(total)}</span>
                                </div>
                                <div className="flex justify-between items-end pt-6 border-t border-white/20">
                                    <div className="space-y-1">
                                        <span className="block text-xs font-black uppercase tracking-[0.2em] opacity-60 leading-none">{t("Purchases.net_total")}</span>
                                        <span className="block text-4xl font-black italic tracking-tighter leading-none">
                                            {formatCurrency(total)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method in Summary */}
                            <div className="space-y-4 pt-6 border-t border-white/10">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60">
                                    <DollarSign className="h-3 w-3" />
                                    {t("Sales.payment_method") || "Payment"}
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentType("CASH")}
                                        className={cn(
                                            "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 text-xs",
                                            paymentType === "CASH"
                                                ? "border-white bg-white/10 text-white"
                                                : "border-white/5 bg-white/5 text-white/40 hover:bg-white/10"
                                        )}
                                    >
                                        <DollarSign className="h-5 w-5" />
                                        <span className="font-black uppercase tracking-widest">{t("Sales.cash")}</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentType("DEFERRED")}
                                        className={cn(
                                            "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 text-xs",
                                            paymentType === "DEFERRED"
                                                ? "border-white bg-white/10 text-white"
                                                : "border-white/5 bg-white/5 text-white/40 hover:bg-white/10"
                                        )}
                                    >
                                        <Clock className="h-5 w-5" />
                                        <span className="font-black uppercase tracking-widest">{t("Sales.deferred") || "DEBT"}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Installment Config in Sidebar */}
                            <AnimatePresence>
                                {paymentType === "DEFERRED" && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-4 pt-4 overflow-hidden border-t border-white/10"
                                    >
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-1">
                                                    {t("Sales.installments_count") || "PAYMENTS"}
                                                </label>
                                                <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/10">
                                                    <Button variant="ghost" type="button" size="icon" onClick={() => setInstallmentCount(Math.max(2, installmentCount - 1))} className="h-8 w-8 hover:bg-white/10 text-white">
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="flex-1 text-center font-black text-sm">{installmentCount}</span>
                                                    <Button variant="ghost" type="button" size="icon" onClick={() => setInstallmentCount(installmentCount + 1)} className="h-8 w-8 hover:bg-white/10 text-white">
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-1">
                                                    {t("Sales.interval_months") || "INTERVAL"}
                                                </label>
                                                <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/10">
                                                    <Button variant="ghost" type="button" size="icon" onClick={() => setInstallmentInterval(Math.max(1, installmentInterval - 1))} className="h-8 w-8 hover:bg-white/10 text-white">
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="flex-1 text-center font-black text-sm">{installmentInterval}</span>
                                                    <Button variant="ghost" type="button" size="icon" onClick={() => setInstallmentInterval(installmentInterval + 1)} className="h-8 w-8 hover:bg-white/10 text-white">
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center text-xs italic opacity-80">
                                            {formatCurrency(total / installmentCount)} / month
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <input type="hidden" name="items" value={JSON.stringify(items)} />
                            <input type="hidden" name="paymentType" value={paymentType} />
                            <input type="hidden" name="installmentCount" value={installmentCount} />
                            <input type="hidden" name="installmentInterval" value={installmentInterval} />

                            <Button
                                type="submit"
                                disabled={isPending || items.length === 0}
                                className="w-full h-16 rounded-[2rem] bg-white text-primary hover:bg-white/90 transition-all font-black text-sm uppercase tracking-[0.15em] shadow-2xl shadow-black/20 group"
                            >
                                {isPending ? (
                                    <div className="flex items-center gap-2">
                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                                            <Package className="h-5 w-5" />
                                        </motion.div>
                                        {t("Purchases.creating")}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <Save className="h-6 w-6" />
                                        {t("Purchases.complete_po")}
                                    </div>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
