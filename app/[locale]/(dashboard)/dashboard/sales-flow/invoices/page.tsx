import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Palette, Eye, Layout } from "lucide-react";

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function InvoicesPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <Suspense fallback={<InvoicesSkeleton />}>
            <InvoicesContent locale={locale} />
        </Suspense>
    );
}

async function InvoicesContent({ locale }: { locale: string }) {
    const context = await getTenantContext();
    const t = await getI18n(locale as Locale);

    const invoices = await db.invoice.findMany({
        where: { tenantId: context.tenantId },
        include: { sale: true },
        orderBy: { sale: { date: "desc" } }
    });

    return (
        <div className="space-y-6 text-start">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("Invoices.title")}</h1>
                    <p className="text-muted-foreground mt-1 text-sm sm:text-base">{t("Invoices.description")}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button asChild variant="outline" className="gap-2 w-full sm:w-auto">
                        <Link href={`/${locale}/dashboard/sales-flow/invoices/design`}>
                            <Palette className="h-4 w-4" />
                            {t("Invoices.create_design")}
                        </Link>
                    </Button>
                    <Button asChild className="gap-2 w-full sm:w-auto">
                        <Link href={`/${locale}/dashboard/sales-flow/sales/new`}>
                            <FileText className="h-4 w-4" />
                            {t("Invoices.new_invoice")}
                        </Link>
                    </Button>
                </div>
            </div>


            <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Layout className="h-5 w-5 text-primary" />
                        {t("Invoices.list_title")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                    <div className="overflow-x-auto rounded-xl border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="text-right">{t("Invoices.invoice_no")}</TableHead>
                                    <TableHead className="text-right">{t("Invoices.date")}</TableHead>
                                    <TableHead className="text-right">{t("Invoices.amount")}</TableHead>
                                    <TableHead className="text-left">{t("Invoices.action")}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                            {t("Invoices.no_invoices")}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    invoices.map((inv) => (
                                        <TableRow key={inv.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="font-bold text-primary">#{inv.sale.number}</TableCell>
                                            <TableCell>{new Date(inv.sale.date).toLocaleDateString(locale)}</TableCell>
                                            <TableCell className="font-bold text-primary">
                                                {Number(inv.sale.total).toLocaleString()} {t("Common.currency")}
                                            </TableCell>
                                            <TableCell className="text-left">
                                                <div className="flex gap-2">
                                                    <Button asChild variant="ghost" size="sm" className="gap-1 hover:bg-primary/10">
                                                        <Link href={`/${locale}/dashboard/sales-flow/invoices/${inv.id}`}>
                                                            <Eye className="h-3.5 w-3.5" />
                                                            {t("Invoices.view")}
                                                        </Link>
                                                    </Button>
                                                    <Button asChild variant="ghost" size="sm" className="gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                        <Link href={`/${locale}/dashboard/sales-flow/invoices/design?id=${inv.id}`}>
                                                            <Palette className="h-3.5 w-3.5" />
                                                            {t("Invoices.design")}
                                                        </Link>
                                                    </Button>
                                                </div>
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

function InvoicesSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Skeleton className="h-20 w-1/3 rounded-xl" />
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-32 rounded-lg" />
                    <Skeleton className="h-10 w-32 rounded-lg" />
                </div>
            </div>
            <Skeleton className="h-[500px] w-full rounded-2xl" />
        </div>
    );
}
