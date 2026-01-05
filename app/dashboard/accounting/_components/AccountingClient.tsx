"use client";

import { motion } from "framer-motion";
import { Wallet, TrendingUp, TrendingDown, DollarSign, Scale, PieChart, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/context";
import { formatCurrency, cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface AccountingClientProps {
    balanceSheet: any;
    accounts: any[];
}

export function AccountingClient({ balanceSheet, accounts }: AccountingClientProps) {
    const { t } = useI18n();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            className="max-w-7xl mx-auto py-12 px-4 space-y-12 text-start"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 text-start">
                <motion.div variants={item} className="relative">
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-primary/20 rounded-full blur-sm" />
                    <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent italic">
                        {t("Accounting.title")}
                    </h1>
                    <p className="text-muted-foreground mt-3 text-lg font-medium max-w-2xl">
                        {t("Accounting.description")}
                    </p>
                </motion.div>
                <div className="flex gap-4">
                    <Button asChild variant="outline" className="rounded-2xl h-12 border-primary/10 hover:bg-primary/5 font-black uppercase tracking-widest text-xs">
                        <Link href="/dashboard/accounting/expenses">{t("Accounting.manage_expenses")}</Link>
                    </Button>
                </div>
            </div>

            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="border-none shadow-sm bg-card rounded-[2.5rem] overflow-hidden group">
                    <CardHeader className="p-8 pb-4">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                        </div>
                        <CardTitle className="text-lg font-black uppercase tracking-widest text-muted-foreground/60">{t("Accounting.assets")}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                        <div className="text-4xl font-black text-foreground tracking-tighter">
                            {formatCurrency(balanceSheet.totalAssets)}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-card rounded-[2.5rem] overflow-hidden group">
                    <CardHeader className="p-8 pb-4">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-destructive/10 rounded-2xl text-destructive mb-4 group-hover:scale-110 transition-transform">
                                <TrendingDown className="h-6 w-6" />
                            </div>
                        </div>
                        <CardTitle className="text-lg font-black uppercase tracking-widest text-muted-foreground/60">{t("Accounting.liabilities")}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                        <div className="text-4xl font-black text-foreground tracking-tighter">
                            {formatCurrency(balanceSheet.totalLiabilities)}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-card rounded-[2.5rem] overflow-hidden group">
                    <CardHeader className="p-8 pb-4">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-primary/10 rounded-2xl text-primary mb-4 group-hover:scale-110 transition-transform">
                                <Scale className="h-6 w-6" />
                            </div>
                        </div>
                        <CardTitle className="text-lg font-black uppercase tracking-widest text-muted-foreground/60">{t("Accounting.equity")}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                        <div className="text-4xl font-black text-foreground tracking-tighter">
                            {formatCurrency(balanceSheet.totalEquity)}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={item}>
                <Card className="border-none shadow-sm bg-card rounded-[3rem] overflow-hidden">
                    <CardHeader className="p-10 border-b border-primary/5 bg-primary/5">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-primary/10 rounded-2xl text-primary shadow-xl shadow-primary/5">
                                <Wallet className="h-7 w-7" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black italic">{t("Accounting.balance_sheet")}</CardTitle>
                                <CardDescription className="text-base font-medium mt-1">{t("Accounting.balance_sheet_desc")}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Assets */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                                    <ArrowUpRight className="h-5 w-5" />
                                    {t("Accounting.assets")}
                                </h3>
                                <div className="space-y-4">
                                    {balanceSheet.assets.map((account: any) => (
                                        <div key={account.id} className="flex justify-between items-center p-4 rounded-2xl bg-card/40 border border-primary/5 hover:border-primary/10 transition-colors">
                                            <div>
                                                <div className="font-bold text-lg">{account.name}</div>
                                                <div className="text-xs font-black uppercase tracking-widest text-muted-foreground/40">{account.code}</div>
                                            </div>
                                            <div className="font-black text-xl tracking-tighter">{formatCurrency(Math.abs(account.balance))}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Liabilities & Equity */}
                            <div className="space-y-12">
                                <div className="space-y-6">
                                    <h3 className="text-xl font-black uppercase tracking-widest text-destructive flex items-center gap-2">
                                        <ArrowDownRight className="h-5 w-5" />
                                        {t("Accounting.liabilities")}
                                    </h3>
                                    <div className="space-y-4">
                                        {balanceSheet.liabilities.map((account: any) => (
                                            <div key={account.id} className="flex justify-between items-center p-4 rounded-2xl bg-card/40 border border-primary/5 hover:border-primary/10 transition-colors">
                                                <div>
                                                    <div className="font-bold text-lg">{account.name}</div>
                                                    <div className="text-xs font-black uppercase tracking-widest text-muted-foreground/40">{account.code}</div>
                                                </div>
                                                <div className="font-black text-xl tracking-tighter">{formatCurrency(Math.abs(account.balance))}</div>
                                            </div>
                                        ))}
                                        {balanceSheet.liabilities.length === 0 && <p className="text-muted-foreground italic">{t("Common.no_data")}</p>}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-xl font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                        <Scale className="h-5 w-5" />
                                        {t("Accounting.equity")}
                                    </h3>
                                    <div className="space-y-4">
                                        {balanceSheet.equity.map((account: any) => (
                                            <div key={account.id} className="flex justify-between items-center p-4 rounded-2xl bg-card/40 border border-primary/5 hover:border-primary/10 transition-colors">
                                                <div>
                                                    <div className="font-bold text-lg">{account.name}</div>
                                                    <div className="text-xs font-black uppercase tracking-widest text-muted-foreground/40">{account.code}</div>
                                                </div>
                                                <div className="font-black text-xl tracking-tighter">{formatCurrency(Math.abs(account.balance))}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
