/**
 * src/types/firestore.types.ts
 *
 * Canonical TypeScript types for all Firestore document shapes.
 * These types mirror the Security Rules field constraints and Cloud Function writes.
 *
 * Pricing rule: ALL prices are stored as ZAR cents (integer).
 * Display: use formatZAR() from src/utils/format.ts
 * Example: R 150 000 is stored as 15000000
 *
 * Timestamp rule: Store as Firestore Timestamp objects, NOT strings or numbers.
 * For Server → Client props: use Serialized<T> to convert Timestamps to ISO strings.
 */

import type { Timestamp } from 'firebase/firestore';

// ─── Enums (as const objects for runtime use + type inference) ──────────────

export const PROVINCES = [
  'Gauteng',
  'Western Cape',
  'KwaZulu-Natal',
  'Eastern Cape',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Free State',
  'Northern Cape',
] as const;
export type Province = typeof PROVINCES[number];

export const VEHICLE_TRANSMISSION = [
  'manual',
  'automatic',
  'semi-automatic',
] as const;
export type VehicleTransmission = typeof VEHICLE_TRANSMISSION[number];

export const FUEL_TYPES = [
  'petrol',
  'diesel',
  'hybrid',
  'electric',
  'lpg',
] as const;
export type FuelType = typeof FUEL_TYPES[number];

export const VEHICLE_CONDITIONS = [
  'excellent',
  'good',
  'fair',
  'salvage',
] as const;
export type VehicleCondition = typeof VEHICLE_CONDITIONS[number];

export const PART_CONDITIONS = [
  'new',
  'used',
  'refurbished',
] as const;
export type PartCondition = typeof PART_CONDITIONS[number];

export const LISTING_STATUSES = [
  'draft',
  'pending_review',
  'active',
  'paused',
  'sold',
  'rejected',
] as const;
export type ListingStatus = typeof LISTING_STATUSES[number];

export const USER_ROLES = [
  'user',
  'verified_seller',
  'admin',
  'super_admin',
] as const;
export type UserRole = typeof USER_ROLES[number];

// Marketplace account category (set at registration, distinct from security role)
export const ACCOUNT_TYPES = [
  'buyer',
  'private_seller',
  'dealer',
  'parts_vendor',
  'workshop',
  'admin_preview',
] as const;
export type AccountType = typeof ACCOUNT_TYPES[number];

// Account lifecycle status
export const ACCOUNT_STATUSES = [
  'active',
  'suspended',
  'deleted',
] as const;
export type AccountStatus = typeof ACCOUNT_STATUSES[number];

// Onboarding progress
export const ONBOARDING_STATUSES = [
  'incomplete',
  'verification_submitted',
  'complete',
] as const;
export type OnboardingStatus = typeof ONBOARDING_STATUSES[number];

// Verification lifecycle
export const VERIFICATION_STATUSES = [
  'not_started',
  'submitted',        // user has submitted their form/documents
  'pending_review',   // admin has it in queue (set by Cloud Function / admin)
  'approved',         // approved by admin
  'rejected',         // rejected by admin
  'not_required',     // buyers / non-selling accounts
] as const;
export type VerificationStatus = typeof VERIFICATION_STATUSES[number];

// Subscription tier
export const SUBSCRIPTION_STATUSES = [
  'free',
  'basic',
  'premium',
  'enterprise',
] as const;
export type SubscriptionStatus = typeof SUBSCRIPTION_STATUSES[number];

export const CONTACT_PREFS = [
  'platform_only',
  'show_phone',
  'show_whatsapp',
] as const;
export type ContactPref = typeof CONTACT_PREFS[number];

export const LISTING_TYPES = [
  'vehicle',
  'part',
] as const;
export type ListingType = typeof LISTING_TYPES[number];

// ─── /users/{uid} ────────────────────────────────────────────────────────────

export interface UserDoc {
  // ── Core identity ──────────────────────────────────────────────────────────
  uid:                  string;          // = document ID = Firebase Auth UID
  username:             string;          // auto-generated from email prefix
  displayName:          string;          // full name entered at registration
  email:                string;
  avatarUrl:            string | null;
  phone:                string | null;
  city:                 string | null;   // added during onboarding
  province:             Province | null;
  bio:                  string | null;

