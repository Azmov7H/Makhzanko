"use server";

import { db } from "@/lib/db";
import { requireOwner } from "@/lib/auth-role";

/**
 * Get activity logs with filters
 */
export async function getActivityLogs(options?: {
  tenantId?: string;
  userId?: string;
  action?: string;
  limit?: number;
  offset?: number;
}) {
  await requireOwner();

  const limit = options?.limit || 100;
  const offset = options?.offset || 0;

  const where: {
    tenantId?: string;
    userId?: string;
    action?: string;
  } = {};

  if (options?.tenantId) {
    where.tenantId = options.tenantId;
  }

  if (options?.userId) {
    where.userId = options.userId;
  }

  if (options?.action) {
    where.action = options.action;
  }

  const logs = await db.activityLog.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      tenant: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: offset,
  });

  const total = await db.activityLog.count({ where });

  return {
    logs,
    total,
    hasMore: offset + limit < total,
  };
}

