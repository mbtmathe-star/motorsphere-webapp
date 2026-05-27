'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { allListings } from '@/data/home-data';

type DemoUser = { email: string; role: string; name: string };

const SAVED_IDS = ['veh-1', 'veh-2', 'part-1'];

export default function BuyerPage() {
  const [user, setUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('ms_demo_user');
    if (stored) {
      try { setUser(JSON.parse(stored) as DemoUser); } catch { /* ignore */ }
    }
  }, []);

  const savedListings = allListings.filter(l => SAVED_IDS.includes(l.id));

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Your Saved Listings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Listings you have saved. Click a listing to view full details.
        </p>
      </div>

      {savedListings.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <div className="text-3xl mb-2">🔖</div>
          <p className="font-bold text-gray-700">No saved listings yet</p>
          <p className="text-sm text-gray-500 mt-1">Browse the marketplace and save listings you are interested in.</p>
          <Link
            href="/category/vehicles"
            className="inline-block mt-4 px-5 py-2.5 rounded-lg text-sm font-black text-white"
            style={{ background: '#0866ff' }}
          >
            Browse Vehicles
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {savedListings.map(listing => (
            <Link
              key={listing.id}
              href={`/listing/${listing.id}`}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={listing.image}
                alt={listing.title}
                className="w-28 h-28 object-cover shrink-0"
              />
              <div className="p-4 min-w-0">
                <p className="text-sm font-black text-gray-900 truncate">{listing.title}</p>
                <p className="text-[13px] font-black mt-1" style={{ color: '#0866ff' }}>{listing.priceDisplay}</p>
                <p className="text-xs text-gray-500 mt-1">{listing.location}</p>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {listing.meta.slice(0, 2).map(m => (
                    <span key={m} className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{m}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <Link
          href="/category/vehicles"
          className="px-5 py-2.5 rounded-lg text-sm font-black text-white hover:opacity-90 transition-opacity"
          style={{ background: '#0866ff' }}
        >
          Browse More Vehicles
        </Link>
        <Link
          href="/inquiries"
          className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          My Inquiries
        </Link>
      </div>
    </div>
  );
}
