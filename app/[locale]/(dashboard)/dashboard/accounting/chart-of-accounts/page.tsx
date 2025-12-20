import { getChartOfAccounts } from "@/actions/accounting";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export default async function ChartOfAccountsPage() {
    const accounts = await getChartOfAccounts();
    const t = await getTranslations("Accounting");

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{t("chart_title")}</h1>
                    <p className="text-muted-foreground text-sm">{t("chart_desc")}</p>
                </div>
            </div>

            <div className="rounded-md border bg-white dark:bg-gray-900">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t("code")}</TableHead>
                            <TableHead>{t("account_name")}</TableHead>
                            <TableHead>{t("type")}</TableHead>
                            <TableHead className="text-right">{t("action")}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {accounts.map(account => (
                            <TableRow key={account.id}>
                                <TableCell className="font-mono font-medium">{account.code}</TableCell>
                                <TableCell>{account.name}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{account.type}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button asChild variant="ghost" size="sm">
                                        <Link href={`/dashboard/accounting/ledger/${account.id}`}>{t("view_ledger")}</Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
