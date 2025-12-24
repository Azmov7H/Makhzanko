import { getTenantContext } from "@/lib/auth";
import { db } from "@/lib/db";
import { MobileSidebar } from "@/components/layout/Sidebar";
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
import { logoutAction } from "@/actions/auth";
import Link from "next/link";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

export async function DashboardHeaderWrapper({ locale }: { locale: string }) {
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

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card/60 backdrop-blur-xl px-6 transition-all duration-300 shadow-sm shadow-primary/5">
            <MobileSidebar role={context.role} plan={plan} />
            <div className="w-full flex-1 flex items-center gap-4">
                <div className="h-8 w-[1px] bg-primary/10 hidden lg:block mx-1" />
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {tenantName}
                </span>
                <Badge variant="outline" className={cn("rounded-full px-3 py-0.5 font-bold text-[10px] uppercase tracking-wider border-primary/10", planColors[plan])}>
                    {t(`Dashboard.plans.${plan}`)}
                </Badge>
            </div>
            {context.role === "OWNER" && (
                <Link href={`/${locale}/admin`}>
                    <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10 rounded-full font-bold transition-all duration-300 group">
                        <Shield className="h-4 w-4 text-primary group-hover:rotate-12 transition-transform" />
                        <span className="hidden sm:inline uppercase tracking-tight text-xs">{t("Dashboard.admin_panel")}</span>
                    </Button>
                </Link>
            )}
            <div className="h-8 w-[1px] bg-primary/10 mx-1" />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-primary/10 transition-all duration-300">
                        <div className="p-1 bg-primary/10 rounded-lg group-hover:rotate-6 transition-transform">
                            <CircleUser className="h-5 w-5 text-primary" />
                        </div>
                        <span className="sr-only">{t("Dashboard.user_menu.open_user_menu")}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2 bg-card/95 backdrop-blur-2xl border-primary/10 rounded-2xl shadow-2xl">
                    <DropdownMenuLabel className="px-3 py-3">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-bold leading-none">{t("Dashboard.user_menu.my_account")}</p>
                            <p className="text-[10px] text-muted-foreground font-mono truncate">{context.tenantId}</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-primary/5" />
                    <DropdownMenuItem asChild className="rounded-xl focus:bg-primary/10 cursor-pointer py-2.5 transition-colors">
                        <Link href={`/${locale}/dashboard/settings`} className="flex items-center gap-3">
                            <div className="p-1.5 bg-muted rounded-lg"><Settings className="h-4 w-4" /></div>
                            <span className="font-medium text-sm">{t("Dashboard.settings")}</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl focus:bg-primary/10 cursor-pointer py-2.5 transition-colors">
                        <Link href={`/${locale}/dashboard/settings/billing`} className="flex items-center gap-3">
                            <div className="p-1.5 bg-muted rounded-lg"><Settings className="h-4 w-4" /></div>
                            <span className="font-medium text-sm">{t("Dashboard.user_menu.billing")}</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-xl focus:bg-primary/10 cursor-pointer py-2.5 transition-colors">
                        <div className="flex items-center gap-3 w-full">
                            <div className="p-1.5 bg-muted rounded-lg"><HelpCircle className="h-4 w-4" /></div>
                            <span className="font-medium text-sm">{t("Dashboard.user_menu.support")}</span>
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-primary/5" />
                    <form action={logoutAction}>
                        <DropdownMenuItem asChild className="rounded-xl focus:bg-destructive/10 cursor-pointer py-3 transition-colors">
                            <button type="submit" className="flex w-full items-center gap-3 text-destructive">
                                <div className="p-1.5 bg-destructive/10 rounded-lg"><LogOut className="h-4 w-4" /></div>
                                <span className="font-bold text-sm uppercase tracking-tight">{t("Dashboard.logout")}</span>
                            </button>
                        </DropdownMenuItem>
                    </form>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
