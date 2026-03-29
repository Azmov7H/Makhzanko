import { prisma } from "@/lib/prisma";

export class SupplierService {
    static async list(tenantId: string) {
        return await prisma.supplier.findMany({
            where: { tenantId },
            orderBy: { name: "asc" },
            include: {
                _count: {
                    select: { purchases: true }
                }
            }
        });
    }

    static async getById(id: string, tenantId: string) {
        return await prisma.supplier.findUnique({
            where: { id, tenantId },
            include: {
                purchases: {
                    orderBy: { date: "desc" },
                },
                payments: {
                    orderBy: { date: "desc" },
                },
                installments: {
                    orderBy: { dueDate: "asc" }
                }
            }
        });
    }

    static async getSupplierStats(id: string, tenantId: string) {
        const [purchases, payments] = await Promise.all([
            prisma.purchaseOrder.aggregate({
                where: { supplierId: id, tenantId },
                _sum: { total: true }
            }),
            prisma.supplierPayment.aggregate({
                where: { supplierId: id, tenantId },
                _sum: { amount: true }
            })
        ]);

        const totalPurchases = Number(purchases._sum.total || 0);
        const totalPayments = Number(payments._sum.amount || 0);
        const balance = totalPurchases - totalPayments;

        return {
            totalPurchases,
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
        return await prisma.supplier.create({
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
        return await prisma.supplier.update({
            where: { id, tenantId },
            data,
        });
    }

    static async delete(id: string, tenantId: string) {
        return await prisma.supplier.delete({
            where: { id, tenantId },
        });
    }
}
