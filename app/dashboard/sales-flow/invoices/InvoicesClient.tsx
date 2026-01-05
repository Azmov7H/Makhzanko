"use client";

import { motion } from "framer-motion";
import { FileText, Palette, Eye, Layout, Calendar, MessageCircle, Share2, Sparkles, ArrowRight, Printer } from "lucide-react";
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
import { formatCurrency, cn } from "@/lib/utils";
import { WhatsAppShare } from "./_components/WhatsAppShare";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n/context";

interface InvoicesClientProps {
    invoices: any[];
}

export function InvoicesClient({ invoices }: InvoicesClientProps) {
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

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-start space-y-12"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative">
                <motion.div variants={item} className="relative">
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-primary/20 rounded-full blur-sm" />
                    <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent italic">
                        {t("Invoices.title")}
                    </h1>
                    <p className="text-muted-foreground mt-3 text-lg font-medium max-w-2xl">
                        {t("Invoices.description")}
                    </p>
                </motion.div>
                <motion.div variants={item} className="flex flex-wrap gap-4">
                    <Button asChild variant="outline" className="h-16 px-8 rounded-2xl border-primary/10 bg-card hover:bg-primary/5 hover:border-primary/20 transition-all duration-500 group overflow-hidden relative shadow-sm">
                        <Link href="/dashboard/sales-flow/invoices/design">
                            <div className="relative z-10 flex items-center gap-3">
                                <Palette className="h-6 w-6 text-primary group-hover:rotate-12 transition-transform duration-500" />
                                <span className="font-black text-xs uppercase tracking-widest text-primary/70">{t("Invoices.create_design")}</span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </Link>
                    </Button>
                    <Button asChild className="h-16 px-10 rounded-[2rem] bg-primary shadow-lg shadow-primary/20 hover:scale-105 transition-all duration-500 group relative overflow-hidden">
                        <Link href="/dashboard/sales-flow/sales/new">
                            <span className="relative z-10 flex items-center gap-3">
                                <FileText className="h-6 w-6 transition-transform group-hover:scale-110 duration-500" />
                                <span className="font-black text-xs uppercase tracking-widest">{t("Invoices.new_invoice")}</span>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </Link>
                    </Button>
                </motion.div>
            </div>

            <motion.div variants={item}>
                <Card className="border-none shadow-sm bg-card rounded-[3rem] overflow-hidden group">
                    <CardHeader className="p-10 border-b border-primary/5 bg-primary/5">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-primary/10 rounded-2xl text-primary shadow-xl shadow-primary/5 group-hover:scale-110 transition-all duration-500">
                                <Layout className="h-8 w-8" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black italic tracking-tight">
                                    {t("Invoices.list_title")}
                                </CardTitle>
                                <CardDescription className="text-base font-medium">
                                    {t("Invoices.manage_invoices_desc")}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow className="h-20 hover:bg-transparent border-primary/5">
                                        <TableHead className="px-10 text-xs font-black uppercase tracking-widest text-muted-foreground/60">{t("Invoices.invoice_no")}</TableHead>
                                        <TableHead className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">{t("Invoices.date")}</TableHead>
                                        <TableHead className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">{t("Invoices.amount")}</TableHead>
                                        <TableHead className="px-10 text-xs font-black uppercase tracking-widest text-muted-foreground/60 text-center">{t("Invoices.action")}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invoices.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-80 text-center">
                                                <div className="flex flex-col items-center justify-center gap-6 text-muted-foreground/30">
                                                    <div className="p-8 bg-muted/30 rounded-full">
                                                        <FileText className="h-16 w-16" />
                                                    </div>
                                                    <p className="font-black italic text-xl uppercase tracking-widest">{t("Invoices.no_invoices")}</p>
                                                    <Button asChild variant="outline" className="rounded-2xl border-primary/10 hover:bg-primary hover:text-white transition-all">
                                                        <Link href="/dashboard/sales-flow/sales/new">{t("Invoices.new_invoice")}</Link>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        invoices.map((inv) => (
                                            <TableRow key={inv.id} className="group/row hover:bg-primary/[0.02] transition-all duration-500 border-primary/5 h-24">
                                                <TableCell className="px-10 font-black">
                                                    <Badge variant="outline" className="rounded-xl px-4 py-1 font-black text-primary border-primary/10 bg-primary/5 tracking-tighter text-base">
                                                        #{inv.sale.number}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-bold text-muted-foreground/80">
                                                    <div className="flex items-center gap-3">
                                                        <Calendar className="h-4 w-4 opacity-40 text-primary" />
                                                        {new Date(inv.sale.date).toLocaleDateString("ar-EG", { dateStyle: 'medium' })}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-black text-2xl tracking-tighter text-primary">
                                                        {formatCurrency(Number(inv.sale.total))}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-10">
                                                    <div className="flex items-center justify-center gap-4">
                                                        <Button asChild variant="ghost" size="sm" className="h-12 px-6 rounded-xl hover:bg-primary/10 group-hover/row:scale-105 transition-all duration-300">
                                                            <Link href={`/dashboard/sales-flow/invoices/${inv.id}`} className="flex items-center gap-2">
                                                                <Eye className="h-4 w-4 text-primary" />
                                                                <span className="font-black text-xs uppercase tracking-widest">{t("Invoices.view")}</span>
                                                            </Link>
                                                        </Button>

                                                        <div className="h-8 w-[1px] bg-primary/10" />

                                                        <WhatsAppShare invoiceId={inv.id} />

                                                        <Button asChild variant="ghost" size="sm" className="h-12 px-6 rounded-xl hover:bg-blue-500/10 text-blue-600 transition-all duration-300">
                                                            <Link href={`/dashboard/sales-flow/invoices/design?id=${inv.id}`} className="flex items-center gap-2">
                                                                <Palette className="h-4 w-4" />
                                                                <span className="font-black text-xs uppercase tracking-widest">{t("Invoices.design")}</span>
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
