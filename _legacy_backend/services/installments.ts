import { prisma } from "@/lib/prisma";
import { PaymentStatus, Prisma } from "@prisma/client";

export class InstallmentService {
    static async createInstallments(data: {
        tenantId: string;
        total: number;
        count: number;
        startDate: Date;
        customerId?: string;
        supplierId?: string;
        saleId?: string;
        purchaseId?: string;
        intervalMonths?: number;
    }) {
        const { tenantId, total, count, startDate, customerId, supplierId, saleId, purchaseId, intervalMonths = 1 } = data;
        const amountPerInstallment = total / count;

        const installments: Prisma.InstallmentCreateManyInput[] = [];
        for (let i = 0; i < count; i++) {
            const dueDate = new Date(startDate);
            dueDate.setMonth(dueDate.getMonth() + (i * intervalMonths));

            installments.push({
                tenantId,
                amount: amountPerInstallment,
                dueDate,
                status: PaymentStatus.UNPAID,
                customerId,
                supplierId,
                saleId,
                purchaseId,
            });
        }

        return await prisma.installment.createMany({
            data: installments,
        });
    }

    static async getPending(tenantId: string) {
        return await prisma.installment.findMany({
            where: {
                tenantId,
                status: { in: [PaymentStatus.UNPAID, PaymentStatus.PARTIAL] }
            },
            include: {
                customer: true,
                supplier: true,
                sale: true,
                purchase: true,
            },
            orderBy: { dueDate: "asc" }
        });
    }

    static async markAsPaid(id: string, tenantId: string) {
        return await prisma.installment.update({
            where: { id, tenantId },
            data: {
                status: PaymentStatus.PAID,
                paidAt: new Date(),
            }
        });
    }
}
