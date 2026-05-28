'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import OnboardingBanner from '@/components/dashboard/OnboardingBanner';
import PackageCard from '@/components/dashboard/PackageCard';
import { canSubmitListing } from '@/lib/permissions';

function VerificationStatusBadge({ status }: { status: string | undefined }) {
  const config: Record<string, { label: string; bg: string; text: string }> = {
    not_started:    { label: 'Verification required',  bg: '#fef2f2', text: '#dc2626' },
    submitted:      { label: 'Under review',            bg: '#fef9c3', text: '#a16207' },
    pending_review: { label: 'Pending review',          bg: '#fef9c3', text: '#a16207' },
    approved:       { label: 'Verified seller ✓',       bg: '#dcfce7', text: '#15803d' },
    rejected:       { label: 'Verification rejected',   bg: '#fef2f2', text: '#dc2626' },
  };
  const c = config[status ?? 'not_started'] ?? config.not_started;
  return (
    <span
      className="text-xs font-black px-3 py-1 rounded-full"
      style={{ background: c.bg, color: c.text }}
    >
      {c.label}
    </span>
  );
}

export default function SellerDashboardPage() {
  const { user, profile } = useAuth();
  if (!user) return null;

  const name       = profile?.displayName ?? user.email ?? 'there';
  const canSubmit  = canSubmitListing(profile);
  const listingAllowance = profile?.listingAllowance ?? 3;

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        <div className="flex-1">
          <h1 className="text-2xl font-black text-gray-900">Seller Hub</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your listings, track inquiries and monitor your seller account status.
          </p>
        </div>
        <VerificationStatusBadge status={profile?.verificationStatus} />
      </div>

      <OnboardingBanner />

      {/* Status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Active Listings',    value: '—', href: '/seller',    color: '#06b351' },
          { label: 'Pending Approval',   value: '—', href: '/seller',    color: '#df8a00' },
          { label: 'Inquiries Received', value: '—', href: '/inquiries', color: '#0866ff' },
        ].map(stat => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
          >
            <div className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Listing allowance info */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-sm font-black text-gray-700 mb-3">Listing allowance</h2>
        <p className="text-sm text-gray-500">
          Your current plan allows up to <strong>{listingAllowance} listings</strong>.
          {!canSubmit && (
            <span className="text-amber-600"> Complete verification to submit listings for admin review.</span>
          )}
        </p>
        <div className="flex flex-wrap gap-3 mt-4">
          {canSubmit ? (
            <Link
              href="/listings/new"
              className="px-5 py-2.5 rounded-lg text-sm font-black text-white hover:opacity-90 transition-opacity"
              style={{ background: '#0866ff' }}
            >
              Create Listing
            </Link>
          ) : (
            <Link
              href="/dashboard/verification"
              className="px-5 py-2.5 rounded-lg text-sm font-black text-white hover:opacity-90 transition-opacity"
              style={{ background: '#0866ff' }}
            >
              Complete Verification
            </Link>
          )}
          <Link
            href="/seller"
            className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            View My Listings
          </Link>
        </div>
      </div>

      {/* Seller accountability note */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-500">
        <p className="font-black text-gray-700 mb-1">Seller accountability</p>
        Listings require admin approval before going live. MotorSphere verifies sellers to protect buyers and maintain marketplace trust. All data handled in accordance with POPIA.
      </div>

      <PackageCard />

    </div>
  );
}
