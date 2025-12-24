import { getAdminChatSessions } from "@/actions/chat";
import { requireOwner } from "@/lib/auth-role";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    MessageCircle,
    Clock,
    Building2,
    ArrowRight,
    Search,
    Filter
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function AdminSupportPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <Suspense fallback={<SupportSkeleton />}>
            <SupportContent locale={locale} />
        </Suspense>
    );
}

async function SupportContent({ locale }: { locale: string }) {
    await requireOwner();
    const t = await getI18n(locale as Locale);
    const sessions = await getAdminChatSessions();
    const dateLocale = locale === "ar" ? ar : enUS;

    return (
        <div className="space-y-8 p-6 text-start">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
                        <MessageCircle className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {t("Admin.support.title")}
                    </h1>
                </div>
                <p className="text-muted-foreground text-lg ml-1">
                    {t("Dashboard.chat.management")}
                </p>
            </div>

            {/* Sessions Grid */}
            <div className="grid gap-6">
                {sessions.length === 0 ? (
                    <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl py-20">
                        <CardContent className="flex flex-col items-center justify-center text-center">
                            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
                                <MessageCircle className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{t("Admin.support.no_sessions")}</h3>
                            <p className="text-muted-foreground max-w-sm">
                                {t("Dashboard.chat.noActiveChats")}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {sessions.map((session: any) => (
                            <Card key={session.id} className="relative overflow-hidden border-none shadow-xl shadow-primary/5 group hover:scale-[1.02] transition-all duration-300">
                                <div className={`absolute top-0 left-0 w-1 h-full ${session.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-muted'
                                    }`} />

                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <Badge variant={session.status === 'ACTIVE' ? 'default' : 'secondary'} className={
                                            session.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600 border-none' : ''
                                        }>
                                            {session.status === 'ACTIVE' ? t("Dashboard.chat.active") : session.status}
                                        </Badge>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Clock className="h-3.5 w-3.5" />
                                            {formatDistanceToNow(new Date(session.startedAt), {
                                                addSuffix: true,
                                                locale: dateLocale
                                            })}
                                        </div>
                                    </div>
                                    <CardTitle className="flex items-center gap-2 mt-4 text-xl">
                                        <Building2 className="h-5 w-5 text-primary" />
                                        {session.tenant.name}
                                    </CardTitle>
                                    <CardDescription className="font-mono text-xs">
                                        {session.tenant.slug}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="pb-6">
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                                                {t("Admin.support.messages_count")}
                                            </span>
                                            <span className="text-2xl font-black">{session._count.messages}</span>
                                        </div>

                                        <Link href={`/${locale}/admin/support/${session.id}`}>
                                            <Button size="sm" className="rounded-xl shadow-lg shadow-primary/20 group">
                                                {t("Admin.support.respond")}
                                                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function SupportSkeleton() {
    return (
        <div className="space-y-8 p-6">
            <Skeleton className="h-20 w-3/4 rounded-xl" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-[250px] w-full rounded-2xl" />
                ))}
            </div>
        </div>
    );
}
