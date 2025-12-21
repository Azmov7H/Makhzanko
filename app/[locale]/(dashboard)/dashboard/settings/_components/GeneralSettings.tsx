"use client";

import { useI18n } from "@/lib/i18n/context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Store, Save, Globe, Moon, Sun, Monitor } from "lucide-react";
import { updateStoreName } from "@/actions/settings";
import { toast } from "sonner";
import LanguageToggle from "@/components/layout/LanguageToggle";
import { ThemeToggle } from "@/components/layout/Toggel";

export function GeneralSettings({ initialName }: { initialName: string }) {
    const { t } = useI18n();

    async function handleStoreUpdate(formData: FormData) {
        const result = await updateStoreName(formData);
        if (result.success) {
            toast.success(t("Common.success") || "Updated successfully");
        } else {
            toast.error(result.error || "Failed to update");
        }
    }

    return (
        <div className="space-y-6">
            <Card className="border-primary/5 shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/30 border-b">
                    <CardTitle className="flex items-center gap-2">
                        <Store className="h-5 w-5 text-primary" />
                        {t("Settings.store_info")}
                    </CardTitle>
                    <CardDescription>{t("Settings.store_info_desc")}</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <form action={handleStoreUpdate} className="space-y-6">
                        <div className="space-y-2 max-w-md">
                            <Label htmlFor="name" className="text-sm font-bold">
                                {t("Settings.store_name")}
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={initialName}
                                className="h-11 rounded-lg border-primary/10"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="gap-2 h-11 px-8 rounded-lg shadow-lg shadow-primary/20"
                        >
                            <Save className="h-4 w-4" />
                            {t("Settings.save_changes")}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="border-primary/5 shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/30 border-b">
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-primary" />
                        {t("Settings.language")} & {t("Settings.theme")}
                    </CardTitle>
                    <CardDescription>
                        {t("Settings.manage_billing")} {/* Reusing for now or just general desc */}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-0.5">
                            <Label className="text-base font-bold">{t("Settings.language")}</Label>
                            <p className="text-sm text-muted-foreground">
                                {t("Landing.features.multi_lang.desc")}
                            </p>
                        </div>
                        <LanguageToggle />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t">
                        <div className="space-y-0.5">
                            <Label className="text-base font-bold">{t("Settings.theme")}</Label>
                            <p className="text-sm text-muted-foreground">
                                {t("Settings.dark")} / {t("Settings.light")} Mode
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
