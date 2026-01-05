import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PlanType, Role } from "@prisma/client";

const COOKIE_NAME = "saas_token";

export type TenantContext = {
  userId: string;
  tenantId: string;
  role: Role;
  plan: PlanType;
  email: string | null;
  name: string | null;
};

/**
 * Unified authentication utility
 * Reads token from cookies, verifies JWT, fetches current status from DB
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

  // Fetch user with active status and verify tenant
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      tenantId: true,
      isActive: true,
      deletedAt: true,
      email: true,
      name: true,
    },
  });

  if (!user || user.tenantId !== tenantId || !user.isActive || user.deletedAt) {
    redirect("/login");
  }

  const tenant = await prisma.tenant.findUnique({
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
    email: user.email,
    name: user.name,
  };
}

/**
 * Check if the user is authenticated without redirecting.
 * Useful for layout checks or optional auth sections.
 */
export async function getSession(): Promise<TenantContext | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifyToken(token);
    if (!payload || typeof payload !== "object" || !("tenantId" in payload)) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      select: { tenantId: true, isActive: true, deletedAt: true, email: true, name: true, role: true }
    });

    if (!user || user.tenantId !== payload.tenantId || !user.isActive || user.deletedAt) return null;

    const tenant = await prisma.tenant.findUnique({
      where: { id: user.tenantId },
      select: { plan: true }
    });

    if (!tenant) return null;

    return {
      userId: payload.userId as string,
      tenantId: user.tenantId,
      role: user.role,
      plan: tenant.plan,
      email: user.email,
      name: user.name,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Compatibility alias for getTenantContext.
 */
export const getAuthPayload = getTenantContext;
