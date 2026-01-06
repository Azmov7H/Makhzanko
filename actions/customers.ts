"use server";

import { CustomerService } from "@/services/customers";
import { getTenantContext } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkLimit } from "@/lib/limits";

export async function createCustomerAction(prevState: any, formData: FormData) {
    const context = await getTenantContext();

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;

    if (!name) return { error: "Name is required" };

    try {
        await checkLimit(context.tenantId, "customers");
        await CustomerService.create(context.tenantId, { name, phone, email });
    } catch (error: any) {
        console.error("Create Customer Error:", error);
        return { error: error.message || "Failed to create customer" };
    }

    revalidatePath("/dashboard/customers");
    redirect("/dashboard/customers");
}

export async function updateCustomerAction(prevState: any, formData: FormData) {
    const context = await getTenantContext();

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;

    if (!id || !name) return { error: "Missing fields" };

    try {
        await CustomerService.update(id, context.tenantId, { name, phone, email });
    } catch (error: any) {
        return { error: error.message || "Failed to update customer" };
    }

    revalidatePath("/dashboard/customers");
    redirect("/dashboard/customers");
}

export async function deleteCustomerAction(formData: FormData) {
    const context = await getTenantContext();
    const id = formData.get("id") as string;

    try {
        await CustomerService.delete(id, context.tenantId);
        revalidatePath("/dashboard/customers");
    } catch (error: any) {
        console.error("Delete Customer Error:", error);
    }
}
