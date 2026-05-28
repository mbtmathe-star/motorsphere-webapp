/**
 * src/lib/permissions.ts
 *
 * Platform permission helpers for MotorSphere.
 *
 * Core rule:
 *   userRole + accountStatus + onboardingStatus + verificationStatus
 *   + subscriptionStatus + listingStatus + adminApproval = allowed actions
 *
 * These are CLIENT-SIDE helpers for UI gating only.
 * Firebase Security Rules are the ACTUAL enforcement layer — they cannot be bypassed.
 */

import type { AccountType, UserDoc } from '@/types/firestore.types';

// ─── Role classification ──────────────────────────────────────────────────────

/**
 * Returns true for account types that require formal verification
 * before they can publish marketplace listings.
 */
export function requiresVerification(accountType: AccountType | undefined | null): boolean {
  return ['private_seller', 'dealer', 'parts_vendor', 'workshop'].includes(accountType ?? '');
}

/**
 * Returns the canonical dashboard home path for a given account type.
 * Used after registration to direct users to their role home.
 */
export function getRoleDashboardPath(accountType: AccountType | undefined | null): string {
  switch (accountType) {
    case 'buyer':          return '/dashboard/buyer';
    case 'private_seller': return '/dashboard/seller';
    case 'dealer':         return '/dashboard/dealer';
    case 'parts_vendor':   return '/dashboard/vendor';
    case 'workshop':       return '/dashboard/workshop';
    case 'admin_preview':  return '/dashboard/admin';
    default:               return '/dashboard';
  }
}

/**
 * Returns the next recommended onboarding action for a user,
 * or null if onboarding is complete.
 */
export function getNextOnboardingAction(
  profile: UserDoc | null,
): { label: string; href: string } | null {
  if (!profile)                    return null;
  if (profile.onboardingComplete)  return null;

  const vs = profile.verificationStatus ?? 'not_started';

  if (vs === 'submitted' || vs === 'pending_review') {
    // Submitted — nothing more to do yet
    return null;
  }

  if (!requiresVerification(profile.accountType)) {
    return { label: 'Complete your profile', href: '/dashboard/verification' };
  }

  if (vs === 'not_started') {
    return { label: 'Start verification', href: '/dashboard/verification' };
  }

  return { label: 'Continue onboarding', href: '/dashboard/verification' };
}

// ─── Listing permissions ──────────────────────────────────────────────────────

/**
 * Can this user create a draft listing?
 * Requires an active selling account type — no verification required for drafts.
 */
export function canCreateDraftListing(profile: UserDoc | null): boolean {
  if (!profile) return false;
  if ((profile.accountStatus ?? 'active') !== 'active') return false;
  return requiresVerification(profile.accountType);
}

/**
 * Can this user submit a listing for admin review?
 * Requires active account, completed onboarding, and verification submitted.
 */
export function canSubmitListing(profile: UserDoc | null): boolean {
  if (!profile) return false;
  if ((profile.accountStatus ?? 'active') !== 'active') return false;
  if (!canCreateDraftListing(profile)) return false;

  const vs = profile.verificationStatus ?? 'not_started';
  return ['submitted', 'pending_review', 'approved'].includes(vs);
}

/**
 * Can this user's listings go live?
 * Requires full admin-approved verification.
 */
export function canPublishListing(profile: UserDoc | null): boolean {
  if (!profile) return false;
  if ((profile.accountStatus ?? 'active') !== 'active') return false;
  if (!profile.onboardingComplete) return false;

  if (requiresVerification(profile.accountType)) {
    return (profile.verificationStatus ?? 'not_started') === 'approved';
  }

  return true;
}

// ─── Admin permissions ────────────────────────────────────────────────────────

/**
 * Can this user access admin moderation areas?
 */
export function canAccessAdmin(profile: UserDoc | null): boolean {
  if (!profile) return false;
  return (
    ['admin', 'super_admin'].includes(profile.role ?? '') ||
    profile.accountType === 'admin_preview'
  );
}

// ─── Buyer/user permissions ───────────────────────────────────────────────────

/**
 * Can this user contact a seller via inquiry?
 * Requires any authenticated account.
 */
export function canContactSeller(profile: UserDoc | null): boolean {
  return profile !== null;
}

/**
 * Can this user save listings to their saved list?
 * Requires any authenticated account.
 */
export function canSaveListing(profile: UserDoc | null): boolean {
  return profile !== null;
}

// ─── Onboarding banner copy ───────────────────────────────────────────────────

interface BannerConfig {
  title:   string;
  message: string;
  cta:     string;
  href:    string;
}

/**
 * Returns the onboarding banner configuration for a given profile.
 * Returns null if no banner should be shown (onboarding complete or under review).
 */
export function getOnboardingBanner(profile: UserDoc | null): BannerConfig | null {
  if (!profile) return null;

  const vs = profile.verificationStatus ?? 'not_started';

  // Under review — show a different informational state, not a CTA banner
  if (vs === 'submitted' || vs === 'pending_review') {
    return {
      title:   'Verification under review',
      message: 'Your application has been submitted. Our team will review your documents within 1–2 business days.',
      cta:     'View status',
      href:    '/dashboard/verification',
    };
  }

  // Completed
  if (profile.onboardingComplete) return null;

  switch (profile.accountType) {
    case 'buyer':
      return {
        title:   'Complete your profile',
        message: 'Add your location and preferences to get better recommendations and manage inquiries.',
        cta:     'Complete profile',
        href:    '/dashboard/verification',
      };
    case 'private_seller':
      return {
        title:   'Verify your seller account',
        message: 'Complete seller verification before your listings can go live on MotorSphere.',
        cta:     'Start verification',
        href:    '/dashboard/verification',
      };
    case 'dealer':
      return {
        title:   'Complete business verification',
        message: 'Verify your dealership to manage stock, receive buyer leads and display your trusted dealer badge.',
        cta:     'Start verification',
        href:    '/dashboard/verification',
      };
    case 'parts_vendor':
      return {
        title:   'Complete supplier verification',
        message: 'Verify your supplier account to list parts and receive buyer inquiries on MotorSphere.',
        cta:     'Start verification',
        href:    '/dashboard/verification',
      };
    case 'workshop':
      return {
        title:   'Complete your service profile',
        message: 'Verify your workshop to appear in the MotorSphere directory and receive booking requests.',
        cta:     'Start verification',
        href:    '/dashboard/verification',
      };
    default:
      return null;
  }
}
