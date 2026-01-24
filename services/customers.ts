import { prisma } from "@/lib/prisma";

export class CustomerService {
    static async list(tenantId: string) {
        return await prisma.customer.findMany({
            where: { tenantId },
            orderBy: { name: "asc" },
            include: {
                _count: {
                    select: { sales: true }
                }
            }
        });
    }

    static async getById(id: string, tenantId: string) {
        return await prisma.customer.findUnique({
            where: { id, tenantId },
            include: {
                sales: {
                    orderBy: { date: "desc" },
                },
                payments: {
                    orderBy: { date: "desc" },
                }
            }
        });
    }

    static async getCustomerStats(id: string, tenantId: string) {
        const [sales, payments] = await Promise.all([
            prisma.sale.aggregate({
                where: { customerId: id, tenantId },
                _sum: { total: true }
            }),
            prisma.customerPayment.aggregate({
                where: { customerId: id, tenantId },
                _sum: { amount: true }
            })
        ]);

        const totalSales = Number(sales._sum.total || 0);
        const totalPayments = Number(payments._sum.amount || 0);
        const balance = totalSales - totalPayments;

        return {
            totalSales,
            totalPayments,
            balance
        };
    }

    static async create(tenantId: string, data: {
        name: string;
        phone?: string;
        email?: string;
        address?: string;
        creditLimit?: number;
        notes?: string;
    }) {
        return await prisma.customer.create({
            data: {
                ...data,
                tenantId,
            },
        });
    }

    static async update(id: string, tenantId: string, data: {
        name?: string;
        phone?: string;
        email?: string;
        address?: string;
        creditLimit?: number;
        notes?: string;
    }) {
        return await prisma.customer.update({
            where: { id, tenantId },
            data,
        });
    }

    static async delete(id: string, tenantId: string) {
        return await prisma.customer.delete({
            where: { id, tenantId },
        });
    }
}
