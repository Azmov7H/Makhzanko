import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Cairo, IBM_Plex_Sans_Arabic } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
  display: "swap",
});

export const metadata = {
    title: "مخزنكو - نظام إدارة المخازن والمحاسبة",
    description: "نظام متعدد المستأجرين لإدارة المخازن والمحاسبة والمبيعات",
};

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const messages = await getMessages();
    const isRTL = locale === "ar";

    return (
        <html lang={locale} dir={isRTL ? "rtl" : "ltr"} suppressHydrationWarning>
            <body className={`${cairo.variable} ${ibmPlexSansArabic.variable} font-sans`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange={false}
                >
                    <NextIntlClientProvider messages={messages}>
                        {children}
                    </NextIntlClientProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
