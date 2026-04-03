"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/lib/i18n/context";
import { Store, FileText, Users, User } from "lucide-react";
import { GeneralSettings } from "./_components/GeneralSettings";
import { TeamSettings } from "./_components/TeamSettings";
import { ProfileSettings } from "./_components/ProfileSettings";
import { InvoiceSettings } from "./_components/InvoiceSettings";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthToken } from "@/lib/auth/AuthContext";

export default function SettingsPage() {
    const { t, locale } = useI18n();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{
        tenant: any;
        users: any[];
        currentUser: any;
        invoiceSettings: any;
    } | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const token = getAuthToken();
                const [tenantRes, usersRes, meRes, invoiceRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/tenant`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/users`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/invoice`, { headers: { Authorization: `Bearer ${token}` } })
                ]);

                if (tenantRes.ok && usersRes.ok && meRes.ok && invoiceRes.ok) {
                    setData({
                        tenant: await tenantRes.json(),
                        users: await usersRes.json(),
                        currentUser: await meRes.json(),
                        invoiceSettings: await invoiceRes.json(),
                    });
                }
            } catch (error) {
                console.error("Failed to fetch settings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    if (loading) return <SettingsSkeleton />;
    if (!data) return <div className="p-12 text-center text-destructive font-bold">Error loading settings</div>;

    const invoiceSettingsState = {
        primaryColor: data.invoiceSettings?.primaryColor ?? "#000000",
        accentColor: data.invoiceSettings?.accentColor ?? "#ffffff",
        fontFamily: data.invoiceSettings?.fontFamily ?? "Inter",
        templateStyle: data.invoiceSettings?.templateStyle ?? "default",
        showTax: data.invoiceSettings?.showTax ?? false,
        showDiscount: data.invoiceSettings?.showDiscount ?? false,
        showHeader: true,
        showFooter: true,
        companyAddress: data.invoiceSettings?.companyAddress ?? "",
        companyPhone: data.invoiceSettings?.companyPhone ?? "",
        companyEmail: data.invoiceSettings?.companyEmail ?? "",
        companyTaxId: "",
        footerNotes: data.invoiceSettings?.footerNotes ?? "",
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
                    <GeneralSettings initialName={data.tenant.name} />
                </TabsContent>

                <TabsContent value="invoice" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-400">
                    <InvoiceSettings settings={invoiceSettingsState} locale={locale} />
                </TabsContent>

                <TabsContent value="team" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-400">
                    <TeamSettings
                        users={data.users}
                        currentUserId={data.currentUser.id}
                    />
                </TabsContent>

                <TabsContent value="profile" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-400">
                    <ProfileSettings user={data.currentUser} />
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
