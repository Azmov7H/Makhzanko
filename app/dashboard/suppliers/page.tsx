import { SupplierService } from "@/_legacy_backend/services/suppliers";
import { getTenantContext } from "@/lib/auth";
import { SuppliersClient } from "./_components/SuppliersClient";

export default async function Page() {
    const context = await getTenantContext();
    const suppliers = await SupplierService.list(context.tenantId);

    return <SuppliersClient suppliers={suppliers} />;
}
