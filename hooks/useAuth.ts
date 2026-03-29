"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/context";

export function useAuth() {
    const { t } = useI18n();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

            // Auto-login: Redirect directly to dashboard
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

            // Redirect to dashboard
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

    return {
        register,
        login,
        loading,
        error,
    };
}
