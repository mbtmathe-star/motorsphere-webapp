/**
 * functions/src/listings/onVehicleCreate.ts
 *
 * Trigger: New vehicle listing document created in Firestore.
 *
 * Actions:
 *   1. If status == 'pending_review': notify admin by email
 *   2. Validate required fields (server-side safety net)
 *   3. Increment users/{userId}.listingCount
 */

import * as admin    from 'firebase-admin';
import * as functions from 'firebase-functions/v2';
import { firestore } from 'firebase-functions/v2';

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

export const onVehicleCreate = firestore
  .onDocumentCreated('vehicles/{vehicleId}', async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const vehicle = snapshot.data();
    const { vehicleId } = event.params;

    functions.logger.info('[onVehicleCreate]', { vehicleId, status: vehicle.status });

    // ── 1. Notify admin if pending review ────────────────────────────────────
    if (vehicle.status === 'pending_review') {
      // TODO: sendAdminNewListingEmail(vehicle) — Base 4
      functions.logger.info('[onVehicleCreate] TODO: email admin for pending review:', vehicleId);
    }

    // ── 2. Validate required fields ──────────────────────────────────────────
    const requiredFields = ['userId', 'make', 'model', 'year', 'price', 'province', 'status'];
    const missingFields  = requiredFields.filter(f => vehicle[f] === undefined);

    if (missingFields.length > 0) {
      functions.logger.warn('[onVehicleCreate] Missing required fields:', {
        vehicleId,
        missingFields,
      });
      // Auto-reject incomplete listings (edge case — form validation should prevent this)
      await snapshot.ref.update({
        status:        'rejected',
        rejectionNote: `Missing required fields: ${missingFields.join(', ')}`,
        updatedAt:     admin.firestore.FieldValue.serverTimestamp(),
      });
      return;
    }

    // ── 3. Increment user listingCount ───────────────────────────────────────
    try {
      await db.collection('users').doc(vehicle.userId).update({
        listingCount: admin.firestore.FieldValue.increment(1),
        updatedAt:    admin.firestore.FieldValue.serverTimestamp(),
      });
      functions.logger.info('[onVehicleCreate] listingCount incremented for:', vehicle.userId);
    } catch (error) {
      functions.logger.error('[onVehicleCreate] Failed to increment listingCount:', error);
    }
  });
