import { getI18n } from "@/lib/i18n/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { BookOpen, FileBarChart, Landmark } from "lucide-react";

export default async function AccountingPage() {
    const t = await getI18n();

    const modules = [
        {
            title: t("Accounting.journal"),
            description: t("Accounting.journal_desc"),
            href: "/dashboard/finance/accounting/journal",
            icon: BookOpen,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            title: t("Accounting.ledger"),
            description: t("Accounting.ledger_desc"),
            href: "/dashboard/finance/accounting/ledger",
            icon: FileBarChart,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
        },
        {
            title: t("Accounting.treasury"),
            description: t("Accounting.treasury_desc"),
            href: "/dashboard/finance/accounting/treasury",
            icon: Landmark,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
        }
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700 text-start pb-20">
            <div className="relative">
                <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-primary/20 rounded-full blur-sm" />
                <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent italic">
                    {t("Accounting.title")}
                </h1>
                <p className="text-muted-foreground mt-3 text-lg font-medium max-w-2xl">
                    {t("Accounting.description")}
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {modules.map((module) => (
                    <Link key={module.href} href={module.href}>
                        <Card className="h-full border-none shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-3xl hover:bg-primary/[0.04] transition-all duration-500 group cursor-pointer overflow-hidden rounded-[2.5rem] relative">
                            <div className={`absolute top-0 right-0 w-32 h-32 ${module.bg} rounded-bl-[3rem] -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-700 opacity-20`} />
                            <CardHeader className="p-8">
                                <div className={`p-4 w-fit rounded-2xl ${module.bg} mb-8 shadow-xl shadow-black/5`}>
                                    <module.icon className={`h-8 w-8 ${module.color}`} />
                                </div>
                                <CardTitle className="text-2xl font-black italic mb-2">{module.title}</CardTitle>
                                <CardDescription className="text-base font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                                    {module.description}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
