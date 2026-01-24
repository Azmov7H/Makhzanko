"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Critical Global Error:", error);
    }, [error]);

    return (
        <html lang="ar" dir="rtl">
            <body className="bg-[#020617] text-slate-50 font-sans selection:bg-primary/30">
                <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
                    {/* Animated Background Elements */}
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative z-10 w-full max-w-2xl"
                    >
                        <div className="bg-slate-900/40 backdrop-blur-3xl border border-slate-800/50 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-black/50 text-center space-y-10">

                            {/* Animated Icon Container */}
                            <motion.div
                                initial={{ scale: 0.5, rotate: -10 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                className="mx-auto w-24 h-24 bg-gradient-to-tr from-destructive/20 to-destructive/5 rounded-3xl flex items-center justify-center relative group"
                            >
                                <div className="absolute inset-0 bg-destructive/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50" />
                                <AlertTriangle className="w-12 h-12 text-destructive relative z-10" />
                            </motion.div>

                            {/* Text Content - Bilingual */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white italic">
                                        حدث خطأ غير متوقع
                                    </h1>
                                    <h2 className="text-xl md:text-2xl font-bold text-slate-400">
                                        Unexpected System Error
                                    </h2>
                                </div>

                                <div className="space-y-4 max-w-lg mx-auto">
                                    <p className="text-slate-400 text-lg leading-relaxed font-medium">
                                        نعتذر، واجه النظام مشكلة تقنية حرجة. يرجى محاولة تحديث الصفحة أو العودة لاحقاً.
                                    </p>
                                    <p className="text-slate-500 text-sm leading-relaxed">
                                        We apologize, the system encountered a critical technical issue. Please try refreshing the page or come back later.
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={reset}
                                    className="w-full sm:w-auto px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-black italic flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
                                >
                                    <RefreshCcw className="w-5 h-5" />
                                    إعادة المحاولة / Try Again
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => window.location.href = '/dashboard'}
                                    className="w-full sm:w-auto px-10 py-4 bg-slate-800 text-slate-200 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-700 transition-all duration-300"
                                >
                                    <Home className="w-5 h-5" />
                                    لوحة التحكم / Dashboard
                                </motion.button>
                            </div>

                            {/* Debug Info */}
                            {error.digest && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    className="pt-6 border-t border-slate-800/50"
                                >
                                    <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.2em]">
                                        Error Reference: {error.digest}
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    {/* Footer Branding */}
                    <div className="absolute bottom-8 left-0 right-0 text-center opacity-20 pointer-events-none">
                        <span className="text-xs font-black tracking-widest uppercase italic">Makhzanko System Core</span>
                    </div>
                </div>
            </body>
        </html>
    );
}
