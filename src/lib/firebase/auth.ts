/**
 * src/lib/firebase/auth.ts
 *
 * Firebase Auth helper functions — client side only.
 * Import in "use client" components or client-side hooks.
 *
 * Each sign-in / sign-up function:
 *  1. Calls the Firebase Auth SDK
 *  2. Gets the short-lived ID token (1 hour)
 *  3. POSTs it to /api/auth/session → server sets 5-day httpOnly session cookie
 *
 * Sign-out:
 *  1. Calls Firebase signOut (clears client auth state)
 *  2. DELETEs /api/auth/session → server clears the httpOnly cookie
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  type UserCredential,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

// ─── POST id-token to session API ────────────────────────────────────────────

async function createSessionCookie(credential: UserCredential): Promise<void> {
  const idToken = await credential.user.getIdToken();
  const res = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) {
    throw new Error('Failed to create session cookie');
  }
}

// ─── Sign in with email + password ───────────────────────────────────────────

export async function signIn(email: string, password: string): Promise<void> {
  const credential = await signInWithEmailAndPassword(auth, email, password);

  // If session cookie creation fails (e.g. Admin SDK env vars wrong in Vercel),
  // sign the client out immediately so the browser doesn't end up in a split
  // state (Firebase client-auth signed-in but no httpOnly session cookie).
  try {
    await createSessionCookie(credential);
  } catch {
    await firebaseSignOut(auth);
    const err = new Error('session-failed') as Error & { code: string };
    err.code = 'auth/session-failed';
    throw err;
  }
}

// ─── Create account with email + password ────────────────────────────────────

export async function signUp(
  email: string,
  password: string,
  displayName: string,
): Promise<UserCredential> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);

  // Update Firebase Auth display name (useful for Auth-level queries)
  await updateProfile(credential.user, { displayName });

  // Create the server-side session cookie.
  // If this fails (e.g. Admin SDK env vars missing in the deployment), we sign
  // the client out immediately so the browser doesn't end up in a split state
  // where Firebase client-auth is signed in but no httpOnly session cookie exists.
  try {
    await createSessionCookie(credential);
  } catch {
    await firebaseSignOut(auth);
    // Throw a typed error so the register page can surface a clear message
    const err = new Error('session-failed') as Error & { code: string };
    err.code = 'auth/session-failed';
    throw err;
  }

  return credential;
}

// ─── Sign out ────────────────────────────────────────────────────────────────

export async function signOut(): Promise<void> {
  // Clear Firebase client state
  await firebaseSignOut(auth);

  // Clear the httpOnly session cookie
  await fetch('/api/auth/session', { method: 'DELETE' });
}
