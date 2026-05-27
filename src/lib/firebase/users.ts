/**
 * src/lib/firebase/users.ts
 *
 * Firestore helpers for the /users/{uid} collection — client side only.
 * Import in "use client" components or client-side hooks.
 *
 * Security note:
 *   Firestore rules enforce that on CREATE:
 *     - role        == 'user'   (cannot self-elevate)
 *     - isVerified  == false    (admin-only field)
 *     - isSuspended == false    (admin-only field)
 *   These values are hard-coded into createUserProfile().
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { AccountType, UserDoc } from '@/types/firestore.types';

// ─── Create a new user profile document ──────────────────────────────────────

export interface CreateProfileData {
  uid:                  string;
  displayName:          string;
  email:                string;
  phone:                string;
  accountType:          AccountType;
  popiaConsentAccepted: boolean;
}

export async function createUserProfile(data: CreateProfileData): Promise<void> {
  const ref = doc(db, 'users', data.uid);

  // Generate a simple username from email prefix (lowercased)
  const username = data.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_');

  await setDoc(ref, {
    uid:                  data.uid,
    username,
    displayName:          data.displayName,
    email:                data.email,
    avatarUrl:            null,
    phone:                data.phone || null,
    province:             null,
    bio:                  null,
    // Security fields — enforced by Firestore rules, must match exactly
    role:                 'user',
    isVerified:           false,
    isSuspended:          false,
    // Marketplace fields
    accountType:          data.accountType,
    verificationStatus:   'not_started',
    profileCompletion:    30,
    popiaConsentAccepted: data.popiaConsentAccepted,
    listingCount:         0,
    createdAt:            serverTimestamp(),
    updatedAt:            serverTimestamp(),
  });
}

// ─── Fetch a user profile document ───────────────────────────────────────────

export async function getUserProfile(uid: string): Promise<UserDoc | null> {
  const ref  = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as UserDoc;
}

// ─── Update mutable profile fields (user-editable only) ──────────────────────

export interface UpdateProfileData {
  displayName?: string;
  phone?:       string | null;
  province?:    string | null;
  bio?:         string | null;
}

export async function updateUserProfile(
  uid: string,
  data: UpdateProfileData,
): Promise<void> {
  const ref = doc(db, 'users', uid);
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}
