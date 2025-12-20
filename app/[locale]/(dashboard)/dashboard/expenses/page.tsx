import { db } from "@/lib/db";
import { getAuthPayload } from "@/lib/auth";
import { Link } from "@/i18n/navigation";
import { Trash2, Plus } from "lucide-react";
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
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function ExpensesPage() {
    const auth = await getAuthPayload();
    if (!auth?.tenantId) redirect("/login");

    const t = await getTranslations("Expenses");
    const tc = await getTranslations("Common");

    const expenses = await db.expense.findMany({
        where: { tenantId: auth.tenantId },
        orderBy: { date: "desc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
                    <p className="text-muted-foreground text-sm">{t("description")}</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/expenses/new">
                        <Plus className="mr-2 h-4 w-4" /> {t("add_expense")}
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border bg-white dark:bg-gray-900">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t("date")}</TableHead>
                            <TableHead>{tc("description")}</TableHead>
                            <TableHead>{t("category")}</TableHead>
                            <TableHead>{t("amount")}</TableHead>
                            <TableHead className="text-right">{t("action")}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {expenses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    {t("no_expenses")}
                                </TableCell>
                            </TableRow>
                        ) : (
                            expenses.map((expense) => (
                                <TableRow key={expense.id}>
                                    <TableCell>
                                        {new Date(expense.date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {expense.description}
                                    </TableCell>
                                    <TableCell>{expense.category}</TableCell>
                                    <TableCell>{Number(expense.amount).toFixed(2)} {tc("currency")}</TableCell>
                                    <TableCell className="text-right">
                                        <form action={async () => {
                                            "use server";
                                            await deleteExpenseAction(expense.id);
                                        }}>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-600 hover:text-red-900 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">{t("delete")}</span>
                                            </Button>
                                        </form>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
