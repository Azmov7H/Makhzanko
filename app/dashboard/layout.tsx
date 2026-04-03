import { Toaster } from "@/components/ui/toaster";
import { ChatBot } from "@/components/chatbot/ChatBot";
import { Suspense } from "react";
import { DashboardAnnouncements } from "./_components/DashboardAnnouncements";
import { DashboardSidebarWrapper } from "./_components/DashboardSidebarWrapper";
import { DashboardHeaderWrapper } from "./_components/DashboardHeaderWrapper";
import { getLocale } from "@/lib/i18n/server";

import { SidebarProvider } from "@/components/layout/SidebarContext";
import { DashboardContainer } from "./_components/DashboardContainer";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const locale = await getLocale();

    return (
        <SidebarProvider>
            <DashboardContainer
                locale={locale as "en" | "ar"}
                sidebar={
                    <Suspense fallback={<div className="h-screen bg-card" />}>
                        <DashboardSidebarWrapper />
                    </Suspense>
                }
                header={
                    <Suspense fallback={<div className="h-16 border-b bg-background" />}>
                        <DashboardHeaderWrapper />
                    </Suspense>
                }
                announcements={
                    <Suspense fallback={null}>
                        <DashboardAnnouncements />
                    </Suspense>
                }
            >
                {children}
            </DashboardContainer>
        </SidebarProvider>
    );
}
