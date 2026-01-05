"use server";

import { prisma } from "@/lib/prisma";
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

    await prisma.warehouse.create({
        data: {
            name,
            location,
            tenantId: context.tenantId,
        },
    });

    revalidatePath("/dashboard/inventory/warehouses");
    redirect("/dashboard/inventory/warehouses");
}

export async function updateWarehouseAction(prevState: any, formData: FormData) {
    const context = await getTenantContext();

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const location = formData.get("location") as string;

    if (!id || !name) return { error: "Name is required" };

    try {
        await prisma.warehouse.update({
            where: { id, tenantId: context.tenantId },
            data: { name, location },
        });
    } catch (error: any) {
        console.error("Update Warehouse Error:", error);
        return { error: error.message || "Failed to update warehouse" };
    }

    revalidatePath("/dashboard/inventory/warehouses");
    redirect("/dashboard/inventory/warehouses");
}

export async function deleteWarehouseAction(formData: FormData) {
    const context = await getTenantContext();

    const id = formData.get("id") as string;

    await prisma.warehouse.delete({
        where: { id, tenantId: context.tenantId },
    });

    revalidatePath("/dashboard/inventory/warehouses");
}
