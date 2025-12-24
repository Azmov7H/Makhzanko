import { getTenantContext } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";
import { Store, CreditCard, Users, User, FileText } from "lucide-react";
import { db } from "@/lib/db";
import { GeneralSettings } from "./_components/GeneralSettings";
import { TeamSettings } from "./_components/TeamSettings";
import { Button } from "@/components/ui/button";
import { ProfileSettings } from "./_components/ProfileSettings";
import { InvoiceSettings } from "./_components/InvoiceSettings";

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type Params = {
  locale: string;
};

export default async function SettingsPage({ params }: { params: Params }) {
  const { locale } = await params;

  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsContent locale={locale} />
    </Suspense>
  );
}

async function SettingsContent({ locale }: { locale: string }) {
  const context = await getTenantContext();
  const t = await getI18n(locale as Locale);

  // Fetch data for settings
  const [tenant, users, currentUser, invoiceSettings] = await Promise.all([
    db.tenant.findUnique({
      where: { id: context.tenantId },
      select: { name: true, plan: true }
    }),
    db.user.findMany({
      where: { tenantId: context.tenantId },
      select: { id: true, email: true, name: true, role: true, canDeferred: true },
      orderBy: { createdAt: "asc" }
    }),
    db.user.findUnique({
      where: { id: context.userId },
      select: { name: true, email: true, role: true }
    }),
    db.invoiceSettings.findUnique({
      where: { tenantId: context.tenantId }
    })
  ]);

  if (!tenant || !currentUser) {
    return <div className="p-12 text-center text-destructive font-bold">Error loading settings</div>;
  }

  interface InvoiceSettingsState {
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  templateStyle: string;
  showTax: boolean;
  showDiscount: boolean;
  showHeader: boolean;
  showFooter: boolean;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyTaxId: string;
  footerNotes: string;
}

const invoiceSettingsState: InvoiceSettingsState = {
  primaryColor: invoiceSettings?.primaryColor ?? "#000000",
  accentColor: invoiceSettings?.accentColor ?? "#ffffff",
  fontFamily: invoiceSettings?.fontFamily ?? "Inter",
  templateStyle: invoiceSettings?.templateStyle ?? "default",
  showTax: invoiceSettings?.showTax ?? false,
  showDiscount: invoiceSettings?.showDiscount ?? false,
  showHeader: true,
  showFooter: true,
  companyAddress: invoiceSettings?.companyAddress ?? "",
  companyPhone: invoiceSettings?.companyPhone ?? "",
  companyEmail: invoiceSettings?.companyEmail ?? "",
  companyTaxId: "",
  footerNotes: invoiceSettings?.footerNotes ?? "",
};


  return (
    <div className="space-y-6 px-4 md:px-0 max-w-6xl mx-auto text-start">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t("Settings.title")}
        </h1>
        <p className="text-muted-foreground">{t("Settings.description")}</p>
      </div>

      <Separator className="bg-primary/5" />

      <Tabs defaultValue="general" className="w-full">
        <div className="overflow-x-auto pb-2 mb-2 scrollbar-none">
          <TabsList className="flex h-auto w-auto min-w-full sm:min-w-[500px] sm:grid sm:grid-cols-5 bg-muted/30 p-1 rounded-xl border border-primary/5 shadow-inner scrollbar-none">
            <TabsTrigger value="general" className="rounded-lg py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-md transition-all">
              <Store className="h-4 w-4 mr-2" />
              {t("Settings.general")}
            </TabsTrigger>
            <TabsTrigger value="invoice" className="rounded-lg py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-md transition-all">
              <FileText className="h-4 w-4 mr-2" />
              {t("Settings.Invoice")}
            </TabsTrigger>
            <TabsTrigger value="team" className="rounded-lg py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-md transition-all">
              <Users className="h-4 w-4 mr-2" />
              {t("Settings.team")}
            </TabsTrigger>
            <TabsTrigger value="profile" className="rounded-lg py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-md transition-all">
              <User className="h-4 w-4 mr-2" />
              {t("Settings.profile")}
            </TabsTrigger>
            <TabsTrigger value="billing" className="rounded-lg py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-md transition-all">
              <CreditCard className="h-4 w-4 mr-2" />
              {t("Settings.billing_plans")}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="general" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-400">
          <GeneralSettings initialName={tenant.name} />
        </TabsContent>

        <TabsContent value="invoice" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-400">
          <InvoiceSettings settings={invoiceSettingsState} locale={locale} />
        </TabsContent>

        <TabsContent value="team" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-400">
          <TeamSettings
            users={users}
            currentPlan={tenant.plan}
            currentUserId={context.userId}
          />
        </TabsContent>

        <TabsContent value="profile" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-400">
          <ProfileSettings user={currentUser} />
        </TabsContent>

        <TabsContent value="billing" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-400">
          <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-primary/5">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                {t("Settings.billing_sub")}
              </CardTitle>
              <CardDescription>{t("Settings.manage_billing")}</CardDescription>
            </CardHeader>
            <CardContent className="p-8 md:p-12 text-center space-y-6">
              <div className="bg-primary/5 h-20 w-20 rounded-2xl flex items-center justify-center mx-auto rotate-3 hover:rotate-0 transition-all duration-500 shadow-lg shadow-primary/5">
                <CreditCard className="h-10 w-10 text-primary" />
              </div>
              <div className="max-w-md mx-auto space-y-4">
                <div className="space-y-2">
                  <h4 className="text-2xl font-black">Manage Your Plan</h4>
                  <p className="text-muted-foreground text-lg">
                    Current Plan: <span className="text-primary font-black uppercase tracking-wider">{tenant.plan}</span>
                  </p>
                </div>
                <Button asChild variant="outline" className="w-full h-14 rounded-2xl border-primary/20 hover:bg-primary/10 hover:text-primary transition-all shadow-lg shadow-primary/5 text-lg font-bold">
                  <Link href={`/${locale}/dashboard/settings/billing`}>
                    {t("Settings.billing_sub")}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SettingsSkeleton() {
  return (
    <div className="space-y-6 px-4 md:px-0 max-w-6xl mx-auto">
      <Skeleton className="h-20 w-1/2 rounded-xl" />
      <Skeleton className="h-14 w-full rounded-2xl" />
      <Skeleton className="h-[600px] w-full rounded-2xl" />
    </div>
  );
}
