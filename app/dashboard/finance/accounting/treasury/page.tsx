import { getI18n, getLocale } from "@/lib/i18n/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Wallet, ArrowUpCircle, ArrowDownCircle, History, Landmark, Zap } from "lucide-react";
import { getTreasuryAccount, getAccountLedger } from "@/_legacy_backend/actions/accounting";
import { formatCurrency, cn } from "@/lib/utils";
import { TreasuryActions } from "./TreasuryActions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface LedgerTransaction {
    id: string;
    type: "DEBIT" | "CREDIT";
    amount: number;
    journalEntry: {
        date: Date | string;
        description: string;
        reference?: string | null;
    };
    account: {
        code: string;
        name: string;
    };
}

interface LedgerData {
    account: {
        id: string;
        code: string;
        name: string;
    };
    transactions: LedgerTransaction[];
}

export default async function TreasuryPage() {
    const locale = await getLocale();
    const t = await getI18n(locale);

    const treasuryAccount = await getTreasuryAccount();
    const ledger = await getAccountLedger(treasuryAccount.id) as LedgerData | null;

    if (!ledger) {
        return <div className="p-20 text-center text-destructive font-black italic">{t("Dashboard.error_loading") || "Error loading treasury data"}</div>;
    }

    const { account, transactions } = ledger;

    // Calculate balance
    const balance = transactions.reduce((acc, curr) => {
        return curr.type === "DEBIT" ? acc + Number(curr.amount) : acc - Number(curr.amount);
    }, 0);

    return (
        <div className="space-y-10 animate-in fade-in duration-700 text-start pb-20 max-w-6xl mx-auto">
            <div className="relative">
                <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-primary/20 rounded-full blur-sm" />
                <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent italic">
                    {t("Dashboard.treasury")}
                </h1>
                <p className="text-muted-foreground mt-3 text-lg font-medium max-w-2xl">{t("Dashboard.treasury_desc")}</p>
            </div>

            <Separator className="bg-primary/5 h-px" />

            <div className="grid gap-8 md:grid-cols-3">
                <Card className="border-none shadow-3xl bg-card/40 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden relative group hover:scale-[1.02] transition-all duration-500">
                    <div className="absolute -right-8 -top-8 bg-primary/10 w-40 h-40 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">{t("Dashboard.current_balance")}</CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-5xl font-black text-primary tracking-tighter">{formatCurrency(balance)}</div>
                        <p className="text-sm font-bold text-muted-foreground mt-2 flex items-center gap-2">
                            <Landmark className="h-4 w-4 opacity-50" />
                            {t("Dashboard.cash_in_hand")}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-3xl bg-card/40 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-all duration-500">
                    <CardHeader className="bg-primary/5 border-b border-primary/5 pb-4">
                        <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                            <Zap className="h-3 w-3 text-primary" />
                            {t("Dashboard.account_info")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <div className="flex justify-between items-center group/item">
                            <span className="text-sm font-bold text-muted-foreground">{t("Common.name")}:</span>
                            <span className="text-base font-black group-hover/item:text-primary transition-colors">{account.name}</span>
                        </div>
                        <div className="flex justify-between items-center group/item">
                            <span className="text-sm font-bold text-muted-foreground">{t("Common.code")}:</span>
                            <span className="font-black text-xs bg-muted/50 px-2 py-1 rounded-lg tracking-widest">{account.code}</span>
                        </div>
                        <div className="flex justify-between items-center group/item">
                            <span className="text-sm font-bold text-muted-foreground">{t("Common.status")}:</span>
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[10px] tracking-widest uppercase rounded-full shadow-sm">{t("Common.active")}</Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-3xl bg-card/40 backdrop-blur-3xl rounded-[2.5rem] p-4 flex items-center justify-center group hover:bg-card/50 transition-colors">
                    <TreasuryActions />
                </Card>
            </div>

            <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-2xl rounded-[3rem] overflow-hidden group">
                <CardHeader className="bg-primary/5 border-b border-primary/5 p-8 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-4 text-2xl font-black italic">
                            <div className="p-3 bg-primary/10 rounded-2xl shadow-xl shadow-primary/5 group-hover:scale-110 transition-transform duration-500">
                                <History className="h-7 w-7 text-primary" />
                            </div>
                            {t("Dashboard.recent_transactions")}
                        </CardTitle>
                        <CardDescription className="text-base font-medium mt-1">{t("Dashboard.history_desc")}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow className="hover:bg-transparent border-primary/5 h-16">
                                <TableHead className="px-8 text-xs font-black uppercase tracking-widest w-[140px]">{t("Common.date")}</TableHead>
                                <TableHead className="text-xs font-black uppercase tracking-widest">{t("Common.description")}</TableHead>
                                <TableHead className="text-xs font-black uppercase tracking-widest w-[140px]">{t("Common.type")}</TableHead>
                                <TableHead className="text-end px-8 text-xs font-black uppercase tracking-widest w-[180px]">{t("Common.amount")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground opacity-30 animate-pulse">
                                            <Wallet className="h-20 w-20" />
                                            <p className="text-xl font-black italic">{t("Dashboard.no_transactions")}</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                transactions.map((tx) => (
                                    <TableRow key={tx.id} className="border-primary/5 hover:bg-primary/[0.02] transition-colors group/row h-24">
                                        <TableCell className="px-8 font-bold text-sm tracking-tight opacity-70">
                                            {new Date(tx.journalEntry.date).toLocaleDateString("ar-EG")}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <span className="font-black text-lg group-hover/row:text-primary transition-colors">{tx.journalEntry.description}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">REF:</span>
                                                    <span className="text-xs font-black bg-muted/50 px-2 py-0.5 rounded-lg text-muted-foreground">{tx.journalEntry.reference || "N/A"}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn(
                                                "font-black text-[10px] tracking-widest uppercase rounded-xl border-none shadow-sm px-3 py-1.5",
                                                tx.type === "DEBIT" ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
                                            )}>
                                                {tx.type === "DEBIT" ? t("Dashboard.inflow") : t("Dashboard.outflow")}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className={cn("text-end px-8 font-black text-2xl tracking-tighter", tx.type === "DEBIT" ? "text-emerald-500" : "text-destructive/80")}>
                                            <div className="flex flex-col items-end gap-1">
                                                <span>{tx.type === "DEBIT" ? "+" : "-"}{formatCurrency(Number(tx.amount))}</span>
                                                <div className={cn("w-12 h-1 rounded-full", tx.type === "DEBIT" ? "bg-emerald-500/20" : "bg-destructive/20")} />
                                            </div>
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
