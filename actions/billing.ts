"use server";

import { prisma } from "@/lib/prisma";
import { getTenantContext } from "@/lib/auth";
import { SubscriptionStatus } from "@prisma/client";
import { redirect } from "next/navigation";


/**
 * Create Checkout Session (Stripe Removed)
 */
export async function createCheckoutSession(planId: string) {
  throw new Error("Stripe integration has been removed.");
}

/**
 * Create Customer Portal Session (Stripe Removed)
 */
export async function createCustomerPortalSession() {
  throw new Error("Stripe integration has been removed.");
}

/**
 * Get current subscription details
 */
export async function getCurrentSubscription(tenantId?: string) {
  const targetTenantId = tenantId || (await getTenantContext()).tenantId;

  const subscription = await prisma.subscription.findFirst({
    where: {
      tenantId: targetTenantId,
      status: {
        in: ["active", "trialing"],
      },
    },
    include: {
      plan: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return subscription;
}

/**
 * Get all available plans
 */
export async function getPlans() {
  const plans = await prisma.plan.findMany({
    orderBy: {
      price: "asc",
    },
  });

  return plans;
}

