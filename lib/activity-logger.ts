import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export interface ActivityLogData {
  tenantId: string;
  userId: string;
  action: string;
  resource?: string;
  metadata?: Prisma.InputJsonValue;
  ip?: string | null;
  userAgent?: string | null;
}

/**
 * Log activity to database
 * Safe to call - errors are caught and logged but don't throw
 */
export async function logActivity(data: ActivityLogData): Promise<void> {
  try {
    const logData: Prisma.ActivityLogCreateInput = {
      tenant: { connect: { id: data.tenantId } },
      user: { connect: { id: data.userId } },
      action: data.action,
      resource: data.resource || null,
      metadata: data.metadata ? (data.metadata as Prisma.InputJsonValue) : Prisma.JsonNull,
      ip: data.ip || null,
      userAgent: data.userAgent || null,
    };

    await db.activityLog.create({
      data: logData,
    });
  } catch (error) {
    // Don't throw - logging failures shouldn't break the app
    console.error("Failed to log activity:", error);
  }
}

type HeadersLike = {
  get: (key: string) => string | null;
} | Record<string, string | string[] | undefined>;

/**
 * Get user IP and User-Agent from request headers
 * @param headers Can be either a Headers object or a plain object with header keys
 */
export function getRequestMetadata(headers: HeadersLike): {
  ip: string | undefined;
  userAgent: string | undefined;
} {
  const getHeader = (key: string): string | null => {
    if (typeof (headers as any).get === 'function') {
      return (headers as { get: (key: string) => string | null }).get(key);
    }
    const value = (headers as Record<string, string | string[]>)[key.toLowerCase()];
    if (Array.isArray(value)) {
      return value[0] || null;
    }
    return value || null;
  };

  const forwarded = getHeader("x-forwarded-for");
  const ip = forwarded?.split(",")[0] || getHeader("x-real-ip") || undefined;
  const userAgent = getHeader("user-agent") || undefined;

  return { ip, userAgent };
}

