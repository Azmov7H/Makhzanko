import { getTenantContext } from "@/lib/auth";
import { Separator } from "@/components/ui/separator";
import { getCurrentSubscription, getPlans } from "@/actions/billing";
import { createPaymobCheckoutSession } from "@/actions/paymob-billing";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, ExternalLink, ShieldCheck } from "lucide-react";
import { PlanType } from "@prisma/client";
import { redirect } from "next/navigation";
import { PromoCodeRedemption } from "./PromoCodeRedemption";
import { PaymentMethodSelector } from "./PaymentMethodSelector";

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ upgrade?: string; success?: string; canceled?: string }>;
}) {
  const params = await searchParams;

  return (
    <Suspense fallback={<BillingSkeleton />}>
      <BillingContent params={params} />
    </Suspense>
  );
}

async function BillingContent({ params }: { params: { upgrade?: string; success?: string; canceled?: string } }) {
  const context = await getTenantContext();

  const [currentSubscription, plans] = await Promise.all([
    getCurrentSubscription(),
    getPlans(),
  ]);

  const planNameMap: Record<PlanType, string> = {
    FREE: "Free",
    PRO: "Pro",
    BUSINESS: "Business",
  };

  return (
    <div className="space-y-6 text-start">
      <div>
        <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Billing & Subscription
        </h1>
        <p className="text-muted-foreground mt-1">Manage your subscription and billing information.</p>
      </div>

      {params.success && (
        <Card className="border-green-500/20 bg-green-500/5 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-sm font-bold text-green-700">
                Payment successful! Your subscription has been activated.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {params.canceled && (
        <Card className="border-yellow-500/20 bg-yellow-500/5 backdrop-blur-xl">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-yellow-700">
              Payment was canceled. No changes were made to your account.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Current Plan */}
      <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Current Plan</CardTitle>
              <CardDescription className="text-lg">
                You are currently on the <strong className="text-primary uppercase tracking-wider">{planNameMap[context.plan]}</strong> plan.
              </CardDescription>
            </div>
            <Badge variant={context.plan === PlanType.FREE ? "secondary" : "default"} className="h-8 px-4 text-sm font-bold rounded-lg shadow-sm">
              {planNameMap[context.plan]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentSubscription && (
            <div className="space-y-3 bg-muted/30 p-4 rounded-xl border border-primary/5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">Status:</span>
                <Badge
                  className="rounded-lg font-bold"
                  variant={
                    currentSubscription.status === "active"
                      ? "default"
                      : currentSubscription.status === "trialing"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {currentSubscription.status.toUpperCase()}
                </Badge>
              </div>
              <Separator className="bg-primary/5" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">Current Period:</span>
                <span className="font-bold">
                  {new Date(currentSubscription.currentPeriodStart).toLocaleDateString()} -{" "}
                  {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}
                </span>
              </div>
              {currentSubscription.cancelAtPeriodEnd && (
                <div className="rounded-xl bg-yellow-500/10 p-3 text-sm text-yellow-700 font-bold border border-yellow-500/20">
                  Your subscription will be canceled at the end of the current period.
                </div>
              )}
            </div>
          )}

          {currentSubscription && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-primary/5 border border-primary/10 text-primary text-sm font-bold shadow-sm">
              <ShieldCheck className="h-5 w-5" />
              Your subscription is managed securely via Paymob.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Promo Code Redemption */}
      <PromoCodeRedemption />

      {/* Available Plans */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black tracking-tight">{context.plan === PlanType.FREE ? "Ready to scale?" : "Change your plan"}</h2>
          <p className="text-muted-foreground mt-1">Select the best plan for your growing business needs.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const isCurrentPlan = plan.type === context.plan;
            const features = (plan.features as { name: string }[]) || [];

            return (
              <Card
                key={plan.id}
                className={
                  isCurrentPlan
                    ? "border-2 border-primary shadow-2xl relative scale-105 z-10 bg-card/80 backdrop-blur-xl rounded-3xl"
                    : "hover:shadow-xl transition-all duration-300 border-none bg-card/40 backdrop-blur-xl rounded-3xl grayscale-[0.5] hover:grayscale-0"
                }
              >
                {isCurrentPlan && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 px-6 py-1 rounded-full font-black tracking-widest bg-primary text-white shadow-lg">
                    CURRENT
                  </Badge>
                )}
                <CardHeader className="text-center pt-8">
                  <CardTitle className="text-2xl font-black">{plan.name}</CardTitle>
                  <CardDescription>
                    <div className="flex items-baseline justify-center gap-1 mt-4 text-foreground">
                      <span className="text-4xl font-black">
                        ${Number(plan.price).toFixed(0)}
                      </span>
                      <span className="text-muted-foreground font-medium">/month</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pb-8">
                  <Separator className="bg-primary/5" />
                  <ul className="space-y-3">
                    {features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm">
                        <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="font-medium text-muted-foreground">{feature.name}</span>
                      </li>
                    ))}
                  </ul>
                  {!isCurrentPlan && (
                    <PaymentMethodSelector
                      planId={plan.id}
                      planName={plan.name}
                      price={Number(plan.price)}
                      disabled={isCurrentPlan}
                      buttonText={context.plan === PlanType.FREE ? "Upgrade Now" : "Switch Plan"}
                    />
                  )}
                  {isCurrentPlan && (
                    <Button disabled className="w-full h-12 rounded-2xl font-black text-lg" variant="secondary">
                      Your Active Plan
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

function BillingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-1/3 rounded-xl" />
        <Skeleton className="h-5 w-1/2 rounded-lg" />
      </div>
      <Skeleton className="h-64 w-full rounded-3xl" />
      <Skeleton className="h-[500px] w-full rounded-3xl" />
    </div>
  );
}

