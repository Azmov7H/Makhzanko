import { Metadata } from "next";
import { getI18n, getLocale } from "@/lib/i18n/server";
import { generatePageMetadata } from "@/lib/seo/metadata";
import type { Locale as SEOLocale } from "@/lib/seo/types";

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    const t = await getI18n();

    return generatePageMetadata(
        locale as SEOLocale,
        {
            title: t("SEO.login.title"),
            description: t("SEO.login.description"),
            noIndex: true, // Don't index auth pages
        },
        "/login"
    );
}

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full p-4 md:p-8">
                {children}
            </div>
        </div>
    );
}
