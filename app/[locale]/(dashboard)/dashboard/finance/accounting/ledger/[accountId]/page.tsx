import { getAccountLedger } from "@/actions/accounting";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Calculator } from "lucide-react";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";

export default async function LedgerPage(props: { params: Promise<{ accountId: string; locale: string }> }) {
    const params = await props.params;
    const { accountId, locale } = params;

    const t = await getI18n(locale as Locale);
    const data = await getAccountLedger(accountId);

    if (!data) return <div className="p-8 text-center">{t("Accounting.account_not_found")}</div>;

    const { account, transactions } = data;

    // Sort oldest first for Ledger to make sense of running balance.
    const sortedTransactions = transactions.sort((a, b) => new Date(a.journalEntry.date).getTime() - new Date(b.journalEntry.date).getTime());

    let balance = 0;
    const ledgerRows = sortedTransactions.map(tx => {
        if (["ASSET", "EXPENSE"].includes(account.type)) {
            balance += (tx.type === "DEBIT" ? Number(tx.amount) : -Number(tx.amount));
        } else {
            balance += (tx.type === "CREDIT" ? Number(tx.amount) : -Number(tx.amount));
        }
        return { ...tx, runningBalance: balance };
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild className="rounded-full">
                    <Link href={`/${locale}/dashboard/finance/accounting/chart-of-accounts`}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {t("Accounting.ledger")}: <span className="text-primary">{account.name}</span>
                    </h1>
                    <div className="flex items-center gap-3 mt-1">
                        <Badge variant="secondary" className="font-mono">{t("Accounting.code")}: {account.code}</Badge>
                        <Badge variant="outline" className="capitalize">{t("Accounting.type")}: {account.type.toLowerCase()}</Badge>
                    </div>
                </div>
            </div>

            <Card className="border-primary/5 shadow-sm">
                <CardHeader className="bg-muted/30 border-b">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-primary" />
                                {t("Accounting.ledger_history")}
                            </CardTitle>
                            <CardDescription>{t("Accounting.ledger_history_desc")}</CardDescription>
                        </div>
                        <div className="bg-background px-4 py-2 rounded-lg border flex items-center gap-3">
                            <span className="text-sm text-muted-foreground font-medium">{t("Accounting.balance")}:</span>
                            <span className="text-xl font-black text-primary">
                                {balance.toLocaleString()} <span className="text-xs font-normal uppercase">{t("Common.currency")}</span>
                            </span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="h-12 hover:bg-transparent bg-muted/5">
                                <TableHead className="font-bold uppercase text-xs">{t("Accounting.date")}</TableHead>
                                <TableHead className="font-bold uppercase text-xs">{t("Accounting.description")}</TableHead>
                                <TableHead className="text-right font-bold uppercase text-xs w-[120px]">{t("Accounting.debit")}</TableHead>
                                <TableHead className="text-right font-bold uppercase text-xs w-[120px]">{t("Accounting.credit")}</TableHead>
                                <TableHead className="text-right font-bold uppercase text-xs w-[150px]">{t("Accounting.balance")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ledgerRows.map(tx => (
                                <TableRow key={tx.id} className="hover:bg-muted/10 transition-colors">
                                    <TableCell className="text-sm">{new Date(tx.journalEntry.date).toLocaleDateString(locale)}</TableCell>
                                    <TableCell>
                                        <div className="font-bold text-sm tracking-tight">{tx.journalEntry.description}</div>
                                        <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                                            <span className="opacity-70">Ref:</span>
                                            <span className="font-mono">{tx.journalEntry.reference || "N/A"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        {tx.type === "DEBIT" ? (
                                            <span className="text-green-600 font-bold">{Number(tx.amount).toLocaleString()}</span>
                                        ) : "-"}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        {tx.type === "CREDIT" ? (
                                            <span className="text-blue-600 font-bold">{Number(tx.amount).toLocaleString()}</span>
                                        ) : "-"}
                                    </TableCell>
                                    <TableCell className="text-right font-mono font-black text-primary">
                                        {tx.runningBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {ledgerRows.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <Calculator className="h-8 w-8 opacity-20 mb-2" />
                                            {t("Accounting.no_transactions")}
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

import { Badge } from "@/components/ui/badge";
