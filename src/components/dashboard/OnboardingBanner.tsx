'use client';

/**
 * src/components/dashboard/OnboardingBanner.tsx
 *
 * Shows a role-aware onboarding prompt if the user has not completed
 * onboarding, or a "under review" notice if verification was submitted.
 * Returns null if onboarding is complete.
 */

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getOnboardingBanner } from '@/lib/permissions';

export default function OnboardingBanner() {
  const { profile } = useAuth();
  const banner      = getOnboardingBanner(profile);

  if (!banner) return null;

  const vs = profile?.verificationStatus ?? 'not_started';
  const isUnderReview = vs === 'submitted' || vs === 'pending_review';

  return (
    <div
      className={`rounded-xl border px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 ${
        isUnderReview
          ? 'bg-amber-50 border-amber-200'
          : 'bg-blue-50 border-blue-200'
      }`}
    >
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-black ${isUnderReview ? 'text-amber-800' : 'text-blue-800'}`}>
          {isUnderReview ? '⏳' : '📋'} {banner.title}
        </p>
        <p className={`text-xs mt-0.5 ${isUnderReview ? 'text-amber-700' : 'text-blue-700'}`}>
          {banner.message}
        </p>
      </div>
      <Link
        href={banner.href}
        className={`shrink-0 text-xs font-black px-4 py-2 rounded-lg transition-colors ${
          isUnderReview
            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {banner.cta} →
      </Link>
    </div>
  );
}
