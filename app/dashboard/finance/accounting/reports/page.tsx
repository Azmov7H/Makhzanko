import { getTrialBalance } from "@/actions/accounting";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getI18n, getLocale } from "@/lib/i18n/server";
import { formatCurrency, cn } from "@/lib/utils";
import { Calculator, FileText, PieChart, TrendingUp, TrendingDown, Clock } from "lucide-react";

interface TrialBalanceAccount {
    id: string;
    code: string;
    name: string;
    type: string;
    debit: number;
    credit: number;
    balance: number;
}

export default async function AccountingReportsPage() {
    const locale = await getLocale();
    const t = await getI18n(locale);
    const trialBalance = await getTrialBalance() as TrialBalanceAccount[];

    const totalDebit = trialBalance.reduce((sum, acc) => sum + acc.debit, 0);
    const totalCredit = trialBalance.reduce((sum, acc) => sum + acc.credit, 0);

    const profitLoss = trialBalance.filter(acc => ["REVENUE", "EXPENSE"].includes(acc.type));
    const revenueItems = profitLoss.filter(acc => acc.type === "REVENUE");
    const expenseItems = profitLoss.filter(acc => acc.type === "EXPENSE");

    const revenue = revenueItems.reduce((sum, acc) => sum + (acc.credit - acc.debit), 0);
    const expenses = expenseItems.reduce((sum, acc) => sum + (acc.debit - acc.credit), 0);
    const netIncome = revenue - expenses;

    return (
        <div className="space-y-10 animate-in fade-in duration-700 text-start pb-20 max-w-6xl mx-auto">
            <div className="relative">
                <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-primary/20 rounded-full blur-sm" />
                <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent italic">
                    {t("Accounting.reports_title")}
                </h1>
                <p className="text-muted-foreground mt-3 text-lg font-medium max-w-2xl">{t("Accounting.reports_desc")}</p>
            </div>

            <Tabs defaultValue="trial-balance" className="space-y-8">
                <TabsList className="bg-primary/5 p-1 rounded-2xl h-14 w-fit border border-primary/5">
                    <TabsTrigger value="trial-balance" className="rounded-xl px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xl font-black text-xs uppercase tracking-widest transition-all">
                        {t("Accounting.trial_balance")}
                    </TabsTrigger>
                    <TabsTrigger value="profit-loss" className="rounded-xl px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xl font-black text-xs uppercase tracking-widest transition-all">
                        {t("Accounting.profit_loss")}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="trial-balance" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
                    <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-2xl rounded-[3rem] overflow-hidden group">
                        <CardHeader className="bg-primary/5 border-b border-primary/5 p-8 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-xl shadow-primary/5 group-hover:scale-110 transition-transform duration-500">
                                    <PieChart className="h-7 w-7" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-black italic">{t("Accounting.trial_balance")}</CardTitle>
                                    <CardDescription className="text-base font-medium mt-1 flex items-center gap-2">
                                        <Clock className="h-4 w-4 opacity-50" />
                                        {t("Accounting.as_of")} {new Date().toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow className="h-16 hover:bg-transparent border-primary/5">
                                        <TableHead className="px-8 text-xs font-black uppercase tracking-widest">{t("Accounting.account")}</TableHead>
                                        <TableHead className="text-end text-xs font-black uppercase tracking-widest w-[180px]">{t("Accounting.debit")}</TableHead>
                                        <TableHead className="text-end px-8 text-xs font-black uppercase tracking-widest w-[180px]">{t("Accounting.credit")}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {trialBalance.map(acc => (
                                        <TableRow key={acc.id} className="border-primary/5 hover:bg-primary/[0.02] transition-colors group/row">
                                            <TableCell className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs font-black text-muted-foreground/40 font-mono tracking-tighter bg-muted/50 px-2 py-0.5 rounded-lg">{acc.code}</span>
                                                    <span className="font-bold text-lg group-hover/row:text-primary transition-colors">{acc.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-end py-5 font-black text-lg tracking-tighter">
                                                {acc.debit > 0 ? formatCurrency(acc.debit) : <span className="opacity-10 text-xs">—</span>}
                                            </TableCell>
                                            <TableCell className="text-end px-8 py-5 font-black text-lg tracking-tighter text-destructive/80">
                                                {acc.credit > 0 ? formatCurrency(acc.credit) : <span className="opacity-10 text-xs">—</span>}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className="bg-primary/5 hover:bg-primary/5 border-t-2 border-primary/20">
                                        <TableCell className="px-8 h-20 text-xl font-black italic text-primary uppercase tracking-widest">{t("Common.total")}</TableCell>
                                        <TableCell className="text-end h-20 font-black text-2xl tracking-tighter text-primary">{formatCurrency(totalDebit)}</TableCell>
                                        <TableCell className="text-end px-8 h-20 font-black text-2xl tracking-tighter text-primary">{formatCurrency(totalCredit)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="profit-loss" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
                    <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-2xl rounded-[3rem] overflow-hidden group">
                        <CardHeader className="bg-primary/5 border-b border-primary/5 p-8 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-xl shadow-primary/5 group-hover:scale-110 transition-transform duration-500">
                                    <FileText className="h-7 w-7" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-black italic">{t("Accounting.statement_p_l")}</CardTitle>
                                    <CardDescription className="text-base font-medium mt-1">{t("Accounting.statement_p_l_desc")}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-10 space-y-12">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <TrendingUp className="h-6 w-6 text-emerald-500" />
                                    <h3 className="text-xl font-black italic uppercase tracking-wider text-emerald-600">{t("Accounting.revenue")}</h3>
                                </div>
                                <div className="grid gap-4 pl-12">
                                    {revenueItems.map(acc => (
                                        <div key={acc.id} className="flex justify-between items-center group/item hover:bg-emerald-500/[0.02] p-2 rounded-xl transition-all">
                                            <span className="text-lg font-bold group-hover/item:translate-x-1 transition-transform">{acc.name}</span>
                                            <span className="font-black text-xl tracking-tighter text-emerald-600/80">{formatCurrency(acc.credit - acc.debit)}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between items-center pt-6 mt-4 border-t border-emerald-500/10">
                                        <span className="text-xl font-black italic uppercase tracking-[0.2em] text-emerald-600">{t("Accounting.total_revenue")}</span>
                                        <div className="bg-emerald-500 text-white px-6 py-2 rounded-2xl shadow-xl shadow-emerald-500/20 font-black text-2xl tracking-tighter">
                                            {formatCurrency(revenue)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <TrendingDown className="h-6 w-6 text-destructive" />
                                    <h3 className="text-xl font-black italic uppercase tracking-wider text-destructive/80">{t("Accounting.expenses")}</h3>
                                </div>
                                <div className="grid gap-4 pl-12">
                                    {expenseItems.map(acc => (
                                        <div key={acc.id} className="flex justify-between items-center group/item hover:bg-destructive/[0.02] p-2 rounded-xl transition-all">
                                            <span className="text-lg font-bold group-hover/item:translate-x-1 transition-transform">{acc.name}</span>
                                            <span className="font-black text-xl tracking-tighter text-destructive/60">{formatCurrency(acc.debit - acc.credit)}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between items-center pt-6 mt-4 border-t border-destructive/10">
                                        <span className="text-xl font-black italic uppercase tracking-[0.2em] text-destructive/80">{t("Accounting.total_expenses")}</span>
                                        <div className="bg-destructive/10 text-destructive px-6 py-2 rounded-2xl border border-destructive/20 font-black text-2xl tracking-tighter">
                                            {formatCurrency(expenses)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative pt-10 mt-10 border-t-4 border-primary/20">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/10 px-8 py-2 rounded-full backdrop-blur-3xl border border-primary/20">
                                    <Calculator className="h-6 w-6 text-primary" />
                                </div>
                                <div className={cn(
                                    "flex justify-between items-center p-8 rounded-[2.5rem] shadow-3xl",
                                    netIncome >= 0 ? "bg-emerald-500/5 shadow-emerald-500/5" : "bg-destructive/5 shadow-destructive/5"
                                )}>
                                    <span className="text-3xl font-black italic tracking-tighter uppercase underline decoration-primary/30 decoration-4">{t("Accounting.net_income")}</span>
                                    <span className={cn(
                                        "text-5xl font-black tracking-tighter drop-shadow-sm",
                                        netIncome >= 0 ? "text-emerald-500" : "text-destructive"
                                    )}>
                                        {formatCurrency(netIncome)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
