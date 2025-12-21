/**
 * Structured Data (JSON-LD) Generators
 */

import { seoConfig } from "./config";
import type { Locale, BreadcrumbItem, ProductStructuredData } from "./types";

/**
 * Generate Organization structured data
 */
export function generateOrganizationLD() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: seoConfig.organization.name,
        legalName: seoConfig.organization.legalName,
        url: seoConfig.siteUrl,
        logo: `${seoConfig.siteUrl}${seoConfig.logo}`,
        foundingDate: seoConfig.organization.foundingDate,
        contactPoint: {
            "@type": "ContactPoint",
            telephone: seoConfig.organization.phone,
            email: seoConfig.organization.email,
            contactType: "Customer Service",
            availableLanguage: ["Arabic", "English"],
        },
        address: {
            "@type": "PostalAddress",
            streetAddress: seoConfig.organization.address.streetAddress,
            addressLocality: seoConfig.organization.address.addressLocality,
            addressRegion: seoConfig.organization.address.addressRegion,
            postalCode: seoConfig.organization.address.postalCode,
            addressCountry: seoConfig.organization.address.addressCountry,
        },
        sameAs: [
            seoConfig.social.facebook,
            seoConfig.social.twitter,
            seoConfig.social.linkedin,
        ],
    };
}

/**
 * Generate WebSite structured data with search action
 */
export function generateWebSiteLD(locale: Locale) {
    const siteName = seoConfig.siteName[locale];
    const searchUrl = `${seoConfig.siteUrl}/${locale}/dashboard/products?search={search_term_string}`;

    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteName,
        url: seoConfig.siteUrl,
        potentialAction: {
            "@type": "SearchAction",
            target: searchUrl,
            "query-input": "required name=search_term_string",
        },
    };
}

/**
 * Generate BreadcrumbList structured data
 */
export function generateBreadcrumbLD(items: BreadcrumbItem[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item) => ({
            "@type": "ListItem",
            position: item.position,
            name: item.name,
            item: item.item,
        })),
    };
}

/**
 * Generate Product structured data
 */
export function generateProductLD(product: ProductStructuredData) {
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: product.image,
        sku: product.sku,
        offers: {
            "@type": "Offer",
            price: product.offers.price,
            priceCurrency: product.offers.priceCurrency,
            availability: product.offers.availability,
        },
    };
}

/**
 * Generate LocalBusiness structured data for landing page
 */
export function generateLocalBusinessLD(locale: Locale) {
    const siteName = seoConfig.siteName[locale];
    const description = seoConfig.siteDescription[locale];

    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: siteName,
        applicationCategory: "BusinessApplication",
        description: description,
        operatingSystem: "Web",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "EGP",
        },
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            ratingCount: "150",
        },
    };
}
