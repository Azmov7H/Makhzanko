"use client";

import { motion } from "framer-motion";
import { User, Phone, Mail, FileText, ArrowLeft, Edit, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/context";
import Link from "next/link";
import { formatCurrency, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface CustomerDetailsProps {
    customer: any;
}

export function CustomerDetails({ customer }: CustomerDetailsProps) {
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
            className="max-w-5xl mx-auto py-12 px-4 text-start space-y-12"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <motion.div variants={item} className="space-y-4">
                    <Button asChild variant="ghost" className="group rounded-full pl-2 pr-5 hover:bg-primary/10 transition-all duration-500">
                        <Link href="/dashboard/customers" className="flex items-center gap-2">
                            <div className="p-2 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
                                <ArrowLeft className="h-4 w-4 text-primary" />
                            </div>
                            <span className="font-black text-xs uppercase tracking-widest text-primary/70">{t("Common.back")}</span>
                        </Link>
                    </Button>
                    <div className="relative">
                        <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-primary/20 rounded-full blur-sm" />
                        <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent italic flex items-center gap-4">
                            {customer.name}
                        </h1>
                        <div className="flex items-center gap-4 mt-3 text-lg font-medium text-muted-foreground">
                            {customer.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 opacity-50" />
                                    {customer.phone}
                                </div>
                            )}
                            {customer.email && (
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 opacity-50" />
                                    {customer.email}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={item}>
                    <Button asChild className="h-14 px-8 rounded-2xl bg-primary shadow-2xl shadow-primary/20 hover:scale-105 transition-all gap-3 font-black text-xs uppercase tracking-widest group">
                        <Link href={`/dashboard/customers/${customer.id}/edit`}>
                            <Edit className="h-5 w-5 transition-transform duration-500 group-hover:rotate-12" />
                            {t("Common.edit")}
                        </Link>
                    </Button>
                </motion.div>
            </div>

            {/* Recent Sales */}
            <motion.div variants={item}>
                <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-3xl rounded-[3rem] overflow-hidden">
                    <CardHeader className="p-10 border-b border-primary/5 bg-primary/5">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-primary/10 rounded-2xl text-primary shadow-xl shadow-primary/5">
                                <FileText className="h-7 w-7" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black italic">{t("Customers.recent_sales")}</CardTitle>
                                <CardDescription className="text-base font-medium mt-1">{t("Customers.recent_sales_desc")}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {customer.sales?.length > 0 ? (
                            <div className="flex flex-col divide-y divide-primary/5">
                                {customer.sales.map((sale: any) => (
                                    <div key={sale.id} className="p-8 hover:bg-primary/[0.02] transition-colors flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center font-black text-primary/40 text-lg">
                                                #{sale.number}
                                            </div>
                                            <div>
                                                <div className="text-sm font-black uppercase tracking-widest text-muted-foreground/60 mb-1 flex items-center gap-2">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(sale.date).toLocaleDateString()}
                                                </div>
                                                <div className="font-black text-2xl text-primary tracking-tighter">
                                                    {formatCurrency(Number(sale.total))}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <Badge variant="outline" className={cn(
                                                "rounded-xl px-4 py-2 font-black text-xs uppercase tracking-widest border-none",
                                                sale.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                                            )}>
                                                {sale.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-20 flex flex-col items-center justify-center text-muted-foreground/30 gap-4">
                                <FileText className="h-16 w-16 opacity-20" />
                                <p className="font-black italic text-xl uppercase tracking-widest">{t("Customers.no_sales_history")}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
