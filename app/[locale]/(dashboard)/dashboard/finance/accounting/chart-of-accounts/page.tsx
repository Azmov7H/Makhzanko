import { getChartOfAccounts } from "@/actions/accounting";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Eye } from "lucide-react";

export default async function ChartOfAccountsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const accounts = await getChartOfAccounts();
    const t = await getI18n(locale as Locale);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t("Accounting.chart_title")}</h1>
                    <p className="text-muted-foreground mt-1">{t("Accounting.chart_desc")}</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <ClipboardList className="h-5 w-5 text-primary" />
                        {t("Accounting.accounts_list")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="w-[100px]">{t("Accounting.code")}</TableHead>
                                    <TableHead>{t("Accounting.account_name")}</TableHead>
                                    <TableHead>{t("Accounting.type")}</TableHead>
                                    <TableHead className="text-right">{t("Accounting.action")}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {accounts.map(account => (
                                    <TableRow key={account.id} className="hover:bg-muted/30 transition-colors">
                                        <TableCell className="font-mono font-bold text-primary">{account.code}</TableCell>
                                        <TableCell className="font-medium">{account.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize">
                                                {account.type.toLowerCase().replace("_", " ")}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button asChild variant="ghost" size="sm" className="gap-1.5">
                                                <Link href={`/${locale}/dashboard/finance/accounting/ledger/${account.id}`}>
                                                    <Eye className="h-3.5 w-3.5" />
                                                    {t("Accounting.view_ledger")}
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
