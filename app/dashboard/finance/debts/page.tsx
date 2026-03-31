import { InstallmentService } from "@/_legacy_backend/services/installments";
import { getTenantContext } from "@/lib/auth";
import { DebtDashboardClient } from "./_components/DebtDashboardClient";

export default async function Page() {
    const context = await getTenantContext();
    const pendingInstallments = await InstallmentService.getPending(context.tenantId);

    // Explicitly serialize Decimal objects to numbers for Client Component transfer
    const serializedInstallments = pendingInstallments.map(inst => ({
        ...inst,
        amount: Number(inst.amount),
        customer: inst.customer ? { ...inst.customer, creditLimit: Number(inst.customer.creditLimit) } : null,
        supplier: inst.supplier ? { ...inst.supplier, creditLimit: Number(inst.supplier.creditLimit) } : null,
    }));

    return <DebtDashboardClient installments={serializedInstallments} />;
}
