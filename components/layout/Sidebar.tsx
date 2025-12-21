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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./Toggel";

const NAV_ITEMS = (t: any, role: string) => {
    const items = [
        { label: t("Dashboard.dashboard"), href: "/dashboard", icon: LayoutDashboard, roles: ["OWNER", "MANAGER", "STAFF"] },
        { label: t("Dashboard.products"), href: "/dashboard/inventory/products", icon: Package, roles: ["OWNER", "MANAGER", "STAFF"] }, // Staff might need to request
        { label: t("Dashboard.warehouses"), href: "/dashboard/inventory/warehouses", icon: Warehouse, roles: ["OWNER", "MANAGER"] },
        { label: t("Dashboard.sales"), href: "/dashboard/sales-flow/sales", icon: ShoppingCart, roles: ["OWNER", "STAFF", "MANAGER"] },
        { label: t("Dashboard.purchases"), href: "/dashboard/finance/purchases", icon: Truck, roles: ["OWNER", "MANAGER"] },
        { label: t("Dashboard.invoices"), href: "/dashboard/sales-flow/invoices", icon: FileText, roles: ["OWNER", "STAFF", "MANAGER"] },
        { label: t("Dashboard.expenses"), href: "/dashboard/finance/expenses", icon: Receipt, roles: ["OWNER", "MANAGER"] },
        { label: t("Dashboard.accounting"), href: "/dashboard/finance/accounting", icon: Calculator, roles: ["OWNER"] }, // Advanced accounting usually owner
        { label: t("Dashboard.reports"), href: "/dashboard/finance/reports", icon: BarChart3, roles: ["OWNER", "MANAGER"] },
        { label: t("Dashboard.settings"), href: "/dashboard/settings", icon: Settings, roles: ["OWNER", "MANAGER", "STAFF"] },
    ];

    return items.filter(item => item.roles.includes(role));
};

export function Sidebar({ role }: { role: string }) {
    const { t } = useI18n();
    const items = NAV_ITEMS(t, role);

    return (
        <aside className="hidden border-e bg-sidebar lg:block lg:w-64 transition-colors">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-[60px] items-center border-b border-sidebar-border px-6">
                    <Link className="flex items-center gap-2 font-bold text-lg" href="/dashboard">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Package className="h-5 w-5" />
                        </div>
                        <span className="font-tajawal">{t("Dashboard.brand_name")}</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-auto py-4">
                    <NavContent items={items} />
                </div>
                <div className="border-t border-sidebar-border p-4">
                    <ThemeToggle />
                </div>
            </div>
        </aside>
    );
}

export function MobileSidebar({ role }: { role: string }) {
    const { t } = useI18n();
    const items = NAV_ITEMS(t, role);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0 lg:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">{t("title")}</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col w-64 bg-sidebar">
                <div className="flex h-[60px] items-center border-b border-sidebar-border mb-4">
                    <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Package className="h-5 w-5" />
                        </div>
                        <span className="font-tajawal">{t("Dashboard.brand_name")}</span>
                    </Link>
                </div>
                <NavContent items={items} mobileView />
                <div className="mt-auto border-t border-sidebar-border pt-4">
                    <ThemeToggle />
                </div>
            </SheetContent>
        </Sheet>
    );
}

function NavContent({ items, mobileView = false }: { items: any[], mobileView?: boolean }) {
    const pathname = usePathname();

    return (
        <nav className={cn("grid items-start px-3 text-sm font-medium", mobileView ? "gap-1" : "gap-1")}>
            {items.map((item) => {
                const isActive = pathname.endsWith(item.href) || (item.href !== '/dashboard' && pathname.includes(item.href));

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            isActive
                                ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                                : "text-sidebar-foreground/70"
                        )}
                    >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
