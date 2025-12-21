import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, ClipboardCheck, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";

export default async function AuditListPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const context = await getTenantContext();
    const t = await getI18n(locale as Locale);

    const audits = await db.inventoryCount.findMany({
        where: { tenantId: context.tenantId },
        include: { warehouse: true },
        orderBy: { date: "desc" }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t("Inventory.audits")}</h1>
                    <p className="text-muted-foreground mt-1">{t("Inventory.description")}</p>
                </div>
                <Button asChild className="gap-2">
                    <Link href={`/${locale}/dashboard/inventory/audits/new`}>
                        <Plus className="h-4 w-4" /> {t("Inventory.new_audit")}
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <ClipboardCheck className="h-5 w-5 text-primary" />
                        {t("Inventory.audit_details")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead>{t("Inventory.date")}</TableHead>
                                    <TableHead>{t("Inventory.location")}</TableHead>
                                    <TableHead>{t("Inventory.status")}</TableHead>
                                    <TableHead className="text-right">{t("Inventory.action")}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {audits.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                            {t("Inventory.no_audits")}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    audits.map(audit => (
                                        <TableRow key={audit.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="font-medium">{new Date(audit.date).toLocaleDateString(locale)}</TableCell>
                                            <TableCell>{audit.warehouse.name}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={audit.status === "COMPLETED" ? "default" : "secondary"}
                                                    className={audit.status === "COMPLETED" ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200" : ""}
                                                >
                                                    {audit.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button asChild variant="ghost" size="sm" className="gap-1.5">
                                                    <Link href={`/${locale}/dashboard/inventory/audits/${audit.id}`}>
                                                        {audit.status === "COMPLETED" ? (
                                                            <span className="flex items-center gap-1.5"><History className="h-3.5 w-3.5" />{t("Inventory.view_results")}</span>
                                                        ) : (
                                                            <span className="text-primary font-bold">{t("Inventory.continue_count")}</span>
                                                        )}
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
