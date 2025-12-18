import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import AuditCountTable from "./AuditCountTable";
import { Badge } from "@/components/ui/badge";

export default async function AuditDetailPage(props: { params: Promise<{ id: string; locale: string }> }) {
    const params = await props.params;
    const { id } = params;
    const context = await getTenantContext();

    const count = await db.inventoryCount.findFirst({
        where: { id, tenantId: context.tenantId },
        include: {
            warehouse: true,
            lines: {
                include: { product: true },
                orderBy: { product: { name: 'asc' } }
            }
        }
    });

    if (!count) return <div>Audit not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Audit: {count.warehouse.name}</h1>
                    <p className="text-muted-foreground text-sm">
                        Date: {new Date(count.date).toLocaleDateString()} • Status: <Badge>{count.status}</Badge>
                    </p>
                </div>
            </div>
            <AuditCountTable count={count} />
        </div>
    );
}
