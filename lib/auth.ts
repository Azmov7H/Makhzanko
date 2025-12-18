import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { PlanType, Role } from "@prisma/client";

const COOKIE_NAME = "saas_token";

export type TenantContext = {
  userId: string;
  tenantId: string;
  role: Role;
  plan: PlanType;
};

/**
 * Unified authentication utility
 * Reads token from cookies, verifies JWT, fetches current plan from DB
 * Redirects to /login on failure
 */
export async function getTenantContext(): Promise<TenantContext> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    redirect("/login");
  }

  const payload = await verifyToken(token);
  
  if (!payload || typeof payload !== "object" || !("tenantId" in payload)) {
    redirect("/login");
  }

  const tenantId = payload.tenantId as string;
  const userId = payload.userId as string;
  const role = payload.role as Role;

  // Fetch current plan from database and verify user is active
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      tenantId: true,
      // Note: isActive and deletedAt will be available after migration
      // For now, we'll check tenantId only
    },
  });

  if (!user || user.tenantId !== tenantId) {
    redirect("/login");
  }
  
  // TODO: Uncomment after migration
  // if (!user.isActive || user.deletedAt) {
  //   redirect("/login");
  // }

  const tenant = await db.tenant.findUnique({
    where: { id: tenantId },
    select: { plan: true },
  });

  if (!tenant) {
    redirect("/login");
  }

  return {
    userId,
    tenantId,
    role,
    plan: tenant.plan,
  };
}

/**
 * Legacy function - kept for backward compatibility
 * @deprecated Use getTenantContext() instead
 */
export async function getAuthPayload(): Promise<{ userId: string; tenantId: string; role: string; plan: string } | null> {
  try {
    const context = await getTenantContext();
    return {
      userId: context.userId,
      tenantId: context.tenantId,
      role: context.role,
      plan: context.plan,
    };
  } catch {
    return null;
  }
}
