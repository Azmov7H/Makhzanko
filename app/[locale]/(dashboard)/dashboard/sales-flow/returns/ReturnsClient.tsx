"use client";

import { motion } from "framer-motion";
import { RotateCcw, Eye, ArrowLeft, Calendar, FileText, BadgeInfo, Tag } from "lucide-react";
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

interface ReturnsClientProps {
    returns: any[];
    locale: string;
    t: any;
}

export function ReturnsClient({ returns, locale, t }: ReturnsClientProps) {
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
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

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
            className="space-y-8 text-start"
        >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <motion.div variants={item}>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        {t("Dashboard.nav.returns")}
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg font-medium max-w-2xl">
                        {t("Returns.description")}
                    </p>
                </motion.div>
                <motion.div variants={item}>
                    <Button asChild variant="outline" className="gap-2 px-6 h-12 rounded-2xl border-primary/10 hover:bg-primary/5 transition-all duration-300">
                        <Link href={`/${locale}/dashboard/sales-flow/invoices`}>
                            <ArrowLeft className="h-5 w-5" />
                            <span className="font-bold">{t("Common.back")}</span>
                        </Link>
                    </Button>
                </motion.div>
            </div>

            <motion.div variants={item}>
                <Card className="border-none shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-xl rounded-3xl overflow-hidden">
                    <CardHeader className="px-8 pt-8 flex flex-row items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-black flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-xl">
                                    <RotateCcw className="h-6 w-6 text-primary" />
                                </div>
                                {t("Returns.history")}
                            </CardTitle>
                            <CardDescription className="text-base font-medium">
                                {t("Returns.manage_returns_desc")}
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 sm:p-8">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-primary/5">
                                        <TableHead className="text-start font-bold py-5 px-6 uppercase tracking-wider text-xs">{t("Returns.id")}</TableHead>
                                        <TableHead className="text-start font-bold py-5 px-6 uppercase tracking-wider text-xs">{t("Returns.invoice")}</TableHead>
                                        <TableHead className="text-start font-bold py-5 px-6 uppercase tracking-wider text-xs">{t("Returns.type")}</TableHead>
                                        <TableHead className="text-start font-bold py-5 px-6 uppercase tracking-wider text-xs">{t("Returns.amount")}</TableHead>
                                        <TableHead className="text-start font-bold py-5 px-6 uppercase tracking-wider text-xs">{t("Returns.status")}</TableHead>
                                        <TableHead className="text-center font-bold py-5 px-6 uppercase tracking-wider text-xs">{t("Common.actions")}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {returns.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-48 text-center">
                                                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                                    <RotateCcw className="h-12 w-12 opacity-10" />
                                                    <p className="font-bold">{t("Returns.no_returns")}</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        returns.map((ret) => (
                                            <TableRow key={ret.id} className="group hover:bg-primary/5 transition-all duration-300 border-primary/5">
                                                <TableCell className="py-4 px-6">
                                                    <Badge variant="outline" className="font-black text-primary border-primary/20 bg-primary/5 rounded-lg px-3 py-1 font-mono">
                                                        {ret.token}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-4 px-6">
                                                    <Link
                                                        href={`/${locale}/dashboard/sales-flow/invoices/${ret.invoiceId}`}
                                                        className="text-primary hover:underline font-bold flex items-center gap-2"
                                                    >
                                                        <FileText className="h-4 w-4 opacity-40" />
                                                        {ret.invoice.token}
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="py-4 px-6">
                                                    <div className="flex flex-col gap-1">
                                                        <Badge variant="outline" className="rounded-lg font-bold w-fit text-[10px] uppercase">
                                                            {ret.returnType}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground truncate max-w-[150px]">{ret.reason}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 px-6">
                                                    <span className="font-black text-lg text-emerald-600">
                                                        {formatCurrency(Number(ret.refundAmount))}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="py-4 px-6">
                                                    <Badge className={cn("rounded-full px-4 py-1 font-black text-[10px] uppercase tracking-wider shadow-sm", getStatusBadge(ret.status))}>
                                                        {ret.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-4 px-6 text-center">
                                                    <Button asChild variant="ghost" size="sm" className="gap-2 hover:bg-primary/10 rounded-xl font-bold transition-all h-10 px-6 group">
                                                        <Link href={`/${locale}/dashboard/sales-flow/returns/${ret.id}`}>
                                                            <Eye className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                                                            {t("Common.view")}
                                                        </Link>
                                                    </Button>
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
