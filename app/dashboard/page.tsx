import { getTenantContext } from "@/lib/auth";
import { getLocale } from "@/lib/i18n/server";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { LowStockAlert } from "./_components/LowStockAlert";
import { DashboardClient } from "./DashboardClient";
import { prisma } from "@/lib/prisma";
import { getI18n } from "@/lib/i18n/server";
import { AnnouncementSection } from "./_components/AnnouncementSection";
import { DemandForecastSection } from "./_components/DemandForecastSection";
import { getInventoryAlerts } from "@/actions/reports";

export default async function DashboardLandingPage() {
    const locale = await getLocale();
    await getTenantContext();

    return (
        <div className="space-y-12 text-start">
            <DashboardClient />

            <Suspense fallback={<Skeleton className="h-32 w-full rounded-xl" />}>
                <AnnouncementWrapper locale={locale as "en" | "ar"} />
            </Suspense>

            <div className="grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-7">
                    <LowStockAlert />
                </div>
                <div className="lg:col-span-5">
                    <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-xl" />}>
                        <DemandForecastWrapper locale={locale as "en" | "ar"} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

// Logic Wrappers for components not yet fully migrated to client hooks
async function AnnouncementWrapper({ locale }: { locale: "en" | "ar" }) {
    const t = await getI18n(locale);
    const announcement = await prisma.announcement.findFirst({
        where: {
            isActive: true,
            OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }]
        },
        orderBy: { createdAt: 'desc' }
    });
    return <AnnouncementSection announcement={announcement} t={t} />;
}

async function DemandForecastWrapper({ locale }: { locale: "en" | "ar" }) {
    const alerts = await getInventoryAlerts();
    const t = await getI18n(locale);
    return <DemandForecastSection alerts={alerts} t={t} />;
}


function StatsSkeleton() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
        </div>
    );
}
