"use client";

import { useState, useTransition } from "react";
import { useI18n } from "@/lib/i18n/context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Ticket, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { redeemPromoCode } from "@/actions/promo";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export function PromoCodeRedemption() {
    const { t } = useI18n();
    const router = useRouter();
    const [code, setCode] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleRedeem = () => {
        if (!code.trim()) {
            toast.error(t("Settings.billing.promo_error_empty"));
            return;
        }

        startTransition(async () => {
            const result = await redeemPromoCode(code);

            if (result.error) {
                toast.error(result.error);
            } else if (result.success) {
                toast.success(result.message || t("Settings.billing.promo_success_msg"));
                setCode("");
                router.refresh();
            }
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <Card className="border-none shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-xl rounded-[2.5rem] overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl transition-transform group-hover:scale-150 duration-700" />

                <CardHeader className="p-8 pb-4 relative">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-xl">
                            <Ticket className="h-6 w-6 text-primary group-hover:rotate-12 transition-transform" />
                        </div>
                        <CardTitle className="text-2xl font-black">{t("Settings.billing.promo_card_title")}</CardTitle>
                    </div>
                    <CardDescription className="text-base font-medium text-muted-foreground/80">
                        {t("Settings.billing.promo_card_desc")}
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-8 pt-4 relative space-y-6">
                    <div className="space-y-3">
                        <Label htmlFor="promo-code" className="font-bold text-sm ml-1 text-muted-foreground">{t("Settings.billing.promo_label")}</Label>
                        <div className="flex gap-4">
                            <Input
                                id="promo-code"
                                placeholder={t("Settings.billing.promo_placeholder")}
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                disabled={isPending}
                                className="h-14 rounded-2xl bg-muted/50 border-primary/10 focus:border-primary transition-all text-lg font-mono font-black tracking-widest placeholder:tracking-normal"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleRedeem();
                                    }
                                }}
                            />
                            <Button
                                onClick={handleRedeem}
                                disabled={isPending || !code.trim()}
                                className="h-14 px-8 gap-3 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
                            >
                                {isPending ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Sparkles className="h-5 w-5" />
                                )}
                                {t("Settings.billing.promo_button")}
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-2 text-xs font-bold text-muted-foreground/60 transition-colors group-hover:text-primary/60">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary/20" />
                        <p>{t("Settings.billing.promo_footer")}</p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
