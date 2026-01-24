import { getTenantContext } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/layout/Sidebar";
import { getLocale } from "@/lib/i18n/server";

export async function DashboardSidebarWrapper() {
    const context = await getTenantContext();
    const locale = await getLocale();

    return <Sidebar role={context.role} />;
}
