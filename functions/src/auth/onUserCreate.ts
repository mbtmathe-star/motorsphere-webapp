/**
 * functions/src/auth/onUserCreate.ts
 *
 * Trigger: Firebase Auth user creation
 * Fires when a new user signs up (email/password or Google OAuth).
 *
 * Actions:
 *   1. Create /users/{uid} document with safe default values
 *   2. Set custom claim: { role: 'user' }
 *   3. Send welcome email via Resend (Base 4)
 */

import * as admin    from 'firebase-admin';
import * as functions from 'firebase-functions/v2';
import { auth }      from 'firebase-functions/v2';

// Initialise Admin SDK (safe to call multiple times — getApps() guards it)
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db       = admin.firestore();
const adminAuth = admin.auth();

export const onUserCreate = auth.user().onCreate(async (user) => {
  const { uid, email, displayName, photoURL } = user;

  functions.logger.info('[onUserCreate] New user:', { uid, email });

  // ── 1. Create Firestore user document ──────────────────────────────────────
  const now = admin.firestore.FieldValue.serverTimestamp();

  const userDoc = {
    uid,
    username:     uid,              // Temporary — user sets username in profile setup
    displayName:  displayName ?? email?.split('@')[0] ?? 'MotorSphere User',
    avatarUrl:    photoURL ?? null,
    phone:        null,
    province:     null,
    bio:          null,
    isVerified:   false,
    isSuspended:  false,
    role:         'user',
    listingCount: 0,
    createdAt:    now,
    updatedAt:    now,
  };

  try {
    await db.collection('users').doc(uid).set(userDoc);
    functions.logger.info('[onUserCreate] Firestore user doc created:', uid);
  } catch (error) {
    functions.logger.error('[onUserCreate] Failed to create Firestore user doc:', error);
    throw error;
  }

  // ── 2. Set custom role claim ────────────────────────────────────────────────
  try {
    await adminAuth.setCustomUserClaims(uid, { role: 'user' });
    functions.logger.info('[onUserCreate] Custom claim set: { role: user }', uid);
  } catch (error) {
    functions.logger.error('[onUserCreate] Failed to set custom claim:', error);
    // Non-fatal — user can still sign in, role will default to 'user' via rules
  }

  // ── 3. Send welcome email (Base 4) ─────────────────────────────────────────
  // TODO: Import and call sendWelcomeEmail(email, displayName) from ./utils/email
  functions.logger.info('[onUserCreate] TODO: send welcome email to', email);
});
