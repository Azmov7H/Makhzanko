"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { Package, ChevronRight, ChevronLeft, User } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./Toggel";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSidebar } from "./SidebarContext";
import { NAV_SECTIONS, NavSection } from "./SidebarComponents";

export { MobileSidebar } from "./SidebarComponents";

export function Sidebar({ role }: { role: string }) {
    const { t, locale } = useI18n();
    const { isCollapsed, toggleSidebar } = useSidebar();
    const sections = NAV_SECTIONS(t, role);

    return (
        <aside className={cn(
            "hidden lg:flex flex-col bg-card border-e fixed inset-y-0 start-0 z-50 shadow-sm transition-all duration-300",
            isCollapsed ? "w-[80px]" : "w-[280px]"
        )}>
            <div className={cn("flex h-16 items-center px-6 border-b justify-between", isCollapsed && "px-4 justify-center")}>
                <Link className="flex items-center gap-3 font-bold text-xl group" href="/dashboard">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm group-hover:scale-105 transition-transform shrink-0">
                        <Package className="h-5 w-5" />
                    </div>
                    {!isCollapsed && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="font-cairo font-bold tracking-tight text-foreground truncate"
                        >
                            {t("Dashboard.brand_name")}
                        </motion.span>
                    )}
                </Link>

                {!isCollapsed && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleSidebar}
                        className="h-8 w-8 text-muted-foreground hover:text-primary rounded-lg"
                    >
                        {locale === "ar" ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    </Button>
                )}
            </div>

            {isCollapsed && (
                <div className="flex justify-center py-4 border-b">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleSidebar}
                        className="h-8 w-8 text-muted-foreground hover:text-primary rounded-lg"
                    >
                        {locale === "ar" ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                </div>
            )}

            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6 scrollbar-none">
                {sections.map((section, index) => (
                    <NavSection key={index} section={section} role={role} isCollapsed={isCollapsed} />
                ))}
            </div>

            <div className="p-4 border-t bg-muted/20">
                <div className={cn(
                    "flex items-center gap-3 px-3 py-3 mb-4 rounded-xl bg-background border border-border/50",
                    isCollapsed && "px-0 justify-center border-none bg-transparent"
                )}>
                    <Avatar className="h-10 w-10 border border-primary/10 shrink-0">
                        <AvatarFallback className="bg-primary/5 text-primary font-bold">
                            <User className="h-5 w-5" />
                        </AvatarFallback>
                    </Avatar>
                    {!isCollapsed && (
                        <div className="flex flex-col text-start overflow-hidden">
                            <span className="text-sm font-bold text-foreground truncate">{t("Common.user_label")}</span>
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{t(`Dashboard.roles.${role}` as any)}</span>
                        </div>
                    )}
                </div>
                <div className="px-1 focus-within:ring-0">
                    <ThemeToggle hideLabel={isCollapsed} />
                </div>
            </div>
        </aside>
    );
}
