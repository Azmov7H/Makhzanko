"use server";

import { ProductService } from "@/services/products";
import { getTenantContext } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProductAction(prevState: any, formData: FormData) {
    const context = await getTenantContext();

    const name = formData.get("name") as string;
    const sku = formData.get("sku") as string;
    const price = parseFloat(formData.get("price") as string);
    const cost = parseFloat(formData.get("cost") as string);
    const minStock = parseInt(formData.get("minStock") as string) || 0;

    if (!name || !sku) return { error: "Missing fields" };

    try {
        await ProductService.create(context.tenantId, { name, sku, price, cost, minStock });
    } catch (error: any) {
        console.error("Create Product Error:", error);
        return { error: error.message || "Failed to create product" };
    }

    revalidatePath("/dashboard/inventory/products");
    redirect("/dashboard/inventory/products");
}

export async function updateProductAction(prevState: any, formData: FormData) {
    const context = await getTenantContext();

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const sku = formData.get("sku") as string;
    const price = parseFloat(formData.get("price") as string);
    const cost = parseFloat(formData.get("cost") as string);
    const minStock = parseInt(formData.get("minStock") as string) || 0;

    if (!id || !name || !sku) return { error: "Missing fields" };

    try {
        await ProductService.update(id, context.tenantId, { name, sku, price, cost, minStock });
    } catch (error: any) {
        console.error("Update Product Error:", error);
        return { error: error.message || "Failed to update product" };
    }

    revalidatePath("/dashboard/inventory/products");
    redirect("/dashboard/inventory/products");
}

export async function deleteProductAction(formData: FormData) {
    const context = await getTenantContext();
    const productId = formData.get("id") as string;

    try {
        await ProductService.delete(productId, context.tenantId);
        revalidatePath("/dashboard/inventory/products");
    } catch (error: any) {
        return { error: "Failed to delete product" };
    }
}

export async function checkProductExistsAction(field: "sku" | "name", value: string) {
    const context = await getTenantContext();
    if (!value) return false;
    return await ProductService.checkExists(context.tenantId, field, value);
}
