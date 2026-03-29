"use client";

import { useI18n } from "@/lib/i18n/context";
import { motion } from "framer-motion";
import { Check, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";

export default function Pricing() {
    const { t } = useI18n();

    const plans = [
        {
            name: "المجتمعي",
            price: "مجاني للأبد",
            description: "مثالي للمحلات الصغيرة والناشئة",
            features: [
                "كل مميزات النظام مفعلة",
                "إشعار فوري بالمبيعات",
                "تقارير أساسية",
                "دعم فني عبر البريد",
                "نظام محاسبي بسيط"
            ],
            buttonText: "ابدأ مجاناً",
            premium: false
        },
        {
            name: "الاحترافي",
            price: "0.00$",
            period: "/شهرياً",
            description: "قوة إضافية لإدارة فروعك ومستودعاتك",
            features: [
                "فروع ومخازن غير محدودة",
                "تقارير ذكاء اصطناعي مكثفة",
                "إدارة أقساط متقدمة",
                "تتبع IMEI كامل",
                "مستخدمين غير محدودين",
                "دعم فني فوري"
            ],
            buttonText: "احصل عليه مجاناً",
            premium: true
        },
        {
            name: "الشركات",
            price: "مجاني تماماً",
            description: "حلول مفتوحة المصدر للمؤسسات الكبرى",
            features: [
                "تكامل API مفتوح",
                "صلاحيات متقدمة جداً",
                "إدارة سلاسل الإمداد",
                "تقارير مخصصة",
                "تدريب كامل للفريق",
                "دعم تقني مدار"
            ],
            buttonText: "ابدأ الآن",
            premium: false
        }
    ];

    return (
        <section id="pricing" className="py-32 bg-background">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                    <h2 className="text-secondary font-bold tracking-[0.2em] uppercase text-sm">الخطط والأسعار</h2>
                    <h3 className="text-4xl md:text-6xl font-black tracking-tighter" style={{ fontFamily: "var(--font-amiri), serif" }}>
                        كل شيء مجاني بالكامل
                    </h3>
                    <p className="text-muted-foreground text-lg font-medium">
                        نحن نؤمن بأن التكنولوجيا يجب أن تكون متاحة للجميع. لهذا السبب جعلنا مخزنكو مجانياً بالكامل لكل الشركات حول العالم.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-3 items-stretch">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`luxury-card p-10 flex flex-col group ${plan.premium ? "border-secondary/40 ring-1 ring-secondary/20 shadow-xl" : ""}`}
                        >
                            {plan.premium && (
                                <div className="text-secondary text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Star className="size-3 fill-current" />
                                    الأكثر طلباً
                                </div>
                            )}

                            <div className="mb-10">
                                <h4 className="text-3xl font-black mb-4 group-hover:text-primary transition-colors font-amiri" style={{ fontFamily: "var(--font-amiri), serif" }}>{plan.name}</h4>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-5xl font-black tracking-tighter text-foreground">{plan.price}</span>
                                    {plan.period && <span className="text-muted-foreground/60 font-semibold">{plan.period}</span>}
                                </div>
                                <p className="text-muted-foreground font-medium text-sm">{plan.description}</p>
                            </div>

                            <ul className="flex-grow space-y-4 mb-10">
                                {plan.features.map((feature, fIndex) => (
                                    <li key={fIndex} className="flex items-start gap-3 text-sm font-semibold text-foreground/80">
                                        <Check className="size-4 text-secondary shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                asChild
                                variant={plan.premium ? "default" : "outline"}
                                className={`h-14 rounded-lg font-bold text-base transition-all duration-300 ${plan.premium ? "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90" : "border-border hover:bg-accent"}`}
                            >
                                <Link href="/register">
                                    {plan.buttonText}
                                </Link>
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

