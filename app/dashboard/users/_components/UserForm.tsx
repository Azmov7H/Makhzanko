"use client";

import { createUserAction, updateUserAction } from "@/actions/users";
import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useI18n } from "@/lib/i18n/context";
import { useForm, Controller } from "react-hook-form";
import { User, Save, RefreshCw, Shield, Mail, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface UserFormProps {
    user?: any;
}

export default function UserForm({ user }: UserFormProps) {
    const { t } = useI18n();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
            role: user?.role || "STAFF",
            isActive: user?.isActive ?? true
        }
    });

    const onSubmit = async (data: any) => {
        startTransition(async () => {
            const formData = new FormData();
            if (user) formData.append("id", user.id);
            Object.entries(data).forEach(([key, value]) => formData.append(key, String(value)));

            const action = user ? updateUserAction : createUserAction;
            const result = await action(null, formData);

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success(t("Common.success"));
                router.push("/dashboard/users");
            }
        });
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
            className="max-w-2xl mx-auto py-12 px-4 text-start"
        >
            <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-3xl rounded-[3rem] overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />
                <CardHeader className="p-10 border-b border-primary/5 bg-primary/5">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-primary/10 rounded-2xl text-primary shadow-xl shadow-primary/5 group-hover:scale-110 transition-transform duration-500">
                            <User className="h-7 w-7" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-black italic">{user ? t("Users.edit_user") : t("Users.add_user")}</CardTitle>
                            <CardDescription className="text-base font-medium mt-1">{t("Users.form_desc")}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-10">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                                    {t("Users.name")}
                                </Label>
                                <Input
                                    {...register("name", { required: true })}
                                    id="name"
                                    placeholder={t("Users.name_placeholder")}
                                    className="h-14 rounded-2xl border-primary/10 bg-muted/30 focus:bg-background focus:ring-primary/20 focus:border-primary transition-all duration-300 px-6 font-bold text-lg"
                                />
                            </div>

                            <div className="space-y-4">
                                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                                    {t("Users.email")}
                                </Label>
                                <div className="relative">
                                    <Input
                                        {...register("email", { required: true })}
                                        id="email"
                                        type="email"
                                        placeholder={t("Users.email_placeholder")}
                                        className="h-14 rounded-2xl border-primary/10 bg-muted/30 focus:bg-background focus:ring-primary/20 focus:border-primary transition-all duration-300 px-6 font-bold text-lg pr-12"
                                    />
                                    <Mail className="absolute right-4 top-4 h-6 w-6 text-muted-foreground/30" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label htmlFor="role" className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                                    {t("Users.role")}
                                </Label>
                                <Controller
                                    control={control}
                                    name="role"
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="h-14 rounded-2xl border-primary/10 bg-muted/30 focus:bg-background focus:ring-primary/20 focus:border-primary transition-all duration-300 px-6 font-bold text-lg">
                                                <SelectValue placeholder={t("Users.select_role")} />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-none shadow-3xl bg-card/90 backdrop-blur-xl">
                                                <SelectItem value="STAFF" className="font-bold">{t("Dashboard.roles.STAFF")}</SelectItem>
                                                <SelectItem value="MANAGER" className="font-bold">{t("Dashboard.roles.MANAGER")}</SelectItem>
                                                <SelectItem value="ADMIN" className="font-bold">{t("Dashboard.roles.ADMIN")}</SelectItem>
                                                <SelectItem value="OWNER" className="font-bold">{t("Dashboard.roles.OWNER")}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            {user && (
                                <div className="flex items-center space-x-2 bg-muted/30 p-4 rounded-2xl border border-primary/5">
                                    <Controller
                                        control={control}
                                        name="isActive"
                                        render={({ field }) => (
                                            <Checkbox
                                                id="isActive"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="h-6 w-6 rounded-md border-primary/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                            />
                                        )}
                                    />
                                    <Label htmlFor="isActive" className="font-bold text-lg cursor-pointer ml-3 select-none flex items-center gap-2">
                                        {t("Users.is_active")}
                                        <CheckCircle className="h-4 w-4 text-emerald-500 opacity-50" />
                                    </Label>
                                </div>
                            )}
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
