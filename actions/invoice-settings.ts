"use server";

import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import { checkLimit } from "@/lib/limits";
import { revalidatePath } from "next/cache";

interface InvoiceSettingsData {
    // Branding
    logoUrl?: string;
    primaryColor?: string;
    accentColor?: string;
    fontFamily?: string;
    fontSize?: string;
    // Visibility toggles
    showTax?: boolean;
    showDiscount?: boolean;
    showSeller?: boolean;
    showWarehouse?: boolean;
    showCustomerSection?: boolean;
    showItemCode?: boolean;
    // Company info
    companyAddress?: string;
    companyPhone?: string;
    companyEmail?: string;
    footerNotes?: string;
}

export async function getInvoiceSettingsAction() {
    const context = await getTenantContext();

    const settings = await db.invoiceSettings.findUnique({
        where: { tenantId: context.tenantId }
    });

    if (!settings) {
        return {
            logoUrl: null,
            primaryColor: "#000000",
            accentColor: "#4F46E5",
            fontFamily: "Inter",
            fontSize: "medium",
            templateStyle: "modern",
            showTax: true,
            showDiscount: true,
            showSeller: true,
            showWarehouse: false,
            showCustomerSection: true,
            showItemCode: true,
            companyAddress: "",
            companyPhone: "",
            companyEmail: "",
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
        logoUrl,
        primaryColor,
        accentColor,
        fontFamily,
        fontSize,
        showTax,
        showDiscount,
        showSeller,
        showWarehouse,
        showCustomerSection,
        showItemCode,
        companyAddress,
        companyPhone,
        companyEmail,
        footerNotes
    } = data;

    await db.invoiceSettings.upsert({
        where: { tenantId: context.tenantId },
        update: {
            logoUrl,
            primaryColor,
            accentColor,
            fontFamily,
            fontSize,
            showTax,
            showDiscount,
            showSeller,
            showWarehouse,
            showCustomerSection,
            showItemCode,
            companyAddress,
            companyPhone,
            companyEmail,
            footerNotes
        },
        create: {
            tenantId: context.tenantId,
            logoUrl,
            primaryColor: primaryColor || "#000000",
            accentColor: accentColor || "#4F46E5",
            fontFamily: fontFamily || "Inter",
            fontSize: fontSize || "medium",
            showTax: showTax ?? true,
            showDiscount: showDiscount ?? true,
            showSeller: showSeller ?? true,
            showWarehouse: showWarehouse ?? false,
            showCustomerSection: showCustomerSection ?? true,
            showItemCode: showItemCode ?? true,
            companyAddress: companyAddress || "",
            companyPhone: companyPhone || "",
            companyEmail: companyEmail || "",
            footerNotes: footerNotes || ""
        }
    });

    revalidatePath("/dashboard/sales-flow/invoices/design");
    revalidatePath("/dashboard/sales-flow/invoices");
    return { success: true };
}

