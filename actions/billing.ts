"use server";

import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import { redirect } from "next/navigation";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

/**
 * Create Stripe Checkout Session for subscription
 */
export async function createCheckoutSession(planId: string) {
  const context = await getTenantContext();

  // Get plan from database
  const plan = await db.plan.findUnique({
    where: { id: planId },
  });

  if (!plan || !plan.stripePriceId) {
    return { error: "Plan not found or not configured" };
  }

  // Get or create Stripe customer
  let stripeCustomerId = context.tenantId;

  const tenant = await db.tenant.findUnique({
    where: { id: context.tenantId },
    select: { stripeCustomerId: true },
  });

  if (tenant?.stripeCustomerId) {
    stripeCustomerId = tenant.stripeCustomerId;
  } else {
    // Create new Stripe customer
    const customer = await stripe.customers.create({
      metadata: {
        tenantId: context.tenantId,
      },
    });

    stripeCustomerId = customer.id;

    // Save customer ID to tenant
    await db.tenant.update({
      where: { id: context.tenantId },
      data: { stripeCustomerId: customer.id },
    });
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: plan.stripePriceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings/billing?canceled=true`,
    metadata: {
      tenantId: context.tenantId,
      planId: plan.id,
    },
  });

  if (!session.url) {
    return { error: "Failed to create checkout session" };
  }

  redirect(session.url);
}

/**
 * Create Stripe Customer Portal session for managing subscription
 */
export async function createCustomerPortalSession() {
  const context = await getTenantContext();

  const tenant = await db.tenant.findUnique({
    where: { id: context.tenantId },
    select: { stripeCustomerId: true },
  });

  if (!tenant?.stripeCustomerId) {
    return { error: "No active subscription found" };
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: tenant.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings/billing`,
  });

  if (!session.url) {
    return { error: "Failed to create portal session" };
  }

  redirect(session.url);
}

/**
 * Get current subscription details
 */
export async function getCurrentSubscription() {
  const context = await getTenantContext();

  const subscription = await db.subscription.findFirst({
    where: {
      tenantId: context.tenantId,
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
  const plans = await db.plan.findMany({
    orderBy: {
      price: "asc",
    },
  });

  return plans;
}

