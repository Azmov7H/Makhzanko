import { db } from "@/lib/db";
import { PlanType } from "@prisma/client";
import { redirect } from "next/navigation";

export type Feature = "reports" | "analytics" | "export" | "advanced_accounting";

const PLAN_FEATURES: Record<PlanType, Feature[]> = {
  FREE: [],
  PRO: ["reports", "analytics", "export"],
  BUSINESS: ["reports", "analytics", "export", "advanced_accounting"],
};

/**
 * Check if tenant has access to a specific feature based on their plan
 * Checks for active trial override first, then uses tenant plan
 * Redirects to upgrade page if access is denied
 */
export async function checkPlanAccess(
  tenantId: string,
  feature: Feature
): Promise<boolean> {
  const tenant = await db.tenant.findUnique({
    where: { id: tenantId },
    include: {
      trialOverride: true,
    },
  });

  if (!tenant) {
    redirect("/login");
  }

  // Check if there's an active trial override
  let effectivePlan = tenant.plan;
  if (tenant.trialOverride) {
    const now = new Date();
    if (tenant.trialOverride.expiresAt > now) {
      effectivePlan = tenant.trialOverride.plan;
    }
  }

  const planFeatures = PLAN_FEATURES[effectivePlan] || [];

  if (!planFeatures.includes(feature)) {
    redirect("/dashboard/settings/billing?upgrade=true");
  }

  return true;
}

/**
 * Check if tenant has access to a specific feature (without redirect)
 * Returns boolean only
 * Checks for active trial override first
 */
export async function hasPlanAccess(
  tenantId: string,
  feature: Feature
): Promise<boolean> {
  const tenant = await db.tenant.findUnique({
    where: { id: tenantId },
    include: {
      trialOverride: true,
    },
  });

  if (!tenant) {
    return false;
  }

  // Check if there's an active trial override
  let effectivePlan = tenant.plan;
  if (tenant.trialOverride) {
    const now = new Date();
    if (tenant.trialOverride.expiresAt > now) {
      effectivePlan = tenant.trialOverride.plan;
    }
  }

  const planFeatures = PLAN_FEATURES[effectivePlan] || [];
  return planFeatures.includes(feature);
}

