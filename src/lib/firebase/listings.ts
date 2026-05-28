/**
 * src/lib/firebase/listings.ts
 *
 * Firestore helpers for the /listings/{listingId} collection — client side only.
 * Import in "use client" components or client-side hooks only.
 *
 * Lifecycle: draft → submitted → pending_review → approved → live
 *            → rejected | sold | expired | flagged | suspended
 *
 * Price rule: ALL prices are ZAR cents (integer).
 * R 150 000 = 15000000.
 */

import {
  addDoc,
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type {
  AccountType,
  ContactPref,
  FuelType,
  ListingDoc,
  ListingType,
  ModerationStatus,
  PartCondition,
  Province,
  VehicleCondition,
  VehicleTransmission,
  VehicleType,
} from '@/types/firestore.types';

// ─── Create listing input ─────────────────────────────────────────────────────

export interface CreateListingInput {
  // Core (required for all types)
  listingType:       ListingType;
  category:          string;
  title:             string;
  description:       string;
  price:             number;           // ZAR cents (integer)
  negotiable:        boolean;
  province:          Province;
  city:              string;
  contactPreference: ContactPref;
  imagePlaceholders: string[];         // filenames — no actual upload yet

  // Vehicle-specific
  vehicleType?:          VehicleType;
  make?:                 string;
  model?:                string;
  year?:                 number;
  mileage?:              number | null;
  fuelType?:             FuelType | string;
  transmission?:         VehicleTransmission | string;
  condition?:            VehicleCondition;
  colour?:               string | null;
  serviceHistory?:       boolean;
  ownershipDeclaration?: boolean;

  // Part-specific
  partName?:          string;
  partCategory?:      string;
  oemOrAftermarket?:  'oem' | 'aftermarket';
  compatibleMakes?:   string[];
  compatibleModels?:  string[];
  quantityAvailable?: number;
  partCondition?:     PartCondition;
  warrantyPolicy?:    string;
  deliveryAvailable?: boolean;

  // Service-specific
  serviceType?:        string;
  rmiStatus?:          boolean;
  serviceArea?:        string;
  operatingHours?:     string;
  emergencyAvailable?: boolean;
}

// ─── Create listing ───────────────────────────────────────────────────────────

/**
 * Creates a listing document in Firestore.
 *
 * @param uid         - Owner's Firebase Auth UID
 * @param displayName - Owner's display name (denormalised)
 * @param accountType - Owner's account type
 * @param data        - All listing fields
 * @param asDraft     - true = status:'draft', false = status:'submitted'
 * @returns           The new listing's document ID
 */
export async function createListing(
  uid:         string,
  displayName: string,
  accountType: AccountType,
  data:        CreateListingInput,
  asDraft:     boolean,
): Promise<string> {
  const status: string          = asDraft ? 'draft' : 'submitted';
  const modStatus: ModerationStatus = asDraft ? 'none' : 'pending_review';

  const ref    = collection(db, 'listings');
  const docRef = await addDoc(ref, {
    ...data,
    ownerId:          uid,
    ownerDisplayName: displayName,
    ownerRole:        accountType,
    status,
    moderationStatus: modStatus,
    featured:         false,
    rejectionReason:  null,
    submittedAt:      asDraft ? null : serverTimestamp(),
    approvedAt:       null,
    rejectedAt:       null,
    createdAt:        serverTimestamp(),
    updatedAt:        serverTimestamp(),
  });

  return docRef.id;
}

// ─── Subscribe to owner's listings ───────────────────────────────────────────

/**
 * Real-time subscription to all listings owned by uid.
 * Ordered by updatedAt descending.
 *
 * Requires a composite index on: listings [ownerId ASC, updatedAt DESC]
 * (defined in firestore.indexes.json)
 */
export function subscribeUserListings(
  uid:      string,
  callback: (listings: ListingDoc[]) => void,
): Unsubscribe {
  const q = query(
    collection(db, 'listings'),
    where('ownerId', '==', uid),
    orderBy('updatedAt', 'desc'),
  );

  return onSnapshot(
    q,
    snap => {
      const listings = snap.docs.map(d => ({ ...d.data(), id: d.id }) as ListingDoc);
      callback(listings);
    },
    err => {
      // Fail silently — most commonly a missing index during initial deploy
      console.warn('[listings] subscribeUserListings:', err.message);
      callback([]);
    },
  );
}

// ─── Subscribe to pending listings (admin only) ───────────────────────────────

/**
 * Real-time subscription to listings awaiting moderation.
 * Will silently return empty for non-admin users (Firestore rules deny).
 *
 * Requires a composite index on: listings [moderationStatus ASC, submittedAt DESC]
 */
export function subscribePendingListings(
  callback: (listings: ListingDoc[]) => void,
): Unsubscribe {
  const q = query(
    collection(db, 'listings'),
    where('moderationStatus', '==', 'pending_review'),
    orderBy('submittedAt', 'desc'),
    limit(20),
  );

  return onSnapshot(
    q,
    snap => {
      const listings = snap.docs.map(d => ({ ...d.data(), id: d.id }) as ListingDoc);
      callback(listings);
    },
    _err => {
      // Expected to fail for non-admin users — swallow silently
      callback([]);
    },
  );
}

// ─── Fetch single listing ─────────────────────────────────────────────────────

/**
 * Fetch any listing by ID.
 * Returns null if the document doesn't exist OR if the caller lacks permission.
 * Security rules enforce: owner can read their own listings; public can read live/approved only.
 */
export async function getOwnerListing(id: string): Promise<ListingDoc | null> {
  try {
    const snap = await getDoc(doc(db, 'listings', id));
    if (!snap.exists()) return null;
    return { ...snap.data(), id: snap.id } as ListingDoc;
  } catch {
    return null;
  }
}

/**
 * Fetch a listing for public display.
 * Returns null if not found, not live/approved, or caller lacks permission.
 */
export async function getPublicListing(id: string): Promise<ListingDoc | null> {
  try {
    const snap = await getDoc(doc(db, 'listings', id));
    if (!snap.exists()) return null;
    const data = snap.data() as ListingDoc;
    if (!['live', 'approved'].includes(data.status)) return null;
    return { ...data, id: snap.id };
  } catch {
    return null;
  }
}

// ─── Mutate listing ───────────────────────────────────────────────────────────

/**
 * Submit a saved draft for MotorSphere review.
 */
export async function submitListing(id: string): Promise<void> {
  await updateDoc(doc(db, 'listings', id), {
    status:           'submitted',
    moderationStatus: 'pending_review',
    submittedAt:      serverTimestamp(),
    updatedAt:        serverTimestamp(),
  });
}
