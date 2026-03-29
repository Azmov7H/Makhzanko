import { prisma } from "@/lib/prisma";
import { getTenantContext } from "@/lib/auth";
import { getI18n, getLocale } from "@/lib/i18n/server";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AuditsClient } from "./AuditsClient";
import { Card, CardHeader } from "@/components/ui/card";

export default async function AuditListPage() {
    return (
        <Suspense fallback={<AuditListSkeleton />}>
            <AuditListContent />
        </Suspense>
    );
}

async function AuditListContent() {
    const context = await getTenantContext();
    const locale = await getLocale();
    const t = await getI18n(locale);

    const audits = await prisma.inventoryCount.findMany({
        where: { tenantId: context.tenantId },
        include: { warehouse: true },
        orderBy: { date: "desc" }
    });

    return (
        <div className="max-w-7xl mx-auto pb-20 px-4 sm:px-6 lg:px-8">
            <AuditsClient
                audits={JSON.parse(JSON.stringify(audits))}
            />
        </div>
    );
}

function AuditListSkeleton() {
    return (
        <div className="space-y-12 text-start max-w-7xl mx-auto pb-20 px-4 sm:px-6 lg:px-8 animate-pulse">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-4">
                    <Skeleton className="h-14 w-80 rounded-[1.5rem]" />
                    <Skeleton className="h-6 w-[32rem] rounded-xl opacity-50" />
                </div>
                <Skeleton className="h-14 w-full md:w-48 rounded-2xl" />
            </div>
            <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-xl rounded-[3rem] overflow-hidden">
                <CardHeader className="p-10 border-b border-primary/5">
                    <Skeleton className="h-10 w-64 rounded-xl mb-3" />
                    <Skeleton className="h-5 w-96 rounded-lg opacity-40" />
                </CardHeader>
                <div className="p-10 space-y-6">
                    <Skeleton className="h-24 w-full rounded-2xl" />
                    <Skeleton className="h-24 w-full rounded-2xl" />
                    <Skeleton className="h-24 w-full rounded-2xl" />
                </div>
            </Card>
        </div>
    );
}
