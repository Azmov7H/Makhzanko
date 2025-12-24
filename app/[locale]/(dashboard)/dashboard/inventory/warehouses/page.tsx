import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { WarehousesClient } from "./WarehousesClient";

export default async function WarehousesPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <Suspense fallback={<WarehousesSkeleton />}>
            <WarehousesContent locale={locale} />
        </Suspense>
    );
}

async function WarehousesContent({ locale }: { locale: string }) {
    const context = await getTenantContext();
    const t = await getI18n(locale as Locale);

    const warehouses = await db.warehouse.findMany({
        where: { tenantId: context.tenantId },
        orderBy: { name: "asc" },
        include: { _count: { select: { stocks: true } } }
    });

    return (
        <WarehousesClient
            warehouses={JSON.parse(JSON.stringify(warehouses))}
            locale={locale}
            t={t}
        />
    );
}

function WarehousesSkeleton() {
    return (
        <div className="space-y-8 text-start">
            <div className="flex justify-between items-center gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-12 w-64 rounded-xl" />
                    <Skeleton className="h-6 w-96 rounded-lg" />
                </div>
                <Skeleton className="h-12 w-48 rounded-2xl" />
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-64 w-full rounded-[2rem]" />
                ))}
            </div>
        </div>
    );
}
