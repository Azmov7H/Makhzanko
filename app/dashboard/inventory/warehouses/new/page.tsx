"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Warehouse, MapPin, Info, Sparkles, Save, RefreshCw, AlertCircle, Plus, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { getAuthToken } from "@/lib/auth/AuthContext";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getWarehouseSchema } from "@/lib/validation";
import { cn } from "@/lib/utils";

export default function NewWarehousePage() {
    const { t, locale } = useI18n();
    const isRtl = locale === 'ar';
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const schema = useMemo(() => getWarehouseSchema(t), [t]);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            location: ""
        }
    });

    const onSubmit = async (data: any) => {
        startTransition(async () => {
            try {
                const token = getAuthToken();
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/warehouses`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(data)
                });

                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.message || "Failed to create warehouse");
                }

                toast.success(t("Common.success") || "Warehouse Created!", {
                    className: "rounded-2xl border-none bg-emerald-500 text-white font-black shadow-2xl",
                });
                router.push("/dashboard/inventory/warehouses");
            } catch (error: any) {
                toast.error(error.message || t("Common.error"), {
                    className: "rounded-2xl border-none bg-destructive text-white font-black shadow-2xl",
                });
            }
        });
    };

    const container: Variants = {
        hidden: { opacity: 0, y: 15 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.05,
                duration: 0.5
            }
        }
    };

    const item: Variants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            className="max-w-4xl mx-auto py-12 px-4 text-start pb-20"
        >
            {/* Header with Focal Glow */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 relative">
                <motion.div variants={item} className="relative z-10">
                    <div className={cn("absolute top-1/2 -translate-y-1/2 w-1.5 h-20 bg-primary/20 rounded-full blur-sm", isRtl ? "-right-6" : "-left-6")} />
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight text-foreground flex items-center gap-4" style={{ fontFamily: "var(--font-amiri), serif" }}>
                        <div className="size-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                            <Plus className="h-8 w-8" />
                        </div>
                        {t("Warehouses.new_warehouse")}
                    </h1>
                    <p className="text-muted-foreground mt-4 text-lg font-medium max-w-xl opacity-70 leading-relaxed">
                        {t("Warehouses.description")}
                    </p>
                </motion.div>
                
                <motion.div variants={item} className="hidden lg:block relative">
                    <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full animate-pulse" />
                    <div className="p-8 bg-card/40 backdrop-blur-3xl rounded-[2.5rem] border border-primary/10 shadow-3xl relative">
                        <Warehouse className="h-16 w-16 text-primary" />
                    </div>
                </motion.div>
            </div>

            <Card className="luxury-card border-none bg-card/60 backdrop-blur-3xl shadow-3xl rounded-[3rem] overflow-hidden relative group">
                <CardHeader className="p-10 border-b border-primary/5 bg-gradient-to-br from-primary/[0.03] to-transparent">
                    <div className="flex items-center gap-6">
                        <div className="size-14 rounded-2xl bg-primary shadow-xl shadow-primary/20 flex items-center justify-center text-white ring-8 ring-primary/5 transition-transform group-hover:scale-110 duration-500">
                            <Sparkles className="h-7 w-7" />
                        </div>
                        <div>
                            <CardTitle className="text-3xl font-black tracking-tight italic" style={{ fontFamily: "var(--font-amiri), serif" }}>{t("Warehouses.add_warehouse")}</CardTitle>
                            <CardDescription className="text-base font-bold mt-1 opacity-60 tracking-wide uppercase text-[10px]">{t("Warehouses.empty_desc")}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                
                <CardContent className="p-12">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                        <div className="grid gap-10">
                            {/* Warehouse Name */}
                            <motion.div variants={item} className="space-y-4">
                                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2">
                                    {t("Warehouses.name_label")}
                                </Label>
                                <div className="relative group/input">
                                    <Input
                                        {...register("name")}
                                        id="name"
                                        placeholder={t("Warehouses.name_placeholder")}
                                        className={cn(
                                            "h-16 rounded-[1.25rem] border-primary/10 bg-muted/30 focus:bg-background focus:ring-primary/20 focus:border-primary transition-all duration-300 px-6 font-bold text-lg shadow-sm focus:shadow-xl",
                                            errors.name && "border-destructive/50 bg-destructive/[0.02] text-destructive ring-destructive/20"
                                        )}
                                    />
                                    <AnimatePresence>
                                        {errors.name && (
                                            <motion.div
                                                initial={{ opacity: 0, x: isRtl ? 10 : -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className={cn("absolute top-5 text-destructive", isRtl ? "left-4" : "right-4")}
                                            >
                                                <AlertCircle className="h-6 w-6" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                {errors.name && <p className="text-[10px] text-destructive font-black italic ml-2 uppercase tracking-tight">{errors.name.message as string}</p>}
                            </motion.div>

                            {/* Location */}
                            <motion.div variants={item} className="space-y-4">
                                <Label htmlFor="location" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2">
                                    {t("Warehouses.location_label")}
                                </Label>
                                <div className="relative group/input">
                                    <MapPin className={cn("absolute top-5 h-6 w-6 opacity-20 group-focus-within/input:opacity-100 transition-opacity text-primary", isRtl ? "right-6" : "left-6")} />
                                    <Input
                                        {...register("location")}
                                        id="location"
                                        placeholder={t("Warehouses.location_placeholder")}
                                        className={cn(
                                            "h-16 rounded-[1.25rem] border-primary/10 bg-muted/30 focus:bg-background focus:ring-primary/20 focus:border-primary transition-all duration-300 font-bold text-lg",
                                            isRtl ? "pr-16 pl-6 text-right" : "pl-16 pr-6 text-left"
                                        )}
                                    />
                                </div>
                            </motion.div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-12 border-t border-primary/5">
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="h-20 px-12 rounded-[2.5rem] bg-primary text-white shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 group relative overflow-hidden flex items-center gap-4"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                {isPending ? (
                                    <>
                                        <RefreshCw className="h-6 w-6 animate-spin" />
                                        <span className="font-black text-sm uppercase tracking-widest">{t("Common.loading")}</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-6 w-6 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6" />
                                        <span className="font-black text-sm uppercase tracking-widest">{t("Common.save")}</span>
                                        <ArrowRight className={cn("h-5 w-5 opacity-0 group-hover:opacity-100 transition-all", isRtl ? "-translate-x-4 rotate-180 group-hover:-translate-x-0" : "translate-x-4 group-hover:translate-x-0")} />
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
}
