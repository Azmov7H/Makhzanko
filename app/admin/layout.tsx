import { getTenantContext } from "@/lib/auth";
import { getLocale, getI18n } from "@/lib/i18n/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Activity, Users, LayoutDashboard, Settings } from "lucide-react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const context = await getTenantContext();
    const locale = await getLocale();
    const t = await getI18n(locale);

    // Strict check for admin/owner role for the platform admin
    if (context.role !== "OWNER") {
        redirect("/dashboard");
    }

    return (
        <div className="flex min-h-screen w-full bg-background text-start overflow-hidden font-sans">
            {/* Admin Sidebar */}
            <aside className="hidden lg:flex flex-col w-[280px] bg-slate-950 text-slate-50 border-e border-slate-900 fixed inset-y-0 z-50 shadow-2xl transition-all duration-300">
                <div className="flex h-16 items-center px-6 border-b border-slate-900">
                    <div className="font-black text-xl tracking-tighter uppercase text-primary italic">Makhzanko Admin</div>
                </div>
                <div className="flex-1 p-6 space-y-8 overflow-y-auto">
                    <div className="space-y-3">
                        <div className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{t("Admin.title")}</div>
                        <nav className="space-y-1">
                            <div className="flex items-center gap-3 bg-primary text-primary-foreground px-4 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 cursor-default">
                                <LayoutDashboard className="h-4 w-4" />
                                {t("Admin.welcome")}
                            </div>
                            <div className="flex items-center gap-3 text-slate-400 hover:text-slate-100 hover:bg-slate-900 px-4 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer group">
                                <Users className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                {t("Admin.total_tenants")}
                            </div>
                            <div className="flex items-center gap-3 text-slate-400 hover:text-slate-100 hover:bg-slate-900 px-4 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer group">
                                <Activity className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                {t("Admin.performance_charts")}
                            </div>
                            <div className="flex items-center gap-3 text-slate-400 hover:text-slate-100 hover:bg-slate-900 px-4 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer group">
                                <Settings className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                {t("Dashboard.settings")}
                            </div>
                        </nav>
                    </div>
                </div>
                <div className="p-4 border-t border-slate-900 bg-slate-900/50">
                    <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer group">
                        <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                            <Users className="h-4 w-4 text-slate-400" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-300">Platform Admin</span>
                            <span className="text-[9px] text-slate-500 uppercase font-black tracking-tighter">Root Session</span>
                        </div>
                    </div>
                </div>
            </aside>

            <div className="flex flex-1 flex-col relative w-full lg:ml-[280px] overflow-hidden">
                <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-md px-6 shadow-sm">
                    <div className="flex-1 font-black text-xl tracking-tighter text-foreground uppercase italic">{t("Admin.subtitle")}</div>
                </header>

                <main className="flex-1 p-4 md:p-6 lg:p-8 relative overflow-y-auto bg-slate-50/30 dark:bg-transparent">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {children}
                    </div>
                </main>
            </div>
            <Toaster />
        </div>
    );
}
