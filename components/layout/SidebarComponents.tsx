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
    PieChart,
    Wallet,
    Undo2,
    ChevronDown,
    User,
    Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export interface NavItem {
    label: string;
    href: string;
    icon: any;
    roles: string[];
}

export interface NavSection {
    title?: string;
    items: NavItem[];
}

export const NAV_SECTIONS = (t: any, role: string): NavSection[] => [
    {
        items: [
            { label: t("Dashboard.dashboard"), href: "/dashboard", icon: LayoutDashboard, roles: ["OWNER", "MANAGER", "STAFF"] },
        ]
    },
    {
        title: t("Dashboard.inventory"),
        items: [
            { label: t("Dashboard.products"), href: "/dashboard/inventory/products", icon: Package, roles: ["OWNER", "MANAGER", "STAFF"] },
            { label: t("Dashboard.warehouses"), href: "/dashboard/inventory/warehouses", icon: Warehouse, roles: ["OWNER", "MANAGER"] },
        ]
    },
    {
        title: t("Dashboard.sales"),
        items: [
            { label: t("Dashboard.sales"), href: "/dashboard/sales-flow/sales", icon: ShoppingCart, roles: ["OWNER", "STAFF", "MANAGER"] },
            { label: t("Dashboard.invoices"), href: "/dashboard/sales-flow/invoices", icon: FileText, roles: ["OWNER", "STAFF", "MANAGER"] },
            { label: t("Dashboard.returns"), href: "/dashboard/sales-flow/returns", icon: Undo2, roles: ["OWNER", "MANAGER", "STAFF"] },
        ]
    },
    {
        title: t("Dashboard.finance"),
        items: [
            { label: t("Dashboard.suppliers"), href: "/dashboard/suppliers", icon: Truck, roles: ["OWNER", "MANAGER"] },
            { label: t("Dashboard.debts") || "Debt & Installments", href: "/dashboard/finance/debts", icon: Clock, roles: ["OWNER", "MANAGER"] },
            { label: t("Dashboard.purchases"), href: "/dashboard/finance/purchases", icon: Truck, roles: ["OWNER", "MANAGER"] },
            { label: t("Dashboard.expenses"), href: "/dashboard/finance/expenses", icon: Receipt, roles: ["OWNER", "MANAGER"] },
            { label: t("Dashboard.accounting"), href: "/dashboard/finance/accounting", icon: Calculator, roles: ["OWNER"] },
            { label: t("Dashboard.treasury"), href: "/dashboard/finance/accounting/treasury", icon: Wallet, roles: ["OWNER", "MANAGER"] },
        ]
    },
    {
        title: t("Dashboard.reports"),
        items: [
            { label: t("Dashboard.reports"), href: "/dashboard/finance/reports", icon: BarChart3, roles: ["OWNER", "MANAGER"] },
            { label: t("Dashboard.advanced_analytics"), href: "/dashboard/finance/analytics", icon: PieChart, roles: ["OWNER"] },
        ]
    },
    {
        title: t("Dashboard.system"),
        items: [
            { label: t("Dashboard.users"), href: "/dashboard/users", icon: Users, roles: ["OWNER"] },
            { label: t("Dashboard.settings"), href: "/dashboard/settings", icon: Settings, roles: ["OWNER", "MANAGER", "STAFF"] },
            { label: t("Dashboard.user_menu.support"), href: "/dashboard/contact", icon: HelpCircle, roles: ["OWNER", "MANAGER", "STAFF"] },
        ]
    }
];

export function MobileSidebar({ role }: { role: string }) {
    const { t, locale } = useI18n();
    const sections = NAV_SECTIONS(t, role);
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0 lg:hidden hover:bg-primary/10 rounded-xl">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side={locale === "ar" ? "right" : "left"} className="flex flex-col w-[300px] p-0 bg-sidebar-background">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
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
                        <NavSection key={index} section={section} role={role} mobile onLinkClick={() => setOpen(false)} />
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

export function NavSection({ section, role, mobile, onLinkClick, isCollapsed }: { section: NavSection, role: string, mobile?: boolean, onLinkClick?: () => void, isCollapsed?: boolean }) {
    const [isOpen, setIsOpen] = useState(true);
    const hasTitle = !!section.title;

    // Filter items first
    const visibleItems = section.items.filter(item => item.roles.includes(role));
    if (visibleItems.length === 0) return null;

    return (
        <div className="space-y-1">
            {hasTitle && !isCollapsed && (
                <div
                    className="flex items-center justify-between px-3 py-3 text-xs font-bold text-foreground/40 uppercase tracking-[0.2em] cursor-pointer hover:text-primary transition-colors select-none min-h-[44px] md:min-h-0 md:py-2 md:tracking-widest"
                    style={{ fontFamily: "var(--font-amiri), serif" }}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="text-sm">{section.title}</span>
                    <ChevronDown className={cn("h-3 w-3 transition-transform", !isOpen && "transform -rotate-90 rtl:rotate-90")} />
                </div>
            )}

            {hasTitle && isCollapsed && (
                <div className="h-px bg-sidebar-border/50 my-4 mx-2" />
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
                            <NavItemLink key={item.href} item={item} onClick={onLinkClick} isCollapsed={isCollapsed} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function NavItemLink({ item, onClick, isCollapsed }: { item: NavItem, onClick?: () => void, isCollapsed?: boolean }) {
    const pathname = usePathname();
    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

    return (
        <div className="relative group/tooltip">
            <Link
                href={item.href}
                onClick={onClick}
                className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-3 md:py-2.5 text-sm font-bold transition-all duration-300 relative mx-1 min-h-[44px] md:min-h-0",
                    isActive
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                )}
            >
                <div className={cn(
                    "relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110",
                    isActive && "text-primary"
                )}>
                    <item.icon className="h-5 w-5 stroke-[1.5]" />
                    {isActive && (
                        <motion.div
                            layoutId="activeGlow"
                            className="absolute -inset-2 bg-primary/20 blur-lg rounded-full -z-10"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                </div>
                
                {!isCollapsed && (
                    <motion.span 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 truncate"
                    >
                        {item.label}
                    </motion.span>
                )}

                {isActive && (
                    <motion.div 
                        layoutId="activeBar"
                        className={cn(
                            "absolute start-0 w-1 bg-primary rounded-full",
                            isCollapsed ? "top-2 bottom-2" : "top-3 bottom-3"
                        )}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                )}
            </Link>

            {/* Simple Tooltip for Collapsed State */}
            {isCollapsed && (
                <div className="absolute start-full ms-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-foreground text-background text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-300 whitespace-nowrap z-[100] shadow-xl translate-x-[-10px] group-hover/tooltip:translate-x-0">
                    <div className="absolute start-0 top-1/2 -translate-y-1/2 -translate-x-full border-4 border-transparent border-e-foreground" />
                    {item.label}
                </div>
            )}
        </div>
    );
}
