import { prisma } from "@/lib/prisma";
import { getTenantContext } from "@/lib/auth";
import { notFound } from "next/navigation";
import { InvoiceDocument } from "./InvoiceDocument";
import { getInvoiceFinancialSummary } from "@/_legacy_backend/actions/reports";
import { getLocale } from "@/lib/i18n/server";

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const context = await getTenantContext();
  const locale = await getLocale();

  const invoice = await prisma.invoice.findUnique({
    where: {
      id,
      tenantId: context.tenantId,
    },
    include: {
      tenant: {
        include: {
          invoiceSettings: true,
        },
      },
      sale: {
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  if (!invoice) notFound();

  const settings = invoice.tenant.invoiceSettings ?? null;
  const financials = await getInvoiceFinancialSummary(invoice.id);

  const items = invoice.sale.items.map((item) => ({
    name: item.product.name,
    sku: item.product.sku,
    quantity: item.quantity,
    price: Number(item.price),
    cost: Number(item.cost),
  }));

  const invoiceData = {
    id: invoice.id,
    token: invoice.token ?? `INV-${invoice.id.slice(0, 8)}`,
    customerName: invoice.customerName ?? undefined,
    date: invoice.sale.date.toISOString(),

    items,

    subtotal: Number(invoice.subtotal),
    discountType: invoice.discountType ?? undefined,
    discountValue:
      invoice.discountValue !== null
        ? Number(invoice.discountValue)
        : undefined,
    discountAmount: Number(invoice.discountAmount),
    total: Number(invoice.total),

    companyName: invoice.tenant.name,
    companyAddress: settings?.companyAddress ?? undefined,
    companyPhone: settings?.companyPhone ?? undefined,
    companyEmail: settings?.companyEmail ?? undefined,
    footerNotes: settings?.footerNotes ?? undefined,
    currency: invoice.tenant.currency ?? "EGP",
    status: invoice.status,
    locale,

    settings: settings
      ? {
        logoUrl: settings.logoUrl ?? undefined,
        primaryColor: settings.primaryColor ?? undefined,
        accentColor: settings.accentColor ?? undefined,
        fontSize: (settings.fontSize ?? "medium") as
          | "small"
          | "medium"
          | "large",
        fontFamily: settings.fontFamily ?? undefined,
        showTax: settings.showTax,
        showDiscount: settings.showDiscount,
        showSeller: settings.showSeller,
        showCustomerSection: settings.showCustomerSection,
      }
      : undefined,

    financials:
      financials && !("error" in financials) ? financials : undefined,
  };

  return (
    <div className="min-h-screen bg-gray-50/50 print:bg-white py-12 print:py-0">
      <InvoiceDocument data={invoiceData} />
    </div>
  );
}
