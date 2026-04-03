import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { LowStockAlert } from "./_components/LowStockAlert";
import { DashboardClient } from "./DashboardClient";
import { AnnouncementSection } from "./_components/AnnouncementSection";
import { DemandForecastSection } from "./_components/DemandForecastSection";

export default function DashboardLandingPage() {
    return (
        <div className="space-y-12 text-start px-0">
            <DashboardClient />

            <Suspense fallback={<Skeleton className="h-32 w-full rounded-xl" />}>
                <AnnouncementSection />
            </Suspense>

            <div className="grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-7">
                    <LowStockAlert />
                </div>
                <div className="lg:col-span-5">
                    <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-xl" />}>
                        <DemandForecastSection />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
