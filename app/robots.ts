/**
 * Dynamic Robots.txt Generator
 * Controls search engine crawling behavior
 */

import { MetadataRoute } from "next";
import { seoConfig } from "@/lib/seo/config";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = seoConfig.siteUrl;

    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/", "/ar/", "/en/"],
                disallow: [
                    "/api/",
                    "/dashboard/",
                    "/ar/dashboard/",
                    "/en/dashboard/",
                    "/login/",
                    "/register/",
                    "/ar/login/",
                    "/ar/register/",
                    "/en/login/",
                    "/en/register/",
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
