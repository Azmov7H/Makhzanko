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
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
    { label: "لوحة التحكم", href: "/dashboard", icon: LayoutDashboard },
    { label: "المنتجات", href: "/dashboard/products", icon: Package },
    { label: "المخازن", href: "/dashboard/warehouses", icon: Warehouse },
    { label: "المبيعات", href: "/dashboard/sales", icon: ShoppingCart },
    { label: "المشتريات", href: "/dashboard/purchases", icon: Truck },
    { label: "الفواتير", href: "/dashboard/invoices", icon: FileText },
    { label: "المصروفات", href: "/dashboard/expenses", icon: Receipt },
    { label: "المحاسبة", href: "/dashboard/accounting", icon: Calculator },
    { label: "التقارير", href: "/dashboard/reports", icon: BarChart3 },
    { label: "الإعدادات", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
    return (
        <aside className="hidden border-r bg-sidebar lg:block lg:w-64 transition-colors">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-[60px] items-center border-b border-sidebar-border px-6">
                    <Link className="flex items-center gap-2 font-bold text-lg" href="/dashboard">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Package className="h-5 w-5" />
                        </div>
                        <span className="font-cairo">مخزنكو</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-auto py-4">
                    <NavContent />
                </div>
                <div className="border-t border-sidebar-border p-4">
                    <ThemeToggle />
                </div>
            </div>
        </aside>
    );
}

export function MobileSidebar() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0 lg:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">القائمة</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col w-64 bg-sidebar">
                <div className="flex h-[60px] items-center border-b border-sidebar-border mb-4">
                    <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Package className="h-5 w-5" />
                        </div>
                        <span className="font-cairo">مخزنكو</span>
                    </Link>
                </div>
                <NavContent mobile />
                <div className="mt-auto border-t border-sidebar-border pt-4">
                    <ThemeToggle />
                </div>
            </SheetContent>
        </Sheet>
    );
}

function NavContent({ mobile = false }: { mobile?: boolean }) {
    const pathname = usePathname();

    return (
        <nav className={cn("grid items-start px-3 text-sm font-medium", mobile ? "gap-1" : "gap-1")}>
            {NAV_ITEMS.map((item) => {
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

function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="h-9 w-9" />;
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-full justify-start gap-3"
        >
            {theme === "dark" ? (
                <>
                    <Sun className="h-4 w-4" />
                    <span>الوضع النهاري</span>
                </>
            ) : (
                <>
                    <Moon className="h-4 w-4" />
                    <span>الوضع الليلي</span>
                </>
            )}
        </Button>
    );
}
