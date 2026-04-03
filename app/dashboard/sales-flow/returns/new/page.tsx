"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";
import ReturnForm from "./ReturnForm";
import { useI18n } from "@/lib/i18n/context";
import { getAuthToken } from "@/lib/auth/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewReturnPage() {
    const { t } = useI18n();
    const searchParams = useSearchParams();
    const router = useRouter();
    const invoiceId = searchParams.get("invoiceId");

    const [invoice, setInvoice] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!invoiceId) {
            router.push(`/dashboard/sales-flow/invoices`);
            return;
        }

        // TODO: Replace with REST API call
        // const token = getAuthToken();
        // fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/invoices/${invoiceId}`, {
        //     headers: { Authorization: `Bearer ${token}` }
        // })
        // .then(res => res.json())
        // .then(data => {
        //     setInvoice(data);
        //     setLoading(false);
        // })
        // .catch(() => setLoading(false));

        setLoading(false);
    }, [invoiceId, router]);

    if (loading) return <div className="p-12 space-y-8"><Skeleton className="h-20 w-1/3" /><Skeleton className="h-[600px] w-full" /></div>;
    
    // Placeholder if invoice not found (we'd handled this in fetch normally)
    const displayInvoice = invoice || { token: "...", currency: "EGP" };

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
                        {t("Returns.process_for_invoice")} <span className="text-primary font-black italic tracking-tighter">#{displayInvoice.token}</span>
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
                <ReturnForm invoiceId={invoiceId!} currency={displayInvoice.currency} />
            </div>
        </div>
    );
}
