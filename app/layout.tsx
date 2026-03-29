import { locales, Locale } from "@/lib/i18n/config";
import { getMessages, getDirection, getLocale } from "@/lib/i18n/server";
import { I18nProvider } from "@/lib/i18n/context";
import { Cairo, Ubuntu, Amiri } from "next/font/google";

import "@fontsource/ibm-plex-sans-arabic/100.css";
import "@fontsource/ibm-plex-sans-arabic/200.css";
import "@fontsource/ibm-plex-sans-arabic/300.css";
import "@fontsource/ibm-plex-sans-arabic/400.css";
import "@fontsource/ibm-plex-sans-arabic/500.css";
import "@fontsource/ibm-plex-sans-arabic/600.css";
import "@fontsource/ibm-plex-sans-arabic/700.css";
import { ThemeProvider } from "next-themes";
import { Metadata, Viewport } from "next";
import StructuredData from "@/components/seo/StructuredData";
import { generateOrganizationLD, generateWebSiteLD } from "@/lib/seo/structuredData";
import { OrganizationSchema } from "@/components/seo/OrganizationSchema";
import { seoConfig } from "@/lib/seo/config";
import { Suspense } from "react";
import "./globals.css";
import { PageTransition } from "@/components/layout/PageTransition";
import AppShell from "@/app/AppShell";

const cairo = Cairo({
    subsets: ["arabic", "latin"],
    variable: "--font-cairo",
    weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
    display: "swap",
    preload: false,
});

const inter = Ubuntu({
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"],
    display: "swap",
});

const amiri = Amiri({
    subsets: ["arabic"],
    variable: "--font-amiri",
    weight: ["400", "700"],
    display: "swap",
});


const ibmPlexArabic = {
    variable: "font-ibm-arabic",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    ],
};

export const metadata: Metadata = {
    title: {
        template: `%s | ${seoConfig.siteName.ar}`,
        default: seoConfig.siteName.ar,
    },
    description: seoConfig.siteDescription.ar,
    metadataBase: new URL(seoConfig.siteUrl),
    icons: {
        icon: [
            { url: "/icon.png" },
            { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
            { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
        ],
        apple: [{ url: "/icon.png", sizes: "180x180" }],
    },
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const locale = await getLocale();
    const direction = getDirection(locale);

    return (
        <html lang={locale} dir={direction} suppressHydrationWarning>
            <body className={` ${inter.className} ${amiri.className} font-ibm-arabic antialiased`}>
                <Suspense fallback={null}>
                    <AppShell>{children}</AppShell>
                </Suspense>
            </body>
        </html>
    );
}

