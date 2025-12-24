"use client";

import { useI18n } from "@/lib/i18n/context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { BookOpen, Calculator, FileBarChart, PieChart, Landmark } from "lucide-react";

export default function AccountingPage() {
    const { t } = useI18n();

    const modules = [
        {
            title: t("Accounting.journal") || "Journal Entry",
            description: "Record daily financial transactions.",
            href: "/dashboard/finance/accounting/journal",
            icon: BookOpen,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            title: t("Accounting.ledger") || "General Ledger",
            description: "View account summaries and details.",
            href: "/dashboard/finance/accounting/ledger",
            icon: FileBarChart,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
        },
        {
            title: t("Accounting.treasury") || "Treasury",
            description: "Manage cash flow and banks.",
            href: "/dashboard/finance/accounting/treasury",
            icon: Landmark,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {t("Dashboard.accounting")}
                </h1>
                <p className="text-muted-foreground">{t("Accounting.description") || "Manage your financial records and reports."}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {modules.map((module) => (
                    <Link key={module.href} href={module.href}>
                        <Card className="h-full border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl hover:bg-primary/5 transition-all duration-300 group cursor-pointer overflow-hidden relative">
                            <div className={`absolute top-0 right-0 w-24 h-24 ${module.bg} rounded-bl-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500`} />
                            <CardHeader>
                                <div className={`p-3 w-fit rounded-xl ${module.bg} mb-4`}>
                                    <module.icon className={`h-6 w-6 ${module.color}`} />
                                </div>
                                <CardTitle className="text-xl font-bold">{module.title}</CardTitle>
                                <CardDescription>{module.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
