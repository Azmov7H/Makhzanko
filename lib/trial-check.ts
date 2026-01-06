/**
 * Trial System Utilities
 * Manages trial period checking and status
 */

import { db } from "./db";

export interface TrialStatus {
    isInTrial: boolean;
    trialEndsAt: Date | null;
    daysRemaining: number;
    isExpired: boolean;
}

/**
 * Check if a tenant's trial period has expired
 */
export async function getTrialStatus(tenantId: string): Promise<TrialStatus> {
    const tenant = await db.tenant.findUnique({
        where: { id: tenantId },
        select: { plan: true, trialEndsAt: true, createdAt: true }
    });

    if (!tenant) {
        return { isInTrial: false, trialEndsAt: null, daysRemaining: 0, isExpired: true };
    }

    console.log(`[Trial Debug] Tenant: ${tenantId}, Plan: ${tenant.plan}, trialEndsAt: ${tenant.trialEndsAt}, createdAt: ${tenant.createdAt}`);

    // If user has paid plan, no trial restrictions
    if (tenant.plan !== "FREE") {
        return { isInTrial: false, trialEndsAt: null, daysRemaining: 0, isExpired: false };
    }

    const now = new Date();
    const TRIAL_DAYS = 90; // 3 month trial
    const msPerDay = 24 * 60 * 60 * 1000;

    // Use trialEndsAt if set, otherwise fallback to createdAt + 90 days
    let trialEnd: Date;
    if (tenant.trialEndsAt) {
        trialEnd = new Date(tenant.trialEndsAt);
    } else {
        trialEnd = new Date(tenant.createdAt.getTime() + (TRIAL_DAYS * msPerDay));
    }

    const isExpired = now > trialEnd;
    const daysRemaining = isExpired ? 0 : Math.ceil((trialEnd.getTime() - now.getTime()) / msPerDay);

    return {
        isInTrial: !isExpired,
        trialEndsAt: trialEnd,
        daysRemaining,
        isExpired
    };
}

/**
 * Check if trial is expired and should block access
 */
export async function isTrialExpired(tenantId: string): Promise<boolean> {
    const status = await getTrialStatus(tenantId);
    return status.isExpired;
}

/**
 * Format trial status message
 */
export function formatTrialMessage(status: TrialStatus, locale: "en" | "ar" = "en"): string {
    if (!status.isInTrial && !status.isExpired) {
        return ""; // Paid user
    }

    if (status.isExpired) {
        return locale === "ar"
            ? "انتهت فترتك التجريبية. قم بالترقية للمتابعة."
            : "Your trial has expired. Upgrade to continue.";
    }

    if (status.daysRemaining <= 3) {
        return locale === "ar"
            ? `تنتهي فترتك التجريبية خلال ${status.daysRemaining} أيام`
            : `Your trial ends in ${status.daysRemaining} days`;
    }

    return "";
}
