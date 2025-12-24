"use client";

import { useState, useTransition } from "react";
import { useI18n } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { ArrowUpCircle, ArrowDownCircle, Loader2 } from "lucide-react";
import { createTreasuryTransactionAction } from "@/actions/accounting";
import { toast } from "sonner";

export function TreasuryActions() {
    const {t} = useI18n();
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
        <>
            <div className="grid grid-cols-2 gap-2">
                <Badge
                    onClick={() => handleAction("DEPOSIT")}
                    className="h-10 cursor-pointer hover:bg-primary transition-colors flex items-center justify-center gap-2"
                >
                    <ArrowUpCircle className="h-4 w-4" /> {t("Dashboard.deposit")}
                </Badge>
                <Badge
                    variant="outline"
                    onClick={() => handleAction("WITHDRAW")}
                    className="h-10 cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors flex items-center justify-center gap-2"
                >
                    <ArrowDownCircle className="h-4 w-4" /> {t("Dashboard.withdraw")}
                </Badge>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {actionType === "DEPOSIT" ? t("Dashboard.deposit_title") : t("Dashboard.withdraw_title")}
                        </DialogTitle>
                        <DialogDescription>
                            {actionType === "DEPOSIT" ? t("Dashboard.deposit_desc") : t("Dashboard.withdraw_desc")}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>{t("Dashboard.amount_label")}</Label>
                            <Input
                                type="number"
                                min="0.01"
                                step="0.01"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t("Dashboard.description_label")}</Label>
                            <Textarea
                                placeholder="..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
                            {t("Common.cancel")}
                        </Button>
                        <Button
                            onClick={onSubmit}
                            disabled={!amount || isPending}
                            className={actionType === "WITHDRAW" ? "bg-destructive hover:bg-destructive/90" : ""}
                        >
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {actionType === "DEPOSIT" ? t("Dashboard.confirm_deposit") : t("Dashboard.confirm_withdraw")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
