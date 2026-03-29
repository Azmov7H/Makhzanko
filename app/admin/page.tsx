import { getI18n, getLocale } from "@/lib/i18n/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, CreditCard, Activity } from "lucide-react";

export default async function AdminPage() {
    const locale = await getLocale();
    const t = await getI18n(locale);

    const stats = [
        { label: t("Admin.total_tenants"), value: "128", icon: Building2 },
        { label: t("Admin.active_users"), value: "1,240", icon: Users },
        { label: t("Admin.total_revenue"), value: `45,000 ${t("Common.currency")}`, icon: CreditCard },
        { label: t("Admin.conversion_rate"), value: "12%", icon: Activity },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-extrabold tracking-tight">{t("Admin.welcome")}</h1>
            <p className="text-muted-foreground -mt-6">{t("Admin.overview_desc")}</p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm bg-card">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                            <stat.icon className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
