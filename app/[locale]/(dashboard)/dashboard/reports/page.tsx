import { getSalesReport, getInventoryValuation, getBestSellingProducts } from "@/actions/reports";
import { checkPlanAccess } from "@/lib/plan-access";
import { getTenantContext } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export default async function ReportsPage() {
    const context = await getTenantContext();

    await checkPlanAccess(context.tenantId, "reports");

    const valuation = await getInventoryValuation();
    const bestSellers = await getBestSellingProducts();
    const sales = await getSalesReport("30days"); // Default

    const totalRevenue = sales?.reduce((sum, s) => sum + Number(s.total), 0) || 0;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Analytics & Reports</h1>
                <p className="text-muted-foreground text-sm">Key metrics for your business.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue (30d)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            {sales?.length} transactions
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inventory Val.</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${valuation?.totalValue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            {valuation?.totalItems} items in stock
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Sales Trend</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                        {/* Placeholder for Chart */}
                        Line Chart showing sales over time would go here.
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Best Sellers</CardTitle>
                        <CardDescription>Top 5 products by quantity.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {bestSellers.map((item, i) => (
                                <div key={i} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{item.name}</p>
                                    </div>
                                    <div className="ml-auto font-medium">{item.quantity} sold</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
