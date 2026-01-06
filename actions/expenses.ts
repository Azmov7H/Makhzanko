"use server";

import { getTenantContext } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ExpenseService } from "@/services/expenses";

export async function createExpenseAction(prevState: any, formData: FormData) {
    const context = await getTenantContext();

    const description = formData.get("description") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const category = formData.get("category") as string;

    if (!description || !amount || !category) {
        return { error: "Missing required fields" };
    }

    try {
        await ExpenseService.createExpense(context.tenantId, {
            description,
            amount,
            category
        });
    } catch (error) {
        console.error("Failed to create expense:", error);
        return { error: "Failed to create expense" };
    }

    revalidatePath("/dashboard/finance/expenses");
    redirect("/dashboard/finance/expenses");
}

export async function deleteExpenseAction(id: string) {
    const context = await getTenantContext();

    try {
        await ExpenseService.deleteExpense(id, context.tenantId);
        revalidatePath("/dashboard/finance/expenses");
    } catch (error) {
        return { error: "Failed to delete expense" };
    }
}

