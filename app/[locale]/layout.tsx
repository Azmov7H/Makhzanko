import { notFound } from "next/navigation";
import { locales, Locale } from "@/lib/i18n/config";
import { getMessages, getDirection } from "@/lib/i18n/server";
import { I18nProvider } from "@/lib/i18n/context";
import { Tajawal, Manrope } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Metadata, Viewport } from "next";
import StructuredData from "@/components/seo/StructuredData";
import { generateOrganizationLD, generateWebSiteLD } from "@/lib/seo/structuredData";
import { seoConfig } from "@/lib/seo/config";

const tajawal = Tajawal({
    subsets: ["arabic", "latin"],
    weight: ["400", "500", "700", "800"],
    variable: "--font-tajawal",
});

const manrope = Manrope({
    subsets: ["latin"],
    variable: "--font-manrope",
});

// Root Metadata
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
    metadataBase: new URL(seoConfig.siteUrl),
    icons: {
        icon: [
            { url: "/favicon.ico" },
            { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
            { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
        ],
        apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
};

import { PageTransition } from "@/components/layout/PageTransition";

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Ensure that the incoming `locale` is valid
    const messages = await getMessages(locale as Locale);
    const direction = getDirection(locale as Locale);

    // Generate structured data
    const organizationLD = generateOrganizationLD();
    const websiteLD = generateWebSiteLD(locale as "ar" | "en");

    return (
        <html lang={locale} dir={direction} suppressHydrationWarning>
            <head>
                <StructuredData data={[organizationLD, websiteLD]} />
            </head>
            <body className={`${tajawal.variable} ${manrope.variable} antialiased font-sans`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange={false}
                >
                    <I18nProvider locale={locale as Locale} messages={messages}>
                        <PageTransition>
                            {children}
                        </PageTransition>
                    </I18nProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}

