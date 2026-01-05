"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import {
    LayoutDashboard,
    Package,
    Warehouse,
    ShoppingCart,
    Truck,
    FileText,
    Receipt,
    Settings,
    Menu,
    BarChart3,
    Calculator,
    Users,
    HelpCircle,
    Lock,
    PieChart,
    Wallet,
    Undo2,
    ChevronDown,
    ChevronRight,
    User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./Toggel";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavItem {
    label: string;
    href: string;
    icon: any;
    roles: string[];
    minPlan: string;
}

interface NavSection {
    title?: string;
    items: NavItem[];
}

const NAV_SECTIONS = (t: any, role: string): NavSection[] => [
    {
        items: [
            { label: t("Dashboard.dashboard"), href: "/dashboard", icon: LayoutDashboard, roles: ["OWNER", "MANAGER", "STAFF"], minPlan: "FREE" },
        ]
    },
    {
        title: t("Dashboard.inventory"),
        items: [
            { label: t("Dashboard.products"), href: "/dashboard/inventory/products", icon: Package, roles: ["OWNER", "MANAGER", "STAFF"], minPlan: "FREE" },
            { label: t("Dashboard.warehouses"), href: "/dashboard/inventory/warehouses", icon: Warehouse, roles: ["OWNER", "MANAGER"], minPlan: "PRO" },
        ]
    },
    {
        title: t("Dashboard.sales"),
        items: [
            { label: t("Dashboard.sales"), href: "/dashboard/sales/sales", icon: ShoppingCart, roles: ["OWNER", "STAFF", "MANAGER"], minPlan: "FREE" },
            { label: t("Dashboard.invoices"), href: "/dashboard/sales/invoices", icon: FileText, roles: ["OWNER", "STAFF", "MANAGER"], minPlan: "FREE" },
            { label: t("Dashboard.returns"), href: "/dashboard/sales/returns", icon: Undo2, roles: ["OWNER", "MANAGER", "STAFF"], minPlan: "PRO" },
        ]
    },
    {
        title: t("Dashboard.finance"),
        items: [
            { label: t("Dashboard.purchases"), href: "/dashboard/finance/purchases", icon: Truck, roles: ["OWNER", "MANAGER"], minPlan: "PRO" },
            { label: t("Dashboard.expenses"), href: "/dashboard/finance/expenses", icon: Receipt, roles: ["OWNER", "MANAGER"], minPlan: "PRO" },
            { label: t("Dashboard.accounting"), href: "/dashboard/finance/accounting", icon: Calculator, roles: ["OWNER"], minPlan: "BUSINESS" },
            { label: t("Dashboard.treasury"), href: "/dashboard/finance/accounting/treasury", icon: Wallet, roles: ["OWNER", "MANAGER"], minPlan: "BUSINESS" },
        ]
    },
    {
        title: t("Dashboard.reports"),
        items: [
            { label: t("Dashboard.reports"), href: "/dashboard/finance/reports", icon: BarChart3, roles: ["OWNER", "MANAGER"], minPlan: "PRO" },
            { label: t("Dashboard.advanced_analytics"), href: "/dashboard/finance/analytics", icon: PieChart, roles: ["OWNER"], minPlan: "BUSINESS" },
        ]
    },
    {
        title: t("Dashboard.system"),
        items: [
            { label: t("Dashboard.users"), href: "/dashboard/users", icon: Users, roles: ["OWNER"], minPlan: "BUSINESS" },
            { label: t("Dashboard.settings"), href: "/dashboard/settings", icon: Settings, roles: ["OWNER", "MANAGER", "STAFF"], minPlan: "FREE" },
            { label: t("Dashboard.user_menu.support"), href: "/dashboard/contact", icon: HelpCircle, roles: ["OWNER", "MANAGER", "STAFF"], minPlan: "FREE" },
        ]
    }
];

const PLAN_LEVELS: Record<string, number> = {
    "FREE": 0,
    "PRO": 1,
    "BUSINESS": 2
};

