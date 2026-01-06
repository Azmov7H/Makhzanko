"use client";

import { useSidebar } from "@/components/layout/SidebarContext";
import { cn } from "@/lib/cn";
import { Toaster } from "@/components/ui/toaster";
import { ChatBot } from "@/components/chatbot/ChatBot";

interface DashboardContainerProps {
    children: React.ReactNode;
    sidebar: React.ReactNode;
    header: React.ReactNode;
    announcements: React.ReactNode;
    trialBanner: React.ReactNode;
    locale: "en" | "ar";
}

export function DashboardContainer({
    children,
    sidebar,
    header,
    announcements,
    trialBanner,
    locale
}: DashboardContainerProps) {
    const { isCollapsed } = useSidebar();

    return (
        <div className="flex min-h-screen w-full bg-background text-start overflow-hidden">
            <div className={cn(
                "hidden lg:block border-e bg-card h-screen sticky top-0 transition-all duration-300",
                isCollapsed ? "w-[80px]" : "w-[280px]"
            )}>
                {sidebar}
            </div>

            <div className={cn(
                "flex flex-1 flex-col relative w-full overflow-hidden transition-all duration-300",
                isCollapsed ? "lg:ms-[80px]" : "lg:ms-[280px]"
            )}>
                {header}

                <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
                    {announcements}
                    {trialBanner}

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
            <ChatBot locale={locale} />
        </div>
    );
}
