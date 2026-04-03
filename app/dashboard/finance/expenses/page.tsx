"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Plus, Receipt, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/context";
import { formatCurrency, cn } from "@/lib/utils";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthToken } from "@/lib/auth/AuthContext";
import { toast } from "sonner";

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { t, locale } = useI18n();

    const fetchExpenses = async () => {
        try {
            const token = getAuthToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/expenses`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setExpenses(data);
            }
        } catch (error) {
            console.error("Failed to fetch expenses:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm(t("Common.confirm_delete") || "Are you sure?")) return;
        
        try {
            const token = getAuthToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/expenses/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success(t("Common.success"));
                fetchExpenses();
            } else {
                toast.error(t("Common.error"));
            }
        } catch (error) {
            toast.error(t("Common.error"));
        }
    };

    if (loading) return <ExpensesSkeleton />;

    return (
        <div className="space-y-10 animate-in fade-in duration-700 text-start pb-20 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="relative">
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-primary/20 rounded-full blur-sm" />
                    <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent italic">
                        {t("Expenses.title")}
                    </h1>
                    <p className="text-muted-foreground mt-3 text-lg font-medium max-w-2xl">{t("Expenses.description")}</p>
                </div>
                <Button asChild className="h-14 px-8 rounded-2xl bg-primary shadow-2xl shadow-primary/20 hover:scale-105 transition-all gap-3 font-black text-xs uppercase tracking-widest group">
                    <Link href="/dashboard/finance/expenses/new">
                        <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-500" />
                        {t("Expenses.add_expense")}
                    </Link>
                </Button>
            </div>

            <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-2xl rounded-[3rem] overflow-hidden group">
                <CardHeader className="bg-primary/5 border-b border-primary/5 p-8">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-primary/10 rounded-2xl text-primary shadow-xl shadow-primary/5 group-hover:scale-110 transition-transform duration-500">
                            <History className="h-7 w-7" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-black italic">{t("Expenses.list_title")}</CardTitle>
                            <CardDescription className="text-base font-medium mt-1">{t("Expenses.list_desc")}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow className="h-16 hover:bg-transparent border-primary/5">
                                <TableHead className="px-8 text-xs font-black uppercase tracking-widest w-[160px]">{t("Expenses.date")}</TableHead>
                                <TableHead className="text-xs font-black uppercase tracking-widest">{t("Common.description")}</TableHead>
                                <TableHead className="text-xs font-black uppercase tracking-widest">{t("Expenses.category")}</TableHead>
                                <TableHead className="text-end px-8 text-xs font-black uppercase tracking-widest w-[180px]">{t("Expenses.amount")}</TableHead>
                                <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {expenses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground opacity-30 animate-pulse">
                                            <Receipt className="h-20 w-20" />
                                            <p className="text-xl font-black italic">{t("Expenses.no_expenses")}</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                expenses.map((expense) => (
                                    <TableRow key={expense.id} className="border-primary/5 hover:bg-primary/[0.02] transition-colors group/row h-24">
                                        <TableCell className="px-8 font-bold text-sm tracking-tight opacity-70">
                                            {new Date(expense.date).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-black text-lg group-hover/row:text-primary transition-colors">{expense.description}</span>
                                        </TableCell>
                                        <TableCell>
                                            {(() => {
                                                const categoryStyles: Record<string, string> = {
                                                    MARKETING: "bg-blue-500/10 text-blue-500",
                                                    SALARIES: "bg-purple-500/10 text-purple-500",
                                                    UTILITIES: "bg-amber-500/10 text-amber-500",
                                                    RENT: "bg-emerald-500/10 text-emerald-500",
                                                    MAINTENANCE: "bg-rose-500/10 text-rose-500",
                                                    SUPPLIES: "bg-indigo-500/10 text-indigo-500",
                                                    OTHER: "bg-slate-500/10 text-slate-500"
                                                };
                                                const style = categoryStyles[expense.category] || categoryStyles.OTHER;
                                                return (
                                                    <Badge variant="outline" className={cn("rounded-xl px-3 py-1 font-black text-[10px] uppercase tracking-widest border-none shadow-sm", style)}>
                                                        {t(`Expenses.categories.${expense.category}`)}
                                                    </Badge>
                                                );
                                            })()}
                                        </TableCell>
                                        <TableCell className="text-end px-8">
                                            <span className="font-black text-2xl tracking-tighter text-primary">
                                                {formatCurrency(Number(expense.amount))}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-8">
                                            <div className="flex justify-end">
                                                <Button
                                                    onClick={() => handleDelete(expense.id)}
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-12 w-12 text-destructive/40 hover:text-destructive hover:bg-destructive/10 rounded-2xl transition-all"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                    <span className="sr-only">{t("Expenses.delete")}</span>
                                                </Button>
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

function ExpensesSkeleton() {
    return (
        <div className="space-y-10 max-w-6xl mx-auto pb-20 px-4">
            <div className="flex justify-between items-center bg-card/40 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-primary/5">
                <div className="space-y-3">
                    <Skeleton className="h-12 w-64 rounded-xl" />
                    <Skeleton className="h-6 w-96 rounded-lg opacity-50" />
                </div>
                <Skeleton className="h-14 w-40 rounded-2xl" />
            </div>
            <Skeleton className="h-[600px] w-full rounded-[3rem] shadow-3xl" />
        </div>
    );
}
