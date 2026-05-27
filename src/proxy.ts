/**
 * src/proxy.ts
 *
 * Next.js 16 Proxy (formerly middleware.ts) — routing guard.
 * Renamed from middleware.ts to proxy.ts in Next.js 16.
 *
 * ⚠️ SECURITY NOTE:
 * This middleware checks cookie PRESENCE only — it cannot verify the cookie
 * cryptographically because firebase-admin uses Node.js APIs unavailable in
 * the Edge Runtime.
 *
 * Actual security is enforced at two layers BELOW this:
 *   1. Firebase Security Rules — enforced by Firebase on every read/write
 *      regardless of what middleware does. Cannot be bypassed.
 *   2. Server Components / API routes — call adminAuth.verifySessionCookie()
 *      before any sensitive data operation.
 *
 * Middleware is a UX routing guard (prevents unnecessary round-trips),
 * NOT the security boundary.
 */

import { NextRequest, NextResponse } from 'next/server';

// Routes that require authentication (any path starting with these)
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/account',
];

// Routes that require admin role (enforced in layout Server Component too)
const ADMIN_PREFIX = '/admin';

// Routes only accessible to unauthenticated users
// (authenticated users are redirected away from these)
const AUTH_ONLY_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
];

// Next.js 16: export function must be named "proxy" (previously "middleware")
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Read session cookie — httpOnly, set by /api/auth/session POST
  const session = req.cookies.get('__session')?.value;

  const isProtected  = PROTECTED_PREFIXES.some(p => pathname.startsWith(p));
  const isAdmin      = pathname.startsWith(ADMIN_PREFIX);
  const isAuthRoute  = AUTH_ONLY_ROUTES.includes(pathname);

  // ── Redirect unauthenticated users away from protected routes ───────────
  if ((isProtected || isAdmin) && !session) {
    const url = new URL('/login', req.url);
    url.searchParams.set('next', pathname);   // preserve intended destination
    return NextResponse.redirect(url);
  }

  // ── Redirect authenticated users away from auth-only pages ───────────────
  // (Full session verification happens in the destination page Server Component)
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static  (static assets)
     * - _next/image   (image optimisation)
     * - favicon.ico
     * - public/       (public directory files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
