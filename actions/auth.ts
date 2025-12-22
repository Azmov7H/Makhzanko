"use server";

import { db } from "@/lib/db";
import { signToken } from "@/lib/jwt";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { seedChartOfAccounts, DEFAULT_ACCOUNTS } from "@/lib/accounting";

const COOKIE_NAME = "saas_token";

export async function registerAction(prevState: any, formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const companyName = formData.get("companyName") as string;

    if (!email || !password || !companyName) {
        return { error: "Missing required fields" };
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
        return { error: "User already exists" };
    }

    // Create Tenant & User Transaction
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const slug = companyName.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(); // Simple slug gen

        const { user, tenant } = await db.$transaction(async (tx) => {
            // Calculate 14-day trial expiration
            const trialEndsAt = new Date();
            trialEndsAt.setDate(trialEndsAt.getDate() + 14);

            const tenant = await tx.tenant.create({
                data: {
                    name: companyName,
                    slug,
                    plan: "FREE",
                    trialEndsAt, // 14-day trial
                },
            });

            const user = await tx.user.create({
                data: {
                    email,
                    passwordHash: hashedPassword,
                    name,
                    role: "OWNER",
                    tenantId: tenant.id,
                },
            });

            // Create accounts in a single batch
            await tx.account.createMany({
                data: DEFAULT_ACCOUNTS.map(account => ({
                    tenantId: tenant.id,
                    code: account.code,
                    name: account.name,
                    type: account.type,
                })),
                skipDuplicates: true, // Skip if account already exists
            });

            return { user, tenant };
        }, {
            maxWait: 20000, // 20 seconds max wait time
            timeout: 20000, // 20 seconds timeout
        });

        // Generate Token
        const token = await signToken({
            userId: user.id,
            email: user.email,
            role: user.role,
            tenantId: tenant.id,
            plan: tenant.plan,
        });

        // Set Cookie
        const cookieStore = await cookies();
        cookieStore.set(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });

    } catch (error) {
        console.error("Registration Error:", error);
        return { error: "Registration failed" };
    }

    redirect("/dashboard");
}

export async function loginAction(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Missing fields" };
    }

    const user = await db.user.findUnique({
        where: { email },
        include: { tenant: true }
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return { error: "Invalid credentials" };
    }

    // Generate Token
    const token = await signToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        plan: user.tenant.plan,
    });

    // Set Cookie
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
    });

    redirect("/dashboard");
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
    redirect("/login");
}
