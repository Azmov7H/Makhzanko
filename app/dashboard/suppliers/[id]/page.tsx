import { SupplierService } from "@/services/suppliers";
import { getTenantContext } from "@/lib/auth";
import { notFound } from "next/navigation";
import SupplierDetails from "../_components/SupplierDetails";

export default async function SupplierPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const context = await getTenantContext();
    const supplier = await SupplierService.getById(id, context.tenantId);

    if (!supplier) {
        notFound();
    }

    const stats = await SupplierService.getSupplierStats(id, context.tenantId);

    return <SupplierDetails supplier={supplier} stats={stats} />;
}
