"use server";

import { UserService } from "@/services/users";
import { getTenantContext } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

export async function createUserAction(prevState: any, formData: FormData) {
    const context = await getTenantContext();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as Role;

    if (!name || !email) return { error: "Missing required fields" };

    try {
        await UserService.create(context.tenantId, { name, email, role });
    } catch (error: any) {
        return { error: error.message || "Failed to create user" };
    }

    revalidatePath("/dashboard/users");
    redirect("/dashboard/users");
}

export async function updateUserAction(prevState: any, formData: FormData) {
    const context = await getTenantContext();

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as Role;
    const isActive = formData.get("isActive") === "on";

    if (!id || !name || !email) return { error: "Missing fields" };

    try {
        await UserService.update(id, context.tenantId, { name, email, role, isActive });
    } catch (error: any) {
        return { error: error.message || "Failed to update user" };
    }

    revalidatePath("/dashboard/users");
    redirect("/dashboard/users");
}

export async function deleteUserAction(formData: FormData) {
    const context = await getTenantContext();
    const id = formData.get("id") as string;

    try {
        await UserService.delete(id, context.tenantId);
        revalidatePath("/dashboard/users");
    } catch (error: any) {
        return { error: "Failed to delete user" };
    }
}