  // ── Security role (Firebase Auth claim level) ──────────────────────────────
  role:                 UserRole;        // always 'user' on create; elevated by admin

  // ── Marketplace account category ───────────────────────────────────────────
  accountType:          AccountType;     // chosen at registration

  // ── Account lifecycle ──────────────────────────────────────────────────────
  accountStatus:        AccountStatus;   // 'active' | 'suspended' | 'deleted'
  onboardingStatus:     OnboardingStatus;// 'incomplete' | 'verification_submitted' | 'complete'
  onboardingComplete:   boolean;

  // ── Verification ───────────────────────────────────────────────────────────
  isVerified:              boolean;       // admin-managed legacy field
  isSuspended:             boolean;       // admin-managed legacy field
  verificationStatus:      VerificationStatus;
  verificationSubmittedAt: Timestamp | null;
  verificationUpdatedAt:   Timestamp | null;

  // ── Subscription & package ─────────────────────────────────────────────────
  subscriptionStatus:        SubscriptionStatus; // 'free' | 'basic' | 'premium' | 'enterprise'
  activePackageId:           string | null;
  packageName:               string;             // 'Free' | 'Starter' | 'Professional' | 'Enterprise'
  listingAllowance:          number;             // max listings on current plan
  featuredListingAllowance:  number;             // max featured listings

  // ── Profile metadata ───────────────────────────────────────────────────────
  profileCompletion:    number;          // 0–100
  popiaConsentAccepted: boolean;
  listingCount:         number;
  createdAt:            Timestamp;
  updatedAt:            Timestamp;

  // ── Extended onboarding / verification fields (optional) ───────────────────
  // Written during the verification flow — role-specific.

  // All roles
  preferredContactMethod?: ContactPref;

  // Buyer
  preferredInterests?: string[];         // 'vehicles' | 'parts' | 'services' | 'insurance'

  // Private Seller
  sellerDeclaration?:  boolean;
  authorisedToSell?:   boolean;

  // Dealer
  dealershipName?:     string;
  companyRegNumber?:   string;
  businessAddress?:    string;
  authorisedRep?:      string;
  vehicleTypesSold?:   string[];

  // Parts Vendor
  vendorName?:              string;
  supplierType?:            string;   // 'new_parts' | 'used_parts' | 'oem' | 'aftermarket'
  categoriesSupplied?:      string[];
  vehicleMakesSupported?:   string[];
  deliveryAreas?:           string;
  warrantyPolicy?:          string;

  // Workshop / Mechanic
  tradingName?:         string;
  rmiRegistered?:       boolean;
  workshopType?:        string;   // 'rmi_workshop' | 'independent_mechanic' | 'mobile_mechanic'
  servicesOffered?:     string[];
  operatingHours?:      string;
  serviceArea?:         string;
  emergencyAvailable?:  boolean;

  // Document tracking (filenames only — Storage upload deferred to Base 7)
  documentsSubmitted?:  string[];
}

// ─── /vehicles/{vehicleId} ───────────────────────────────────────────────────

export interface VehicleDoc {
  id:              string;         // = document ID
  userId:          string;
  userDisplayName: string;         // denormalised — synced by onUserUpdate Cloud Function
  userIsVerified:  boolean;        // denormalised — synced by onUserVerified Cloud Function
  make:            string;
  model:           string;
  year:            number;
  variant:         string | null;
  mileage:         number | null;
  transmission:    VehicleTransmission;
  fuelType:        FuelType;
  colour:          string | null;
  condition:       VehicleCondition;
  price:           number;         // ZAR cents — ALWAYS store as integer (R 150 000 = 15000000)
  negotiable:      boolean;
  province:        Province;
  city:            string | null;
  description:     string;
  contactPref:     ContactPref;
  primaryImageUrl: string | null;  // denormalised — synced by onImageCreate Cloud Function
  imageCount:      number;         // denormalised — synced by onImageCreate/Delete
  status:          ListingStatus;
  rejectionNote:   string | null;  // set by admin on rejection
  viewsCount:      number;
  featured:        boolean;
  createdAt:       Timestamp;
  updatedAt:       Timestamp;
  publishedAt:     Timestamp | null;
}

