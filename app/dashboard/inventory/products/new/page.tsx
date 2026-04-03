"use client";

import { useState, useTransition, useMemo } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getProductSchema } from "@/lib/validation";
import { Package, Save, AlertCircle, CheckCircle2, RefreshCw, Sparkles, Plus, Info, ArrowRight, Tag } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { getAuthToken } from "@/lib/auth/AuthContext";

export default function NewProductPage() {
    const { t, locale } = useI18n();
    const isRtl = locale === 'ar';
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const schema = useMemo(() => getProductSchema(t), [t]);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        watch
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            sku: "",
            category: "",
            price: 0,
            cost: 0,
            minStock: 5
        }
    });

    const onSubmit = async (data: any) => {
        startTransition(async () => {
            try {
                const token = getAuthToken();
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(data)
                });

                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.message || "Failed to create product");
                }

                toast.success(t("Common.success") || "Product Created!", {
                    className: "rounded-2xl border-none bg-emerald-500 text-white font-black shadow-2xl",
                });
                router.push("/dashboard/inventory/products");
            } catch (error: any) {
                toast.error(error.message || t("Common.error"), {
                    className: "rounded-2xl border-none bg-destructive text-white font-black shadow-2xl",
                });
            }
        });
    };

    const [nameExists, setNameExists] = useState(false);
    const [skuExists, setSkuExists] = useState(false);
    const [isChecking, setIsChecking] = useState(false);

    const checkDuplicate = async (field: "sku" | "name", value: string) => {
        if (!value) return;
        setIsChecking(true);
        try {
            const token = getAuthToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/check-exists?field=${field}&value=${value}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const { exists } = await res.json();
            if (field === "name") setNameExists(exists);
            if (field === "sku") setSkuExists(exists);
        } catch (error) {
            console.error("Failed to check duplicate:", error);
        } finally {
            setIsChecking(false);
        }
    };

    const generateSKU = () => {
        const randomInfo = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const timestamp = Date.now().toString().slice(-4);
        const newSku = `PRD-${timestamp}-${randomInfo}`;
        setValue("sku", newSku);
        checkDuplicate("sku", newSku);
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
                        {t("Products.new_product")}
                    </h1>
                    <p className="text-muted-foreground mt-4 text-lg font-medium max-w-xl opacity-70 leading-relaxed">
                        {t("Products.description")}
                    </p>
                </motion.div>

                <motion.div variants={item} className="hidden lg:block relative">
                    <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full animate-pulse" />
                    <div className="p-8 bg-card/40 backdrop-blur-3xl rounded-[2.5rem] border border-primary/10 shadow-3xl relative">
                        <Package className="h-16 w-16 text-primary" />
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
                            <CardTitle className="text-3xl font-black tracking-tight italic" style={{ fontFamily: "var(--font-amiri), serif" }}>{t("Products.add_product")}</CardTitle>
                            <CardDescription className="text-base font-bold mt-1 opacity-60 tracking-wide uppercase text-[10px]">{t("Products.empty_desc")}</CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-12">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                        <div className="grid gap-10 md:grid-cols-2">
                            {/* Product Name */}
                            <motion.div variants={item} className="space-y-4">
                                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2">
                                    {t("Products.product_name")}
                                </Label>
                                <div className="relative group/input">
                                    <Input
                                        {...register("name")}
                                        id="name"
                                        onBlur={(e) => checkDuplicate("name", e.target.value)}
                                        placeholder={t("Products.name_placeholder")}
                                        className={cn(
                                            "h-16 rounded-[1.25rem] border-primary/10 bg-muted/30 focus:bg-background focus:ring-primary/20 focus:border-primary transition-all duration-300 px-6 font-bold text-lg shadow-sm focus:shadow-xl",
                                            (errors.name || nameExists) && "border-destructive/50 bg-destructive/[0.02] text-destructive ring-destructive/20"
                                        )}
                                    />
                                    <AnimatePresence>
                                        {(errors.name || nameExists) && (
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
                                {nameExists && <p className="text-[10px] text-destructive font-black italic ml-2 uppercase tracking-tight">{t("Products.name_exists")}</p>}
                            </motion.div>

                            {/* SKU with Generator */}
                            <motion.div variants={item} className="space-y-4">
                                <Label htmlFor="sku" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2">
                                    {t("Products.sku")}
                                </Label>
                                <div className="flex gap-3">
                                    <div className="relative flex-1 group/input">
                                        <Input
                                            {...register("sku")}
                                            id="sku"
                                            onBlur={(e) => checkDuplicate("sku", e.target.value)}
                                            placeholder={t("Products.sku_placeholder")}
                                            className={cn(
                                                "h-16 rounded-[1.25rem] border-primary/10 bg-muted/30 focus:bg-background focus:ring-primary/20 focus:border-primary transition-all duration-300 px-6 font-mono font-bold text-lg shadow-sm focus:shadow-xl",
                                                (errors.sku || skuExists) && "border-destructive/50 bg-destructive/[0.02] text-destructive ring-destructive/20"
                                            )}
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={generateSKU}
                                        className="h-16 w-16 p-0 rounded-[1.25rem] border-primary/10 hover:bg-primary/5 hover:text-primary hover:border-primary hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl shadow-primary/5 group/btn"
                                    >
                                        <RefreshCw className="h-6 w-6 transition-transform duration-700 group-hover:rotate-180" />
                                    </Button>
                                </div>
                                {errors.sku && <p className="text-[10px] text-destructive font-black italic ml-2 uppercase tracking-tight">{errors.sku.message as string}</p>}
                                {skuExists && <p className="text-[10px] text-destructive font-black italic ml-2 uppercase tracking-tight">{t("Products.sku_exists")}</p>}
                            </motion.div>

                            {/* Category - NEW */}
                            <motion.div variants={item} className="space-y-4">
                                <Label htmlFor="category" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2">
                                    {t("Products.category")}
                                </Label>
                                <div className="relative group/input">
                                    <Tag className={cn("absolute top-5 h-6 w-6 opacity-20 group-focus-within/input:opacity-100 transition-opacity text-primary", isRtl ? "right-6" : "left-6")} />
                                    <Input
                                        {...register("category")}
                                        id="category"
                                        placeholder={t("Products.category_placeholder") || "General, Electronics, etc."}
                                        className={cn(
                                            "h-16 rounded-[1.25rem] border-primary/10 bg-muted/30 focus:bg-background focus:ring-primary/20 focus:border-primary transition-all duration-300 font-bold text-lg",
                                            isRtl ? "pr-16 pl-6 text-right" : "pl-16 pr-6 text-left"
                                        )}
                                    />
                                </div>
                            </motion.div>

                            {/* Price */}
                            <motion.div variants={item} className="space-y-4">
                                <Label htmlFor="price" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2">
                                    {t("Products.price")}
                                </Label>
                                <div className="relative">
                                    <Input
                                        {...register("price")}
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        className={cn(
                                            "h-16 rounded-[1.25rem] border-primary/10 bg-primary/[0.02] focus:bg-background focus:ring-primary/20 focus:border-primary transition-all duration-300 px-6 font-black text-3xl tracking-tighter text-primary shadow-inner",
                                            errors.price && "border-destructive bg-destructive/5"
                                        )}
                                    />
                                    <span className={cn("absolute top-1/2 -translate-y-1/2 font-black text-xs opacity-20 uppercase tracking-widest", isRtl ? "left-6" : "right-6")}>
                                        {t("Common.currency")}
                                    </span>
                                </div>
                                {errors.price && <p className="text-[10px] text-destructive font-black italic ml-2 uppercase tracking-tight">{errors.price.message as string}</p>}
                            </motion.div>

                            {/* Cost */}
                            <motion.div variants={item} className="space-y-4">
                                <Label htmlFor="cost" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2">
                                    {t("Products.cost")}
                                </Label>
                                <div className="relative">
                                    <Input
                                        {...register("cost")}
                                        id="cost"
                                        type="number"
                                        step="0.01"
                                        className={cn(
                                            "h-16 rounded-[1.25rem] border-primary/10 bg-muted/20 focus:bg-background focus:ring-primary/20 focus:border-primary transition-all duration-300 px-6 font-black text-3xl tracking-tighter text-muted-foreground/40",
                                            errors.cost && "border-destructive bg-destructive/5 font-black text-destructive"
                                        )}
                                    />
                                </div>
                                {errors.cost && <p className="text-[10px] text-destructive font-black italic ml-2 uppercase tracking-tight">{errors.cost.message as string}</p>}
                            </motion.div>

                            {/* Min Stock */}
                            <motion.div variants={item} className="space-y-4">
                                <Label htmlFor="minStock" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2">
                                    {t("Products.min_stock")}
                                </Label>
                                <div className="relative group/input">
                                    <Input
                                        {...register("minStock")}
                                        id="minStock"
                                        type="number"
                                        className={cn(
                                            "h-16 rounded-[1.25rem] border-primary/10 bg-muted/30 focus:bg-background focus:ring-primary/20 focus:border-primary transition-all duration-300 px-6 font-black text-xl",
                                            errors.minStock && "border-destructive bg-destructive/5"
                                        )}
                                    />
                                    <div className={cn("absolute top-5 text-muted-foreground/20 group-focus-within/input:text-primary/40 transition-colors", isRtl ? "left-6" : "right-6")}>
                                        <Info className="h-6 w-6" />
                                    </div>
                                </div>
                                {errors.minStock && <p className="text-[10px] text-destructive font-black italic ml-2 uppercase tracking-tight">{errors.minStock.message as string}</p>}
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
