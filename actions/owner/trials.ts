"use server";

import { db } from "@/lib/db";
import { requireOwner } from "@/lib/auth-role";
import { PlanType } from "@prisma/client";
import { logActivity } from "@/lib/activity-logger";
import { headers } from "next/headers";
import { getRequestMetadata } from "@/lib/activity-logger";
import { revalidatePath } from "next/cache";

/**
 * Create or update trial override for a tenant
 */
export async function createTrialOverride(
  tenantId: string,
  plan: PlanType,
  days: number
) {
  const context = await requireOwner();

  const tenant = await db.tenant.findUnique({
    where: { id: tenantId },
  });

  if (!tenant) {
    return { error: "Tenant not found" };
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);

  // Upsert trial override
  const trialOverride = await db.trialOverride.upsert({
    where: { tenantId },
    update: {
      plan,
      expiresAt,
      createdBy: context.userId,
    },
    create: {
      tenantId,
      plan,
      expiresAt,
      createdBy: context.userId,
    },
  });

  // Update tenant plan immediately
  await db.tenant.update({
    where: { id: tenantId },
    data: { plan },
  });

  // Cancel any active Stripe subscriptions
  const activeSubscription = await db.subscription.findFirst({
    where: {
      tenantId,
      status: {
        in: ["active", "trialing"],
      },
    },
  });

  if (activeSubscription) {
    await db.subscription.update({
      where: { id: activeSubscription.id },
      data: {
        status: "canceled",
        cancelAtPeriodEnd: false,
      },
    });
  }

  // Log activity
  const headersList = await headers();
  const { ip, userAgent } = getRequestMetadata(headersList);
  await logActivity({
    tenantId,
    userId: context.userId,
    action: "create_trial_override",
    resource: "trial",
    metadata: {
      plan,
      days,
      expiresAt: expiresAt.toISOString(),
    },
    ip,
    userAgent,
  });

  revalidatePath("/owner/subscriptions");
  return { success: true, trialOverride };
}

/**
 * Remove trial override (returns to normal plan)
 */
export async function removeTrialOverride(tenantId: string) {
  const context = await requireOwner();

  const trialOverride = await db.trialOverride.findUnique({
    where: { tenantId },
  });

  if (!trialOverride) {
    return { error: "Trial override not found" };
  }

  // Delete trial override
  await db.trialOverride.delete({
    where: { tenantId },
  });

  // Set tenant back to FREE plan
  await db.tenant.update({
    where: { id: tenantId },
    data: { plan: PlanType.FREE },
  });

  // Log activity
  const headersList = await headers();
  const { ip, userAgent } = getRequestMetadata(headersList);
  await logActivity({
    tenantId,
    userId: context.userId,
    action: "remove_trial_override",
    resource: "trial",
    metadata: {},
    ip,
    userAgent,
  });

  revalidatePath("/owner/subscriptions");
  return { success: true };
}

/**
 * Get trial override for a tenant
 */
export async function getTrialOverride(tenantId: string) {
  await requireOwner();

  const trialOverride = await db.trialOverride.findUnique({
    where: { tenantId },
  });

  return trialOverride;
}

/**
 * Check if trial is expired and clean it up
 * Should be called periodically (cron job)
 */
export async function cleanupExpiredTrials() {
  await requireOwner();

  const expiredTrials = await db.trialOverride.findMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
    include: {
      tenant: true,
    },
  });

  for (const trial of expiredTrials) {
    // Delete trial override
    await db.trialOverride.delete({
      where: { id: trial.id },
    });

    // Set tenant back to FREE
    await db.tenant.update({
      where: { id: trial.tenantId },
      data: { plan: PlanType.FREE },
    });

    // Log activity
    await logActivity({
      tenantId: trial.tenantId,
      userId: "system",
      action: "trial_expired",
      resource: "trial",
      metadata: {
        expiredAt: trial.expiresAt.toISOString(),
      },
    });
  }

  return { cleaned: expiredTrials.length };
}

