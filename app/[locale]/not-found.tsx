"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { Button } from "@/components/ui/button";
import { FileQuestion, ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
    const { t } = useI18n();

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6">
            <div className="relative max-w-2xl w-full text-center">
                {/* Background Animated Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-full h-full">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0],
                            opacity: [0.1, 0.2, 0.1],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            rotate: [0, -90, 0],
                            opacity: [0.1, 0.15, 0.1],
                        }}
                        transition={{
                            duration: 12,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
                    />
                </div>

                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-8"
                >
                    <motion.div
                        animate={{
                            y: [0, -10, 0],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="relative inline-block"
                    >
                        <div className="p-6 rounded-3xl bg-background border shadow-2xl">
                            <FileQuestion className="h-24 w-24 text-primary" />
                        </div>
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -top-2 -right-2 p-3 rounded-full bg-primary text-primary-foreground shadow-lg"
                        >
                            <Search className="h-6 w-6" />
                        </motion.div>
                    </motion.div>

                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground font-tajawal">
                            {t("Landing.notFound.title")}
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto leading-relaxed font-tajawal">
                            {t("Landing.notFound.description")}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Button asChild size="xl" className="w-full sm:w-auto rounded-full gap-2 shadow-xl shadow-primary/20">
                            <Link href="/">
                                <Home className="h-5 w-5" />
                                {t("Landing.notFound.back_to_home")}
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="xl" className="w-full sm:w-auto rounded-full gap-2 hover:bg-muted/50 transition-all">
                            <Link href="#features">
                                <Search className="h-5 w-5" />
                                {t("Landing.notFound.explore")}
                            </Link>
                        </Button>
                    </div>
                </motion.div>

                {/* Bottom Decoration */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="mt-20 flex justify-center gap-8 text-muted-foreground/30"
                >
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-border to-transparent" />
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-border to-transparent" />
                </motion.div>
            </div>
        </div>
    );
}
