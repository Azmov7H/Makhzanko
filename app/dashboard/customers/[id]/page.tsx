import { CustomerService } from "@/services/customers";
import { getTenantContext } from "@/lib/auth";
import { notFound } from "next/navigation";
import { CustomerDetails } from "../_components/CustomerDetails";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const context = await getTenantContext();
    const customer = await CustomerService.getById(id, context.tenantId);

    if (!customer) notFound();

    return <CustomerDetails customer={customer} />;
}
