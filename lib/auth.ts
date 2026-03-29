import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "saas_token";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export type TenantContext = {
  userId: string;
  tenantId: string;
  role: string;
  email: string | null;
  name: string | null;
};

/**
 * Unified authentication utility
 * Reads token from cookies and fetches current status from Rust API
 * Redirects to /login on failure
 */
export async function getTenantContext(): Promise<TenantContext> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Cookie': `saas_token=${token}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      redirect("/login");
    }

    const user = await res.json();
    return {
      userId: user.id,
      tenantId: user.tenantId,
      role: user.role,
      email: user.email,
      name: user.name,
    };
  } catch (error) {
    redirect("/login");
  }
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

    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Cookie': `saas_token=${token}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!res.ok) return null;

    const user = await res.json();
    return {
      userId: user.id,
      tenantId: user.tenantId,
      role: user.role,
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
