import { getTenantContext } from "@/lib/auth";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Wallet, ArrowUpCircle, ArrowDownCircle, History, Landmark } from "lucide-react";
import { getTreasuryAccount, getAccountLedger } from "@/actions/accounting";
import { formatCurrency } from "@/lib/utils";
import { TreasuryActions } from "./TreasuryActions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default async function TreasuryPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const context = await getTenantContext();
    const t = await getI18n(locale as Locale);

    const treasuryAccount = await getTreasuryAccount();
    const ledger = await getAccountLedger(treasuryAccount.id);

    if (!ledger) {
        return <div className="p-12 text-center text-destructive">Error loading treasury data</div>;
    }

    const { account, transactions } = ledger;

    // Calculate balance
    const balance = transactions.reduce((acc, curr) => {
        return curr.type === "DEBIT" ? acc + Number(curr.amount) : acc - Number(curr.amount);
    }, 0);

    return (
        <div className="space-y-6 px-4 md:px-0 max-w-6xl mx-auto text-start">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {t("Dashboard.treasury")}
                </h1>
                <p className="text-muted-foreground">{t("Dashboard.treasury_desc")}</p>
            </div>

            <Separator className="bg-primary/5" />

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Wallet className="h-24 w-24 text-primary" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t("Dashboard.current_balance")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-primary">{formatCurrency(balance)}</div>
                        <p className="text-xs text-muted-foreground mt-1">{t("Dashboard.cash_in_hand")}</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t("Dashboard.account_info")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">{t("Common.name")}:</span>
                            <span className="font-bold">{account.name}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">{t("Common.code")}:</span>
                            <Badge variant="outline" className="font-mono">{account.code}</Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">{t("Common.status")}:</span>
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-none">{t("Common.active")}</Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t("Dashboard.quick_actions")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TreasuryActions />
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-primary/5 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <History className="h-5 w-5 text-primary" />
                            {t("Dashboard.recent_transactions")}
                        </CardTitle>
                        <CardDescription>{t("Dashboard.history_desc")}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/10">
                            <TableRow className="hover:bg-transparent border-primary/5">
                                <TableHead className="w-[120px]">{t("Common.date")}</TableHead>
                                <TableHead>{t("Common.description")}</TableHead>
                                <TableHead>{t("Common.type")}</TableHead>
                                <TableHead className="text-right">{t("Common.amount")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                        {t("Dashboard.no_transactions")}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                transactions.map((tx) => (
                                    <TableRow key={tx.id} className="border-primary/5 hover:bg-primary/5 transition-colors">
                                        <TableCell className="font-medium text-xs">
                                            {new Date(tx.journalEntry.date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm">{tx.journalEntry.description}</span>
                                                <span className="text-[10px] text-muted-foreground uppercase">REF: {tx.journalEntry.reference || "N/A"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={tx.type === "DEBIT" ? "default" : "outline"} className={tx.type === "DEBIT" ? "bg-emerald-500 hover:bg-emerald-600" : "text-destructive border-destructive"}>
                                                {tx.type === "DEBIT" ? t("Dashboard.inflow") : t("Dashboard.outflow")}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className={cn("text-right font-black", tx.type === "DEBIT" ? "text-emerald-500" : "text-destructive")}>
                                            {tx.type === "DEBIT" ? "+" : "-"}{formatCurrency(Number(tx.amount))}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

// Helper since cn is usually in @/lib/utils but sometimes needs local def
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
