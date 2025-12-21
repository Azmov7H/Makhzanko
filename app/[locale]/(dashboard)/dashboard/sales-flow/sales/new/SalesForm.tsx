"use client";

import { createSaleAction } from "@/actions/sales";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Trash2, CreditCard, Plus, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export default function SalesForm({ products, warehouses }: { products: any[]; warehouses: any[] }) {
    const { t, locale } = useI18n();
    const [cart, setCart] = useState<any[]>([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState(warehouses[0]?.id || "");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

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
            alert(t("Sales.select_warehouse_error"));
            return;
        }
        if (cart.length === 0) return;

        startTransition(async () => {
            const result = await createSaleAction({
                warehouseId: selectedWarehouse,
                items: cart.map(item => ({ productId: item.productId, quantity: item.quantity, price: item.price }))
            });

            if (result.error) {
                alert(result.error);
            } else {
                router.push(`/${locale}/dashboard/sales-flow/sales`);
            }
        });
    };

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 h-[calc(100vh-180px)] min-h-[600px]">
            {/* Product List */}
            <Card className="flex flex-col h-full overflow-hidden border-none shadow-sm bg-muted/30">
                <CardHeader className="bg-background/50 border-b">
                    <CardTitle className="text-xl">{t("Sales.products_list")}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto p-6">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        {products.map((product, idx) => (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                key={product.id}
                                onClick={() => addToCart(product.id)}
                                className="group flex flex-col items-start justify-between rounded-xl border bg-card p-4 text-left transition-all hover:shadow-md hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary active:scale-95"
                            >
                                <div className="w-full">
                                    <span className="font-semibold text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                        {product.name}
                                    </span>
                                    <Badge variant="outline" className="mt-2 font-mono text-[10px] opacity-70">
                                        {product.sku}
                                    </Badge>
                                </div>
                                <div className="mt-4 flex w-full items-end justify-between">
                                    <span className="text-lg font-bold text-primary">
                                        {Number(product.price).toLocaleString()} <span className="text-[10px] font-normal text-muted-foreground uppercase">{t("Common.currency")}</span>
                                    </span>
                                    <div className="rounded-full bg-primary/10 p-1.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Plus className="h-4 w-4" />
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                        {products.length === 0 && (
                            <div className="col-span-full py-20 text-center text-muted-foreground">
                                {t("Sales.no_products_found")}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Cart & Checkout */}
            <Card className="flex flex-col h-full overflow-hidden border-primary/10 shadow-lg">
                <CardHeader className="border-b bg-card pb-4">
                    <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5 text-primary" />
                            {t("Sales.current_order")}
                        </span>
                        <Badge variant="primary" className="bg-primary text-primary-foreground">
                            {cart.length} {t("Sales.items_label")}
                        </Badge>
                    </CardTitle>
                    <div className="pt-4">
                        <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                            <SelectTrigger className="w-full bg-muted/50">
                                <SelectValue placeholder={t("Sales.select_warehouse")} />
                            </SelectTrigger>
                            <SelectContent>
                                {warehouses.map(w => (
                                    <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-hidden p-0 bg-muted/5">
                    <ScrollArea className="h-full">
                        <div className="p-4 space-y-3">
                            <AnimatePresence initial={false}>
                                {cart.map((item) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        key={item.productId}
                                        className="flex items-center justify-between p-4 bg-card rounded-xl border shadow-sm"
                                    >
                                        <div className="flex-1">
                                            <div className="font-bold text-sm">{item.name}</div>
                                            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                                                <span className="font-mono">{item.sku}</span>
                                                <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                                                <span>{item.price.toLocaleString()} {t("Common.currency")}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center bg-muted rounded-lg p-1 border">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() => updateQuantity(item.productId, -1)}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() => updateQuantity(item.productId, 1)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>

                                            <div className="font-bold text-sm min-w-[80px] text-right text-primary">
                                                {(item.price * item.quantity).toLocaleString()}
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeFromCart(item.productId)}
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {cart.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center py-20 text-muted-foreground"
                                >
                                    <div className="rounded-full bg-muted p-6 mb-4">
                                        <ShoppingCart className="h-12 w-12 opacity-20" />
                                    </div>
                                    <p className="font-medium">{t("Sales.cart_empty")}</p>
                                    <p className="text-xs mt-1">{t("Sales.add_products_to_start")}</p>
                                </motion.div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>

                <CardFooter className="flex-col border-t bg-card p-6 gap-4">
                    <div className="flex w-full justify-between items-center bg-primary/5 p-4 rounded-xl border border-primary/10">
                        <span className="text-muted-foreground font-medium">{t("Sales.total_amount")}</span>
                        <div className="text-2xl font-black text-primary">
                            {total.toLocaleString()} <span className="text-xs font-normal uppercase">{t("Common.currency")}</span>
                        </div>
                    </div>

                    <Button
                        onClick={handleCheckout}
                        disabled={isPending || cart.length === 0 || !selectedWarehouse}
                        className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                        size="lg"
                    >
                        {isPending ? (
                            <div className="flex items-center gap-2">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    className="h-5 w-5 border-2 border-white/50 border-t-white rounded-full"
                                />
                                {t("Sales.processing")}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                {t("Sales.complete_sale")}
                            </div>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
