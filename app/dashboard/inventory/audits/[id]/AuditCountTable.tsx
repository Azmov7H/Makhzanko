"use client";

import { updateCountLineAction, finalizeInventoryCountAction } from "@/_legacy_backend/actions/audit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, CheckCircle, Package, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export default function AuditCountTable({ count }: { count: any }) {
    const [isFinalizing, startFinalizing] = useTransition();
    const router = useRouter();
    const { t } = useI18n();

    const handleUpdate = async (lineId: string, qty: number) => {
        await updateCountLineAction(lineId, qty);
        toast.success(t("Common.success"), {
            duration: 1000,
            className: "rounded-2xl border-none bg-emerald-500 text-white font-black italic shadow-2xl",
        });
        router.refresh();
    };

    const handleFinalize = () => {
        if (!confirm(t("Common.are_you_sure"))) return;

        startFinalizing(async () => {
            const result = await finalizeInventoryCountAction(count.id);
            if (result?.error) {
                toast.error(result.error, {
                    className: "rounded-2xl border-none bg-destructive text-white font-black italic shadow-2xl",
                });
            } else {
                toast.success(t("Inventory.audit_completed"), {
                    className: "rounded-2xl border-none bg-emerald-500 text-white font-black italic shadow-2xl",
                });
                router.refresh();
            }
        });
    };

    const isCompleted = count.status === "COMPLETED";

    return (
        <div className="space-y-10">
            {!isCompleted && (
                <div className="flex justify-end">
                    <Button
                        onClick={handleFinalize}
                        disabled={isFinalizing}
                        className="h-16 px-10 rounded-2xl bg-emerald-500 hover:bg-emerald-600 shadow-2xl shadow-emerald-500/20 transition-all hover:scale-105 group"
                    >
                        {isFinalizing ? (
                            <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                        ) : (
                            <CheckCircle className="mr-3 h-6 w-6 transition-transform group-hover:scale-110" />
                        )}
                        <span className="font-black text-xs uppercase tracking-widest">{t("Inventory.finalize_audit")}</span>
                    </Button>
                </div>
            )}

            <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-3xl rounded-[3rem] overflow-hidden group">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow className="h-20 hover:bg-transparent border-primary/5">
                                <TableHead className="px-10 text-xs font-black uppercase tracking-widest">{t("Inventory.product")}</TableHead>
                                <TableHead className="text-right text-xs font-black uppercase tracking-widest">{t("Inventory.system_qty")}</TableHead>
                                <TableHead className="w-[200px] text-right text-xs font-black uppercase tracking-widest">{t("Inventory.counted_qty")}</TableHead>
                                <TableHead className="px-10 text-right text-xs font-black uppercase tracking-widest">{t("Inventory.difference")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {count.lines.map((line: any) => (
                                <TableRow key={line.id} className="group/row hover:bg-primary/[0.02] transition-all duration-500 border-primary/5 h-24">
                                    <TableCell className="px-10">
                                        <div className="flex flex-col">
                                            <span className="font-black text-lg group-hover/row:text-primary transition-colors">{line.product.name}</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 bg-muted/50 px-2 py-0.5 rounded-md w-fit mt-1">
                                                {line.product.sku}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2 font-black text-2xl tracking-tighter opacity-40">
                                            <Package className="h-5 w-5 opacity-20" />
                                            {line.systemQty}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {isCompleted ? (
                                            <span className="font-black text-2xl tracking-tighter">{line.countedQty}</span>
                                        ) : (
                                            <div className="flex justify-end">
                                                <Input
                                                    type="number"
                                                    defaultValue={line.countedQty}
                                                    className="w-28 h-12 text-right rounded-xl border-primary/10 bg-muted/30 focus:bg-background focus:ring-primary/20 focus:border-primary transition-all font-black text-xl"
                                                    onBlur={(e) => handleUpdate(line.id, parseInt(e.target.value) || 0)}
                                                />
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="px-10 text-right">
                                        <div className={cn(
                                            "flex items-center justify-end gap-2 font-black text-2xl tracking-tighter",
                                            line.difference < 0 ? "text-destructive" : line.difference > 0 ? "text-emerald-500" : "text-muted-foreground/30"
                                        )}>
                                            {line.difference > 0 ? (
                                                <TrendingUp className="h-5 w-5" />
                                            ) : line.difference < 0 ? (
                                                <TrendingDown className="h-5 w-5" />
                                            ) : (
                                                <Minus className="h-5 w-5" />
                                            )}
                                            {line.difference > 0 ? "+" : ""}{line.difference}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
