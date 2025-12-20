"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
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



const NAV_ITEMS = (t: any) => [
    { label: t("dashboard"), href: "/dashboard", icon: LayoutDashboard },
    { label: t("products"), href: "/dashboard/products", icon: Package },
    { label: t("warehouses"), href: "/dashboard/warehouses", icon: Warehouse },
    { label: t("sales"), href: "/dashboard/sales", icon: ShoppingCart },
    { label: t("purchases"), href: "/dashboard/purchases", icon: Truck },
    { label: t("invoices"), href: "/dashboard/invoices", icon: FileText },
    { label: t("expenses"), href: "/dashboard/expenses", icon: Receipt },
    { label: t("accounting"), href: "/dashboard/accounting", icon: Calculator },
    { label: t("reports"), href: "/dashboard/reports", icon: BarChart3 },
    { label: t("settings"), href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
    const t = useTranslations("Dashboard");
    const items = NAV_ITEMS(t);

    return (
        <aside className="hidden border-e bg-sidebar lg:block lg:w-64 transition-colors">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-[60px] items-center border-b border-sidebar-border px-6">
                    <Link className="flex items-center gap-2 font-bold text-lg" href="/dashboard">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Package className="h-5 w-5" />
                        </div>
                        <span className="font-tajawal">{t("brand_name")}</span>
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

export function MobileSidebar() {
    const t = useTranslations("Dashboard");
    const items = NAV_ITEMS(t);

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
                        <span className="font-tajawal">{t("brand_name")}</span>
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
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

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


