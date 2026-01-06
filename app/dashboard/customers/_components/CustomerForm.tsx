"use client";

import { createCustomerAction, updateCustomerAction } from "@/actions/customers";
import { useState, useTransition } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCustomerSchema } from "@/lib/validation";
import { User, Save, AlertCircle, Sparkles, Phone, Mail, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CustomerFormProps {
    customer?: any;
}

export default function CustomerForm({ customer }: CustomerFormProps) {
    const { t } = useI18n();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const schema = getCustomerSchema(t);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: customer?.name || "",
            phone: customer?.phone || "",
            email: customer?.email || ""
        }
    });

    const onSubmit = async (data: any) => {
        startTransition(async () => {
            const formData = new FormData();
            if (customer) formData.append("id", customer.id);
            Object.entries(data).forEach(([key, value]) => formData.append(key, String(value)));

            const action = customer ? updateCustomerAction : createCustomerAction;
            const result = await action(null, formData);

            if (result?.error) {
                toast.error(result.error, {
                    className: "rounded-2xl border-none bg-destructive text-white font-black italic shadow-2xl",
                });
            } else {
                toast.success(t("Common.success"), {
                    className: "rounded-2xl border-none bg-emerald-500 text-white font-black italic shadow-2xl",
                });
                router.push("/dashboard/customers");
            }
        });
    };

    const container: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.1,
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            className="max-w-3xl mx-auto py-12 px-4 text-start"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 relative">
                <div className="relative">
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-primary/20 rounded-full blur-sm" />
                    <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent italic">
                        {customer ? t("Customers.edit_customer") : t("Customers.new_customer")}
                    </h1>
                    <p className="text-muted-foreground mt-3 text-lg font-medium max-w-2xl flex items-center gap-2">
                        <User className="h-5 w-5 opacity-40" />
                        {customer ? customer.name : t("Customers.description")}
                    </p>
                </div>
            </div>

            <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-3xl rounded-[3rem] overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />
                <CardHeader className="p-10 border-b border-primary/5 bg-primary/5">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-primary/10 rounded-2xl text-primary shadow-xl shadow-primary/5 group-hover:scale-110 transition-transform duration-500">
                            <Sparkles className="h-7 w-7" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-black italic">{customer ? t("Customers.edit_customer") : t("Customers.add_customer")}</CardTitle>
                            <CardDescription className="text-base font-medium mt-1">{t("Customers.form_desc")}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-10">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                                    {t("Customers.name_label")}
                                </Label>
                                <div className="group/input relative">
                                    <Input
                                        {...register("name")}
                                        id="name"
                                        placeholder={t("Customers.name_placeholder")}
                                        className={cn(
                                            "h-14 rounded-2xl border-primary/10 bg-muted/30 focus:bg-background focus:ring-primary/20 focus:border-primary transition-all duration-300 px-6 font-bold text-lg",
                                            errors.name && "border-destructive bg-destructive/5 text-destructive placeholder:text-destructive/40"
                                        )}
                                    />
                                    <AnimatePresence>
                                        {errors.name && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="absolute right-4 top-4 text-destructive"
                                            >
                                                <AlertCircle className="h-6 w-6" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                {errors.name && <p className="text-xs text-destructive font-black italic ml-1 uppercase tracking-tighter">{errors.name.message as string}</p>}
                            </div>

                            <div className="space-y-4">
                                <Label htmlFor="phone" className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                                    {t("Customers.phone_label")}
                                </Label>
                                <div className="group/input relative">
                                    <Input
                                        {...register("phone")}
                                        id="phone"
                                        placeholder={t("Customers.phone_placeholder")}
                                        className="h-14 rounded-2xl border-primary/10 bg-muted/30 focus:bg-background focus:ring-primary/20 focus:border-primary transition-all duration-300 px-6 font-bold text-lg"
                                    />
                                    <div className="absolute right-4 top-4 text-muted-foreground/20 group-hover/input:text-primary/40 transition-colors">
                                        <Phone className="h-6 w-6" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                                    {t("Customers.email_label")}
                                </Label>
                                <div className="group/input relative">
                                    <Input
                                        {...register("email")}
                                        id="email"
                                        placeholder={t("Customers.email_placeholder")}
                                        className={cn(
                                            "h-14 rounded-2xl border-primary/10 bg-muted/30 focus:bg-background focus:ring-primary/20 focus:border-primary transition-all duration-300 px-6 font-bold text-lg",
                                            errors.email && "border-destructive bg-destructive/5 text-destructive placeholder:text-destructive/40"
                                        )}
                                    />
                                    <div className="absolute right-4 top-4 text-muted-foreground/20 group-hover/input:text-primary/40 transition-colors">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                </div>
                                {errors.email && <p className="text-xs text-destructive font-black italic ml-1 uppercase tracking-tighter">{errors.email.message as string}</p>}
                            </div>
                        </div>

                        <div className="flex justify-end pt-10 border-t border-dashed border-primary/10">
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="h-16 px-12 rounded-[2rem] bg-primary shadow-2xl shadow-primary/20 hover:scale-105 transition-all duration-500 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                                {isPending ? (
                                    <div className="flex items-center gap-3">
                                        <RefreshCw className="h-6 w-6 animate-spin" />
                                        <span className="font-black text-xs uppercase tracking-widest">{t("Common.loading")}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <Save className="h-6 w-6 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
                                        <span className="font-black text-sm uppercase tracking-widest">{t("Common.save")}</span>
                                    </div>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
}
