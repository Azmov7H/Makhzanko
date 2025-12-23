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

export default async function ReturnsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
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
            PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
            APPROVED: "bg-blue-100 text-blue-800 border-blue-200",
            COMPLETED: "bg-green-100 text-green-800 border-green-200",
            REJECTED: "bg-red-100 text-red-800 border-red-200",
        };
        return statusStyles[status] || "bg-gray-100 text-gray-800";
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Returns & Refunds</h1>
                    <p className="text-muted-foreground mt-1">
                        Track all returns and refunds for your invoices
                    </p>
                </div>
                <Button asChild variant="outline" className="gap-2">
                    <Link href={`/${locale}/dashboard/sales-flow/invoices`}>
                        <ArrowLeft className="h-4 w-4" />
                        Back to Invoices
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <RotateCcw className="h-5 w-5 text-primary" />
                        Returns History
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead>Return #</TableHead>
                                    <TableHead>Invoice</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead className="text-right">Refund Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {returns.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                                            No returns found
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
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {ret.invoice.token}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {ret.returnType}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="max-w-[200px] truncate">
                                                {ret.reason}
                                            </TableCell>
                                            <TableCell className="text-right font-semibold text-green-600">
                                                {Number(ret.refundAmount).toLocaleString()} EGP
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getStatusBadge(ret.status)}>
                                                    {ret.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(ret.createdAt).toLocaleDateString(locale)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button asChild variant="ghost" size="sm" className="gap-1">
                                                    <Link href={`/${locale}/dashboard/sales-flow/returns/${ret.id}`}>
                                                        <Eye className="h-3.5 w-3.5" />
                                                        View
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
