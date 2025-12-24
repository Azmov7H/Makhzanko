import { getTenantContext } from "@/lib/auth";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search, Filter } from "lucide-react";
import { getJournalEntries } from "@/actions/accounting";
import { formatCurrency } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default async function LedgerPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getI18n(locale as Locale);

    const journalEntries = await getJournalEntries();

    return (
        <div className="space-y-6 px-4 md:px-0 max-w-6xl mx-auto text-start">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {t("Dashboard.ledger") || "دفتر الأستاذ العام (General Ledger)"}
                </h1>
                <p className="text-muted-foreground">Comprehensive history of all financial transactions.</p>
            </div>

            <Separator className="bg-primary/5" />

            <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-primary/5 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-primary" />
                            Journal Entries
                        </CardTitle>
                        <CardDescription>Consolidated view of all transaction logs.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/10">
                            <TableRow className="hover:bg-transparent border-primary/5">
                                <TableHead className="w-[120px]">Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Account Details</TableHead>
                                <TableHead className="text-right w-[150px]">Debit</TableHead>
                                <TableHead className="text-right w-[150px]">Credit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {journalEntries.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-64 text-center text-muted-foreground">
                                        No transactions found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                journalEntries.map((entry) => (
                                    <TableRow key={entry.id} className="border-primary/5 hover:bg-primary/5 transition-colors align-top">
                                        <TableCell className="font-medium text-xs pt-4">
                                            {new Date(entry.date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="pt-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm">{entry.description}</span>
                                                <span className="text-[10px] text-muted-foreground uppercase">REF: {entry.reference || "N/A"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-0">
                                            <div className="flex flex-col">
                                                {entry.transactions.map((t, idx) => (
                                                    <div key={t.id} className={cn(
                                                        "py-4 px-4 border-l border-primary/10 flex flex-col justify-center min-h-[60px]",
                                                        idx !== entry.transactions.length - 1 && "border-b border-primary/5"
                                                    )}>
                                                        <span className="font-medium text-xs">{t.account.name}</span>
                                                        <span className="text-[10px] text-muted-foreground font-mono">{t.account.code}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-0 text-right">
                                            <div className="flex flex-col">
                                                {entry.transactions.map((t, idx) => (
                                                    <div key={t.id} className={cn(
                                                        "py-4 px-4 flex items-center justify-end min-h-[60px] font-black",
                                                        idx !== entry.transactions.length - 1 && "border-b border-primary/5"
                                                    )}>
                                                        {t.type === "DEBIT" ? formatCurrency(Number(t.amount)) : "-"}
                                                    </div>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-0 text-right">
                                            <div className="flex flex-col">
                                                {entry.transactions.map((t, idx) => (
                                                    <div key={t.id} className={cn(
                                                        "py-4 px-4 flex items-center justify-end min-h-[60px] font-black text-destructive",
                                                        idx !== entry.transactions.length - 1 && "border-b border-primary/5"
                                                    )}>
                                                        {t.type === "CREDIT" ? formatCurrency(Number(t.amount)) : "-"}
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

// Helper for cn
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
