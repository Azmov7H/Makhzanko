"use client";

import { useCustomers } from "@/hooks/useCustomers";
import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import { CustomerDetails } from "../_components/CustomerDetails";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerViewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { getCustomerById, getCustomerStats } = useCustomers();
    const [loading, setLoading] = useState(true);
    const [customer, setCustomer] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const [c, st] = await Promise.all([
                    getCustomerById(id),
                    getCustomerStats(id)
                ]);
                if (!c) {
                    setError(true);
                } else {
                    setCustomer(c);
                    setStats(st);
                }
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id, getCustomerById, getCustomerStats]);

    if (error) notFound();

    if (loading || !customer || !stats) {
        return (
            <div className="space-y-8 max-w-7xl mx-auto py-12 px-4 shadow-2xl rounded-[3rem] bg-card/40 backdrop-blur-3xl animate-pulse">
                <div className="flex gap-4 items-center">
                    <Skeleton className="h-12 w-12 rounded-2xl" />
                    <Skeleton className="h-12 w-64 rounded-2xl" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton className="h-32 rounded-[2.5rem]" />
                    <Skeleton className="h-32 rounded-[2.5rem]" />
                    <Skeleton className="h-32 rounded-[2.5rem]" />
                </div>
                <Skeleton className="h-[400px] rounded-[3rem]" />
            </div>
        );
    }

    return <CustomerDetails customer={customer} stats={stats} />;
}
