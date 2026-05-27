'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

type ListingStatus = 'pending' | 'approved' | 'rejected';

type MyListing = {
  id:         string;
  title:      string;
  price:      string;
  status:     ListingStatus;
  views:      number;
  inquiries:  number;
  createdAt:  string;
};

const DEMO_LISTINGS: MyListing[] = [
  {
    id: 'veh-2',
    title: '2020 Volkswagen Polo 1.0 TSI',
    price: 'R 239 900',
    status: 'approved',
    views: 142,
    inquiries: 3,
    createdAt: '12 May 2025',
  },
  {
    id: 'my-listing-2',
    title: '2017 Toyota Corolla 1.6 Prestige',
    price: 'R 189 500',
    status: 'pending',
    views: 0,
    inquiries: 0,
    createdAt: '25 May 2025',
  },
];

const STATUS_STYLES: Record<ListingStatus, { bg: string; text: string; label: string }> = {
  approved: { bg: '#dcfce7', text: '#15803d', label: 'Admin Approved' },
  pending:  { bg: '#fef9c3', text: '#a16207', label: 'Pending Review' },
  rejected: { bg: '#fee2e2', text: '#dc2626', label: 'Rejected' },
};

export default function SellerPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">My Listings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create listings, upload vehicle details and track approval status before your listing goes live.
          </p>
        </div>
        <Link
          href="/listings/new"
          className="px-4 py-2 rounded-lg text-sm font-black text-white hover:opacity-90 transition-opacity"
          style={{ background: '#0866ff' }}
        >
          + Create Listing
        </Link>
      </div>

      {/* Lifecycle explainer */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-xs font-black text-blue-700 mb-1">How it works</p>
        <div className="flex items-center gap-2 text-xs text-blue-600 flex-wrap">
          <span className="font-bold">Submit</span>
          <span>→</span>
          <span className="font-bold">Pending Review</span>
          <span>→</span>
          <span className="font-bold text-green-700">Admin Approved</span>
          <span>→</span>
          <span className="font-bold">Live on Marketplace</span>
        </div>
      </div>

      {/* Listings table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {DEMO_LISTINGS.map((listing, i) => {
          const s = STATUS_STYLES[listing.status];
          return (
            <div
              key={listing.id}
              className={`p-5 flex items-center gap-4 ${i > 0 ? 'border-t border-gray-100' : ''}`}
            >
              <div className="flex-1 min-w-0">
                <div className="font-black text-gray-900 text-sm truncate">{listing.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">Listed {listing.createdAt} · {listing.price}</div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-center hidden sm:block">
                  <div className="text-lg font-black text-gray-900">{listing.views}</div>
                  <div className="text-[10px] text-gray-400">views</div>
                </div>
                <div className="text-center hidden sm:block">
                  <div className="text-lg font-black text-gray-900">{listing.inquiries}</div>
                  <div className="text-[10px] text-gray-400">inquiries</div>
                </div>
                <span
                  className="text-[11px] font-black px-2.5 py-1 rounded-full whitespace-nowrap"
                  style={{ background: s.bg, color: s.text }}
                >
                  {s.label}
                </span>
                <Link
                  href={`/listing/${listing.id}`}
                  className="text-xs font-bold text-[#0866ff] hover:underline whitespace-nowrap"
                >
                  View →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pending callout */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm font-black text-amber-800">⏳ 1 listing pending admin review</p>
        <p className="text-xs text-amber-700 mt-1">
          Listings are reviewed within 24 hours. You will receive an email notification once approved.
        </p>
      </div>

      <div className="flex gap-3">
        <Link
          href="/listings/new"
          className="px-5 py-2.5 rounded-lg text-sm font-black text-white hover:opacity-90 transition-opacity"
          style={{ background: '#0866ff' }}
        >
          Create New Listing
        </Link>
        <Link
          href="/verify"
          className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          Verify Account
        </Link>
      </div>
    </div>
  );
}
