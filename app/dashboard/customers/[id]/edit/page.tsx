import { CustomerService } from "@/_legacy_backend/services/customers";
import { getTenantContext } from "@/lib/auth";
import CustomerForm from "../../_components/CustomerForm";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const context = await getTenantContext();
    const customer = await CustomerService.getById(id, context.tenantId);

    if (!customer) notFound();

    return <CustomerForm customer={customer} />;
}
