"use client";

import { useAuth } from "@/lib/auth/AuthContext";
import { useI18n } from "@/lib/i18n/context";
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
import { CircleUser, Settings, LogOut, Search, Globe } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Input } from "@/components/ui/input";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";

export function DashboardHeaderWrapper() {
    const { user, logout } = useAuth();
    const { t, locale } = useI18n();

    const tenantName = user?.companyName || user?.name || t("Dashboard.brand_name");

    return (
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6 transition-all duration-300">
            <MobileSidebar role={user?.role || "USER"} />

            {/* Search Bar */}
            <div className="flex-1 flex max-w-md items-center gap-2 relative hidden sm:flex group">
                <Search className="h-4 w-4 absolute left-4 rtl:right-4 rtl:left-auto text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                    placeholder={t("Dashboard.search_placeholder") || "Search everything..."}
                    className="pl-10 pr-12 rtl:pr-10 rtl:pl-12 bg-muted/30 border-primary/5 focus:border-primary/20 focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl h-11 text-sm font-bold shadow-sm"
                />
                <div className="absolute right-3 rtl:left-3 rtl:right-auto px-2 py-1 rounded-lg bg-background border border-primary/10 text-[9px] font-black text-muted-foreground shadow-sm flex items-center gap-1 group-focus-within:opacity-0 transition-opacity">
                    <span className="opacity-40">⌘</span>
                    <span>K</span>
                </div>
            </div>

            <div className="flex-1 sm:hidden" /> {/* Spacer for mobile */}

            <div className="flex items-center gap-1 md:gap-4">
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
                <NotificationCenter
                    locale={locale as "ar" | "en"}
                    translations={{
                        title: t("Dashboard.notifications.title"),
                        mark_all_read: t("Dashboard.notifications.mark_all_read"),
                        no_notifications: t("Dashboard.notifications.no_notifications"),
                        unread: t("Dashboard.notifications.unread"),
                        delete: t("Dashboard.notifications.delete"),
                    }}
                />

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
                                <p className="text-sm font-bold leading-none">{tenantName}</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-[10px] text-muted-foreground font-mono truncate max-w-[100px]">{user?.tenantId || "N/A"}</p>
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

                        <DropdownMenuSeparator className="bg-primary/5" />
                        <DropdownMenuItem 
                            onClick={() => logout()}
                            className="rounded-xl focus:bg-destructive/10 cursor-pointer py-3 transition-colors text-destructive flex w-full items-center gap-3"
                        >
                            <div className="p-1.5 bg-destructive/10 rounded-lg"><LogOut className="h-4 w-4" /></div>
                            <span className="font-bold text-sm uppercase tracking-tight">{t("Dashboard.logout")}</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
