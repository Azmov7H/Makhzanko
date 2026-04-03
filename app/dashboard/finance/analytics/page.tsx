"use client";

import { useEffect, useState } from "react";
import AdvancedAnalyticsClient from "./AdvancedAnalyticsClient";
import { useI18n } from "@/lib/i18n/context";
import { getAuthToken } from "@/lib/auth/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdvancedAnalyticsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = getAuthToken();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/finance/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const analyticsData = await res.json();
          setData(analyticsData);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <AnalyticsSkeleton />;

  return (
    <AdvancedAnalyticsClient
      params={params}
      data={data}
    />
  );
}

function AnalyticsSkeleton() {
    return (
        <div className="space-y-10 py-12 px-4 max-w-7xl mx-auto animate-pulse">
            <Skeleton className="h-12 w-1/3 rounded-xl" />
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-40 rounded-[2rem]" />
                <Skeleton className="h-40 rounded-[2rem]" />
                <Skeleton className="h-40 rounded-[2rem]" />
            </div>
            <Skeleton className="h-[500px] w-full rounded-[2.5rem]" />
        </div>
    );
}
