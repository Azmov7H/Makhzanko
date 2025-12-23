import { requireOwner } from "@/lib/auth-role";
import { getOwnerAnalytics, getPlatformChartData } from "@/actions/admin/analytics";
import AdminDashboardClient from "./AdminDashboardClient";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function AdminDashboardPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <Suspense fallback={<AdminDashboardSkeleton />}>
            <AdminDashboardContent locale={locale} />
        </Suspense>
    );
}

async function AdminDashboardContent({ locale }: { locale: string }) {
    await requireOwner();

    const [analytics, chartData] = await Promise.all([
        getOwnerAnalytics(),
        getPlatformChartData()
    ]);

    return (
        <AdminDashboardClient
            analytics={analytics}
            chartData={chartData}
            locale={locale}
        />
    );
}

function AdminDashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
            </div>
            <Skeleton className="h-[400px] w-full rounded-2xl" />
        </div>
    );
}
