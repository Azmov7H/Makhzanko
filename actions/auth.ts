"use server";

import { AuthService } from "@/services/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
        const { user, tenant } = await AuthService.register({ name, email, password, companyName });
        const token = await AuthService.createSessionToken(user);

        const cookieStore = await cookies();
        cookieStore.set(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24,
            path: "/",
        });
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
        const user = await AuthService.authenticate({ email, password });
        const token = await AuthService.createSessionToken(user);

        const cookieStore = await cookies();
        cookieStore.set(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24,
            path: "/",
        });
    } catch (error: any) {
        return { error: error.message || "Invalid credentials" };
    }

    redirect("/dashboard");
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
    redirect("/login");
}
