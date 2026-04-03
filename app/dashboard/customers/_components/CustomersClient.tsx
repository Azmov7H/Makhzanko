"use client";

import { motion } from "framer-motion";
import { Users, Plus, Phone, Mail, MoreHorizontal, Trash2, Edit, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TableRow, TableCell } from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/lib/i18n/context";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCustomers } from "@/hooks/useCustomers";
import { ResponsiveTable } from "@/components/ui/ResponsiveTable";

interface CustomersClientProps {
    customers: any[];
}

export function CustomersClient({ customers: initialCustomers }: CustomersClientProps) {
    const { t } = useI18n();
    const { customers, searchTerm, setSearchTerm, deleteCustomer } = useCustomers(initialCustomers);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
    };

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="space-y-12 text-start px-0"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                <motion.div variants={itemVariants} className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground" style={{ fontFamily: "var(--font-amiri), serif" }}>
                        {t("Customers.title")}
                    </h1>
                    <p className="text-muted-foreground font-medium text-lg md:text-xl max-w-2xl leading-relaxed">
                        {t("Customers.description")}
                    </p>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                    <Button asChild size="lg" className="h-14 px-8 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/10 hover:translate-y-[-2px] transition-all gap-3">
                        <Link href="/dashboard/customers/new">
                            <Plus className="h-5 w-5" />
                            {t("Customers.add_customer")}
                        </Link>
                    </Button>
                </motion.div>
            </div>

            {/* Content Card */}
            <motion.div variants={itemVariants}>
                <Card className="luxury-card overflow-hidden border-none shadow-3xl bg-card/60 backdrop-blur-3xl rounded-[3rem]">
                    <CardHeader className="p-10 border-b border-border/40 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-primary/5">
                        <div className="flex items-center gap-5">
                            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-xl shadow-primary/5">
                                <Users className="h-6 w-6 stroke-[1.5]" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black tracking-tight" style={{ fontFamily: "var(--font-amiri), serif" }}>{t("Customers.list_title")}</CardTitle>
                                <CardDescription className="text-base font-medium">{t("Customers.list_desc")}</CardDescription>
                            </div>
                        </div>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                            <Input 
                                placeholder={t("Common.search") || "Search..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-11 h-12 bg-accent/30 border-none rounded-lg font-medium focus-visible:ring-primary/20"
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <ResponsiveTable
                            headers={[
                                { label: t("Customers.name"), className: "px-10" },
                                { label: t("Customers.contact") },
                                { label: t("Customers.orders"), className: "text-center" },
                                { label: t("Common.actions"), className: "px-10 text-end w-[120px]" },
                            ]}
                            renderCard={(customer) => (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-lg bg-accent text-primary flex items-center justify-center font-black text-xs">
                                            {customer.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-bold text-lg text-foreground">{customer.name}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 pt-2 border-t border-border/20">
                                        {customer.phone && <div className="text-xs font-bold text-muted-foreground flex items-center gap-2"><Phone className="size-3" /> {customer.phone}</div>}
                                        {customer.email && <div className="text-[10px] font-bold text-muted-foreground/60 flex items-center gap-2"><Mail className="size-3" /> {customer.email}</div>}
                                    </div>
                                </div>
                            )}
                            data={customers}
                            keyExtractor={(c) => c.id}
                            renderRow={(customer) => (
                                <TableRow key={customer.id} className="group hover:bg-accent/30 transition-all border-border/40 h-24">
                                    <TableCell className="px-10">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-lg bg-accent text-primary flex items-center justify-center font-black text-xs border border-border/40">
                                                {customer.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{customer.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            {customer.phone && (
                                                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground/80">
                                                    <Phone className="h-3 w-3 opacity-40" />
                                                    {customer.phone}
                                                </div>
                                            )}
                                            {customer.email && (
                                                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground/50">
                                                    <Mail className="h-3 w-3 opacity-40" />
                                                    {customer.email}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className="rounded-md border-none bg-primary/5 text-primary font-bold px-3 py-1">
                                            {customer._count?.sales || 0}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-10 text-end">
                                         <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-accent rounded-lg transition-all">
                                                    <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                                                 </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="luxury-card border-none p-2 w-[180px] bg-card/60 backdrop-blur-3xl rounded-[1.5rem] shadow-3xl">
                                                <DropdownMenuItem asChild className="rounded-lg py-2 focus:bg-accent cursor-pointer transition-all">
                                                    <Link href={`/dashboard/customers/${customer.id}/edit`} className="flex items-center gap-3">
                                                        <Edit className="h-4 w-4 text-primary" />
                                                        <span className="font-bold text-xs uppercase tracking-widest">{t("Common.edit")}</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild className="rounded-lg py-2 focus:bg-destructive/10 cursor-pointer transition-all text-destructive">
                                                    <button 
                                                        onClick={async () => {
                                                            if (confirm(t("Common.confirm_delete") || "Are you sure?")) {
                                                                await deleteCustomer(customer.id);
                                                            }
                                                        }}
                                                        className="w-full flex items-center gap-3 font-bold text-xs uppercase tracking-widest px-2"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        <span>{t("Common.delete")}</span>
                                                    </button>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )}
                        />
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
