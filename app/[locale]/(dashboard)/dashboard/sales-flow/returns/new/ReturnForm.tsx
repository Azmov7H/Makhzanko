"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, RotateCcw, AlertTriangle, Package, FileCheck, ClipboardList, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import { createReturnAction, getReturnableItemsAction } from "@/actions/returns";
import { motion, AnimatePresence } from "framer-motion";

interface ReturnableItem {
    productId: string;
    productName: string;
    productSku: string;
    originalQuantity: number;
    returnedQuantity: number;
    returnableQuantity: number;
    price: number;
}

interface ReturnFormProps {
    invoiceId: string;
    locale: string;
    currency: string;
}

export default function ReturnForm({ invoiceId, locale, currency }: ReturnFormProps) {
    const { t } = useI18n();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(true);

    const [invoiceData, setInvoiceData] = useState<{
        invoiceToken: string;
        invoiceSubtotal: number;
        invoiceDiscountAmount: number;
        invoiceTotal: number;
        items: ReturnableItem[];
    } | null>(null);

    const [selectedItems, setSelectedItems] = useState<Map<string, number>>(new Map());
    const [reason, setReason] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const result = await getReturnableItemsAction(invoiceId);
            if ("error" in result) {
                toast.error(result.error);
                return;
            }
            setInvoiceData({
                ...result,
                invoiceToken: result.invoiceToken || "N/A",
            });
            setIsLoading(false);
        };
        fetchData();
    }, [invoiceId]);

    const toggleItem = (productId: string, maxQty: number) => {
        setSelectedItems(prev => {
            const newMap = new Map(prev);
            if (newMap.has(productId)) {
                newMap.delete(productId);
            } else {
                newMap.set(productId, maxQty);
            }
            return newMap;
        });
    };

    const updateQuantity = (productId: string, qty: number, maxQty: number) => {
        setSelectedItems(prev => {
            const newMap = new Map(prev);
            if (qty <= 0) {
                newMap.delete(productId);
            } else {
                newMap.set(productId, Math.min(qty, maxQty));
            }
            return newMap;
        });
    };

    // Calculate refund preview
    const selectedItemsTotal = invoiceData ? Array.from(selectedItems.entries()).reduce((sum, [productId, qty]) => {
        const item = invoiceData.items.find(i => i.productId === productId);
        return sum + (item?.price || 0) * qty;
    }, 0) : 0;

    const proportion = invoiceData && invoiceData.invoiceSubtotal > 0
        ? selectedItemsTotal / invoiceData.invoiceSubtotal
        : 0;
    const discountShare = invoiceData ? invoiceData.invoiceDiscountAmount * proportion : 0;
    const estimatedRefund = selectedItemsTotal - discountShare;

    const handleSubmit = () => {
        if (selectedItems.size === 0) {
            toast.error(t("Returns.select_items_error"));
            return;
        }
        if (!reason.trim()) {
            toast.error(t("Returns.provide_reason_error"));
            return;
        }

        startTransition(async () => {
            const items = Array.from(selectedItems.entries()).map(([productId, quantity]) => ({
                productId,
                quantity,
            }));

            const result = await createReturnAction({
                invoiceId,
                items,
                reason: reason.trim(),
                notes: notes.trim() || undefined,
            });

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(t("Returns.success_msg", { token: result.token?? "", }));
                router.push(`/${locale}/dashboard/sales-flow/returns`);
            }
        });
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary opacity-50" />
                <p className="font-bold text-muted-foreground animate-pulse tracking-widest uppercase text-xs">Loading Secure Return Hub</p>
            </div>
        );
    }

    if (!invoiceData || invoiceData.items.length === 0) {
        return (
            <Card className="border-none shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden">
                <CardContent className="flex flex-col items-center justify-center py-20 px-10 text-center">
                    <div className="p-6 bg-yellow-500/10 rounded-full mb-8">
                        <AlertTriangle className="h-16 w-16 text-yellow-500" />
                    </div>
                    <h3 className="text-2xl font-black mb-2">{t("Returns.no_items_available")}</h3>
                    <p className="text-muted-foreground max-w-sm font-medium">
                        {t("Returns.all_items_returned")}
                    </p>
                    <Button
                        variant="ghost"
                        className="mt-10 h-14 px-10 rounded-2xl font-black border-2 border-primary/10 hover:bg-primary/5 transition-all"
                        onClick={() => router.back()}
                    >
                        {t("Common.back") || "Go Back"}
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-8 lg:grid-cols-3 pb-20 text-start">
            {/* Items Selection */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="border-none shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-10 pb-6 relative">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-primary/10 rounded-2xl">
                                <Package className="h-7 w-7 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-3xl font-black uppercase tracking-tight">
                                    {t("Returns.select_items")}
                                </CardTitle>
                                <p className="text-muted-foreground font-medium mt-1">
                                    {t("Returns.invoice")}: <span className="font-mono font-black text-primary bg-primary/5 px-2 py-0.5 rounded-lg">{invoiceData.invoiceToken}</span>
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-10 pt-4 space-y-6">
                        <AnimatePresence mode="popLayout">
                            {invoiceData.items.map((item, idx) => {
                                const isSelected = selectedItems.has(item.productId);
                                const selectedQty = selectedItems.get(item.productId) || 0;

                                return (
                                    <motion.div
                                        key={item.productId}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className={`p-6 border-2 rounded-[2rem] transition-all duration-500 overflow-hidden relative group ${isSelected
                                                ? "border-primary bg-primary/5 shadow-xl shadow-primary/5"
                                                : "border-primary/5 bg-muted/20 hover:border-primary/20 hover:bg-muted/30"
                                            }`}
                                    >
                                        <div className="flex items-center gap-6 relative z-10">
                                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isSelected ? 'bg-primary text-white scale-110 rotate-12' : 'bg-card border-2 border-primary/10'}`}>
                                                <Checkbox
                                                    id={`item-${item.productId}`}
                                                    checked={isSelected}
                                                    onCheckedChange={() => toggleItem(item.productId, item.returnableQuantity)}
                                                    className={`h-6 w-6 rounded-lg transition-all ${isSelected ? 'border-none bg-transparent' : 'border-primary/20'}`}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <Label htmlFor={`item-${item.productId}`} className="text-lg font-black block cursor-pointer group-hover:text-primary transition-colors">{item.productName}</Label>
                                                <p className="text-sm text-muted-foreground font-mono font-bold tracking-widest">{item.productSku}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-black">{item.price.toLocaleString()} {currency}</p>
                                                {item.returnedQuantity > 0 && (
                                                    <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-widest rounded-lg mt-2 px-3">
                                                        {t("Returns.already_returned", { count: item.returnedQuantity })}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <AnimatePresence>
                                            {isSelected && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="mt-8 pt-8 border-t border-primary/10 relative z-10"
                                                >
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                                                        <div className="space-y-2">
                                                            <Label className="font-black text-xs uppercase tracking-widest text-primary/60 ml-1">{t("Returns.return_qty")}</Label>
                                                            <div className="flex items-center gap-4">
                                                                <Input
                                                                    type="number"
                                                                    min={1}
                                                                    max={item.returnableQuantity}
                                                                    value={selectedQty}
                                                                    onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 0, item.returnableQuantity)}
                                                                    className="w-28 h-12 rounded-xl bg-card border-2 border-primary/10 focus:border-primary text-center font-black text-lg shadow-inner"
                                                                />
                                                                <span className="text-sm font-bold text-muted-foreground bg-primary/5 px-4 py-2 rounded-xl border border-primary/5">
                                                                    {t("Returns.available", { count: item.returnableQuantity })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </CardContent>
                </Card>
            </div>

            {/* Return Summary Side Panel */}
            <div className="space-y-6">
                <Card className="border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] bg-card/60 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden sticky top-6">
                    <CardHeader className="p-8 pb-4 relative">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-green-500/10 rounded-xl">
                                <ClipboardList className="h-6 w-6 text-green-600" />
                            </div>
                            <CardTitle className="text-2xl font-black uppercase tracking-tight">{t("Returns.summary") || "Return Summary"}</CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent className="p-8 space-y-8">
                        <div className="space-y-4">
                            <div className="space-y-2.5">
                                <Label className="font-black text-xs uppercase tracking-widest text-muted-foreground ml-1">{t("Returns.return_reason")} *</Label>
                                <Textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder={t("Returns.return_reason_placeholder")}
                                    className="rounded-2xl bg-muted/30 border-2 border-transparent focus:border-primary/20 transition-all resize-none font-medium h-24"
                                />
                            </div>
                            <div className="space-y-2.5">
                                <Label className="font-black text-xs uppercase tracking-widest text-muted-foreground ml-1">{t("Returns.additional_notes")}</Label>
                                <Textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder={t("Returns.notes_placeholder")}
                                    className="rounded-2xl bg-muted/30 border-2 border-transparent focus:border-primary/20 transition-all resize-none font-medium h-20"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 mt-6 border-t border-primary/5">
                            <div className="flex justify-between items-center px-2">
                                <span className="text-sm font-bold text-muted-foreground">{t("Returns.items_value")}</span>
                                <span className="font-black text-lg">{selectedItemsTotal.toLocaleString()} {currency}</span>
                            </div>

                            {discountShare > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex justify-between items-center px-4 py-3 rounded-2xl bg-orange-500/5 text-orange-600 border border-orange-500/10"
                                >
                                    <span className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                        <TrendingDown className="h-4 w-4" />
                                        {t("Returns.proportional_discount")}
                                    </span>
                                    <span className="font-black">-{discountShare.toFixed(2)} {currency}</span>
                                </motion.div>
                            )}

                            <div className="flex flex-col gap-1 p-6 rounded-[1.5rem] bg-emerald-500/10 border-2 border-emerald-500/20 shadow-xl shadow-emerald-500/5 mt-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600/60 leading-none mb-2">{t("Returns.refund_amount")}</span>
                                <div className="flex items-baseline justify-between">
                                    <span className="text-3xl font-black text-emerald-700 tabular-nums">
                                        {estimatedRefund.toFixed(2)}
                                    </span>
                                    <span className="text-sm font-black text-emerald-600 tracking-widest">{currency}</span>
                                </div>
                            </div>
                        </div>

                        {discountShare > 0 && (
                            <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl flex items-start gap-3">
                                <div className="p-1.5 bg-orange-500/20 rounded-lg shrink-0">
                                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                                </div>
                                <p className="text-[10px] font-bold text-orange-700 leading-relaxed uppercase tracking-tighter">
                                    {t("Returns.refund_discount_warning")}
                                </p>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="p-8 pt-0">
                        <Button
                            onClick={handleSubmit}
                            disabled={isPending || selectedItems.size === 0 || !reason.trim()}
                            className={`w-full h-16 rounded-[1.5rem] font-black text-lg gap-3 shadow-2xl transition-all duration-500 ${isPending || selectedItems.size === 0 || !reason.trim()
                                    ? 'bg-muted border-2 border-muted-foreground/10'
                                    : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20 hover:-translate-y-1'
                                }`}
                            size="lg"
                        >
                            {isPending ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                <FileCheck className="h-6 w-6" />
                            )}
                            {t("Returns.process_return")}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
