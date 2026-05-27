'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { allListings } from '@/data/home-data';

type DemoUser = { email: string; role: string; name: string };

export default function VendorPage() {
  const [user, setUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('ms_demo_user');
    if (stored) {
      try { setUser(JSON.parse(stored) as DemoUser); } catch { /* ignore */ }
    }
  }, []);

  const parts = allListings.filter(l => l.type === 'parts' || l.type === 'spares' || l.type === 'tyres');

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Parts Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your parts listings, compatibility and quote requests.
          </p>
        </div>
        <Link
          href="/listings/new"
          className="px-4 py-2 rounded-lg text-sm font-black text-white hover:opacity-90 transition-opacity"
          style={{ background: '#0866ff' }}
        >
          + Add Part
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Parts Listed',   value: '28', color: '#06b351' },
          { label: 'Low Stock',      value: '3',  color: '#ff3d0a' },
          { label: 'Quote Requests', value: '4',  color: '#0866ff' },
          { label: 'Sales This Mo.', value: '11', color: '#df8a00' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Parts list */}
      <div>
        <h2 className="text-sm font-black text-gray-700 mb-3">Current Inventory</h2>
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {parts.map((part, i) => (
            <Link
              key={part.id}
              href={`/listing/${part.id}`}
              className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${i > 0 ? 'border-t border-gray-100' : ''}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={part.image} alt={part.title} className="w-14 h-14 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-gray-900 truncate">{part.title}</p>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {part.meta.map(m => (
                    <span key={m} className="text-[10px] font-bold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">{m}</span>
                  ))}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-black" style={{ color: '#0866ff' }}>{part.priceDisplay}</p>
                <p className="text-[11px] text-gray-500">{part.location}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quote requests */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-sm font-black text-gray-700 mb-3">Quote Requests</h2>
        {[
          { name: 'Sipho N.', part: 'Toyota Hilux Front Bumper', qty: 1, time: '1h ago' },
          { name: 'Fatima D.', part: 'Brake Pads Set',           qty: 2, time: '3h ago' },
          { name: 'Craig B.', part: 'VW Polo Engine Cover',      qty: 1, time: '1d ago' },
          { name: 'Nandi M.', part: 'Michelin Pilot Sport 4',    qty: 4, time: '2d ago' },
        ].map((req, i) => (
          <div key={i} className={`flex items-center gap-3 py-2 ${i > 0 ? 'border-t border-gray-100' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs font-black">
              {req.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800">{req.name}</p>
              <p className="text-xs text-gray-500 truncate">{req.part} × {req.qty}</p>
            </div>
            <span className="text-[10px] text-gray-400">{req.time}</span>
          </div>
        ))}
        <Link href="/inquiries" className="mt-3 block text-xs font-bold text-[#0866ff] hover:underline">
          View all requests →
        </Link>
      </div>
    </div>
  );
}
