

//backend and server conaction commpnenets
import { getPlatformAdminsAction } from "@/actions/admin/admin-management";
import { requireOwner } from "@/lib/auth-role";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";

//icnos commpnenets
import {
    ShieldAlert,
    UserPlus,
    ShieldCheck,
    Lock,
    Mail,
    UserCircle,
    Power,
    Trash2,
    Shield
} from "lucide-react";


//shadcn commponenets
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


//my commponentns
import { AdminForm } from "./AdminForm";
import { AdminList } from "./AdminList";

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function AdminManagementPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <Suspense fallback={<AdminManagementSkeleton />}>
            <AdminManagementContent locale={locale} />
        </Suspense>
    );
}

async function AdminManagementContent({ locale }: { locale: string }) {
    await requireOwner();
    const t = await getI18n(locale as Locale);
    const admins = await getPlatformAdminsAction();

    return (
        <div className="space-y-8 p-6 text-start">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-linear-to-br from-primary to-accent shadow-lg shadow-primary/20">
                        <ShieldAlert className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                        إدارة مدراء المنصة (RBAC)
                    </h1>
                </div>
                <p className="text-muted-foreground text-lg ml-1">
                    تعيين أدوار وصلاحيات لمدراء فرعيين لمساعدتك في إدارة المنصة.
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Create Form */}
                <div className="lg:col-span-1">
                    <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl sticky top-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserPlus className="h-5 w-5 text-primary" />
                                إضافة مدير جديد
                            </CardTitle>
                            <CardDescription>
                                سيتمكن المدير من الدخول للوحة التحكم بناءً على الدور المحدد.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AdminForm locale={locale} />
                        </CardContent>
                    </Card>
                </div>

                {/* List */}
                <div className="lg:col-span-2">
                    <AdminList
                        admins={JSON.parse(JSON.stringify(admins))}
                        locale={locale}
                    />
                </div>
            </div>
        </div>
    );
}

function AdminManagementSkeleton() {
    return (
        <div className="space-y-8 p-6">
            <Skeleton className="h-20 w-3/4 rounded-xl" />
            <div className="grid gap-8 lg:grid-cols-3">
                <Skeleton className="h-[400px] w-full rounded-2xl" />
                <Skeleton className="h-[400px] w-full rounded-2xl lg:col-span-2" />
            </div>
        </div>
    );
}
