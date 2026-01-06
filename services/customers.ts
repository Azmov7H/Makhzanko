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
                    take: 5
                },
                payments: {
                    orderBy: { date: "desc" },
                    take: 5
                }
            }
        });
    }

    static async create(tenantId: string, data: any) {
        return await prisma.customer.create({
            data: {
                ...data,
                tenantId,
            },
        });
    }

    static async update(id: string, tenantId: string, data: any) {
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
