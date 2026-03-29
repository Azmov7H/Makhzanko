"use server";

import { InstallmentService } from "@/services/installments";
import { revalidatePath } from "next/cache";
import { getTenantContext } from "@/lib/auth";

export async function payInstallmentAction(id: string) {
    const context = await getTenantContext();
    await InstallmentService.markAsPaid(id, context.tenantId);
    revalidatePath("/dashboard/finance/debts");
}
