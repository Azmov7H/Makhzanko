import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n/config";

const COOKIE_NAME = "saas_token";
const PUBLIC_PATHS = ["/login", "/register", "/"];

export default async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // --- 0. Static Asset Exclusion (Safety Layer) ---
    // Double check manifest and files to ensure they don't trigger middleware
    if (
        pathname.endsWith('.webmanifest') || 
        pathname.endsWith('.png') || 
        pathname.endsWith('.jpg') || 
        pathname.endsWith('.ico') ||
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/api/')
    ) {
        return NextResponse.next();
    }

    // --- 1. I18N Handling (URL-based with Redirect) ---
    const urlLocale = locales.find(
        (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
    );

    let effectiveLocale = request.cookies.get('NEXT_LOCALE')?.value || defaultLocale;
    if (!locales.includes(effectiveLocale as any)) {
        effectiveLocale = defaultLocale;
    }

    // A. If missing locale in URL, REDIRECT to the locale-prefixed version
    const pathnameIsMissingLocale = !urlLocale;

    if (pathnameIsMissingLocale) {
        // Prepare the new URL with locale
        const redirectUrl = new URL(`/${effectiveLocale}${pathname === "/" ? "" : pathname}`, request.url);
        
        // Pass search params if any
        redirectUrl.search = request.nextUrl.search;

        const response = NextResponse.redirect(redirectUrl);
        // Ensure the preferred locale is saved if it wasn't already matched
        if (request.cookies.get("NEXT_LOCALE")?.value !== effectiveLocale) {
            response.cookies.set("NEXT_LOCALE", effectiveLocale, { path: '/' });
        }
        return response;
    }

    // B. If locale is present, just rewrite to internal path or pass through
    // For App Router, we usually rewrite the locale-prefixed URL to the internal one
    // if we are using the subfolder structure app/[locale]/...
    // In this specific project, the dashboard is under app/dashboard/... but the URL is /ar/dashboard.
    // This implies a rewrite is needed.
    
    const internalPathname = pathname.replace(`/${urlLocale}`, "") || "/";
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("X-NEXT-LOCALE", urlLocale!);

    const response = NextResponse.rewrite(new URL(internalPathname, request.url), {
        request: {
            headers: requestHeaders,
        },
    });

    // Sync cookie with the URL locale - ONLY if it has changed to avoid loops
    if (request.cookies.get("NEXT_LOCALE")?.value !== urlLocale) {
        response.cookies.set("NEXT_LOCALE", urlLocale!, { path: '/' });
    }

    // --- 2. Auth & Protection ---
    // Note: SAAS User authentication has migrated to a Pure SPA LocalStorage model
    // Dashboard protection is now handled exclusively on the client-side within AuthContext
    const isDashboard = internalPathname.startsWith('/dashboard');

    // Admin Panel Protection
    if (internalPathname.startsWith("/admin")) {
        const ownerToken = request.cookies.get("owner_token")?.value;
        if (!ownerToken && internalPathname !== "/admin/login") {
            return NextResponse.redirect(new URL(`/${urlLocale}/admin/login`, request.url));
        }
    }

    // --- 3. Security Headers ---
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

    return response;
}

export const config = {
    matcher: [
        // Match all paths except internal and files
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
    ],
};
