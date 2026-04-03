import { useState, useEffect, useCallback } from "react";
import { getAuthToken } from "@/lib/auth/AuthContext";

export function useProducts(page: number, limit: number = 10) {
    const [products, setProducts] = useState<any[]>([]);
    const [totalStock, setTotalStock] = useState(0);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = getAuthToken();
            const baseUrl = process.env.NEXT_PUBLIC_API_URL;
            const res = await fetch(`${baseUrl}/api/products?page=${page}&limit=${limit}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
                
                // Pagination Logic (Rust API simple adaptation)
                if (data.length < limit && page === 1) {
                    setTotalPages(1);
                } else if (data.length === limit) {
                    setTotalPages(page + 1);
                } else {
                    setTotalPages(page);
                }

                const ts = data.reduce((sum: number, p: any) => {
                    return sum + (p.stocks as any[]).reduce((s: number, stock: any) => s + (stock.quantity || 0), 0);
                }, 0);
                setTotalStock(ts);
            } else {
                setError("Failed to fetch products");
            }
        } catch (err) {
            console.error(err);
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }, [page, limit]);

    const deleteProduct = useCallback(async (id: string) => {
        try {
            const token = getAuthToken();
            const baseUrl = process.env.NEXT_PUBLIC_API_URL;
            const res = await fetch(`${baseUrl}/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.ok) {
                await fetchProducts();
                return true;
            }
            return false;
        } catch (err) {
            console.error(err);
            return false;
        }
    }, [fetchProducts]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return {
        products,
        totalStock,
        loading,
        totalPages,
        error,
        refresh: fetchProducts,
        deleteProduct
    };
}

