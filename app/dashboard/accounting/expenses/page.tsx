import { prisma } from "@/lib/prisma";
import { getTenantContext } from "@/lib/auth";
import { ExpensesClient } from "./_components/ExpensesClient";

export default async function ExpensesPage() {
    const context = await getTenantContext();
    const expenses = await prisma.expense.findMany({
        where: { tenantId: context.tenantId },
        orderBy: { date: "desc" }
    });

    return <ExpensesClient expenses={expenses} />;
}