// ─── /vehicles/{vehicleId}/images/{imageId} ──────────────────────────────────

export interface ListingImageDoc {
  id:          string;
  storagePath: string;   // Firebase Storage path (e.g., vehicles/{uid}/{vehicleId}/0.webp)
  url:         string;   // Public CDN download URL
  sortOrder:   number;   // 0 = primary image
  isPrimary:   boolean;
  createdAt:   Timestamp;
}

// ─── /parts/{partId} ─────────────────────────────────────────────────────────

export interface PartDoc {
  id:                 string;
  userId:             string;
  userDisplayName:    string;       // denormalised
  userIsVerified:     boolean;      // denormalised
  title:              string;
  category:           string;       // slug from parts taxonomy (e.g., 'engine-drivetrain')
  condition:          PartCondition;
  price:              number;       // ZAR cents
  quantity:           number;
  province:           Province;
  city:               string | null;
  description:        string;
  compatibleMakes:    string[];     // array-contains searchable
  compatibleModels:   string[];
  compatibleYearFrom: number | null;
  compatibleYearTo:   number | null;
  primaryImageUrl:    string | null; // denormalised
  imageCount:         number;        // denormalised
  status:             ListingStatus;
  rejectionNote:      string | null;
  viewsCount:         number;
  createdAt:          Timestamp;
  updatedAt:          Timestamp;
  publishedAt:        Timestamp | null;
}

// ─── /inquiries/{inquiryId} ──────────────────────────────────────────────────

export interface InquiryDoc {
  id:           string;
  listingId:    string;
  listingType:  ListingType;
  listingTitle: string;      // denormalised (e.g., "2019 Toyota Hilux 2.8 GD-6")
  senderId:     string;
  senderName:   string;      // denormalised
  receiverId:   string;
  message:      string;
  isRead:       boolean;
  replyCount:   number;      // denormalised — synced by onReplyCreate
  createdAt:    Timestamp;
}

// ─── /inquiries/{inquiryId}/replies/{replyId} ────────────────────────────────

export interface ReplyDoc {
  id:         string;
  senderId:   string;
  senderName: string;   // denormalised
  message:    string;
  createdAt:  Timestamp;
}

// ─── /savedListings/{savedId} ────────────────────────────────────────────────

export interface SavedListingDoc {
  id:              string;
  userId:          string;
  listingId:       string;
  listingType:     ListingType;
  listingTitle:    string;        // denormalised
  listingPrice:    number;        // denormalised — ZAR cents
  listingStatus:   ListingStatus; // denormalised — detect when sold/paused
  primaryImageUrl: string | null;
  createdAt:       Timestamp;
}

// ─── /adminFlags/{flagId} ────────────────────────────────────────────────────

export interface AdminFlagDoc {
  id:          string;
  listingId:   string;
  listingType: ListingType;
  flaggedBy:   string | null;   // null = system auto-flag
  reason:      string;
  resolved:    boolean;
  resolvedBy:  string | null;
  resolvedAt:  Timestamp | null;
  createdAt:   Timestamp;
}

// ─── Utility Types ────────────────────────────────────────────────────────────

/**
 * Serialized<T>
 *
 * Strip Firestore Timestamps for safe JSON serialisation.
 * Use this at the Server Component → Client Component boundary.
 */
export type Serialized<T> = {
  [K in keyof T]: T[K] extends Timestamp
    ? string
    : T[K] extends Timestamp | null
      ? string | null
      : T[K];
};

export type SerializedVehicle  = Serialized<VehicleDoc>;
export type SerializedPart     = Serialized<PartDoc>;
export type SerializedUser     = Serialized<UserDoc>;
export type SerializedInquiry  = Serialized<InquiryDoc>;
export type SerializedReply    = Serialized<ReplyDoc>;
export type SerializedSaved    = Serialized<SavedListingDoc>;
