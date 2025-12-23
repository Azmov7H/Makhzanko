import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import Link from "next/link";
import { Trash2, Plus, Receipt } from "lucide-react";
import { deleteExpenseAction } from "@/actions/expenses";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";

export default async function ExpensesPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const context = await getTenantContext();

    const t = await getI18n(locale as Locale);

    const expenses = await db.expense.findMany({
        where: { tenantId: context.tenantId },
        orderBy: { date: "desc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("Expenses.title")}</h1>
                    <p className="text-muted-foreground mt-1 text-sm sm:text-base">{t("Expenses.description")}</p>
                </div>
                <Button asChild className="gap-2 w-full sm:w-auto">
                    <Link href={`/${locale}/dashboard/finance/expenses/new`}>
                        <Plus className="h-4 w-4" /> {t("Expenses.add_expense")}
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Receipt className="h-5 w-5 text-primary" />
                        {t("Expenses.list_title")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                    <div className="overflow-x-auto rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead>{t("Expenses.date")}</TableHead>
                                    <TableHead>{t("Common.description")}</TableHead>
                                    <TableHead>{t("Expenses.category")}</TableHead>
                                    <TableHead>{t("Expenses.amount")}</TableHead>
                                    <TableHead className="text-right">{t("Expenses.action")}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {expenses.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                            {t("Expenses.no_expenses")}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    expenses.map((expense) => (
                                        <TableRow key={expense.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell>
                                                {new Date(expense.date).toLocaleDateString(locale)}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {expense.description}
                                            </TableCell>
                                            <TableCell>{expense.category}</TableCell>
                                            <TableCell className="font-semibold">
                                                {Number(expense.amount).toLocaleString()} {t("Common.currency")}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <form action={async () => {
                                                    "use server";
                                                    await deleteExpenseAction(expense.id);
                                                }}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="sr-only">{t("Expenses.delete")}</span>
                                                    </Button>
                                                </form>
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
