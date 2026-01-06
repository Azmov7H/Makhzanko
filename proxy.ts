import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n/config";

const COOKIE_NAME = "saas_token";
const PUBLIC_PATHS = ["/login", "/register", "/"];

export default async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // --- 1. I18N Handling (URL-based with Redirect/Rewrite) ---
    // Check if there is any supported locale in the pathname
    const pathnameIsMissingLocale = locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    let effectiveLocale = request.cookies.get('NEXT_LOCALE')?.value || defaultLocale;
    if (!locales.includes(effectiveLocale as any)) {
        effectiveLocale = defaultLocale;
    }

    let response: NextResponse;
    let internalPathname = pathname;

    // If the path has a locale (e.g. /en/dashboard)
    const requestHeaders = new Headers(request.headers);
    if (!pathnameIsMissingLocale) {
        const urlLocale = locales.find(
            (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
        );

        // Remove the locale from the path to get the actual internal path
        internalPathname = pathname.replace(`/${urlLocale}`, "") || "/";
        effectiveLocale = urlLocale!;

        requestHeaders.set("X-NEXT-LOCALE", effectiveLocale);

        // Create response to rewrite to the internal path
        response = NextResponse.rewrite(new URL(internalPathname, request.url), {
            request: {
                headers: requestHeaders,
            },
        });

        // Update cookie to match URL locale
        response.cookies.set("NEXT_LOCALE", effectiveLocale);
    } else {
        requestHeaders.set("X-NEXT-LOCALE", effectiveLocale);
        response = NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
        // Ensure effective locale is set in cookie if missing
        if (!request.cookies.has('NEXT_LOCALE')) {
            response.cookies.set('NEXT_LOCALE', effectiveLocale);
        }
    }

    // --- 2. Auth & Protection ---
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const isDashboard = internalPathname.startsWith('/dashboard');
    const isPublicPath = PUBLIC_PATHS.some(p => internalPathname === p);

    if (isDashboard && !token) {
        return NextResponse.redirect(new URL(`/${effectiveLocale}/login`, request.url));
    }

    // Redirect authenticated users away from login/register
    if ((internalPathname === '/login' || internalPathname === '/register') && token) {
        return NextResponse.redirect(new URL(`/${effectiveLocale}/dashboard`, request.url));
    }

    // Admin Panel Protection
    if (internalPathname.startsWith("/admin")) {
        const ownerToken = request.cookies.get("owner_token")?.value;
        if (!ownerToken && internalPathname !== "/admin/login") {
            return NextResponse.redirect(new URL(`/${effectiveLocale}/admin/login`, request.url));
        }
    }

    // --- 3. Security Headers ---
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");

    if (process.env.NODE_ENV === "production") {
        response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    }

    return response;
}

export const config = {
    matcher: [
        // Skip all internal paths (_next, static, etc)
        '/((?!_next|api|.*\\..*).*)',
    ],
};
