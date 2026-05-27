'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { allListings, type Listing } from '@/data/home-data';

const INITIAL_SAVED = ['veh-1', 'veh-2', 'part-1'];

export default function SavedPage() {
  const [savedIds, setSavedIds] = useState<string[]>(INITIAL_SAVED);

  useEffect(() => {
    const stored = localStorage.getItem('ms_saved_listings');
    if (stored) {
      try { setSavedIds(JSON.parse(stored) as string[]); } catch { /* ignore */ }
    }
  }, []);

  const remove = (id: string) => {
    const next = savedIds.filter(s => s !== id);
    setSavedIds(next);
    localStorage.setItem('ms_saved_listings', JSON.stringify(next));
  };

  const saved: Listing[] = allListings.filter(l => savedIds.includes(l.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Saved Listings</h1>
        <p className="text-sm text-gray-500 mt-1">
          {saved.length} listing{saved.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {saved.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
          <div className="text-4xl mb-3">🔖</div>
          <p className="font-black text-gray-700">No saved listings</p>
          <p className="text-sm text-gray-500 mt-1">
            Browse the marketplace and tap the save button on any listing.
          </p>
          <Link
            href="/category/vehicles"
            className="inline-block mt-5 px-5 py-2.5 rounded-lg text-sm font-black text-white hover:opacity-90 transition-opacity"
            style={{ background: '#0866ff' }}
          >
            Browse Vehicles
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {saved.map(listing => (
            <div key={listing.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden flex">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={listing.image} alt={listing.title} className="w-28 h-28 object-cover shrink-0" />
              <div className="p-4 flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <p className="text-sm font-black text-gray-900 leading-tight truncate">{listing.title}</p>
                  <p className="text-[13px] font-black mt-1" style={{ color: '#0866ff' }}>{listing.priceDisplay}</p>
                  <p className="text-xs text-gray-500">{listing.location}</p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Link
                    href={`/listing/${listing.id}`}
                    className="text-xs font-black text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                    style={{ background: '#0866ff' }}
                  >
                    View
                  </Link>
                  <button
                    onClick={() => remove(listing.id)}
                    className="text-xs font-bold text-gray-400 hover:text-red-500 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-red-200 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link
        href="/category/vehicles"
        className="inline-block text-sm font-bold text-[#0866ff] hover:underline"
      >
        ← Browse more listings
      </Link>
    </div>
  );
}
