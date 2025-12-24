import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import CustomerDirectoryClient from "./CustomerDirectoryClient";

export default async function CustomerStatementsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const context = await getTenantContext();

    const customers = await db.customer.findMany({
        where: { tenantId: context.tenantId },
        include: {
            sales: { where: { status: "COMPLETED" } },
            payments: true
        }
    });

    const customersWithBalance = customers.map(c => {
        const totalSales = c.sales.reduce((sum, s) => sum + Number(s.total), 0);
        const totalPayments = c.payments.reduce((sum, p) => sum + Number(p.amount), 0);
        return {
            ...c,
            totalSales,
            totalPayments,
            balance: totalSales - totalPayments
        };
    }).sort((a, b) => b.balance - a.balance);

    return (
        <CustomerDirectoryClient
            params={params}
            customersWithBalance={customersWithBalance}
        />
    );
}
