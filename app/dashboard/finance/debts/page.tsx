"use client";

import { useEffect, useState } from "react";
import { DebtDashboardClient } from "./_components/DebtDashboardClient";
import { getAuthToken } from "@/lib/auth/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
    const [installments, setInstallments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInstallments = async () => {
            try {
                const token = getAuthToken();
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/finance/installments/pending`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setInstallments(data);
                }
            } catch (error) {
                console.error("Failed to fetch pending installments:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInstallments();
    }, []);

    if (loading) return <DebtDashboardSkeleton />;

    return <DebtDashboardClient installments={installments} />;
}

function DebtDashboardSkeleton() {
    return (
        <div className="space-y-10 py-12 px-4 max-w-7xl mx-auto animate-pulse">
            <Skeleton className="h-16 w-1/2 rounded-2xl" />
            <div className="grid gap-8 md:grid-cols-3">
                <Skeleton className="h-[200px] rounded-[2.5rem]" />
                <Skeleton className="h-[200px] rounded-[2.5rem]" />
                <Skeleton className="h-[200px] rounded-[2.5rem]" />
            </div>
            <Skeleton className="h-[500px] w-full rounded-[2.5rem]" />
        </div>
    );
}
