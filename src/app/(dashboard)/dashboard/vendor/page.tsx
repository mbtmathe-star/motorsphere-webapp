'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useMyListings } from '@/hooks/useMyListings';
import OnboardingBanner from '@/components/dashboard/OnboardingBanner';
import PackageCard from '@/components/dashboard/PackageCard';
import MyListingsSection from '@/components/dashboard/MyListingsSection';
import { canSubmitListing } from '@/lib/permissions';

export default function VendorDashboardPage() {
  const { user, profile } = useAuth();
  const { listings, loading, activeCount, pendingCount, draftCount } = useMyListings();
  if (!user) return null;

  const name             = profile?.displayName ?? user.email ?? 'there';
  const canSubmit        = canSubmitListing(profile);
  const listingAllowance = profile?.listingAllowance ?? 3;
  const vendorName       = profile?.vendorName;

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-black text-gray-900">
          {vendorName ?? 'Parts Vendor Hub'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {vendorName
            ? `Manage parts inventory and buyer inquiries for ${vendorName}.`
            : `Welcome, ${name}. Complete your supplier verification to list parts and receive inquiries.`}
        </p>
      </div>

      <OnboardingBanner />

      {/* Status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Parts listed',  value: loading ? '—' : String(activeCount),  href: '/dashboard/listings', color: '#06b351' },
          { label: 'Pending review',value: loading ? '—' : String(pendingCount), href: '/dashboard/listings', color: '#df8a00' },
          { label: 'Drafts',        value: loading ? '—' : String(draftCount),   href: '/dashboard/listings', color: '#64748b' },
        ].map(stat => (
          <Link key={stat.label} href={stat.href}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Inventory management */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-sm font-black text-gray-700 mb-2">Inventory management</h2>
        <p className="text-sm text-gray-500 mb-4">
          Your current plan allows up to <strong>{listingAllowance} parts listings</strong>.
          {!canSubmit && (
            <span className="text-amber-600"> Complete supplier verification to submit parts for review.</span>
          )}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={canSubmit ? '/listings/new' : '/dashboard/verification'}
            className="px-5 py-2.5 rounded-lg text-sm font-black text-white hover:opacity-90 transition-opacity"
            style={{ background: '#0866ff' }}
          >
            {canSubmit ? 'List a part' : 'Complete supplier verification'}
          </Link>
          <Link href="/dashboard/listings"
            className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
            View inventory
          </Link>
        </div>
      </div>

      {/* My listings */}
      <MyListingsSection listings={listings} loading={loading} />

      {/* Vendor note */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-500">
        <p className="font-black text-gray-700 mb-1">Parts vendor on MotorSphere</p>
        Your parts inventory is part of South Africa&rsquo;s complete automotive ecosystem — reaching buyers, mechanics, workshops and dealerships looking for compatible parts. All listings require admin approval before going live. Data handled in accordance with POPIA.
      </div>

      <PackageCard />

    </div>
  );
}
