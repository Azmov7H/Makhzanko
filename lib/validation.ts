import { z } from "zod";

/**
 * Factory functions for Zod validation schemas with i18n support.
 */

export const getLoginSchema = (t: (key: string) => string) => z.object({
    email: z.string().email(t("Auth.email_invalid")),
    password: z.string().min(6, t("Auth.password_min")),
});

export const getRegisterSchema = (t: (key: string) => string) => z.object({
    name: z.string().min(2, t("Auth.name_min")),
    email: z.string().email(t("Auth.email_invalid")),
    password: z.string().min(6, t("Auth.password_min")),
    tenantName: z.string().min(2, t("Auth.tenant_name_min")),
});

export const getProductSchema = (t: (key: string) => string) => z.object({
    name: z.string().min(2, t("Products.name_min")),
    sku: z.string().min(1, t("Products.sku_required")),
    price: z.coerce.number().positive(t("Products.price_positive")),
    cost: z.coerce.number().min(0, { message: t("Validation.number_positive") }),
    minStock: z.coerce.number().int().min(0, { message: t("Validation.number_positive") }).default(0),
});

export const getWarehouseSchema = (t: (key: string) => string) => z.object({
    name: z.string().min(2, t("Warehouses.name_min")),
    location: z.string().optional(),
});

// Original schemas (keeping for backward compatibility or simple server-side use with default messages)
export const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const productSchema = z.object({
    name: z.string().min(2, "Name too short"),
    sku: z.string().min(1, "SKU required"),
    price: z.coerce.number().positive("Price must be positive"),
    cost: z.coerce.number().positive("Cost must be positive"),
});

// Sanitization helpers
export function sanitizeString(input: string): string {
    return input.trim().replace(/[<>]/g, "");
}

export function sanitizeEmail(email: string): string {
    return email.toLowerCase().trim();
}

/**
 * Validates data against a schema and returns the data or a first error message.
 */
export async function validateData<T>(schema: z.ZodSchema<T>, data: unknown): Promise<{ success: true; data: T } | { success: false; error: string }> {
    const result = await schema.safeParseAsync(data);

    if (result.success) {
        return { success: true, data: result.data };
    } else {
        const firstError = result.error.errors[0];
        return { success: false, error: firstError.message };
    }
}
