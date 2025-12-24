import { Toaster } from "@/components/ui/toaster";
import { ChatBot } from "@/components/chatbot/ChatBot";
import { Suspense } from "react";
import { DashboardAnnouncements } from "./_components/DashboardAnnouncements";
import { DashboardTrialBanner } from "./_components/DashboardTrialBanner";
import { DashboardSidebarWrapper } from "./_components/DashboardSidebarWrapper";
import { DashboardHeaderWrapper } from "./_components/DashboardHeaderWrapper";

export default async function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
            <Suspense fallback={<div className="hidden lg:block w-64 border-r bg-muted/10 h-screen sticky top-0" />}>
                <DashboardSidebarWrapper locale={locale} />
            </Suspense>
            <div className="flex flex-col relative w-full overflow-hidden">
                <Suspense fallback={<div className="h-16 border-b bg-card/60 backdrop-blur-xl w-full" />}>
                    <DashboardHeaderWrapper locale={locale} />
                </Suspense>

                <Suspense fallback={null}>
                    <DashboardAnnouncements locale={locale} />
                </Suspense>

                <Suspense fallback={null}>
                    <DashboardTrialBanner locale={locale} />
                </Suspense>

                <main className="flex flex-1 flex-col gap-8 p-6 lg:p-10 bg-background/50 relative min-h-[calc(100vh-64px)]">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none select-none overflow-hidden" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[100px] -z-10 pointer-events-none select-none overflow-hidden" />
                    {children}
                </main>
            </div>
            <Toaster />
            <ChatBot locale={locale as "en" | "ar"} />
        </div>
    );
}
