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

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function PurchasesPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <Suspense fallback={<PurchasesSkeleton />}>
            <PurchasesContent locale={locale} />
        </Suspense>
    );
}

async function PurchasesContent({ locale }: { locale: string }) {
    const context = await getTenantContext();
    const t = await getI18n(locale as Locale);

    const purchases = await db.purchaseOrder.findMany({
        where: { tenantId: context.tenantId },
        include: { warehouse: true },
        orderBy: { number: "desc" },
    });

    return (
        <div className="space-y-6 text-start">
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

            <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Truck className="h-5 w-5 text-primary" />
                        {t("Purchases.list_title")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                    <div className="overflow-x-auto rounded-xl border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="text-right">{t("Purchases.po_no")}</TableHead>
                                    <TableHead className="text-right">{t("Purchases.date")}</TableHead>
                                    <TableHead className="text-right">{t("Purchases.supplier")}</TableHead>
                                    <TableHead className="text-right">{t("Purchases.warehouse")}</TableHead>
                                    <TableHead className="text-right">{t("Purchases.total")}</TableHead>
                                    <TableHead className="text-left">{t("Purchases.status")}</TableHead>
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
                                            <TableCell>
                                                <Badge variant="outline" className="rounded-lg">{po.warehouse?.name}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-primary">
                                                {Number(po.total).toLocaleString()} {t("Common.currency")}
                                            </TableCell>
                                            <TableCell className="text-left">
                                                <Badge
                                                    variant={po.status === "RECEIVED" ? "default" : "secondary"}
                                                    className={po.status === "RECEIVED" ? "bg-green-500/10 text-green-600 border-none rounded-lg" : "rounded-lg"}
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

function PurchasesSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Skeleton className="h-20 w-1/3 rounded-xl" />
                <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
            <Skeleton className="h-[500px] w-full rounded-2xl" />
        </div>
    );
}
