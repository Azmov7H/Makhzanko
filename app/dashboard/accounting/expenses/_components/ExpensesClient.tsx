"use client";

import { createExpenseAction, deleteExpenseAction } from "@/actions/expenses";
import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/context";
import { formatCurrency } from "@/lib/utils";
import { Wallet, Plus, Trash2, Calendar, FileText, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ExpensesClientProps {
    expenses: any[];
}

export function ExpensesClient({ expenses }: ExpensesClientProps) {
    const { t } = useI18n();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const formData = new FormData();
            formData.append("description", description);
            formData.append("amount", amount);
            formData.append("category", category);

            const result = await createExpenseAction(null, formData);

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success(t("Common.success"));
                setDescription("");
                setAmount("");
                setCategory("");
                router.refresh();
            }
        });
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t("Common.are_you_sure"))) return;

        const result = await deleteExpenseAction(id);
        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success(t("Common.deleted"));
            router.refresh();
        }
    };

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
                <motion.div variants={item} className="space-y-4">
                    <Button asChild variant="ghost" className="group rounded-full pl-2 pr-5 hover:bg-primary/10 transition-all duration-500">
                        <Link href="/dashboard/accounting" className="flex items-center gap-2">
                            <div className="p-2 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
                                <ArrowLeft className="h-4 w-4 text-primary" />
                            </div>
                            <span className="font-black text-xs uppercase tracking-widest text-primary/70">{t("Common.back")}</span>
                        </Link>
                    </Button>
                    <div className="relative">
                        <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-primary/20 rounded-full blur-sm" />
                        <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent italic">
                            {t("Accounting.expenses")}
                        </h1>
                        <p className="text-muted-foreground mt-3 text-lg font-medium max-w-2xl">
                            {t("Accounting.expenses_desc")}
                        </p>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <motion.div variants={item} className="lg:col-span-1">
                    <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-3xl rounded-[3rem] overflow-hidden sticky top-8">
                        <CardHeader className="p-10 border-b border-primary/5 bg-primary/5">
                            <CardTitle className="text-2xl font-black italic">{t("Accounting.new_expense")}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-10">
                            <form onSubmit={handleCreate} className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">{t("Common.description")}</Label>
                                    <Input
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        placeholder={t("Accounting.expense_desc_placeholder")}
                                        className="h-12 rounded-2xl bg-muted/30 border-primary/10 font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">{t("Common.amount")}</Label>
                                    <Input
                                        type="number"
                                        value={amount}
                                        onChange={e => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="h-12 rounded-2xl bg-muted/30 border-primary/10 font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">{t("Common.category")}</Label>
                                    <Select value={category} onValueChange={setCategory}>
                                        <SelectTrigger className="h-12 rounded-2xl bg-muted/30 border-primary/10 font-bold">
                                            <SelectValue placeholder={t("Common.select")} />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-none shadow-xl">
                                            <SelectItem value="Rent">Rent</SelectItem>
                                            <SelectItem value="Utilities">Utilities</SelectItem>
                                            <SelectItem value="Salaries">Salaries</SelectItem>
                                            <SelectItem value="Marketing">Marketing</SelectItem>
                                            <SelectItem value="Maintenance">Maintenance</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button type="submit" disabled={isPending} className="w-full h-14 rounded-2xl bg-primary shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all font-black uppercase tracking-widest">
                                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : t("Accounting.add_expense")}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={item} className="lg:col-span-2">
                    <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-3xl rounded-[3rem] overflow-hidden">
                        <CardHeader className="p-10 border-b border-primary/5 bg-primary/5">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-primary/10 rounded-2xl text-primary shadow-xl shadow-primary/5">
                                    <FileText className="h-7 w-7" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-black italic">{t("Accounting.recent_expenses")}</CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow className="h-16 hover:bg-transparent border-primary/5">
                                        <TableHead className="px-10 text-xs font-black uppercase tracking-widest">{t("Common.date")}</TableHead>
                                        <TableHead className="text-xs font-black uppercase tracking-widest">{t("Common.description")}</TableHead>
                                        <TableHead className="text-xs font-black uppercase tracking-widest">{t("Common.category")}</TableHead>
                                        <TableHead className="text-right text-xs font-black uppercase tracking-widest">{t("Common.amount")}</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {expenses.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-40 text-center text-muted-foreground/30 font-black italic text-lg uppercase tracking-widest">
                                                {t("Common.no_data")}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        expenses.map((expense) => (
                                            <TableRow key={expense.id} className="group/row hover:bg-primary/[0.02] transition-all duration-500 border-primary/5 h-20">
                                                <TableCell className="px-10 font-bold text-muted-foreground">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 opacity-40" />
                                                        {new Date(expense.date).toLocaleDateString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-black text-lg">{expense.description}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="rounded-lg bg-primary/5 text-primary border-primary/10 hover:bg-primary/10">
                                                        {expense.category}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-black text-xl tracking-tighter text-destructive">
                                                    -{formatCurrency(Number(expense.amount))}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(expense.id)}
                                                        className="opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive rounded-xl"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
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
            </div>
        </motion.div>
    );
}
