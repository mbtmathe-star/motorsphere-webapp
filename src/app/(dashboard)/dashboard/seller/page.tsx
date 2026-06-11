'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useMyListings } from '@/hooks/useMyListings';
import OnboardingBanner from '@/components/dashboard/OnboardingBanner';
import PackageCard from '@/components/dashboard/PackageCard';
import MyListingsSection from '@/components/dashboard/MyListingsSection';
import { canSubmitListing } from '@/lib/permissions';

function VerificationStatusBadge({ status }: { status: string | undefined }) {
  const config: Record<string, { label: string; bg: string; text: string }> = {
    not_started:    { label: 'Verification required', bg: '#fef2f2', text: '#dc2626' },
    submitted:      { label: 'Under review',           bg: '#fef9c3', text: '#a16207' },
    pending_review: { label: 'Pending review',         bg: '#fef9c3', text: '#a16207' },
    approved:       { label: 'Verified seller ✓',      bg: '#dcfce7', text: '#15803d' },
    rejected:       { label: 'Verification rejected',  bg: '#fef2f2', text: '#dc2626' },
    not_required:   { label: 'No verification needed', bg: '#f1f5f9', text: '#64748b' },
  };
  const c = config[status ?? 'not_started'] ?? config.not_started;
  return (
    <span className="text-xs font-black px-3 py-1 rounded-full shrink-0"
      style={{ background: c.bg, color: c.text }}>
      {c.label}
    </span>
  );
}

export default function SellerDashboardPage() {
  const { user, profile }   = useAuth();
  const { listings, loading, pendingCount, activeCount } = useMyListings();
  if (!user) return null;

  const canSubmit        = canSubmitListing(profile);
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
          { label: 'Active listings',   value: loading ? '—' : String(activeCount),  href: '/dashboard/listings', color: '#06b351' },
          { label: 'Pending approval',  value: loading ? '—' : String(pendingCount), href: '/dashboard/listings', color: '#df8a00' },
          { label: 'Inquiries received',value: '—', href: '/inquiries',              color: '#0866ff' },
        ].map(stat => (
          <Link key={stat.label} href={stat.href}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Listing allowance */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-sm font-black text-gray-700 mb-2">Listing allowance</h2>
        <p className="text-sm text-gray-500 mb-4">
          Your current plan allows up to <strong>{listingAllowance} listings</strong>.{' '}
          {!canSubmit && (
            <span className="text-amber-600">Complete verification to submit listings for review.</span>
          )}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={canSubmit ? '/listings/new' : '/dashboard/verification'}
            className="px-5 py-2.5 rounded-lg text-sm font-black text-white hover:opacity-90 transition-opacity"
            style={{ background: '#0866ff' }}
          >
            {canSubmit ? 'Create listing' : 'Complete verification'}
          </Link>
          <Link href="/dashboard/listings"
            className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
            View my listings
          </Link>
        </div>
      </div>

      {/* My listings */}
      <MyListingsSection listings={listings} loading={loading} />

      {/* Seller accountability */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-500">
        <p className="font-black text-gray-700 mb-1">Seller accountability</p>
        Listings require admin approval before going live. MotorSphere verifies sellers to protect buyers and maintain ecosystem trust. You are part of South Africa&rsquo;s complete automotive ecosystem — buyers, dealers, parts vendors and service providers, all on one platform. All data handled in accordance with POPIA.
      </div>

      <PackageCard />

    </div>
  );
}
