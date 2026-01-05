import { CustomerService } from "@/services/customers";
import { getTenantContext } from "@/lib/auth";
import { CustomersClient } from "./_components/CustomersClient";

export default async function Page() {
    const context = await getTenantContext();
    const customers = await CustomerService.list(context.tenantId);

    return <CustomersClient customers={customers} />;
}
