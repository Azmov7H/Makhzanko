"use client";

import { useState, useEffect, useCallback } from "react";

export interface DashboardStats {
    total_sales: string;
    total_purchases: string;
    total_expenses: string;
    new_customers: number;
}

export function useDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
            const apiBase = base.endsWith('/api') ? base : `${base}/api`;
            const res = await fetch(`${apiBase}/reports/dashboard`, {
                credentials: 'include'
            });
            
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            } else {
                setError("Failed to fetch dashboard stats");
            }
        } catch (err) {
            console.error(err);
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return {
        stats,
        loading,
        error,
        refresh: fetchStats
    };
}
