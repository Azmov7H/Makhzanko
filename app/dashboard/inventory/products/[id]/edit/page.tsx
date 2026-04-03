"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAuthToken } from "@/lib/auth/AuthContext";
import EditProductPage from "../../_components/EditProductPage";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
    const params = useParams();
    const id = params.id as string;
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        
        // TODO: Replace with REST API call
        // const token = getAuthToken();
        // fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, {
        //     headers: { Authorization: `Bearer ${token}` }
        // })
        // .then(res => res.json())
        // .then(data => {
        //     setProduct(data);
        //     setLoading(false);
        // })
        // .catch(() => setLoading(false));

        setLoading(false);
    }, [id]);

    if (loading) return <div className="p-12 space-y-8"><Skeleton className="h-20 w-1/3" /><Skeleton className="h-[600px] w-full" /></div>;

    if (!product) {
        // Placeholder for build stability
        return <EditProductPage product={{ id, name: "...", sku: "...", price: 0, cost: 0, minStock: 0 }} />;
    }

    return <EditProductPage product={product} />;
}
