import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function InventoryLoading() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <Skeleton className="h-8 w-40 sm:w-48 mb-2" />
                    <Skeleton className="h-4 w-56 sm:w-72" />
                </div>
                <Skeleton className="h-10 w-full sm:w-32 rounded-lg" />
            </div>

            {/* Table skeleton */}
            <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
                    <Skeleton className="h-10 w-full sm:w-64 rounded-lg" />
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-24 rounded-lg" />
                        <Skeleton className="h-10 w-24 rounded-lg" />
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <div className="min-w-[600px] p-4 space-y-3">
                        {/* Table header */}
                        <div className="grid grid-cols-5 gap-4 pb-3 border-b">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                        {/* Table rows */}
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="grid grid-cols-5 gap-4 py-3 border-b border-muted/50">
                                <Skeleton className="h-5 w-20" />
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-5 w-12" />
                                <Skeleton className="h-5 w-16" />
                                <Skeleton className="h-8 w-20 rounded" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
