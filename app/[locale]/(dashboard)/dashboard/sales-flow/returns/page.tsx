import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ReturnsClient } from "./ReturnsClient";
import { Card, CardHeader } from "@/components/ui/card";

export default async function ReturnsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <Suspense fallback={<ReturnsSkeleton />}>
            <ReturnsContent locale={locale} />
        </Suspense>
    );
}

async function ReturnsContent({ locale }: { locale: string }) {
    const context = await getTenantContext();
    const t = await getI18n(locale as Locale);

    const returns = await db.return.findMany({
        where: { tenantId: context.tenantId },
        include: {
            invoice: true,
            items: { include: { product: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <ReturnsClient
            returns={JSON.parse(JSON.stringify(returns))}
            locale={locale}
            t={t}
        />
    );
}

function ReturnsSkeleton() {
    return (
        <div className="space-y-8 text-start">
            <div className="flex justify-between items-center gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-12 w-64 rounded-xl" />
                    <Skeleton className="h-6 w-96 rounded-lg" />
                </div>
                <Skeleton className="h-12 w-32 rounded-2xl" />
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
