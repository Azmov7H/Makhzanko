import { getTenantContext } from "@/lib/auth";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Scale, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2 } from "lucide-react";
import { getBalanceSheet } from "@/actions/accounting";
import { formatCurrency } from "@/lib/utils";

export default async function BalanceSheetPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getI18n(locale as Locale);

    const data = await getBalanceSheet();

    return (
        <div className="space-y-6 px-4 md:px-0 max-w-6xl mx-auto text-start">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {t("Dashboard.balance_sheet") || "الميزانية العمومية (Balance Sheet)"}
                </h1>
                <p className="text-muted-foreground">Snapshot of your company's financial position.</p>
            </div>

            <Separator className="bg-primary/5" />

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Assets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-emerald-500">{formatCurrency(data.totalAssets)}</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Liabilities</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-destructive">{formatCurrency(data.totalLiabilities)}</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl border-l-4 border-primary">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Equity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-primary">{formatCurrency(data.totalEquity)}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl h-full">
                    <CardHeader className="border-b border-primary/5">
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-emerald-500" />
                            Assets (الأصول)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {data.assets.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">No assets found</p>
                            ) : (
                                data.assets.map((a) => (
                                    <div key={a.id} className="flex justify-between items-center group">
                                        <div className="flex flex-col">
                                            <span className="font-bold">{a.name}</span>
                                            <span className="text-[10px] text-muted-foreground font-mono">{a.code}</span>
                                        </div>
                                        <span className="font-black text-emerald-500 group-hover:scale-110 transition-transform">{formatCurrency(a.balance)}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6 flex flex-col items-stretch h-full">
                    <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl border-l-4 border-destructive flex-1">
                        <CardHeader className="border-b border-primary/5">
                            <CardTitle className="flex items-center gap-2">
                                <TrendingDown className="h-5 w-5 text-destructive" />
                                Liabilities (الخصوم)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                {data.liabilities.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-4">No liabilities found</p>
                                ) : (
                                    data.liabilities.map((l) => (
                                        <div key={l.id} className="flex justify-between items-center group">
                                            <div className="flex flex-col">
                                                <span className="font-bold">{l.name}</span>
                                                <span className="text-[10px] text-muted-foreground font-mono">{l.code}</span>
                                            </div>
                                            <span className="font-black text-destructive group-hover:scale-110 transition-transform">{formatCurrency(l.balance)}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl border-l-4 border-primary flex-1">
                        <CardHeader className="border-b border-primary/5">
                            <CardTitle className="flex items-center gap-2">
                                <Scale className="h-5 w-5 text-primary" />
                                Equity (حقوق الملكية)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                {data.equity.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-4">No equity recorded</p>
                                ) : (
                                    data.equity.map((e) => (
                                        <div key={e.id} className="flex justify-between items-center group">
                                            <div className="flex flex-col">
                                                <span className="font-bold">{e.name}</span>
                                                <span className="text-[10px] text-muted-foreground font-mono">{e.code}</span>
                                            </div>
                                            <span className="font-black text-primary group-hover:scale-110 transition-transform">{formatCurrency(e.balance)}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card className={cn(
                "border-none shadow-xl shadow-primary/5 backdrop-blur-xl p-6 flex items-center justify-between",
                data.isBalanced ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
            )}>
                <div className="flex items-center gap-3">
                    {data.isBalanced ? (
                        <CheckCircle2 className="h-8 w-8" />
                    ) : (
                        <AlertTriangle className="h-8 w-8" />
                    )}
                    <div>
                        <h3 className="text-xl font-black">{data.isBalanced ? "Balanced" : "Unbalanced"}</h3>
                        <p className="text-sm opacity-80">
                            Assets = Liabilities + Equity
                        </p>
                    </div>
                </div>
                <div className="text-2xl font-black">
                    {formatCurrency(data.totalAssets)} = {formatCurrency(data.totalLiabilities + data.totalEquity)}
                </div>
            </Card>
        </div>
    );
}

// Helper for cn
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
