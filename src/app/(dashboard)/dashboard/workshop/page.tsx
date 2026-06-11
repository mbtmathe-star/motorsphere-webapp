'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useMyListings } from '@/hooks/useMyListings';
import OnboardingBanner from '@/components/dashboard/OnboardingBanner';
import PackageCard from '@/components/dashboard/PackageCard';
import MyListingsSection from '@/components/dashboard/MyListingsSection';
import { canSubmitListing } from '@/lib/permissions';

export default function WorkshopDashboardPage() {
  const { user, profile } = useAuth();
  const { listings, loading, activeCount, pendingCount } = useMyListings();
  if (!user) return null;

  const name         = profile?.displayName ?? user.email ?? 'there';
  const tradingName  = profile?.tradingName;
  const rmiStatus    = profile?.rmiRegistered;
  const isVerified   = profile?.verificationStatus === 'approved';
  const canSubmit    = canSubmitListing(profile);

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        <div className="flex-1">
          <h1 className="text-2xl font-black text-gray-900">
            {tradingName ?? 'Workshop Dashboard'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {tradingName
              ? `Manage services, bookings and your workshop profile for ${tradingName}.`
              : `Welcome, ${name}. Complete your workshop profile to appear in the MotorSphere directory.`}
          </p>
        </div>
        {rmiStatus !== undefined && (
          <span className="text-xs font-black px-3 py-1 rounded-full shrink-0"
            style={rmiStatus
              ? { background: '#dcfce7', color: '#15803d' }
              : { background: '#f1f5f9', color: '#64748b' }}>
            {rmiStatus ? 'RMI Registered' : 'Non-RMI Workshop'}
          </span>
        )}
      </div>

      <OnboardingBanner />

      {/* Status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Services listed',  value: loading ? '—' : String(activeCount),  href: '/dashboard/listings', color: '#06b351' },
          { label: 'Pending review',   value: loading ? '—' : String(pendingCount), href: '/dashboard/listings', color: '#df8a00' },
          { label: 'Booking requests', value: '—', href: '/inquiries',              color: '#0866ff' },
        ].map(stat => (
          <Link key={stat.label} href={stat.href}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="text-2xl font-black truncate" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Services CTA */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-sm font-black text-gray-700 mb-2">Workshop directory</h2>
        <p className="text-sm text-gray-500 mb-4">
          {isVerified
            ? 'Your workshop is verified and appears in the MotorSphere directory.'
            : 'Complete verification to appear in the MotorSphere workshop directory and receive booking requests.'}
        </p>
        <div className="flex flex-wrap gap-3">
          {canSubmit ? (
            <Link
              href="/listings/new"
              className="px-5 py-2.5 rounded-lg text-sm font-black text-white hover:opacity-90 transition-opacity"
              style={{ background: '#0866ff' }}
            >
              Add service
            </Link>
          ) : (
            <Link
              href="/dashboard/verification"
              className="px-5 py-2.5 rounded-lg text-sm font-black text-white hover:opacity-90 transition-opacity"
              style={{ background: '#0866ff' }}
            >
              Complete verification
            </Link>
          )}
          <Link href="/dashboard/listings"
            className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
            View services
          </Link>
          <Link href="/inquiries"
            className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
            View bookings
          </Link>
        </div>
      </div>

      {/* My listings */}
      {(listings.length > 0 || loading) && (
        <MyListingsSection listings={listings} loading={loading} />
      )}

      {/* Workshop note */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-500">
        <p className="font-black text-gray-700 mb-1">Workshop on MotorSphere</p>
        Your workshop profile is part of South Africa&rsquo;s complete automotive ecosystem — connecting you with vehicle owners, buyers, dealers and parts seekers who need trusted service providers. All service listings require admin approval. Data handled in accordance with POPIA.
      </div>

      <PackageCard />

    </div>
  );
}
