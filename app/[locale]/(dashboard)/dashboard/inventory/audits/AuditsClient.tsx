"use client";

import { motion } from "framer-motion";
import { ClipboardCheck, Plus, History, Calendar, MapPin, ArrowRight } from "lucide-react";
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

interface AuditsClientProps {
    audits: any[];
    locale: string;
    t: any;
}

export function AuditsClient({ audits, locale, t }: AuditsClientProps) {
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
                        {t("Inventory.audits")}
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg font-medium max-w-2xl">
                        {t("Inventory.description")}
                    </p>
                </motion.div>
                <motion.div variants={item}>
                    <Button asChild className="gap-2 px-8 h-12 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300">
                        <Link href={`/${locale}/dashboard/inventory/audits/new`}>
                            <Plus className="h-5 w-5" />
                            <span className="font-bold">{t("Inventory.new_audit")}</span>
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
                                    <ClipboardCheck className="h-6 w-6 text-primary" />
                                </div>
                                {t("Inventory.audit_details")}
                            </CardTitle>
                            <CardDescription className="text-base font-medium">
                                {t("Inventory.manage_audits_desc")}
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 sm:p-8">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-primary/5">
                                        <TableHead className="text-start font-bold py-5 px-6 uppercase tracking-wider text-xs">{t("Inventory.date")}</TableHead>
                                        <TableHead className="text-start font-bold py-5 px-6 uppercase tracking-wider text-xs">{t("Inventory.location")}</TableHead>
                                        <TableHead className="text-start font-bold py-5 px-6 uppercase tracking-wider text-xs">{t("Inventory.status")}</TableHead>
                                        <TableHead className="text-center font-bold py-5 px-6 uppercase tracking-wider text-xs">{t("Inventory.action")}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {audits.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-48 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <ClipboardCheck className="h-12 w-12 opacity-10" />
                                                    <p className="font-bold">{t("Inventory.no_audits")}</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        audits.map((audit) => (
                                            <TableRow key={audit.id} className="group hover:bg-primary/5 transition-all duration-300 border-primary/5">
                                                <TableCell className="py-4 px-6 font-medium text-muted-foreground">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 opacity-40" />
                                                        {new Date(audit.date).toLocaleDateString(locale, { dateStyle: 'medium' })}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 px-6">
                                                    <div className="flex items-center gap-2 font-bold">
                                                        <MapPin className="h-4 w-4 text-primary opacity-40" />
                                                        {audit.warehouse.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 px-6 text-center">
                                                    <Badge
                                                        variant={audit.status === "COMPLETED" ? "default" : "secondary"}
                                                        className={cn(
                                                            "rounded-full px-4 py-1 font-black text-[10px] uppercase tracking-wider shadow-sm",
                                                            audit.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                                        )}
                                                    >
                                                        {audit.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-4 px-6 text-center">
                                                    <Button asChild variant="ghost" size="sm" className="gap-2 hover:bg-primary/10 rounded-xl font-bold transition-all h-10 px-6 group">
                                                        <Link href={`/${locale}/dashboard/inventory/audits/${audit.id}`}>
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
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
