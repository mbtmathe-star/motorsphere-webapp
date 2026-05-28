'use client';

/**
 * src/components/dashboard/PackageCard.tsx
 *
 * Displays the user's current subscription package and listing allowances.
 * Packages are deferred (Base 8/9) — shows awareness UI with CTA to enquire.
 */

import { useAuth } from '@/hooks/useAuth';

export default function PackageCard() {
  const { profile } = useAuth();

  const packageName             = profile?.packageName              ?? 'Free';
  const subscriptionStatus      = profile?.subscriptionStatus       ?? 'free';
  const listingAllowance        = profile?.listingAllowance         ?? 3;
  const featuredListingAllowance= profile?.featuredListingAllowance ?? 0;

  const isFree = subscriptionStatus === 'free';

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-sm font-black text-gray-900">Current Plan</h3>
          <p className="text-xs text-gray-500 mt-0.5">Listing allowances and features</p>
        </div>
        <span
          className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full"
          style={
            isFree
              ? { background: '#f1f5f9', color: '#64748b' }
              : { background: '#dcfce7', color: '#15803d' }
          }
        >
          {packageName}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xl font-black text-gray-900">{listingAllowance}</div>
          <div className="text-xs text-gray-500 mt-0.5">Listing allowance</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xl font-black text-gray-900">{featuredListingAllowance}</div>
          <div className="text-xs text-gray-500 mt-0.5">Featured slots</div>
        </div>
      </div>

      {isFree && (
        <div className="border-t border-gray-100 pt-4 space-y-2">
          <p className="text-xs text-gray-500">
            Packages coming soon. Speak to MotorSphere about listing plans tailored to your business.
          </p>
          <a
            href="mailto:listings@motorsphere.co.za?subject=Package%20enquiry"
            className="inline-flex items-center text-xs font-black text-[#0866ff] hover:underline"
          >
            Request package details →
          </a>
        </div>
      )}
    </div>
  );
}
