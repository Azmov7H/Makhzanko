import { db } from "./db";
import { PlanType } from "@prisma/client";

export const PLAN_LIMITS = {
    FREE: {
        users: 1,
        products: 50,
        warehouses: 1,
        sales: 30, // Per month
        reports: false,
        accounting: false,
        customInvoices: false,
        audit: false
    },
    PRO: {
        users: 5,
        products: 500,
        warehouses: 3,
        sales: Infinity,
        reports: true,
        accounting: false,
        customInvoices: 'limited',
        audit: false
    },
    BUSINESS: {
        users: Infinity,
        products: Infinity,
        warehouses: Infinity,
        sales: Infinity,
        reports: true,
        accounting: true,
        customInvoices: true,
        audit: true
    }
};

/**
 * Check if tenant has an active trial
 */
export function isTrialActive(trialEndsAt: Date | null): boolean {
    if (!trialEndsAt) return false;
    return new Date() < trialEndsAt;
}

/**
 * Get effective plan considering trial status
 */
export function getEffectivePlan(plan: PlanType, trialEndsAt: Date | null): PlanType {
    if (isTrialActive(trialEndsAt)) {
        return PlanType.BUSINESS; // Full access during trial
    }
    return plan;
}

/**
 * Get trial remaining days (returns 0 if expired or no trial)
 */
export function getTrialDaysRemaining(trialEndsAt: Date | null): number {
    if (!trialEndsAt) return 0;
    const now = new Date();
    const diff = trialEndsAt.getTime() - now.getTime();
    if (diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export async function checkLimit(tenantId: string, resource: keyof typeof PLAN_LIMITS.FREE) {
    const tenant = await db.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new Error("Tenant not found");

    // Get effective plan (considering trial)
    const effectivePlan = getEffectivePlan(tenant.plan, tenant.trialEndsAt);
    const limit = PLAN_LIMITS[effectivePlan][resource];

    if (limit === Infinity) return true;
    if (limit === false) throw new Error(`Upgrade to ${effectivePlan === 'FREE' ? 'PRO' : 'BUSINESS'} to unlock ${resource}`);

    // Check Counts
    let count = 0;

    if (resource === 'users') {
        count = await db.user.count({ where: { tenantId } });
    } else if (resource === 'products') {
        count = await db.product.count({ where: { tenantId } });
    } else if (resource === 'warehouses') {
        count = await db.warehouse.count({ where: { tenantId } });
    } else if (resource === 'sales') {
        // Check sales this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        count = await db.sale.count({
            where: {
                tenantId,
                date: { gte: startOfMonth }
            }
        });
    }

    if (typeof limit === 'number' && count >= limit) {
        throw new Error(`Plan limit reached for ${resource}. Upgrade to increase limit.`);
    }

    return true;
}

