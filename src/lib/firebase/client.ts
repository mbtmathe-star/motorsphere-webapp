/**
 * src/lib/firebase/client.ts
 *
 * Firebase Client SDK initialisation.
 * Import from this file in Client Components ("use client") only.
 * Do NOT import from this file in Server Components or API routes.
 *
 * For server-side Firebase, use: src/lib/firebase/admin.ts
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth,      connectAuthEmulator      } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator  } from 'firebase/firestore';
import { getStorage,   connectStorageEmulator    } from 'firebase/storage';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Prevent duplicate initialisation during Next.js hot reload
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);

// ─── Connect to local Firebase Emulators in development ──────────────────────
// Controlled by NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true in .env.local
// The typeof window check prevents this running during Next.js SSR

if (
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true' &&
  typeof window !== 'undefined'
) {
  // Guard: check if already connected (prevents React Strict Mode double-run)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(auth as any)._delegate?._config?.emulator) {
    connectAuthEmulator(auth,    'http://localhost:9099', { disableWarnings: true });
    connectFirestoreEmulator(db,  'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
  }
}
