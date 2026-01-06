"use client";

import { useI18n } from "@/lib/i18n/context";

import { Package } from "lucide-react";

export default function Logo() {
    const { t } = useI18n();

    return (
        <div className="flex items-center gap-3 font-bold text-xl group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 group-hover:scale-105">
                <Package className="h-6 w-6" />
            </div>
            <span className="font-cairo font-bold tracking-tight text-foreground text-2xl">
                {t("Dashboard.brand_name")}
            </span>
        </div>
    );
}
