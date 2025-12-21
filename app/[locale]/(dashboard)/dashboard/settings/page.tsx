import { getTenantContext } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";
import { Store, CreditCard, Users, Save } from "lucide-react";

export default async function SettingsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const context = await getTenantContext();
    const t = await getI18n(locale as Locale);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t("Settings.title")}</h1>
                <p className="text-muted-foreground mt-1">{t("Settings.description")}</p>
            </div>

            <Separator />

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-md bg-muted/50 p-1 rounded-xl">
                    <TabsTrigger value="general" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <Store className="h-4 w-4 mr-2" />
                        {t("Settings.general")}
                    </TabsTrigger>
                    <TabsTrigger value="billing" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <CreditCard className="h-4 w-4 mr-2" />
                        {t("Settings.billing_plans")}
                    </TabsTrigger>
                    <TabsTrigger value="team" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <Users className="h-4 w-4 mr-2" />
                        {t("Settings.team")}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="mt-6 space-y-6">
                    <Card className="border-primary/5 shadow-sm overflow-hidden">
                        <CardHeader className="bg-muted/30 border-b">
                            <CardTitle className="flex items-center gap-2">
                                <Store className="h-5 w-5 text-primary" />
                                {t("Settings.store_info")}
                            </CardTitle>
                            <CardDescription>
                                {t("Settings.store_info_desc")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2 max-w-md">
                                <Label htmlFor="name" className="text-sm font-bold">{t("Settings.store_name")}</Label>
                                <Input id="name" defaultValue="Phone Store" className="h-11 rounded-lg border-primary/10" />
                            </div>
                            <Button className="gap-2 h-11 px-8 rounded-lg shadow-lg shadow-primary/20">
                                <Save className="h-4 w-4" />
                                {t("Settings.save_changes")}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="billing" className="mt-6">
                    <Card className="border-primary/5 shadow-sm">
                        <CardContent className="p-10 text-center space-y-4">
                            <div className="bg-primary/5 h-16 w-16 rounded-full flex items-center justify-center mx-auto">
                                <CreditCard className="h-8 w-8 text-primary" />
                            </div>
                            <div className="max-w-xs mx-auto space-y-2">
                                <p className="text-muted-foreground text-sm">
                                    {t("Settings.manage_billing")}
                                </p>
                                <Button asChild variant="outline" className="w-full h-11 rounded-lg border-primary/20 hover:bg-primary/5 hover:text-primary">
                                    <Link href={`/${locale}/dashboard/settings/billing`}>
                                        {t("Settings.billing_sub")}
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="team" className="mt-6">
                    <Card className="border-primary/5 shadow-sm border-dashed">
                        <CardHeader className="text-center pb-2">
                            <div className="bg-muted h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <CardTitle>{t("Settings.team_members")}</CardTitle>
                            <CardDescription>
                                {t("Settings.team_members_desc")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-10 pt-2">
                            <p className="text-center text-sm font-medium text-primary bg-primary/5 py-2 px-4 rounded-full w-fit mx-auto">
                                {t("Settings.team_soon")}
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
