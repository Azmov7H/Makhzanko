"use client";

import { Loader2 } from "lucide-react";
import dynamic from 'next/dynamic';
import { Card, CardContent } from "@/components/ui/card";

const ChartsContent = dynamic(() => import('./ChartsContent'), {
    ssr: false,
    loading: () => (
        <div className="grid gap-6 md:grid-cols-2">
            <Card className="h-[400px] flex items-center justify-center">
                <CardContent>
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </CardContent>
            </Card>
            <Card className="h-[400px] flex items-center justify-center">
                <CardContent>
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </CardContent>
            </Card>
        </div>
    ),
});

interface DashboardChartsClientProps {
    revenueData: any[];
    userGrowthData: any[];
}

export default function DashboardChartsClient({ revenueData, userGrowthData }: DashboardChartsClientProps) {
    return <ChartsContent revenueData={revenueData} userGrowthData={userGrowthData} />;
}
