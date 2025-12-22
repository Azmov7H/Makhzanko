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

/**
 * Get monthly platform-wide chart data (Revenue & Growth)
 */
export async function getPlatformChartData() {
  await requireOwner();

  const today = new Date();
  // Get last 7 months
  const startDate = new Date(today.getFullYear(), today.getMonth() - 6, 1);

  // 1. Subscription Revenue (Successful payments)
  const payments = await db.payment.findMany({
    where: {
      status: "succeeded",
      createdAt: { gte: startDate },
    },
    select: {
      createdAt: true,
      amount: true,
    },
  });

  // 2. Organization Growth (New tenants)
  const tenants = await db.tenant.findMany({
    where: {
      createdAt: { gte: startDate },
    },
    select: {
      createdAt: true,
    },
  });

  // Process data into months
  const months = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
    months.push({
      date: d,
      name: d.toLocaleString("ar-SA", { month: "long" }),
      key: `${d.getFullYear()}-${d.getMonth()}`,
    });
  }

  const revenueMap = new Map();
  payments.forEach((p) => {
    const d = new Date(p.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const current = revenueMap.get(key) || 0;
    revenueMap.set(key, current + Number(p.amount));
  });

  const tenantMap = new Map();
  tenants.forEach((t) => {
    const d = new Date(t.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const current = tenantMap.get(key) || 0;
    tenantMap.set(key, current + 1);
  });

  return {
    revenueData: months.map((m) => ({
      name: m.name,
      value: revenueMap.get(m.key) || 0,
    })),
    userGrowthData: months.map((m) => ({
      name: m.name,
      users: tenantMap.get(m.key) || 0,
    })),
  };
}

/**
 * Get resource usage statistics across all tenants (Feature 2)
 */
export async function getPlatformResourceUsage() {
  await requireOwner();

  // Get all tenants with their counts
  const tenantsUsage = await db.tenant.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      plan: true,
      _count: {
        select: {
          products: true,
          users: true,
          warehouses: true
        }
      }
    }
  });

  // Sort by product count
  const topByProducts = [...tenantsUsage]
    .sort((a, b) => b._count.products - a._count.products)
    .slice(0, 5);

  // Sort by user count
  const topByUsers = [...tenantsUsage]
    .sort((a, b) => b._count.users - a._count.users)
    .slice(0, 5);

  // Calculate averages per plan
  const planStats = {
    FREE: { count: 0, products: 0, users: 0 },
    PRO: { count: 0, products: 0, users: 0 },
    BUSINESS: { count: 0, products: 0, users: 0 },
  };

  tenantsUsage.forEach(t => {
    const plan = t.plan as keyof typeof planStats;
    if (planStats[plan]) {
      planStats[plan].count++;
      planStats[plan].products += t._count.products;
      planStats[plan].users += t._count.users;
    }
  });

  return {
    topByProducts,
    topByUsers,
    planStats: Object.entries(planStats).map(([name, stats]) => ({
      name,
      avgProducts: stats.count > 0 ? Math.round(stats.products / stats.count) : 0,
      avgUsers: stats.count > 0 ? Math.round(stats.users / stats.count) : 0,
      totalTenants: stats.count
    }))
  };
}

