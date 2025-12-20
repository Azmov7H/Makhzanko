"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Package,
    BarChart3,
    Bell,
    Globe,
    Users,
    Lock,
    Zap,
    ShieldCheck,
    Smartphone
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function Features() {
    const t = useTranslations("Landing.features");

    const features = [
        {
            title: t("inventory.title"),
            description: t("inventory.desc"),
            icon: Package,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
        },
        {
            title: t("reports.title"),
            description: t("reports.desc"),
            icon: BarChart3,
            color: "text-green-500",
            bgColor: "bg-green-500/10",
        },
        {
            title: t("alerts.title"),
            description: t("alerts.desc"),
            icon: Bell,
            color: "text-orange-500",
            bgColor: "bg-orange-500/10",
        },
        {
            title: t("multi_lang.title"),
            description: t("multi_lang.desc"),
            icon: Globe,
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
        },
        {
            title: t("team.title"),
            description: t("team.desc"),
            icon: Users,
            color: "text-cyan-500",
            bgColor: "bg-cyan-500/10",
        },
        {
            title: t("security.title"),
            description: t("security.desc"),
            icon: Lock,
            color: "text-red-500",
            bgColor: "bg-red-500/10",
        }
    ];

    return (
        <section id="features" className="relative py-24 bg-muted/30">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h2 className="text-sm font-bold tracking-wider text-primary uppercase mb-4">
                        {t("subtitle")}
                    </h2>
                    <h3 className="text-3xl md:text-5xl font-black mb-6 text-foreground">
                        {t("title")}
                    </h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        {t("description")}
                    </p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <Card
                                key={index}
                                className="group relative border border-border/50 bg-background/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-2xl transition-all duration-500 overflow-hidden"
                            >
                                <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full ${feature.bgColor} opacity-0 group-hover:opacity-100 transition-opacity blur-2xl`} />

                                <CardHeader className="relative z-10">
                                    <div className={`w-14 h-14 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                                        <Icon className={`h-7 w-7 ${feature.color}`} />
                                    </div>
                                    <CardTitle className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                                        {feature.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="relative z-10">
                                    <CardDescription className="text-base leading-relaxed text-muted-foreground">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
