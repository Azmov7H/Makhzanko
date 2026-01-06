import { getI18n, getLocale } from "@/lib/i18n/server";
import { getTenantContext } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Sparkles } from "lucide-react";
import ReturnForm from "./ReturnForm";

export default async function NewReturnPage({
    searchParams,
}: {
    searchParams: Promise<{ invoiceId?: string }>;
}) {
    const { invoiceId } = await searchParams;
    const context = await getTenantContext();
    const t = await getI18n();

    if (!invoiceId) {
        redirect(`/dashboard/sales-flow/invoices`);
    }

    // Verify invoice exists and belongs to tenant
    const invoice = await prisma.invoice.findUnique({
        where: { id: invoiceId, tenantId: context.tenantId },
        include: { tenant: true },
    });

    if (!invoice) {
        notFound();
    }

    const currency = invoice.tenant.currency || "EGP";

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-start space-y-12">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative">
                <div className="relative">
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-primary/20 rounded-full blur-sm" />
                    <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent italic flex items-center gap-4">
                        <RotateCcw className="h-10 w-10 text-primary animate-in spin-in-180 duration-1000" />
                        {t("Returns.new_return")}
                    </h1>
                    <p className="text-muted-foreground mt-3 text-lg font-medium max-w-2xl">
                        {t("Returns.process_for_invoice")} <span className="text-primary font-black italic tracking-tighter">#{invoice.token}</span>
                    </p>
                </div>

                <Button asChild variant="outline" className="h-16 px-8 rounded-2xl border-primary/10 bg-card/40 backdrop-blur-xl hover:bg-primary/5 hover:border-primary/20 transition-all duration-500 group">
                    <Link href={`/dashboard/sales-flow/invoices/${invoiceId}`} className="flex items-center gap-3">
                        <ArrowLeft className="h-6 w-6 text-primary group-hover:-translate-x-1 transition-transform" />
                        <span className="font-black text-xs uppercase tracking-widest text-primary/70">{t("Invoices.back_to_invoice")}</span>
                    </Link>
                </Button>
            </div>

            {/* Form Container */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 rounded-[3rem] blur-3xl -z-10" />
                <ReturnForm invoiceId={invoiceId} currency={currency} />
            </div>
        </div>
    );
}
