"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function Pricing() {
    const t = useTranslations("Landing.pricing");
    const tc = useTranslations("Common");

    const plans = [
        {
            title: t("starter"),
            price: "199",
            description: t("starter_desc"),
            features: [
                t("features.one_warehouse"),
                t("features.basic_stats"),
                t("features.limit_products"),
                t("features.one_user"),
                t("features.email_support")
            ],
            buttonText: t("get_started"),
            popular: false
        },
        {
            title: t("pro"),
            price: "499",
            description: t("pro_desc"),
            features: [
                t("features.unlimited_warehouses"),
                t("features.advanced_reports"),
                t("features.unlimited_products"),
                t("features.five_users"),
                t("features.premium_support"),
                t("features.tax_integration")
            ],
            buttonText: t("get_started"),
            popular: true
        }
    ];

    return (
        <section id="pricing" className="py-24 px-6 bg-background">
            <div className="container mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h2 className="text-primary font-bold mb-4">{t("title")}</h2>
                    <h3 className="text-3xl md:text-5xl font-black mb-6">{t("subtitle")}</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        {t("description")}
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
                    {plans.map((plan, index) => (
                        <Card
                            key={index}
                            className={`relative flex flex-col rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl ${plan.popular
                                ? "border-2 border-primary shadow-xl scale-105 z-10"
                                : "border border-border bg-muted/20"
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-0 w-full">
                                    <div className="bg-primary text-primary-foreground text-center py-1.5 text-sm font-bold tracking-widest uppercase">
                                        {t("popular")}
                                    </div>
                                </div>
                            )}

                            <CardHeader className={`pt-12 pb-8 px-8 ${plan.popular ? "bg-primary/5" : ""}`}>
                                <CardTitle className="text-2xl font-bold mb-4">{plan.title}</CardTitle>
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-5xl font-black tracking-tight">{plan.price}</span>
                                    <span className="text-muted-foreground font-medium text-lg">{tc("currency")} / {t("month")}</span>
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
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-muted-foreground">
                        {t("enterprise_query")} <Link href="/contact" className="text-primary font-bold hover:underline">{t("contact_us")}</Link> {t("custom_offer")}
                    </p>
                </div>
            </div>
        </section>
    );
}
