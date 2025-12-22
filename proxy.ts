import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "./lib/i18n/config";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "");

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. i18n redirect logic (if locale is missing)
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (!pathnameHasLocale) {
        // Skip redirect for public assets (though matcher should handle most)
        if (pathname.includes('.')) return NextResponse.next();

        const locale = request.cookies.get("locale")?.value || defaultLocale;
        request.nextUrl.pathname = `/${locale}${pathname}`;
        return NextResponse.redirect(request.nextUrl);
    }

    // 2. Auth protection for owner panel
    const segments = pathname.split("/");
    const currentLocale = segments[1];

    // Check if it's an admin route (/[locale]/admin/...)
    if (segments[2] === "admin") {
        // Protect /admin routes (except /[locale]/admin/login)
        if (segments[3] !== "login") {
            const ownerToken = request.cookies.get("owner_token")?.value;

            if (!ownerToken) {
                return NextResponse.redirect(new URL(`/${currentLocale}/admin/login`, request.url));
            }

            try {
                const { payload } = await jwtVerify(ownerToken, secret);
                if (payload.type !== "owner") {
                    return NextResponse.redirect(new URL(`/${currentLocale}/admin/login`, request.url));
                }
            } catch {
                return NextResponse.redirect(new URL(`/${currentLocale}/admin/login`, request.url));
            }
        }
    }

    // 3. Prepare response and add security headers
    const response = NextResponse.next();

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
    // Matcher tailored to ignore static assets, api routes and standard vercel files
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.png|logo.png|manifest.json|robots.txt|sitemap.xml|.*\\.[\\w]+$).*)"],
};
