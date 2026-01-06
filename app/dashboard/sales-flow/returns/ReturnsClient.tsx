"use client";

import { motion } from "framer-motion";
import { RotateCcw, Eye, ArrowLeft, Calendar, FileText, BadgeInfo, Tag, ArrowLeftRight, Package, TrendingDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { formatCurrency, cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";

interface ReturnsClientProps {
    returns: any[];
}

export function ReturnsClient({ returns }: ReturnsClientProps) {
    const { t } = useI18n();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
    } as const;

    const getStatusBadge = (status: string) => {
        const statusStyles: Record<string, string> = {
            PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
            APPROVED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
            COMPLETED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
            REJECTED: "bg-red-500/10 text-red-600 border-red-500/20",
        };
        return statusStyles[status] || "bg-gray-100 text-gray-800";
    };

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-start space-y-12"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative">
                <motion.div variants={item} className="relative">
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-primary/20 rounded-full blur-sm" />
                    <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent italic">
                        {t("Returns.title")}
                    </h1>
                    <p className="text-muted-foreground mt-3 text-lg font-medium max-w-2xl">
                        {t("Returns.description")}
                    </p>
                </motion.div>
                <motion.div variants={item} className="flex gap-4">
                    <Button asChild variant="outline" className="h-16 px-8 rounded-2xl border-primary/10 bg-card/40 backdrop-blur-xl hover:bg-primary/5 hover:border-primary/20 transition-all duration-500 group">
                        <Link href="/dashboard/sales-flow/invoices" className="flex items-center gap-3">
                            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-black text-xs uppercase tracking-widest text-primary/70">{t("Common.back")}</span>
                        </Link>
                    </Button>
                    <Button asChild className="h-16 px-10 rounded-[2rem] bg-primary shadow-2xl shadow-primary/20 hover:scale-105 transition-all duration-500 group relative overflow-hidden">
                        <Link href="/dashboard/sales-flow/returns/new">
                            <span className="relative z-10 flex items-center gap-3">
                                <RotateCcw className="h-6 w-6 transition-transform group-hover:rotate-180 duration-700" />
                                <span className="font-black text-xs uppercase tracking-widest">{t("Returns.new_return")}</span>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </Link>
                    </Button>
                </motion.div>
            </div>

            {/* Main Content Card */}
            <motion.div variants={item}>
                <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-3xl rounded-[3rem] overflow-hidden group">
                    <CardHeader className="p-10 border-b border-primary/5 bg-primary/5">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-primary/10 rounded-2xl text-primary shadow-xl shadow-primary/5 group-hover:scale-110 transition-all duration-500">
                                <ArrowLeftRight className="h-8 w-8" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black italic tracking-tight">
                                    {t("Returns.list_title")}
                                </CardTitle>
                                <CardDescription className="text-base font-medium">
                                    {t("Returns.manage_returns_desc")}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow className="h-20 hover:bg-transparent border-primary/5">
                                        <TableHead className="px-10 text-xs font-black uppercase tracking-widest text-muted-foreground/60">{t("Returns.id")}</TableHead>
                                        <TableHead className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">{t("Returns.invoice")}</TableHead>
                                        <TableHead className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">{t("Returns.type")}</TableHead>
                                        <TableHead className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">{t("Returns.amount")}</TableHead>
                                        <TableHead className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">{t("Returns.status")}</TableHead>
                                        <TableHead className="px-10 text-xs font-black uppercase tracking-widest text-muted-foreground/60 text-center">{t("Common.actions")}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {returns.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-80 text-center">
                                                <div className="flex flex-col items-center justify-center gap-6 text-muted-foreground/30">
                                                    <div className="p-8 bg-muted/30 rounded-full">
                                                        <RotateCcw className="h-16 w-16" />
                                                    </div>
                                                    <p className="font-black italic text-xl uppercase tracking-widest">{t("Returns.no_returns")}</p>
                                                    <Button asChild variant="outline" className="rounded-2xl border-primary/10 hover:bg-primary hover:text-white transition-all">
                                                        <Link href="/dashboard/sales-flow/returns/new">{t("Returns.new_return")}</Link>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        returns.map((ret) => (
                                            <TableRow key={ret.id} className="group/row hover:bg-primary/[0.02] transition-all duration-500 border-primary/5 h-24">
                                                <TableCell className="px-10">
                                                    <Badge variant="outline" className="rounded-xl px-4 py-1 font-black text-primary border-primary/10 bg-primary/5 tracking-tighter text-base font-mono">
                                                        {ret.token}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Link
                                                        href={`/dashboard/sales-flow/invoices/${ret.invoiceId}`}
                                                        className="group/link flex items-center gap-3"
                                                    >
                                                        <div className="p-2 bg-muted rounded-lg group-hover/link:bg-primary/10 transition-colors">
                                                            <FileText className="h-4 w-4 text-muted-foreground group-hover/link:text-primary transition-colors" />
                                                        </div>
                                                        <span className="font-bold text-muted-foreground group-hover/link:text-primary transition-colors">{ret.invoice.token}</span>
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <Badge variant="outline" className="rounded-lg font-black text-[10px] uppercase border-primary/10 w-fit">
                                                            {ret.returnType}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground/70 font-medium truncate max-w-[150px]">{ret.reason}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-black text-2xl tracking-tighter text-red-500">
                                                            {formatCurrency(Number(ret.refundAmount))}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={cn("rounded-xl px-4 py-1 font-black text-[10px] uppercase tracking-widest shadow-sm", getStatusBadge(ret.status))}>
                                                        {ret.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-10">
                                                    <div className="flex items-center justify-center gap-4">
                                                        <Button asChild variant="ghost" size="sm" className="h-12 px-6 rounded-xl hover:bg-primary/10 group-hover/row:scale-105 transition-all duration-300">
                                                            <Link href={`/dashboard/sales-flow/returns/${ret.id}`} className="flex items-center gap-2">
                                                                <Eye className="h-4 w-4 text-primary" />
                                                                <span className="font-black text-xs uppercase tracking-widest">{t("Common.view")}</span>
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
