"use client";

import { AlertCircle, Clock, ArrowUpCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { motion } from "framer-motion";

interface TrialBannerProps {
    daysRemaining: number;
    isExpired: boolean;
    locale: string;
}

export function TrialBanner({ daysRemaining, isExpired, locale }: TrialBannerProps) {
    const { t } = useI18n();
    if (!isExpired && daysRemaining > 7) return null;

    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="w-full px-6 pt-4 print:hidden"
        >
            <Alert variant={isExpired ? "destructive" : "default"} className={`${isExpired ? "border-destructive/50 bg-destructive/5" : "border-primary/50 bg-primary/5"} flex items-center justify-between p-4 shadow-sm backdrop-blur-sm`}>
                <div className="flex items-center gap-3">
                    {isExpired ? (
                        <AlertCircle className="h-5 w-5" />
                    ) : (
                        <Clock className="h-5 w-5 text-primary" />
                    )}
                    <div className="text-start">
                        <AlertTitle className="font-black text-lg">
                            {isExpired
                                ? t("Dashboard.trial.expired_title")
                                : t("Dashboard.trial.ending_soon_title")}
                        </AlertTitle>
                        <AlertDescription className="text-muted-foreground">
                            {isExpired
                                ? t("Dashboard.trial.expired_desc")
                                : t("Dashboard.trial.ending_soon_desc", { days: daysRemaining })}
                        </AlertDescription>
                    </div>
                </div>
                <Link href={`/${locale}/dashboard/settings/billing`}>
                    <Button variant={isExpired ? "destructive" : "default"} size="sm" className="gap-2 font-bold shadow-lg hover:scale-105 transition-transform">
                        <ArrowUpCircle className="h-4 w-4" />
                        {t("Dashboard.trial.upgrade_now")}
                    </Button>
                </Link>
            </Alert>
        </motion.div>
    );
}
