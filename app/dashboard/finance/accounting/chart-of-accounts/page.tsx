"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Eye, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAuthToken } from "@/lib/auth/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartAccount {
    id: string;
    code: string;
    name: string;
    type: string;
}

export default function ChartOfAccountsPage() {
    const { t } = useI18n();
    const [accounts, setAccounts] = useState<ChartAccount[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const token = getAuthToken();
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/accounting/chart-of-accounts`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setAccounts(data);
                }
            } catch (error) {
                console.error("Failed to fetch chart of accounts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAccounts();
    }, []);

    if (loading) return <ChartOfAccountsSkeleton />;

    return (
        <div className="space-y-10 animate-in fade-in duration-700 text-start pb-20">
            <div className="relative">
                <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-primary/20 rounded-full blur-sm" />
                <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent italic">
                    {t("Accounting.chart_title")}
                </h1>
                <p className="text-muted-foreground mt-3 text-lg font-medium max-w-2xl">{t("Accounting.chart_desc")}</p>
            </div>

            <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-2xl rounded-[3rem] overflow-hidden group">
                <CardHeader className="bg-primary/5 border-b border-primary/5 p-8">
                    <CardTitle className="flex items-center gap-4 text-2xl font-black italic">
                        <div className="p-3 bg-primary/10 rounded-2xl shadow-xl shadow-primary/5 group-hover:scale-110 transition-transform duration-500">
                            <ClipboardList className="h-7 w-7 text-primary" />
                        </div>
                        {t("Accounting.accounts_list")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow className="h-16 hover:bg-transparent border-primary/5">
                                <TableHead className="px-8 text-xs font-black uppercase tracking-widest w-[150px]">{t("Common.code")}</TableHead>
                                <TableHead className="text-xs font-black uppercase tracking-widest">{t("Accounting.account_name")}</TableHead>
                                <TableHead className="text-xs font-black uppercase tracking-widest">{t("Common.type")}</TableHead>
                                <TableHead className="text-center px-8 text-xs font-black uppercase tracking-widest w-[200px]">{t("Common.actions")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {accounts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-48 text-center text-muted-foreground/30 italic font-black text-xl italic uppercase tracking-widest">{t("Common.no_data")}</TableCell>
                                </TableRow>
                            ) : (
                                accounts.map(account => (
                                    <TableRow key={account.id} className="border-primary/5 hover:bg-primary/[0.02] transition-colors group/row">
                                        <TableCell className="px-8 py-5">
                                            <span className="font-black text-primary bg-primary/10 px-3 py-1 rounded-xl text-sm tracking-tighter">
                                                {account.code}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-5 font-bold text-lg group-hover/row:translate-x-1 transition-transform">{account.name}</TableCell>
                                        <TableCell className="py-5">
                                            <Badge variant="secondary" className="bg-muted/50 text-muted-foreground font-black tracking-widest text-[10px] uppercase rounded-full px-3 py-1 border-none shadow-sm group-hover/row:bg-primary/10 group-hover/row:text-primary transition-colors">
                                                {account.type.toLowerCase().replace("_", " ")}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center px-8 py-5">
                                            <Button asChild variant="ghost" className="gap-2 font-black text-xs uppercase tracking-widest hover:bg-primary/10 rounded-2xl h-10 group/btn">
                                                <Link href={`/dashboard/finance/accounting/ledger/${account.id}`}>
                                                    <Eye className="h-4 w-4 text-primary" />
                                                    {t("Accounting.view_ledger")}
                                                    <ArrowRight className="h-3 w-3 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                                                </Link>
                                            </Button>
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

function ChartOfAccountsSkeleton() {
    return (
        <div className="space-y-10 py-12 px-4 max-w-7xl mx-auto animate-pulse">
            <Skeleton className="h-16 w-1/2 rounded-2xl" />
            <Skeleton className="h-[600px] w-full rounded-[3rem]" />
        </div>
    );
}
