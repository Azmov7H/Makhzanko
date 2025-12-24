"use client";

import { use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Users, TrendingDown, DollarSign, ArrowRight, Wallet, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatCurrency, cn } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";

interface CustomerDirectoryProps {
    params: Promise<{ locale: string }>;
    customersWithBalance: any[];
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1 }
};

export default function CustomerDirectoryClient({
    params,
    customersWithBalance
}: CustomerDirectoryProps) {
    const { locale } = use(params);

    const totalDebt = customersWithBalance.reduce((sum, c) => sum + Math.max(0, c.balance), 0);
    const activeCreditors = customersWithBalance.filter(c => c.balance > 0).length;
    const totalLoyalty = customersWithBalance.reduce((sum, c) => sum + (c.loyaltyPoints || 0), 0);

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8 px-4 md:px-0 max-w-6xl mx-auto text-start pb-10"
        >
            <div className="flex flex-col gap-2">
                <motion.div variants={item} className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-sm font-bold tracking-widest uppercase text-muted-foreground/60">Portfolio Management</span>
                </motion.div>
                <motion.h1
                    variants={item}
                    className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                >
                    Customer Statements
                </motion.h1>
                <motion.p variants={item} className="text-muted-foreground text-lg">
                    Comprehensive overview of customer balances, debt, and loyalty.
                </motion.p>
            </div>

            <Separator className="bg-primary/10" />

            <div className="grid gap-6 md:grid-cols-3">
                {[
                    { title: "Total Outstanding Debt", value: formatCurrency(totalDebt), icon: TrendingDown, color: "text-destructive", bg: "bg-destructive/10" },
                    { title: "Active Creditors", value: activeCreditors.toString(), icon: Wallet, color: "text-primary", bg: "bg-primary/10" },
                    { title: "Loyalty Points", value: totalLoyalty.toLocaleString(), icon: BadgeCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                ].map((stat, i) => (
                    <motion.div key={i} variants={item}>
                        <Card className="border-none shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-2xl group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
                            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-full -mr-12 -mt-12 blur-3xl`} />
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{stat.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className={cn("text-3xl font-black", stat.color)}>
                                    {stat.value}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <motion.div variants={item}>
                <Card className="border-none shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-2xl overflow-hidden rounded-2xl group">
                    <CardHeader className="bg-muted/30 border-b border-primary/5 py-6">
                        <CardTitle className="flex items-center gap-3 text-xl font-bold">
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                            Customer Directory
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/10">
                                <TableRow className="hover:bg-transparent border-primary/5">
                                    <TableHead className="py-4 px-6 text-right">Customer</TableHead>
                                    <TableHead className="text-right">Total Sales</TableHead>
                                    <TableHead className="text-right">Total Paid</TableHead>
                                    <TableHead className="text-right">Current Balance</TableHead>
                                    <TableHead className="text-left px-6">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customersWithBalance.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                                            No customers found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    customersWithBalance.map((c) => (
                                        <TableRow key={c.id} className="border-primary/5 hover:bg-primary/5 transition-colors group/row">
                                            <TableCell className="py-4 px-6">
                                                <div className="flex flex-col">
                                                    <span className="font-bold group-hover/row:text-primary transition-colors">{c.name}</span>
                                                    <span className="text-xs text-muted-foreground">{c.phone || c.email || "No contact info"}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">{formatCurrency(c.totalSales)}</TableCell>
                                            <TableCell className="text-right font-medium text-emerald-500">{formatCurrency(c.totalPayments)}</TableCell>
                                            <TableCell className={cn("text-right font-black", c.balance > 0 ? "text-destructive" : "text-emerald-500")}>
                                                {formatCurrency(c.balance)}
                                            </TableCell>
                                            <TableCell className="text-left px-6">
                                                <Button asChild variant="ghost" size="sm" className="gap-2 font-bold hover:bg-primary/10 rounded-full group/btn">
                                                    <Link href={`/${locale}/dashboard/finance/customers/${c.id}`}>
                                                        View <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
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
            </motion.div>
        </motion.div>
    );
}
