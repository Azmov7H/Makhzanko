import { getTenantContext } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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
import { CircleUser, Settings, HelpCircle, LogOut, Shield, Search, Bell, Globe } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import Link from "next/link";
import { getI18n, getLocale } from "@/lib/i18n/server";
import { cn } from "@/lib/cn";
import { Input } from "@/components/ui/input";

export async function DashboardHeaderWrapper() {
    const context = await getTenantContext();
    const locale = await getLocale();
    const t = await getI18n(locale);

    const tenant = await prisma.tenant.findUnique({
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
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-6 transition-all duration-300">
            <MobileSidebar role={context.role} plan={plan} />

            {/* Search Bar */}
            <div className="flex-1 flex max-w-md items-center gap-2 relative hidden md:flex">
                <Search className="h-4 w-4 absolute left-3 rtl:right-3 rtl:left-auto text-muted-foreground" />
                <Input
                    placeholder={t("Dashboard.search_placeholder") || "Search..."}
                    className="pl-9 rtl:pr-9 rtl:pl-3 bg-muted/50 border-transparent focus:bg-background transition-all rounded-full h-9 text-sm"
                />
            </div>

            <div className="flex-1 md:hidden" /> {/* Spacer for mobile */}

            <div className="flex items-center gap-2 md:gap-4">
                {/* Language Switch */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 w-9 h-9">
                            <Globe className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href="/ar/dashboard" className={cn("cursor-pointer", locale === "ar" && "bg-accent")}>
                                العربية
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/en/dashboard" className={cn("cursor-pointer", locale === "en" && "bg-accent")}>
                                English
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 w-9 h-9 relative">
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive border-2 border-background animate-pulse" />
                </Button>

                {/* Admin Link */}
                {context.role === "OWNER" && (
                    <Link href="/admin" className="hidden sm:block">
                        <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10 rounded-full font-bold transition-all duration-300 group">
                            <Shield className="h-4 w-4 text-primary group-hover:rotate-12 transition-transform" />
                        </Button>
                    </Link>
                )}

                <div className="h-6 w-[1px] bg-primary/10 mx-1" />

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 transition-all duration-300">
                            <div className="p-1 bg-primary/10 rounded-full group-hover:rotate-6 transition-transform">
                                <CircleUser className="h-5 w-5 text-primary" />
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 p-2 bg-card/95 backdrop-blur-2xl border-primary/10 rounded-2xl shadow-2xl">
                        <DropdownMenuLabel className="px-3 py-3 text-start">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-bold leading-none">{t("Dashboard.user_menu.my_account")}</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-[10px] text-muted-foreground font-mono truncate max-w-[100px]">{context.tenantId}</p>
                                    <Badge variant="outline" className={cn("rounded-full px-1.5 py-0 text-[9px] uppercase h-4", planColors[plan])}>
                                        {plan}
                                    </Badge>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-primary/5" />
                        <DropdownMenuItem asChild className="rounded-xl focus:bg-primary/10 cursor-pointer py-2.5 transition-colors">
                            <Link href="/dashboard/settings" className="flex items-center gap-3">
                                <div className="p-1.5 bg-muted rounded-lg"><Settings className="h-4 w-4" /></div>
                                <span className="font-medium text-sm">{t("Dashboard.settings")}</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="rounded-xl focus:bg-primary/10 cursor-pointer py-2.5 transition-colors">
                            <Link href="/dashboard/settings/billing" className="flex items-center gap-3">
                                <div className="p-1.5 bg-muted rounded-lg"><Settings className="h-4 w-4" /></div>
                                <span className="font-medium text-sm">{t("Dashboard.user_menu.billing")}</span>
                            </Link>
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
            </div>
        </header>
    );
}
