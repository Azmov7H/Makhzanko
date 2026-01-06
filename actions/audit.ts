"use server";

import { getTenantContext } from "@/lib/auth";
import { checkLimit } from "@/lib/limits";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuditService } from "@/services/audit";

export async function createInventoryCountAction(warehouseId: string) {
    const context = await getTenantContext();

    try {
        await checkLimit(context.tenantId, "audit");
        const count = await AuditService.createCount(context.tenantId, warehouseId);
        revalidatePath("/dashboard/inventory/audits");
        return { success: true, countId: count.id };
    } catch (error) {
        return { error: (error as Error).message };
    }
}

export async function updateCountLineAction(lineId: string, countedQty: number) {
    const context = await getTenantContext();
    try {
        const line = await AuditService.updateLine(lineId, context.tenantId, countedQty);
        revalidatePath(`/dashboard/inventory/audits/${line.countId}`);
        return { success: true };
    } catch (error) {
        return { error: (error as Error).message };
    }
}

export async function finalizeInventoryCountAction(countId: string) {
    const context = await getTenantContext();
    try {
        await AuditService.finalizeCount(countId, context.tenantId);
        revalidatePath("/dashboard/inventory/audits");
        redirect("/dashboard/inventory/audits");
    } catch (error) {
        return { error: (error as Error).message };
    }
}

