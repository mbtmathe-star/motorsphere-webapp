/**
 * src/lib/firebase/admin.ts
 *
 * Firebase Admin SDK — lazy initialization.
 * Import from this file in Server Components, API routes only.
 * NEVER import from this file in Client Components.
 *
 * ⚠️ IMPORTANT: Exported functions are lazy — the Admin SDK is NOT initialized
 * at module load time. It initializes on first function call. This prevents
 * build-time failures when real credentials aren't available during next build.
 *
 * Usage:
 *   import { getAdminAuth, getAdminDb } from '@/lib/firebase/admin';
 *   const decoded = await getAdminAuth().verifySessionCookie(session, true);
 *   const snap    = await getAdminDb().collection('vehicles').get();
 */

import { getApps, getApp, initializeApp, cert, type App } from 'firebase-admin/app';
import { getAuth      } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage   } from 'firebase-admin/storage';

let _app: App | undefined;

/**
 * Lazily initialize the Firebase Admin SDK.
 * Called only when getAdminAuth / getAdminDb / getAdminStorage are invoked.
 */
function getAdminApp(): App {
  if (_app) return _app;

  // Re-use an existing app instance (handles Next.js module hot-reloading)
  if (getApps().length > 0) {
    _app = getApp();
    return _app;
  }

  _app = initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_ADMIN_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
      // Environment variables serialize newlines as literal \n — restore them.
      // The RSA private key format requires actual newline characters.
      privateKey:  process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  });

  return _app;
}

/**
 * Get the Firebase Admin Auth instance.
 * Initializes the Admin SDK on first call.
 */
export function getAdminAuth() {
  return getAuth(getAdminApp());
}

/**
 * Get the Firebase Admin Firestore instance.
 * Initializes the Admin SDK on first call.
 */
export function getAdminDb() {
  return getFirestore(getAdminApp());
}

/**
 * Get the Firebase Admin Storage instance.
 * Initializes the Admin SDK on first call.
 */
export function getAdminStorage() {
  return getStorage(getAdminApp());
}
