import { checkPlanAccess } from "@/lib/plan-access";
import { getTenantContext } from "@/lib/auth";

export default async function AccountingLayout({ children }: { children: React.ReactNode }) {
    const context = await getTenantContext();

    await checkPlanAccess(context.tenantId, "advanced_accounting");

    return (
        <div className="space-y-6">
            {children}
        </div>
    );
}
