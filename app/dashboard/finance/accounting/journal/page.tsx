"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/context";
import { History, FileText } from "lucide-react";
import { getAuthToken } from "@/lib/auth/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

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
    date: string;
    description: string;
    reference?: string | null;
    transactions: JournalTransaction[];
}

export default function JournalEntriesPage() {
    const { t, locale } = useI18n();
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const token = getAuthToken();
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/accounting/journal`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setEntries(data);
                }
            } catch (error) {
                console.error("Failed to fetch journal entries:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEntries();
    }, []);

    if (loading) return <JournalSkeleton />;

    return (
        <div className="space-y-10 animate-in fade-in duration-700 text-start pb-20">
            <div className="relative">
                <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-primary/20 rounded-full blur-sm" />
                <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent italic">
                    {t("Accounting.journal_entries")}
                </h1>
                <p className="text-muted-foreground mt-3 text-lg font-medium max-w-2xl">{t("Accounting.journal_desc")}</p>
            </div>

            <div className="space-y-8">
                {entries.map(entry => (
                    <Card key={entry.id} className="overflow-hidden border-none shadow-2xl shadow-primary/5 bg-card/60 backdrop-blur-2xl rounded-[2.5rem] group hover:shadow-primary/10 transition-all duration-500">
                        <CardHeader className="bg-primary/5 border-b border-primary/5 p-8">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-5">
                                    <div className="bg-primary/10 p-4 rounded-2xl text-primary shadow-xl shadow-primary/5 group-hover:scale-110 transition-transform duration-500">
                                        <FileText className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl font-black italic mb-1 group-hover:text-primary transition-colors">{entry.description}</CardTitle>
                                        <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground/70">
                                            <span className="bg-muted px-2 py-0.5 rounded-lg">
                                                {new Date(entry.date).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                                            </span>
                                            <span className="opacity-30">•</span>
                                            <span>{t("Accounting.reference")}: <span className="text-foreground">{entry.reference || "N/A"}</span></span>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[10px] text-muted-foreground font-black tracking-[0.2em] uppercase bg-background/50 px-4 py-1.5 rounded-xl border border-primary/10 shadow-inner">
                                    ID: {entry.id.split('-')[0]}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow className="h-14 hover:bg-transparent border-primary/5">
                                        <TableHead className="px-8 text-xs font-black uppercase tracking-widest">{t("Accounting.account")}</TableHead>
                                        <TableHead className="text-xs font-black uppercase tracking-widest text-end w-[180px] px-8">{t("Accounting.debit")}</TableHead>
                                        <TableHead className="text-xs font-black uppercase tracking-widest text-end w-[180px] px-8">{t("Accounting.credit")}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {entry.transactions.map((tx) => (
                                        <TableRow key={tx.id} className="border-primary/5 hover:bg-primary/[0.02] transition-colors group/row">
                                            <TableCell className="py-5 px-8">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-black text-primary bg-primary/10 px-2 py-0.5 rounded-lg text-xs tracking-tighter">{tx.account.code}</span>
                                                    <span className="text-base font-bold group-hover/row:translate-x-1 transition-transform">{tx.account.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-5 text-end px-8">
                                                {tx.type === "DEBIT" ? (
                                                    <span className="font-black text-lg tracking-tighter">{Number(tx.amount).toLocaleString()}</span>
                                                ) : <span className="opacity-10">—</span>}
                                            </TableCell>
                                            <TableCell className="py-5 text-end px-8">
                                                {tx.type === "CREDIT" ? (
                                                    <span className="font-black text-lg tracking-tighter">{Number(tx.amount).toLocaleString()}</span>
                                                ) : <span className="opacity-10">—</span>}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ))}

                {entries.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 bg-muted/20 rounded-[3rem] border-2 border-dashed border-primary/10 animate-pulse">
                        <History className="h-20 w-20 text-muted-foreground/20 mb-6" />
                        <p className="text-muted-foreground font-black text-xl italic">{t("Accounting.no_entries")}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function JournalSkeleton() {
    return (
        <div className="space-y-10 py-12 px-4 max-w-7xl mx-auto animate-pulse">
            <Skeleton className="h-20 w-1/3 rounded-xl" />
            <div className="space-y-8">
                {[1, 2].map(i => (
                    <Skeleton key={i} className="h-64 rounded-[2.5rem]" />
                ))}
            </div>
        </div>
    );
}
