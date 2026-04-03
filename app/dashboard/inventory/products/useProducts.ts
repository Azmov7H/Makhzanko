import { useState, useEffect, useCallback } from "react";
import { getAuthToken } from "@/lib/auth/AuthContext";

export interface Product {
    id: string;
    name: string;
    sku: string;
    description?: string;
    price: number;
    cost: number;
    min_stock: number;
    category?: string;
    stocks: Array<{
        warehouse_id: string;
        warehouse_name?: string;
        quantity: number;
    }>;
}

export function useProducts(page: number, limit: number = 10, filters: any = {}, sort: string = "name:asc") {
    const [products, setProducts] = useState<Product[]>([]);
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
            
            // Construct query parameters
            const params = new URLSearchParams({
                page: String(page),
                limit: String(limit),
                sort,
                ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v != null && v !== ""))
            });

            const res = await fetch(`${baseUrl}/api/products?${params.toString()}`, {
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

                const ts = data.reduce((sum: number, p: Product) => {
                    return sum + p.stocks.reduce((s: number, stock: any) => s + (stock.quantity || 0), 0);
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
    }, [page, limit, JSON.stringify(filters), sort]);

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

    const bulkDelete = useCallback(async (ids: string[]) => {
        try {
            const token = getAuthToken();
            const baseUrl = process.env.NEXT_PUBLIC_API_URL;
            // Assuming the backend supports bulk delete via DELETE with body or multiple calls
            // For now, sequentially or via a dedicated endpoint if exists
            const results = await Promise.all(ids.map(id => 
                fetch(`${baseUrl}/api/products/${id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` }
                })
            ));
            
            const allOk = results.every(r => r.ok);
            await fetchProducts();
            return allOk;
        } catch (err) {
            console.error(err);
            return false;
        }
    }, [fetchProducts]);

    const exportCSV = useCallback(() => {
        if (products.length === 0) return;

        const headers = ["Name", "SKU", "Category", "Price", "Cost", "Total Stock"];
        const rows = products.map(p => {
            const totalQty = p.stocks.reduce((acc, s) => acc + s.quantity, 0);
            return [
                p.name,
                p.sku,
                p.category || "",
                p.price,
                p.cost,
                totalQty
            ];
        });

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `products_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [products]);

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
        deleteProduct,
        bulkDelete,
        exportCSV
    };
}

