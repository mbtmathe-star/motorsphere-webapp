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
 * Credential strategy (checked in order):
 *   1. FIREBASE_SERVICE_ACCOUNT_JSON — entire service account JSON as a string.
 *      Paste the full contents of your service account .json file into Vercel.
 *      JSON.parse() handles private key newlines automatically — no format issues.
 *   2. FIREBASE_ADMIN_PROJECT_ID + FIREBASE_ADMIN_CLIENT_EMAIL + FIREBASE_ADMIN_PRIVATE_KEY
 *      Legacy three-var approach (kept for backward compatibility).
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

  // ── Strategy 1: FIREBASE_SERVICE_ACCOUNT_JSON (preferred for Vercel) ─────────
  // Paste the full service account .json file contents as this single env var.
  // JSON.parse handles the private key newlines — no format issues.
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (serviceAccountJson) {
    let parsed: {
      project_id: string;
      client_email: string;
      private_key: string;
    };

    try {
      // Strip UTF-8 BOM (U+FEFF) that Windows adds when reading files via
      // PowerShell Get-Content or Notepad. JSON.parse() rejects BOM-prefixed
      // strings even when the JSON itself is valid.
      // charCodeAt(0) === 0xFEFF is the unambiguous BOM check.
      const withoutBom = serviceAccountJson.charCodeAt(0) === 0xFEFF
        ? serviceAccountJson.slice(1)
        : serviceAccountJson;
      const cleaned = withoutBom.trim();
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error('[admin] FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON:', e);
      throw e;
    }

    console.log('[admin] using FIREBASE_SERVICE_ACCOUNT_JSON — project:', parsed.project_id);

    _app = initializeApp({
      credential: cert({
        projectId:   parsed.project_id,
        clientEmail: parsed.client_email,
        privateKey:  parsed.private_key,  // JSON.parse handles \n automatically
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    });

    return _app;
  }

  // ── Strategy 2: three separate env vars (legacy / local .env.local) ──────────
  const projectId   = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey  = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (!projectId)   console.error('[admin] FIREBASE_ADMIN_PROJECT_ID is not set');
  if (!clientEmail) console.error('[admin] FIREBASE_ADMIN_CLIENT_EMAIL is not set');
  if (!privateKey)  console.error('[admin] FIREBASE_ADMIN_PRIVATE_KEY is not set');

  // Normalise: strip accidental surrounding quotes, convert literal \n to real newlines
  const normalisedKey = (privateKey ?? '')
    .replace(/^["']|["']$/g, '')
    .replace(/\\n/g, '\n');

  console.log(
    '[admin] using individual vars — key starts with:',
    normalisedKey.slice(0, 27),
    '| length:', normalisedKey.length,
  );

  _app = initializeApp({
    credential: cert({
      projectId:   projectId!,
      clientEmail: clientEmail!,
      privateKey:  normalisedKey,
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
