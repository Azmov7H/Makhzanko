import { getI18n, getLocale } from "@/lib/i18n/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen } from "lucide-react";
import { getJournalEntries } from "@/actions/accounting";
import { formatCurrency, cn } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface JournalTransaction {
    id: string;
    accountId: string;
    type: "DEBIT" | "CREDIT";
    amount: number;
    account: {
        code: string;
        name: string;
    };
}

interface JournalEntry {
    id: string;
    date: Date | string;
    description: string;
    reference?: string | null;
    transactions: JournalTransaction[];
}

export default async function LedgerPage() {
    const locale = await getLocale();
    const t = await getI18n(locale);

    const journalEntries = await getJournalEntries() as JournalEntry[];

    return (
        <div className="space-y-10 animate-in fade-in duration-700 text-start pb-20 max-w-6xl mx-auto">
            <div className="relative">
                <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-primary/20 rounded-full blur-sm" />
                <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent italic">
                    {t("Accounting.ledger")}
                </h1>
                <p className="text-muted-foreground mt-3 text-lg font-medium max-w-2xl">{t("Accounting.ledger_desc")}</p>
            </div>

            <Separator className="bg-primary/5 h-px" />

            <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-2xl overflow-hidden rounded-[3rem] group">
                <CardHeader className="bg-primary/5 border-b border-primary/5 p-8 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-4 text-2xl font-black italic">
                            <div className="p-3 bg-primary/10 rounded-2xl shadow-xl shadow-primary/5 group-hover:scale-110 transition-transform duration-500">
                                <BookOpen className="h-7 w-7 text-primary" />
                            </div>
                            {t("Accounting.journal_entries")}
                        </CardTitle>
                        <CardDescription className="text-base font-medium mt-1">{t("Accounting.journal_consolidated_desc")}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow className="hover:bg-transparent border-primary/5 h-16">
                                <TableHead className="px-8 text-xs font-black uppercase tracking-widest w-[140px]">{t("Common.date")}</TableHead>
                                <TableHead className="text-xs font-black uppercase tracking-widest">{t("Common.description")}</TableHead>
                                <TableHead className="text-xs font-black uppercase tracking-widest">{t("Accounting.account_details")}</TableHead>
                                <TableHead className="text-xs font-black uppercase tracking-widest text-end w-[180px] px-8">{t("Accounting.debit")}</TableHead>
                                <TableHead className="text-xs font-black uppercase tracking-widest text-end w-[180px] px-8">{t("Accounting.credit")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {journalEntries.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-64 text-center text-muted-foreground font-medium text-lg italic">
                                        {t("Accounting.no_transactions")}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                journalEntries.map((entry) => (
                                    <TableRow key={entry.id} className="border-primary/5 hover:bg-primary/[0.02] transition-colors align-top group/row">
                                        <TableCell className="px-8 py-6 font-bold text-sm tracking-tight">
                                            {new Date(entry.date).toLocaleDateString("ar-EG")}
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-black text-base group-hover/row:text-primary transition-colors">{entry.description}</span>
                                                <span className="text-[10px] font-black text-muted-foreground uppercase bg-muted/50 w-fit px-2 py-0.5 rounded-lg tracking-widest">{t("Accounting.reference")}: {entry.reference || "N/A"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-0">
                                            <div className="flex flex-col">
                                                {entry.transactions.map((t, idx) => (
                                                    <div key={t.id} className={cn(
                                                        "py-4 px-6 border-l-2 border-primary/10 flex flex-col justify-center min-h-[70px] group/item hover:bg-primary/[0.03] transition-colors",
                                                        idx !== entry.transactions.length - 1 && "border-b border-primary/5"
                                                    )}>
                                                        <span className="font-bold text-sm group-item-hover:translate-x-1 transition-transform">{t.account.name}</span>
                                                        <span className="text-[10px] font-black text-muted-foreground font-mono tracking-tighter uppercase">{t.account.code}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-0 text-end px-8">
                                            <div className="flex flex-col">
                                                {entry.transactions.map((t, idx) => (
                                                    <div key={t.id} className={cn(
                                                        "py-4 flex items-center justify-end min-h-[70px] font-black text-lg tracking-tighter",
                                                        idx !== entry.transactions.length - 1 && "border-b border-primary/5"
                                                    )}>
                                                        {t.type === "DEBIT" ? formatCurrency(Number(t.amount)) : <span className="opacity-10 text-xs">—</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-0 text-end px-8">
                                            <div className="flex flex-col">
                                                {entry.transactions.map((t, idx) => (
                                                    <div key={t.id} className={cn(
                                                        "py-4 flex items-center justify-end min-h-[70px] font-black text-lg tracking-tighter text-destructive/80",
                                                        idx !== entry.transactions.length - 1 && "border-b border-primary/5"
                                                    )}>
                                                        {t.type === "CREDIT" ? formatCurrency(Number(t.amount)) : <span className="opacity-10 text-xs">—</span>}
                                                    </div>
                                                ))}
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
