"use server";

import { SalesService } from "@/services/sales";
import { getTenantContext } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { checkLimit } from "@/lib/limits";
import { prisma } from "@/lib/prisma";

export async function createSaleAction(data: {
    warehouseId: string;
    items: { productId: string; quantity: number; price: number }[];
    customerId?: string;
    customerName?: string;
    discountType?: "percentage" | "fixed";
    discountValue?: number;
    paymentType?: "CASH" | "BANK_TRANSFER" | "DEFERRED" | "ONLINE";
}) {
    const context = await getTenantContext();
    const { warehouseId, items, paymentType = "CASH" } = data;

    if (!items || items.length === 0) return { error: "No items in sale" };
    if (!warehouseId) return { error: "Warehouse required" };

    try {
        // Check deferred permission (simplified)
        const user = await prisma.user.findUnique({
            where: { id: context.userId },
            select: { role: true, canDeferred: true }
        });

        if (paymentType === "DEFERRED" && !user?.canDeferred && context.role !== "OWNER") {
            return { error: "You don't have permission to process deferred payments (Ajel)." };
        }

        await checkLimit(context.tenantId, "sales");

        const status = paymentType === "ONLINE" ? "PENDING_PAYMENT" : "COMPLETED";
        const sale = await SalesService.createSale(context.tenantId, context.userId, data, status);

        revalidatePath("/dashboard/sales-flow/sales");
        return { success: true, saleId: sale.id };
    } catch (error: any) {
        console.error("Sale Action Error:", error);
        return { error: error.message || "Failed to process sale" };
    }
}
