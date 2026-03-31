"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/context";

const COOKIE_NAME = "saas_token";

export function useAuth() {
    const { t } = useI18n();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);

    // Helper to set cookie
    const setAuthCookie = (token: string) => {
        document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    };

    // Helper to get cookie
    const getAuthCookie = () => {
        if (typeof document === "undefined") return null;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${COOKIE_NAME}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
    };

    const checkSession = async () => {
        try {
            const token = getAuthCookie();
            if (!token) {
                setUser(null);
                return null;
            }

            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
            const response = await fetch(`${baseUrl}/api/auth/me`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
                return data;
            } else {
                setUser(null);
                return null;
            }
        } catch (err) {
            setUser(null);
            return null;
        }
    };

    const register = async (formData: FormData) => {
        setLoading(true);
        setError(null);

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const companyName = formData.get("companyName") as string;

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
            const response = await fetch(`${baseUrl}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    companyName,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || t("Auth.error_register_failed"));
            }

            if (data.token) {
                setAuthCookie(data.token);
            }

            toast.success(t("Auth.success_register"));
            router.push("/dashboard");
        } catch (err: any) {
            console.error("Registration Error:", err);
            setError(err.message || t("Auth.error_unexpected"));
            toast.error(err.message || t("Auth.error_register_failed"));
        } finally {
            setLoading(false);
        }
    };

    const login = async (formData: FormData) => {
        setLoading(true);
        setError(null);

        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
            const response = await fetch(`${baseUrl}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || t("Auth.error_login_failed"));
            }

            if (data.token) {
                setAuthCookie(data.token);
            }

            toast.success(t("Auth.success_login"));
            router.push("/dashboard");
        } catch (err: any) {
            console.error("Login Error:", err);
            setError(err.message || t("Auth.error_unexpected"));
            toast.error(err.message || t("Auth.error_login_failed"));
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
        setUser(null);
        router.push("/login");
    };

    return {
        register,
        login,
        logout,
        checkSession,
        loading,
        error,
        user,
    };
}
