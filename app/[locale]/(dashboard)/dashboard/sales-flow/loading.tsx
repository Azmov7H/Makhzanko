import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function SalesFlowLoading() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <Skeleton className="h-8 w-32 sm:w-40 mb-2" />
                    <Skeleton className="h-4 w-48 sm:w-56" />
                </div>
                <Skeleton className="h-10 w-full sm:w-36 rounded-lg" />
            </div>

            {/* Tabs skeleton */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-24 sm:w-28 shrink-0 rounded-lg" />
                ))}
            </div>

            {/* Content cards */}
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div className="space-y-1">
                                <Skeleton className="h-5 w-28" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                            <Skeleton className="h-8 w-16 rounded" />
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <div className="flex justify-between pt-2">
                                <Skeleton className="h-6 w-24" />
                                <Skeleton className="h-8 w-20 rounded" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
