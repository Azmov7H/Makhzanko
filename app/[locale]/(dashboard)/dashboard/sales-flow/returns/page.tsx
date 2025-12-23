import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import Link from "next/link";
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
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Eye, ArrowLeft } from "lucide-react";

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function ReturnsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <Suspense fallback={<ReturnsSkeleton />}>
            <ReturnsContent locale={locale} />
        </Suspense>
    );
}

async function ReturnsContent({ locale }: { locale: string }) {
    const context = await getTenantContext();
    const t = await getI18n(locale as Locale);

    const returns = await db.return.findMany({
        where: { tenantId: context.tenantId },
        include: {
            invoice: true,
            items: { include: { product: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    const getStatusBadge = (status: string) => {
        const statusStyles: Record<string, string> = {
            PENDING: "bg-yellow-500/10 text-yellow-600 border-none",
            APPROVED: "bg-blue-500/10 text-blue-600 border-none",
            COMPLETED: "bg-green-500/10 text-green-600 border-none",
            REJECTED: "bg-red-500/10 text-red-600 border-none",
        };
        return statusStyles[status] || "bg-gray-100 text-gray-800";
    };

    return (
        <div className="space-y-6 text-start">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t("Dashboard.nav.returns") || "Returns & Refunds"}</h1>
                    <p className="text-muted-foreground mt-1">
                        {t("Returns.description") || "Track all returns and refunds for your invoices"}
                    </p>
                </div>
                <Button asChild variant="outline" className="gap-2">
                    <Link href={`/${locale}/dashboard/sales-flow/invoices`}>
                        <ArrowLeft className="h-4 w-4" />
                        {t("Common.back") || "Back"}
                    </Link>
                </Button>
            </div>

            <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <RotateCcw className="h-5 w-5 text-primary" />
                        {t("Returns.history") || "Returns History"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-xl border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="text-right">{t("Returns.id") || "Return #"}</TableHead>
                                    <TableHead className="text-right">{t("Returns.invoice") || "Invoice"}</TableHead>
                                    <TableHead className="text-right">{t("Returns.type") || "Type"}</TableHead>
                                    <TableHead className="text-right">{t("Returns.reason") || "Reason"}</TableHead>
                                    <TableHead className="text-right">{t("Returns.amount") || "Refund Amount"}</TableHead>
                                    <TableHead className="text-right">{t("Returns.status") || "Status"}</TableHead>
                                    <TableHead className="text-right">{t("Returns.date") || "Date"}</TableHead>
                                    <TableHead className="text-left">{t("Common.actions") || "Actions"}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {returns.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                                            {t("Returns.no_returns") || "No returns found"}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    returns.map((ret) => (
                                        <TableRow key={ret.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="font-bold text-primary font-mono">
                                                {ret.token}
                                            </TableCell>
                                            <TableCell>
                                                <Link
                                                    href={`/${locale}/dashboard/sales-flow/invoices/${ret.invoiceId}`}
                                                    className="text-blue-600 hover:underline font-bold"
                                                >
                                                    {ret.invoice.token}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="rounded-lg">
                                                    {ret.returnType}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="max-w-[200px] truncate">
                                                {ret.reason}
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-green-600">
                                                {Number(ret.refundAmount).toLocaleString()} {t("Common.currency")}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`${getStatusBadge(ret.status)} rounded-lg px-2 py-0`}>
                                                    {ret.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(ret.createdAt).toLocaleDateString(locale)}
                                            </TableCell>
                                            <TableCell className="text-left">
                                                <Button asChild variant="ghost" size="sm" className="gap-1 hover:bg-primary/10">
                                                    <Link href={`/${locale}/dashboard/sales-flow/returns/${ret.id}`}>
                                                        <Eye className="h-3.5 w-3.5" />
                                                        {t("Common.view") || "View"}
                                                    </Link>
                                                </Button>
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

function ReturnsSkeleton() {
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
