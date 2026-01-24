"use client";

import { motion } from "framer-motion";
import {
    Calendar,
    TrendingUp,
    TrendingDown,
    CheckCircle2,
    AlertCircle,
    Clock,
    ArrowUpRight,
    ArrowDownLeft,
    MoreHorizontal,
    Search,
    Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n/context";
import { formatCurrency, cn } from "@/lib/utils";
import { useState } from "react";

import { payInstallmentAction } from "@/actions/installments";
import { toast } from "sonner";

interface DebtDashboardProps {
    installments: any[];
}

export function DebtDashboardClient({ installments }: DebtDashboardProps) {
    const { t } = useI18n();
    const [filter, setFilter] = useState<"ALL" | "COLLECTIONS" | "REPAYMENTS">("ALL");
    const [isPending, setIsPending] = useState<string | null>(null);

    const totalCollections = installments
        .filter(i => i.customerId)
        .reduce((sum, i) => sum + Number(i.amount), 0);

    const totalRepayments = installments
        .filter(i => i.supplierId)
        .reduce((sum, i) => sum + Number(i.amount), 0);

    const filteredInstallments = installments.filter(i => {
        if (filter === "COLLECTIONS") return !!i.customerId;
        if (filter === "REPAYMENTS") return !!i.supplierId;
        return true;
    });

    const overdueCount = installments.filter(i => new Date(i.dueDate) < new Date()).length;

    const handlePay = async (id: string) => {
        setIsPending(id);
        try {
            await payInstallmentAction(id);
            toast.success(t("Common.success") || "Payment recorded successfully");
        } catch (error) {
            toast.error(t("Common.error") || "Failed to record payment");
        } finally {
            setIsPending(null);
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
            className="space-y-12 text-start pb-20 px-4 md:px-0 max-w-7xl mx-auto"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <motion.div variants={item} className="relative">
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-primary/20 rounded-full blur-sm" />
                    <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent italic uppercase">
                        {t("Finance.debt_dashboard") || "Debt & Installments"}
                    </h1>
                    <p className="text-muted-foreground mt-3 text-lg font-medium max-w-2xl">
                        {t("Finance.debt_desc") || "Track upcoming collections from customers and repayments to suppliers."}
                    </p>
                </motion.div>

                <motion.div variants={item} className="flex items-center gap-3">
                    <div className="flex p-1.5 bg-muted/40 rounded-2xl backdrop-blur-3xl border border-primary/5">
                        <Button
                            variant={filter === "ALL" ? "secondary" : "ghost"}
                            onClick={() => setFilter("ALL")}
                            className="rounded-xl px-6 font-black text-xs uppercase"
                        >
                            {t("Common.all") || "All"}
                        </Button>
                        <Button
                            variant={filter === "COLLECTIONS" ? "secondary" : "ghost"}
                            onClick={() => setFilter("COLLECTIONS")}
                            className="rounded-xl px-6 font-black text-xs uppercase gap-2"
                        >
                            <ArrowDownLeft className="h-4 w-4 text-emerald-500" />
                            {t("Finance.collections") || "Collections"}
                        </Button>
                        <Button
                            variant={filter === "REPAYMENTS" ? "secondary" : "ghost"}
                            onClick={() => setFilter("REPAYMENTS")}
                            className="rounded-xl px-6 font-black text-xs uppercase gap-2"
                        >
                            <ArrowUpRight className="h-4 w-4 text-destructive" />
                            {t("Finance.repayments") || "Repayments"}
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    {
                        title: "To Collect",
                        value: formatCurrency(totalCollections),
                        icon: TrendingUp,
                        color: "text-emerald-500",
                        bg: "bg-emerald-500/10",
                        desc: "Scheduled from customers"
                    },
                    {
                        title: "To Repay",
                        value: formatCurrency(totalRepayments),
                        icon: TrendingDown,
                        color: "text-destructive",
                        bg: "bg-destructive/10",
                        desc: "Owed to suppliers"
                    },
                    {
                        title: "Overdue",
                        value: overdueCount.toString(),
                        icon: AlertCircle,
                        color: "text-amber-500",
                        bg: "bg-amber-500/10",
                        desc: "Payments past due date"
                    },
                ].map((stat, i) => (
                    <motion.div key={i} variants={item}>
                        <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-all">
                            <div className={cn("absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 blur-3xl opacity-20", stat.bg)} />
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <Badge variant="outline" className="rounded-xl px-3 py-1 font-black text-[10px] uppercase border-primary/10 tracking-[0.2em]">{stat.title}</Badge>
                                    <div className={cn("p-2 rounded-xl bg-muted/40", stat.color)}>
                                        <stat.icon className="h-4 w-4" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className={cn("text-4xl font-black tracking-tighter mb-1", stat.color)}>
                                    {stat.value}
                                </div>
                                <p className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">{stat.desc}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Installments Table */}
            <motion.div variants={item}>
                <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-3xl rounded-[3rem] overflow-hidden group">
                    <CardHeader className="p-10 border-b border-primary/5 bg-primary/5">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-primary/10 rounded-2xl text-primary shadow-xl shadow-primary/5 group-hover:scale-110 transition-transform duration-500">
                                <Clock className="h-7 w-7" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black italic">{t("Finance.installment_schedule") || "Schedule Overview"}</CardTitle>
                                <CardDescription className="text-base font-medium mt-1">
                                    {t("Finance.installment_desc") || "Detailed view of all planned payment phases."}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow className="h-16 hover:bg-transparent border-primary/5">
                                    <TableHead className="px-10 text-xs font-black uppercase tracking-widest">{t("Finance.partner") || "Partner"}</TableHead>
                                    <TableHead className="text-xs font-black uppercase tracking-widest">{t("Finance.due_date") || "Due Date"}</TableHead>
                                    <TableHead className="text-xs font-black uppercase tracking-widest">{t("Finance.amount") || "Amount"}</TableHead>
                                    <TableHead className="text-xs font-black uppercase tracking-widest text-center">{t("Common.status")}</TableHead>
                                    <TableHead className="px-10 text-end text-xs font-black uppercase tracking-widest w-[120px]">{t("Common.actions")}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredInstallments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-48 text-center">
                                            <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground/30 italic">
                                                <Search className="h-12 w-12" />
                                                <p className="text-xl font-black">{t("Finance.no_installments") || "No pending installments"}</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredInstallments.map((inst) => {
                                        const isOverdue = new Date(inst.dueDate) < new Date();
                                        const partnerName = inst.customer?.name || inst.supplier?.name || "Unknown";
                                        const isCollection = !!inst.customerId;

                                        return (
                                            <TableRow key={inst.id} className="group/row hover:bg-primary/[0.02] transition-all duration-500 border-primary/5 h-24">
                                                <TableCell className="px-10">
                                                    <div className="flex items-center gap-4">
                                                        <div className={cn(
                                                            "h-10 w-10 rounded-xl flex items-center justify-center font-black text-xs",
                                                            isCollection ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
                                                        )}>
                                                            {isCollection ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                                                        </div>
                                                        <span className="font-black text-lg group-hover/row:text-primary transition-colors">{partnerName}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-bold text-sm">{new Date(inst.dueDate).toLocaleDateString()}</span>
                                                        {isOverdue && <span className="text-[10px] font-black uppercase text-amber-500 animate-pulse">Overdue</span>}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={cn("text-xl font-black tracking-tighter", isCollection ? "text-emerald-500" : "text-destructive")}>
                                                        {formatCurrency(Number(inst.amount))}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge className={cn(
                                                        "rounded-lg px-3 py-1 font-black text-[10px] uppercase border-none shadow-sm",
                                                        inst.status === "UNPAID" ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"
                                                    )}>
                                                        {inst.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-10 text-end">
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-emerald-500/10 hover:text-emerald-500 rounded-xl transition-all group-hover/row:scale-110">
                                                        <CheckCircle2 className="h-5 w-5" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
