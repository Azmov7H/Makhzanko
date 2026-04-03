"use client";

import { useCustomers } from "@/hooks/useCustomers";
import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import CustomerForm from "../../_components/CustomerForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { getCustomerById } = useCustomers();
    const [loading, setLoading] = useState(true);
    const [customer, setCustomer] = useState<any>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const c = await getCustomerById(id);
                if (!c) {
                    setError(true);
                } else {
                    setCustomer(c);
                }
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id, getCustomerById]);

    if (error) notFound();

    if (loading || !customer) {
        return (
            <div className="max-w-3xl mx-auto py-12 px-4 space-y-12 animate-pulse">
                <Skeleton className="h-20 w-full rounded-2xl" />
                <Skeleton className="h-[500px] w-full rounded-[3rem]" />
            </div>
        );
    }

    return <CustomerForm customer={customer} />;
}
