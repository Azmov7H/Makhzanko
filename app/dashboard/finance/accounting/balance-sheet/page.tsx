import { getI18n, getLocale } from "@/lib/i18n/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Scale, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2 } from "lucide-react";
import { getBalanceSheet } from "@/actions/accounting";
import { formatCurrency, cn } from "@/lib/utils";

interface BalanceSheetAccount {
    id: string;
    code: string;
    name: string;
    type: string;
    debit: number;
    credit: number;
    balance: number;
}

interface BalanceSheetData {
    assets: BalanceSheetAccount[];
    liabilities: BalanceSheetAccount[];
    equity: BalanceSheetAccount[];
    totalAssets: number;
    totalLiabilities: number;
    totalEquity: number;
    isBalanced: boolean;
}

export default async function BalanceSheetPage() {
    const locale = await getLocale();
    const t = await getI18n(locale);

    const data = await getBalanceSheet() as BalanceSheetData;

    return (
        <div className="space-y-10 animate-in fade-in duration-700 text-start pb-20 max-w-6xl mx-auto">
            <div className="relative">
                <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-primary/20 rounded-full blur-sm" />
                <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent italic">
                    {t("Accounting.balance_sheet")}
                </h1>
                <p className="text-muted-foreground mt-3 text-lg font-medium max-w-2xl">{t("Accounting.balance_sheet_desc")}</p>
            </div>

            <Separator className="bg-primary/5 h-px" />

            <div className="grid gap-8 md:grid-cols-3">
                <Card className="border-none shadow-2xl shadow-emerald-500/5 bg-card/40 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden group hover:scale-[1.03] transition-all duration-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl opacity-20" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">{t("Accounting.total_assets")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-emerald-500 tracking-tighter">{formatCurrency(data.totalAssets)}</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-2xl shadow-destructive/5 bg-card/40 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden group hover:scale-[1.03] transition-all duration-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/10 rounded-full -mr-16 -mt-16 blur-3xl opacity-20" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">{t("Accounting.total_liabilities")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-destructive tracking-tighter">{formatCurrency(data.totalLiabilities)}</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden group hover:scale-[1.03] transition-all duration-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl opacity-20" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">{t("Accounting.total_equity")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-primary tracking-tighter">{formatCurrency(data.totalEquity)}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-10 md:grid-cols-2">
                <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-2xl rounded-[3rem] overflow-hidden h-full flex flex-col">
                    <CardHeader className="bg-primary/5 border-b border-primary/5 p-8">
                        <CardTitle className="flex items-center gap-4 text-2xl font-black italic">
                            <div className="p-3 bg-emerald-500/10 rounded-2xl shadow-xl shadow-emerald-500/5">
                                <TrendingUp className="h-7 w-7 text-emerald-500" />
                            </div>
                            {t("Accounting.assets")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 flex-1">
                        <div className="space-y-6">
                            {data.assets.length === 0 ? (
                                <p className="text-center text-muted-foreground py-12 font-medium">{t("Accounting.no_assets")}</p>
                            ) : (
                                data.assets.map((a) => (
                                    <div key={a.id} className="flex justify-between items-center group/row p-4 rounded-2xl hover:bg-emerald-500/5 transition-all duration-300 border border-transparent hover:border-emerald-500/10">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-lg font-black group-hover/row:text-emerald-600 transition-colors">{a.name}</span>
                                            <span className="text-xs font-black text-muted-foreground/60 tracking-widest uppercase">{a.code}</span>
                                        </div>
                                        <span className="text-xl font-black text-emerald-500 group-hover/row:scale-110 transition-transform tracking-tighter">{formatCurrency(a.balance)}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-10 flex flex-col items-stretch h-full">
                    <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-2xl rounded-[3rem] overflow-hidden flex-1 flex flex-col">
                        <CardHeader className="bg-primary/5 border-b border-primary/5 p-8">
                            <CardTitle className="flex items-center gap-4 text-2xl font-black italic">
                                <div className="p-3 bg-destructive/10 rounded-2xl shadow-xl shadow-destructive/5">
                                    <TrendingDown className="h-7 w-7 text-destructive" />
                                </div>
                                {t("Accounting.liabilities")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 flex-1">
                            <div className="space-y-6">
                                {data.liabilities.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8 font-medium">{t("Accounting.no_liabilities")}</p>
                                ) : (
                                    data.liabilities.map((l) => (
                                        <div key={l.id} className="flex justify-between items-center group/row p-4 rounded-2xl hover:bg-destructive/5 transition-all duration-300 border border-transparent hover:border-destructive/10">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-lg font-black group-hover/row:text-destructive transition-colors">{l.name}</span>
                                                <span className="text-xs font-black text-muted-foreground/60 tracking-widest uppercase">{l.code}</span>
                                            </div>
                                            <span className="text-xl font-black text-destructive group-hover/row:scale-110 transition-transform tracking-tighter">{formatCurrency(l.balance)}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-2xl rounded-[3rem] overflow-hidden flex-1 flex flex-col">
                        <CardHeader className="bg-primary/5 border-b border-primary/5 p-8">
                            <CardTitle className="flex items-center gap-4 text-2xl font-black italic">
                                <div className="p-3 bg-primary/10 rounded-2xl shadow-xl shadow-primary/5">
                                    <Scale className="h-7 w-7 text-primary" />
                                </div>
                                {t("Accounting.equity")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 flex-1">
                            <div className="space-y-6">
                                {data.equity.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8 font-medium">{t("Accounting.no_equity")}</p>
                                ) : (
                                    data.equity.map((e) => (
                                        <div key={e.id} className="flex justify-between items-center group/row p-4 rounded-2xl hover:bg-primary/5 transition-all duration-300 border border-transparent hover:border-primary/10">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-lg font-black group-hover/row:text-primary transition-colors">{e.name}</span>
                                                <span className="text-xs font-black text-muted-foreground/60 tracking-widest uppercase">{e.code}</span>
                                            </div>
                                            <span className="text-xl font-black text-primary group-hover/row:scale-110 transition-transform tracking-tighter">{formatCurrency(e.balance)}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card className={cn(
                "border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] backdrop-blur-3xl p-10 flex flex-col md:flex-row items-center justify-between rounded-[3rem] gap-8",
                data.isBalanced ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" : "bg-destructive/10 border-destructive/20 text-destructive"
            )}>
                <div className="flex items-center gap-6">
                    <div className={cn("p-5 rounded-3xl shadow-2xl backdrop-blur-md", data.isBalanced ? "bg-emerald-500/20" : "bg-destructive/20")}>
                        {data.isBalanced ? (
                            <CheckCircle2 className="h-12 w-12" />
                        ) : (
                            <AlertTriangle className="h-12 w-12" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-3xl font-black tracking-tight">{data.isBalanced ? t("Accounting.balanced") : t("Accounting.imbalance")}</h3>
                        <p className="text-lg font-medium opacity-80 mt-1">
                            {t("Accounting.financial_equation")}
                        </p>
                    </div>
                </div>
                <div className="text-3xl font-black bg-background/50 px-8 py-4 rounded-2xl border border-white/10 shadow-inner tracking-tighter">
                    {formatCurrency(data.totalAssets)} <span className="text-sm font-bold mx-4 opacity-50">=</span> {formatCurrency(data.totalLiabilities + data.totalEquity)}
                </div>
            </Card>
        </div>
    );
}
