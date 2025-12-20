"use server";

import { db } from "@/lib/db";
import { requireOwner } from "@/lib/auth-role";
import { PlanType, SubscriptionStatus } from "@prisma/client";
import { logActivity } from "@/lib/activity-logger";
import { headers } from "next/headers";
import { getRequestMetadata } from "@/lib/activity-logger";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

/**
 * Get all subscriptions across all tenants
 */
export async function getAllSubscriptions() {
  await requireOwner();

  const subscriptions = await db.subscription.findMany({
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          plan: true,
          stripeCustomerId: true,
        },
      },
      plan: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return subscriptions;
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  const context = await requireOwner();

  const subscription = await db.subscription.findUnique({
    where: { id: subscriptionId },
    include: { tenant: true },
  });

  if (!subscription) {
    return { error: "Subscription not found" };
  }

  try {
    // Cancel in Stripe
    await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);

    // Update in database
    await db.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: SubscriptionStatus.canceled,
        cancelAtPeriodEnd: false,
      },
    });

    // Update tenant plan to FREE
    await db.tenant.update({
      where: { id: subscription.tenantId },
      data: { plan: PlanType.FREE },
    });

    // Log activity
    const headersList = await headers();
    const { ip, userAgent } = getRequestMetadata(headersList);
    await logActivity({
      tenantId: subscription.tenantId,
      userId: context.username,
      action: "cancel_subscription",
      resource: "subscription",
      metadata: {
        subscriptionId,
      },
      ip,
      userAgent,
    });

    revalidatePath("/owner/subscriptions");
    return { success: true };
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return { error: "Failed to cancel subscription" };
  }
}

/**
 * Manually change tenant plan (bypass Stripe)
 */
export async function forceChangePlan(tenantId: string, plan: PlanType) {
  const context = await requireOwner();

  const tenant = await db.tenant.findUnique({
    where: { id: tenantId },
  });

  if (!tenant) {
    return { error: "Tenant not found" };
  }

  // Cancel any active subscriptions
  await db.subscription.updateMany({
    where: {
      tenantId,
      status: {
        in: ["active", "trialing"],
      },
    },
    data: {
      status: SubscriptionStatus.canceled,
    },
  });

  // Update tenant plan
  await db.tenant.update({
    where: { id: tenantId },
    data: { plan },
  });

  // Log activity
  const headersList = await headers();
  const { ip, userAgent } = getRequestMetadata(headersList);
  await logActivity({
    tenantId,
    userId: context.username,
    action: "force_change_plan",
    resource: "subscription",
    metadata: {
      oldPlan: tenant.plan,
      newPlan: plan,
    },
    ip,
    userAgent,
  });

  revalidatePath("/owner/subscriptions");
  revalidatePath("/owner/tenants");
  return { success: true };
}

/**
 * Force tenant to FREE plan
 */
export async function forceFreePlan(tenantId: string) {
  return forceChangePlan(tenantId, PlanType.FREE);
}

/**
 * Extend subscription period
 */
export async function extendSubscriptionPeriod(
  subscriptionId: string,
  days: number
) {
  const context = await requireOwner();

  const subscription = await db.subscription.findUnique({
    where: { id: subscriptionId },
    include: { tenant: true },
  });

  if (!subscription) {
    return { error: "Subscription not found" };
  }

  const newEndDate = new Date(subscription.currentPeriodEnd);
  newEndDate.setDate(newEndDate.getDate() + days);

  // Update in database
  await db.subscription.update({
    where: { id: subscriptionId },
    data: {
      currentPeriodEnd: newEndDate,
    },
  });

  // Note: In Stripe, you'd need to update the subscription
  // For now, we'll just update our database

  // Log activity
  const headersList = await headers();
  const { ip, userAgent } = getRequestMetadata(headersList);
  await logActivity({
    tenantId: subscription.tenantId,
    userId: context.username,
    action: "extend_subscription_period",
    resource: "subscription",
    metadata: {
      subscriptionId,
      days,
      newEndDate: newEndDate.toISOString(),
    },
    ip,
    userAgent,
  });

  revalidatePath("/owner/subscriptions");
  return { success: true };
}

