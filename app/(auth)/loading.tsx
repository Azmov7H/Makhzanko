"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function AuthLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-2xl border shadow-sm">
                <div className="text-center space-y-2">
                    <Skeleton className="h-10 w-48 mx-auto" />
                    <Skeleton className="h-4 w-64 mx-auto" />
                </div>

                <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                    <Skeleton className="h-10 w-full rounded-full pt-6" />
                </div>

                <div className="flex justify-center pt-4">
                    <Skeleton className="h-4 w-48" />
                </div>
            </div>
        </div>
    );
}
