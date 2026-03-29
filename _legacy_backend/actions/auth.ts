"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
const COOKIE_NAME = "saas_token";

export async function registerAction(prevState: any, formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const companyName = formData.get("companyName") as string;

    if (!email || !password || !companyName) {
        return { error: "Missing required fields" };
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, companyName }),
        });

        if (!response.ok) {
            const data = await response.json();
            return { error: data.error || "Registration failed" };
        }

        // Rust API sends a Set-Cookie header. We extract the token value to set it in Next.js Server Action
        const setCookie = response.headers.get('set-cookie');
        if (setCookie) {
            const tokenMatch = setCookie.match(/saas_token=([^;]+)/);
            if (tokenMatch && tokenMatch[1]) {
                const cookieStore = await cookies();
                cookieStore.set(COOKIE_NAME, tokenMatch[1], {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 60 * 60 * 24,
                    path: "/",
                });
            }
        }
    } catch (error: any) {
        console.error("Registration Error:", error);
        return { error: error.message || "Registration failed" };
    }

    redirect("/dashboard");
}

export async function loginAction(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Missing fields" };
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            return { error: data.error || "Invalid credentials" };
        }

        const setCookie = response.headers.get('set-cookie');
        if (setCookie) {
            const tokenMatch = setCookie.match(/saas_token=([^;]+)/);
            if (tokenMatch && tokenMatch[1]) {
                const cookieStore = await cookies();
                cookieStore.set(COOKIE_NAME, tokenMatch[1], {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 60 * 60 * 24,
                    path: "/",
                });
            }
        }
    } catch (error: any) {
        return { error: error.message || "Invalid credentials" };
    }

    redirect("/dashboard");
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
    // Let Rust know about logout as well
    fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST' }).catch(() => {});
    redirect("/login");
}
