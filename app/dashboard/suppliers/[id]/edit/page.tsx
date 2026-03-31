import { SupplierService } from "@/_legacy_backend/services/suppliers";
import { getTenantContext } from "@/lib/auth";
import { notFound } from "next/navigation";
import { SupplierForm } from "../../_components/SupplierForm";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const context = await getTenantContext();
    const supplier = await SupplierService.getById(id, context.tenantId);

    if (!supplier) notFound();

    return <SupplierForm supplier={supplier} />;
}
