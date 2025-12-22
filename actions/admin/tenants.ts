"use server";

import { db } from "@/lib/db";
import { requireOwner } from "@/lib/auth-role";
import { logActivity } from "@/lib/activity-logger";
import { headers } from "next/headers";
import { getRequestMetadata } from "@/lib/activity-logger";

/**
 * Get all tenants
 */
export async function getAllTenants() {
  await requireOwner();

  const tenants = await db.tenant.findMany({
    include: {
      _count: {
        select: {
          users: true,
          products: true,
          sales: true,
        },
      },
      subscriptions: {
        where: {
          status: {
            in: ["active", "trialing"],
          },
        },
        include: {
          plan: true,
        },
        take: 1,
        orderBy: {
          createdAt: "desc",
        },
      },
      trialOverride: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return tenants;
}

