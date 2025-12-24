"use client";

import { LocaleLink as Link } from "@/components/ui/LocaleLink";
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
    Shield,
    HelpCircle,
    Lock,
    Users,
    History,
    FileBarChart,
    PieChart,
    Wallet,
    Undo2,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./Toggel";

const NAV_ITEMS = (t: any, role: string) => {
    const items = [
        { label: t("Dashboard.dashboard"), href: "/dashboard", icon: LayoutDashboard, roles: ["OWNER", "MANAGER", "STAFF"], minPlan: "FREE" },
        { label: t("Dashboard.products"), href: "/dashboard/inventory/products", icon: Package, roles: ["OWNER", "MANAGER", "STAFF"], minPlan: "FREE" },
        { label: t("Dashboard.warehouses"), href: "/dashboard/inventory/warehouses", icon: Warehouse, roles: ["OWNER", "MANAGER"], minPlan: "PRO" },
        { label: t("Dashboard.sales"), href: "/dashboard/sales-flow/sales", icon: ShoppingCart, roles: ["OWNER", "STAFF", "MANAGER"], minPlan: "FREE" },
        { label: t("Dashboard.returns"), href: "/dashboard/sales-flow/returns", icon: Undo2, roles: ["OWNER", "MANAGER", "STAFF"], minPlan: "PRO" },
        { label: t("Dashboard.purchases"), href: "/dashboard/finance/purchases", icon: Truck, roles: ["OWNER", "MANAGER"], minPlan: "PRO" },
        { label: t("Dashboard.invoices"), href: "/dashboard/sales-flow/invoices", icon: FileText, roles: ["OWNER", "STAFF", "MANAGER"], minPlan: "FREE" },
        { label: t("Dashboard.expenses"), href: "/dashboard/finance/expenses", icon: Receipt, roles: ["OWNER", "MANAGER"], minPlan: "PRO" },
        { label: t("Dashboard.accounting"), href: "/dashboard/finance/accounting", icon: Calculator, roles: ["OWNER"], minPlan: "BUSINESS" },
        { label: t("Dashboard.treasury"), href: "/dashboard/finance/accounting/treasury", icon: Wallet, roles: ["OWNER", "MANAGER"], minPlan: "BUSINESS" },
        { label: t("Dashboard.reports"), href: "/dashboard/finance/reports", icon: BarChart3, roles: ["OWNER", "MANAGER"], minPlan: "PRO" },
        { label: t("Dashboard.advanced_analytics"), href: "/dashboard/finance/analytics", icon: PieChart, roles: ["OWNER"], minPlan: "BUSINESS" },
        { label: t("Dashboard.users"), href: "/dashboard/settings/users", icon: Users, roles: ["OWNER"], minPlan: "BUSINESS" },
        { label: t("Dashboard.user_menu.support"), href: "/dashboard/contact", icon: HelpCircle, roles: ["OWNER", "MANAGER", "STAFF"], minPlan: "FREE" },
        { label: t("Dashboard.settings"), href: "/dashboard/settings", icon: Settings, roles: ["OWNER", "MANAGER", "STAFF"], minPlan: "FREE" },
    ];

    return items.filter(item => item.roles.includes(role));
};

const PLAN_LEVELS: Record<string, number> = {
    "FREE": 0,
    "PRO": 1,
    "BUSINESS": 2
};

export function Sidebar({ role, plan }: { role: string; plan: string }) {
    const { t } = useI18n();
    const items = NAV_ITEMS(t, role);

    return (
        <aside className="hidden border-e bg-card/50 backdrop-blur-xl lg:block lg:w-64 transition-all duration-300 shadow-2xl shadow-primary/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary animate-gradient" />
            <div className="flex h-full max-h-screen flex-col gap-2 relative z-10">
                <div className="flex h-[70px] items-center px-6">
                    <Link className="flex items-center gap-3 font-bold text-xl group" href="/dashboard">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/20 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                            <Package className="h-6 w-6" />
                        </div>
                        <span className="font-tajawal tracking-tighter bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent group-hover:tracking-normal transition-all duration-300">
                            {t("Dashboard.brand_name")}
                        </span>
                    </Link>
                </div>
                <div className="flex-1 overflow-auto py-6">
                    <NavContent items={items} plan={plan} />
                </div>
                <div className="p-4 mt-auto border-t border-primary/5 bg-muted/50 backdrop-blur-md">
                    <ThemeToggle />
                </div>
            </div>
        </aside>
    );
}

export function MobileSidebar({ role, plan }: { role: string; plan: string }) {
    const { t } = useI18n();
    const items = NAV_ITEMS(t, role);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0 lg:hidden hover:bg-primary/10 rounded-xl transition-colors">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">{t("Dashboard.menu")}</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col w-72 bg-card/95 backdrop-blur-2xl p-0 border-l border-primary/10">
                <div className="flex h-[70px] items-center border-b border-primary/5 px-6">
                    <Link href="/dashboard" className="flex items-center gap-3 font-bold text-xl">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/20">
                            <Package className="h-6 w-6" />
                        </div>
                        <span className="font-tajawal tracking-tighter">{t("Dashboard.brand_name")}</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-auto py-6 px-4">
                    <NavContent items={items} plan={plan} mobileView />
                </div>
            </SheetContent>
        </Sheet>
    );
}

function NavContent({ items, plan, mobileView = false }: { items: any[], plan: string, mobileView?: boolean }) {
    const pathname = usePathname();
    const currentPlanLevel = PLAN_LEVELS[plan] || 0;

    return (
        <nav className={cn("grid items-start gap-1 font-medium", mobileView ? "" : "px-4")}>
            {items.map((item) => {
                const isActive = pathname.endsWith(item.href) || (item.href !== '/dashboard' && pathname.includes(item.href));
                const isLocked = (PLAN_LEVELS[item.minPlan] || 0) > currentPlanLevel;

                return (
                    <Link
                        key={item.href}
                        href={isLocked ? `/${pathname.split('/')[1]}/dashboard/settings/billing?upgrade=${item.minPlan}` : item.href}
                        className={cn(
                            "group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition-all duration-300 relative overflow-hidden",
                            isActive
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-primary/5 hover:text-foreground hover:translate-x-1",
                            isLocked && "opacity-60 grayscale-[0.8]"
                        )}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="active-nav"
                                className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <div className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 shadow-sm",
                            isActive
                                ? "bg-primary text-primary-foreground shadow-primary/20 scale-110"
                                : "bg-muted/50 text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary group-hover:shadow-md"
                        )}>
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                        </div>
                        <span className="flex-1 truncate">{item.label}</span>
                        {isLocked && (
                            <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                <Lock className="h-3.5 w-3.5" />
                                <span className="text-[9px] font-black uppercase tracking-tighter bg-muted px-2 py-0.5 rounded-lg border border-primary/5">
                                    {item.minPlan}
                                </span>
                            </div>
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
