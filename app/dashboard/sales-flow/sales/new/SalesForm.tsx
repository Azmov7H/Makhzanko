"use client";

import { createSaleAction } from "@/actions/sales";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Trash2, CreditCard, Plus, Minus, Search, Package, User, Sparkles, Receipt, Percent, DollarSign, Loader2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n/context";
import { cn, formatCurrency } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function SalesForm({ products, warehouses }: { products: any[]; warehouses: any[] }) {
    const { t } = useI18n();
    const [cart, setCart] = useState<any[]>([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState(warehouses[0]?.id || "");
    const [searchQuery, setSearchQuery] = useState("");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const [customerName, setCustomerName] = useState("");
    const [discountType, setDiscountType] = useState<"percentage" | "fixed" | "none">("none");
    const [discountValue, setDiscountValue] = useState(0);
    const [paymentType, setPaymentType] = useState<"CASH" | "DEFERRED">("CASH");
    const [installmentCount, setInstallmentCount] = useState(3);
    const [installmentInterval, setInstallmentInterval] = useState(1);
    const [iframeUrl, setIframeUrl] = useState<string | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const addToCart = (productId: string) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        setCart(prev => {
            const existing = prev.find(item => item.productId === productId);
            if (existing) {
                return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { productId, quantity: 1, price: Number(product.price), name: product.name, sku: product.sku }];
        });
        toast.success(t("Products.added_to_cart"), {
            className: "rounded-2xl border-none bg-emerald-500 text-white font-black italic shadow-2xl",
        });
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.productId === productId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.productId !== productId));
    };

    const handleCheckout = () => {
        if (!selectedWarehouse) {
            toast.error(t("Sales.select_warehouse_error"));
            return;
        }
        if (cart.length === 0) return;

        startTransition(async () => {
            try {
                const result = await createSaleAction({
                    warehouseId: selectedWarehouse,
                    items: cart.map(item => ({ productId: item.productId, quantity: item.quantity, price: item.price })),
                    customerName: customerName || undefined,
                    discountType: discountType !== "none" ? discountType : undefined,
                    discountValue: discountType !== "none" ? discountValue : undefined,
                    paymentType: paymentType as any,
                    installmentCount: paymentType === "DEFERRED" ? installmentCount : undefined,
                    installmentInterval: paymentType === "DEFERRED" ? installmentInterval : undefined,
                });

                if (result.error) {
                    toast.error(result.error);
                } else {
                    toast.success(t("Common.success"), {
                        className: "rounded-2xl border-none bg-emerald-500 text-white font-black italic shadow-2xl",
                    });
                    router.push(`/dashboard/sales-flow/sales`);
                }
            } catch (error) {
                toast.error(t("Common.error"));
            }
        });
    };

    const subtotal = cart.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const discountAmount = discountType === "percentage"
        ? (subtotal * discountValue / 100)
        : discountType === "fixed"
            ? Math.min(discountValue, subtotal)
            : 0;
    const total = subtotal - discountAmount;

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-12 p-4 lg:p-1">
            {/* Product List */}
            <div className="flex flex-col space-y-8">
                <div className="relative group/search">
                    <div className="absolute inset-0 bg-primary/5 rounded-[2rem] blur-xl opacity-0 group-hover/search:opacity-100 transition-opacity duration-1000" />
                    <div className="relative flex items-center">
                        <Search className="absolute left-6 h-6 w-6 text-primary/40 group-focus-within/search:text-primary transition-colors" />
                        <Input
                            placeholder={t("Sales.search_placeholder") || "Search products by name or SKU..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-20 pl-16 pr-8 rounded-[2rem] border-primary/10 bg-card/40 backdrop-blur-xl text-xl font-bold placeholder:text-muted-foreground/30 focus-visible:ring-primary/20 shadow-2xl shadow-primary/5 transition-all"
                        />
                        <div className="absolute right-6 h-10 w-10 rounded-2xl bg-primary/5 flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-primary/40 animate-pulse" />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-auto pr-2 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                        {filteredProducts.map((product, idx) => (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05, type: "spring", stiffness: 200 }}
                                key={product.id}
                                onClick={() => addToCart(product.id)}
                                className="group relative flex flex-col items-start justify-between rounded-[2.5rem] border border-primary/5 bg-card/60 p-8 text-left transition-all hover:shadow-3xl hover:border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 hover:-translate-y-2 duration-500 overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
                                    <Package className="h-24 w-24 text-primary" />
                                </div>
                                <div className="relative z-10 w-full">
                                    <Badge variant="outline" className="mb-4 rounded-xl px-3 py-1 font-black text-[10px] uppercase tracking-widest text-primary/50 border-primary/10 bg-primary/5">
                                        {product.sku}
                                    </Badge>
                                    <h3 className="font-black text-2xl tracking-tight leading-none group-hover:text-primary transition-colors italic">
                                        {product.name}
                                    </h3>
                                </div>
                                <div className="relative z-10 mt-8 flex w-full items-end justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-1">{t("Inventory.price")}</span>
                                        <span className="text-3xl font-black text-primary tracking-tighter">
                                            {formatCurrency(Number(product.price))}
                                        </span>
                                    </div>
                                    <div className="h-14 w-14 rounded-2xl bg-primary shadow-xl shadow-primary/20 flex items-center justify-center text-white hover:scale-110 active:scale-90 transition-all duration-300">
                                        <Plus className="h-7 w-7" />
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                    {filteredProducts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/30">
                            <Search className="h-20 w-20 mb-6 opacity-20" />
                            <p className="font-black italic text-xl uppercase tracking-widest">{t("Sales.no_products_found")}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Cart & Checkout */}
            <Card className="flex flex-col h-full border-none shadow-3xl bg-primary/[0.02] backdrop-blur-3xl rounded-[3rem] overflow-hidden group/order">
                <CardHeader className="p-10 border-b border-primary/5 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-primary/10 rounded-2xl text-primary shadow-xl shadow-primary/5 group-hover/order:scale-110 transition-all duration-500">
                                <Receipt className="h-8 w-8" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black italic tracking-tight">
                                    {t("Sales.current_order")}
                                </CardTitle>
                                <CardDescription className="text-base font-medium">
                                    {t("Sales.order_summary_desc")}
                                </CardDescription>
                            </div>
                        </div>
                        <Badge variant="default" className="rounded-2xl px-6 py-2 bg-primary font-black shadow-xl shadow-primary/20 text-lg">
                            {cart.length}
                        </Badge>
                    </div>

                    <div className="relative group/wh">
                        <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                            <SelectTrigger className="h-16 rounded-2xl border-primary/5 bg-card/40 backdrop-blur-xl px-6 font-bold text-lg hover:border-primary/20 transition-all focus:ring-primary/20">
                                <div className="flex items-center gap-3">
                                    <Package className="h-5 w-5 text-primary/40" />
                                    <SelectValue placeholder={t("Sales.select_warehouse")} />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-primary/10 shadow-3xl">
                                {warehouses.map(w => (
                                    <SelectItem key={w.id} value={w.id} className="h-12 rounded-xl focus:bg-primary/5 focus:text-primary font-bold">{w.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>

                <CardContent className="flex-1 p-0 overflow-hidden relative">
                    <ScrollArea className="h-[400px]">
                        <div className="p-10 space-y-6">
                            <AnimatePresence initial={false}>
                                {cart.map((item) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        key={item.productId}
                                        className="relative group/item flex items-center justify-between p-6 bg-card/40 backdrop-blur-xl rounded-[2rem] border border-primary/5 hover:border-primary/20 transition-all duration-500 overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-primary/[0.02] opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                        <div className="relative z-10 flex-1">
                                            <div className="font-black text-xl italic tracking-tight mb-1">{item.name}</div>
                                            <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-muted-foreground/40">
                                                <span>{item.sku}</span>
                                                <span className="h-1.5 w-1.5 rounded-full bg-primary/20" />
                                                <span className="text-primary/60">{formatCurrency(item.price)}</span>
                                            </div>
                                        </div>

                                        <div className="relative z-10 flex items-center gap-6">
                                            <div className="flex items-center bg-primary/5 rounded-2xl p-1.5 border border-primary/5">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                                                    onClick={() => updateQuantity(item.productId, -1)}
                                                >
                                                    <Minus className="h-5 w-5" />
                                                </Button>
                                                <span className="w-12 text-center text-xl font-black italic">{item.quantity}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                                                    onClick={() => updateQuantity(item.productId, 1)}
                                                >
                                                    <Plus className="h-5 w-5" />
                                                </Button>
                                            </div>

                                            <div className="text-right min-w-[120px]">
                                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 mb-0.5">{t("Sales.subtotal")}</div>
                                                <div className="font-black text-2xl tracking-tighter text-primary">
                                                    {formatCurrency(item.price * item.quantity)}
                                                </div>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeFromCart(item.productId)}
                                                className="h-12 w-12 rounded-2xl text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 transition-all"
                                            >
                                                <Trash2 className="h-6 w-6" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {cart.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/20">
                                    <div className="p-10 bg-muted/30 rounded-full mb-6">
                                        <ShoppingCart className="h-20 w-20" />
                                    </div>
                                    <p className="font-black italic text-xl uppercase tracking-widest">{t("Sales.cart_empty")}</p>
                                    <p className="font-bold text-base mt-2">{t("Sales.add_products_to_start")}</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>

                <CardFooter className="flex-col p-10 gap-8 bg-card/40 backdrop-blur-2xl rounded-t-[3rem] border-t border-primary/10 shadow-2xl">
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Customer Info */}
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground px-2">
                                <User className="h-4 w-4 text-primary" />
                                {t("Sales.customer_name")}
                            </label>
                            <Input
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                placeholder={t("Sales.customer_name_placeholder")}
                                className="h-14 rounded-2xl border-primary/10 bg-card/40 px-6 font-bold focus-visible:ring-primary/20"
                            />
                        </div>

                        {/* Discount */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                                    <Percent className="h-4 w-4 text-primary" />
                                    {t("Sales.discount")}
                                </label>
                                {discountType !== "none" && (
                                    <Button variant="ghost" size="sm" onClick={() => setDiscountType("none")} className="h-6 text-[10px] font-black uppercase text-primary/40 hover:text-primary">
                                        {t("Common.cancel")}
                                    </Button>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <Select value={discountType} onValueChange={(v: "none" | "percentage" | "fixed") => {
                                    setDiscountType(v);
                                    if (v === "none") setDiscountValue(0);
                                }}>
                                    <SelectTrigger className="h-14 w-1/2 rounded-2xl border-primary/10 bg-card/40 px-6 font-black italic">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl">
                                        <SelectItem value="none" className="font-bold">{t("Sales.no_discount")}</SelectItem>
                                        <SelectItem value="percentage" className="font-bold">{t("Sales.percentage")} %</SelectItem>
                                        <SelectItem value="fixed" className="font-bold">{t("Sales.fixed_amount")}</SelectItem>
                                    </SelectContent>
                                </Select>
                                {discountType !== "none" && (
                                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex-1">
                                        <Input
                                            type="number"
                                            min={0}
                                            max={discountType === "percentage" ? 100 : subtotal}
                                            value={discountValue}
                                            onChange={(e) => setDiscountValue(Number(e.target.value))}
                                            className="h-14 rounded-2xl border-primary/10 bg-card/40 px-6 font-black text-xl text-primary text-center focus-visible:ring-primary/20"
                                        />
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Final Totals */}
                    <div className="w-full relative group/total">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-3xl blur opacity-10 group-hover/total:opacity-20 transition" />
                        <div className="relative bg-primary/[0.03] p-8 rounded-3xl border border-primary/10 space-y-4">
                            <div className="flex justify-between text-base font-black uppercase tracking-widest text-muted-foreground/60">
                                <span>{t("Sales.subtotal")}</span>
                                <span className="tracking-tighter">{formatCurrency(subtotal)}</span>
                            </div>
                            {discountAmount > 0 && (
                                <div className="flex justify-between text-base font-black uppercase tracking-widest text-emerald-500">
                                    <span>{t("Sales.discount")}</span>
                                    <span className="tracking-tighter">-{formatCurrency(discountAmount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-6 border-t border-primary/10">
                                <span className="font-black italic text-2xl tracking-tight text-foreground uppercase">{t("Sales.total_amount")}</span>
                                <div className="flex flex-col items-end">
                                    <div className="text-5xl font-black text-primary tracking-tighter italic">
                                        {formatCurrency(total)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Type */}
                    <div className="w-full">
                        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground px-2 mb-4">
                            <DollarSign className="h-4 w-4 text-primary" />
                            {t("Sales.payment_method") || "Payment Method"}
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setPaymentType("CASH")}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border-2 transition-all duration-300",
                                    paymentType === "CASH"
                                        ? "border-primary bg-primary/5 text-primary shadow-xl shadow-primary/10"
                                        : "border-primary/5 bg-card/40 hover:bg-card/60 hover:border-primary/20 text-muted-foreground"
                                )}
                            >
                                <DollarSign className="h-6 w-6" />
                                <span className="font-black text-[10px] uppercase tracking-widest">{t("Sales.cash")}</span>
                            </button>
                            <button
                                onClick={() => setPaymentType("DEFERRED")}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border-2 transition-all duration-300",
                                    paymentType === "DEFERRED"
                                        ? "border-primary bg-primary/5 text-primary shadow-xl shadow-primary/10"
                                        : "border-primary/5 bg-card/40 hover:bg-card/60 hover:border-primary/20 text-muted-foreground"
                                )}
                            >
                                <Clock className="h-6 w-6" />
                                <span className="font-black text-[10px] uppercase tracking-widest">{t("Sales.deferred") || "Installments"}</span>
                            </button>
                        </div>

                        {/* Installment Config */}
                        <AnimatePresence>
                            {paymentType === "DEFERRED" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="pt-4 space-y-6 overflow-hidden"
                                >
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
                                                {t("Sales.installments_count") || "Number of Payments"}
                                            </label>
                                            <div className="flex items-center bg-card/40 rounded-2xl p-2 border border-primary/10">
                                                <Button variant="ghost" size="icon" onClick={() => setInstallmentCount(Math.max(2, installmentCount - 1))} className="h-10 w-10">
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <span className="flex-1 text-center font-black text-xl">{installmentCount}</span>
                                                <Button variant="ghost" size="icon" onClick={() => setInstallmentCount(installmentCount + 1)} className="h-10 w-10">
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
                                                {t("Sales.interval_months") || "Monthly Interval"}
                                            </label>
                                            <div className="flex items-center bg-card/40 rounded-2xl p-2 border border-primary/10">
                                                <Button variant="ghost" size="icon" onClick={() => setInstallmentInterval(Math.max(1, installmentInterval - 1))} className="h-10 w-10">
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <span className="flex-1 text-center font-black text-xl">{installmentInterval}</span>
                                                <Button variant="ghost" size="icon" onClick={() => setInstallmentInterval(installmentInterval + 1)} className="h-10 w-10">
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10 border-dashed">
                                        <div className="flex justify-between items-center text-sm font-bold opacity-60 italic mb-2">
                                            <span>{t("Sales.per_installment") || "Amount per payment"}:</span>
                                            <span className="text-primary font-black text-lg">{formatCurrency(total / installmentCount)}</span>
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">
                                            {t("Sales.installment_plan_desc") || "First payment starting today, recurring monthly."}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Button
                        onClick={handleCheckout}
                        disabled={isPending || cart.length === 0 || !selectedWarehouse}
                        className="group relative w-full h-20 rounded-[2rem] bg-primary shadow-3xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-500 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        {isPending ? (
                            <div className="relative z-10 flex items-center gap-4">
                                <Loader2 className="h-8 w-8 animate-spin" />
                                <span className="font-black text-xl uppercase tracking-widest italic">{t("Sales.processing")}</span>
                            </div>
                        ) : (
                            <div className="relative z-10 flex items-center justify-center gap-4">
                                <span className="font-black text-xl uppercase tracking-widest italic">
                                    {paymentType === "DEFERRED" ? t("Sales.start_plan") || "Start Payment Plan" : t("Sales.complete_sale")}
                                </span>
                            </div>
                        )}
                    </Button>
                </CardFooter>
            </Card>

            {/* Removed Online Payment Dialog */}
        </div>
    );
}
