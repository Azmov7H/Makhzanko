"use client";

import { motion } from "framer-motion";
import { Users, Plus, Phone, Mail, MoreHorizontal, Trash2, Edit, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useI18n } from "@/lib/i18n/context";
import Link from "next/link";
import { deleteCustomerAction } from "@/actions/customers";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface CustomersClientProps {
    customers: any[];
}

export function CustomersClient({ customers }: CustomersClientProps) {
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
                        {t("Customers.title")}
                    </h1>
                    <p className="text-muted-foreground mt-3 text-lg font-medium max-w-2xl">
                        {t("Customers.description")}
                    </p>
                </motion.div>
                <motion.div variants={item}>
                    <Button asChild className="h-14 px-8 rounded-2xl bg-primary shadow-2xl shadow-primary/20 hover:scale-105 transition-all gap-3 font-black text-xs uppercase tracking-widest group">
                        <Link href="/dashboard/customers/new">
                            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-500" />
                            {t("Customers.add_customer")}
                        </Link>
                    </Button>
                </motion.div>
            </div>

            <motion.div variants={item}>
                <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-3xl rounded-[3rem] overflow-hidden group">
                    <CardHeader className="p-10 border-b border-primary/5 bg-primary/5">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-primary/10 rounded-2xl text-primary shadow-xl shadow-primary/5 group-hover:scale-110 transition-transform duration-500">
                                <Users className="h-7 w-7" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black italic">{t("Customers.list_title")}</CardTitle>
                                <CardDescription className="text-base font-medium mt-1">
                                    {t("Customers.list_desc")}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow className="h-16 hover:bg-transparent border-primary/5">
                                    <TableHead className="px-10 text-xs font-black uppercase tracking-widest">{t("Customers.name")}</TableHead>
                                    <TableHead className="text-xs font-black uppercase tracking-widest">{t("Customers.contact")}</TableHead>
                                    <TableHead className="text-xs font-black uppercase tracking-widest text-center">{t("Customers.orders")}</TableHead>
                                    <TableHead className="px-10 text-end text-xs font-black uppercase tracking-widest w-[120px]">{t("Common.actions")}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground opacity-30 animate-pulse">
                                                <Search className="h-20 w-20" />
                                                <p className="text-xl font-black italic">{t("Customers.no_customers")}</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    customers.map((customer) => (
                                        <TableRow key={customer.id} className="group/row hover:bg-primary/[0.02] transition-all duration-500 border-primary/5 h-24">
                                            <TableCell className="px-10">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center font-black text-xs">
                                                        {customer.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-black text-lg group-hover/row:text-primary transition-colors">{customer.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    {customer.phone && (
                                                        <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground/80">
                                                            <Phone className="h-3 w-3 opacity-50" />
                                                            {customer.phone}
                                                        </div>
                                                    )}
                                                    {customer.email && (
                                                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground/50">
                                                            <Mail className="h-3 w-3 opacity-50" />
                                                            {customer.email}
                                                        </div>
                                                    )}
                                                    {!customer.phone && !customer.email && (
                                                        <span className="text-xs text-muted-foreground/30 italic">{t("Common.no_contact_info")}</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline" className="rounded-xl px-3 py-1 font-black text-primary border-primary/10 bg-primary/5">
                                                    {customer._count?.sales || 0}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-10 text-end">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-12 w-12 hover:bg-primary/10 rounded-2xl transition-all group-hover/row:scale-110">
                                                            <MoreHorizontal className="h-6 w-6 text-muted-foreground/40 group-hover/row:text-primary" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-[180px] p-2 bg-card/60 backdrop-blur-3xl border-none rounded-[1.5rem] shadow-3xl animate-in zoom-in-95 duration-200">
                                                        <DropdownMenuItem asChild className="rounded-xl focus:bg-primary/10 cursor-pointer py-3 transition-all">
                                                            <Link href={`/dashboard/customers/${customer.id}/edit`} className="flex items-center gap-3">
                                                                <div className="p-1.5 bg-primary/5 text-primary rounded-lg"><Edit className="h-4 w-4" /></div>
                                                                <span className="font-black text-xs uppercase tracking-widest">{t("Common.edit")}</span>
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="rounded-xl focus:bg-destructive/10 cursor-pointer py-3 transition-all text-destructive">
                                                            <form action={deleteCustomerAction} className="w-full">
                                                                <input type="hidden" name="id" value={customer.id} />
                                                                <button type="submit" className="w-full flex items-center gap-3 font-black text-xs uppercase tracking-widest">
                                                                    <div className="p-1.5 bg-destructive/10 rounded-lg"><Trash2 className="h-4 w-4" /></div>
                                                                    <span>{t("Common.delete")}</span>
                                                                </button>
                                                            </form>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
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
