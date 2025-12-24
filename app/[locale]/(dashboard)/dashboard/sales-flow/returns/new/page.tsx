import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";
import { getTenantContext } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ReturnForm from "./ReturnForm";

export default async function NewReturnPage({
    params,
    searchParams,
}: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ invoiceId?: string }>;
}) {
    const { locale } = await params;
    const { invoiceId } = await searchParams;
    const context = await getTenantContext();
    const t = await getI18n(locale as Locale);

    if (!invoiceId) {
        redirect(`/${locale}/dashboard/sales-flow/invoices`);
    }

    // Verify invoice exists and belongs to tenant
    const invoice = await db.invoice.findUnique({
        where: { id: invoiceId, tenantId: context.tenantId },
        include: { tenant: true },
    });

    if (!invoice) {
        notFound();
    }

    const currency = invoice.tenant.currency || "EGP";

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create Return</h1>
                    <p className="text-muted-foreground mt-1">
                        Process a return for invoice <span className="font-mono font-bold">{invoice.token}</span>
                    </p>
                </div>
                <Button asChild variant="outline" className="gap-2">
                    <Link href={`/${locale}/dashboard/sales-flow/invoices/${invoiceId}`}>
                        <ArrowLeft className="h-4 w-4" />
                        Back to Invoice
                    </Link>
                </Button>
            </div>

            <ReturnForm invoiceId={invoiceId} locale={locale} currency={currency} />
        </div>
    );
}
