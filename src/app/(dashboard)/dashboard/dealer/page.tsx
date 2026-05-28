'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import OnboardingBanner from '@/components/dashboard/OnboardingBanner';
import PackageCard from '@/components/dashboard/PackageCard';
import { canSubmitListing } from '@/lib/permissions';

export default function DealerDashboardPage() {
  const { user, profile } = useAuth();
  if (!user) return null;

  const name             = profile?.displayName ?? user.email ?? 'there';
  const canSubmit        = canSubmitListing(profile);
  const listingAllowance = profile?.listingAllowance ?? 3;
  const dealershipName   = profile?.dealershipName;

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-black text-gray-900">
          {dealershipName ?? 'Dealer Dashboard'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {dealershipName
            ? `Manage stock, leads and business information for ${dealershipName}.`
            : `Welcome, ${name}. Complete your dealership verification to manage stock and leads.`}
        </p>
      </div>

      <OnboardingBanner />

      {/* Status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Vehicles in Stock', value: '—', href: '/dealer',    color: '#06b351' },
          { label: 'Active Leads',      value: '—', href: '/inquiries', color: '#0866ff' },
          { label: 'Pending Review',    value: '—', href: '/dealer',    color: '#df8a00' },
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

      {/* Stock management */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-sm font-black text-gray-700 mb-2">Stock Management</h2>
        <p className="text-sm text-gray-500 mb-4">
          Your current plan allows up to <strong>{listingAllowance} vehicles</strong> in stock.
          {!canSubmit && (
            <span className="text-amber-600"> Dealership verification is required before stock can be submitted for review.</span>
          )}
        </p>
        <div className="flex flex-wrap gap-3">
          {canSubmit ? (
            <Link
              href="/listings/new"
              className="px-5 py-2.5 rounded-lg text-sm font-black text-white hover:opacity-90 transition-opacity"
              style={{ background: '#0866ff' }}
            >
              Add Vehicle to Stock
            </Link>
          ) : (
            <Link
              href="/dashboard/verification"
              className="px-5 py-2.5 rounded-lg text-sm font-black text-white hover:opacity-90 transition-opacity"
              style={{ background: '#0866ff' }}
            >
              Complete Dealership Verification
            </Link>
          )}
          <Link
            href="/dealer"
            className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            View Stock
          </Link>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-500">
        <p className="font-black text-gray-700 mb-1">Dealer accountability</p>
        All stock requires admin approval. MotorSphere verifies registered dealers to protect buyers and maintain marketplace integrity.
      </div>

      <PackageCard />

    </div>
  );
}
