"use server";

import { db } from "@/lib/db";
import { requireOwner } from "@/lib/auth-role";
import { revalidatePath } from "next/cache";

/**
 * Get all global settings
 */
export async function getGlobalSettingsAction() {
    await requireOwner();

    const settings = await db.globalSetting.findMany();
    // Convert array to object for easier use
    return settings.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {} as Record<string, string>);
}

/**
 * Update a global setting
 */
export async function updateGlobalSettingAction(key: string, value: string) {
    await requireOwner();

    await db.globalSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value }
    });

    revalidatePath("/admin/settings");
    return { success: true };
}

/**
 * Get a specific setting (public version if needed)
 */
export async function getSettingAction(key: string, defaultValue: string = "") {
    const setting = await db.globalSetting.findUnique({
        where: { key }
    });
    return setting?.value ?? defaultValue;
}
