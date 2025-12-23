import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import Link from "next/link";
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
import { Plus, Truck, Layout } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";

export default async function PurchasesPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const context = await getTenantContext();

    const t = await getI18n(locale as Locale);

    const purchases = await db.purchaseOrder.findMany({
        where: { tenantId: context.tenantId },
        include: { warehouse: true },
        orderBy: { number: "desc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("Purchases.title")}</h1>
                    <p className="text-muted-foreground mt-1 text-sm sm:text-base">{t("Purchases.description")}</p>
                </div>
                <Button asChild className="gap-2 w-full sm:w-auto">
                    <Link href={`/${locale}/dashboard/finance/purchases/new`}>
                        <Plus className="h-4 w-4" /> {t("Purchases.new_po")}
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Truck className="h-5 w-5 text-primary" />
                        {t("Purchases.list_title")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                    <div className="overflow-x-auto rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead>{t("Purchases.po_no")}</TableHead>
                                    <TableHead>{t("Purchases.date")}</TableHead>
                                    <TableHead>{t("Purchases.supplier")}</TableHead>
                                    <TableHead>{t("Purchases.warehouse")}</TableHead>
                                    <TableHead className="text-right">{t("Purchases.total")}</TableHead>
                                    <TableHead className="text-right">{t("Purchases.status")}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {purchases.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                            {t("Purchases.no_purchases")}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    purchases.map((po) => (
                                        <TableRow key={po.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="font-bold text-primary">#{po.number}</TableCell>
                                            <TableCell>{new Date(po.date).toLocaleDateString(locale)}</TableCell>
                                            <TableCell>{po.supplier || "-"}</TableCell>
                                            <TableCell>{po.warehouse?.name}</TableCell>
                                            <TableCell className="text-right font-semibold">
                                                {Number(po.total).toLocaleString()} {t("Common.currency")}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Badge
                                                    variant={po.status === "RECEIVED" ? "default" : "secondary"}
                                                    className={po.status === "RECEIVED" ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200" : ""}
                                                >
                                                    {po.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
