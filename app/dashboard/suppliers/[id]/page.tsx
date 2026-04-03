"use client";

import { useSuppliers } from "@/hooks/useSuppliers";
import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import SupplierDetails from "../_components/SupplierDetails";
import { Skeleton } from "@/components/ui/skeleton";

export default function SupplierPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { getSupplierById, getSupplierStats } = useSuppliers();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const [s, st] = await Promise.all([
                    getSupplierById(id),
                    getSupplierStats(id)
                ]);
                if (!s) {
                    setError(true);
                } else {
                    setData(s);
                    setStats(st);
                }
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id, getSupplierById, getSupplierStats]);

    if (error) notFound();
    
    if (loading || !data || !stats) {
        return (
            <div className="space-y-8 max-w-7xl mx-auto">
                <div className="flex gap-4 items-center">
                    <Skeleton className="h-12 w-12 rounded-2xl" />
                    <Skeleton className="h-12 w-64" />
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

    return <SupplierDetails supplier={data} stats={stats} />;
}
