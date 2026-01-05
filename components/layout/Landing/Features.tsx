"use client";

import { useI18n } from "@/lib/i18n/context";
import { motion } from "framer-motion";
import { Package, BarChart3, Bell, Globe, Users, Lock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

export default function Features() {
    const { t } = useI18n();

    const features = [
        {
            title: t("Landing.features.inventory.title"),
            description: t("Landing.features.inventory.desc"),
            icon: Package,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
        },
        {
            title: t("Landing.features.reports.title"),
            description: t("Landing.features.reports.desc"),
            icon: BarChart3,
            color: "text-green-500",
            bgColor: "bg-green-500/10",
        },
        {
            title: t("Landing.features.alerts.title"),
            description: t("Landing.features.alerts.desc"),
            icon: Bell,
            color: "text-orange-500",
            bgColor: "bg-orange-500/10",
        },
        {
            title: t("Landing.features.multi_lang.title"),
            description: t("Landing.features.multi_lang.desc"),
            icon: Globe,
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
        },
        {
            title: t("Landing.features.team.title"),
            description: t("Landing.features.team.desc"),
            icon: Users,
            color: "text-cyan-500",
            bgColor: "bg-cyan-500/10",
        },
        {
            title: t("Landing.features.security.title"),
            description: t("Landing.features.security.desc"),
            icon: Lock,
            color: "text-red-500",
            bgColor: "bg-red-500/10",
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <section id="features" className="relative py-24 bg-muted/30">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <h2 className="text-sm font-bold tracking-wider text-primary uppercase mb-4">
                        {t("Landing.features.subtitle")}
                    </h2>
                    <h3 className="text-3xl md:text-5xl font-black mb-6 text-foreground">
                        {t("Landing.features.title")}
                    </h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        {t("Landing.features.description")}
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div key={index} variants={itemVariants}>
                                <Card
                                    className="group h-full relative border border-border/50 bg-card hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden rounded-2xl"
                                >
                                    <div className={`absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 rounded-full ${feature.bgColor} opacity-0 group-hover:opacity-20 transition-opacity blur-3xl`} />

                                    <CardHeader className="relative z-10 pb-2">
                                        <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                                            <Icon className={`h-6 w-6 ${feature.color}`} />
                                        </div>
                                        <CardTitle className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                            {feature.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="relative z-10">
                                        <CardDescription className="text-sm leading-relaxed text-muted-foreground font-medium">
                                            {feature.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
