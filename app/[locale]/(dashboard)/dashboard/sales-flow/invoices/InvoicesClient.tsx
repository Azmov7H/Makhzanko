"use client";

import { motion } from "framer-motion";
import { FileText, Palette, Eye, Layout, Calendar, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { formatCurrency } from "@/lib/utils";
import { WhatsAppShare } from "./_components/WhatsAppShare";
import { Badge } from "@/components/ui/badge";

import { useI18n } from "@/lib/i18n/context";

interface InvoicesClientProps {
    invoices: any[];
    locale: string;
}

export function InvoicesClient({ invoices, locale }: InvoicesClientProps) {
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
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
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
                        {t("Invoices.title")}
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg font-medium max-w-2xl">
                        {t("Invoices.description")}
                    </p>
                </motion.div>
                <motion.div variants={item} className="flex flex-wrap gap-3">
                    <Button asChild variant="outline" className="gap-2 px-6 h-12 rounded-2xl border-primary/10 hover:bg-primary/5 transition-all duration-300 group">
                        <Link href={`/${locale}/dashboard/sales-flow/invoices/design`}>
                            <Palette className="h-5 w-5 text-primary group-hover:rotate-12 transition-transform" />
                            <span className="font-bold">{t("Invoices.create_design")}</span>
                        </Link>
                    </Button>
                    <Button asChild className="gap-2 px-8 h-12 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300">
                        <Link href={`/${locale}/dashboard/sales-flow/sales/new`}>
                            <FileText className="h-5 w-5" />
                            <span className="font-bold">{t("Invoices.new_invoice")}</span>
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
                                    <Layout className="h-6 w-6 text-primary" />
                                </div>
                                {t("Invoices.list_title")}
                            </CardTitle>
                            <CardDescription className="text-base font-medium">
                                {t("Invoices.manage_invoices_desc")}
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 sm:p-8">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-primary/5">
                                        <TableHead className="text-start font-bold py-5 px-6 uppercase tracking-wider text-xs">{t("Invoices.invoice_no")}</TableHead>
                                        <TableHead className="text-start font-bold py-5 px-6 uppercase tracking-wider text-xs">{t("Invoices.date")}</TableHead>
                                        <TableHead className="text-start font-bold py-5 px-6 uppercase tracking-wider text-xs">{t("Invoices.amount")}</TableHead>
                                        <TableHead className="text-center font-bold py-5 px-6 uppercase tracking-wider text-xs">{t("Invoices.action")}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invoices.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-48 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <FileText className="h-12 w-12 opacity-10" />
                                                    <p className="font-bold">{t("Invoices.no_invoices")}</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        invoices.map((inv) => (
                                            <TableRow key={inv.id} className="group hover:bg-primary/5 transition-all duration-300 border-primary/5">
                                                <TableCell className="py-4 px-6">
                                                    <Badge variant="outline" className="font-black text-primary border-primary/20 bg-primary/5 rounded-lg px-3 py-1">
                                                        #{inv.sale.number}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-4 px-6 font-medium text-muted-foreground">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 opacity-40" />
                                                        {new Date(inv.sale.date).toLocaleDateString(locale, { dateStyle: 'medium' })}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 px-6">
                                                    <span className="font-black text-lg">
                                                        {formatCurrency(Number(inv.sale.total))}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="py-4 px-6">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Button asChild variant="ghost" size="sm" className="gap-2 hover:bg-primary/10 rounded-xl font-bold transition-all h-10 px-4">
                                                            <Link href={`/${locale}/dashboard/sales-flow/invoices/${inv.id}`}>
                                                                <Eye className="h-4 w-4" />
                                                                {t("Invoices.view")}
                                                            </Link>
                                                        </Button>
                                                        <div className="h-6 w-[1px] bg-primary/10 mx-1" />
                                                        <WhatsAppShare invoiceId={inv.id} />
                                                        <Button asChild variant="ghost" size="sm" className="gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 rounded-xl font-bold transition-all h-10 px-4">
                                                            <Link href={`/${locale}/dashboard/sales-flow/invoices/design?id=${inv.id}`}>
                                                                <Palette className="h-4 w-4" />
                                                                {t("Invoices.design")}
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
