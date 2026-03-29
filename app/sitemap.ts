/**
 * Dynamic Sitemap Generator
 * Generates sitemap.xml for both Arabic and English versions
 */

import { MetadataRoute } from "next";
import { seoConfig } from "@/lib/seo/config";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = seoConfig.siteUrl;
    const lastModified = new Date();

    // Define all routes
    const routes = [
        "",
        "/dashboard",
        "/dashboard/products",
        "/dashboard/sales",
        "/dashboard/invoices",
        "/dashboard/purchases",
        "/dashboard/warehouses",
        "/dashboard/accounting",
        "/dashboard/inventory",
        "/dashboard/settings",
    ];

    // Generate sitemap entries for both locales
    const sitemap: MetadataRoute.Sitemap = [];

    // Add routes for both languages
    ["ar", "en"].forEach((locale) => {
        routes.forEach((route) => {
            sitemap.push({
                url: `${baseUrl}/${locale}${route}`,
                lastModified,
                changeFrequency: route === "" ? "daily" : "weekly",
                priority: route === "" ? 1 : 0.8,
            });
        });
    });

    return sitemap;
}
