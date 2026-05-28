/**
 * src/app/api/auth/session/route.ts
 *
 * Session Cookie Auth API
 *
 * POST /api/auth/session
 *   - Client passes Firebase ID token (short-lived, 1 hour)
 *   - Server verifies ID token, creates 5-day session cookie (httpOnly)
 *   - Sets __session cookie — subsequent requests authenticated server-side
 *
 * DELETE /api/auth/session
 *   - Clears the __session cookie (signs user out server-side)
 *
 * Why session cookies over ID tokens:
 *   Firebase ID tokens expire in 1 hour and require client-side refresh.
 *   Session cookies last 5 days, are httpOnly (not accessible to JS),
 *   and can be verified on every server render without client round-trips.
 */

// Prevent Next.js from statically rendering this route at build time.
// The Admin SDK requires runtime credentials and cannot run during static analysis.
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebase/admin';

// ─── POST — Create session cookie ─────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { idToken?: string };
    const { idToken } = body;

    if (!idToken || typeof idToken !== 'string') {
      return NextResponse.json(
        { error: 'idToken is required' },
        { status: 400 },
      );
    }

    // Step 1: verify the short-lived ID token
    let decoded;
    try {
      decoded = await getAdminAuth().verifyIdToken(idToken);
      console.log('[session] verifyIdToken OK — uid:', decoded.uid);
    } catch (verifyErr) {
      const e = verifyErr as { code?: string; message?: string };
      console.error('[session] verifyIdToken FAILED —', e.code, e.message);
      return NextResponse.json(
        { error: 'Invalid ID token' },
        { status: 401 },
      );
    }

    // Step 2: exchange for a long-lived session cookie
    const expiresIn = 5 * 24 * 60 * 60 * 1000; // 5 days in ms
    let sessionCookie: string;
    try {
      sessionCookie = await getAdminAuth().createSessionCookie(idToken, { expiresIn });
      console.log('[session] createSessionCookie OK — uid:', decoded.uid);
    } catch (cookieErr) {
      const e = cookieErr as { code?: string; message?: string };
      console.error('[session] createSessionCookie FAILED —', e.code, e.message);
      return NextResponse.json(
        { error: 'Failed to create session cookie' },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ success: true }, { status: 200 });

    response.cookies.set('__session', sessionCookie, {
      maxAge:   expiresIn / 1000,  // maxAge is in seconds
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path:     '/',
    });

    return response;
  } catch (error) {
    // Outer catch — unexpected errors (e.g. JSON parse failure)
    console.error('[session] Unexpected error in POST /api/auth/session:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 401 },
    );
  }
}

// ─── DELETE — Clear session cookie (sign out) ─────────────────────────────────

export async function DELETE() {
  try {
    const response = NextResponse.json({ success: true }, { status: 200 });

    // Expire the cookie immediately
    response.cookies.set('__session', '', {
      maxAge:   0,
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path:     '/',
    });

    return response;
  } catch (error) {
    console.error('[/api/auth/session DELETE]', error);
    return NextResponse.json(
      { error: 'Failed to clear session' },
      { status: 500 },
    );
  }
}
