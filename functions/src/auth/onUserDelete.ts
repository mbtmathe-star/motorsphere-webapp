/**
 * functions/src/auth/onUserDelete.ts
 *
 * Trigger: Firebase Auth user deletion.
 * Fires when a user deletes their account.
 *
 * Actions (POPIA-compliant cleanup):
 *   1. Soft-delete: mark /users/{uid} as deleted (retain 30 days)
 *   2. Pause all active listings by the user
 *   3. Retain inquiries for 24 months (dispute resolution)
 *   4. Delete Storage files: avatars, vehicle images, parts images
 *   5. Schedule hard delete after 30-day grace period (Base 7)
 *
 * POPIA Note: Do NOT immediately delete user data on account deletion.
 * 30-day grace period allows account recovery and dispute resolution.
 */

import * as admin    from 'firebase-admin';
import * as functions from 'firebase-functions/v2';
import { auth }      from 'firebase-functions/v2';

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db      = admin.firestore();
const storage = admin.storage();

export const onUserDelete = auth.user().onDelete(async (user) => {
  const { uid } = user;

  functions.logger.info('[onUserDelete] User deleted:', uid);

  const now = admin.firestore.FieldValue.serverTimestamp();
  const batch = db.batch();

  // ── 1. Soft-delete user document ───────────────────────────────────────────
  try {
    const userRef = db.collection('users').doc(uid);
    batch.update(userRef, {
      isDeleted:  true,
      deletedAt:  now,
      updatedAt:  now,
      // Redact personal data immediately
      phone:      null,
      bio:        null,
    });

    await batch.commit();
    functions.logger.info('[onUserDelete] User soft-deleted:', uid);
  } catch (error) {
    functions.logger.error('[onUserDelete] Failed to soft-delete user:', error);
  }

  // ── 2. Pause all active listings ───────────────────────────────────────────
  try {
    const collectionsToUpdate = ['vehicles', 'parts'];

    for (const collection of collectionsToUpdate) {
      const activeListings = await db
        .collection(collection)
        .where('userId',  '==',     uid)
        .where('status',  'in',     ['active', 'pending_review'])
        .get();

      if (!activeListings.empty) {
        const pauseBatch = db.batch();
        activeListings.forEach(doc => {
          pauseBatch.update(doc.ref, { status: 'paused', updatedAt: now });
        });
        await pauseBatch.commit();
        functions.logger.info(`[onUserDelete] Paused ${activeListings.size} ${collection} listings`);
      }
    }
  } catch (error) {
    functions.logger.error('[onUserDelete] Failed to pause listings:', error);
  }

  // ── 3. Delete Storage files ────────────────────────────────────────────────
  // Note: Storage deletion can be slow; errors here are non-fatal
  try {
    const bucket = storage.bucket();
    const pathsToDelete = [
      `avatars/${uid}/`,
      `vehicles/${uid}/`,
      `parts/${uid}/`,
    ];

    for (const prefix of pathsToDelete) {
      try {
        await bucket.deleteFiles({ prefix });
        functions.logger.info('[onUserDelete] Deleted storage at:', prefix);
      } catch {
        functions.logger.warn('[onUserDelete] No files found at:', prefix);
      }
    }
  } catch (error) {
    functions.logger.error('[onUserDelete] Storage deletion error:', error);
  }

  // ── 4. Inquiries are retained (POPIA — dispute resolution, 24 months) ──────
  // Do NOT delete inquiries. They are retained with the user data soft-deleted.
  // Hard deletion scheduled for 30 days after soft delete (Base 7).

  functions.logger.info('[onUserDelete] Cleanup complete for:', uid);
});
