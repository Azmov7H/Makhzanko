import { db } from "@/lib/db";
import { PlanType, SubscriptionStatus } from "@prisma/client";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

function getStripe() {
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

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not set");
  }

  let event: Stripe.Event;
  const stripe = getStripe();
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const error = err as Error;
    console.error("Webhook signature verification failed:", error.message);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode === "subscription" && session.subscription) {
          await handleSubscriptionCreated(
            session.subscription as string,
            session.metadata?.tenantId,
            session.metadata?.planId
          );
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;

        if (invoice.subscription) {
          await handlePaymentSucceeded(
            invoice.subscription as string,
            invoice
          );
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleSubscriptionCreated(
  stripeSubscriptionId: string,
  tenantId: string | undefined,
  planId: string | undefined
) {
  if (!tenantId || !planId) {
    console.error("Missing metadata in checkout session");
    return;
  }

  // Fetch subscription from Stripe
  const stripe = getStripe();
  const stripeSubscription = await stripe.subscriptions.retrieve(
    stripeSubscriptionId
  );

  // Get plan
  const plan = await db.plan.findUnique({
    where: { id: planId },
  });

  if (!plan) {
    console.error(`Plan not found: ${planId}`);
    return;
  }

  // Cancel any existing active subscriptions for this tenant
  await db.subscription.updateMany({
    where: {
      tenantId,
      status: {
        in: ["active", "trialing"],
      },
    },
    data: {
      status: "canceled",
    },
  });

  // Create new subscription
  await db.subscription.create({
    data: {
      tenantId,
      planId: plan.id,
      stripeSubscriptionId,
      stripeCustomerId: stripeSubscription.customer as string,
      status: mapStripeStatusToDb(stripeSubscription.status),
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
    },
  });

  // Update tenant plan
  await db.tenant.update({
    where: { id: tenantId },
    data: { plan: plan.type },
  });
}

async function handlePaymentSucceeded(
  stripeSubscriptionId: string,
  invoice: Stripe.Invoice
) {
  const subscription = await db.subscription.findUnique({
    where: { stripeSubscriptionId },
  });

  if (!subscription) {
    console.error(`Subscription not found: ${stripeSubscriptionId}`);
    return;
  }

  // Create payment record
  await db.payment.create({
    data: {
      subscriptionId: subscription.id,
      stripePaymentId: invoice.payment_intent as string,
      amount: invoice.amount_paid / 100, // Convert from cents
      currency: invoice.currency,
      status: invoice.status === "paid" ? "succeeded" : "failed",
      paidAt: invoice.status === "paid" ? new Date() : null,
    },
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const dbSubscription = await db.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!dbSubscription) {
    console.error(`Subscription not found: ${subscription.id}`);
    return;
  }

  // Update subscription status
  await db.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      status: "canceled",
    },
  });

  // Update tenant plan to FREE
  await db.tenant.update({
    where: { id: dbSubscription.tenantId },
    data: { plan: PlanType.FREE },
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const dbSubscription = await db.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!dbSubscription) {
    console.error(`Subscription not found: ${subscription.id}`);
    return;
  }

  // Get plan from Stripe price
  const priceId = (subscription.items.data[0]?.price.id);
  const plan = await db.plan.findUnique({
    where: { stripePriceId: priceId },
  });

  if (plan) {
    // Update subscription
    await db.subscription.update({
      where: { id: dbSubscription.id },
      data: {
        planId: plan.id,
        status: mapStripeStatusToDb(subscription.status),
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    });

    // Update tenant plan
    await db.tenant.update({
      where: { id: dbSubscription.tenantId },
      data: { plan: plan.type },
    });
  } else {
    // Just update status and dates
    await db.subscription.update({
      where: { id: dbSubscription.id },
      data: {
        status: mapStripeStatusToDb(subscription.status),
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    });
  }
}

function mapStripeStatusToDb(status: string): SubscriptionStatus {
  switch (status) {
    case "active":
      return SubscriptionStatus.active;
    case "trialing":
      return SubscriptionStatus.trialing;
    case "past_due":
    case "unpaid":
      return SubscriptionStatus.past_due;
    case "canceled":
    case "incomplete_expired":
      return SubscriptionStatus.canceled;
    default:
      return SubscriptionStatus.canceled;
  }
}

