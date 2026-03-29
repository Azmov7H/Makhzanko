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
        ar: "مخزنكو: نظام إداري ذكي ومحاسبي متكامل لمحلات الموبايلات والشركات. إدارة مخازن، كاشير، أقساط، وتقارير ذكية مدعومة بالذكاء الاصطناعي.",
        en: "Makhzanko: Smart ERP & accounting system for mobile stores and businesses. Inventory, POS, installments, and AI-powered insights.",
    },

    // URLs
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://makhzanko.com",

    // Default Images
    defaultOgImage: "/og-image.png",
    logo: "/dashboard-preview.png",

    // Organization Info
    organization: {
        name: "Makhzanko",
        legalName: "Makhzanko ERP Global",
        foundingDate: "2025",
        email: "support@makhzanko.com",
        phone: "+1 (800) MAK-HZAN",
        address: {
            streetAddress: "Global Headquarters",
            addressLocality: "Digital Avenue",
            addressRegion: "Global",
            postalCode: "00000",
            addressCountry: "GLOBAL",
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
            "تقارير ذكاء اصطناعي للمخازن",
            "ERP للموبايلات",
        ],
        en: [
            "mobile store management",
            "IMEI tracking system",
            "mobile shop POS",
            "installment management software",
            "cloud inventory management",
            "global accounting system",
            "sales and purchase software",
            "AI inventory reports",
            "mobile ERP",
        ],
    },
} as const;

export type SeoConfig = typeof seoConfig;
