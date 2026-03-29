import { getTenantContext } from "@/lib/auth";
import { getI18n, getLocale } from "@/lib/i18n/server";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { WarehousesClient } from "./WarehousesClient";
import { Card, CardHeader } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export default async function WarehousesPage() {
    return (
        <Suspense fallback={<WarehousesSkeleton />}>
            <WarehousesContent />
        </Suspense>
    );
}

async function WarehousesContent() {
    const context = await getTenantContext();
    const locale = await getLocale();
    const t = await getI18n(locale);

    let warehouses: any[] = [];

    try {
        warehouses = await prisma.warehouse.findMany({
            where: { tenantId: context.tenantId },
            include: { stocks: true }
        });
    } catch (error) {
        console.error("Database error:", error);
        warehouses = [];
    }

    return (
        <div className="max-w-7xl mx-auto pb-20 px-4 sm:px-6 lg:px-8">
            <WarehousesClient
                warehouses={JSON.parse(JSON.stringify(warehouses))}
            />
        </div>
    );
}

function WarehousesSkeleton() {
    return (
        <div className="space-y-12 text-start max-w-7xl mx-auto pb-20 px-4 sm:px-6 lg:px-8 animate-pulse">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-4">
                    <Skeleton className="h-14 w-80 rounded-[1.5rem]" />
                    <Skeleton className="h-6 w-[32rem] rounded-xl opacity-50" />
                </div>
                <Skeleton className="h-14 w-full md:w-48 rounded-2xl" />
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-64 w-full rounded-[2.5rem] shadow-xl" />
                <Skeleton className="h-64 w-full rounded-[2.5rem] shadow-xl" />
                <Skeleton className="h-64 w-full rounded-[2.5rem] shadow-xl" />
            </div>
        </div>
    );
}
