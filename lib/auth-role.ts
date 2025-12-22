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
 * Require OWNER session (for owner panel)
 * Now checks for separate owner authentication
 */
export async function requireOwner(): Promise<{ username: string }> {
  const { getOwnerSession } = await import("@/actions/admin/auth");
  const session = await getOwnerSession();

  if (!session || !session.authenticated) {
    redirect("/admin/login");
  }

  return { username: session.username };
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

