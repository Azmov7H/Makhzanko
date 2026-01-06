"use client";

import { Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export default function DashboardLoading() {
    const { t } = useI18n();
    return (
        <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-background/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse font-medium">
                    {t("Dashboard.loading_dashboard")}
                </p>
            </div>
        </div>
    );
}
