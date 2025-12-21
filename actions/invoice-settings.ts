"use server";

import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import { checkLimit } from "@/lib/limits";
import { revalidatePath } from "next/cache";

interface InvoiceSettingsData {
    primaryColor?: string;
    fontFamily?: string;
    showTax?: boolean;
    showDiscount?: boolean;
    showSeller?: boolean;
    showWarehouse?: boolean;
    footerNotes?: string;
}

export async function getInvoiceSettingsAction() {
    const context = await getTenantContext();

    const settings = await db.invoiceSettings.findUnique({
        where: { tenantId: context.tenantId }
    });

    if (!settings) {
        return {
            primaryColor: "#000000",
            fontFamily: "Inter",
            templateStyle: "modern",
            showTax: true,
            showDiscount: true,
            showSeller: true,
            showWarehouse: false,
            footerNotes: ""
        };
    }

    return settings;
}

export async function updateInvoiceSettingsAction(data: InvoiceSettingsData) {
    const context = await getTenantContext();

    // Check Limits
    try {
        await checkLimit(context.tenantId, "customInvoices");
    } catch (error) {
        const err = error as Error;
        return { error: err.message };
    }

    const {
        primaryColor,
        fontFamily,
        showTax,
        showDiscount,
        showSeller,
        showWarehouse,
        footerNotes
    } = data;

    await db.invoiceSettings.upsert({
        where: { tenantId: context.tenantId },
        update: {
            primaryColor,
            fontFamily,
            showTax,
            showDiscount,
            showSeller,
            showWarehouse,
            footerNotes
        },
        create: {
            tenantId: context.tenantId,
            primaryColor: primaryColor || "#000000",
            fontFamily: fontFamily || "Inter",
            showTax: showTax ?? true,
            showDiscount: showDiscount ?? true,
            showSeller: showSeller ?? true,
            showWarehouse: showWarehouse ?? false,
            footerNotes: footerNotes || ""
        }
    });

    revalidatePath("/dashboard/sales-flow/invoices/design");
    return { success: true };
}
