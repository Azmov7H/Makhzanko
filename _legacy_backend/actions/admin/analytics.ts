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

  return {
    totalTenants,
    activeUsers,
    topActions: activityStats,
  };
}

/**
 * Get monthly platform-wide chart data (Growth)
 */
export async function getPlatformChartData() {
  await requireOwner();

  const today = new Date();
  // Get last 7 months
  const startDate = new Date(today.getFullYear(), today.getMonth() - 6, 1);

  // Organization Growth (New tenants)
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

  const tenantMap = new Map();
  tenants.forEach((t) => {
    const d = new Date(t.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const current = tenantMap.get(key) || 0;
    tenantMap.set(key, current + 1);
  });

  return {
    userGrowthData: months.map((m) => ({
      name: m.name,
      users: tenantMap.get(m.key) || 0,
    })),
  };
}

/**
 * Get resource usage statistics across all tenants
 */
export async function getPlatformResourceUsage() {
  await requireOwner();

  // Get all tenants with their counts
  const tenantsUsage = await db.tenant.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
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

  return {
    topByProducts,
    topByUsers,
  };
}

