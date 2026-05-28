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
    // Core identity
    uid:                  data.uid,
    username,
    displayName:          data.displayName,
    email:                data.email,
    avatarUrl:            null,
    phone:                data.phone || null,
    city:                 null,
    province:             null,
    bio:                  null,

    // Security fields — enforced by Firestore rules, must match exactly
    role:                 'user',
    isVerified:           false,
    isSuspended:          false,

    // Marketplace fields
    accountType:          data.accountType,

    // Account lifecycle
    accountStatus:        'active',
    onboardingStatus:     'incomplete',
    onboardingComplete:   false,

    // Verification
    verificationStatus:      'not_started',
    verificationSubmittedAt: null,
    verificationUpdatedAt:   null,

    // Subscription — free tier defaults
    subscriptionStatus:       'free',
    activePackageId:          null,
    packageName:              'Free',
    listingAllowance:         3,
    featuredListingAllowance: 0,

    // Profile meta
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
  city?:        string | null;
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

// ─── Verification / onboarding submission ────────────────────────────────────

export interface VerificationSubmission {
  accountType: AccountType;

  // Common
  city?:     string;
  province?: string;

  // Buyer
  preferredInterests?: string[];

  // Private Seller
  sellerDeclaration?:     boolean;
  authorisedToSell?:      boolean;
  preferredContactMethod?: string;

  // Dealer
  dealershipName?:   string;
  companyRegNumber?: string;
  businessAddress?:  string;
  authorisedRep?:    string;
  vehicleTypesSold?: string[];

  // Parts Vendor
  vendorName?:            string;
  supplierType?:          string;
  categoriesSupplied?:    string[];
  vehicleMakesSupported?: string[];
  deliveryAreas?:         string;
  warrantyPolicy?:        string;

  // Workshop
  tradingName?:        string;
  rmiRegistered?:      boolean;
  workshopType?:       string;
  servicesOffered?:    string[];
  operatingHours?:     string;
  serviceArea?:        string;
  emergencyAvailable?: boolean;

  // Document filenames (Storage upload deferred to Base 7)
  documentsSubmitted?: string[];
}

/**
 * Submit onboarding/verification data for a user.
 *
 * Buyer:     sets onboardingComplete, verificationStatus = 'not_required'
 * All others: sets verificationStatus = 'submitted', awaits admin review
 *
 * Does NOT touch: role, isVerified, isSuspended (rule-protected fields)
 */
export async function submitVerification(
  uid: string,
  submission: VerificationSubmission,
): Promise<void> {
  const ref      = doc(db, 'users', uid);
  const isBuyer  = submission.accountType === 'buyer';

  // Build the update — omit undefined values
  const update: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };

  // Common location fields
  if (submission.city     !== undefined) update.city     = submission.city;
  if (submission.province !== undefined) update.province = submission.province;

  // Role-specific fields
  if (submission.preferredInterests     !== undefined) update.preferredInterests     = submission.preferredInterests;
  if (submission.sellerDeclaration      !== undefined) update.sellerDeclaration      = submission.sellerDeclaration;
  if (submission.authorisedToSell       !== undefined) update.authorisedToSell       = submission.authorisedToSell;
  if (submission.preferredContactMethod !== undefined) update.preferredContactMethod = submission.preferredContactMethod;
  if (submission.dealershipName         !== undefined) update.dealershipName         = submission.dealershipName;
  if (submission.companyRegNumber       !== undefined) update.companyRegNumber       = submission.companyRegNumber;
  if (submission.businessAddress        !== undefined) update.businessAddress        = submission.businessAddress;
  if (submission.authorisedRep          !== undefined) update.authorisedRep          = submission.authorisedRep;
  if (submission.vehicleTypesSold       !== undefined) update.vehicleTypesSold       = submission.vehicleTypesSold;
  if (submission.vendorName             !== undefined) update.vendorName             = submission.vendorName;
  if (submission.supplierType           !== undefined) update.supplierType           = submission.supplierType;
  if (submission.categoriesSupplied     !== undefined) update.categoriesSupplied     = submission.categoriesSupplied;
  if (submission.vehicleMakesSupported  !== undefined) update.vehicleMakesSupported  = submission.vehicleMakesSupported;
  if (submission.deliveryAreas          !== undefined) update.deliveryAreas          = submission.deliveryAreas;
  if (submission.warrantyPolicy         !== undefined) update.warrantyPolicy         = submission.warrantyPolicy;
  if (submission.tradingName            !== undefined) update.tradingName            = submission.tradingName;
  if (submission.rmiRegistered          !== undefined) update.rmiRegistered          = submission.rmiRegistered;
  if (submission.workshopType           !== undefined) update.workshopType           = submission.workshopType;
  if (submission.servicesOffered        !== undefined) update.servicesOffered        = submission.servicesOffered;
  if (submission.operatingHours         !== undefined) update.operatingHours         = submission.operatingHours;
  if (submission.serviceArea            !== undefined) update.serviceArea            = submission.serviceArea;
  if (submission.emergencyAvailable     !== undefined) update.emergencyAvailable     = submission.emergencyAvailable;
  if (submission.documentsSubmitted     !== undefined) update.documentsSubmitted     = submission.documentsSubmitted;

  // Onboarding status
  update.onboardingComplete = true;

  if (isBuyer) {
    update.onboardingStatus   = 'complete';
    update.verificationStatus = 'not_required';
    update.profileCompletion  = 70;
  } else {
    update.onboardingStatus      = 'verification_submitted';
    update.verificationStatus    = 'submitted';
    update.verificationSubmittedAt = serverTimestamp();
    update.profileCompletion     = 60;
  }

  await updateDoc(ref, update);
}
