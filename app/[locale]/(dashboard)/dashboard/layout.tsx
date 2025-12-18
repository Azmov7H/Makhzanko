import { Sidebar, MobileSidebar } from "@/components/layout/Sidebar";
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
import { getTenantContext } from "@/lib/auth";
import { db } from "@/lib/db";
import { Toaster } from "@/components/ui/toaster";
import { logoutAction } from "@/actions/auth";
import { Link } from "@/i18n/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const context = await getTenantContext();

    const tenant = await db.tenant.findUnique({
        where: { id: context.tenantId },
        select: { name: true, plan: true }
    });

    const tenantName = tenant?.name || "شركتك";
    const plan = tenant?.plan || "FREE";

    const planNameMap: Record<string, string> = {
        FREE: "مجاني",
        PRO: "احترافي",
        BUSINESS: "أعمال",
    };

    const planColors: Record<string, string> = {
        FREE: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
        PRO: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        BUSINESS: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    };

    return (
        <>
            <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
                <Sidebar />
                <div className="flex flex-col">
                    <header className="flex h-14 items-center gap-4 border-b bg-card px-6 lg:h-[60px] transition-colors">
                        <MobileSidebar />
                        <div className="w-full flex-1 flex items-center gap-3">
                            <span className="font-semibold text-foreground">{tenantName}</span>
                            <Badge variant="outline" className={planColors[plan]}>
                                {planNameMap[plan]}
                            </Badge>
                        </div>
                        {context.role === "OWNER" && (
                            <Link href="/owner">
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <Shield className="h-4 w-4" />
                                    <span className="hidden sm:inline">لوحة المالك</span>
                                </Button>
                            </Link>
                        )}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <CircleUser className="h-5 w-5" />
                                    <span className="sr-only">قائمة المستخدم</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>حسابي</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/settings" className="flex items-center gap-2 cursor-pointer">
                                        <Settings className="h-4 w-4" />
                                        <span>الإعدادات</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/settings/billing" className="flex items-center gap-2 cursor-pointer">
                                        <Settings className="h-4 w-4" />
                                        <span>الاشتراك والفوترة</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <HelpCircle className="h-4 w-4 ml-2" />
                                    <span>الدعم</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <form action={logoutAction}>
                                    <DropdownMenuItem asChild>
                                        <button type="submit" className="flex w-full items-center gap-2 cursor-pointer text-destructive">
                                            <LogOut className="h-4 w-4" />
                                            <span>تسجيل الخروج</span>
                                        </button>
                                    </DropdownMenuItem>
                                </form>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </header>
                    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background transition-colors">
                        {children}
                    </main>
                </div>
            </div>
            <Toaster />
        </>
    );
}
