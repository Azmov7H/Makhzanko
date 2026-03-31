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
        ar: "مخزنكو: نظام إداري ذكي ومحاسبي متكامل صُمم خصيصاً للسوق المصري لمحلات الموبايلات والشركات. إدارة مخازن، كاشير، أقساط، وتتبع IMEI.",
        en: "Makhzanko: Smart ERP & accounting system designed for the Egyptian market. Mobile stores, inventory, POS, installments, and IMEI tracking.",
    },

    // URLs
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://makhzanko.com",

    // Default Images
    defaultOgImage: "/og-image.png",
    logo: "/dashboard-preview.png",

    // Organization Info
    organization: {
        name: "Makhzanko",
        legalName: "Makhzanko ERP Solutions",
        foundingDate: "2025",
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
            "إدارة محلات الموبايلات",
            "نظام حسابات موبايلات",
            "برنامج كاشير موبايلات",
            "إدارة أقساط الموبايلات",
            "تتبع سيريال نمبر IMEI",
            "إدارة المخازن",
            "نظام محاسبة سحابي",
            "برنامج مبيعات ومشتريات",
            "برنامج محاسبة مصري",
            "ERP للموبايلات",
        ],
        en: [
            "mobile store management",
            "IMEI tracking system",
            "mobile shop POS",
            "installment management software",
            "cloud inventory management",
            "Egyptian accounting software",
            "sales and purchase software",
            "mobile ERP",
        ],
    },
} as const;

export type SeoConfig = typeof seoConfig;
