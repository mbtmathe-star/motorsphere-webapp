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
import { shouldUseEmulators } from './emulator-config';

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

// Guard SDK service init against server-side module evaluation.
// Next.js may evaluate 'use client' import chains on the server during
// static generation. Auth/Firestore/Storage require a browser context
// and throw "auth/invalid-api-key" when initialised server-side.
// All actual usage is inside useEffect hooks which never run on the server.
const isBrowser = typeof window !== 'undefined';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const auth    = isBrowser ? getAuth(app)      : null as any;
export const db      = isBrowser ? getFirestore(app) : null as any;
export const storage = isBrowser ? getStorage(app)   : null as any;
/* eslint-enable @typescript-eslint/no-explicit-any */

// ─── Connect to local Firebase Emulators in development ──────────────────────
// Requires BOTH:
//   NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true  (exact string — Boolean() not used)
//   NODE_ENV !== 'production'                (hard guard — never runs on Vercel)
// The typeof window check prevents this running during Next.js SSR.

if (shouldUseEmulators && typeof window !== 'undefined') {
  // Guard: check if already connected (prevents React Strict Mode double-run)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(auth as any)._delegate?._config?.emulator) {
    connectAuthEmulator(auth,      'http://localhost:9099', { disableWarnings: true });
    connectFirestoreEmulator(db,   'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
  }
}
