"use client";

import { useEffect, useState } from "react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { WarehousesClient } from "./WarehousesClient";
import { getAuthToken } from "@/lib/auth/AuthContext";

export default function WarehousesPage() {
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWarehouses = async () => {
            try {
                const token = getAuthToken();
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/warehouses`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setWarehouses(data);
                }
            } catch (error) {
                console.error("Failed to fetch warehouses:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWarehouses();
    }, []);

    if (loading) return <WarehousesSkeleton />;

    return (
        <div className="max-w-7xl mx-auto pb-20 px-4 sm:px-6 lg:px-8">
            <WarehousesClient
                warehouses={warehouses}
            />
        </div>
    );
}

function WarehousesSkeleton() {
    return (
        <div className="space-y-12 text-start max-w-7xl mx-auto pb-20 px-4 sm:px-6 lg:px-8 animate-pulse">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-4">
                    <Skeleton className="h-14 w-80 rounded-[1.5rem]" />
                    <Skeleton className="h-6 w-[32rem] rounded-xl opacity-50" />
                </div>
                <Skeleton className="h-14 w-full md:w-48 rounded-2xl" />
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-64 w-full rounded-[2.5rem] shadow-xl" />
                <Skeleton className="h-64 w-full rounded-[2.5rem] shadow-xl" />
                <Skeleton className="h-64 w-full rounded-[2.5rem] shadow-xl" />
            </div>
        </div>
    );
}
