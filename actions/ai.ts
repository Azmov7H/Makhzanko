"use server";

import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateAIDialect(dialect: "FUSHA" | "EGYPTIAN" | "SAUDI" | "EMIRATI") {
    try {
        const context = await getTenantContext();
        if (!context) return { error: "Unauthorized" };

        await db.tenant.update({
            where: { id: context.tenantId },
            data: { aiDialect: dialect },
        });

        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to update AI dialect:", error);
        return { error: "Failed to update settings" };
    }
}
