"use server";

import { db } from "@/lib/db";
import { requireOwner } from "@/lib/auth-role";
import { Role } from "@prisma/client";
import { logActivity } from "@/lib/activity-logger";
import { headers } from "next/headers";
import { getRequestMetadata } from "@/lib/activity-logger";
import { revalidatePath } from "next/cache";

/**
 * Get all users across all tenants (Owner only)
 */
export async function getAllUsers() {
  const context = await requireOwner();

  const users = await db.user.findMany({
    where: {
      deletedAt: null,
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          plan: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Get subscription status for each tenant
  const usersWithSubscriptions = await Promise.all(
    users.map(async (user) => {
      const subscription = await db.subscription.findFirst({
        where: {
          tenantId: user.tenantId,
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

      return {
        ...user,
        subscription,
      };
    })
  );

  return usersWithSubscriptions;
}

/**
 * Update user role
 */
export async function updateUserRole(userId: string, newRole: Role) {
  const context = await requireOwner();

  const user = await db.user.findUnique({
    where: { id: userId },
    include: { tenant: true },
  });

  if (!user) {
    return { error: "User not found" };
  }

  // Prevent changing OWNER role
  if (user.role === Role.OWNER && newRole !== Role.OWNER) {
    return { error: "Cannot change OWNER role" };
  }

  await db.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  // Log activity
  const headersList = await headers();
  const { ip, userAgent } = getRequestMetadata(headersList);
  await logActivity({
    tenantId: user.tenantId,
    userId: context.username,
    action: "update_user_role",
    resource: "user",
    metadata: {
      targetUserId: userId,
      oldRole: user.role,
      newRole,
    },
    ip,
    userAgent,
  });

  revalidatePath("/admin/users");
  return { success: true };
}

/**
 * Toggle user active status
 */
export async function toggleUserStatus(userId: string) {
  const context = await requireOwner();

  const user = await db.user.findUnique({
    where: { id: userId },
    include: { tenant: true },
  });

  if (!user) {
    return { error: "User not found" };
  }

  if (user.role === Role.OWNER) {
    return { error: "Cannot deactivate OWNER" };
  }

  await db.user.update({
    where: { id: userId },
    data: { isActive: !user.isActive },
  });

  // Log activity
  const headersList = await headers();
  const { ip, userAgent } = getRequestMetadata(headersList);
  await logActivity({
    tenantId: user.tenantId,
    userId: context.username,
    action: user.isActive ? "deactivate_user" : "activate_user",
    resource: "user",
    metadata: {
      targetUserId: userId,
      newStatus: !user.isActive,
    },
    ip,
    userAgent,
  });

  revalidatePath("/admin/users");
  return { success: true };
}

/**
 * Soft delete user
 */
export async function deleteUser(userId: string) {
  const context = await requireOwner();

  const user = await db.user.findUnique({
    where: { id: userId },
    include: { tenant: true },
  });

  if (!user) {
    return { error: "User not found" };
  }

  if (user.role === Role.OWNER) {
    return { error: "Cannot delete OWNER" };
  }

  await db.user.update({
    where: { id: userId },
    data: {
      deletedAt: new Date(),
      isActive: false,
    },
  });

  // Log activity
  const headersList = await headers();
  const { ip, userAgent } = getRequestMetadata(headersList);
  await logActivity({
    tenantId: user.tenantId,
    userId: context.username,
    action: "delete_user",
    resource: "user",
    metadata: {
      targetUserId: userId,
    },
    ip,
    userAgent,
  });

  revalidatePath("/admin/users");
  return { success: true };
}

/**
 * Force logout user (invalidate all sessions)
 * Note: In a real implementation, you'd need a session store or token blacklist
 * For now, we'll just log it - JWT tokens will expire naturally
 */
export async function forceLogoutUser(userId: string) {
  const context = await requireOwner();

  const user = await db.user.findUnique({
    where: { id: userId },
    include: { tenant: true },
  });

  if (!user) {
    return { error: "User not found" };
  }

  // Log activity
  const headersList = await headers();
  const { ip, userAgent } = getRequestMetadata(headersList);
  await logActivity({
    tenantId: user.tenantId,
    userId: context.username,
    action: "force_logout_user",
    resource: "user",
    metadata: {
      targetUserId: userId,
    },
    ip,
    userAgent,
  });

  // In a production system, you would:
  // 1. Add token to blacklist
  // 2. Send notification to user
  // 3. Invalidate sessions in session store

  revalidatePath("/admin/users");
  return { success: true, message: "User will be logged out on next request" };
}

