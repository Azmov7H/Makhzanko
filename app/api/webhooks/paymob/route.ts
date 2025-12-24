import { db } from "@/lib/db";
import { SubscriptionStatus, PlanType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
// crypto is now used inside the utility function
import { verifyPaymobHmac } from "@/lib/paymob";

/**
 * Paymob Webhook Handler
 * Processes transaction status updates.
 */
export async function POST(req: NextRequest) {
    const url = new URL(req.url);
    const hmac = url.searchParams.get("hmac");

    if (!hmac) {
        return NextResponse.json({ error: "No HMAC signature" }, { status: 400 });
    }

    const body = await req.json();
    const transaction = body.obj;

    // Verify HMAC
    // We use the centralized utility function to ensure consistency
    // and security across the application.
    const isValid = verifyPaymobHmac(hmac, transaction);

    if (!isValid) {
        // Log the failure for debugging purposes
        console.error("Paymob Webhook HMAC Verification Failed", {
            received: hmac,
            // We don't log the expected one to avoid leaking secrets in logs
        });
        return NextResponse.json({ error: "Invalid HMAC signature" }, { status: 401 });
    }

    // Process successful transaction
    if (transaction.success === true) {
        const paymobOrderId = transaction.order.id.toString();
        const paymobTransactionId = transaction.id.toString();

        // Find tenant from merchant_order_id (we encoded it as tenantId-timestamp)
        const merchantOrderId = transaction.order.merchant_order_id;
        const tenantId = merchantOrderId.split('-')[0];

        // Find the intended plan (we might need to store this in an intent table, 
        // but for now we look at the amount or assume PRO if price matches)
        const amountCents = transaction.amount_cents;
        const amount = amountCents / 100;

        const plan = await db.plan.findFirst({
            where: { price: amount }
        });

        if (tenantId && plan) {
            // 1. Cancel existing subscriptions
            await db.subscription.updateMany({
                where: {
                    tenantId,
                    status: { in: ["active", "trialing"] }
                },
                data: { status: "canceled" }
            });

            // 2. Create new subscription
            const now = new Date();
            const nextMonth = new Date();
            nextMonth.setMonth(now.getMonth() + 1);

            const subscription = await db.subscription.create({
                data: {
                    tenantId,
                    planId: plan.id,
                    paymobOrderId,
                    paymobTransactionId,
                    status: SubscriptionStatus.active,
                    currentPeriodStart: now,
                    currentPeriodEnd: nextMonth,
                }
            });

            // 3. Create payment record
            await db.payment.create({
                data: {
                    subscriptionId: subscription.id,
                    paymobTransactionId,
                    amount: amount,
                    currency: transaction.currency,
                    status: "succeeded",
                    paidAt: now,
                }
            });

            // 4. Update tenant plan
            await db.tenant.update({
                where: { id: tenantId },
                data: { plan: plan.type }
            });
        }
    }

    return NextResponse.json({ received: true });
}
