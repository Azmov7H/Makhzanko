import { getSalesReport, getInventoryValuation, getBestSellingProducts, getDashboardChartData } from "@/actions/reports";
import { ReportsClient } from "./_components/ReportsClient";
import { getTenantContext } from "@/lib/auth";

export default async function ReportsPage() {
    const context = await getTenantContext();
    const [sales, valuation, bestSellers, chartData] = await Promise.all([
        getSalesReport("30days"),
        getInventoryValuation(),
        getBestSellingProducts(),
        getDashboardChartData()
    ]);

    return (
        <ReportsClient
            sales={sales}
            valuation={valuation}
            bestSellers={bestSellers}
            chartData={chartData}
        />
    );
}
