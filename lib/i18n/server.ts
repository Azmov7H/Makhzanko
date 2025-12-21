import { Locale, defaultLocale } from "./config";

export async function getMessages(locale: Locale) {
    try {
        return (await import(`@/messages/${locale}.json`)).default;
    } catch (error) {
        console.error(`Failed to load messages for locale: ${locale}`, error);
        return (await import(`@/messages/${defaultLocale}.json`)).default;
    }
}

export function getDirection(locale: Locale) {
    return locale === "ar" ? "rtl" : "ltr";
}

// Simple translation helper for server components
export async function getI18n(locale: Locale) {
    const messages = await getMessages(locale);

    return (key: string, variables?: Record<string, any>): string => {
        const keys = key.split(".");
        let value: any = messages;
        for (const k of keys) {
            value = value?.[k];
        }

        if (typeof value !== "string") return String(value || key);

        if (variables) {
            let result = value;
            Object.entries(variables).forEach(([k, v]) => {
                result = result.replace(new RegExp(`{${k}}`, "g"), String(v));
            });
            return result;
        }

        return value;
    };
}
