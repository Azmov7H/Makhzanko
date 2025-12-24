
"use client"
import { useState, useTransition } from "react";
import { useI18n } from "@/lib/i18n/context";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createPaymobCheckoutSession, initiatePaymobWalletPayment } from "@/actions/paymob-billing";
import { CreditCard, Smartphone, ExternalLink, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface PaymentMethodSelectorProps {
    planId: string;
    planName: string;
    price: number;
    disabled?: boolean;
    buttonText?: string;
}

export function PaymentMethodSelector({
    planId,
    planName,
    price,
    disabled,
    buttonText
}: PaymentMethodSelectorProps) {
    const { t } = useI18n();
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [phoneNumber, setPhoneNumber] = useState("");

    const handleCardPayment = () => {
        startTransition(async () => {
            try {
                await createPaymobCheckoutSession(planId);
            } catch (error) {
                toast.error(t("Settings.billing.error_card"));
            }
        });
    };

    const handleWalletPayment = () => {
        if (!phoneNumber || phoneNumber.length < 11) {
            toast.error(t("Settings.billing.error_phone"));
            return;
        }

        startTransition(async () => {
            try {
                const result = await initiatePaymobWalletPayment(planId, phoneNumber);
                if (result && 'error' in result) {
                    toast.error(result.error);
                    console.error(result.error);
                }
            } catch (error) {
                toast.error(t("Settings.billing.error_unexpected"));
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    className="w-full h-12 rounded-2xl font-black shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 group"
                    disabled={disabled}
                >
                    {buttonText || t("Common.upgrade") || "Upgrade"}
                    <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none bg-card/40 backdrop-blur-2xl shadow-2xl rounded-[2.5rem]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl" />

                <DialogHeader className="p-8 pb-4 relative">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                        </div>
                        <DialogTitle className="text-2xl font-black">{t("Settings.billing.choose_method")}</DialogTitle>
                    </div>
                    <DialogDescription className="text-lg font-medium text-muted-foreground/80">
                        {t("Settings.billing.upgrade_desc", { plan: planName, price: price.toString() })}
                    </DialogDescription>
                </DialogHeader>

                <div className="px-8 pb-8 relative">
                    <Tabs defaultValue="wallet" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 p-1.5 bg-muted/30 rounded-2xl h-14 mb-8">
                            <TabsTrigger value="wallet" className="rounded-xl font-bold data-[state=active]:bg-card data-[state=active]:shadow-lg transition-all">
                                <Smartphone className="h-4 w-4 mr-2" />
                                {t("Settings.billing.wallet")}
                            </TabsTrigger>
                            <TabsTrigger value="card" className="rounded-xl font-bold data-[state=active]:bg-card data-[state=active]:shadow-lg transition-all">
                                <CreditCard className="h-4 w-4 mr-2" />
                                {t("Settings.billing.card")}
                            </TabsTrigger>
                        </TabsList>

                        <AnimatePresence mode="wait">
                            <TabsContent value="wallet" className="space-y-6 mt-0">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-4 mb-6 group hover:bg-primary/10 transition-colors">
                                        <div className="p-3 bg-card rounded-xl shadow-inner group-hover:scale-110 transition-transform">
                                            <Smartphone className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-black uppercase tracking-widest text-primary/60">{t("Settings.billing.wallet")}</p>
                                            <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                                                {t("Settings.billing.wallet_providers")}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="phone" className="font-bold text-sm ml-1 text-muted-foreground">{t("Settings.billing.wallet_number")}</Label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono font-bold">+20</div>
                                            <Input
                                                id="phone"
                                                placeholder="010xxxxxxxx"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                type="tel"
                                                className="h-14 pl-14 rounded-2xl bg-muted/50 border-primary/10 focus:border-primary transition-all text-lg font-mono font-bold"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full h-14 mt-8 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
                                        onClick={handleWalletPayment}
                                        disabled={isPending}
                                    >
                                        {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : t("Settings.billing.pay_wallet")}
                                    </Button>
                                </motion.div>
                            </TabsContent>

                            <TabsContent value="card" className="space-y-6 mt-0">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <div className="p-5 rounded-2xl bg-accent/5 border border-accent/10 flex items-start gap-4 mb-6 group hover:bg-accent/10 transition-colors">
                                        <div className="p-3 bg-card rounded-xl shadow-inner group-hover:rotate-12 transition-transform">
                                            <CreditCard className="h-6 w-6 text-accent" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-black uppercase tracking-widest text-accent/60">{t("Settings.billing.card")}</p>
                                            <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                                                {t("Settings.billing.card_providers")}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-2xl border border-dashed border-muted-foreground/20">
                                        <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                                        <p className="text-xs font-medium text-muted-foreground">
                                            {t("Settings.billing.redirect_notice")}
                                        </p>
                                    </div>

                                    <Button
                                        className="w-full h-14 mt-8 rounded-2xl font-black text-lg bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 hover:shadow-accent/30 transition-all duration-300"
                                        onClick={handleCardPayment}
                                        disabled={isPending}
                                    >
                                        {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : t("Settings.billing.pay_card")}
                                    </Button>
                                </motion.div>
                            </TabsContent>
                        </AnimatePresence>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
}
