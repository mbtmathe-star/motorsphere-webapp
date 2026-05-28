'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import OnboardingBanner from '@/components/dashboard/OnboardingBanner';
import PackageCard from '@/components/dashboard/PackageCard';
import { canSubmitListing } from '@/lib/permissions';

export default function VendorDashboardPage() {
  const { user, profile } = useAuth();
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
          { label: 'Parts Listed',   value: '—', href: '/vendor',    color: '#06b351' },
          { label: 'Quote Requests', value: '—', href: '/inquiries', color: '#0866ff' },
          { label: 'Pending Review', value: '—', href: '/vendor',    color: '#df8a00' },
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

      {/* Inventory management */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-sm font-black text-gray-700 mb-2">Inventory Management</h2>
        <p className="text-sm text-gray-500 mb-4">
          Your current plan allows up to <strong>{listingAllowance} parts listings</strong>.
          {!canSubmit && (
            <span className="text-amber-600"> Complete supplier verification to submit parts for review.</span>
          )}
        </p>
        <div className="flex flex-wrap gap-3">
          {canSubmit ? (
            <Link
              href="/listings/new"
              className="px-5 py-2.5 rounded-lg text-sm font-black text-white hover:opacity-90 transition-opacity"
              style={{ background: '#0866ff' }}
            >
              List a Part
            </Link>
          ) : (
            <Link
              href="/dashboard/verification"
              className="px-5 py-2.5 rounded-lg text-sm font-black text-white hover:opacity-90 transition-opacity"
              style={{ background: '#0866ff' }}
            >
              Complete Supplier Verification
            </Link>
          )}
          <Link
            href="/vendor"
            className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            View Inventory
          </Link>
        </div>
      </div>

      <PackageCard />

    </div>
  );
}
