"use server";

import { getTenantContext } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PurchaseService } from "@/_legacy_backend/services/purchases";
import { InstallmentService } from "@/_legacy_backend/services/installments";

interface PurchaseItemInput {
    productId: string;
    quantity: number;
    cost: number;
}

export async function createPurchaseAction(prevState: unknown, formData: FormData) {
    const context = await getTenantContext();

    const warehouseId = formData.get("warehouseId") as string;
    const itemsJson = formData.get("items") as string;
    const supplier = formData.get("supplier") as string;
    const supplierId = formData.get("supplierId") as string;
    const paymentType = formData.get("paymentType") as string;
    const installmentCount = Number(formData.get("installmentCount") || "1");
    const installmentInterval = Number(formData.get("installmentInterval") || "1");

    if (!warehouseId || !itemsJson) {
        return { error: "Missing required fields" };
    }

    const items: PurchaseItemInput[] = JSON.parse(itemsJson);

    if (items.length === 0) {
        return { error: "No items in purchase order" };
    }

    try {
        const po = await PurchaseService.createPurchase(context.tenantId, {
            warehouseId,
            supplier,
            supplierId: (supplierId && supplierId !== "manual") ? supplierId : undefined,
            items
        });

        // Handle installments
        if (paymentType === "DEFERRED" && po.id) {
            await InstallmentService.createInstallments({
                tenantId: context.tenantId,
                total: Number(po.total),
                count: installmentCount,
                startDate: new Date(),
                supplierId: po.supplierId || undefined,
                purchaseId: po.id,
                intervalMonths: installmentInterval,
            });
        }
    } catch (error) {
        console.error("Purchase Creation Error:", error);
        return { error: (error as Error).message || "Failed to process purchase order" };
    }

    revalidatePath("/dashboard/finance/purchases");
    revalidatePath("/dashboard/finance/debts");
    redirect("/dashboard/finance/purchases");
}

