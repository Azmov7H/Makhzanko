import { getDashboardChartData } from "@/actions/reports";
import DashboardChartsClient from "./DashboardChartsClient";

export async function DashboardCharts() {
    const { revenueData, userGrowthData } = await getDashboardChartData();
    return <DashboardChartsClient revenueData={revenueData} userGrowthData={userGrowthData} />;
}

