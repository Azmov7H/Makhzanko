/**
 * SEO Configuration
 * Central configuration for all SEO-related settings
 */

export const seoConfig = {
    // Site Information
    siteName: {
        ar: "مخزنكو",
        en: "Makhzanko",
    },
    siteDescription: {
        ar: "نظام متكامل لإدارة المخازن والمحاسبة والمبيعات، صُمم خصيصاً للسوق المصري",
        en: "Complete inventory, accounting and sales management system designed for the Egyptian market",
    },

    // URLs
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://makhzanko.com",

    // Default Images
    defaultOgImage: "/og-image.png",
    logo: "/logo.png",

    // Organization Info
    organization: {
        name: "Makhzanko",
        legalName: "Makhzanko ERP Solutions",
        foundingDate: "2024",
        email: "info@makhzanko.com",
        phone: "+20 123 456 7890",
        address: {
            streetAddress: "Cairo",
            addressLocality: "Cairo",
            addressRegion: "Cairo",
            postalCode: "11511",
            addressCountry: "EG",
        },
    },

    // Social Media
    social: {
        facebook: "https://facebook.com/makhzanko",
        twitter: "https://twitter.com/makhzanko",
        linkedin: "https://linkedin.com/company/makhzanko",
    },

    // Twitter Card
    twitter: {
        handle: "@makhzanko",
        site: "@makhzanko",
        cardType: "summary_large_image" as const,
    },

    // Default Keywords
    keywords: {
        ar: [
            "إدارة المخازن",
            "نظام محاسبة",
            "إدارة المبيعات",
            "ERP",
            "نظام نقاط البيع",
            "إدارة المخزون",
            "برنامج محاسبة مصري",
        ],
        en: [
            "inventory management",
            "accounting system",
            "sales management",
            "ERP",
            "point of sale",
            "stock management",
            "Egyptian accounting software",
        ],
    },
} as const;

export type SeoConfig = typeof seoConfig;
