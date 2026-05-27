'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type DemoUser = { email: string; role: string; name: string };

type Service = {
  name: string;
  price: string;
  duration: string;
  available: boolean;
};

const SERVICES: Service[] = [
  { name: 'Full Service',        price: 'From R 1 250', duration: '3–4 hrs',  available: true  },
  { name: 'Diagnostics',         price: 'From R 450',  duration: '1 hr',     available: true  },
  { name: 'Brake Replacement',   price: 'From R 800',  duration: '2 hrs',    available: true  },
  { name: 'Suspension Check',    price: 'From R 350',  duration: '1 hr',     available: true  },
  { name: 'Accident Repairs',    price: 'Quote only',  duration: 'TBD',      available: true  },
  { name: 'Performance Tune',    price: 'From R 2 000',duration: '4–6 hrs',  available: false },
];

export default function WorkshopPage() {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [rmiApplied, setRmiApplied] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('ms_demo_user');
    if (stored) {
      try { setUser(JSON.parse(stored) as DemoUser); } catch { /* ignore */ }
    }
  }, []);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Workshop Services</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your services, pricing and booking availability.
          </p>
        </div>
        <Link
          href="/listings/new"
          className="px-4 py-2 rounded-lg text-sm font-black text-white hover:opacity-90 transition-opacity"
          style={{ background: '#0866ff' }}
        >
          + Add Service
        </Link>
      </div>

      {/* RMI badge status */}
      {rmiApplied ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <span className="text-xl">⏳</span>
          <div>
            <p className="text-sm font-black text-amber-800">RMI Application Submitted</p>
            <p className="text-xs text-amber-700 mt-1">
              Your RMI badge application is under review. Typical processing takes 3–5 business days.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">🏅</span>
            <div>
              <p className="text-sm font-black text-purple-800">Apply for RMI Badge</p>
              <p className="text-xs text-purple-600 mt-1">
                RMI-listed workshops get more visibility, trust badges and priority placement.
              </p>
            </div>
          </div>
          <button
            onClick={() => setRmiApplied(true)}
            className="shrink-0 px-4 py-2 rounded-lg text-xs font-black text-white hover:opacity-90 transition-opacity"
            style={{ background: '#4a35f5' }}
          >
            Apply Now
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Services Listed',  value: '6', color: '#06b351' },
          { label: 'Bookings Today',   value: '2', color: '#0866ff' },
          { label: 'This Week',        value: '9', color: '#df8a00' },
          { label: 'Rating',           value: '4.8', color: '#4a35f5' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Services table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h2 className="text-sm font-black text-gray-700">Service Catalogue</h2>
        </div>
        {SERVICES.map((svc, i) => (
          <div key={svc.name} className={`flex items-center gap-4 px-5 py-3 ${i > 0 ? 'border-t border-gray-100' : ''}`}>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900">{svc.name}</p>
              <p className="text-xs text-gray-500">{svc.duration}</p>
            </div>
            <div className="text-sm font-black text-gray-700 shrink-0">{svc.price}</div>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
              svc.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}>
              {svc.available ? 'Available' : 'Unavailable'}
            </span>
          </div>
        ))}
      </div>

      {/* Booking requests */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-sm font-black text-gray-700 mb-3">Recent Booking Requests</h2>
        {[
          { name: 'Thabo M.',  service: 'Full Service',      date: 'Tomorrow 09:00',      status: 'Confirmed' },
          { name: 'Liezel V.', service: 'Diagnostics',       date: '30 May 14:00',        status: 'Pending' },
          { name: 'Ravi P.',   service: 'Brake Replacement', date: '1 June 10:00',        status: 'Pending' },
        ].map((req, i) => (
          <div key={i} className={`flex items-center gap-3 py-2 ${i > 0 ? 'border-t border-gray-100' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-xs font-black">
              {req.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800">{req.name}</p>
              <p className="text-xs text-gray-500">{req.service} · {req.date}</p>
            </div>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
              req.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>{req.status}</span>
          </div>
        ))}
        <Link href="/inquiries" className="mt-3 block text-xs font-bold text-[#0866ff] hover:underline">
          View all bookings →
        </Link>
      </div>
    </div>
  );
}
