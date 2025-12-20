import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');

// Create next-intl middleware
const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip i18n routing for /owner routes (they handle auth separately)
  if (pathname.startsWith('/owner')) {
    // Protect /owner routes (except /owner/login)
    if (!pathname.startsWith('/owner/login')) {
      const ownerToken = request.cookies.get('owner_token')?.value;

      if (!ownerToken) {
        return NextResponse.redirect(new URL('/owner/login', request.url));
      }

      try {
        const { payload } = await jwtVerify(ownerToken, secret);

        if (payload.type !== 'owner') {
          return NextResponse.redirect(new URL('/owner/login', request.url));
        }
      } catch {
        return NextResponse.redirect(new URL('/owner/login', request.url));
      }
    }

    // Add security headers
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

    if (process.env.NODE_ENV === 'production') {
      response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }

    return response;
  }

  // Apply next-intl routing for all other routes
  const response = intlMiddleware(request);

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
  ],
};