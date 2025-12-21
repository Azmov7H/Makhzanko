import { getTenantContext } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";
import { Store, CreditCard, Users, User } from "lucide-react";
import { db } from "@/lib/db";
import { GeneralSettings } from "./_components/GeneralSettings";
import { TeamSettings } from "./_components/TeamSettings";
import { Button } from "@/components/ui/button"
import { ProfileSettings } from "./_components/ProfileSettings";

export default async function SettingsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const context = await getTenantContext();
    const t = await getI18n(locale as Locale);

    // Fetch data for settings
    const [tenant, users, currentUser] = await Promise.all([
        db.tenant.findUnique({
            where: { id: context.tenantId },
            select: { name: true, plan: true }
        }),
        db.user.findMany({
            where: { tenantId: context.tenantId },
            select: { id: true, email: true, name: true, role: true },
            orderBy: { createdAt: "asc" }
        }),
        db.user.findUnique({
            where: { id: context.userId },
            select: { name: true, email: true, role: true }
        })
    ]);

    if (!tenant || !currentUser) {
        return <div>Error loading settings</div>;
    }

    return (
        <div className="space-y-6 px-4 md:px-0 max-w-6xl mx-auto">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {t("Settings.title")}
                </h1>
                <p className="text-muted-foreground">{t("Settings.description")}</p>
            </div>

            <Separator className="bg-primary/5" />

            <Tabs defaultValue="general" className="w-full">
                <div className="overflow-x-auto pb-2 mb-2 scrollbar-none">
                    <TabsList className="flex h-auto w-auto min-w-full sm:min-w-[400px] sm:grid sm:grid-cols-4 bg-muted/30 p-1 rounded-xl border border-primary/5">
                        <TabsTrigger value="general" className="rounded-lg py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <Store />
                            {t("Settings.general")}
                        </TabsTrigger>
                        <TabsTrigger value="team" className="rounded-lg py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <Users />
                            {t("Settings.team")}
                        </TabsTrigger>
                        <TabsTrigger value="profile" className="rounded-lg py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <User />
                            {t("Settings.profile")}
                        </TabsTrigger>
                        <TabsTrigger value="billing" className="rounded-lg py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <CreditCard />
                            {t("Settings.billing_plans")}
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="general" className="mt-6 animate-in fade-in-50 duration-300">
                    <GeneralSettings initialName={tenant.name} />
                </TabsContent>

                <TabsContent value="team" className="mt-6 animate-in fade-in-50 duration-300">
                    <TeamSettings
                        users={users}
                        currentPlan={tenant.plan}
                        currentUserId={context.userId}
                    />
                </TabsContent>

                <TabsContent value="profile" className="mt-6 animate-in fade-in-50 duration-300">
                    <ProfileSettings user={currentUser} />
                </TabsContent>

                <TabsContent value="billing" className="mt-6 animate-in fade-in-50 duration-300">
                    <Card className="border-primary/5 shadow-sm overflow-hidden">
                        <CardHeader className="bg-muted/30 border-b">
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-primary" />
                                {t("Settings.billing_sub")}
                            </CardTitle>
                            <CardDescription>
                                {t("Settings.manage_billing")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 md:p-12 text-center space-y-6">
                            <div className="bg-primary/5 h-20 w-20 rounded-2xl flex items-center justify-center mx-auto rotate-3 hover:rotate-0 transition-transform duration-300">
                                <CreditCard className="h-10 w-10 text-primary" />
                            </div>
                            <div className="max-w-md mx-auto space-y-4">
                                <div className="space-y-2">
                                    <h4 className="text-xl font-bold">Manage Your Plan</h4>
                                    <p className="text-muted-foreground text-sm">
                                        Current Plan: <span className="text-primary font-bold uppercase">{tenant.plan}</span>
                                    </p>
                                </div>
                                <Button asChild variant="outline" className="w-full h-12 rounded-xl border-primary/20 hover:bg-primary/5 hover:text-primary transition-all shadow-sm">
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

