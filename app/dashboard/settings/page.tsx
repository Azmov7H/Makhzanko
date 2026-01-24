import { getTenantContext } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { getI18n, getLocale } from "@/lib/i18n/server";
import { Store, CreditCard, Users, User, FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { GeneralSettings } from "./_components/GeneralSettings";
import { TeamSettings } from "./_components/TeamSettings";
import { Button } from "@/components/ui/button";
import { ProfileSettings } from "./_components/ProfileSettings";
import { InvoiceSettings } from "./_components/InvoiceSettings";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function SettingsPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsContent />
    </Suspense>
  );
}

async function SettingsContent() {
  const context = await getTenantContext();
  const locale = await getLocale();
  const t = await getI18n(locale);

  // Fetch data for settings
  const [tenant, users, currentUser, invoiceSettings] = await Promise.all([
    prisma.tenant.findUnique({
      where: { id: context.tenantId },
      select: { name: true }
    }),
    prisma.user.findMany({
      where: { tenantId: context.tenantId },
      select: { id: true, email: true, name: true, role: true, canDeferred: true },
      orderBy: { createdAt: "asc" }
    }),
    prisma.user.findUnique({
      where: { id: context.userId },
      select: { name: true, email: true, role: true }
    }),
    prisma.invoiceSettings.findUnique({
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
        <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent italic">
          {t("Settings.title")}
        </h1>
        <p className="text-muted-foreground font-medium">{t("Settings.description")}</p>
      </div>

      <Separator className="bg-primary/5" />

      <Tabs defaultValue="general" className="w-full">
        <div className="overflow-x-auto pb-2 mb-2 scrollbar-none">
          <TabsList className="flex h-auto w-auto min-w-full sm:min-w-[400px] sm:grid sm:grid-cols-4 bg-muted/30 p-1 rounded-xl border border-primary/5 shadow-inner scrollbar-none">
            <TabsTrigger value="general" className="rounded-lg py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-md transition-all font-bold">
              <Store className="h-4 w-4 mr-2" />
              {t("Settings.general")}
            </TabsTrigger>
            <TabsTrigger value="invoice" className="rounded-lg py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-md transition-all font-bold">
              <FileText className="h-4 w-4 mr-2" />
              {t("Settings.Invoice")}
            </TabsTrigger>
            <TabsTrigger value="team" className="rounded-lg py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-md transition-all font-bold">
              <Users className="h-4 w-4 mr-2" />
              {t("Settings.team")}
            </TabsTrigger>
            <TabsTrigger value="profile" className="rounded-lg py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-md transition-all font-bold">
              <User className="h-4 w-4 mr-2" />
              {t("Settings.profile_tab")}
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
            currentUserId={context.userId}
          />
        </TabsContent>

        <TabsContent value="profile" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-400">
          <ProfileSettings user={currentUser} />
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
