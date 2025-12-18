import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import NewAuditForm from "./NewAuditForm";

export default async function NewAuditPage() {
    const context = await getTenantContext();

    const warehouses = await db.warehouse.findMany({
        where: { tenantId: context.tenantId },
        orderBy: { name: "asc" }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">New Audit</h1>
                </div>
            </div>
            <NewAuditForm warehouses={warehouses} />
        </div>
    );
}
