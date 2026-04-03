"use client";

import { useCallback, useState } from "react";
import { getAuthToken } from "./useAuth";

interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    loading: boolean;
}

export function useApi() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const call = useCallback(async <T>(
        path: string,
        options: RequestInit = {}
    ): Promise<T | null> => {
        setLoading(true);
        setError(null);

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
        const token = getAuthToken();

        const headers = new Headers(options.headers || {});
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        if (!(options.body instanceof FormData)) {
            headers.set("Content-Type", "application/json");
        }

        try {
            const response = await fetch(`${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`, {
                ...options,
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Request failed with status ${response.status}`);
            }

            const data = await response.json();
            return data as T;
        } catch (err: any) {
            console.error(`API Error [${path}]:`, err);
            setError(err.message || "An unexpected error occurred");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { call, loading, error };
}
