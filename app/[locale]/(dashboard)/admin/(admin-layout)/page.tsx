import { requireOwner } from "@/lib/auth-role";
import { getOwnerAnalytics, getPlatformChartData } from "@/actions/admin/analytics";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboardPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    await requireOwner();

    // Fetch all required data on the server
    const [analytics, chartData] = await Promise.all([
        getOwnerAnalytics(),
        getPlatformChartData() // Use platform-wide charts
    ]);

    return (
        <AdminDashboardClient
            analytics={analytics}
            chartData={chartData}
            locale={locale}
        />
    );
}
