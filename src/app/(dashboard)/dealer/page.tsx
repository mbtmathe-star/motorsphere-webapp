'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { allListings } from '@/data/home-data';

export default function DealerPage() {
  const { user } = useAuth();

  if (!user) return null;

  const stock = allListings.filter(l => l.type === 'vehicles' || l.type === 'trucks-buses');

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Stock Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your dealership stock, leads and verification status.
          </p>
        </div>
        <Link
          href="/listings/new"
          className="px-4 py-2 rounded-lg text-sm font-black text-white hover:opacity-90 transition-opacity"
          style={{ background: '#0866ff' }}
        >
          + Add Stock
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'In Stock',   value: '12', color: '#06b351' },
          { label: 'Pending',    value: '2',  color: '#df8a00' },
          { label: 'Sold',       value: '8',  color: '#687589' },
          { label: 'Active Leads',value: '5', color: '#0866ff' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Dealer badge */}
      <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-purple-700 font-black text-lg"
          style={{ background: '#f3e8ff' }}>🏆</div>
        <div>
          <p className="text-sm font-black text-purple-800">Dealer Verified</p>
          <p className="text-xs text-purple-600">Your dealership profile is verified and visible to buyers.</p>
        </div>
      </div>

      {/* Stock list */}
      <div>
        <h2 className="text-sm font-black text-gray-700 mb-3">Current Stock ({stock.length} vehicles)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stock.map(listing => (
            <Link
              key={listing.id}
              href={`/listing/${listing.id}`}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={listing.image} alt={listing.title} className="w-24 h-24 object-cover shrink-0" />
              <div className="p-3 min-w-0">
                <p className="text-xs font-black text-gray-900 leading-tight truncate">{listing.title}</p>
                <p className="text-[13px] font-black mt-1" style={{ color: '#0866ff' }}>{listing.priceDisplay}</p>
                <p className="text-[11px] text-gray-500">{listing.location}</p>
                <div className="flex gap-1 mt-1">
                  {listing.meta.slice(0, 2).map(m => (
                    <span key={m} className="text-[10px] font-bold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">{m}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Leads summary */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-sm font-black text-gray-700 mb-3">Recent Leads</h2>
        {[
          { name: 'John M.', listing: '2021 Toyota Hilux',         time: '2h ago',  status: 'New' },
          { name: 'Sarah K.', listing: '2019 Ford Ranger',         time: '5h ago',  status: 'Replied' },
          { name: 'David L.', listing: '2022 Toyota Fortuner',     time: '1d ago',  status: 'New' },
          { name: 'Priya S.', listing: '2017 BMW 3 Series',        time: '2d ago',  status: 'Closed' },
          { name: 'Andre T.', listing: '2020 Volkswagen Polo',     time: '3d ago',  status: 'Replied' },
        ].map((lead, i) => (
          <div key={i} className={`flex items-center gap-3 py-2 ${i > 0 ? 'border-t border-gray-100' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-black">
              {lead.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800">{lead.name}</p>
              <p className="text-xs text-gray-500 truncate">Inquired about {lead.listing}</p>
            </div>
            <div className="text-right shrink-0">
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                lead.status === 'New'    ? 'bg-blue-100 text-blue-700' :
                lead.status === 'Replied'? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-500'
              }`}>{lead.status}</span>
              <p className="text-[10px] text-gray-400 mt-0.5">{lead.time}</p>
            </div>
          </div>
        ))}
        <Link href="/inquiries" className="mt-3 block text-xs font-bold text-[#0866ff] hover:underline">
          View all leads →
        </Link>
      </div>
    </div>
  );
}
