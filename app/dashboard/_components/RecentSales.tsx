"use client";

import { useI18n } from "@/lib/i18n/context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getAuthToken } from "@/lib/auth/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getAuthToken } from "@/lib/auth/AuthContext";

export function RecentSales({ locale }: { locale: string }) {
    const { t } = useI18n();
    const [sales, setSales] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentSales = async () => {
            try {
                const token = getAuthToken();
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/recent-sales`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setSales(data.slice(0, 5));
                }
            } catch (error) {
                console.error("Failed to fetch recent sales:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentSales();
    }, []);

    if (loading) return <div className="h-[350px] w-full animate-pulse bg-muted/20 rounded-xl" />;

    return (
        <Card className="col-span-full lg:col-span-12 xl:col-span-4 luxury-card border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl rounded-3xl">
            <CardHeader className="pb-8">
                <CardTitle style={{ fontFamily: "var(--font-amiri), serif" }} className="text-3xl font-black tracking-tight">{t("Sales.recent_sales")}</CardTitle>
                <CardDescription className="text-base font-medium">
                    {t("Sales.manage_sales_desc")}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="space-y-6">
                    {sales.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">{t("Sales.no_sales")}</p>
                    ) : (
                        sales.map((sale) => (
                            <div key={sale.id} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-10 w-10 bg-accent text-primary border border-border/50">
                                        <AvatarFallback className="font-bold">{sale.customerName ? sale.customerName[0] : "W"}</AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold leading-none group-hover:text-primary transition-colors cursor-pointer">{sale.customerName || t("Sales.walk_in")}</p>
                                        <p className="text-xs text-muted-foreground font-mono opacity-70">
                                            {formatDate(sale.date, locale)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <div className="font-bold tabular-nums">+{sale.total}</div>
                                    <Badge variant="outline" className="text-[10px] px-2 py-0.5 rounded-lg bg-accent/10 text-accent border-accent/20 font-bold uppercase">
                                        {t("Sales.items_count", { count: sale.items.length })}
                                    </Badge>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function formatDate(date: string | Date, locale: string) {
    if (!date) return "";
    return new Date(date).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
        month: "short",
        day: "numeric",
    });
}
