"use server";

import { getTenantContext } from "@/lib/auth";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

import { SalesService } from "@/_legacy_backend/services/sales";
import { InstallmentService } from "@/_legacy_backend/services/installments";

export async function createSaleAction(data: {
    warehouseId: string;
    items: { productId: string; quantity: number; price: number }[];
    customerId?: string;
    customerName?: string;
    discountType?: "percentage" | "fixed";
    discountValue?: number;
    paymentType?: "CASH" | "BANK_TRANSFER" | "DEFERRED";
    installmentCount?: number;
    installmentInterval?: number;
}) {
    const context = await getTenantContext();
    const { warehouseId, items, paymentType = "CASH", installmentCount = 1, installmentInterval = 1 } = data;

    if (!items || items.length === 0) return { error: "No items in sale" };
    if (!warehouseId) return { error: "Warehouse required" };

    try {
        // Check deferred permission
        const user = await prisma.user.findUnique({
            where: { id: context.userId },
            select: { role: true, canDeferred: true }
        });

        if (paymentType === "DEFERRED" && !user?.canDeferred && context.role !== "OWNER") {
            return { error: "You don't have permission to process deferred payments (Ajel)." };
        }

        const status = "COMPLETED";
        const sale = await SalesService.createSale(context.tenantId, context.userId, data, status);

        // If deferred, create installments
        if (paymentType === "DEFERRED" && sale.id) {
            await InstallmentService.createInstallments({
                tenantId: context.tenantId,
                total: Number(sale.total),
                count: installmentCount,
                startDate: new Date(),
                customerId: sale.customerId || undefined,
                saleId: sale.id,
                intervalMonths: installmentInterval,
            });
        }

        revalidatePath("/dashboard/sales-flow/sales");
        revalidatePath("/dashboard/finance/debts");
        return { success: true, saleId: sale.id };
    } catch (error: any) {
        console.error("Sale Action Error:", error);
        return { error: error.message || "Failed to process sale" };
    }
}
