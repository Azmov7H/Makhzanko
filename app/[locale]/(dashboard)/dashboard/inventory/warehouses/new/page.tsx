"use client";

import { createWarehouseAction } from "@/actions/warehouses";
import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getWarehouseSchema } from "@/lib/validation";
import { Warehouse, Save, AlertCircle, CheckCircle2 } from "lucide-react";

export default function NewWarehousePage() {
    const { t } = useI18n();
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const schema = getWarehouseSchema(t);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            location: ""
        }
    });

    const onSubmit = async (data: any) => {
        setStatus(null);
        startTransition(async () => {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => formData.append(key, String(value)));

            const result = await createWarehouseAction(null, formData);
            if (result?.error) {
                setStatus({ type: 'error', message: result.error });
            } else {
                setStatus({ type: 'success', message: t("Common.success") });
                reset();
            }
        });
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                    <Warehouse className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t("Warehouses.new_warehouse")}</h1>
                    <p className="text-muted-foreground">{t("Warehouses.description")}</p>
                </div>
            </div>

            <Card className="border-primary/5 shadow-xl shadow-primary/5 overflow-hidden">
                <CardHeader className="bg-muted/30 border-b">
                    <CardTitle className="text-xl">{t("Warehouses.add_warehouse")}</CardTitle>
                    <CardDescription>{t("Warehouses.empty_desc")}</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {status && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, y: -10 }}
                                    animate={{ opacity: 1, height: "auto", y: 0 }}
                                    exit={{ opacity: 0, height: 0, y: -10 }}
                                    className={`flex items-center gap-3 p-4 rounded-xl border ${status.type === 'success'
                                            ? "bg-green-500/10 border-green-500/20 text-green-700"
                                            : "bg-red-500/10 border-red-500/20 text-red-700"
                                        }`}
                                >
                                    {status.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                                    <p className="text-sm font-bold">{status.message}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-bold ml-1">{t("Warehouses.name_label")}</Label>
                                <Input
                                    {...register("name")}
                                    id="name"
                                    placeholder={t("Warehouses.name_placeholder")}
                                    className={`h-12 rounded-xl border-primary/10 transition-all ${errors.name ? 'border-red-500 bg-red-50/30' : ''}`}
                                />
                                {errors.name && <p className="text-xs text-red-500 font-medium mt-1 ml-1">{errors.name.message as string}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location" className="text-sm font-bold ml-1">{t("Warehouses.location_label")}</Label>
                                <Input
                                    {...register("location")}
                                    id="location"
                                    placeholder={t("Warehouses.location_placeholder")}
                                    className="h-12 rounded-xl border-primary/10 transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-6 border-t border-dashed mt-8">
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
