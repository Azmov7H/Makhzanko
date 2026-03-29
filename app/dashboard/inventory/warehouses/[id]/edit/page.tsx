import { prisma } from "@/lib/prisma";
import { getTenantContext } from "@/lib/auth";
import EditWarehousePage from "../../_components/EditWarehousePage";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const context = await getTenantContext();
    const warehouse = await prisma.warehouse.findUnique({
        where: { id: id, tenantId: context.tenantId },
    });

    if (!warehouse) notFound();

    return <EditWarehousePage warehouse={warehouse} />;
}
