import { getAnnouncementsAction } from "@/actions/admin/announcements";
import { requireOwner } from "@/lib/auth-role";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";
import {
    Megaphone,
    Plus,
    Trash2,
    Power,
    Target,
    Users,
    AlertCircle,
    Info,
    AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnnouncementForm } from "./AnnouncementForm";
import { AnnouncementList } from "./AnnouncementList";

export default async function AdminAnnouncementsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    await requireOwner();
    const t = await getI18n(locale as Locale);
    const announcements = await getAnnouncementsAction();

    return (
        <div className="space-y-8 p-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
                        <Megaphone className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        نظام الإعلانات العامة
                    </h1>
                </div>
                <p className="text-muted-foreground text-lg ml-1">
                    إرسال تنبيهات مباشرة لكافة المشتركين أو لفئات محددة.
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Create Form */}
                <div className="lg:col-span-1">
                    <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl sticky top-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plus className="h-5 w-5 text-primary" />
                                إعلان جديد
                            </CardTitle>
                            <CardDescription>
                                سيظهر هذا الإعلان في أعلى لوحة تحكم المؤسسات المستهدفة.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AnnouncementForm locale={locale} />
                        </CardContent>
                    </Card>
                </div>

                {/* List */}
                <div className="lg:col-span-2">
                    <AnnouncementList
                        announcements={JSON.parse(JSON.stringify(announcements))}
                        locale={locale}
                    />
                </div>
            </div>
        </div>
    );
}
