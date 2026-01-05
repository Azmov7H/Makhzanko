import { Toaster } from "@/components/ui/toaster";
import { ChatBot } from "@/components/chatbot/ChatBot";
import { Suspense } from "react";
import { DashboardAnnouncements } from "./_components/DashboardAnnouncements";
import { DashboardTrialBanner } from "./_components/DashboardTrialBanner";
import { DashboardSidebarWrapper } from "./_components/DashboardSidebarWrapper";
import { DashboardHeaderWrapper } from "./_components/DashboardHeaderWrapper";
import { getLocale } from "@/lib/i18n/server";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const locale = await getLocale();

    return (
        <div className="flex min-h-screen w-full bg-background text-start overflow-hidden">
            <Suspense fallback={<div className="hidden lg:block w-[280px] border-e bg-card h-screen sticky top-0" />}>
                <DashboardSidebarWrapper />
            </Suspense>

            <div className="flex flex-1 flex-col relative w-full lg:ms-[280px] overflow-hidden">
                <Suspense fallback={<div className="h-16 border-b bg-background w-full" />}>
                    <DashboardHeaderWrapper />
                </Suspense>

                <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
                    <Suspense fallback={null}>
                        <DashboardAnnouncements />
                    </Suspense>

                    <Suspense fallback={null}>
                        <DashboardTrialBanner />
                    </Suspense>

                    <main className="flex-1 p-4 md:p-6 lg:p-8 relative">
                        {/* Subtle background glow - very low opacity */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/2 rounded-full blur-[120px] -z-10 pointer-events-none" />

                        <div className="max-w-7xl mx-auto space-y-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
            <Toaster />
            <ChatBot locale={locale as "en" | "ar"} />
        </div>
    );
}
