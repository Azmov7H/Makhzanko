import { Metadata } from "next";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/layout/Landing/Hero';
import Features from '@/components/layout/Landing/Features';
import Pricing from '@/components/layout/Landing/Pricing';
import Footer from '@/components/layout/Footer';
import { generatePageMetadata, getKeywords } from "@/lib/seo/metadata";
import type { Locale as SEOLocale } from "@/lib/seo/types";

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
      title: t("SEO.home.title"),
      description: t("SEO.home.description"),
      keywords: getKeywords(locale as SEOLocale),
    },
    ""
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
