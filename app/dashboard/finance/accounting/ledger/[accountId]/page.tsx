import { getAccountLedger } from "@/_legacy_backend/actions/accounting";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Calculator, History, TrendingUp, TrendingDown } from "lucide-react";
import { getI18n, getLocale } from "@/lib/i18n/server";
import { cn, formatCurrency } from "@/lib/utils";

interface LedgerTransaction {
    id: string;
    type: "DEBIT" | "CREDIT";
    amount: number;
    journalEntry: {
        date: Date | string;
        description: string;
        reference?: string | null;
    };
}

interface LedgerData {
    account: {
        id: string;
        code: string;
        name: string;
        type: string;
    };
    transactions: LedgerTransaction[];
}

export default async function AccountLedgerPage(props: { params: Promise<{ accountId: string }> }) {
    const params = await props.params;
    const { accountId } = params;

    const locale = await getLocale();
    const t = await getI18n(locale);
    const data = await getAccountLedger(accountId) as LedgerData | null;

    if (!data) return <div className="p-20 text-center text-2xl font-black italic text-muted-foreground">{t("Accounting.account_not_found")}</div>;

    const { account, transactions } = data;

    // Sort oldest first for Ledger to make sense of running balance.
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.journalEntry.date).getTime() - new Date(b.journalEntry.date).getTime());

    let runningBalance = 0;
    const ledgerRows = sortedTransactions.map(tx => {
        if (["ASSET", "EXPENSE"].includes(account.type)) {
            runningBalance += (tx.type === "DEBIT" ? Number(tx.amount) : -Number(tx.amount));
        } else {
            runningBalance += (tx.type === "CREDIT" ? Number(tx.amount) : -Number(tx.amount));
        }
        return { ...tx, runningBalance };
    });

    return (
        <div className="space-y-10 animate-in fade-in duration-700 text-start pb-20 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <Button variant="ghost" size="icon" asChild className="rounded-2xl h-14 w-14 hover:bg-primary/10 hover:text-primary transition-all shadow-lg shadow-primary/5">
                        <Link href="/dashboard/finance/accounting/chart-of-accounts">
                            <ArrowLeft className="h-6 w-6" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Badge variant="secondary" className="font-black tracking-widest text-[10px] uppercase px-3 py-1 bg-primary/10 text-primary border-none">
                                {t(`Accounting.Types.${account.type}`) || account.type.replace("_", " ")}
                            </Badge>
                            <span className="text-muted-foreground/30 font-black text-xs uppercase tracking-widest">{account.code}</span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent italic">
                            {account.name}
                        </h1>
                    </div>
                </div>

                <Card className="border-none shadow-3xl bg-primary/5 backdrop-blur-3xl rounded-[2.5rem] px-10 py-6 group hover:bg-primary/10 transition-colors">
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-black text-primary/60 uppercase tracking-[0.2em]">{t("Accounting.balance")}</span>
                        <span className="text-4xl font-black tracking-tighter text-primary">
                            {formatCurrency(runningBalance)}
                        </span>
                    </div>
                </Card>
            </div>

            <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-2xl rounded-[3rem] overflow-hidden group">
                <CardHeader className="bg-primary/5 border-b border-primary/5 p-8">
                    <div className="flex items-center gap-5">
                        <div className="bg-primary/10 p-4 rounded-2xl text-primary shadow-xl shadow-primary/5 group-hover:scale-110 transition-transform duration-500">
                            <History className="h-7 w-7" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-black italic">{t("Accounting.ledger_history")}</CardTitle>
                            <CardDescription className="text-base font-medium mt-1">{t("Accounting.ledger_history_desc")}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow className="h-16 hover:bg-transparent border-primary/5">
                                <TableHead className="px-8 text-xs font-black uppercase tracking-widest w-[160px]">{t("Common.date")}</TableHead>
                                <TableHead className="text-xs font-black uppercase tracking-widest">{t("Common.description")}</TableHead>
                                <TableHead className="text-xs font-black uppercase tracking-widest text-end w-[130px]">{t("Accounting.debit")}</TableHead>
                                <TableHead className="text-xs font-black uppercase tracking-widest text-end w-[130px]">{t("Accounting.credit")}</TableHead>
                                <TableHead className="text-end px-8 text-xs font-black uppercase tracking-widest w-[180px]">{t("Accounting.balance")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ledgerRows.reverse().map(tx => (
                                <TableRow key={tx.id} className="border-primary/5 hover:bg-primary/[0.02] transition-colors group/row">
                                    <TableCell className="px-8 py-6 font-bold text-sm tracking-tight opacity-70">
                                        {new Date(tx.journalEntry.date).toLocaleDateString("ar-EG")}
                                    </TableCell>
                                    <TableCell className="py-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-black text-lg group-hover/row:text-primary transition-colors">{tx.journalEntry.description}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">{t("Accounting.reference")}:</span>
                                                <span className="text-xs font-black bg-muted/50 px-2 py-0.5 rounded-lg text-muted-foreground">{tx.journalEntry.reference || "N/A"}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-end py-6 font-black text-lg tracking-tighter text-emerald-600">
                                        {tx.type === "DEBIT" ? formatCurrency(Number(tx.amount)) : <span className="opacity-10 text-xs">—</span>}
                                    </TableCell>
                                    <TableCell className="text-end py-6 font-black text-lg tracking-tighter text-destructive/80">
                                        {tx.type === "CREDIT" ? formatCurrency(Number(tx.amount)) : <span className="opacity-10 text-xs">—</span>}
                                    </TableCell>
                                    <TableCell className="text-end px-8 py-6">
                                        <div className="font-black text-xl tracking-tighter text-primary bg-primary/5 px-4 py-2 rounded-xl border border-primary/10 shadow-inner group-hover/row:bg-primary/10 transition-colors inline-block min-w-[140px]">
                                            {formatCurrency(tx.runningBalance)}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {ledgerRows.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground opacity-30 animate-pulse">
                                            <Calculator className="h-20 w-20" />
                                            <p className="text-xl font-black italic">{t("Accounting.no_transactions")}</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
