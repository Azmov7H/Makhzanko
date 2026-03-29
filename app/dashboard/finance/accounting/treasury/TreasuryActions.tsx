"use client";

import { useState, useTransition } from "react";
import { useI18n } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpCircle, ArrowDownCircle, Loader2, Plus, Minus } from "lucide-react";
import { createTreasuryTransactionAction } from "@/actions/accounting";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function TreasuryActions() {
    const { t } = useI18n();
    const [open, setOpen] = useState(false);
    const [actionType, setActionType] = useState<"DEPOSIT" | "WITHDRAW" | null>(null);
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleAction = (type: "DEPOSIT" | "WITHDRAW") => {
        setActionType(type);
        setAmount("");
        setDescription("");
        setOpen(true);
    };

    const onSubmit = () => {
        if (!actionType || !amount) return;

        startTransition(async () => {
            const res = await createTreasuryTransactionAction({
                type: actionType,
                amount: parseFloat(amount),
                description: description
            });

            if (res?.success) {
                toast.success(t("Dashboard.transaction_success"));
                setOpen(false);
            } else {
                toast.error(t("Dashboard.transaction_error"));
            }
        });
    };

    return (
        <div className="flex items-center gap-4 w-full">
            <Button
                onClick={() => handleAction("DEPOSIT")}
                className="h-14 flex-1 rounded-2xl bg-emerald-500 hover:bg-emerald-600 shadow-xl shadow-emerald-500/10 font-black text-xs uppercase tracking-widest gap-2 group transition-all"
            >
                <Plus className="h-4 w-4 group-hover:scale-125 transition-transform" />
                {t("Dashboard.deposit")}
            </Button>
            <Button
                variant="outline"
                onClick={() => handleAction("WITHDRAW")}
                className="h-14 flex-1 rounded-2xl border-destructive/20 text-destructive hover:bg-destructive/5 hover:border-destructive/30 shadow-xl shadow-destructive/5 font-black text-xs uppercase tracking-widest gap-2 group transition-all"
            >
                <Minus className="h-4 w-4 group-hover:scale-125 transition-transform" />
                {t("Dashboard.withdraw")}
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="border-none shadow-3xl bg-card/60 backdrop-blur-3xl rounded-[3rem] p-8 max-w-md w-full focus:outline-none overflow-hidden">
                    <div className={cn(
                        "absolute top-0 left-0 w-full h-2",
                        actionType === "DEPOSIT" ? "bg-emerald-500" : "bg-destructive"
                    )} />

                    <DialogHeader className="pt-4">
                        <DialogTitle className="text-3xl font-black italic tracking-tight">
                            {actionType === "DEPOSIT" ? t("Dashboard.deposit_title") : t("Dashboard.withdraw_title")}
                        </DialogTitle>
                        <DialogDescription className="text-base font-medium text-muted-foreground/80 pt-1">
                            {actionType === "DEPOSIT" ? t("Dashboard.deposit_desc") : t("Dashboard.withdraw_desc")}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-8">
                        <div className="space-y-3">
                            <Label className="text-xs font-black uppercase tracking-widest opacity-60 px-1">{t("Dashboard.amount_label")}</Label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 font-black">$</div>
                                <Input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="h-14 pl-10 bg-background/50 border-primary/5 rounded-2xl text-lg font-black tracking-tight focus:ring-primary/20 focus:border-primary/20 transition-all placeholder:text-muted-foreground/20"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs font-black uppercase tracking-widest opacity-60 px-1">{t("Dashboard.description_label")}</Label>
                            <Textarea
                                placeholder="..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="min-h-[120px] bg-background/50 border-primary/5 rounded-2xl text-base font-medium focus:ring-primary/20 focus:border-primary/20 transition-all p-4 placeholder:text-muted-foreground/20 resize-none"
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-3 sm:gap-0">
                        <Button variant="ghost" onClick={() => setOpen(false)} disabled={isPending} className="h-14 flex-1 rounded-2xl font-black text-xs uppercase tracking-widest text-muted-foreground hover:bg-muted/50">
                            {t("Common.cancel")}
                        </Button>
                        <Button
                            onClick={onSubmit}
                            disabled={!amount || isPending}
                            className={cn(
                                "h-14 flex-[2] rounded-2xl font-black text-xs uppercase tracking-widest gap-2 shadow-2xl transition-all",
                                actionType === "DEPOSIT" ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" : "bg-destructive hover:bg-destructive/90 shadow-destructive/20"
                            )}
                        >
                            {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                                actionType === "DEPOSIT" ? <ArrowUpCircle className="h-5 w-5" /> : <ArrowDownCircle className="h-5 w-5" />
                            )}
                            {actionType === "DEPOSIT" ? t("Dashboard.confirm_deposit") : t("Dashboard.confirm_withdraw")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
