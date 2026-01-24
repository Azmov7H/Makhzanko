"use client";

import { useI18n } from "@/lib/i18n/context";
import { formatCurrency, cn } from "@/lib/utils";
import {
    Phone, Mail, MapPin, Calendar,
    ShoppingBag, CreditCard, ChevronRight,
    ArrowLeft, Edit, Wallet, TrendingDown,
    Plus, Clock, BadgeCheck, AlertCircle, Truck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { motion } from "framer-motion";

interface SupplierDetailsProps {
    supplier: any;
    stats: {
        totalPurchases: number;
        totalPayments: number;
        balance: number;
    };
}

export default function SupplierDetails({ supplier, stats }: SupplierDetailsProps) {
    const { t } = useI18n();

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
            {/* Header / Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Button asChild variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-primary/5 text-primary hover:bg-primary/10">
                        <Link href="/dashboard/suppliers">
                            <ArrowLeft className="h-6 w-6" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent italic">
                            {supplier.name}
                        </h1>
                        <p className="text-muted-foreground font-medium flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="rounded-full px-3 bg-primary/5 text-primary border-primary/10 font-black italic">
                                SUPPLIER #{supplier.id.slice(-6).toUpperCase()}
                            </Badge>
                        </p>
                    </div>
                </div>
                <Button asChild className="h-12 px-8 rounded-2xl bg-primary shadow-xl shadow-primary/20 hover:scale-105 transition-all font-black text-xs uppercase tracking-widest gap-2">
                    <Link href={`/dashboard/suppliers/${supplier.id}/edit`}>
                        <Edit className="h-4 w-4" />
                        {t("Common.edit")}
                    </Link>
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-2xl bg-card/60 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden group">
                    <CardContent className="p-8">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-4 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 transition-transform duration-500">
                                <ShoppingBag className="h-6 w-6" />
                            </div>
                            <Badge variant="outline" className="border-primary/20 text-[10px] font-black uppercase italic">{t("Suppliers.purchases") || "Total Purchases"}</Badge>
                        </div>
                        <div className="space-y-1">
                            <p className="text-4xl font-black italic tracking-tighter">{formatCurrency(stats.totalPurchases)}</p>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{supplier.purchases.length} Order(s)</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-2xl bg-card/60 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden group">
                    <CardContent className="p-8">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500 group-hover:scale-110 transition-transform duration-500">
                                <Wallet className="h-6 w-6" />
                            </div>
                            <Badge variant="outline" className="border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase italic">{t("Suppliers.payments") || "Total Paid"}</Badge>
                        </div>
                        <div className="space-y-1">
                            <p className="text-4xl font-black italic tracking-tighter">{formatCurrency(stats.totalPayments)}</p>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{supplier.payments.length} Payment(s)</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className={cn(
                    "border-none shadow-2xl backdrop-blur-3xl rounded-[2.5rem] overflow-hidden group",
                    stats.balance > 0 ? "bg-amber-500/10 text-amber-600" : "bg-primary/5 text-primary"
                )}>
                    <CardContent className="p-8">
                        <div className="flex justify-between items-start mb-4">
                            <div className={cn(
                                "p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500",
                                stats.balance > 0 ? "bg-amber-500/20 text-amber-600" : "bg-primary/20 text-primary"
                            )}>
                                <TrendingDown className="h-6 w-6" />
                            </div>
                            <Badge variant="outline" className={cn(
                                "text-[10px] font-black uppercase italic",
                                stats.balance > 0 ? "border-amber-500/20 text-amber-600" : "border-primary/20 text-primary"
                            )}>
                                {t("Finance.balance") || "Current Balance"}
                            </Badge>
                        </div>
                        <div className="space-y-1">
                            <p className="text-4xl font-black italic tracking-tighter">{formatCurrency(stats.balance)}</p>
                            <p className="text-xs font-bold uppercase tracking-widest opacity-60">
                                {stats.balance > 0 ? "Amount Owed to Supplier" : "No outstanding debt"}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Information Column */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="border-none shadow-2xl bg-card/60 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-black italic flex items-center gap-3">
                                <BadgeCheck className="h-5 w-5 text-primary" />
                                {t("Suppliers.basic_info") || "Contact Details"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-muted-foreground group">
                                    <div className="p-3 bg-muted rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <Phone className="h-4 w-4" />
                                    </div>
                                    <p className="font-bold">{supplier.phone || "---"}</p>
                                </div>
                                <div className="flex items-center gap-4 text-muted-foreground group">
                                    <div className="p-3 bg-muted rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <p className="font-bold">{supplier.email || "---"}</p>
                                </div>
                                <div className="flex items-start gap-4 text-muted-foreground group">
                                    <div className="p-3 bg-muted rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors mt-1">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <p className="font-bold leading-relaxed">{supplier.address || "---"}</p>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-primary/5">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Financial Status</h4>
                                <div className="flex justify-between items-center bg-muted/30 p-4 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <CreditCard className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-bold">{t("Suppliers.credit_limit") || "Credit Limit"}</span>
                                    </div>
                                    <span className="font-black italic">{formatCurrency(Number(supplier.creditLimit || 0))}</span>
                                </div>
                            </div>

                            {supplier.notes && (
                                <div className="pt-6 border-t border-primary/5">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">{t("Suppliers.notes") || "Internal Notes"}</h4>
                                    <p className="text-sm font-medium leading-relaxed opacity-70 italic">"{supplier.notes}"</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* History Column */}
                <div className="lg:col-span-8">
                    <Tabs defaultValue="purchases" className="w-full">
                        <TabsList className="bg-card/40 backdrop-blur-3xl p-2 rounded-[2rem] h-auto border border-primary/5 grid grid-cols-3 mb-8 shadow-2xl">
                            <TabsTrigger value="purchases" className="rounded-[1.5rem] py-4 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white transition-all italic">
                                {t("Suppliers.purchases") || "Purchases"}
                            </TabsTrigger>
                            <TabsTrigger value="installments" className="rounded-[1.5rem] py-4 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white transition-all italic">
                                {t("Finance.installment_schedule") || "Debt Plan"}
                            </TabsTrigger>
                            <TabsTrigger value="payments" className="rounded-[1.5rem] py-4 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white transition-all italic">
                                {t("Suppliers.payments") || "Payments"}
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="purchases" className="space-y-4 outline-none">
                            {supplier.purchases.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-20 bg-card/60 rounded-[3rem] border-2 border-dashed border-primary/10">
                                    <ShoppingBag className="h-12 w-12 text-primary/20 mb-4" />
                                    <p className="text-muted-foreground font-bold italic">{t("Purchases.no_items") || "No purchase history found"}</p>
                                </div>
                            ) : (
                                supplier.purchases.map((po: any) => (
                                    <Card key={po.id} className="border-none shadow-xl bg-card/60 backdrop-blur-3xl rounded-3xl overflow-hidden hover:scale-[1.01] transition-transform duration-300">
                                        <CardContent className="p-6 flex items-center justify-between">
                                            <div className="flex items-center gap-6">
                                                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                                    <Truck className="h-7 w-7" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Order #{po.number}</p>
                                                    <h3 className="text-lg font-black italic">{formatCurrency(po.total)}</h3>
                                                </div>
                                            </div>
                                            <div className="text-right flex items-center gap-6">
                                                <div className="hidden md:block">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Status</p>
                                                    <Badge className="rounded-full px-4 border-none bg-emerald-500/10 text-emerald-500 font-black italic uppercase text-[10px]">{po.status}</Badge>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Date</p>
                                                    <div className="flex items-center gap-2 text-sm font-bold italic">
                                                        <Calendar className="h-3 w-3 text-primary/40" />
                                                        {new Date(po.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:bg-primary/5 hover:text-primary rounded-xl">
                                                    <ChevronRight className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </TabsContent>

                        <TabsContent value="installments" className="space-y-4 outline-none">
                            {supplier.installments.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-20 bg-card/60 rounded-[3rem] border-2 border-dashed border-primary/10">
                                    <Clock className="h-12 w-12 text-primary/20 mb-4" />
                                    <p className="text-muted-foreground font-bold italic">No active payment plans</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {supplier.installments.map((inst: any) => (
                                        <Card key={inst.id} className={cn(
                                            "border-none shadow-lg rounded-3xl overflow-hidden transition-all duration-300",
                                            inst.status === "PAID" ? "bg-emerald-500/5 opacity-60" : "bg-card/60"
                                        )}>
                                            <CardContent className="p-6">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Due Date</p>
                                                        <p className="text-sm font-black italic">{new Date(inst.dueDate).toLocaleDateString()}</p>
                                                    </div>
                                                    <Badge variant="outline" className={cn(
                                                        "rounded-full px-3 py-1 font-black italic uppercase text-[9px]",
                                                        inst.status === "PAID" ? "bg-emerald-500/10 text-emerald-500 border-none" : "bg-amber-500/10 text-amber-500 border-none"
                                                    )}>
                                                        {inst.status}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-end justify-between">
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Amount</p>
                                                        <p className="text-xl font-black italic">{formatCurrency(inst.amount)}</p>
                                                    </div>
                                                    {inst.status !== "PAID" && (
                                                        <Button size="sm" className="h-9 px-4 rounded-xl bg-primary text-[10px] font-black uppercase italic tracking-widest shadow-lg shadow-primary/20">
                                                            Settle Now
                                                        </Button>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="payments" className="space-y-4 outline-none">
                            {supplier.payments.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-20 bg-card/60 rounded-[3rem] border-2 border-dashed border-primary/10">
                                    <CreditCard className="h-12 w-12 text-primary/20 mb-4" />
                                    <p className="text-muted-foreground font-bold italic">No payments recorded yet</p>
                                </div>
                            ) : (
                                supplier.payments.map((payment: any) => (
                                    <Card key={payment.id} className="border-none shadow-xl bg-card/60 backdrop-blur-3xl rounded-3xl overflow-hidden">
                                        <CardContent className="p-6 flex items-center justify-between">
                                            <div className="flex items-center gap-6">
                                                <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                                    <BadgeCheck className="h-7 w-7" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Payment Ref</p>
                                                    <h3 className="text-lg font-black italic">{formatCurrency(payment.amount)}</h3>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Method</p>
                                                <div className="flex items-center gap-2 text-sm font-bold italic">
                                                    <CreditCard className="h-3 w-3 text-primary/40" />
                                                    {payment.paymentMethod}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Date</p>
                                                <div className="flex items-center gap-2 text-sm font-bold italic">
                                                    <Calendar className="h-3 w-3 text-primary/40" />
                                                    {new Date(payment.date).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
