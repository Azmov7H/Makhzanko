import type { Metadata } from "next";
import "./globals.css";

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";


import { Tajawal, Manrope } from "next/font/google";
import { ThemeProvider } from "next-themes";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
});
export const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
})
export const metadata: Metadata = {
  title: "مخزنكو - نظام إدارة المخازن والمحاسبة",
  description: "نظام متعدد المستأجرين لإدارة المخازن والمحاسبة والمبيعات",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}) {
  const { locale = "ar" } = await params;
  const messages = await getMessages({ locale });

  const isRTL = locale === "ar";

  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"} suppressHydrationWarning>
      <body className={`${tajawal.className} ${manrope.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html >
  );
}
