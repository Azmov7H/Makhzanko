"use server";

import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkLimit } from "@/lib/limits";

export async function createProductAction(formData: FormData) {
    const context = await getTenantContext();

    const name = formData.get("name") as string;
    const sku = formData.get("sku") as string;
    const price = parseFloat(formData.get("price") as string);
    const cost = parseFloat(formData.get("cost") as string);

    if (!name || !sku) return { error: "Missing fields" };

    // Check Limits
    try {
        await checkLimit(context.tenantId, "products");
    } catch (error) {
        const err = error as Error;
        return { error: err.message };
    }

    try {
        await db.product.create({
            data: {
                name,
                sku,
                price,
                cost,
                tenantId: context.tenantId,
            },
        });
    } catch (error) {
        console.error("Create Product Error:", error);
        return { error: "Failed to create product. SKU might be duplicate." };
    }

    revalidatePath("/dashboard/products");
    redirect("/dashboard/products");
}

export async function deleteProductAction(formData: FormData) {
    const context = await getTenantContext();

    const productId = formData.get("id") as string;

    await db.product.delete({
        where: {
            id: productId,
            tenantId: context.tenantId,
        },
    });

    revalidatePath("/dashboard/products");
}
