"use client";

import { useEffect, useState } from "react";
import { ReportsClient } from "./_components/ReportsClient";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Replace with REST API call
        // fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/full`)
        //     .then(res => res.json())
        //     .then(data => {
        //         setData(data);
        //         setLoading(false);
        //     })
        //     .catch(() => setLoading(false));
        
        setLoading(false);
    }, []);

    if (loading) return <div className="p-12 space-y-8"><Skeleton className="h-20 w-1/3" /><Skeleton className="h-[400px] w-full" /></div>;

    return (
        <ReportsClient
            sales={data?.sales || []}
            valuation={data?.valuation || { totalValue: 0, totalItems: 0 }}
            bestSellers={data?.bestSellers || []}
            chartData={data?.chartData || { revenueData: [] }}
        />
    );
}
