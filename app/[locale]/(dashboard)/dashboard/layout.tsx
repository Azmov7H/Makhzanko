import { Sidebar, MobileSidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { CircleUser, Settings, HelpCircle, LogOut, Shield } from "lucide-react";
import { getTenantContext } from "@/lib/auth";
import { db } from "@/lib/db";
import { Toaster } from "@/components/ui/toaster";
import { logoutAction } from "@/actions/auth";
import Link from "next/link";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";
import { ChatBot } from "@/components/chatbot/ChatBot";
import { getTrialStatus } from "@/lib/trial-check";
import { TrialBanner } from "@/components/dashboard/TrialBanner";
import { getActiveAnnouncementsAction } from "@/actions/admin/announcements";
import { AnnouncementBanner } from "@/components/ui/AnnouncementBanner";

export default async function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const context = await getTenantContext();
    const t = await getI18n(locale as Locale);

    const tenant = await db.tenant.findUnique({
        where: { id: context.tenantId },
        select: { name: true, plan: true }
    });

    const tenantName = tenant?.name || t("Dashboard.brand_name");
    const plan = tenant?.plan || "FREE";

    const planColors: Record<string, string> = {
        FREE: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
        PRO: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        BUSINESS: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    };

    const trialStatus = await getTrialStatus(context.tenantId);
    const announcements = await getActiveAnnouncementsAction(plan);

    return (
        <>
            <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
                <Sidebar role={context.role} />
                <div className="flex flex-col">
                    <header className="flex h-14 items-center gap-4 border-b bg-card px-6 lg:h-[60px] transition-colors">
                        <MobileSidebar role={context.role} />
                        <div className="w-full flex-1 flex items-center gap-3">
                            <span className="font-semibold text-foreground">{tenantName}</span>
                            <Badge variant="outline" className={planColors[plan]}>
                                {t(`Dashboard.plans.${plan}`)}
                            </Badge>
                        </div>
                        {context.role === "OWNER" && (
                            <Link href={`/${locale}/admin`}>
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <Shield className="h-4 w-4" />
                                    <span className="hidden sm:inline">{t("Dashboard.admin_panel")}</span>
                                </Button>
                            </Link>
                        )}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <CircleUser className="h-5 w-5" />
                                    <span className="sr-only">{t("Dashboard.user_menu.open_user_menu")}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>{t("Dashboard.user_menu.my_account")}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href={`/${locale}/dashboard/settings`} className="flex items-center gap-2 cursor-pointer">
                                        <Settings className="h-4 w-4" />
                                        <span>{t("Dashboard.settings")}</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={`/${locale}/dashboard/settings/billing`} className="flex items-center gap-2 cursor-pointer">
                                        <Settings className="h-4 w-4" />
                                        <span>{t("Dashboard.user_menu.billing")}</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <HelpCircle className="h-4 w-4 ml-2" />
                                    <span>{t("Dashboard.user_menu.support")}</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <form action={logoutAction}>
                                    <DropdownMenuItem asChild>
                                        <button type="submit" className="flex w-full items-center gap-2 cursor-pointer text-destructive">
                                            <LogOut className="h-4 w-4" />
                                            <span>{t("Dashboard.logout")}</span>
                                        </button>
                                    </DropdownMenuItem>
                                </form>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </header>
                    <AnnouncementBanner
                        announcements={JSON.parse(JSON.stringify(announcements))}
                        locale={locale}
                    />
                    <TrialBanner
                        daysRemaining={trialStatus.daysRemaining}
                        isExpired={trialStatus.isExpired}
                        locale={locale}
                    />
                    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background transition-colors">
                        {children}
                    </main>
                </div>
            </div>
            <Toaster />
            <ChatBot locale={locale as "en" | "ar"} />
        </>
    );
}
