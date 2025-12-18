import { db } from "./db";

export const PLAN_LIMITS = {
    FREE: {
        users: 1,
        products: 50,
        warehouses: 1,
        sales: 30, // Per month? total? Let's say per month strictly. 
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

export async function checkLimit(tenantId: string, resource: keyof typeof PLAN_LIMITS.FREE) {
    const tenant = await db.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new Error("Tenant not found");

    const limit = PLAN_LIMITS[tenant.plan][resource];

    if (limit === Infinity) return true;
    if (limit === false) throw new Error(`Upgrade to ${tenant.plan === 'FREE' ? 'PRO' : 'BUSINESS'} to unlock ${resource}`);

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
