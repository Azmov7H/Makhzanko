import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { InvoicesClient } from "./InvoicesClient";
import { Card, CardHeader } from "@/components/ui/card";

export default function InvoicesPage() {
    return (
        <Suspense fallback={<InvoicesSkeleton />}>
            <InvoicesClient />
        </Suspense>
    );
}

function InvoicesSkeleton() {
    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-start space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-4">
                    <Skeleton className="h-16 w-80 rounded-[2rem]" />
                    <Skeleton className="h-6 w-96 rounded-xl" />
                </div>
                <div className="flex gap-4">
                    <Skeleton className="h-16 w-32 rounded-[2rem]" />
                    <Skeleton className="h-16 w-48 rounded-[2rem]" />
                </div>
            </div>

            <Card className="border-none shadow-sm bg-card rounded-[3rem] overflow-hidden">
                <CardHeader className="p-10 border-b border-primary/5">
                    <Skeleton className="h-10 w-64 rounded-2xl mb-4" />
                    <Skeleton className="h-6 w-96 rounded-xl" />
                </CardHeader>
                <div className="p-10 space-y-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                    ))}
                </div>
            </Card>
        </div>
    );
}
