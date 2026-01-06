import { Toaster } from "@/components/ui/toaster";
import { ChatBot } from "@/components/chatbot/ChatBot";
import { Suspense } from "react";
import { DashboardAnnouncements } from "./_components/DashboardAnnouncements";
import { DashboardTrialBanner } from "./_components/DashboardTrialBanner";
import { DashboardSidebarWrapper } from "./_components/DashboardSidebarWrapper";
import { DashboardHeaderWrapper } from "./_components/DashboardHeaderWrapper";
import { getLocale } from "@/lib/i18n/server";

import { SidebarProvider } from "@/components/layout/SidebarContext";
import { DashboardContainer } from "./_components/DashboardContainer";
import { TrialLock } from "./_components/TrialLock";
import { getTrialStatus } from "@/lib/trial-check";
import { getTenantContext } from "@/lib/auth";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const context = await getTenantContext();
    const trialStatus = await getTrialStatus(context.tenantId);
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
                trialBanner={
                    <Suspense fallback={null}>
                        <DashboardTrialBanner />
                    </Suspense>
                }
            >
                {children}
            </DashboardContainer>
            <TrialLock isExpired={trialStatus.isExpired} locale={locale} />
        </SidebarProvider>
    );
}
