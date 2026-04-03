"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n/context";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSuppliers } from "@/hooks/useSuppliers";
import { toast } from "sonner";
import { Loader2, Save, X, Truck, Phone, Mail, MapPin, BadgeDollarSign, Info } from "lucide-react";
import { motion } from "framer-motion";

interface SupplierFormProps {
    supplier?: any;
}

export function SupplierForm({ supplier }: SupplierFormProps) {
    const { t } = useI18n();
    const router = useRouter();
    const { createSupplier, updateSupplier, loading: isPending } = useSuppliers();

    const { register, handleSubmit } = useForm({
        defaultValues: {
            name: supplier?.name || "",
            phone: supplier?.phone || "",
            email: supplier?.email || "",
            address: supplier?.address || "",
            creditLimit: supplier?.creditLimit?.toString() || "0",
            notes: supplier?.notes || "",
        }
    });

    const onSubmit = async (data: any) => {
        try {
            const payload = {
                ...data,
                creditLimit: parseFloat(data.creditLimit) || 0
            };

            if (supplier?.id) {
                await updateSupplier(supplier.id, payload);
                toast.success(t("Common.success") || "Supplier updated successfully");
            } else {
                await createSupplier(payload);
                toast.success(t("Common.success") || "Supplier created successfully");
            }
            router.push("/dashboard/suppliers");
        } catch (error) {
            toast.error(t("Common.error") || "Something went wrong");
        }
    };

    const container = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.1 }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            className="max-w-4xl mx-auto py-12 px-4 text-start"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-4">
                    <div className="relative">
                        <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-primary/20 rounded-full blur-sm" />
                        <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent italic">
                            {supplier ? (t("Suppliers.edit_supplier") || "Edit Supplier") : (t("Suppliers.add_supplier") || "New Supplier")}
                        </h1>
                        <p className="text-muted-foreground mt-2 text-lg font-medium italic">
                            {t("Suppliers.form_desc") || "Provide detailed information about your business partner."}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => router.back()}
                            className="h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-destructive/10 hover:text-destructive transition-all gap-2"
                        >
                            <X className="h-5 w-5" />
                            {t("Common.cancel")}
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="h-14 px-10 rounded-2xl bg-primary shadow-2xl shadow-primary/20 hover:scale-105 transition-all gap-3 font-black text-xs uppercase tracking-widest min-w-[160px]"
                        >
                            {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                            {t("Common.save")}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* General Info */}
                    <Card className="md:col-span-2 border-none shadow-3xl bg-card/60 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden group">
                        <CardHeader className="p-8 border-b border-primary/5 bg-primary/5">
                            <CardTitle className="text-xl font-black italic flex items-center gap-3">
                                <Info className="h-5 w-5 text-primary" />
                                {t("Suppliers.general_info") || "General Information"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-3">
                                <Label className="text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground/60">{t("Suppliers.name") || "Supplier Name"}</Label>
                                <div className="relative group/input">
                                    <Truck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/30 group-focus-within/input:text-primary transition-colors" />
                                    <Input
                                        {...register("name", { required: true })}
                                        placeholder={t("Suppliers.name_placeholder") || "Enter legal business name..."}
                                        className="h-14 pl-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground/60">{t("Suppliers.phone") || "Phone Number"}</Label>
                                    <div className="relative group/input">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/30 group-focus-within/input:text-primary transition-colors" />
                                        <Input
                                            {...register("phone")}
                                            placeholder="+20 1xx xxx xxxx"
                                            className="h-14 pl-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground/60">{t("Suppliers.email") || "Email Address"}</Label>
                                    <div className="relative group/input">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/30 group-focus-within/input:text-primary transition-colors" />
                                        <Input
                                            {...register("email")}
                                            type="email"
                                            placeholder="vendor@company.com"
                                            className="h-14 pl-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground/60">{t("Suppliers.address") || "Business Address"}</Label>
                                <div className="relative group/input">
                                    <MapPin className="absolute left-4 top-4 h-5 w-5 text-muted-foreground/30 group-focus-within/input:text-primary transition-colors" />
                                    <Textarea
                                        {...register("address")}
                                        placeholder={t("Suppliers.address_placeholder") || "Full physical location..."}
                                        className="min-h-[120px] pl-12 pt-4 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold resize-none transition-all"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Financial Terms */}
                    <div className="space-y-8">
                        <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden group">
                            <CardHeader className="p-8 border-b border-primary/5 bg-primary/5">
                                <CardTitle className="text-xl font-black italic flex items-center gap-3">
                                    <BadgeDollarSign className="h-5 w-5 text-primary" />
                                    {t("Suppliers.financials") || "Financials"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground/60">{t("Suppliers.credit_limit") || "Credit Limit"}</Label>
                                    <div className="relative group/input">
                                        <Input
                                            {...register("creditLimit")}
                                            type="number"
                                            className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-black text-2xl text-primary tracking-tighter"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-xs text-muted-foreground/40 uppercase">EGP</div>
                                    </div>
                                    <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest px-2">
                                        {t("Suppliers.limit_desc") || "Maximum debt ceiling for this vendor."}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden group">
                            <CardHeader className="p-8 border-b border-primary/5 bg-primary/5">
                                <CardTitle className="text-xl font-black italic flex items-center gap-3">
                                    <Save className="h-5 w-5 text-primary" />
                                    {t("Suppliers.notes") || "Other Details"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <Textarea
                                    {...register("notes")}
                                    placeholder={t("Suppliers.notes_placeholder") || "Special terms, contact persons..."}
                                    className="min-h-[150px] rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold resize-none"
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </motion.div>
    );
}
