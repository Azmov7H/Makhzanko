"use server";

import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import { PlanType } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Redeem a promo code to upgrade plan
 */
export async function redeemPromoCode(code: string) {
    const context = await getTenantContext();

    // Validate input
    if (!code || code.trim().length === 0) {
        return { error: "الرجاء إدخال رمز الترويج" };
    }

    // Find promo code
    const promoCode = await db.promoCode.findUnique({
        where: { code: code.trim().toUpperCase() },
        include: {
            redemptions: true,
        },
    });

    if (!promoCode) {
        return { error: "رمز الترويج غير صحيح" };
    }

    // Check if active
    if (!promoCode.isActive) {
        return { error: "رمز الترويج غير نشط" };
    }

    // Check expiration
    if (promoCode.expiresAt && new Date() > promoCode.expiresAt) {
        return { error: "رمز الترويج منتهي الصلاحية" };
    }

    // Check max uses
    if (promoCode.maxUses && promoCode.currentUses >= promoCode.maxUses) {
        return { error: "تم استنفاد عدد استخدامات هذا الرمز" };
    }

    // Check if already redeemed by this tenant
    const existingRedemption = promoCode.redemptions.find(
        (r) => r.tenantId === context.tenantId
    );

    if (existingRedemption) {
        return { error: "لقد قمت باستخدام هذا الرمز من قبل" };
    }

    // Get current tenant
    const tenant = await db.tenant.findUnique({
        where: { id: context.tenantId },
        select: { plan: true },
    });

    if (!tenant) {
        return { error: "خطأ في النظام" };
    }

    // Check if plan is already equal or better
    const planHierarchy = {
        FREE: 0,
        PRO: 1,
        BUSINESS: 2,
    };

    if (planHierarchy[tenant.plan] >= planHierarchy[promoCode.planType]) {
        return { error: "خطتك الحالية مساوية أو أفضل من المستوى المطلوب" };
    }

    // Redeem the code
    await db.$transaction(async (tx) => {
        // Create redemption record
        await tx.redemption.create({
            data: {
                promoCodeId: promoCode.id,
                tenantId: context.tenantId,
            },
        });

        // Update promo code usage
        await tx.promoCode.update({
            where: { id: promoCode.id },
            data: {
                currentUses: {
                    increment: 1,
                },
            },
        });

        // Upgrade tenant plan
        await tx.tenant.update({
            where: { id: context.tenantId },
            data: {
                plan: promoCode.planType,
            },
        });

        // Cancel any active subscriptions
        await tx.subscription.updateMany({
            where: {
                tenantId: context.tenantId,
                status: {
                    in: ["active", "trialing"],
                },
            },
            data: {
                status: "canceled",
            },
        });
    });

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");

    return {
        success: true,
        message: `تم ترقية خطتك إلى ${getPlanNameArabic(promoCode.planType)} بنجاح!`
    };
}

function getPlanNameArabic(plan: PlanType): string {
    const names = {
        FREE: "مجاني",
        PRO: "احترافي",
        BUSINESS: "أعمال",
    };
    return names[plan];
}
