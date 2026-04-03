"use client";

import { useSuppliers } from "@/hooks/useSuppliers";
import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import { SupplierForm } from "../../_components/SupplierForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditSupplierPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { getSupplierById } = useSuppliers();
    const [loading, setLoading] = useState(true);
    const [supplier, setSupplier] = useState<any>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const s = await getSupplierById(id);
                if (!s) {
                    setError(true);
                } else {
                    setSupplier(s);
                }
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id, getSupplierById]);

    if (error) notFound();

    if (loading || !supplier) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
                <Skeleton className="h-20 w-full rounded-2xl" />
                <Skeleton className="h-[500px] w-full rounded-[2.5rem]" />
            </div>
        );
    }

    return <SupplierForm supplier={supplier} />;
}
