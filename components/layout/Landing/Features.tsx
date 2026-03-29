"use client";

import { useI18n } from "@/lib/i18n/context";
import { motion } from "framer-motion";
import { Package, BarChart3, Lock, Smartphone, ShieldCheck, CreditCard } from "lucide-react";

export default function Features() {
    const { t } = useI18n();

    const features = [
        {
            title: t("Landing.features.imei.title"),
            description: t("Landing.features.imei.desc"),
            icon: Smartphone,
        },
        {
            title: t("Landing.features.installments.title"),
            description: t("Landing.features.installments.desc"),
            icon: CreditCard,
        },
        {
            title: t("Landing.features.maintenance.title"),
            description: t("Landing.features.maintenance.desc"),
            icon: ShieldCheck,
        },
        {
            title: t("Landing.features.inventory.title"),
            description: t("Landing.features.inventory.desc"),
            icon: Package,
        },
        {
            title: t("Landing.features.reports.title"),
            description: t("Landing.features.reports.desc"),
            icon: BarChart3,
        },
        {
            title: t("Landing.features.security.title"),
            description: t("Landing.features.security.desc"),
            icon: Lock,
        }
    ];

    return (
        <section id="features" className="py-32 bg-background border-y border-border/40">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
                    <h2 className="text-secondary font-bold tracking-[0.2em] uppercase text-sm">
                        {t("Landing.features.subtitle")}
                    </h2>
                    <h3 className="text-4xl md:text-6xl font-black tracking-tighter" style={{ fontFamily: "var(--font-amiri), serif" }}>
                        {t("Landing.features.title")}
                    </h3>
                    <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                        {t("Landing.features.description")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="luxury-card p-10 space-y-6 group"
                        >
                            <div className="size-14 rounded-lg bg-accent flex items-center justify-center text-primary transition-transform group-hover:scale-110">
                                <feature.icon className="h-7 w-7 stroke-[1.5]" />
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-2xl font-black tracking-tight" style={{ fontFamily: "var(--font-amiri), serif" }}>
                                    {feature.title}
                                </h4>
                                <p className="text-muted-foreground/80 leading-relaxed font-medium">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
