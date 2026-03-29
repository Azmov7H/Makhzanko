/**
 * PWA Manifest Generator
 * Enables Progressive Web App features
 */

import { MetadataRoute } from "next";
import { seoConfig } from "@/lib/seo/config";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: seoConfig.siteName.ar,
        short_name: seoConfig.siteName.ar,
        description: seoConfig.siteDescription.ar,
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#6366f1",
        orientation: "portrait",
        lang: "ar",
        dir: "rtl",
        icons: [
            {
                src: "/icon-192x192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "maskable",
            },
            {
                src: "/icon-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
        ],
    };
}
