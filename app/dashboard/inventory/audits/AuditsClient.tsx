"use client";

import { motion } from "framer-motion";
import { ClipboardCheck, Plus, History, Calendar, MapPin, ArrowRight, Layout, Search } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";

interface AuditsClientProps {
    audits: any[];
}

export function AuditsClient({ audits }: AuditsClientProps) {
    const { t } = useI18n();

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
            className="space-y-12 text-start"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <motion.div variants={item} className="relative">
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-primary/20 rounded-full blur-sm" />
                    <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent italic">
                        {t("Inventory.audits")}
                    </h1>
                    <p className="text-muted-foreground mt-3 text-lg font-medium max-w-2xl">
                        {t("Inventory.description")}
                    </p>
                </motion.div>
                <motion.div variants={item}>
                    <Button asChild className="h-14 px-8 rounded-2xl bg-primary shadow-2xl shadow-primary/20 hover:scale-105 transition-all gap-3 font-black text-xs uppercase tracking-widest group">
                        <Link href="/dashboard/inventory/audits/new">
                            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-500" />
                            {t("Inventory.new_audit")}
                        </Link>
                    </Button>
                </motion.div>
            </div>

            <motion.div variants={item}>
                <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-3xl rounded-[3rem] overflow-hidden group">
                    <CardHeader className="p-10 border-b border-primary/5 bg-primary/5">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-primary/10 rounded-2xl text-primary shadow-xl shadow-primary/5 group-hover:scale-110 transition-transform duration-500">
                                <ClipboardCheck className="h-7 w-7" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black italic">{t("Inventory.audit_details")}</CardTitle>
                                <CardDescription className="text-base font-medium mt-1">
                                    {t("Inventory.manage_audits_desc")}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow className="h-16 hover:bg-transparent border-primary/5">
                                    <TableHead className="px-10 text-xs font-black uppercase tracking-widest">{t("Inventory.date")}</TableHead>
                                    <TableHead className="text-xs font-black uppercase tracking-widest">{t("Inventory.location")}</TableHead>
                                    <TableHead className="text-xs font-black uppercase tracking-widest">{t("Inventory.status")}</TableHead>
                                    <TableHead className="px-10 text-end text-xs font-black uppercase tracking-widest w-[180px]">{t("Inventory.action")}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {audits.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground opacity-30 animate-pulse">
                                                <Search className="h-20 w-20" />
                                                <p className="text-xl font-black italic">{t("Inventory.no_audits")}</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    audits.map((audit) => (
                                        <TableRow key={audit.id} className="group/row hover:bg-primary/[0.02] transition-all duration-500 border-primary/5 h-24">
                                            <TableCell className="px-10">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-muted rounded-lg group-hover/row:bg-primary/10 transition-colors">
                                                        <Calendar className="h-4 w-4 text-muted-foreground group-hover/row:text-primary" />
                                                    </div>
                                                    <span className="font-bold text-sm tracking-tight opacity-70">
                                                        {new Date(audit.date).toLocaleDateString("ar-EG", { dateStyle: 'medium' })}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 font-black text-lg">
                                                    <MapPin className="h-4 w-4 text-primary opacity-30" />
                                                    {audit.warehouse.name}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "rounded-xl px-4 py-1.5 font-black text-[10px] uppercase tracking-widest border-none shadow-sm",
                                                        audit.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary"
                                                    )}
                                                >
                                                    {audit.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-10 text-end">
                                                <Button asChild variant="ghost" className="h-12 px-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all group-hover/row:bg-primary/10 group-hover/row:scale-105 gap-2">
                                                    <Link href={`/dashboard/inventory/audits/${audit.id}`}>
                                                        {audit.status === "COMPLETED" ? (
                                                            <>
                                                                <History className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                                                                {t("Inventory.view_results")}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="text-primary">{t("Inventory.continue_count")}</span>
                                                                <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                                                            </>
                                                        )}
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
