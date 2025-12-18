"use server";

import { db } from "@/lib/db";
import { requireOwner } from "@/lib/auth-role";

/**
 * Get dashboard analytics for owner
 */
export async function getOwnerAnalytics() {
  await requireOwner();

  // Total tenants
  const totalTenants = await db.tenant.count();

  // Active users (not deleted, isActive)
  const activeUsers = await db.user.count({
    where: {
      deletedAt: null,
      isActive: true,
    },
  });

  // Active subscriptions
  const activeSubscriptions = await db.subscription.count({
    where: {
      status: {
        in: ["active", "trialing"],
      },
    },
  });

  // Calculate revenue (sum of all payments)
  const payments = await db.payment.findMany({
    where: {
      status: "succeeded",
    },
  });

  const totalRevenue = payments.reduce((sum, payment) => {
    return sum + Number(payment.amount);
  }, 0);

  // Trial conversions (users who had trial and then subscribed)
  // This is simplified - in production you'd track trial start/end more carefully
  const trialsCount = await db.trialOverride.count();
  const convertedTrials = await db.subscription.count({
    where: {
      status: {
        in: ["active"],
      },
    },
  });

  const conversionRate =
    trialsCount > 0 ? (convertedTrials / trialsCount) * 100 : 0;

  // Most used features (from activity logs)
  const activityStats = await db.activityLog.groupBy({
    by: ["action"],
    _count: {
      action: true,
    },
    orderBy: {
      _count: {
        action: "desc",
      },
    },
    take: 5,
  });

  // Plan distribution
  const planDistribution = await db.tenant.groupBy({
    by: ["plan"],
    _count: {
      plan: true,
    },
  });

  return {
    totalTenants,
    activeUsers,
    activeSubscriptions,
    totalRevenue,
    conversionRate: Math.round(conversionRate * 100) / 100,
    topActions: activityStats,
    planDistribution,
  };
}

