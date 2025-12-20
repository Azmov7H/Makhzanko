import { db } from "@/lib/db";
import { getAuthPayload } from "@/lib/auth";
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
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function PurchasesPage() {
    const auth = await getAuthPayload();
    if (!auth?.tenantId) redirect("/login");

    const t = await getTranslations("Purchases");
    const tc = await getTranslations("Common");

    const purchases = await db.purchaseOrder.findMany({
        where: { tenantId: auth.tenantId },
        include: { warehouse: true },
        orderBy: { number: "desc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
                    <p className="text-muted-foreground text-sm">{t("description")}</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/purchases/new">
                        <Plus className="mr-2 h-4 w-4" /> {t("new_po")}
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border bg-white dark:bg-gray-900">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t("po_no")}</TableHead>
                            <TableHead>{t("date")}</TableHead>
                            <TableHead>{t("supplier")}</TableHead>
                            <TableHead>{t("warehouse")}</TableHead>
                            <TableHead className="text-right">{t("total")}</TableHead>
                            <TableHead className="text-right">{t("status")}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {purchases.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    {t("no_purchases")}
                                </TableCell>
                            </TableRow>
                        ) : (
                            purchases.map((po) => (
                                <TableRow key={po.id}>
                                    <TableCell className="font-medium">#{po.number}</TableCell>
                                    <TableCell>{new Date(po.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{po.supplier || "-"}</TableCell>
                                    <TableCell>{po.warehouse?.name}</TableCell>
                                    <TableCell className="text-right font-medium">{Number(po.total).toFixed(2)} {tc("currency")}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant={po.status === "RECEIVED" ? "default" : "secondary"}>
                                            {po.status}
                                        </Badge>
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
