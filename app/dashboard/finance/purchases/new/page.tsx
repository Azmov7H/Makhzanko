"use client";

import { useEffect, useState } from "react";
import PurchaseForm from "./PurchaseForm";
import { getAuthToken } from "@/lib/auth/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewPurchasePage() {
    const [products, setProducts] = useState<any[]>([]);
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = getAuthToken();
                const [pRes, wRes, sRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/warehouses`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/suppliers`, { headers: { Authorization: `Bearer ${token}` } })
                ]);

                if (pRes.ok) setProducts(await pRes.json());
                if (wRes.ok) setWarehouses(await wRes.json());
                if (sRes.ok) setSuppliers(await sRes.json());
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-12 space-y-8"><Skeleton className="h-20 w-1/3" /><Skeleton className="h-[600px] w-full" /></div>;

    return <PurchaseForm products={products} warehouses={warehouses} suppliers={suppliers} />;
}
