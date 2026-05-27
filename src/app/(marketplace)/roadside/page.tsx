'use client';

import { useState } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/shared/Breadcrumb';

const SERVICES = [
  { icon: '🚗', title: 'Towing',               desc: 'We come to you and tow your vehicle to the nearest service centre.',    phone: '0800 123 456' },
  { icon: '🔋', title: 'Battery Jump Start',    desc: 'Flat battery? Our technicians will jump-start or replace it on-site.', phone: '0800 123 456' },
  { icon: '⛽', title: 'Fuel Delivery',          desc: 'Ran out of fuel? We deliver enough to get you to the nearest garage.', phone: '0800 123 456' },
  { icon: '🔑', title: 'Lockout Assistance',     desc: 'Locked your keys inside? We will get you back in quickly and safely.',phone: '0800 123 456' },
  { icon: '🛞', title: 'Tyre Change',            desc: 'Flat tyre? We will change it with your spare or patch it on-site.',   phone: '0800 123 456' },
  { icon: '🛠️', title: 'Mechanical First Aid',   desc: 'Minor roadside repairs to get you moving again.',                    phone: '0800 123 456' },
];

export default function RoadsidePage() {
  const [requesting, setRequesting] = useState<string | null>(null);
  const [done, setDone]             = useState<string[]>([]);

  const request = async (title: string) => {
    setRequesting(title);
    await new Promise(r => setTimeout(r, 1200));
    setRequesting(null);
    setDone(d => [...d, title]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Emergency Roadside' }]} />

      {/* Emergency banner */}
      <div
        className="rounded-2xl p-6 text-center text-white"
        style={{ background: 'linear-gradient(135deg,#ff003b,#ff6b00)' }}
      >
        <div className="text-4xl mb-2">🆘</div>
        <h1 className="text-2xl font-black">24/7 Emergency Roadside Assistance</h1>
        <p className="text-white/80 mt-1 text-sm">Help is never more than a call away — anywhere in South Africa.</p>
        <a
          href="tel:0800123456"
          className="inline-block mt-4 px-8 py-3 rounded-xl font-black text-sm bg-white hover:bg-gray-100 transition-colors"
          style={{ color: '#ff003b' }}
        >
          📞 Call Now: 0800 123 456
        </a>
        <p className="text-white/50 text-xs mt-2">Free emergency line — 24 hours, 7 days</p>
      </div>

      {/* Services grid */}
      <div>
        <h2 className="text-xl font-black text-gray-900 mb-4">Available Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {SERVICES.map(svc => {
            const isDone = done.includes(svc.title);
            const isLoading = requesting === svc.title;
            return (
              <div key={svc.title} className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
                <div className="text-3xl">{svc.icon}</div>
                <div>
                  <h3 className="font-black text-gray-900">{svc.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{svc.desc}</p>
                </div>
                {isDone ? (
                  <div className="bg-green-50 rounded-lg p-2 text-center">
                    <p className="text-xs font-black text-green-700">✅ Request submitted</p>
                    <p className="text-[11px] text-green-600">A technician will contact you shortly.</p>
                  </div>
                ) : (
                  <button
                    onClick={() => request(svc.title)}
                    disabled={isLoading || requesting !== null}
                    className="w-full py-2 rounded-lg text-xs font-black text-white disabled:opacity-60 hover:opacity-90 transition-opacity"
                    style={{ background: '#ff003b' }}
                  >
                    {isLoading ? 'Requesting…' : `Request ${svc.title}`}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Coverage map placeholder */}
      <div className="bg-gray-100 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-3">🗺️</div>
        <h2 className="text-lg font-black text-gray-700">Nationwide Coverage</h2>
        <p className="text-sm text-gray-500 mt-1">
          Interactive map coming in Base 4. We currently cover all 9 provinces.
        </p>
        <div className="flex justify-center gap-4 flex-wrap mt-4">
          {['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Free State', 'Limpopo', 'North West', 'Mpumalanga', 'Northern Cape'].map(p => (
            <span key={p} className="text-xs font-bold bg-white text-gray-600 px-3 py-1 rounded-full border border-gray-200">{p}</span>
          ))}
        </div>
      </div>

      {/* Register CTA */}
      <div className="bg-gray-900 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white">Are you a towing or roadside provider?</h2>
          <p className="text-sm text-white/60 mt-1">List your service on MotorSphere and reach more customers.</p>
        </div>
        <Link href="/register"
          className="shrink-0 px-6 py-3 rounded-xl text-sm font-black text-white hover:opacity-90 transition-opacity"
          style={{ background: '#0866ff' }}>
          Register as Provider
        </Link>
      </div>
    </div>
  );
}
