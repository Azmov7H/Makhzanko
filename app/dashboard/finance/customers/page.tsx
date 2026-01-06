import { prisma } from "@/lib/prisma";
import { getTenantContext } from "@/lib/auth";
import CustomerDirectoryClient from "./CustomerDirectoryClient";

export default async function CustomerStatementsPage() {
    const context = await getTenantContext();

    const customers = await prisma.customer.findMany({
        where: { tenantId: context.tenantId },
        include: {
            sales: { where: { status: "COMPLETED" } },
            payments: true
        }
    });

    const customersWithBalance = customers.map((c) => {
        const totalSales = c.sales.reduce((sum: number, s: any) => sum + Number(s.total), 0);
        const totalPayments = c.payments.reduce((sum: number, p: any) => sum + Number(p.amount), 0);
        return {
            ...c,
            totalSales,
            totalPayments,
            balance: totalSales - totalPayments
        };
    }).sort((a, b) => b.balance - a.balance);

    return (
        <CustomerDirectoryClient
            customersWithBalance={customersWithBalance}
        />
    );
}
