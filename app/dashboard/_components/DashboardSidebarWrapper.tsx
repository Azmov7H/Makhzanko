import { getTenantContext } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/layout/Sidebar";
import { getLocale } from "@/lib/i18n/server";

export async function DashboardSidebarWrapper() {
    const context = await getTenantContext();
    const locale = await getLocale();

    const tenant = await prisma.tenant.findUnique({
        where: { id: context.tenantId },
        select: { plan: true }
    });

    const plan = tenant?.plan || "FREE";

    return <Sidebar role={context.role} plan={plan} />;
}
