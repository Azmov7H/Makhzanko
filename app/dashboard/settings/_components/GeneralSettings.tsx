"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Store, Save, Globe, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import LanguageToggle from "@/components/layout/LanguageToggle";
import { ThemeToggle } from "@/components/layout/Toggel";
import { getAuthToken } from "@/lib/auth/AuthContext";

export function GeneralSettings({ initialName }: { initialName: string }) {
    const { t } = useI18n();
    const [isPending, setIsPending] = useState(false);

    async function handleStoreUpdate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsPending(true);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;

        try {
            const token = getAuthToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/tenant`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name })
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to update");
            }

            toast.success(t("Common.success") || "Updated successfully");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsPending(false);
        }
    }

    return (
        <div className="space-y-8">
            <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden group">
                <CardHeader className="p-8 border-b border-primary/5 bg-primary/5">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-primary/10 rounded-2xl text-primary shadow-xl shadow-primary/5 group-hover:scale-110 transition-transform duration-500">
                            <Store className="h-7 w-7" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-black italic">{t("Settings.store_info")}</CardTitle>
                            <CardDescription className="text-base font-medium mt-1">{t("Settings.store_info_desc")}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                    <form onSubmit={handleStoreUpdate} className="space-y-6">
                        <div className="space-y-2 max-w-xl">
                            <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                                {t("Settings.store_name")}
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={initialName}
                                className="h-14 rounded-2xl border-primary/10 bg-muted/30 focus:bg-background focus:ring-primary/20 focus:border-primary transition-all duration-300 px-6 font-bold text-lg"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="h-14 px-10 rounded-[2rem] bg-primary shadow-2xl shadow-primary/20 hover:scale-105 transition-all duration-500 group/btn relative overflow-hidden"
                        >
                            <div className="flex items-center gap-3">
                                {isPending ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5 transition-transform duration-500 group-hover/btn:rotate-12" />}
                                <span className="font-black text-sm uppercase tracking-widest">{t("Settings.save_changes")}</span>
                            </div>
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden group">
                <CardHeader className="p-8 border-b border-primary/5 bg-primary/5">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-primary/10 rounded-2xl text-primary shadow-xl shadow-primary/5 group-hover:scale-110 transition-transform duration-500">
                            <Globe className="h-7 w-7" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-black italic">{t("Settings.language")} & {t("Settings.theme")}</CardTitle>
                            <CardDescription className="text-base font-medium mt-1">{t("Settings.manage_billing")}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-card/40 border border-primary/5 hover:border-primary/10 transition-colors">
                        <div className="space-y-1">
                            <Label className="text-lg font-black">{t("Settings.language")}</Label>
                            <p className="text-sm font-medium text-muted-foreground/60">
                                {t("Landing.features.multi_lang.desc")}
                            </p>
                        </div>
                        <LanguageToggle />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-card/40 border border-primary/5 hover:border-primary/10 transition-colors">
                        <div className="space-y-1">
                            <Label className="text-lg font-black">{t("Settings.theme")}</Label>
                            <p className="text-sm font-medium text-muted-foreground/60">
                                {t("Settings.dark")} / {t("Settings.light")}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
