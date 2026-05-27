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

    // Verify the ID token is valid before creating a session cookie
    await getAdminAuth().verifyIdToken(idToken);

    // Create a 5-day session cookie
    const expiresIn   = 5 * 24 * 60 * 60 * 1000;  // 5 days in ms
    const sessionCookie = await getAdminAuth().createSessionCookie(idToken, { expiresIn });

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
    console.error('[/api/auth/session POST]', error);

    // Don't expose internal error details
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
