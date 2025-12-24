import { getTenantContext } from "@/lib/auth";
import { Separator } from "@/components/ui/separator";
import { getCurrentSubscription, getPlans } from "@/actions/billing";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Sparkles, ShieldCheck, Zap, Crown, Rocket } from "lucide-react";
import { PlanType } from "@prisma/client";
import { PromoCodeRedemption } from "./PromoCodeRedemption";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { getI18n } from "@/lib/i18n/server";

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function BillingPage({
  searchParams,
  params: routeParams,
}: {
  searchParams: Promise<{ upgrade?: string; success?: string; canceled?: string }>;
  params: Promise<{ locale: string }>;
}) {
  const params = await searchParams;
  const { locale } = await routeParams;

  return (
    <Suspense fallback={<BillingSkeleton />}>
  <BillingContent params={params} locale={locale} />
</Suspense>

  );
}

async function BillingContent({
  params,
  locale,
}: {
  params: { upgrade?: string; success?: string; canceled?: string };
  locale: string;
}){
  const context = await getTenantContext();
  const t = await getI18n();

  const [currentSubscription, plans] = await Promise.all([
    getCurrentSubscription(),
    getPlans(),
  ]);

  const planNameMap: Record<PlanType, string> = {
    FREE: t("Common.free") || "Free",
    PRO: "Pro",
    BUSINESS: "Business",
  };

  const planIcons: Record<PlanType, any> = {
    FREE: Zap,
    PRO: Crown,
    BUSINESS: Rocket,
  };

  return (
    <div className="space-y-10 text-start pb-20">
      <div className="relative">
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-12 bg-primary rounded-full" />
        <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
          {t("Settings.billing.title")}
        </h1>
        <p className="text-muted-foreground mt-2 text-lg font-medium">{t("Settings.description")}</p>
      </div>

      {params.success && (
        <Card className="border-none shadow-2xl shadow-emerald-500/10 bg-emerald-500/5 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-700 rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center shadow-inner">
                <Check className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-lg font-black text-emerald-800">
                  {t("Common.success")}
                </p>
                <p className="text-emerald-700/80 font-medium">Your subscription has been activated successfully.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Plan Card */}
      <Card className="border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.05)] bg-card/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl transition-transform group-hover:scale-110 duration-1000" />

        <CardHeader className="p-10 pb-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-black flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-2xl">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                {t("Settings.billing.current_plan")}
              </CardTitle>
              <CardDescription className="text-xl font-medium">
                {t("Settings.plan_desc") || "You are currently on the"} <span className="text-primary font-black uppercase tracking-widest">{planNameMap[context.plan]}</span> {t("Common.plan") || "plan"}.
              </CardDescription>
            </div>
            <Badge variant="outline" className="h-10 px-6 text-base font-black rounded-2xl border-primary/20 bg-primary/5 text-primary shadow-sm hover:bg-primary/10 transition-colors uppercase tracking-widest">
              {planNameMap[context.plan]}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-10 pt-0 relative space-y-6">
          {currentSubscription && (
            <div className="space-y-4 bg-muted/20 p-8 rounded-3xl border border-primary/5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-black uppercase tracking-widest text-xs">{t("Common.status") || "Status"}</span>
                <Badge
                  className="rounded-xl px-4 py-1 font-black tracking-widest text-xs uppercase shadow-sm"
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
              <Separator className="bg-primary/5" />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-black uppercase tracking-widest text-xs">{t("Common.billing_cycle") || "Billing Cycle"}</span>
                <span className="font-bold text-sm bg-card px-4 py-1.5 rounded-xl shadow-inner">
                  {new Date(currentSubscription.currentPeriodStart).toLocaleDateString()} — {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}
                </span>
              </div>
              {currentSubscription.cancelAtPeriodEnd && (
                <div className="rounded-2xl bg-orange-500/10 p-4 text-sm text-orange-700 font-bold border border-orange-500/20 flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                  Your subscription will be canceled at the end of the current period.
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 p-5 rounded-2xl bg-primary/5 border border-primary/10 text-primary font-bold shadow-sm transition-all hover:bg-primary/10">
            <ShieldCheck className="h-6 w-6" />
            <span className="text-sm">{t("Settings.billing.redirect_notice")}</span>
          </div>
        </CardContent>
      </Card>

      <PromoCodeRedemption />

      {/* Pricing Grid */}
      <div className="space-y-10 pt-8">
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-black tracking-tight">{context.plan === PlanType.FREE ? "Ready to scale your business?" : "Change your plan"}</h2>
          <p className="text-muted-foreground text-xl font-medium max-w-2xl mx-auto">Select the best plan tailored for your growing operation.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => {
            const isCurrentPlan = plan.type === context.plan;
            const features = (plan.features as { name: string }[]) || [];
            const Icon = planIcons[plan.type as PlanType] || Sparkles;

            return (
              <Card
                key={plan.id}
                className={
                  isCurrentPlan
                    ? "border-4 border-primary shadow-[0_48px_80px_-16px_rgba(var(--primary),0.2)] relative scale-110 z-10 bg-card backdrop-blur-3xl rounded-[3rem] p-4"
                    : "hover:shadow-3xl transition-all duration-500 border-none bg-card/40 backdrop-blur-xl rounded-[3rem] p-4 opacity-80 hover:opacity-100 hover:-translate-y-2"
                }
              >
                {isCurrentPlan && (
                  <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 px-8 py-2 rounded-full font-black tracking-[0.2em] bg-primary text-white shadow-2xl border-4 border-card">
                    {t("Common.active") || "ACTIVE"}
                  </Badge>
                )}

                <CardHeader className="text-center pt-8 pb-4">
                  <div className={`mx-auto w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-2xl ${isCurrentPlan ? 'bg-primary text-white animate-bounce' : 'bg-primary/10 text-primary'}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-3xl font-black uppercase tracking-tight">{plan.name}</CardTitle>
                  <CardDescription>
                    <div className="flex items-baseline justify-center gap-1 mt-6 text-foreground">
                      <span className="text-5xl font-black tabular-nums">
                        {Number(plan.price).toFixed(0)}
                      </span>
                      <span className="text-muted-foreground font-black text-xs uppercase tracking-widest">{t("Common.currency_egp") || "EGP"} / MO</span>
                    </div>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8 pb-10">
                  <div className="h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
                  <ul className="space-y-4">
                    {features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 group">
                        <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                          <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3px]" />
                        </div>
                        <span className="font-bold text-sm text-muted-foreground group-hover:text-foreground transition-colors">{feature.name}</span>
                      </li>
                    ))}
                  </ul>

                  {!isCurrentPlan ? (
                    <PaymentMethodSelector
                      planId={plan.id}
                      planName={plan.name}
                      price={Number(plan.price)}
                      disabled={isCurrentPlan}
                      buttonText={context.plan === PlanType.FREE ? "Upgrade Now" : "Switch Plan"}
                    />
                  ) : (
                    <Button disabled className="w-full h-14 rounded-[1.5rem] font-black text-lg bg-primary/20 text-primary border-2 border-primary/20" variant="ghost">
                      {t("Common.active") || "Current Active Plan"}
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
    <div className="space-y-10">
      <div className="space-y-3">
        <Skeleton className="h-12 w-1/3 rounded-2xl" />
        <Skeleton className="h-6 w-1/2 rounded-xl" />
      </div>
      <Skeleton className="h-80 w-full rounded-[2.5rem]" />
      <div className="grid grid-cols-3 gap-8 pt-10">
        <Skeleton className="h-[600px] rounded-[3rem]" />
        <Skeleton className="h-[650px] rounded-[3rem] scale-105" />
        <Skeleton className="h-[600px] rounded-[3rem]" />
      </div>
    </div>
  );
}

