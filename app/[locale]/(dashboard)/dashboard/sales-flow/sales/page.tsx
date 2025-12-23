import { db } from "@/lib/db";
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
import { Plus, ShoppingCart } from "lucide-react";
import { getTenantContext } from "@/lib/auth";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function SalesPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <Suspense fallback={<SalesSkeleton />}>
            <SalesContent locale={locale} />
        </Suspense>
    );
}

async function SalesContent({ locale }: { locale: string }) {
    const context = await getTenantContext();
    const t = await getI18n(locale as Locale);

    const sales = await db.sale.findMany({
        where: { tenantId: context.tenantId },
        orderBy: { number: "desc" },
        include: { user: true, items: true }
    });

    return (
        <div className="space-y-6 text-start">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t("Sales.title")}</h1>
                    <p className="text-muted-foreground mt-1">{t("Sales.description")}</p>
                </div>
                <Button asChild className="gap-2">
                    <Link href={`/${locale}/dashboard/sales-flow/sales/new`}>
                        <Plus className="h-4 w-4" /> {t("Sales.new_sale")}
                    </Link>
                </Button>
            </div>

            <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl overflow-hidden">
                <CardHeader className="pb-3">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                        {t("Sales.recent_sales")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-xl border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="text-right">{t("Sales.invoice_no")}</TableHead>
                                    <TableHead className="text-right">{t("Sales.date")}</TableHead>
                                    <TableHead className="text-right">{t("Sales.customer")}</TableHead>
                                    <TableHead className="text-right">{t("Sales.items")}</TableHead>
                                    <TableHead className="text-right">{t("Sales.total")}</TableHead>
                                    <TableHead className="text-left">{t("Sales.status")}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sales.map((sale) => (
                                    <TableRow key={sale.id} className="hover:bg-muted/30 transition-colors">
                                        <TableCell className="font-bold text-primary">#{sale.number}</TableCell>
                                        <TableCell>{new Date(sale.date).toLocaleDateString(locale)}</TableCell>
                                        <TableCell>{sale.customerId || t("Sales.walk_in")}</TableCell>
                                        <TableCell>{t("Sales.items_count", { count: sale.items.length })}</TableCell>
                                        <TableCell className="text-right font-bold text-primary">
                                            {Number(sale.total).toLocaleString()} {t("Common.currency")}
                                        </TableCell>
                                        <TableCell className="text-left">
                                            <Badge
                                                variant={sale.status === "COMPLETED" ? "default" : "secondary"}
                                                className={sale.status === "COMPLETED" ? "bg-green-500/10 text-green-600 border-none rounded-lg" : "rounded-lg"}
                                            >
                                                {sale.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {sales.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                            {t("Sales.no_sales")}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function SalesSkeleton() {
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
