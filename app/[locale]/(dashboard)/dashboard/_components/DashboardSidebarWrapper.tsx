import { getTenantContext } from "@/lib/auth";
import { db } from "@/lib/db";
import { Sidebar } from "@/components/layout/Sidebar";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";

export async function DashboardSidebarWrapper({ locale }: { locale: string }) {
    const context = await getTenantContext();
    const t = await getI18n(locale as Locale);

    const tenant = await db.tenant.findUnique({
        where: { id: context.tenantId },
        select: { plan: true }
    });

    const plan = tenant?.plan || "FREE";

    return <Sidebar role={context.role} plan={plan} />;
}
