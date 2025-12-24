import { getGlobalSettingsAction } from "@/actions/admin/settings";
import { requireOwner } from "@/lib/auth-role";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";
import { Settings, Save, Shield, Clock, Globe, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SettingsForm } from "./SettingsForm";

export default async function AdminSettingsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    await requireOwner();
    const t = await getI18n(locale as Locale);
    const settings = await getGlobalSettingsAction();

    return (
        <div className="space-y-8 p-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-linear-to-br from-primary to-accent shadow-lg shadow-primary/20">
                        <Settings className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                        إعدادات المنصة العامة
                    </h1>
                </div>
                <p className="text-muted-foreground text-lg ml-1">
                    التحكم في المعايير الأساسية وسلوك النظام لكافة المؤسسات.
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                <SettingsForm initialSettings={settings} locale={locale} />

                <div className="space-y-6">
                    <Card className="border-none shadow-xl shadow-primary/5 bg-primary/5 border-primary/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-primary">
                                <Shield className="h-5 w-5" />
                                مستوى الحماية
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-4">
                            <p>يتم تطبيق هذه الإعدادات لحظياً على كافة العمليات في المنصة.</p>
                            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl">
                                <Zap className="h-5 w-5 text-amber-500" />
                                <span>تغيير مدة التجربة يؤثر فقط على المؤسسات الجديدة.</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl shadow-primary/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-muted-foreground" />
                                سجل التغييرات
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            سيتم تسجيل كافة التغييرات في سجل النشاطات العام للمنصة لضمان الشفافية.
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