export function Sidebar({ role, plan }: { role: string; plan: string }) {
    const { t } = useI18n();
    const sections = NAV_SECTIONS(t, role);

    return (
        <aside className="hidden lg:flex flex-col w-[280px] bg-card border-e fixed inset-y-0 start-0 z-50 shadow-sm transition-all duration-300">
            <div className="flex h-16 items-center px-6 border-b">
                <Link className="flex items-center gap-3 font-bold text-xl group" href="/dashboard">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm group-hover:scale-105 transition-transform">
                        <Package className="h-5 w-5" />
                    </div>
                    <span className="font-cairo font-bold tracking-tight text-foreground">
                        {t("Dashboard.brand_name")}
                    </span>
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6 scrollbar-none">
                {sections.map((section, index) => (
                    <NavSection key={index} section={section} plan={plan} role={role} />
                ))}
            </div>

            <div className="p-4 border-t bg-muted/20">
                <div className="flex items-center gap-3 px-3 py-3 mb-4 rounded-xl bg-background border border-border/50">
                    <Avatar className="h-10 w-10 border border-primary/10">
                        <AvatarFallback className="bg-primary/5 text-primary font-bold">
                            <User className="h-5 w-5" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-start overflow-hidden">
                        <span className="text-sm font-bold text-foreground truncate">{t("Common.user_label")}</span>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{role}</span>
                    </div>
                </div>
                <div className="px-1">
                    <ThemeToggle />
                </div>
            </div>
        </aside>
    );
}

export function MobileSidebar({ role, plan }: { role: string; plan: string }) {
    const { t } = useI18n();
    const sections = NAV_SECTIONS(t, role);
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0 lg:hidden hover:bg-primary/10 rounded-xl">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side={useI18n().locale === "ar" ? "right" : "left"} className="flex flex-col w-[300px] p-0 bg-sidebar-background">
                <div className="flex h-16 items-center border-b border-sidebar-border/50 px-6">
                    <Link className="flex items-center gap-3 font-bold text-xl group" href="/dashboard" onClick={() => setOpen(false)}>
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                            <Package className="h-5 w-5" />
                        </div>
                        <span className="font-cairo font-bold tracking-tight text-sidebar-foreground">
                            {t("Dashboard.brand_name")}
                        </span>
                    </Link>
                </div>
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
                    {sections.map((section, index) => (
                        <NavSection key={index} section={section} plan={plan} role={role} mobile onLinkClick={() => setOpen(false)} />
                    ))}
                </div>
                <div className="p-4 border-t border-sidebar-border/50 bg-sidebar-accent/50">
                    <div className="flex items-center gap-3 px-2 mb-4">
                        <Avatar className="h-9 w-9 border border-border">
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                <User className="h-4 w-4" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-start">
                            <span className="text-sm font-bold text-sidebar-foreground">{t("Common.user_label")}</span>
                            <span className="text-[10px] text-sidebar-foreground/60 font-medium uppercase">{role}</span>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

function NavSection({ section, plan, role, mobile, onLinkClick }: { section: NavSection, plan: string, role: string, mobile?: boolean, onLinkClick?: () => void }) {
    const [isOpen, setIsOpen] = useState(true);
    const hasTitle = !!section.title;

    // Filter items first
    const visibleItems = section.items.filter(item => item.roles.includes(role));
    if (visibleItems.length === 0) return null;

    return (
        <div className="space-y-1">
            {hasTitle && (
                <div
                    className="flex items-center justify-between px-3 py-2 text-xs font-bold text-sidebar-foreground/50 uppercase tracking-wider cursor-pointer hover:text-primary transition-colors select-none"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span>{section.title}</span>
                    <ChevronDown className={cn("h-3 w-3 transition-transform", !isOpen && "transform -rotate-90 rtl:rotate-90")} />
                </div>
            )}

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-0.5"
                    >
                        {visibleItems.map(item => (
                            <NavItemLink key={item.href} item={item} plan={plan} onClick={onLinkClick} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function NavItemLink({ item, plan, onClick }: { item: NavItem, plan: string, onClick?: () => void }) {
    const pathname = usePathname();
    const currentPlanLevel = PLAN_LEVELS[plan] || 0;
    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
    const isLocked = (PLAN_LEVELS[item.minPlan] || 0) > currentPlanLevel;

    return (
        <Link
            href={isLocked ? `/dashboard/settings/billing?upgrade=${item.minPlan}` : item.href}
            onClick={onClick}
            className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 relative",
                isActive
                    ? "bg-sidebar-primary/10 text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                isLocked && "opacity-60"
            )}
        >
            <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-sidebar-primary" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground")} />
            <span className="flex-1 truncate">{item.label}</span>
            {isLocked && <Lock className="h-3 w-3 opacity-50 ml-auto" />}
            {isActive && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-primary rounded-r-full rtl:rounded-r-none rtl:rounded-l-full rtl:left-auto rtl:right-0" />
            )}
        </Link>
    );
}
