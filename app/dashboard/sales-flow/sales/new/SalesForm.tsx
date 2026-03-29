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
import { ShoppingCart, Trash2, CreditCard, Plus, Minus, Search, Package, User, Sparkles, Receipt, Percent, DollarSign, Loader2, Clock, X, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n/context";
import { cn, formatCurrency } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

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
    const [isCartOpen, setIsCartOpen] = useState(false);

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
        toast.success(t("Products.added_to_cart") || "Added to cart", {
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
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 min-h-[70vh]">
            {/* Main Section: Product Discovery */}
            <div className="flex-1 space-y-8 min-w-0">
                {/* Search & Warehouse Selection Bar */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 group/search">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 group-focus-within/search:text-primary transition-colors" />
                        <Input
                            placeholder={t("Sales.search_placeholder") || "Search products..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-14 pl-12 rounded-2xl border-primary/5 bg-card/40 backdrop-blur-xl font-bold focus-visible:ring-primary/20 shadow-xl shadow-primary/5 transition-all"
                        />
                    </div>
                    <div className="w-full md:w-64">
                        <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                            <SelectTrigger className="h-14 rounded-2xl border-primary/5 bg-card/40 backdrop-blur-xl font-bold px-5">
                                <div className="flex items-center gap-3">
                                    <Package className="h-4 w-4 text-primary/40" />
                                    <SelectValue placeholder={t("Sales.select_warehouse")} />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-primary/10 shadow-3xl">
                                {warehouses.map(w => (
                                    <SelectItem key={w.id} value={w.id} className="rounded-xl font-bold">{w.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Product Grid */}
                <ScrollArea className="h-[60vh] lg:h-[70vh] pr-4 -mr-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
                        {filteredProducts.map((product, idx) => (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.02 }}
                                key={product.id}
                                onClick={() => addToCart(product.id)}
                                className="group relative flex flex-col bg-card/40 hover:bg-card/80 backdrop-blur-xl rounded-[2rem] border border-primary/5 p-6 transition-all hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <Badge variant="outline" className="rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter border-primary/10 bg-primary/5 text-primary/40">
                                        {product.sku}
                                    </Badge>
                                    <div className="h-8 w-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary/40 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                        <Plus className="h-4 w-4" />
                                    </div>
                                </div>
                                <h3 className="font-black text-lg tracking-tight mb-4 text-left line-clamp-2 min-h-[3.5rem]">
                                    {product.name}
                                </h3>
                                <div className="mt-auto flex items-center justify-between">
                                    <div className="flex flex-col text-left">
                                        <span className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest leading-none mb-1">{t("Inventory.price")}</span>
                                        <span className="text-xl font-black text-primary tracking-tighter">
                                            {formatCurrency(Number(product.price))}
                                        </span>
                                    </div>
                                    <div className="text-[10px] font-bold text-muted-foreground/40 bg-muted/30 px-2 py-1 rounded-md">
                                        {product._count?.stocks || 0} in stock
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Sidebar Section: Cart & Summary */}
            <div className="hidden lg:block w-full lg:w-[450px] space-y-6">
                <div className="sticky top-24">
                    <Card className="border-none shadow-3xl bg-card/40 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="p-8 border-b border-white/5 space-y-1">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl font-black italic tracking-tight flex items-center gap-3">
                                    <Receipt className="h-6 w-6 text-primary" />
                                    {t("Sales.current_order")}
                                </CardTitle>
                                <Badge className="rounded-xl px-4 py-1.5 bg-primary font-black shadow-lg shadow-primary/20">
                                    {cart.length}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ScrollArea className="h-[40vh] px-8">
                                <div className="py-8 space-y-6">
                                    {cart.map((item) => (
                                        <div key={item.productId} className="flex items-center gap-4 group/item">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-sm truncate">{item.name}</h4>
                                                <div className="text-[10px] font-black uppercase text-primary/40 tracking-widest">
                                                    {formatCurrency(item.price)}
                                                </div>
                                            </div>
                                            <div className="flex items-center bg-primary/5 rounded-xl p-1">
                                                <button onClick={() => updateQuantity(item.productId, -1)} className="p-1.5 hover:text-primary transition-colors"><Minus className="h-3 w-3" /></button>
                                                <span className="w-8 text-center text-sm font-black italic">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.productId, 1)} className="p-1.5 hover:text-primary transition-colors"><Plus className="h-3 w-3" /></button>
                                            </div>
                                            <button onClick={() => removeFromCart(item.productId)} className="p-2 text-muted-foreground/30 hover:text-destructive hover:bg-destructive/5 rounded-lg transition-all"><Trash2 className="h-4 w-4" /></button>
                                        </div>
                                    ))}
                                    {cart.length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground/20 italic">
                                            <ShoppingCart className="h-12 w-12 mb-4 opacity-10" />
                                            <p className="text-sm font-bold uppercase tracking-widest">{t("Sales.cart_empty")}</p>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </CardContent>
                        <CardFooter className="flex-col p-8 gap-6 bg-primary/[0.02] border-t border-white/5">
                            {/* Summary Totals */}
                            <div className="w-full space-y-3">
                                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-muted-foreground/50">
                                    <span>{t("Sales.subtotal")}</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-emerald-500">
                                        <span>{t("Sales.discount")}</span>
                                        <span>-{formatCurrency(discountAmount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                    <span className="font-black italic text-xl text-foreground uppercase tracking-tight">{t("Sales.total_amount")}</span>
                                    <span className="text-3xl font-black text-primary tracking-tighter italic">
                                        {formatCurrency(total)}
                                    </span>
                                </div>
                            </div>

                            {/* Actions & Config */}
                            <div className="w-full space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <Input
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        placeholder={t("Sales.customer_name_placeholder")}
                                        className="h-12 rounded-xl border-primary/5 bg-card px-4 font-bold text-sm"
                                    />
                                    <Select value={paymentType} onValueChange={(v: any) => setPaymentType(v)}>
                                        <SelectTrigger className="h-12 rounded-xl border-primary/5 bg-card font-black text-xs uppercase">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="CASH" className="font-bold text-xs">{t("Sales.cash") || "CASH"}</SelectItem>
                                            <SelectItem value="DEFERRED" className="font-bold text-xs">{t("Sales.deferred") || "DEFERRED"}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button
                                    onClick={handleCheckout}
                                    disabled={isPending || cart.length === 0}
                                    className="w-full h-16 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    {isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : (paymentType === "DEFERRED" ? t("Sales.start_plan") : t("Sales.complete_sale"))}
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            {/* Mobile Bottom Navigation Bar (Floating Trigger for Sheets/Modal) */}
            <div className="lg:hidden fixed bottom-6 left-6 right-6 z-40">
                <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                    <SheetTrigger asChild>
                        <Button className="w-full h-16 rounded-[2rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl flex items-center justify-between px-8 border border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <ShoppingCart className="h-6 w-6" />
                                    {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-primary text-white h-5 w-5 rounded-full text-[10px] flex items-center justify-center font-black animate-pulse">{cart.length}</span>}
                                </div>
                                <span className="font-black text-xs uppercase tracking-[0.2em]">{t("Sales.current_order")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-black text-lg italic tracking-tighter">{formatCurrency(total)}</span>
                                <ChevronRight className="h-5 w-5 opacity-30" />
                            </div>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[85vh] rounded-t-[3rem] bg-card/95 backdrop-blur-3xl border-none p-0 flex flex-col overflow-hidden">
                        <SheetHeader className="p-8 border-b border-white/5 bg-primary/5">
                            <div className="flex items-center justify-between">
                                <SheetTitle className="text-2xl font-black italic tracking-tight">{t("Sales.order_summary") || "Order Summary"}</SheetTitle>
                                <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)} className="rounded-full bg-muted/50"><X className="h-5 w-5" /></Button>
                            </div>
                        </SheetHeader>

                        <ScrollArea className="flex-1 px-8">
                            <div className="py-8 space-y-6">
                                {cart.map((item) => (
                                    <div key={item.productId} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="flex-1 min-w-0 pr-4">
                                            <h4 className="font-black text-lg truncate mb-1">{item.name}</h4>
                                            <p className="text-xs font-bold text-primary italic">{formatCurrency(item.price)} × {item.quantity}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center bg-primary/10 rounded-xl p-1">
                                                <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.productId, -1)} className="h-10 w-10"><Minus className="h-4 w-4" /></Button>
                                                <span className="w-10 text-center font-black text-lg italic">{item.quantity}</span>
                                                <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.productId, 1)} className="h-10 w-10"><Plus className="h-4 w-4" /></Button>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.productId)} className="text-destructive/40 hover:text-destructive hover:bg-destructive/10"><Trash2 className="h-5 w-5" /></Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <div className="p-8 bg-black/5 dark:bg-white/5 space-y-6">
                            {/* Summary Inputs for Mobile */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    placeholder={t("Sales.customer_name_placeholder")}
                                    className="h-14 rounded-2xl bg-card font-bold border-primary/10"
                                />
                                <div className="flex gap-4">
                                    <Select value={discountType} onValueChange={(v: any) => setDiscountType(v)}>
                                        <SelectTrigger className="h-14 flex-1 rounded-2xl bg-card font-black uppercase text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">No Discount</SelectItem>
                                            <SelectItem value="percentage">Percentage</SelectItem>
                                            <SelectItem value="fixed">Fixed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {discountType !== "none" && (
                                        <Input
                                            type="number"
                                            value={discountValue}
                                            onChange={(e) => setDiscountValue(Number(e.target.value))}
                                            className="h-14 w-24 rounded-2xl text-center font-black text-lg"
                                        />
                                    )}
                                </div>
                                <Select value={paymentType} onValueChange={(v: any) => setPaymentType(v)}>
                                    <SelectTrigger className="h-14 rounded-2xl bg-card font-black uppercase text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CASH">{t("Sales.cash")}</SelectItem>
                                        <SelectItem value="DEFERRED">{t("Sales.deferred")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                onClick={handleCheckout}
                                disabled={isPending || cart.length === 0}
                                className="w-full h-16 rounded-[2rem] bg-primary text-white font-black text-xl shadow-2xl"
                            >
                                {isPending ? <Loader2 className="h-6 w-6 animate-spin mr-3" /> : null}
                                {t("Sales.complete_sale")} ({formatCurrency(total)})
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
