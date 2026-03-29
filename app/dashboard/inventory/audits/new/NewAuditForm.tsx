"use client";

import { createInventoryCountAction } from "@/actions/audit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { toast } from "sonner";
import { Loader2, Sparkles, ClipboardCheck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NewAuditForm({ warehouses }: { warehouses: any[] }) {
    const [warehouseId, setWarehouseId] = useState<string>("");
    const [isPending, startTransition] = useTransition();
    const { t } = useI18n();
    const router = useRouter();

    const handleSubmit = () => {
        if (!warehouseId) {
            toast.error(t("Inventory.select_warehouse"), {
                className: "rounded-2xl border-none bg-destructive text-white font-black italic shadow-2xl",
            });
            return;
        }

        startTransition(async () => {
            const result = await createInventoryCountAction(warehouseId);
            if (result.error) {
                toast.error(result.error, {
                    className: "rounded-2xl border-none bg-destructive text-white font-black italic shadow-2xl",
                });
            } else {
                toast.success(t("Inventory.audit_started"), {
                    className: "rounded-2xl border-none bg-emerald-500 text-white font-black italic shadow-2xl",
                });
                router.push(`/dashboard/inventory/audits/${result.countId}`);
            }
        });
    };

    return (
        <Card className="max-w-2xl mx-auto border-none shadow-3xl bg-card/60 backdrop-blur-3xl rounded-[3rem] overflow-hidden group relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />

            <CardHeader className="p-10 border-b border-primary/5 bg-primary/5">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-primary/10 rounded-2xl text-primary shadow-xl shadow-primary/5 group-hover:scale-110 transition-transform duration-500">
                        <Sparkles className="h-7 w-7" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-black italic">{t("Inventory.new_audit")}</CardTitle>
                        <CardDescription className="text-base font-medium mt-1">
                            {t("Inventory.manage_audits_desc")}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-10 space-y-10">
                <div className="space-y-4">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                        {t("Inventory.location")}
                    </Label>
                    <Select onValueChange={setWarehouseId}>
                        <SelectTrigger className="h-14 rounded-2xl border-primary/10 bg-muted/30 focus:ring-primary/20 focus:border-primary transition-all duration-300 px-6 font-bold text-lg">
                            <SelectValue placeholder={t("Inventory.select_warehouse")} />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-none bg-card/90 backdrop-blur-xl shadow-3xl p-2">
                            {warehouses.map(w => (
                                <SelectItem
                                    key={w.id}
                                    value={w.id}
                                    className="rounded-xl focus:bg-primary/10 cursor-pointer py-3 transition-all font-bold"
                                >
                                    {w.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex justify-end pt-6 border-t border-dashed border-primary/10">
                    <Button
                        onClick={handleSubmit}
                        disabled={isPending || !warehouseId}
                        className="h-16 px-12 rounded-[2rem] bg-primary shadow-2xl shadow-primary/20 hover:scale-105 transition-all duration-500 group overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                        {isPending ? (
                            <div className="flex items-center gap-3">
                                <Loader2 className="h-6 w-6 animate-spin" />
                                <span className="font-black text-xs uppercase tracking-widest">{t("Common.loading")}</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <span className="font-black text-sm uppercase tracking-widest">{t("Inventory.continue_count")}</span>
                                <ArrowRight className="h-6 w-6 transition-transform duration-500 group-hover:translate-x-2" />
                            </div>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
