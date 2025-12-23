"use server";

/**
 * Invoice Utility Functions
 * - Token generation for invoices and returns
 * - Discount calculations
 * - Refund amount calculations with proportional discount
 */

import { db } from "@/lib/db";

/**
 * Generate a unique human-readable invoice token
 * Format: INV-YYYY-NNNN (e.g., INV-2024-0001)
 */
export async function generateInvoiceToken(tenantId: string): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `INV-${year}-`;

    // Get the count of invoices with this prefix for this tenant this year
    const startOfYear = new Date(year, 0, 1);
    const count = await db.invoice.count({
        where: {
            tenantId,
            createdAt: { gte: startOfYear },
        },
    });

    const nextNumber = count + 1;
    const paddedNumber = nextNumber.toString().padStart(4, "0");

    return `${prefix}${paddedNumber}`;
}

/**
 * Generate a unique human-readable return token
 * Format: RET-YYYY-NNNN (e.g., RET-2024-0001)
 */
export async function generateReturnToken(tenantId: string): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `RET-${year}-`;

    // Get the count of returns with this prefix for this tenant this year
    const startOfYear = new Date(year, 0, 1);
    const count = await db.return.count({
        where: {
            tenantId,
            createdAt: { gte: startOfYear },
        },
    });

    const nextNumber = count + 1;
    const paddedNumber = nextNumber.toString().padStart(4, "0");

    return `${prefix}${paddedNumber}`;
}

/**
 * Calculate discount amount based on type and value
 */
export function calculateDiscount(
    subtotal: number,
    discountType: "percentage" | "fixed" | null,
    discountValue: number | null
): number {
    if (!discountType || discountValue === null || discountValue <= 0) {
        return 0;
    }

    if (discountType === "percentage") {
        // Cap percentage at 100%
        const percentage = Math.min(discountValue, 100);
        return (subtotal * percentage) / 100;
    }

    if (discountType === "fixed") {
        // Cap fixed discount at subtotal
        return Math.min(discountValue, subtotal);
    }

    return 0;
}

/**
 * Calculate tax amount based on rate
 */
export function calculateTax(
    amountAfterDiscount: number,
    taxRate: number | null
): number {
    if (!taxRate || taxRate <= 0) {
        return 0;
    }
    return (amountAfterDiscount * taxRate) / 100;
}

/**
 * Calculate proportional refund amount for returned items
 * This ensures that if an invoice had a discount, returns are calculated fairly
 * 
 * Example:
 * - Invoice subtotal: $100, Discount: 10%, Final: $90
 * - Return items worth $40 (at original price)
 * - Proportional discount share: $40 * (10/100) = $4
 * - Refund amount: $40 - $4 = $36
 */
export function calculateProportionalRefund(
    returnItemsTotal: number,
    invoiceSubtotal: number,
    invoiceDiscountAmount: number
): { discountShare: number; refundAmount: number } {
    if (invoiceSubtotal === 0) {
        return { discountShare: 0, refundAmount: 0 };
    }

    // Calculate the proportion of the invoice being returned
    const proportion = returnItemsTotal / invoiceSubtotal;

    // Calculate proportional discount share
    const discountShare = invoiceDiscountAmount * proportion;

    // Final refund = items total - proportional discount
    const refundAmount = returnItemsTotal - discountShare;

    return {
        discountShare: Math.round(discountShare * 100) / 100,
        refundAmount: Math.round(refundAmount * 100) / 100,
    };
}

/**
 * Validate return request to prevent double returns
 * Returns the remaining returnable quantity for each item
 */
export async function getReturnableQuantities(
    invoiceId: string
): Promise<Map<string, number>> {
    // Get the invoice with its sale items
    const invoice = await db.invoice.findUnique({
        where: { id: invoiceId },
        include: {
            sale: {
                include: {
                    items: true,
                },
            },
            returns: {
                where: {
                    status: { in: ["PENDING", "APPROVED", "COMPLETED"] },
                },
                include: {
                    items: true,
                },
            },
        },
    });

    if (!invoice) {
        return new Map();
    }

    // Start with original quantities
    const returnableMap = new Map<string, number>();
    for (const item of invoice.sale.items) {
        returnableMap.set(item.productId, item.quantity);
    }

    // Subtract already returned quantities
    for (const returnRecord of invoice.returns) {
        for (const returnItem of returnRecord.items) {
            const current = returnableMap.get(returnItem.productId) || 0;
            returnableMap.set(returnItem.productId, current - returnItem.quantity);
        }
    }

    return returnableMap;
}
