"use server";

import { db } from "@/lib/db";
import { requireOwner } from "@/lib/auth-role";
import { revalidatePath } from "next/cache";

/**
 * Get all announcements
 */
export async function getAnnouncementsAction() {
    await requireOwner();

    return await db.announcement.findMany({
        orderBy: { createdAt: "desc" }
    });
}

/**
 * Create a new announcement
 */
export async function createAnnouncementAction(data: {
    title: string;
    content: string;
    type: "INFO" | "WARNING" | "CRITICAL";
    target: "ALL" | "FREE" | "PRO" | "BUSINESS";
}) {
    const owner = await requireOwner();

    const announcement = await db.announcement.create({
        data: {
            ...data,
            createdBy: owner.username,
            isActive: true
        }
    });

    revalidatePath("/admin/announcements");
    revalidatePath("/", "layout"); // Revalidate all pages to show banner

    return { success: true, id: announcement.id };
}

/**
 * Toggle announcement status
 */
export async function toggleAnnouncementAction(id: string, isActive: boolean) {
    await requireOwner();

    await db.announcement.update({
        where: { id },
        data: { isActive }
    });

    revalidatePath("/admin/announcements");
    revalidatePath("/", "layout");

    return { success: true };
}

/**
 * Delete an announcement
 */
export async function deleteAnnouncementAction(id: string) {
    await requireOwner();

    await db.announcement.delete({
        where: { id }
    });

    revalidatePath("/admin/announcements");
    revalidatePath("/", "layout");

    return { success: true };
}

/**
 * Get active announcements for a specific tenant plan
 */
export async function getActiveAnnouncementsAction(plan: string) {
    return await db.announcement.findMany({
        where: {
            isActive: true,
            OR: [
                { target: "ALL" },
                { target: plan as any }
            ]
        },
        orderBy: { createdAt: "desc" }
    });
}
