"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT } from "jose";

const OWNER_COOKIE_NAME = "owner_token";
const OWNER_USERNAME = process.env.OWNER_USERNAME || "admin";
const OWNER_PASSWORD = process.env.OWNER_PASSWORD || "admin123";

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

/**
 * Owner login action
 */
export async function ownerLoginAction(formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) {
        return { error: "الرجاء إدخال اسم المستخدم وكلمة المرور" };
    }

    // Validate credentials
    if (username !== OWNER_USERNAME || password !== OWNER_PASSWORD) {
        return { error: "اسم المستخدم أو كلمة المرور غير صحيحة" };
    }

    // Create owner session token
    const token = await new SignJWT({
        type: "owner",
        username,
        timestamp: Date.now()
    })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(secret);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set(OWNER_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
    });

    return { success: true };
}

/**
 * Owner logout action
 */
export async function ownerLogoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete(OWNER_COOKIE_NAME);
    redirect("/owner/login");
}

/**
 * Get owner session
 */
export async function getOwnerSession() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(OWNER_COOKIE_NAME)?.value;

        if (!token) {
            return null;
        }

        const { jwtVerify } = await import("jose");
        const { payload } = await jwtVerify(token, secret);

        if (payload.type !== "owner") {
            return null;
        }

        return {
            username: payload.username as string,
            authenticated: true,
        };
    } catch {
        return null;
    }
}
