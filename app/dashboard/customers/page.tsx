import { CustomerService } from "@/_legacy_backend/services/customers";
import { getTenantContext } from "@/lib/auth";
import { CustomersClient } from "./_components/CustomersClient";

export default async function Page() {
    const context = await getTenantContext();
    const customers = await CustomerService.list(context.tenantId);

    return (
        <div className="max-w-7xl mx-auto pb-20 px-0">
             <CustomersClient customers={customers} />
        </div>
    );
}
