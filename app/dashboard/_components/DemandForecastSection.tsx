"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { TrendingDown, Clock } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { getAuthToken } from "@/lib/auth/AuthContext";

export function DemandForecastSection() {
    const { t } = useI18n();
    const [alerts, setAlerts] = useState<any>({ forecasts: [] });

    useEffect(() => {
        // Fetch from the Rust REST API
        // const token = getAuthToken();
        // fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/alerts/forecasts`, {
        //     headers: { Authorization: `Bearer ${token}` }
        // })
        // .then(res => res.json())
        // .then(data => setAlerts(data || { forecasts: [] }))
        // .catch(console.error);
    }, []);

    return (
        <Card className="luxury-card h-full">
            <CardHeader className="flex flex-row items-center gap-4 pb-6 border-b border-border/40">
                <div className="size-10 rounded-lg bg-accent flex items-center justify-center text-primary">
                    <TrendingDown className="h-5 w-5 stroke-[1.5]" />
                </div>
                <div>
                    <CardTitle className="text-xl font-bold tracking-tight" style={{ fontFamily: "var(--font-amiri), serif" }}>
                        {t("Dashboard.alerts.forecast_title")}
                    </CardTitle>
                    <CardDescription className="font-medium">{t("Dashboard.alerts.forecast_desc")}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="space-y-4">
                    {alerts.forecasts.length === 0 ? (
                        <div className="py-12 text-center bg-muted/30 rounded-lg border border-dashed border-border/60">
                            <p className="text-sm text-muted-foreground font-medium">
                                {t("Dashboard.alerts.no_forecasts")}
                            </p>
                        </div>
                    ) : (
                        alerts.forecasts.map((f: any) => (
                            <div key={f.id} className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-all group">
                                <div className="space-y-1">
                                    <p className="font-bold text-sm tracking-tight text-foreground group-hover:text-primary transition-colors">{f.name}</p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                        <Clock className="h-3 w-3" />
                                        <span>{t("Dashboard.alerts.lasts_for", { days: f.daysLeft })}</span>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <p className="text-sm font-black text-primary">
                                        {t("Dashboard.alerts.units_per_week", { count: f.weeklySales })}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
