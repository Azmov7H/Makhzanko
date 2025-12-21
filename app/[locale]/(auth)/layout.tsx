import { Metadata } from "next";
import { getI18n } from "@/lib/i18n/server";
import { generatePageMetadata } from "@/lib/seo/metadata";
import type { Locale as SEOLocale } from "@/lib/seo/types";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getI18n(locale as Locale);

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
    return children;
}
