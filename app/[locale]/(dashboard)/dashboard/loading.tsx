import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
    return (
        <div className="space-y-6">
            {/* Header skeleton */}
            <div>
                <Skeleton className="h-9 w-48 sm:w-64 mb-2" />
                <Skeleton className="h-4 w-64 sm:w-96" />
            </div>

            {/* Stats cards skeleton */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="border-t-4 border-t-muted">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-20 sm:w-24" />
                            <Skeleton className="h-4 w-4 rounded" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16 mb-1" />
                            <Skeleton className="h-3 w-24 sm:w-32" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick links skeleton */}
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-24 sm:w-32 mb-1" />
                    <Skeleton className="h-4 w-40 sm:w-48" />
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-14 sm:h-16 w-full rounded-lg" />
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Alerts section skeleton */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {Array.from({ length: 2 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center gap-2">
                            <Skeleton className="h-5 w-5 rounded" />
                            <div className="space-y-1 flex-1">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-3 w-48" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {Array.from({ length: 3 }).map((_, j) => (
                                <Skeleton key={j} className="h-12 w-full rounded-lg" />
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
