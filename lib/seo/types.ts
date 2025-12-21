/**
 * SEO Type Definitions
 */

export interface PageMetadata {
    title: string;
    description: string;
    keywords?: string[];
    ogImage?: string;
    noIndex?: boolean;
    canonical?: string;
}

export interface LocalizedMetadata {
    ar: PageMetadata;
    en: PageMetadata;
}

export interface OpenGraphMetadata {
    title: string;
    description: string;
    url: string;
    siteName: string;
    images: Array<{
        url: string;
        width: number;
        height: number;
        alt: string;
    }>;
    locale: string;
    type: "website" | "article" | "product";
}

export interface TwitterCardMetadata {
    card: "summary" | "summary_large_image" | "app" | "player";
    site?: string;
    creator?: string;
    title: string;
    description: string;
    images?: string[];
}

export interface BreadcrumbItem {
    name: string;
    item: string;
    position: number;
}

export interface ProductStructuredData {
    name: string;
    description: string;
    image: string[];
    sku: string;
    offers: {
        price: string;
        priceCurrency: string;
        availability: string;
    };
}

export type Locale = "ar" | "en";
