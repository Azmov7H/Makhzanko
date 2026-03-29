"use server";

import { db } from "@/lib/db";
import { requireOwner } from "@/lib/auth-role";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

/**
 * Get all platform admins
 */
export async function getPlatformAdminsAction() {
    await requireOwner();
    return await db.platformAdmin.findMany({
        orderBy: { createdAt: "desc" }
    });
}

/**
 * Create a new platform admin
 */
export async function createPlatformAdminAction(data: {
    username: string;
    name?: string;
    password?: string;
    role: string;
}) {
    await requireOwner();

    // Default password if not provided
    const password = data.password || "admin123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await db.platformAdmin.create({
        data: {
            username: data.username,
            name: data.name,
            password: hashedPassword,
            role: data.role,
            isActive: true
        }
    });

    revalidatePath("/admin/admins");
    return { success: true, id: admin.id };
}

/**
 * Toggle admin status
 */
export async function toggleAdminStatusAction(id: string, isActive: boolean) {
    await requireOwner();

    await db.platformAdmin.update({
        where: { id },
        data: { isActive }
    });

    revalidatePath("/admin/admins");
    return { success: true };
}

/**
 * Delete an admin
 */
export async function deleteAdminAction(id: string) {
    await requireOwner();

    await db.platformAdmin.delete({
        where: { id }
    });

    revalidatePath("/admin/admins");
    return { success: true };
}
