import { prisma } from "@/lib/prisma";
import { PlanType, SubscriptionStatus } from "@prisma/client";
import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe() {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error("STRIPE_SECRET_KEY is not set");
    }
    if (!stripeInstance) {
        stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: "2025-02-24.acacia",
            typescript: true,
        });
    }
    return stripeInstance;
}

export class StripeService {
    static async handleSubscriptionCreated(
        stripeSubscriptionId: string,
        tenantId: string | undefined,
        planId: string | undefined
    ) {
        if (!tenantId || !planId) {
            throw new Error("Missing metadata in checkout session");
        }

        const stripe = getStripe();
        const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);

        const plan = await prisma.plan.findUnique({ where: { id: planId } });
        if (!plan) throw new Error(`Plan not found: ${planId}`);

        return await prisma.$transaction(async (tx) => {
            // Cancel any existing active subscriptions for this tenant
            await tx.subscription.updateMany({
                where: {
                    tenantId,
                    status: { in: ["active", "trialing"] },
                },
                data: { status: "canceled" },
            });

            // Create new subscription
            const sub = await tx.subscription.create({
                data: {
                    tenantId,
                    planId: plan.id,
                    stripeSubscriptionId,
                    stripeCustomerId: stripeSubscription.customer as string,
                    status: this.mapStripeStatusToDb(stripeSubscription.status),
                    currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
                    currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
                    cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
                },
            });

            // Update tenant plan
            await tx.tenant.update({
                where: { id: tenantId },
                data: { plan: plan.type },
            });

            return sub;
        });
    }

    static async handlePaymentSucceeded(stripeSubscriptionId: string, invoice: Stripe.Invoice) {
        const subscription = await prisma.subscription.findUnique({
            where: { stripeSubscriptionId },
        });

        if (!subscription) throw new Error(`Subscription not found: ${stripeSubscriptionId}`);

        return await prisma.payment.create({
            data: {
                subscriptionId: subscription.id,
                stripePaymentId: invoice.payment_intent as string,
                amount: invoice.amount_paid / 100,
                currency: invoice.currency,
                status: invoice.status === "paid" ? "succeeded" : "failed",
                paidAt: invoice.status === "paid" ? new Date() : null,
            },
        });
    }

    static async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
        const dbSubscription = await prisma.subscription.findUnique({
            where: { stripeSubscriptionId: subscription.id },
        });

        if (!dbSubscription) throw new Error(`Subscription not found: ${subscription.id}`);

        return await prisma.$transaction(async (tx) => {
            await tx.subscription.update({
                where: { id: dbSubscription.id },
                data: { status: "canceled" },
            });

            await tx.tenant.update({
                where: { id: dbSubscription.tenantId },
                data: { plan: PlanType.FREE },
            });
        });
    }

    static async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
        const dbSubscription = await prisma.subscription.findUnique({
            where: { stripeSubscriptionId: subscription.id },
        });

        if (!dbSubscription) throw new Error(`Subscription not found: ${subscription.id}`);

        const priceId = (subscription.items.data[0]?.price.id);
        const plan = await prisma.plan.findUnique({ where: { stripePriceId: priceId } });

        if (plan) {
            return await prisma.$transaction(async (tx) => {
                await tx.subscription.update({
                    where: { id: dbSubscription.id },
                    data: {
                        planId: plan.id,
                        status: this.mapStripeStatusToDb(subscription.status),
                        currentPeriodStart: new Date(subscription.current_period_start * 1000),
                        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                        cancelAtPeriodEnd: subscription.cancel_at_period_end,
                    },
                });

                await tx.tenant.update({
                    where: { id: dbSubscription.tenantId },
                    data: { plan: plan.type },
                });
            });
        }

        return await prisma.subscription.update({
            where: { id: dbSubscription.id },
            data: {
                status: this.mapStripeStatusToDb(subscription.status),
                currentPeriodStart: new Date(subscription.current_period_start * 1000),
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
            },
        });
    }

    static mapStripeStatusToDb(status: string): SubscriptionStatus {
        switch (status) {
            case "active": return SubscriptionStatus.active;
            case "trialing": return SubscriptionStatus.trialing;
            case "past_due":
            case "unpaid": return SubscriptionStatus.past_due;
            case "canceled":
            case "incomplete_expired": return SubscriptionStatus.canceled;
            default: return SubscriptionStatus.canceled;
        }
    }
}
