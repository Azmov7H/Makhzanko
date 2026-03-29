import { Metadata } from "next";
import { getI18n, getLocale } from "@/lib/i18n/server";
import { generatePageMetadata, getKeywords } from "@/lib/seo/metadata";
import type { Locale as SEOLocale } from "@/lib/seo/types";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getI18n(locale);

  return generatePageMetadata(
    locale as SEOLocale,
    {
      title: t("Auth.register"),
      description: t("Auth.enter_details"),
      keywords: getKeywords(locale as SEOLocale),
    },
    "/register"
  );
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
