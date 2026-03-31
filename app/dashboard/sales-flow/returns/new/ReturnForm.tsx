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
import { Loader2, RotateCcw, AlertTriangle, Package, FileCheck, ClipboardList, TrendingDown, Info, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { createReturnAction, getReturnableItemsAction } from "@/_legacy_backend/actions/returns";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency, cn } from "@/lib/utils";

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
    currency: string;
}

export default function ReturnForm({ invoiceId, currency }: ReturnFormProps) {
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
    const selectedItemsTotal = invoiceData ? Array.from(selectedItems.entries()).reduce((sum: number, [productId, qty]) => {
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
                toast.success(t("Returns.success_msg", { token: result.token ?? "", }));
                router.push(`/dashboard/sales-flow/returns`);
            }
        });
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-8">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full scale-150 animate-pulse" />
                    <Loader2 className="h-16 w-16 animate-spin text-primary relative z-10" />
                </div>
                <div className="space-y-2 text-center">
                    <p className="font-black italic text-xl tracking-widest uppercase text-primary animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {t("Common.loading") || "Initalizing Return Protocol"}
                    </p>
                    <p className="text-muted-foreground font-medium animate-pulse">{t("Returns.loading_details") || "Synchronizing with cloud ledger..."}</p>
                </div>
            </div>
        );
    }

    if (!invoiceData || invoiceData.items.length === 0) {
        return (
            <Card className="border-none shadow-3xl bg-card/40 backdrop-blur-3xl rounded-[3rem] overflow-hidden animate-in zoom-in-95 duration-500">
                <CardContent className="flex flex-col items-center justify-center py-24 px-10 text-center relative group">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />
                    <div className="p-8 bg-yellow-500/10 rounded-[2rem] mb-10 group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-yellow-500/5">
                        <AlertTriangle className="h-20 w-20 text-yellow-500" />
                    </div>
                    <h3 className="text-4xl font-black italic tracking-tight mb-4">{t("Returns.no_items_available")}</h3>
                    <p className="text-muted-foreground max-w-md font-medium text-lg leading-relaxed">
                        {t("Returns.all_items_returned")}
                    </p>
                    <Button
                        variant="outline"
                        className="mt-12 h-16 px-12 rounded-2xl font-black border-primary/10 bg-card/40 backdrop-blur-xl hover:bg-primary/5 hover:border-primary/20 transition-all duration-500 group overflow-hidden"
                        onClick={() => router.back()}
                    >
                        <div className="relative z-10 flex items-center gap-3">
                            <RotateCcw className="h-6 w-6 text-primary group-hover:rotate-180 transition-transform duration-700" />
                            <span className="uppercase tracking-widest text-primary/70">{t("Common.back")}</span>
                        </div>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-12 lg:grid-cols-12 pb-24 text-start">
            {/* Items Selection */}
            <div className="lg:col-span-8 space-y-8">
                <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-3xl rounded-[3rem] overflow-hidden group">
                    <CardHeader className="p-12 pb-8 bg-primary/5 border-b border-primary/5 relative">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-primary/10 rounded-[1.5rem] shadow-xl shadow-primary/5 text-primary group-hover:scale-110 transition-all duration-500">
                                <Package className="h-8 w-8" />
                            </div>
                            <div>
                                <CardTitle className="text-3xl font-black italic tracking-tight uppercase">
                                    {t("Returns.select_items")}
                                </CardTitle>
                                <div className="flex items-center gap-3 mt-2">
                                    <Badge variant="outline" className="h-8 rounded-xl px-4 font-black border-primary/20 bg-primary/5 text-primary tracking-tighter text-base italic">
                                        #{invoiceData.invoiceToken}
                                    </Badge>
                                    <span className="text-muted-foreground font-medium text-sm">
                                        {t("Invoices.details")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-12 space-y-8">
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
                                        className={cn(
                                            "relative p-8 border-2 rounded-[2.5rem] transition-all duration-700 overflow-hidden",
                                            isSelected
                                                ? "border-primary bg-primary/[0.03] shadow-2xl shadow-primary/5"
                                                : "border-primary/5 bg-muted/20 hover:border-primary/20 hover:bg-muted/30"
                                        )}
                                    >
                                        <div className="flex items-center gap-8 relative z-10">
                                            <div
                                                onClick={() => toggleItem(item.productId, item.returnableQuantity)}
                                                className={cn(
                                                    "h-16 w-16 rounded-[1.25rem] flex items-center justify-center cursor-pointer transition-all duration-500",
                                                    isSelected
                                                        ? "bg-primary text-white scale-110 shadow-xl shadow-primary/20 rotate-6"
                                                        : "bg-card border-2 border-primary/10 hover:border-primary/30"
                                                )}
                                            >
                                                {isSelected ? (
                                                    <CheckCircle2 className="h-8 w-8" />
                                                ) : (
                                                    <div className="h-4 w-4 rounded-sm border-2 border-primary/20" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <Label
                                                    onClick={() => toggleItem(item.productId, item.returnableQuantity)}
                                                    className="text-2xl font-black italic tracking-tight block cursor-pointer group-hover:text-primary transition-colors truncate"
                                                >
                                                    {item.productName}
                                                </Label>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">{item.productSku}</span>
                                                    {item.returnedQuantity > 0 && (
                                                        <Badge variant="secondary" className="h-6 rounded-lg px-2 text-[10px] font-black uppercase tracking-widest bg-yellow-500/10 text-yellow-600 border border-yellow-500/10">
                                                            {t("Returns.already_returned", { count: item.returnedQuantity })}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="text-2xl font-black italic tracking-tighter text-primary">
                                                        {formatCurrency(item.price)}
                                                    </span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                                                        {t("Invoices.price")}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <AnimatePresence>
                                            {isSelected && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="mt-10 pt-10 border-t border-primary/10 relative z-10"
                                                >
                                                    <div className="flex flex-col sm:flex-row sm:items-end gap-8">
                                                        <div className="w-full sm:w-48 space-y-4">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Info className="h-4 w-4 text-primary" />
                                                                <Label className="font-black text-[10px] uppercase tracking-widest text-primary/60">{t("Returns.return_qty")}</Label>
                                                            </div>
                                                            <div className="relative group">
                                                                <Input
                                                                    type="number"
                                                                    min={1}
                                                                    max={item.returnableQuantity}
                                                                    value={selectedQty}
                                                                    onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 0, item.returnableQuantity)}
                                                                    className="h-16 rounded-2xl bg-card border-2 border-primary/20 focus:border-primary text-center font-black text-2xl shadow-inner group-hover:border-primary/40 transition-all placeholder:text-muted-foreground/20"
                                                                />
                                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1 items-center">
                                                                    <div className="w-1 h-3 bg-primary/20 rounded-full" />
                                                                    <div className="w-1 h-1 bg-primary/20 rounded-full" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 pb-4">
                                                            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                                                                <span className="text-sm font-bold text-muted-foreground">
                                                                    {t("Returns.available_for_return")}
                                                                </span>
                                                                <span className="font-black text-primary px-3 py-1 bg-white rounded-xl shadow-sm italic tabular-nums">
                                                                    {item.returnableQuantity}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Background Decoration */}
                                        <div className={cn(
                                            "absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-primary/5 to-transparent transition-opacity duration-700",
                                            isSelected ? "opacity-100" : "opacity-0"
                                        )} />
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </CardContent>
                </Card>
            </div>

            {/* Return Summary Side Panel */}
            <div className="lg:col-span-4 space-y-8">
                <Card className="border-none shadow-3xl bg-card/70 backdrop-blur-3xl rounded-[3rem] overflow-hidden sticky top-12 border border-white/10 group">
                    <CardHeader className="p-10 pb-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-b border-primary/5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/50 rounded-2xl shadow-sm text-primary">
                                <ClipboardList className="h-7 w-7" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black italic tracking-tight uppercase">{t("Returns.summary")}</CardTitle>
                                <div className="h-1 w-12 bg-primary/30 rounded-full mt-1" />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-10 space-y-10">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">{t("Returns.return_reason")} *</Label>
                                    <div className="p-1 bg-primary/10 rounded-lg">
                                        <Info className="h-3.5 w-3.5 text-primary" />
                                    </div>
                                </div>
                                <Textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder={t("Returns.return_reason_placeholder")}
                                    className="rounded-[1.5rem] bg-muted/40 border-2 border-transparent focus:border-primary/30 transition-all resize-none font-bold text-lg p-6 min-h-[140px] shadow-inner focus:bg-white/50"
                                />
                            </div>
                            <div className="space-y-4">
                                <Label className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">{t("Returns.additional_notes")}</Label>
                                <Textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder={t("Returns.notes_placeholder")}
                                    className="rounded-[1.5rem] bg-muted/40 border-2 border-transparent focus:border-primary/30 transition-all resize-none font-medium p-6 min-h-[100px] shadow-inner focus:bg-white/50"
                                />
                            </div>
                        </div>

                        <Separator className="bg-primary/5" />

                        <div className="space-y-6">
                            <div className="flex justify-between items-center px-2 group/val">
                                <span className="text-sm font-bold text-muted-foreground group-hover/val:text-primary transition-colors">{t("Returns.items_value")}</span>
                                <span className="font-black text-xl italic tracking-tighter tabular-nums">{formatCurrency(selectedItemsTotal)}</span>
                            </div>

                            <AnimatePresence>
                                {discountShare > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="flex justify-between items-center px-6 py-4 rounded-2xl bg-orange-500/5 text-orange-600 border border-orange-500/10 shadow-lg shadow-orange-500/5 relative overflow-hidden group/warn"
                                    >
                                        <div className="absolute inset-y-0 left-0 w-1 bg-orange-500/30" />
                                        <span className="text-xs font-black uppercase tracking-widest flex items-center gap-2 italic">
                                            <TrendingDown className="h-4 w-4 animate-bounce" />
                                            {t("Returns.proportional_discount")}
                                        </span>
                                        <span className="font-black italic tabular-nums">-{formatCurrency(discountShare)}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="relative group/refund">
                                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-transparent rounded-[2rem] blur-xl opacity-0 group-hover/refund:opacity-100 transition-opacity duration-700" />
                                <div className="relative flex flex-col gap-2 p-8 rounded-[2rem] bg-emerald-500/10 border-2 border-emerald-500/20 shadow-2xl shadow-emerald-500/5 overflow-hidden">
                                    <div className="absolute -right-4 -top-4 p-8 bg-emerald-500/5 rounded-full blur-2xl" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600/60 leading-none mb-1">{t("Returns.refund_amount")}</span>
                                    <div className="flex items-baseline justify-between gap-4">
                                        <span className="text-5xl font-black text-emerald-700 italic tracking-tighter tabular-nums drop-shadow-sm">
                                            {formatCurrency(estimatedRefund)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {discountShare > 0 && (
                            <div className="p-6 bg-orange-500/5 border border-orange-500/10 rounded-[1.5rem] flex items-start gap-4 animate-in slide-in-from-right-4 duration-700">
                                <div className="p-2 bg-orange-500/20 rounded-xl shrink-0 shadow-lg shadow-orange-500/5">
                                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                                </div>
                                <p className="text-[10px] font-black text-orange-700/80 leading-relaxed uppercase tracking-tighter italic">
                                    {t("Returns.refund_discount_warning")}
                                </p>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="p-10 pt-0">
                        <Button
                            onClick={handleSubmit}
                            disabled={isPending || selectedItems.size === 0 || !reason.trim()}
                            className={cn(
                                "w-full h-20 rounded-[1.75rem] font-black text-xl italic gap-4 shadow-2xl transition-all duration-700 group/btn relative overflow-hidden",
                                isPending || selectedItems.size === 0 || !reason.trim()
                                    ? "bg-muted border-2 border-muted-foreground/10 text-muted-foreground/40"
                                    : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-2 active:scale-95"
                            )}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                            {isPending ? (
                                <>
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                    <span className="tracking-widest uppercase text-base">{t("Common.processing")}</span>
                                </>
                            ) : (
                                <>
                                    <FileCheck className="h-8 w-8 group-hover:scale-110 transition-transform duration-500" />
                                    <span className="tracking-widest uppercase">{t("Returns.process_return")}</span>
                                    <Sparkles className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity absolute right-8 top-4 animate-pulse" />
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
