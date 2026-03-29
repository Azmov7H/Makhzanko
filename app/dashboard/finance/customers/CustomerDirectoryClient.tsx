"use client";

import { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Users, TrendingDown, Wallet, BadgeCheck, ArrowRight } from "lucide-react";
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

interface CustomerWithBalance {
    id: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    balance: number;
    totalSales: number;
    totalPayments: number;
    loyaltyPoints?: number;
}

// Interface removed as it is not passed as props anymore, but we can keep it
// We don't take props anymore


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

export default function CustomerDirectoryClient() {
    const [customersWithBalance, setCustomersWithBalance] = useState<CustomerWithBalance[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCustomers() {
            try {
                // In a real app we might want to fetch sales and payments or use a new rust endpoint
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/customers`, {
                    credentials: 'include'
                });
                if (res.ok) {
                    const data = await res.json();
                    const mapped = data.map((c: any) => ({
                        id: c.id,
                        name: c.name,
                        phone: c.phone,
                        email: c.email,
                        balance: 0, // Pending backend endpoint for balance
                        totalSales: 0,
                        totalPayments: 0,
                        loyaltyPoints: 0
                    }));
                    setCustomersWithBalance(mapped);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchCustomers();
    }, []);

    if (loading) {
        return <div className="flex h-64 items-center justify-center space-x-2 text-primary font-bold"><span className="animate-pulse">Loading Customers...</span></div>;
    }

    const totalDebt = customersWithBalance.reduce((sum: number, c) => sum + Math.max(0, c.balance), 0);
    const activeCreditors = customersWithBalance.filter(c => c.balance > 0).length;
    const totalLoyalty = customersWithBalance.reduce((sum: number, c) => sum + (c.loyaltyPoints || 0), 0);

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-10 px-4 md:px-0 max-w-6xl mx-auto text-start pb-20"
        >
            <div className="flex flex-col gap-3 relative">
                <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-20 bg-primary/20 rounded-full blur-sm" />
                <motion.div variants={item} className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 rounded-2xl shadow-inner backdrop-blur-md">
                        <Users className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs font-black tracking-[0.3em] uppercase text-primary/60">Portfolio Management</span>
                </motion.div>
                <motion.h1
                    variants={item}
                    className="text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent italic"
                >
                    Customer Statements
                </motion.h1>
                <motion.p variants={item} className="text-muted-foreground text-xl font-medium max-w-2xl">
                    Comprehensive overview of customer balances, debt, and loyalty metrics in real-time.
                </motion.p>
            </div>

            <Separator className="bg-primary/5 h-px" />

            <div className="grid gap-8 md:grid-cols-3">
                {[
                    { title: "Total Outstanding Debt", value: formatCurrency(totalDebt), icon: TrendingDown, color: "text-destructive", bg: "bg-destructive/10", shadow: "shadow-destructive/5" },
                    { title: "Active Creditors", value: activeCreditors.toString(), icon: Wallet, color: "text-primary", bg: "bg-primary/10", shadow: "shadow-primary/5" },
                    { title: "Loyalty Points", value: totalLoyalty.toLocaleString(), icon: BadgeCheck, color: "text-emerald-500", bg: "bg-emerald-500/10", shadow: "shadow-emerald-500/5" },
                ].map((stat, i) => (
                    <motion.div key={i} variants={item}>
                        <Card className={cn(
                            "border-none shadow-2xl bg-card/40 backdrop-blur-3xl group hover:scale-[1.03] transition-all duration-500 relative overflow-hidden rounded-[2.5rem]",
                            stat.shadow
                        )}>
                            <div className={cn("absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 blur-3xl opacity-20", stat.bg)} />
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">{stat.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className={cn("text-4xl font-black tracking-tighter", stat.color)}>
                                    {stat.value}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <motion.div variants={item}>
                <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-2xl overflow-hidden rounded-[3rem] group">
                    <CardHeader className="bg-primary/5 border-b border-primary/5 p-8">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-4 text-2xl font-black italic">
                                <div className="p-3 bg-primary/10 rounded-2xl shadow-xl shadow-primary/5">
                                    <Users className="h-7 w-7 text-primary" />
                                </div>
                                Customer Directory
                            </CardTitle>
                            <div className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                                {customersWithBalance.length} Records Found
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow className="hover:bg-transparent border-primary/5">
                                    <TableHead className="py-6 px-8 text-start font-black text-xs uppercase tracking-widest">Customer</TableHead>
                                    <TableHead className="text-end font-black text-xs uppercase tracking-widest">Total Sales</TableHead>
                                    <TableHead className="text-end font-black text-xs uppercase tracking-widest">Total Paid</TableHead>
                                    <TableHead className="text-end font-black text-xs uppercase tracking-widest">Current Balance</TableHead>
                                    <TableHead className="text-center px-8 font-black text-xs uppercase tracking-widest">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customersWithBalance.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-48 text-center text-muted-foreground italic font-medium text-lg">
                                            No customer data available yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    customersWithBalance.map((c) => (
                                        <TableRow key={c.id} className="border-primary/5 hover:bg-primary/[0.02] transition-colors group/row">
                                            <TableCell className="py-6 px-8">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-lg font-black group-hover/row:text-primary transition-all duration-300">{c.name}</span>
                                                    <span className="text-xs font-bold text-muted-foreground/60 tracking-wider uppercase">{c.phone || c.email || "No contact info"}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-end text-base font-bold">{formatCurrency(c.totalSales)}</TableCell>
                                            <TableCell className="text-end text-base font-bold text-emerald-500/80">{formatCurrency(c.totalPayments)}</TableCell>
                                            <TableCell className={cn("text-end text-xl font-black tracking-tighter", c.balance > 0 ? "text-destructive" : "text-emerald-500")}>
                                                {formatCurrency(c.balance)}
                                            </TableCell>
                                            <TableCell className="text-center px-8">
                                                <Button asChild variant="ghost" className="h-12 w-12 p-0 rounded-2xl hover:bg-primary/10 group/btn transition-all active:scale-90">
                                                    <Link href={`/dashboard/finance/customers/${c.id}`}>
                                                        <ArrowRight className="h-6 w-6 text-primary group-hover/btn:translate-x-1 transition-transform" />
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
