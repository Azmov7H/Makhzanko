import { prisma } from "@/lib/prisma";
import { SubscriptionStatus } from "@prisma/client";

export class BillingService {
    /**
     * Fulfill a subscription after successful payment
     */
    static async fulfillSubscription(paymobOrderId: string, paymobTransactionId: string) {
        console.log(`Fulfilling subscription for Paymob Order: ${paymobOrderId}`);

        // 1. Find the pending subscription
        const subscription = await prisma.subscription.findUnique({
            where: { paymobOrderId },
            include: { plan: true }
        });

        if (!subscription) {
            throw new Error(`Subscription not found for Paymob Order: ${paymobOrderId}`);
        }

        if (subscription.status === "active" as SubscriptionStatus) {
            console.log(`Subscription ${subscription.id} is already active.`);
            return subscription;
        }

        // 2. Calculate periods (default to 30 days for now)
        const now = new Date();
        const nextMonth = new Date();
        nextMonth.setDate(now.getDate() + 30);

        // 3. Update subscription and tenant in a transaction
        return await prisma.$transaction(async (tx) => {
            // Update subscription
            const updatedSubscription = await tx.subscription.update({
                where: { id: subscription.id },
                data: {
                    status: "active" as SubscriptionStatus,
                    paymobTransactionId,
                    currentPeriodStart: now,
                    currentPeriodEnd: nextMonth,
                },
            });

            // Upgrade tenant plan
            await tx.tenant.update({
                where: { id: subscription.tenantId },
                data: {
                    plan: subscription.plan.type,
                },
            });

            // Create payment record
            await tx.payment.create({
                data: {
                    subscriptionId: subscription.id,
                    paymobTransactionId,
                    amount: subscription.plan.price,
                    currency: "EGP",
                    status: "succeeded",
                    paidAt: now,
                }
            });

            console.log(`Tenant ${subscription.tenantId} upgraded to ${subscription.plan.type}`);
            return updatedSubscription;
        });
    }
}
