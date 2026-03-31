import { ThemeProvider } from "next-themes";
import StructuredData from "@/components/seo/StructuredData";
import { PageTransition } from "@/components/layout/PageTransition";
import { OrganizationSchema } from "@/components/seo/OrganizationSchema";
import { locales, Locale } from "@/lib/i18n/config";
import { getMessages, getDirection, getLocale } from "@/lib/i18n/server";
import { I18nProvider } from "@/lib/i18n/context";
import { generateWebSiteLD } from "@/lib/seo/structuredData";
import { Toaster } from "sonner";

export default async function AppShell({ children }: { children: React.ReactNode }) {
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
                    <Toaster position="top-center" richColors />
                </ThemeProvider>
            </div>
        </I18nProvider>
    );
}
