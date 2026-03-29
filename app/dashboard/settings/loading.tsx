import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function SettingsLoading() {
    return (
        <div className="space-y-6 px-4 md:px-0 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <Skeleton className="h-9 w-32 sm:w-40" />
                <Skeleton className="h-4 w-56 sm:w-72" />
            </div>

            {/* Separator */}
            <Skeleton className="h-px w-full" />

            {/* Tabs */}
            <div className="overflow-x-auto pb-2 mb-2">
                <div className="flex h-auto w-auto min-w-full sm:min-w-[400px] sm:grid sm:grid-cols-4 gap-1 bg-muted/30 p-1 rounded-xl">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full rounded-lg" />
                    ))}
                </div>
            </div>

            {/* Settings content */}
            <Card className="border-primary/5 shadow-sm">
                <CardHeader className="bg-muted/30 border-b">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded" />
                        <Skeleton className="h-6 w-36" />
                    </div>
                    <Skeleton className="h-4 w-56" />
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    {/* Form fields */}
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full rounded-lg" />
                        </div>
                    ))}
                    {/* Submit button */}
                    <Skeleton className="h-10 w-full sm:w-32 rounded-lg" />
                </CardContent>
            </Card>
        </div>
    );
}
