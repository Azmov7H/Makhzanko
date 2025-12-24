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
    templateStyle?: string;
    // Visibility toggles
    showTax?: boolean;
    showDiscount?: boolean;
    showSeller?: boolean;
    showWarehouse?: boolean;
    showCustomerSection?: boolean;
    showItemCode?: boolean;
    showHeader?: boolean;
    showFooter?: boolean;
    showPaymentInfo?: boolean;
    // Company info
    companyAddress?: string;
    companyPhone?: string;
    companyEmail?: string;
    companyTaxId?: string;
    footerNotes?: string;
}

export async function getInvoiceSettingsAction() {
    const context = await getTenantContext();

    const settings = await db.invoiceSettings.findUnique({
        where: { tenantId: context.tenantId },
        select: {
            logoUrl: true,
            primaryColor: true,
            accentColor: true,
            fontFamily: true,
            fontSize: true,
            templateStyle: true,
            showTax: true,
            showDiscount: true,
            showSeller: true,
            showCustomerSection: true,
            companyAddress: true,
            companyPhone: true,
            companyEmail: true,
            footerNotes: true
        }
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
            showCustomerSection: true,
            companyAddress: "",
            companyPhone: "",
            companyEmail: "",
            companyTaxId: "",
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
        templateStyle,
        showTax,
        showDiscount,
        showSeller,
        showWarehouse,
        showCustomerSection,
        showItemCode,
        showHeader,
        showFooter,
        showPaymentInfo,
        companyAddress,
        companyPhone,
        companyEmail,
        companyTaxId,
        footerNotes
    } = data;

    const existingSettings = await db.invoiceSettings.findUnique({
        where: { tenantId: context.tenantId },
        select: { id: true }
    });

    if (existingSettings) {
        await db.invoiceSettings.update({
            where: { tenantId: context.tenantId },
            data: {
                logoUrl,
                primaryColor,
                accentColor,
                fontFamily,
                fontSize,
                templateStyle,
                showTax,
                showDiscount,
                showSeller,
                showCustomerSection,
                companyAddress,
                companyPhone,
                companyEmail,
                footerNotes
            },
            select: { id: true }
        });
    } else {
        await db.invoiceSettings.create({
            data: {
                tenantId: context.tenantId,
                logoUrl,
                primaryColor: primaryColor || "#000000",
                accentColor: accentColor || "#4F46E5",
                fontFamily: fontFamily || "Inter",
                fontSize: fontSize || "medium",
                templateStyle: templateStyle || "modern",
                showTax: showTax ?? true,
                showDiscount: showDiscount ?? true,
                showSeller: showSeller ?? true,
                showCustomerSection: showCustomerSection ?? true,
                companyAddress: companyAddress || "",
                companyPhone: companyPhone || "",
                companyEmail: companyEmail || "",
                footerNotes: footerNotes || ""
            },
            select: { id: true }
        });
    }

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard/sales-flow/invoices/design");
    revalidatePath("/dashboard/sales-flow/invoices");
    return { success: true };
}

