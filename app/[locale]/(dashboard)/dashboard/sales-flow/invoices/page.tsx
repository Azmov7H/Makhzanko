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

export default async function InvoicesPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const context = await getTenantContext();

    const t = await getI18n(locale as Locale);

    const invoices = await db.invoice.findMany({
        where: { tenantId: context.tenantId },
        include: { sale: true },
        orderBy: { sale: { date: "desc" } }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t("Invoices.title")}</h1>
                    <p className="text-muted-foreground mt-1">{t("Invoices.description")}</p>
                </div>
                <div className="flex gap-3">
                    <Button asChild variant="outline" className="gap-2">
                        <Link href={`/${locale}/dashboard/sales-flow/invoices/design`}>
                            <Palette className="h-4 w-4" />
                            {t("Invoices.create_design")}
                        </Link>
                    </Button>
                    <Button asChild className="gap-2">
                        <Link href={`/${locale}/dashboard/sales-flow/sales/new`}>
                            <FileText className="h-4 w-4" />
                            {t("Invoices.new_invoice")}
                        </Link>
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Layout className="h-5 w-5 text-primary" />
                        {t("Invoices.list_title")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead>{t("Invoices.invoice_no")}</TableHead>
                                    <TableHead>{t("Invoices.date")}</TableHead>
                                    <TableHead>{t("Invoices.amount")}</TableHead>
                                    <TableHead className="text-right">{t("Invoices.action")}</TableHead>
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
                                            <TableCell className="font-semibold">
                                                {Number(inv.sale.total).toLocaleString()} {t("Common.currency")}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button asChild variant="ghost" size="sm" className="gap-1">
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
