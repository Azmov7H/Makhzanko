import LandingClient from "./LandingClient";
import { Metadata } from "next";
import { getLocale, getI18n } from "@/lib/i18n/server";
import { generatePageMetadata, getKeywords } from "@/lib/seo/metadata";
import { Locale } from "@/lib/seo/types";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    const t = await getI18n(locale);

    return generatePageMetadata(
        locale as Locale,
        {
            title: t("SEO.home.title"),
            description: t("SEO.home.description"),
            keywords: getKeywords(locale as Locale),
        },
        ""
    );
}

export default function HomePage() {
    return <LandingClient />;
}
