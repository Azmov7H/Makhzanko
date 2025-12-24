"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Dashboard Error:", error);
    }, [error]);

    return (
        <div className="flex items-center justify-center min-h-[60vh] px-4">
            <Card className="w-full max-w-md border-destructive/50">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                        <AlertTriangle className="h-6 w-6 text-destructive" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl">حدث خطأ غير متوقع</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-center text-muted-foreground text-sm">
                        {error.message || "نعتذر، حدث خطأ أثناء تحميل هذه الصفحة."}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button onClick={reset} variant="outline" className="gap-2 w-full sm:w-auto">
                            <RefreshCcw className="h-4 w-4" />
                            إعادة المحاولة
                        </Button>
                        <Button asChild className="w-full sm:w-auto">
                            <Link href="/dashboard" className="gap-2 inline-flex items-center justify-center">
                                <Home className="h-4 w-4" />
                                الصفحة الرئيسية
                            </Link>
                        </Button>
                    </div>
                    {error.digest && (
                        <p className="text-xs text-center text-muted-foreground break-all">
                            Error ID: {error.digest}
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
