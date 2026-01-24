"use server";

import { SupplierService } from "@/services/suppliers";
import { revalidatePath } from "next/cache";
import { getTenantContext } from "@/lib/auth";

export async function createSupplierAction(formData: FormData) {
    const context = await getTenantContext();
    const data = {
        name: formData.get("name") as string,
        phone: formData.get("phone") as string || undefined,
        email: formData.get("email") as string || undefined,
        address: formData.get("address") as string || undefined,
        creditLimit: Number(formData.get("creditLimit")) || 0,
        notes: formData.get("notes") as string || undefined,
    };

    await SupplierService.create(context.tenantId, data);
    revalidatePath("/dashboard/suppliers");
}

export async function updateSupplierAction(formData: FormData) {
    const context = await getTenantContext();
    const id = formData.get("id") as string;
    const data = {
        name: formData.get("name") as string,
        phone: formData.get("phone") as string || undefined,
        email: formData.get("email") as string || undefined,
        address: formData.get("address") as string || undefined,
        creditLimit: Number(formData.get("creditLimit")) || 0,
        notes: formData.get("notes") as string || undefined,
    };

    await SupplierService.update(id, context.tenantId, data);
    revalidatePath("/dashboard/suppliers");
}

export async function deleteSupplierAction(formData: FormData) {
    const context = await getTenantContext();
    const id = formData.get("id") as string;
    await SupplierService.delete(id, context.tenantId);
    revalidatePath("/dashboard/suppliers");
}
