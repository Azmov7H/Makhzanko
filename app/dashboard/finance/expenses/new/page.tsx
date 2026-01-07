"use client";

import { createExpenseAction } from "@/actions/expenses";
import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Save, Sparkles, DollarSign, Receipt, Tag, Calendar, Layout } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { motion } from "framer-motion";

export default function NewExpensePage() {
    const { t } = useI18n();
    const [state, action, isPending] = useActionState(createExpenseAction, null);

    const categories = [
        "RENT",
        "SALARIES",
        "UTILITIES",
        "MARKETING",
        "MAINTENANCE",
        "OTHER",
    ];

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20 max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative">
                <div className="relative">
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-primary/20 rounded-full blur-sm" />
                    <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent italic">
                        {t("Expenses.add_expense")}
                    </h1>
                    <p className="text-muted-foreground mt-3 text-lg font-medium max-w-2xl">{t("Expenses.create_desc")}</p>
                </div>
                <Button asChild variant="outline" className="h-16 px-8 rounded-2xl border-primary/10 bg-card/40 backdrop-blur-xl hover:bg-primary/5 hover:border-primary/20 transition-all duration-500 group">
                    <Link href="/dashboard/finance/expenses" className="flex items-center gap-3">
                        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-black text-xs uppercase tracking-widest text-primary/70">{t("Common.cancel")}</span>
                    </Link>
                </Button>
            </div>

            {state?.error && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl bg-destructive/10 border border-destructive/20 p-6 text-sm text-destructive font-bold flex items-center gap-4 shadow-xl shadow-destructive/5"
                >
                    <div className="p-2 bg-destructive/20 rounded-xl">
                        <Receipt className="h-5 w-5 text-destructive" />
                    </div>
                    {state.error}
                </motion.div>
            )}

            <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-3xl rounded-[3rem] overflow-hidden group">
                <CardHeader className="bg-primary/5 border-b border-primary/5 p-10">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-primary/10 rounded-2xl text-primary shadow-xl shadow-primary/5 group-hover:scale-110 transition-all duration-500">
                            <Receipt className="h-8 w-8" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-black italic tracking-tight">{t("Expenses.expense_details")}</CardTitle>
                            <CardDescription className="text-base font-medium">{t("Expenses.fill_details_desc")}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-10">
                    <form action={action} className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <Label className="text-xs font-black uppercase tracking-[0.2em] text-primary/60 ml-1 flex items-center gap-2">
                                    <Tag className="h-3 w-3" />
                                    {t("Common.description")}
                                </Label>
                                <Input
                                    name="description"
                                    placeholder={t("Expenses.description_placeholder")}
                                    required
                                    className="h-16 rounded-2xl bg-muted/30 border-primary/5 focus:ring-primary/20 transition-all font-bold text-lg placeholder:text-muted-foreground/30"
                                />
                            </div>

                            <div className="space-y-4">
                                <Label className="text-xs font-black uppercase tracking-[0.2em] text-primary/60 ml-1 flex items-center gap-2">
                                    <Layout className="h-3 w-3" />
                                    {t("Expenses.category")}
                                </Label>
                                <Select name="category" required>
                                    <SelectTrigger className="h-16 rounded-2xl bg-muted/30 border-primary/5 focus:ring-primary/20 transition-all font-bold text-lg">
                                        <SelectValue placeholder={t("Expenses.select_category")} />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-primary/10 shadow-2xl">
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat} className="h-12 font-medium">
                                                {t(`Expenses.categories.${cat}`)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-xs font-black uppercase tracking-[0.2em] text-primary/60 ml-1 flex items-center gap-2">
                                    <DollarSign className="h-3 w-3" />
                                    {t("Expenses.amount")}
                                </Label>
                                <div className="relative group">
                                    <Input
                                        name="amount"
                                        type="number"
                                        step="0.01"
                                        required
                                        className="h-16 pl-12 rounded-2xl bg-muted/30 border-primary/5 focus:ring-primary/20 transition-all font-black text-2xl group-hover:bg-muted/50"
                                    />
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/40 font-black text-xl">$</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-xs font-black uppercase tracking-[0.2em] text-primary/60 ml-1 flex items-center gap-2">
                                    <Calendar className="h-3 w-3" />
                                    {t("Expenses.date")}
                                </Label>
                                <Input
                                    name="date"
                                    type="date"
                                    defaultValue={new Date().toISOString().split("T")[0]}
                                    required
                                    className="h-16 rounded-2xl bg-muted/30 border-primary/5 focus:ring-primary/20 transition-all font-bold text-lg"
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-primary/5">
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full h-20 rounded-[2rem] bg-primary shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 group relative overflow-hidden"
                            >
                                <div className="relative z-10 flex items-center justify-center gap-4">
                                    <Save className="h-7 w-7 group-hover:scale-110 transition-transform" />
                                    <span className="font-black text-lg uppercase tracking-[0.2em]">
                                        {isPending ? t("Expenses.recording") : t("Expenses.add_button")}
                                    </span>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
