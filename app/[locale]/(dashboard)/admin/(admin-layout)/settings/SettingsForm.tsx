"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { updateGlobalSettingAction } from "@/actions/admin/settings";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

export function SettingsForm({
    initialSettings,
    locale
}: {
    initialSettings: Record<string, string>,
    locale: string
}) {
    const [settings, setSettings] = useState(initialSettings);
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (key: string, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            for (const [key, value] of Object.entries(settings)) {
                if (value !== initialSettings[key]) {
                    await updateGlobalSettingAction(key, value);
                }
            }
            toast.success("تم حفظ كافة الإعدادات بنجاح");
        } catch (error) {
            toast.error("فشل في حفظ بعض الإعدادات");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl">
            <CardHeader>
                <CardTitle>الإعدادات التشغيلية</CardTitle>
                <CardDescription>إدارة القيم الافتراضية للمنصة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label>مدة الفترة التجريبية (بالأيام)</Label>
                    <Input
                        type="number"
                        value={settings.trial_days || "14"}
                        onChange={(e) => handleChange("trial_days", e.target.value)}
                        className="rounded-xl border-none bg-background shadow-inner"
                    />
                </div>

                <div className="space-y-2">
                    <Label>العملة الافتراضية</Label>
                    <Input
                        value={settings.default_currency || "ج.م"}
                        onChange={(e) => handleChange("default_currency", e.target.value)}
                        className="rounded-xl border-none bg-background shadow-inner"
                    />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
                    <div className="space-y-0.5">
                        <Label>وضع الصيانة</Label>
                        <p className="text-xs text-muted-foreground">منع الوصول لكافة المؤسسات مؤقتاً</p>
                    </div>
                    <Switch
                        checked={settings.maintenance_mode === "true"}
                        onCheckedChange={(checked) => handleChange("maintenance_mode", checked.toString())}
                    />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
                    <div className="space-y-0.5">
                        <Label>التسجيل الجديد</Label>
                        <p className="text-xs text-muted-foreground">السماح بإنشاء حسابات جديدة</p>
                    </div>
                    <Switch
                        checked={settings.allow_registration !== "false"}
                        onCheckedChange={(checked) => handleChange("allow_registration", checked.toString())}
                    />
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full gap-2 font-bold h-12 rounded-xl shadow-lg shadow-primary/20"
                >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    حفظ كافة التغييرات
                </Button>
            </CardFooter>
        </Card>
    );
}
