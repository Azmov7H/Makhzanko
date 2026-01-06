"use client";

import { useI18n } from "@/lib/i18n/context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles, ArrowUpCircle, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface TrialLockProps {
    isExpired: boolean;
    locale: string;
}

export function TrialLock({ isExpired, locale }: TrialLockProps) {
    const { t } = useI18n();

    if (!isExpired) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/40 backdrop-blur-2xl overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-pulse delay-1000" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <Card className="max-w-2xl w-full border-none shadow-[0_80px_150px_-30px_rgba(0,0,0,0.3)] bg-card/60 backdrop-blur-3xl rounded-[3.5rem] overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />

                    <CardHeader className="p-12 pb-0 flex flex-col items-center text-center space-y-6">
                        <div className="relative">
                            <div className="p-8 bg-primary/10 rounded-[2.5rem] shadow-inner transform group-hover:rotate-12 transition-transform duration-700">
                                <Lock className="h-16 w-16 text-primary" />
                            </div>
                            <div className="absolute -top-4 -right-4 p-4 bg-background rounded-2xl shadow-2xl border border-primary/10 animate-bounce">
                                <ShieldAlert className="h-6 w-6 text-destructive" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <CardTitle className="text-5xl font-black italic tracking-tighter bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground bg-clip-text text-transparent">
                                {t("Dashboard.trial.expired_title")}
                            </CardTitle>
                            <CardDescription className="text-xl font-bold text-muted-foreground leading-relaxed max-w-md mx-auto">
                                {t("Dashboard.trial.expired_desc")}
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="p-12 pt-10">
                        <div className="bg-primary/5 rounded-[2.5rem] p-8 border border-primary/10 mb-10">
                            <div className="flex items-center gap-5 text-start">
                                <div className="p-3 bg-primary/10 rounded-xl">
                                    <Sparkles className="h-6 w-6 text-primary" />
                                </div>
                                <p className="text-sm font-bold text-primary/70 leading-relaxed uppercase tracking-wider italic">
                                    Your data is safe and secured. Upgrade to any premium plan to instantly restore full access to your business dashboard.
                                </p>
                            </div>
                        </div>

                        <Link href={`/${locale}/dashboard/settings/billing`}>
                            <Button className="w-full h-20 rounded-[2rem] bg-primary text-white shadow-3xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all duration-500 overflow-hidden relative group/btn">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover/btn:opacity-20 transition-opacity duration-500" />
                                <div className="flex items-center justify-center gap-4 text-xl font-black italic uppercase tracking-widest">
                                    <ArrowUpCircle className="h-8 w-8 transition-transform group-hover/btn:rotate-12" />
                                    {t("Dashboard.trial.upgrade_now")}
                                </div>
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
