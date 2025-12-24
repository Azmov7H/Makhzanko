import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import { Locale } from "@/lib/i18n/config";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { InvoicesClient } from "./InvoicesClient";
import { Card, CardHeader } from "@/components/ui/card";

export default async function InvoicesPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <Suspense fallback={<InvoicesSkeleton />}>
            <InvoicesContent locale={locale} />
        </Suspense>
    );
}

async function InvoicesContent({ locale }: { locale: string }) {
    const context = await getTenantContext();

    const invoices = await db.invoice.findMany({
        where: { tenantId: context.tenantId },
        select: {
            id: true,
            sale: {
                select: {
                    number: true,
                    date: true,
                    total: true
                }
            }
        },
        orderBy: { sale: { date: "desc" } }
    });

    return (
        <InvoicesClient
            invoices={JSON.parse(JSON.stringify(invoices))}
            locale={locale}
        />
    );
}

function InvoicesSkeleton() {
    return (
        <div className="space-y-8 text-start">
            <div className="flex justify-between items-center gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-12 w-64 rounded-xl" />
                    <Skeleton className="h-6 w-96 rounded-lg" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-12 w-32 rounded-2xl" />
                    <Skeleton className="h-12 w-48 rounded-2xl" />
                </div>
            </div>
            <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl rounded-3xl">
                <CardHeader className="p-8">
                    <Skeleton className="h-8 w-48 rounded-xl mb-2" />
                    <Skeleton className="h-4 w-64 rounded-lg" />
                </CardHeader>
                <div className="px-8 pb-8 space-y-4">
                    <Skeleton className="h-16 w-full rounded-2xl" />
                    <Skeleton className="h-16 w-full rounded-2xl" />
                    <Skeleton className="h-16 w-full rounded-2xl" />
                </div>
            </Card>
        </div>
    );
}
