import { getTenantContext } from "@/lib/auth";
import { getCurrentSubscription, getPlans } from "@/actions/billing";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, ShieldCheck, Zap, Crown, Rocket } from "lucide-react";
import { PlanType } from "@prisma/client";
import { PromoCodeRedemption } from "./PromoCodeRedemption";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { getI18n, getLocale } from "@/lib/i18n/server";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import React from "react";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ upgrade?: string; success?: string; canceled?: string; cycle?: string }>;
}) {
  const params = await searchParams;

  return (
    <Suspense fallback={<BillingSkeleton />}>
      <BillingContent params={params} />
    </Suspense>
  );
}

async function BillingContent({
  params,
}: {
  params: { upgrade?: string; success?: string; canceled?: string; cycle?: string };
}) {
  const context = await getTenantContext();
  const locale = (await getLocale()) as "en" | "ar";
  const t = await getI18n(locale);

  const [currentSubscription, plans] = await Promise.all([
    getCurrentSubscription(),
    getPlans(),
  ]);

  const selectedCycle = params.cycle || "monthly";

  // Filter and Sort Plans for Display
  const basePlans = plans.filter(p => p.type !== "FREE");

  // Logic to find the specific plan for the selected cycle
  const displayPlans = [PlanType.PRO, PlanType.BUSINESS].map(type => {
    let plan;
    if (selectedCycle === "annual") {
      plan = basePlans.find(p => p.type === type && p.name.includes("Annual"));
    } else if (selectedCycle === "quarterly") {
      plan = basePlans.find(p => p.type === type && p.name.includes("3-Months"));
    } else {
      plan = basePlans.find(p => p.type === type && !p.name.includes("Annual") && !p.name.includes("3-Months"));
    }
    return plan;
  }).filter(Boolean);

  const planIcons: Record<PlanType, any> = {
    FREE: Zap,
    PRO: Crown,
    BUSINESS: Rocket,
  };

  return (
    <div className="space-y-16 text-start pb-32 max-w-6xl mx-auto px-6 pt-10">
      {/* Premium Minimal Header */}
      <div className="flex flex-col items-start gap-10">
        <div className="space-y-4">
          <Badge className="bg-primary/5 text-primary border-primary/10 px-4 py-1.5 rounded-full font-black text-[10px] tracking-[0.2em] uppercase">
            {t("Settings.billing.title")}
          </Badge>
          <div className="flex items-center gap-4">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[0.95] max-w-2xl">
              Choose the right plan <br />
              <span className="text-muted-foreground/30">for your scale.</span>
            </h1>
            <Badge variant="outline" className="border-dashed border-primary/20 text-primary/30 font-black text-[9px] px-3 py-1 rounded-full uppercase scale-75 -ml-8 mt-10">V2.1 ACTIVE</Badge>
          </div>
        </div>

        {/* Minimalist Switcher */}
        <div className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-[2.5rem] border border-border/40 backdrop-blur-sm">
          {[
            { id: "monthly", label: t("Settings.billing.monthly") },
            { id: "quarterly", label: t("Settings.billing.quarterly"), discount: "10% off" },
            { id: "annual", label: t("Settings.billing.annual"), discount: "20% off" }
          ].map((cycle) => (
            <Link
              key={cycle.id}
              href={`?cycle=${cycle.id}`}
              className={`relative px-8 py-3.5 rounded-[2rem] text-[11px] font-black transition-all duration-500 uppercase tracking-widest flex items-center gap-2 ${selectedCycle === cycle.id
                ? "bg-white text-primary shadow-[0_10px_30px_-5px_rgba(var(--primary),0.1)] scale-105"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {cycle.label}
              {cycle.discount && (
                <span className={`hidden md:inline-block text-[8px] px-2 py-0.5 rounded-full ${selectedCycle === cycle.id ? 'bg-primary/10 text-primary' : 'bg-muted-foreground/10 text-muted-foreground'}`}>
                  {cycle.discount}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {params.success && (
        <div className="bg-emerald-500/5 border border-emerald-200/50 rounded-[3rem] p-10 animate-in fade-in zoom-in-95 duration-1000">
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-start">
            <div className="h-16 w-16 rounded-[2rem] bg-emerald-500 flex items-center justify-center shadow-2xl animate-bounce">
              <Check className="h-10 w-10 text-white stroke-[3px]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-emerald-950 tracking-tight">{t("Common.success")}!</h3>
              <p className="text-emerald-700/80 font-bold text-lg leading-relaxed">Your premium account has been activated. All features are now available.</p>
            </div>
          </div>
        </div>
      )}

      {/* Modern Layout */}
      <div className="grid lg:grid-cols-12 gap-20">

        {/* Left: Subscription Info */}
        <div className="lg:col-span-4 space-y-12">
          <div className="space-y-10 group">
            <div className="space-y-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">{t("Settings.billing.current_plan")}</h2>
              <div className="flex items-center gap-5">
                <span className="text-5xl font-black text-foreground uppercase tracking-tighter italic">{context.plan}</span>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-none px-5 py-1 rounded-full font-black text-[9px] tracking-widest">ACTIVE</Badge>
              </div>
            </div>

            {currentSubscription && (
              <div className="space-y-4">
                <div className="flex justify-between items-center py-5 border-b border-border/40 group/item">
                  <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.2em]">{t("Common.status")}</span>
                  <Badge variant="secondary" className="font-black text-[10px] uppercase px-4 py-1">{(currentSubscription.status as any)}</Badge>
                </div>
                <div className="flex justify-between items-center py-5 border-b border-border/40 group/item">
                  <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.2em]">{t("Settings.billing.active_until")}</span>
                  <span className="text-sm font-black text-foreground/80">
                    {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-primary/5 rounded-[2.5rem] p-8 space-y-5 border border-primary/10 transition-colors hover:bg-primary/10">
            <ShieldCheck className="h-10 w-10 text-primary" />
            <p className="text-sm font-bold text-primary/70 leading-relaxed">
              {t("Settings.billing.redirect_notice")}
            </p>
          </div>

          <PromoCodeRedemption />
        </div>

        {/* Right: Premium Tier Selection */}
        <div className="lg:col-span-8">
          <div className="grid md:grid-cols-2 gap-8">
            {displayPlans.map((plan: any) => {
              const isBusiness = plan.type === PlanType.BUSINESS;
              const isCurrent = plan.type === context.plan;

              // Calculate Pricing
              const totalAmount = Number(plan.price);
              const monthlyPrice = selectedCycle === "annual"
                ? totalAmount / 12
                : selectedCycle === "quarterly"
                  ? totalAmount / 3
                  : totalAmount;

              const displayPeriod = selectedCycle === "annual"
                ? t("Settings.billing.annual")
                : selectedCycle === "quarterly"
                  ? t("Settings.billing.quarterly")
                  : t("Settings.billing.monthly");

              return (
                <div
                  key={plan.id}
                  className={`relative group rounded-[3.5rem] transition-all duration-700 hover:-translate-y-4 ${isBusiness
                    ? "bg-foreground text-background shadow-[0_80px_120px_-30px_rgba(0,0,0,0.3)]"
                    : "bg-white border border-border/60 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)]"
                    }`}
                >
                  {isCurrent && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 scale-110">
                      <Badge className="bg-primary text-white px-10 py-2.5 rounded-full font-black text-[8px] tracking-[0.4em] uppercase border-4 border-background shadow-2xl">
                        {t("Common.active")}
                      </Badge>
                    </div>
                  )}

                  <div className="p-12 space-y-12 flex flex-col h-full">
                    <div className="space-y-8">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="text-3xl font-black uppercase tracking-tighter italic">{plan.name.split(" ")[0]}</h3>
                          <p className={`text-[10px] font-black uppercase tracking-[0.3em] opacity-40`}>
                            {t(`Dashboard.plans.${plan.type}`)}
                          </p>
                        </div>
                        {planIcons[plan.type as PlanType] && (
                          <div className={`p-4 rounded-[2rem] shadow-inner ${isBusiness ? 'bg-white/10' : 'bg-primary/5'}`}>
                            {React.createElement(planIcons[plan.type as PlanType], {
                              className: `h-8 w-8 ${isBusiness ? 'text-white' : 'text-primary'}`
                            })}
                          </div>
                        )}
                      </div>

                      {/* Explicit Pricing Logic */}
                      <div className="space-y-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-7xl font-black tabular-nums tracking-tighter">
                            {Math.round(monthlyPrice).toLocaleString()}
                          </span>
                          <div className="flex flex-col items-start leading-[1.2]">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">{t("Common.currency_egp")}</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">/ month</span>
                          </div>
                        </div>
                        {selectedCycle !== "monthly" && (
                          <Badge variant="outline" className={`border-none px-4 py-1 font-black text-[9px] uppercase tracking-widest ${isBusiness ? 'bg-white/10 text-white' : 'bg-muted text-muted-foreground'}`}>
                            Billed {displayPeriod}: {totalAmount.toLocaleString()} {t("Common.currency_egp")}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className={`h-px w-full ${isBusiness ? 'bg-white/10' : 'bg-border/30'}`} />

                    <ul className="flex-grow space-y-6">
                      {((plan.features as any[]) || []).map((f, i) => (
                        <li key={i} className="flex items-start gap-4 group/item">
                          <div className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all group-hover/item:scale-125 ${isBusiness ? 'bg-white/20' : 'bg-emerald-500/10'}`}>
                            <Check className={`h-3 w-3 stroke-[4px] ${isBusiness ? 'text-white' : 'text-emerald-600'}`} />
                          </div>
                          <span className={`text-sm font-bold leading-tight ${isBusiness ? 'text-white/80' : 'text-muted-foreground'}`}>{f.name}</span>
                        </li>
                      ))}
                    </ul>

                    {!isCurrent ? (
                      <PaymentMethodSelector
                        planId={plan.id}
                        planName={plan.name}
                        price={Math.round(monthlyPrice)}
                        disabled={isCurrent}
                        buttonText={context.plan === PlanType.FREE ? "Get Started" : "Upgrade Plan"}
                      />
                    ) : (
                      <Button
                        disabled
                        className={`w-full h-18 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[10px] border-2 shadow-xl ${isBusiness ? 'bg-white/10 border-white/20 text-white' : 'bg-muted/50 border-border/50 text-muted-foreground'
                          }`}
                        variant="ghost"
                      >
                        {t("Common.active")}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function BillingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-32 space-y-20">
      <div className="space-y-8">
        <Skeleton className="h-24 w-2/3 rounded-[3rem]" />
        <Skeleton className="h-16 w-[450px] rounded-[2.5rem]" />
      </div>
      <div className="grid lg:grid-cols-12 gap-20">
        <div className="lg:col-span-4 space-y-12">
          <Skeleton className="h-48 w-full rounded-[3rem]" />
          <Skeleton className="h-72 w-full rounded-[3rem]" />
        </div>
        <div className="lg:col-span-8 grid md:grid-cols-2 gap-10">
          <Skeleton className="h-[750px] w-full rounded-[4rem]" />
          <Skeleton className="h-[750px] w-full rounded-[4rem]" />
        </div>
      </div>
    </div>
  );
}
