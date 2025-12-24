"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileSearch } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export default function NotFound() {
    const { t } = useI18n();

    // Default fallbacks if keys are missing (safe-guard)
    const title = t("Common.404_title") || "404 - Page Not Found";
    const desc = t("Common.404_desc") || "The page you are looking for does not exist.";
    const home = t("Common.go_home") || "Go Home";
    const dashboard = t("Common.go_dashboard") || "Back to Dashboard";

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center space-y-6">
            <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                <FileSearch className="h-12 w-12 text-primary" />
            </div>
            <div className="space-y-3">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">404</h1>
                <h2 className="text-xl font-semibold">{title}</h2>
                <p className="text-muted-foreground max-w-[500px] text-lg">
                    {desc}
                </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                    <Link href="/">{home}</Link>
                </Button>
                <Button asChild size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20">
                    <Link href="/dashboard">{dashboard}</Link>
                </Button>
            </div>
        </div>
    );
}
