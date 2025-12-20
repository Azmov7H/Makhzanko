import { getTenantContext } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function SettingsPage() {
    const context = await getTenantContext();
    const t = await getTranslations("Settings");

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
                <p className="text-muted-foreground">{t("description")}</p>
            </div>
            <Separator />
            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">{t("general")}</TabsTrigger>
                    <TabsTrigger value="billing">{t("billing_plans")}</TabsTrigger>
                    <TabsTrigger value="team">{t("team")}</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("store_info")}</CardTitle>
                            <CardDescription>
                                {t("store_info_desc")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="name">{t("store_name")}</Label>
                                <Input id="name" defaultValue="Phone Store" />
                            </div>
                            <Button>{t("save_changes")}</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="billing" className="space-y-4">
                    <div className="rounded-md bg-muted p-4 text-sm">
                        {t("manage_billing")}{" "}
                        <Link href="/dashboard/settings/billing" className="text-primary underline">
                            {t("billing_sub")}
                        </Link>
                        .
                    </div>
                </TabsContent>
                <TabsContent value="team" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("team_members")}</CardTitle>
                            <CardDescription>
                                {t("team_members_desc")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{t("team_soon")}</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
