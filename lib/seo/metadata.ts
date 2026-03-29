/**
 * SEO Metadata Generation Utilities
 */

import { Metadata } from "next";
import { seoConfig } from "./config";
import type { Locale, PageMetadata } from "./types";

/**
 * Generate complete metadata for a page
 */
export function generatePageMetadata(
    locale: Locale,
    page: PageMetadata,
    path: string = ""
): Metadata {
    const baseUrl = seoConfig.siteUrl;
    const url = `${baseUrl}/${locale}${path}`;
    const siteName = seoConfig.siteName[locale];

    return {
        title: page.title,
        description: page.description,
        keywords: page.keywords ? [...page.keywords] : undefined,

        // Canonical URL
        alternates: {
            canonical: page.canonical || url,
            languages: {
                ar: `${baseUrl}/ar${path}`,
                en: `${baseUrl}/en${path}`,
                "x-default": `${baseUrl}/en${path}`,
            },
        },

        // Open Graph
        openGraph: {
            title: page.title,
            description: page.description,
            url: url,
            siteName: siteName,
            locale: locale === "ar" ? "ar_EG" : "en_US",
            type: "website",
            images: [
                {
                    url: page.ogImage || seoConfig.defaultOgImage,
                    width: 1200,
                    height: 630,
                    alt: page.title,
                },
            ],
        },

        // Twitter Card
        twitter: {
            card: seoConfig.twitter.cardType,
            site: seoConfig.twitter.site,
            creator: seoConfig.twitter.handle,
            title: page.title,
            description: page.description,
            images: [page.ogImage || seoConfig.defaultOgImage],
        },

        // Robots
        robots: page.noIndex
            ? {
                index: false,
                follow: false,
            }
            : {
                index: true,
                follow: true,
                googleBot: {
                    index: true,
                    follow: true,
                    "max-video-preview": -1,
                    "max-image-preview": "large",
                    "max-snippet": -1,
                },
            },
    };
}

/**
 * Generate alternate language links
 */
export function generateAlternateLanguages(path: string = "") {
    const baseUrl = seoConfig.siteUrl;

    return {
        ar: `${baseUrl}/ar${path}`,
        en: `${baseUrl}/en${path}`,
        "x-default": `${baseUrl}/en${path}`,
    };
}

/**
 * Get localized site name
 */
export function getSiteName(locale: Locale): string {
    return seoConfig.siteName[locale];
}

/**
 * Get localized keywords
 */
export function getKeywords(locale: Locale): readonly string[] {
    return seoConfig.keywords[locale];
}
