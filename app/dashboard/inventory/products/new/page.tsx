"use client";

import { createProductAction, checkProductExistsAction } from "@/actions/products";
import { useState, useTransition } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getProductSchema } from "@/lib/validation";
import { Package, Save, AlertCircle, CheckCircle2, RefreshCw, Sparkles, Box, Info } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function NewProductPage() {
    const { t } = useI18n();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const schema = getProductSchema(t);
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
            price: 0,
            cost: 0,
            minStock: 5
        }
    });

    const onSubmit = async (data: any) => {
        startTransition(async () => {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => formData.append(key, String(value)));

            const result = await createProductAction(null, formData);
            if (result?.error) {
                toast.error(result.error, {
                    className: "rounded-2xl border-none bg-destructive text-white font-black italic shadow-2xl",
                });
            } else {
                toast.success(t("Common.success"), {
                    className: "rounded-2xl border-none bg-emerald-500 text-white font-black italic shadow-2xl",
                });
                router.push("/dashboard/inventory/products");
            }
        });
    };

    const [nameExists, setNameExists] = useState(false);
    const [skuExists, setSkuExists] = useState(false);
    const [isChecking, setIsChecking] = useState(false);

    const checkDuplicate = async (field: "sku" | "name", value: string) => {
        if (!value) return;
        setIsChecking(true);
        const exists = await checkProductExistsAction(field, value);
        if (field === "name") setNameExists(exists);
        if (field === "sku") setSkuExists(exists);
        setIsChecking(false);
    };

    const generateSKU = () => {
        const randomInfo = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const timestamp = Date.now().toString().slice(-4);
        const newSku = `PRD-${timestamp}-${randomInfo}`;
        setValue("sku", newSku);
        checkDuplicate("sku", newSku);
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
            className="max-w-4xl mx-auto py-12 px-4 text-start"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 relative">
                <div className="relative">
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-primary/20 rounded-full blur-sm" />
                    <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent italic">
                        {t("Products.new_product")}
                    </h1>
                    <p className="text-muted-foreground mt-3 text-lg font-medium max-w-2xl flex items-center gap-2">
                        <Box className="h-5 w-5 opacity-40" />
                        {t("Products.description")}
                    </p>
                </div>
                <div className="hidden md:block">
                    <div className="p-5 bg-primary/5 rounded-[2rem] border border-primary/10 shadow-2xl shadow-primary/5 group-hover:scale-110 transition-all duration-500">
                        <Package className="h-10 w-10 text-primary animate-pulse" />
                    </div>
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
                            <CardTitle className="text-2xl font-black italic">{t("Products.add_product")}</CardTitle>
                            <CardDescription className="text-base font-medium mt-1">{t("Products.empty_desc")}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-10">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                        <div className="grid gap-10 md:grid-cols-2">
                            <div className="space-y-4">
                                <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                                    {t("Products.product_name")}
                                </Label>
                                <div className="relative group/input">
                                    <Input
                                        {...register("name")}
                                        id="name"
                                        onBlur={(e) => checkDuplicate("name", e.target.value)}
                                        placeholder={t("Products.name_placeholder")}
                                        className={cn(
                                            "h-14 rounded-2xl border-primary/10 bg-muted/30 focus:bg-background focus:ring-primary/20 focus:border-primary transition-all duration-300 px-6 font-bold text-lg",
                                            (errors.name || nameExists) && "border-destructive bg-destructive/5 text-destructive placeholder:text-destructive/40"
                                        )}
                                    />
                                    <AnimatePresence>
                                        {(errors.name || nameExists) && (
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
                                {nameExists && <p className="text-xs text-destructive font-black italic ml-1 uppercase tracking-tighter">{t("Products.name_exists")}</p>}
                            </div>

                            <div className="space-y-4">
                                <Label htmlFor="sku" className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
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
                                                "h-14 rounded-2xl border-primary/10 bg-muted/30 focus:bg-background focus:ring-primary/20 focus:border-primary transition-all duration-300 px-6 font-mono font-bold text-lg",
                                                (errors.sku || skuExists) && "border-destructive bg-destructive/5 text-destructive placeholder:text-destructive/40"
                                            )}
                                        />
                                        <AnimatePresence>
                                            {(errors.sku || skuExists) && (
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
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={generateSKU}
                                        className="h-14 w-14 p-0 rounded-2xl border-primary/10 hover:bg-primary/5 hover:text-primary hover:border-primary hover:scale-110 transition-all duration-300 shadow-xl shadow-primary/5 group/btn"
                                        title={t("Products.generate_sku")}
                                    >
                                        <RefreshCw className="h-6 w-6 transition-transform duration-700 group-active/btn:rotate-180" />
                                    </Button>
                                </div>
                                {errors.sku && <p className="text-xs text-destructive font-black italic ml-1 uppercase tracking-tighter">{errors.sku.message as string}</p>}
                                {skuExists && <p className="text-xs text-destructive font-black italic ml-1 uppercase tracking-tighter">{t("Products.sku_exists")}</p>}
                            </div>

                            <div className="space-y-4">
                                <Label htmlFor="price" className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                                    {t("Products.price")} ({t("Common.currency")})
                                </Label>
                                <Input
                                    {...register("price")}
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className={cn(
                                        "h-14 rounded-2xl border-primary/10 bg-muted/30 focus:bg-background focus:ring-primary/20 focus:border-primary transition-all duration-300 px-6 font-black text-2xl tracking-tighter text-primary",
                                        errors.price && "border-destructive bg-destructive/5 text-destructive"
                                    )}
                                />
                                {errors.price && <p className="text-xs text-destructive font-black italic ml-1 uppercase tracking-tighter">{errors.price.message as string}</p>}
                            </div>

                            <div className="space-y-4">
                                <Label htmlFor="cost" className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                                    {t("Products.cost")} ({t("Common.currency")})
                                </Label>
                                <Input
                                    {...register("cost")}
                                    id="cost"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className={cn(
                                        "h-14 rounded-2xl border-primary/10 bg-muted/30 focus:bg-background focus:ring-primary/20 focus:border-primary transition-all duration-300 px-6 font-black text-2xl tracking-tighter text-muted-foreground/40",
                                        errors.cost && "border-destructive bg-destructive/5 text-destructive"
                                    )}
                                />
                                {errors.cost && <p className="text-xs text-destructive font-black italic ml-1 uppercase tracking-tighter">{errors.cost.message as string}</p>}
                            </div>

                            <div className="space-y-4">
                                <Label htmlFor="minStock" className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                                    {t("Products.min_stock")}
                                </Label>
                                <div className="relative group/input">
                                    <Input
                                        {...register("minStock")}
                                        id="minStock"
                                        type="number"
                                        placeholder="5"
                                        className={cn(
                                            "h-14 rounded-2xl border-primary/10 bg-muted/30 focus:bg-background focus:ring-primary/20 focus:border-primary transition-all duration-300 px-6 font-black text-lg",
                                            errors.minStock && "border-destructive bg-destructive/5 text-destructive"
                                        )}
                                    />
                                    <div className="absolute right-4 top-4 text-muted-foreground/20 group-hover/input:text-primary/40 transition-colors">
                                        <Info className="h-6 w-6" />
                                    </div>
                                </div>
                                {errors.minStock && <p className="text-xs text-destructive font-black italic ml-1 uppercase tracking-tighter">{errors.minStock.message as string}</p>}
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
