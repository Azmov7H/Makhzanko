"use client";

import { useI18n } from "@/lib/i18n/context";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export default function Hero() {
    const { t } = useI18n();
    const { user, checkSession } = useAuth();

    useEffect(() => {
        checkSession();
    }, []);

    return (
        <section className="relative min-h-[85vh] flex items-center pt-20 overflow-hidden bg-background">
            {/* Minimalist Focal Point */}
            <div className="absolute top-0 right-0 w-120 h-120 bg-primary/5 blur-[120px] rounded-full -me-64 -mt-64 pointer-events-none rtl:left-0 rtl:right-auto rtl:-ms-64" />

            <div className="container relative z-10 mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    {/* Content Column */}
                    <div className="flex-1 text-start space-y-10">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 group cursor-pointer"
                        >
                            <span className="h-px w-8 bg-secondary transition-all group-hover:w-12" />
                            <span className="text-secondary font-bold tracking-widest text-xs uppercase">
                                {t("Landing.hero.badge")}
                            </span>
                        </motion.div>

                        <div className="space-y-6">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-5xl font-black text-foreground tracking-tighter leading-[1.05]"
                                style={{ fontFamily: "var(--font-amiri), serif" }}
                            >
                                {t("Landing.hero.title_start")}
                                <span className="text-secondary block md:inline mx-2">
                                    {t("Landing.hero.title_highlight")}
                                </span>
                                {t("Landing.hero.title_end")}
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium max-w-xl"
                            >
                                {t("Landing.hero.description")}
                            </motion.p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap gap-5"
                        >
                            {user ? (
                                <Button asChild size="xl" className="h-14 px-10 rounded-lg bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                                    <Link href="/dashboard">
                                        {t("Dashboard.dashboard")}
                                        <LayoutDashboard className="ms-2 h-5 w-5" />
                                    </Link>
                                </Button>
                            ) : (
                                <Button asChild size="xl" className="h-14 px-10 rounded-lg bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/10 hover:translate-y-[-2px] transition-all">
                                    <Link href="/register">
                                        {t("Landing.hero.start_free")}
                                        <ArrowRight className="ms-2 h-5 w-5 rtl:rotate-180" />
                                    </Link>
                                </Button>
                            )}
                            <Button asChild variant="ghost" size="xl" className="h-14 px-10 rounded-lg font-bold text-lg border border-border/50 hover:bg-accent/50 transition-all">
                                <Link href="/#features">
                                    {t("Landing.hero.explore_features")}
                                </Link>
                            </Button>
                        </motion.div>
                    </div>

                    {/* Architectural Hero Image Mockup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="flex-1 w-full lg:max-w-130 relative"
                    >
                        <div className="relative z-10 aspect-16/10 rounded-xl bg-white dark:bg-card border border-border/50 shadow-2xl overflow-hidden group hover:scale-[1.02] transition-all duration-500 hover:shadow-primary/10">
                            <div className="absolute top-0 left-0 w-full h-10 bg-muted/20 border-b border-border/10 flex items-center px-4 gap-2">
                                <div className="size-2.5 rounded-full bg-border" />
                                <div className="size-2.5 rounded-full bg-border" />
                                <div className="size-2.5 rounded-full bg-border" />
                            </div>
                            <div className="w-full h-full pt-10 px-6 bg-accent/5">
                                <div className="w-full h-full rounded-t-lg bg-background border-x border-t border-border/30 overflow-hidden shadow-inner flex flex-col p-4 gap-4">
                                     <div className="h-8 w-1/3 bg-muted/40 rounded animate-pulse" />
                                     <div className="grid grid-cols-3 gap-4">
                                         <div className="h-24 bg-muted/20 rounded-lg" />
                                         <div className="h-24 bg-muted/20 rounded-lg" />
                                         <div className="h-24 bg-muted/20 rounded-lg" />
                                     </div>
                                     <div className="h-48 bg-muted/10 rounded-lg" />
                                </div>
                            </div>
                        </div>
                        {/* Minimalism Accents */}
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 border-l border-b border-secondary/20 rounded-bl-2xl -z-10" />
                        <div className="absolute -top-6 -right-6 w-32 h-32 border-t border-r border-secondary/20 rounded-tr-2xl -z-10" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
