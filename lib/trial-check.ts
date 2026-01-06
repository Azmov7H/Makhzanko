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

    // If user has paid plan, no trial restrictions
    if (tenant.plan !== "FREE") {
        return { isInTrial: false, trialEndsAt: null, daysRemaining: 0, isExpired: false };
    }

    const now = new Date();
    const TRIAL_DAYS = 90; // 3 month trial
    const msPerDay = 24 * 60 * 60 * 1000;

    // Ensure at least 90 days from creation
    const fallbackTrialEnd = new Date(tenant.createdAt.getTime() + (TRIAL_DAYS * msPerDay));

    let trialEnd: Date;
    if (tenant.trialEndsAt) {
        const explicitEnd = new Date(tenant.trialEndsAt);
        // Use the later date to honor manual extensions while ensuring minimum 90 days
        trialEnd = explicitEnd > fallbackTrialEnd ? explicitEnd : fallbackTrialEnd;
    } else {
        trialEnd = fallbackTrialEnd;
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
