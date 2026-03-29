"use client";

import { useI18n } from "@/lib/i18n/context";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function FAQ() {
    const { t } = useI18n();
    const items = t.raw("Landing.faq.items") as { q: string, a: string }[];
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section id="faq" className="py-32 bg-background/50">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
                    <h2 className="text-secondary font-bold tracking-[0.2em] uppercase text-sm">
                        {t("Landing.faq.subtitle")}
                    </h2>
                    <h3 className="text-4xl md:text-6xl font-black tracking-tighter" style={{ fontFamily: "var(--font-amiri), serif" }}>
                        {t("Landing.faq.title")}
                    </h3>
                    <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                        {t("Landing.faq.description")}
                    </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {items.map((item, i) => (
                        <div key={i} className="luxury-card overflow-hidden border border-border/40 transition-all hover:border-primary/20">
                            <button
                                onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                                className="w-full flex items-center justify-between p-6 text-start gap-4 transition-colors"
                            >
                                <span className="text-xl font-bold tracking-tight text-foreground" style={{ fontFamily: "var(--font-amiri), serif" }}>
                                    {item.q}
                                </span>
                                <div className={`size-8 rounded-full flex items-center justify-center transition-all ${activeIndex === i ? 'bg-primary text-primary-foreground rotate-180' : 'bg-accent text-primary'}`}>
                                    {activeIndex === i ? <Minus className="size-4" /> : <Plus className="size-4" />}
                                </div>
                            </button>
                            
                            <AnimatePresence initial={false}>
                                {activeIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="px-6 pb-6 text-muted-foreground font-medium leading-relaxed border-t border-border/10 pt-4">
                                            {item.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
