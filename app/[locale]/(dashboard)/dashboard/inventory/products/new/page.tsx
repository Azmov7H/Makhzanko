"use client";

import { createProductAction } from "@/actions/products";
import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getProductSchema } from "@/lib/validation";
import { Package, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function NewProductPage() {
    const { t, locale } = useI18n();
    const [isPending, startTransition] = useTransition();

    const schema = getProductSchema(t);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            sku: "",
            price: 0,
            cost: 0
        }
    });
    const onSubmit = async (data: any) => {
        startTransition(async () => {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => formData.append(key, String(value)));

            const result = await createProductAction(null, formData);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success(t("Common.success"));
                reset();
            }
        });
    };

    return (
        <div className="max-w-3xl mx-auto py-4">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                    <Package className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t("Products.new_product")}</h1>
                    <p className="text-muted-foreground">{t("Products.description")}</p>
                </div>
            </div>

            <Card className="border-primary/5 shadow-xl shadow-primary/5 overflow-hidden">
                <CardHeader className="bg-muted/30 border-b">
                    <CardTitle className="text-xl">{t("Products.add_product")}</CardTitle>
                    <CardDescription>{t("Products.empty_desc")}</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                        <div className="grid gap-8 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-bold ml-1">{t("Products.product_name")}</Label>
                                <Input
                                    {...register("name")}
                                    id="name"
                                    placeholder={t("Products.name_placeholder")}
                                    className={`h-12 rounded-xl border-primary/10 focus:ring-primary/20 transition-all ${errors.name ? 'border-red-500 bg-red-50/30' : ''}`}
                                />
                                {errors.name && <p className="text-xs text-red-500 font-medium mt-1 ml-1">{errors.name.message as string}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sku" className="text-sm font-bold ml-1">{t("Products.sku")}</Label>
                                <Input
                                    {...register("sku")}
                                    id="sku"
                                    placeholder={t("Products.sku_placeholder")}
                                    className={`h-12 rounded-xl border-primary/10 focus:ring-primary/20 transition-all ${errors.sku ? 'border-red-500 bg-red-50/30' : ''}`}
                                />
                                {errors.sku && <p className="text-xs text-red-500 font-medium mt-1 ml-1">{errors.sku.message as string}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price" className="text-sm font-bold ml-1">{t("Products.price")} ({t("Common.currency")})</Label>
                                <Input
                                    {...register("price")}
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className={`h-12 rounded-xl border-primary/10 focus:ring-primary/20 transition-all ${errors.price ? 'border-red-500 bg-red-50/30' : ''}`}
                                />
                                {errors.price && <p className="text-xs text-red-500 font-medium mt-1 ml-1">{errors.price.message as string}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cost" className="text-sm font-bold ml-1">{t("Products.cost")} ({t("Common.currency")})</Label>
                                <Input
                                    {...register("cost")}
                                    id="cost"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className={`h-12 rounded-xl border-primary/10 focus:ring-primary/20 transition-all ${errors.cost ? 'border-red-500 bg-red-50/30' : ''}`}
                                />
                                {errors.cost && <p className="text-xs text-red-500 font-medium mt-1 ml-1">{errors.cost.message as string}</p>}
                            </div>
                        </div>

                        <div className="flex justify-end pt-6 border-t border-dashed">
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="h-12 px-10 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all group"
                            >
                                {isPending ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        {t("Common.loading")}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Save className="h-4 w-4 transition-transform group-hover:scale-110" />
                                        {t("Common.save")}
                                    </div>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
