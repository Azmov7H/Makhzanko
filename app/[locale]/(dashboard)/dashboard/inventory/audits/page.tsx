import { db } from "@/lib/db";
import { getAuthPayload } from "@/lib/auth";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";

export default async function AuditListPage() {
    const auth = await getAuthPayload();
    if (!auth?.tenantId) redirect("/login");

    const audits = await db.inventoryCount.findMany({
        where: { tenantId: auth.tenantId },
        include: { warehouse: true },
        orderBy: { date: "desc" }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Inventory Audits</h1>
                    <p className="text-muted-foreground text-sm">Perform physical inventory counts and adjustments.</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/inventory/audits/new">
                        <Plus className="mr-2 h-4 w-4" /> New Audit
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border bg-white dark:bg-gray-900">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Warehouse</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {audits.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No audits found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            audits.map(audit => (
                                <TableRow key={audit.id}>
                                    <TableCell>{new Date(audit.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{audit.warehouse.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={audit.status === "COMPLETED" ? "default" : "secondary"}>
                                            {audit.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild variant="ghost" size="sm">
                                            <Link href={`/dashboard/inventory/audits/${audit.id}`}>
                                                {audit.status === "COMPLETED" ? "View Results" : "Continue Count"}
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
