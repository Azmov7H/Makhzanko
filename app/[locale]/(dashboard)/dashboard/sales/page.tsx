import { db } from "@/lib/db";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { getAuthPayload } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SalesPage() {
    const auth = await getAuthPayload();
    if (!auth?.tenantId) redirect("/login");

    const sales = await db.sale.findMany({
        where: { tenantId: auth.tenantId },
        orderBy: { number: "desc" },
        include: { user: true, items: true }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Sales & Invoices</h1>
                    <p className="text-muted-foreground text-sm">View and manage sales transactions.</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/sales/new">
                        <Plus className="mr-2 h-4 w-4" /> New Sale
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border bg-white dark:bg-gray-900">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Invoice #</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sales.map((sale) => (
                            <TableRow key={sale.id}>
                                <TableCell className="font-medium">#{sale.number}</TableCell>
                                <TableCell>{sale.date.toLocaleDateString()}</TableCell>
                                <TableCell>{sale.customerId || "Walk-in"}</TableCell>
                                <TableCell>{sale.items.length} items</TableCell>
                                <TableCell className="text-right font-medium">${Number(sale.total).toFixed(2)}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={sale.status === "COMPLETED" ? "default" : "secondary"}>
                                        {sale.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                        {sales.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No sales recorded yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
