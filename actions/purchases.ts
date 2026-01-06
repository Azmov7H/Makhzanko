"use server";

import { getTenantContext } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PurchaseService } from "@/services/purchases";

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

    if (!warehouseId || !itemsJson) {
        return { error: "Missing required fields" };
    }

    const items: PurchaseItemInput[] = JSON.parse(itemsJson);

    if (items.length === 0) {
        return { error: "No items in purchase order" };
    }

    try {
        await PurchaseService.createPurchase(context.tenantId, {
            warehouseId,
            supplier,
            items
        });
    } catch (error) {
        console.error("Purchase Creation Error:", error);
        return { error: (error as Error).message || "Failed to process purchase order" };
    }

    revalidatePath("/dashboard/finance/purchases");
    redirect("/dashboard/finance/purchases");
}

