import { InstallmentService } from "@/services/installments";
import { getTenantContext } from "@/lib/auth";
import { DebtDashboardClient } from "./_components/DebtDashboardClient";

export default async function Page() {
    const context = await getTenantContext();
    const pendingInstallments = await InstallmentService.getPending(context.tenantId);

    return <DebtDashboardClient installments={pendingInstallments} />;
}
