"use server";

import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { Role, PlanType } from "@prisma/client";

const PLAN_LIMITS = {
    [PlanType.FREE]: 2,
    [PlanType.PRO]: 10,
    [PlanType.BUSINESS]: Infinity,
};

export async function updateStoreName(formData: FormData) {
    const context = await getTenantContext();
    const name = formData.get("name") as string;

    if (!name) return { error: "Name is required" };

    await db.tenant.update({
        where: { id: context.tenantId },
        data: { name },
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
}

import bcrypt from "bcryptjs";

// ... existing imports

export async function addUserToTeam(formData: FormData) {
    const context = await getTenantContext();

    if (context.role !== Role.OWNER && context.role !== Role.ADMIN) {
        return { error: "Unauthorized" };
    }

    const email = formData.get("email") as string;
    const role = formData.get("role") as Role;
    const password = formData.get("password") as string;

    if (!email || !role || !password) return { error: "Missing fields" };

    // Check plan limits
    const userCount = await db.user.count({
        where: { tenantId: context.tenantId },
    });

    const limit = PLAN_LIMITS[context.plan];
    if (userCount >= limit) {
        return { error: "Plan limit reached" };
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return { error: "User already exists with this email" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
        data: {
            email,
            name: email.split("@")[0],
            role,
            tenantId: context.tenantId,
            passwordHash: hashedPassword,
        },
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
}

export async function changePassword(formData: FormData) {
    const context = await getTenantContext();
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;

    if (!currentPassword || !newPassword) {
        return { error: "Missing fields" };
    }

    const user = await db.user.findUnique({
        where: { id: context.userId },
    });

    if (!user) return { error: "User not found" };

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
        return { error: "Incorrect current password" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.user.update({
        where: { id: context.userId },
        data: { passwordHash: hashedPassword },
    });

    return { success: true };
}

export async function deleteUserFromTeam(userId: string) {
    const context = await getTenantContext();

    if (context.role !== Role.OWNER && context.role !== Role.ADMIN) {
        return { error: "Unauthorized" };
    }

    if (userId === context.userId) {
        return { error: "Cannot delete yourself" };
    }

    const userToDelete = await db.user.findUnique({
        where: { id: userId },
    });

    if (!userToDelete || userToDelete.tenantId !== context.tenantId) {
        return { error: "User not found" };
    }

    await db.user.delete({
        where: { id: userId },
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
}

export async function updateProfile(formData: FormData) {
    const context = await getTenantContext();
    const name = formData.get("name") as string;

    if (!name) return { error: "Name is required" };

    await db.user.update({
        where: { id: context.userId },
        data: { name },
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
}
export async function toggleDeferredPaymentAction(userId: string, enabled: boolean) {
    const context = await getTenantContext();

    if (context.role !== Role.OWNER && context.role !== Role.ADMIN) {
        return { error: "Unauthorized" };
    }

    await db.user.update({
        where: { id: userId, tenantId: context.tenantId },
        data: { canDeferred: enabled },
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
}
