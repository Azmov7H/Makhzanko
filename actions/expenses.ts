"use server";

import { db } from "@/lib/db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createJournalEntry } from "@/lib/accounting";

export async function createExpenseAction(prevState: any, formData: FormData) {
    const headersList = await headers();
    const tenantId = headersList.get("x-tenant-id");

    if (!tenantId) {
        return { error: "Unauthorized" };
    }

    const description = formData.get("description") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const category = formData.get("category") as string;

    if (!description || !amount || !category) {
        return { error: "Missing required fields" };
    }

    try {
        await db.$transaction(async (tx) => {
            const expense = await tx.expense.create({
                data: {
                    tenantId,
                    description,
                    amount,
                    category,
                },
            });

            const categoryMap: Record<string, string> = {
                "Rent": "5100",
                "Utilities": "5200",
                "Salaries": "5300",
                "Marketing": "5999",
                "Maintenance": "5999",
                "Other": "5999"
            };
            const debitAccount = categoryMap[category] || "5999";

            await createJournalEntry({
                tenantId,
                description: `Expense: ${description}`,
                reference: expense.id,
                date: new Date(),
                transactions: [
                    { accountCode: debitAccount, type: "DEBIT", amount: Number(amount) },
                    { accountCode: "1001", type: "CREDIT", amount: Number(amount) }, // Cash
                ]
            }, tx);
        });
    } catch (error) {
        console.error("Failed to create expense:", error);
        return { error: "Failed to create expense" };
    }

    revalidatePath("/dashboard/expenses");
    redirect("/dashboard/expenses");
}

export async function deleteExpenseAction(id: string) {
    const headersList = await headers();
    const tenantId = headersList.get("x-tenant-id");

    if (!tenantId) return { error: "Unauthorized" };

    try {
        await db.expense.delete({
            where: { id, tenantId },
        });
        revalidatePath("/dashboard/expenses");
    } catch (error) {
        return { error: "Failed to delete expense" };
    }
}
