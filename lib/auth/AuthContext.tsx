"use client";

import { createContext, useContext, useState, useCallback, useEffect, useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/context";

// ─── Constants ──────────────────────────────────────────────────────────────
const TOKEN_KEY = "saas_token";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const API_BASE_URL = BASE_URL.endsWith("/api") ? BASE_URL : `${BASE_URL}/api`;

// ─── Standalone token helpers ───────────────────────────────────────────────
export function getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
}

// ─── Types ──────────────────────────────────────────────────────────────────
interface AuthUser {
    id: string;
    tenantId: string;
    role: string;
    email: string | null;
    name: string | null;
    [key: string]: unknown;
}

interface AuthContextValue {
    user: AuthUser | null;
    loading: boolean;
    isReady: boolean;
    error: string | null;
    login: (formData: FormData) => Promise<void>;
    register: (formData: FormData) => Promise<void>;
    logout: () => void;
    checkSession: () => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ───────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const { t } = useI18n();

    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isReady, setIsReady] = useState(false);

    // ── Check session ───────────────────────────────────────────────────
    const checkSession = useCallback(async (): Promise<AuthUser | null> => {
        try {
            const token = getAuthToken();
            if (!token) {
                setUser(null);
                return null;
            }

            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
                return data;
            } else {
                setUser(null);
                clearAuthToken();
                return null;
            }
        } catch {
            setUser(null);
            clearAuthToken();
            return null;
        } finally {
            setIsReady(true);
        }
    }, []);

    // ── Run session check once on mount ─────────────────────────────────
    useEffect(() => {
        checkSession();
    }, [checkSession]);

    // ── Login ───────────────────────────────────────────────────────────
    const login = useCallback(
        async (formData: FormData) => {
            setLoading(true);
            setError(null);

            const email = formData.get("email") as string;
            const password = formData.get("password") as string;

            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(data.message || data.error || t("Auth.error_login_failed"));
                }

                // Look for token in response JSON body
                if (data.token) {
                    setAuthToken(data.token);
                } else {
                    console.warn("⚠️ No 'token' returned in the JSON body from /auth/login. LocalStorage authentication may fail if your Rust API only sends it via Set-Cookie header.");
                }

                if (data.user) {
                    setUser(data.user);
                    setIsReady(true);
                } else {
                    await checkSession();
                }

                toast.success(t("Auth.success_login"));
                router.push("/dashboard");
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : t("Auth.error_unexpected");
                console.error("Login Error:", err);
                setError(message);
                toast.error(message);
            } finally {
                setLoading(false);
            }
        },
        [t, router, checkSession]
    );

    // ── Register ────────────────────────────────────────────────────────
    const register = useCallback(
        async (formData: FormData) => {
            setLoading(true);
            setError(null);

            const name = formData.get("name") as string;
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;
            const companyName = formData.get("companyName") as string;

            try {
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password, companyName }),
                });

                const data = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(data.message || data.error || t("Auth.error_register_failed"));
                }

                if (data.token) {
                    setAuthToken(data.token);
                }

                if (data.user) {
                    setUser(data.user);
                    setIsReady(true);
                } else {
                    await checkSession();
                }

                toast.success(t("Auth.success_register"));
                router.push("/dashboard");
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : t("Auth.error_unexpected");
                console.error("Registration Error:", err);
                setError(message);
                toast.error(message);
            } finally {
                setLoading(false);
            }
        },
        [t, router, checkSession]
    );

    // ── Logout ──────────────────────────────────────────────────────────
    const logout = useCallback(() => {
        clearAuthToken();
        setUser(null);
        setIsReady(true);
        router.push("/login");
    }, [router]);

    // ── Memoize context value ───────────────────────────────────────────
    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            loading,
            isReady,
            error,
            login,
            register,
            logout,
            checkSession,
        }),
        [user, loading, isReady, error, login, register, logout, checkSession]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an <AuthProvider>. Add it to your root layout.");
    }
    return context;
}
