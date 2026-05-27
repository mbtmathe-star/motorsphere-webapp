/**
 * src/proxy.ts
 *
 * Next.js 16 Proxy (formerly middleware.ts) — UX routing guard.
 *
 * ⚠️ SECURITY NOTE:
 * This proxy checks cookie PRESENCE only — it cannot verify the cookie
 * cryptographically because firebase-admin uses Node.js APIs unavailable
 * in the Edge Runtime.
 *
 * Actual security is enforced at two layers BELOW this:
 *   1. Firebase Security Rules — enforced by Firebase on every read/write,
 *      cannot be bypassed regardless of middleware.
 *   2. Server Components / API routes — call adminAuth.verifySessionCookie()
 *      before any sensitive data operation.
 *
 * This middleware is a UX guard (prevents unnecessary page renders for
 * unauthenticated users), NOT the security boundary.
 */

import { NextRequest, NextResponse } from 'next/server';

// Routes protected by authentication (cookie must be present)
// Matched as: pathname === prefix OR pathname.startsWith(prefix + '/')
// This prevents /workshops matching /workshop, etc.
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/account',
  '/seller',
  '/dealer',
  '/vendor',
  '/buyer',
  '/saved',
  '/inquiries',
  '/profile',
  '/verify',
  '/listings',
  '/workshop',   // dashboard workshop page — NOT /workshops (public)
];

// Admin routes — also require auth (role enforced in layout Server Component)
const ADMIN_PREFIX = '/admin';

// Pages only accessible to unauthenticated users
// (authenticated users are redirected to /dashboard)
const AUTH_ONLY_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Session cookie set by /api/auth/session POST (httpOnly, cannot be read by JS)
  const session = req.cookies.get('__session')?.value;

  // Use exact-prefix matching: /workshop matches /workshop and /workshop/foo
  // but NOT /workshops (avoids collision with public marketplace page)
  const isProtected = PROTECTED_PREFIXES.some(
    p => pathname === p || pathname.startsWith(p + '/'),
  );
  const isAdmin     = pathname === ADMIN_PREFIX || pathname.startsWith(ADMIN_PREFIX + '/');
  const isAuthRoute = AUTH_ONLY_ROUTES.includes(pathname);

  // Redirect unauthenticated users away from protected routes
  if ((isProtected || isAdmin) && !session) {
    const url = new URL('/login', req.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth-only pages
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - _next/static  (static assets)
     * - _next/image   (image optimisation)
     * - favicon.ico
     * - public/       (public directory files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
