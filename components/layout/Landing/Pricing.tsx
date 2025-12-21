"use client";

import { useI18n } from "@/lib/i18n/context";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";

export default function Pricing() {
    const { t } = useI18n();

    const plans = [
        {
            title: t("Landing.pricing.starter"),
            price: "199",
            description: t("Landing.pricing.starter_desc"),
            features: [
                t("Landing.pricing.features.one_warehouse"),
                t("Landing.pricing.features.basic_stats"),
                t("Landing.pricing.features.limit_products"),
                t("Landing.pricing.features.one_user"),
                t("Landing.pricing.features.email_support")
            ],
            buttonText: t("Landing.pricing.get_started"),
            popular: false
        },
        {
            title: t("Landing.pricing.pro"),
            price: "499",
            description: t("Landing.pricing.pro_desc"),
            features: [
                t("Landing.pricing.features.unlimited_warehouses"),
                t("Landing.pricing.features.advanced_reports"),
                t("Landing.pricing.features.unlimited_products"),
                t("Landing.pricing.features.five_users"),
                t("Landing.pricing.features.premium_support"),
                t("Landing.pricing.features.tax_integration")
            ],
            buttonText: t("Landing.pricing.get_started"),
            popular: true
        }
    ];

    return (
        <section id="pricing" className="py-24 px-6 bg-background">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center max-w-2xl mx-auto mb-16"
                >
                    <h2 className="text-primary font-bold mb-4">{t("Landing.pricing.title")}</h2>
                    <h3 className="text-3xl md:text-5xl font-black mb-6">{t("Landing.pricing.subtitle")}</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        {t("Landing.pricing.description")}
                    </p>
                </motion.div>

                <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: plan.popular ? 1.05 : 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="h-full"
                        >
                            <Card
                                className={`relative flex flex-col h-full rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl ${plan.popular
                                    ? "border-2 border-primary shadow-xl z-10"
                                    : "border border-border bg-muted/20"
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 right-0 w-full">
                                        <div className="bg-primary text-primary-foreground text-center py-1.5 text-sm font-bold tracking-widest uppercase">
                                            {t("Landing.pricing.popular")}
                                        </div>
                                    </div>
                                )}

                                <CardHeader className={`pt-12 pb-8 px-8 ${plan.popular ? "bg-primary/5" : ""}`}>
                                    <CardTitle className="text-2xl font-bold mb-4">{plan.title}</CardTitle>
                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-5xl font-black tracking-tight">{plan.price}</span>
                                        <span className="text-muted-foreground font-medium text-lg">{t("Common.currency")} / {t("Landing.pricing.month")}</span>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed">{plan.description}</p>
                                </CardHeader>

                                <CardContent className="flex-grow px-8 py-8 space-y-6">
                                    <ul className="space-y-4">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                <div className="size-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                                                    <Check className="size-3.5 text-green-500 stroke-[3]" />
                                                </div>
                                                <span className="text-foreground/80 font-medium">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>

                                <CardFooter className="px-8 pb-10 pt-6">
                                    <Button
                                        asChild
                                        size="xl"
                                        variant={plan.popular ? "default" : "outline"}
                                        className={`w-full rounded-2xl text-lg font-bold group ${plan.popular ? "shadow-lg shadow-primary/25" : ""
                                            }`}
                                    >
                                        <Link href="/register">
                                            {plan.buttonText}
                                            <ArrowRight className="mr-2 size-5 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 text-center"
                >
                    <p className="text-muted-foreground">
                        {t("Landing.pricing.enterprise_query")} <Link href="/contact" className="text-primary font-bold hover:underline">{t("Landing.pricing.contact_us")}</Link> {t("Landing.pricing.custom_offer")}
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
