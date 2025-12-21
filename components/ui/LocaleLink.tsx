"use client";

import NextLink from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { ComponentProps } from "react";

interface LocaleLinkProps extends ComponentProps<typeof NextLink> {
    href: string;
}

/**
 * A custom Link component that automatically prefixes the current locale to the href.
 * It also supports framer-motion animations if needed.
 */
export function LocaleLink({ href, children, ...props }: LocaleLinkProps) {
    const { locale } = useI18n();

    // If href is external or already has a locale prefix, don't touch it
    const isExternal = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
    const hasLocale = href.startsWith("/ar") || href.startsWith("/en");

    const localizedHref = isExternal || hasLocale ? href : `/${locale}${href.startsWith("/") ? "" : "/"}${href}`;

    return (
        <NextLink href={localizedHref} {...props}>
            {children}
        </NextLink>
    );
}

export default LocaleLink;
