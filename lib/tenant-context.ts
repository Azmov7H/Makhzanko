import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/jwt";

export type TenantContext = {
  userId: string;
  tenantId: string;
  role: string;
  plan: string;
};

/**
 * Unified tenant context utility
 * Reads token from cookies, verifies JWT, and returns tenant context
 * Redirects to /login on failure
 */
export async function getTenantContext(): Promise<TenantContext> {
  const cookieStore = await cookies();
  const token = cookieStore.get("saas_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const payload = await verifyToken(token);

  if (!payload || !payload.userId || !payload.tenantId) {
    redirect("/login");
  }

  return {
    userId: payload.userId as string,
    tenantId: payload.tenantId as string,
    role: (payload.role as string) || "STAFF",
    plan: (payload.plan as string) || "FREE",
  };
}

