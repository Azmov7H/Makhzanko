"use client";

import React, { createContext, useContext, useMemo } from "react";
import { Locale } from "./config";

type Messages = Record<string, any>;

interface I18nContextType {
    locale: Locale;
    messages: Messages;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({
    children,
    locale,
    messages,
}: {
    children: React.ReactNode;
    locale: Locale;
    messages: Messages;
}) {
    const value = useMemo(() => ({ locale, messages }), [locale, messages]);
    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error("useI18n must be used within an I18nProvider");
    }

    const { messages, locale } = context;

    const t = (key: string, variables?: Record<string, string | number>) => {
        const keys = key.split(".");
        let value = messages;
        for (const k of keys) {
            value = value?.[k];
        }

        if (typeof value !== "string") {
            return key;
        }

        if (variables) {
            return Object.entries(variables).reduce((acc, [k, v]) => {
                return acc.replace(new RegExp(`{${k}}`, "g"), String(v));
            }, value);
        }

        return value;
    };

    return { t, locale };
}
