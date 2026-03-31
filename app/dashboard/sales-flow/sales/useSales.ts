"use client";

import { useState, useEffect, useCallback } from "react";

export function useSales(page: number, limit: number = 10) {
    const [sales, setSales] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const fetchSales = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
            const res = await fetch(`${baseUrl}/sales?page=${page}&limit=${limit}`, {
                credentials: 'include'
            });
            
            if (res.ok) {
                const data = await res.json();
                setSales(data);
                
                if (data.length < limit && page === 1) {
                    setTotalPages(1);
                } else if (data.length === limit) {
                    setTotalPages(page + 1);
                } else {
                    setTotalPages(page);
                }
            } else {
                setError("Failed to fetch sales");
            }
        } catch (err) {
            console.error(err);
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }, [page, limit]);

    useEffect(() => {
        fetchSales();
    }, [fetchSales]);

    return {
        sales,
        loading,
        totalPages,
        error,
        refresh: fetchSales
    };
}
