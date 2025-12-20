import { z } from "zod";

/**
 * Zod validation schemas for security
 */

// Auth schemas
export const loginSchema = z.object({
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export const registerSchema = z.object({
    name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    tenantName: z.string().min(2, "اسم المؤسسة يجب أن يكون حرفين على الأقل"),
});

// Product schema
export const productSchema = z.object({
    name: z.string().min(2, "اسم المنتج يجب أن يكون حرفين على الأقل"),
    sku: z.string().min(1, "رمز المنتج مطلوب"),
    price: z.number().positive("السعر يجب أن يكون أكبر من صفر"),
    cost: z.number().positive("التكلفة يجب أن تكون أكبر من صفر"),
});

// Warehouse schema
export const warehouseSchema = z.object({
    name: z.string().min(2, "اسم المستودع يجب أن يكون حرفين على الأقل"),
    location: z.string().optional(),
});

// Promo code schema
export const promoCodeSchema = z.object({
    planType: z.enum(["PRO", "BUSINESS"]),
    maxUses: z.number().positive().optional(),
    expiresAt: z.date().optional(),
});

// Owner login schema
export const ownerLoginSchema = z.object({
    username: z.string().min(3, "اسم المستخدم يجب أن يكون 3 أحرف على الأقل"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

// Sanitization helpers
export function sanitizeString(input: string): string {
    return input.trim().replace(/[<>]/g, "");
}

export function sanitizeEmail(email: string): string {
    return email.toLowerCase().trim();
}

// Input validation helper
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
    const result = schema.safeParse(data);

    if (result.success) {
        return { success: true, data: result.data };
    } else {
        const firstError = result.error.errors[0];
        return { success: false, error: firstError.message };
    }
}
