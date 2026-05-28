/**
 * src/lib/firebase/emulator-config.ts
 *
 * Single source of truth for whether Firebase Emulators should be connected.
 *
 * Rules:
 *  1. NEXT_PUBLIC_USE_FIREBASE_EMULATORS must be the exact string "true"
 *     (Boolean("false") === true, so never use Boolean() here)
 *  2. NODE_ENV must NOT be "production" — hard safety guard so that even if
 *     the env var is accidentally set to "true" in the Vercel dashboard,
 *     the emulators are never contacted from a deployed build.
 *
 * Usage:
 *   import { shouldUseEmulators } from './emulator-config';
 *   if (shouldUseEmulators) { connectAuthEmulator(...) }
 */

export const shouldUseEmulators =
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true' &&
  process.env.NODE_ENV !== 'production';
