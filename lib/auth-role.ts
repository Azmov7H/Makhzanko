import { getTenantContext, type TenantContext } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

/**
 * Require specific role to access resource
 * Redirects to /login if not authenticated or /dashboard if wrong role
 */
export async function requireRole(requiredRole: Role): Promise<TenantContext> {
  const context = await getTenantContext();

  // OWNER can access everything
  if (context.role === Role.OWNER) {
    return context;
  }

  // Check if user has required role
  const roleHierarchy: Record<Role, number> = {
    OWNER: 4,
    ADMIN: 3,
    MANAGER: 2,
    STAFF: 1,
  };

  const userLevel = roleHierarchy[context.role] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;

  if (userLevel < requiredLevel) {
    redirect("/dashboard");
  }

  return context;
}

/**
 * Require OWNER role specifically (for admin panel)
 */
export async function requireOwner(): Promise<TenantContext> {
  const context = await getTenantContext();

  if (context.role !== Role.OWNER) {
    redirect("/dashboard");
  }

  return context;
}

/**
 * Check if user has at least the required role (returns boolean)
 */
export async function hasRole(requiredRole: Role): Promise<boolean> {
  try {
    const context = await getTenantContext();

    if (context.role === Role.OWNER) {
      return true;
    }

    const roleHierarchy: Record<Role, number> = {
      OWNER: 4,
      ADMIN: 3,
      MANAGER: 2,
      STAFF: 1,
    };

    const userLevel = roleHierarchy[context.role] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    return userLevel >= requiredLevel;
  } catch {
    return false;
  }
}

