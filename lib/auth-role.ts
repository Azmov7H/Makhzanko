import { getTenantContext, type TenantContext } from "@/lib/auth";
import { redirect } from "next/navigation";

// Define a local Role type since we removed @prisma/client
export type Role = "OWNER" | "ADMIN" | "MANAGER" | "STAFF";

/**
 * Require specific role to access resource
 * Redirects to /login if not authenticated or /dashboard if wrong role
 */
export async function requireRole(requiredRole: Role): Promise<TenantContext> {
  const context = await getTenantContext();

  // OWNER can access everything
  if (context.role === "OWNER") {
    return context;
  }

  // Check if user has required role
  const roleHierarchy: Record<Role, number> = {
    OWNER: 4,
    ADMIN: 3,
    MANAGER: 2,
    STAFF: 1,
  };

  const userLevel = roleHierarchy[context.role as Role] || 0;
  const requiredLevel = roleHierarchy[requiredRole as Role] || 0;

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
  // Legacy owner session check - now disabled or needs migration to REST API
  // const { getOwnerSession } = await import("@/_legacy_backend/actions/admin/auth");
  // const session = await getOwnerSession();
  
  const session = { authenticated: false, username: "" }; // Placeholder

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

    if (context.role === "OWNER") {
      return true;
    }

    const roleHierarchy: Record<Role, number> = {
      OWNER: 4,
      ADMIN: 3,
      MANAGER: 2,
      STAFF: 1,
    };

    const userLevel = roleHierarchy[context.role as Role] || 0;
    const requiredLevel = roleHierarchy[requiredRole as Role] || 0;

    return userLevel >= requiredLevel;
  } catch {
    return false;
  }
}

