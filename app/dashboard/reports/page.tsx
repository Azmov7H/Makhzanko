"use client";

import { useEffect, useState } from "react";
import { ReportsClient } from "./_components/ReportsClient";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthToken } from "@/lib/auth/AuthContext";

export default function ReportsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const token = getAuthToken();
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/full`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const reportsData = await res.json();
                    setData(reportsData);
                }
            } catch (error) {
                console.error("Failed to fetch reports:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
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
