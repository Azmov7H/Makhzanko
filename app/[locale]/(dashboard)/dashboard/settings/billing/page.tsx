import { getTenantContext } from "@/lib/auth";
import { getCurrentSubscription, getPlans, createCheckoutSession, createCustomerPortalSession } from "@/actions/billing";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, ExternalLink } from "lucide-react";
import { PlanType } from "@prisma/client";
import { redirect } from "next/navigation";
import { PromoCodeRedemption } from "./PromoCodeRedemption";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ upgrade?: string; success?: string; canceled?: string }>;
}) {
  const context = await getTenantContext();
  const params = await searchParams;

  const [currentSubscription, plans] = await Promise.all([
    getCurrentSubscription(),
    getPlans(),
  ]);

  const planNameMap: Record<PlanType, string> = {
    FREE: "Free",
    PRO: "Pro",
    BUSINESS: "Business",
  };

  async function handleUpgrade(planId: string) {
    "use server";
    await createCheckoutSession(planId);
  }

  async function handleManageSubscription() {
    "use server";
    await createCustomerPortalSession();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing & Subscription</h1>
        <p className="text-muted-foreground">Manage your subscription and billing information.</p>
      </div>

      {params.success && (
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="pt-6">
            <p className="text-sm text-green-800">
              Payment successful! Your subscription has been activated.
            </p>
          </CardContent>
        </Card>
      )}

      {params.canceled && (
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardContent className="pt-6">
            <p className="text-sm text-yellow-800">
              Payment was canceled. No changes were made to your account.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                You are currently on the <strong>{planNameMap[context.plan]}</strong> plan.
              </CardDescription>
            </div>
            <Badge variant={context.plan === PlanType.FREE ? "secondary" : "default"}>
              {planNameMap[context.plan]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentSubscription && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <Badge
                  variant={
                    currentSubscription.status === "active"
                      ? "default"
                      : currentSubscription.status === "trialing"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {currentSubscription.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Current Period:</span>
                <span>
                  {new Date(currentSubscription.currentPeriodStart).toLocaleDateString()} -{" "}
                  {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}
                </span>
              </div>
              {currentSubscription.cancelAtPeriodEnd && (
                <div className="rounded-md bg-yellow-50 p-3 text-sm text-yellow-800">
                  Your subscription will be canceled at the end of the current period.
                </div>
              )}
            </div>
          )}

          {currentSubscription && (
            <form action={handleManageSubscription}>
              <Button type="submit" variant="outline" className="w-full sm:w-auto">
                <CreditCard className="mr-2 h-4 w-4" />
                Manage Subscription
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Promo Code Redemption */}
      <PromoCodeRedemption />

      {/* Available Plans */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Available Plans</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => {
            const isCurrentPlan = plan.type === context.plan;
            const features = (plan.features as { name: string }[]) || [];

            return (
              <Card
                key={plan.id}
                className={
                  isCurrentPlan
                    ? "border-primary shadow-md"
                    : "hover:shadow-md transition-shadow"
                }
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{plan.name}</CardTitle>
                    {isCurrentPlan && <Badge>Current</Badge>}
                  </div>
                  <CardDescription>
                    <span className="text-2xl font-bold">
                      ${Number(plan.price).toFixed(2)}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature.name}</span>
                      </li>
                    ))}
                  </ul>
                  {!isCurrentPlan && (
                    <form action={handleUpgrade.bind(null, plan.id)}>
                      <Button type="submit" className="w-full" disabled={isCurrentPlan}>
                        {context.plan === PlanType.FREE ? "Upgrade" : "Switch Plan"}
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  )}
                  {isCurrentPlan && (
                    <Button disabled className="w-full" variant="outline">
                      Current Plan
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

