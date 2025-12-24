import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import { notFound } from "next/navigation";
import { InvoiceDocument } from "./InvoiceDocument";
import { getInvoiceFinancialSummary } from "@/actions/reports";

export default async function InvoicePage({ params }: { params: Promise<{ id: string; locale: string }> }) {
    const { id, locale } = await params;
    const context = await getTenantContext();

    const invoice = await db.invoice.findUnique({
        where: { id, tenantId: context.tenantId },
        include: {
            tenant: { include: { invoiceSettings: true } },
            sale: { include: { items: { include: { product: true } } } }
        }
    });

    if (!invoice) notFound();

    const settings = invoice.tenant.invoiceSettings;
    const financials = await getInvoiceFinancialSummary(invoice.id);

    // Build items with product names
    const items = invoice.sale.items.map(item => ({
        name: item.product.name,
        sku: item.product.sku,
        quantity: item.quantity,
        price: Number(item.price),
        cost: Number(item.cost), // Added cost for warnings
    }));

    const invoiceData = {
        id: invoice.id,
        token: invoice.token || `INV-${invoice.id.substring(0, 8)}`,
        customerName: invoice.customerName || undefined,
        date: invoice.sale.date.toISOString(),
        items,
        subtotal: Number(invoice.subtotal),
        discountType: invoice.discountType || undefined,
        discountValue: invoice.discountValue ? Number(invoice.discountValue) : undefined,
        discountAmount: Number(invoice.discountAmount),
        total: Number(invoice.total),
        companyName: invoice.tenant.name,
        companyAddress: settings?.companyAddress || undefined,
        companyPhone: settings?.companyPhone || undefined,
        companyEmail: settings?.companyEmail || undefined,
        footerNotes: settings?.footerNotes || undefined,
        currency: invoice.tenant.currency || "EGP",
        status: invoice.status,
        locale,
        settings: settings ? {
            logoUrl: settings.logoUrl || undefined,
            primaryColor: settings.primaryColor || undefined,
            accentColor: settings.accentColor || undefined,
            fontSize: (settings.fontSize as any) || "medium",
            fontFamily: settings.fontFamily || undefined,
            showTax: settings.showTax,
            showDiscount: settings.showDiscount,
            showSeller: settings.showSeller,
            showCustomerSection: settings.showCustomerSection,
            showItemCode: settings.showItemCode,
        } : undefined,
        financials: financials && !("error" in financials) ? financials : undefined,
    };


    return (
        <div className="min-h-screen bg-gray-100 print:bg-white py-8 print:py-0">
            <InvoiceDocument data={invoiceData} />
        </div>
    );
}

