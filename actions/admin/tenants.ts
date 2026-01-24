"use server";

import { db } from "@/lib/db";
import { requireOwner } from "@/lib/auth-role";

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
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return tenants;
}

