"use server";

import { db } from "@/lib/db";
import { requireOwner } from "@/lib/auth-role";
import { PlanType } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Generate a new promo code
 */
export async function generatePromoCode(
    planType: PlanType,
    maxUses?: number,
    expiresAt?: Date
) {
    const owner = await requireOwner();

    // Generate random code
    const code = generateRandomCode();

    const promoCode = await db.promoCode.create({
        data: {
            code,
            planType,
            maxUses: maxUses || null,
            expiresAt: expiresAt || null,
            createdBy: owner.username,
        },
    });

    revalidatePath("/admin/promo-codes");
    return { success: true, code: promoCode.code };
}

/**
 * Get all promo codes
 */
export async function getAllPromoCodes() {
    await requireOwner();

    const promoCodes = await db.promoCode.findMany({
        include: {
            redemptions: {
                include: {
                    tenant: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
            _count: {
                select: {
                    redemptions: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return promoCodes;
}

/**
 * Deactivate a promo code
 */
export async function deactivatePromoCode(codeId: string) {
    await requireOwner();

    await db.promoCode.update({
        where: { id: codeId },
        data: { isActive: false },
    });

    revalidatePath("/admin/promo-codes");
    return { success: true };
}

/**
 * Delete a promo code
 */
export async function deletePromoCode(codeId: string) {
    await requireOwner();

    await db.promoCode.delete({
        where: { id: codeId },
    });

    revalidatePath("/admin/promo-codes");
    return { success: true };
}

// Helper function to generate random code
function generateRandomCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 12; i++) {
        if (i > 0 && i % 4 === 0) code += "-";
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}
