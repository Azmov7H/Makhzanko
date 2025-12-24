"use client";

import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Global Error:", error);
    }, [error]);

    return (
        <html lang="ar" dir="rtl">
            <body className="bg-[#142210] text-[#f6f8f6] font-sans">
                <div className="flex min-h-screen items-center justify-center p-4">
                    <div className="text-center space-y-6 max-w-md mx-auto">
                        {/* Error Icon */}
                        <div className="mx-auto h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center">
                            <svg
                                className="h-8 w-8 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-xl sm:text-2xl font-bold">حدث خطأ غير متوقع</h1>
                            <p className="text-[#f6f8f6]/70 text-sm sm:text-base">
                                نعتذر، حدث خطأ حرج في النظام. يرجى المحاولة مرة أخرى.
                            </p>
                        </div>

                        <button
                            onClick={reset}
                            className="w-full sm:w-auto px-6 py-3 bg-[#46ec13] text-[#142210] rounded-lg font-semibold hover:bg-[#46ec13]/90 transition-colors"
                        >
                            إعادة المحاولة
                        </button>

                        {error.digest && (
                            <p className="text-xs text-[#f6f8f6]/50 break-all">
                                Error ID: {error.digest}
                            </p>
                        )}
                    </div>
                </div>
            </body>
        </html>
    );
}
