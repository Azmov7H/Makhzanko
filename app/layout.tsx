import { locales, Locale } from "@/lib/i18n/config";
import { getMessages, getDirection, getLocale } from "@/lib/i18n/server";
import { I18nProvider } from "@/lib/i18n/context";
import { Cairo, Inter } from "next/font/google";
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

const cairo = Cairo({
    subsets: ["arabic", "latin"],
    variable: "--font-cairo",
    weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
    display: "swap",
    preload: false,
});

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
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
    title: seoConfig.siteName.ar,
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
    const organizationLD = generateOrganizationLD();

    return (
        <html lang="ar" dir="rtl" suppressHydrationWarning>
            <body className={`${cairo.variable} ${inter.variable} ${ibmPlexArabic.variable} antialiased font-sans`}>

                <Suspense fallback={null}>
                    <AppShell>{children}</AppShell>
                </Suspense>
            </body>
        </html>
    );
}

async function AppShell({ children }: { children: React.ReactNode }) {
    const locale = await getLocale();
    const messages = await getMessages(locale);
    const direction = getDirection(locale);
    const websiteLD = generateWebSiteLD(locale as "ar" | "en");

    return (
        <I18nProvider locale={locale} messages={messages}>
            <div dir={direction}>
                <StructuredData data={[websiteLD]} />
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange={false}
                >
                    <PageTransition>
                        {children}
                    </PageTransition>
                </ThemeProvider>
            </div>
        </I18nProvider>
    );
}
