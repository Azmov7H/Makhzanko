"use server";

import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkLimit } from "@/lib/limits";

export async function createWarehouseAction(prevState: any, formData: FormData) {
    const context = await getTenantContext();

    const name = formData.get("name") as string;
    const location = formData.get("location") as string;

    if (!name) return { error: "Name is required" };

    // Check Limits
    try {
        await checkLimit(context.tenantId, "warehouses");
    } catch (error) {
        const err = error as Error;
        return { error: err.message };
    }

    await db.warehouse.create({
        data: {
            name,
            location,
            tenantId: context.tenantId,
        },
    });

    revalidatePath("/dashboard/warehouses");
    redirect("/dashboard/warehouses");
}

export async function deleteWarehouseAction(formData: FormData) {
    const context = await getTenantContext();

    const id = formData.get("id") as string;

    await db.warehouse.delete({
        where: { id, tenantId: context.tenantId },
    });

    revalidatePath("/dashboard/warehouses");
}
