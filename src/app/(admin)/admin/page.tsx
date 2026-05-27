'use client';

import { useState } from 'react';
import Link from 'next/link';
import { allListings } from '@/data/home-data';

type ApprovalState = 'pending' | 'approved' | 'rejected';

type PendingListing = {
  id: string;
  title: string;
  type: string;
  seller: string;
  price: string;
  location: string;
  submittedAt: string;
  state: ApprovalState;
  image: string;
};

const INITIAL_PENDING: PendingListing[] = [
  { id: 'p-1', title: '2019 Ford Ranger 2.2 XLS',        type: 'vehicles',    seller: 'private@email.com', price: 'R 349 500', location: 'Durban',         submittedAt: '27 May 2025', state: 'pending', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=80' },
  { id: 'p-2', title: 'Toyota Hilux Front Bumper',        type: 'parts',       seller: 'parts@shop.co.za',  price: 'R 3 250',   location: 'Pretoria',       submittedAt: '26 May 2025', state: 'pending', image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80' },
  { id: 'p-3', title: '2022 Toyota Fortuner 2.8 GD-6',   type: 'vehicles',    seller: 'dealer@cars.com',   price: 'R 699 900', location: 'Pretoria',       submittedAt: '26 May 2025', state: 'pending', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80' },
  { id: 'p-4', title: 'RMI Workshop — Service Centre',    type: 'rmi-workshops',seller: 'workshop@rmi.org', price: 'From R 950',location: 'Bloemfontein',   submittedAt: '25 May 2025', state: 'pending', image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=400&q=80' },
  { id: 'p-5', title: 'Michelin Pilot Sport 4 — Set of 4',type: 'tyres',       seller: 'tyres@fitment.co.za',price:'R 12 800', location: 'Cape Town',      submittedAt: '25 May 2025', state: 'pending', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80' },
  { id: 'p-6', title: '2017 BMW 3 Series 320i',           type: 'vehicles',    seller: 'bmw@private.co.za', price: 'R 289 900', location: 'Cape Town',      submittedAt: '24 May 2025', state: 'pending', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=80' },
  { id: 'p-7', title: '24/7 Towing & Recovery',          type: 'towing',      seller: 'tow@fasttow.co.za', price: 'From R 650',location: 'Nationwide',     submittedAt: '24 May 2025', state: 'pending', image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=400&q=80' },
];

type FlaggedItem = {
  id: string;
  listingTitle: string;
  reason: string;
  reportedBy: string;
  at: string;
  resolved: boolean;
};

const FLAGS: FlaggedItem[] = [
  { id: 'f-1', listingTitle: '2018 Isuzu NPR 400 Truck',           reason: 'Suspected stolen vehicle',  reportedBy: 'user@example.com',    at: '26 May', resolved: false },
  { id: 'f-2', listingTitle: 'Brake Pads Set — Multiple Models',   reason: 'Counterfeit parts suspected',reportedBy: 'buyer2@example.com',  at: '25 May', resolved: false },
  { id: 'f-3', listingTitle: 'AutoNation KZN — Certified Dealer',  reason: 'Misleading finance terms',   reportedBy: 'user3@example.com',   at: '23 May', resolved: true  },
];

type VerifReq = {
  id: string;
  name: string;
  role: string;
  docs: number;
  submittedAt: string;
  done: boolean;
};

const VERIF_REQUESTS: VerifReq[] = [
  { id: 'v-1', name: 'Cape Autos Dealer',  role: 'dealer',   docs: 4, submittedAt: '26 May', done: false },
  { id: 'v-2', name: 'Nandi M.',           role: 'seller',   docs: 2, submittedAt: '25 May', done: false },
  { id: 'v-3', name: 'AccuFix Workshop',   role: 'workshop', docs: 3, submittedAt: '24 May', done: false },
];

type AuditEntry = {
  action: string;
  target: string;
  by: string;
  at: string;
};

const AUDIT_LOG: AuditEntry[] = [
  { action: 'Approved',        target: 'veh-1 — Toyota Hilux',         by: 'admin@motorsphere.co.za', at: '27 May 10:14' },
  { action: 'Rejected',        target: 'veh-old — 2005 Honda',          by: 'admin@motorsphere.co.za', at: '26 May 16:02' },
  { action: 'Verified seller', target: 'Thabo M.',                      by: 'admin@motorsphere.co.za', at: '25 May 09:45' },
  { action: 'Flag resolved',   target: 'AutoNation KZN — Certified...',  by: 'admin@motorsphere.co.za', at: '23 May 11:30' },
  { action: 'User suspended',  target: 'spam@fake.com',                  by: 'admin@motorsphere.co.za', at: '22 May 14:10' },
];

export default function AdminPage() {
  const [pending, setPending]   = useState<PendingListing[]>(INITIAL_PENDING);
  const [flags, setFlags]       = useState<FlaggedItem[]>(FLAGS);
  const [verifs, setVerifs]     = useState<VerifReq[]>(VERIF_REQUESTS);
  const [log, setLog]           = useState<AuditEntry[]>(AUDIT_LOG);

  const approve = (id: string, title: string) => {
    setPending(p => p.map(item => item.id === id ? { ...item, state: 'approved' } : item));
    addLog('Approved', title);
  };

  const reject = (id: string, title: string) => {
    setPending(p => p.map(item => item.id === id ? { ...item, state: 'rejected' } : item));
    addLog('Rejected', title);
  };

  const resolveFlag = (id: string, title: string) => {
    setFlags(f => f.map(fl => fl.id === id ? { ...fl, resolved: true } : fl));
    addLog('Flag resolved', title);
  };

  const approveVerif = (id: string, name: string) => {
    setVerifs(v => v.map(vr => vr.id === id ? { ...vr, done: true } : vr));
    addLog('Verified account', name);
  };

  const addLog = (action: string, target: string) => {
    const now = new Date();
    const at = `${now.getDate()} ${now.toLocaleString('en-ZA',{ month:'short' })} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    setLog(l => [{ action, target, by: 'admin@motorsphere.co.za', at }, ...l]);
  };

  const pendingCount  = pending.filter(p => p.state === 'pending').length;
  const flagCount     = flags.filter(f => !f.resolved).length;
  const verifCount    = verifs.filter(v => !v.done).length;

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Moderation Centre</h1>
        <p className="text-sm text-gray-500 mt-1">Review, approve and manage platform activity.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Pending Listings', value: pendingCount, color: '#df8a00' },
          { label: 'Fraud Flags',      value: flagCount,    color: '#ff3d0a' },
          { label: 'Verifications',    value: verifCount,   color: '#0866ff' },
          { label: 'Live Listings',    value: allListings.length, color: '#06b351' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Pending listings ─────────────────────────────── */}
      <section>
        <h2 className="text-base font-black text-gray-800 mb-3">
          Pending Listings
          {pendingCount > 0 && (
            <span className="ml-2 text-xs font-black bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
              {pendingCount} awaiting
            </span>
          )}
        </h2>
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {pending.map((item, i) => (
            <div key={item.id} className={`flex items-center gap-4 p-4 ${i > 0 ? 'border-t border-gray-100' : ''}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.title} className="w-14 h-14 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-gray-900 truncate">{item.title}</p>
                <p className="text-xs text-gray-500">
                  {item.type} · {item.location} · {item.price} · {item.submittedAt}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">{item.seller}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {item.state === 'pending' ? (
                  <>
                    <button
                      onClick={() => approve(item.id, item.title)}
                      className="px-3 py-1.5 rounded-lg text-xs font-black text-white hover:opacity-90 transition-opacity"
                      style={{ background: '#06b351' }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => reject(item.id, item.title)}
                      className="px-3 py-1.5 rounded-lg text-xs font-black text-white hover:opacity-90 transition-opacity"
                      style={{ background: '#ff3d0a' }}
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span
                    className="text-[11px] font-black px-2.5 py-1 rounded-full"
                    style={{
                      background: item.state === 'approved' ? '#dcfce7' : '#fee2e2',
                      color:      item.state === 'approved' ? '#15803d'  : '#dc2626',
                    }}
                  >
                    {item.state === 'approved' ? 'Approved ✓' : 'Rejected ✕'}
                  </span>
                )}
                <Link
                  href={`/listing/${item.id}`}
                  className="text-xs font-bold text-[#0866ff] hover:underline"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Verification requests ────────────────────────── */}
      <section>
        <h2 className="text-base font-black text-gray-800 mb-3">
          Verification Requests
          {verifCount > 0 && (
            <span className="ml-2 text-xs font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              {verifCount} pending
            </span>
          )}
        </h2>
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {verifs.map((vr, i) => (
            <div key={vr.id} className={`flex items-center gap-4 p-4 ${i > 0 ? 'border-t border-gray-100' : ''}`}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-black shrink-0"
                style={{ background: '#0866ff' }}
              >
                {vr.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-gray-900">{vr.name}</p>
                <p className="text-xs text-gray-500 capitalize">{vr.role} · {vr.docs} documents · Submitted {vr.submittedAt}</p>
              </div>
              <div className="shrink-0">
                {vr.done ? (
                  <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                    Verified ✓
                  </span>
                ) : (
                  <button
                    onClick={() => approveVerif(vr.id, vr.name)}
                    className="px-3 py-1.5 rounded-lg text-xs font-black text-white hover:opacity-90 transition-opacity"
                    style={{ background: '#0866ff' }}
                  >
                    Approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Fraud flags ──────────────────────────────────── */}
      <section>
        <h2 className="text-base font-black text-gray-800 mb-3">
          Fraud &amp; Abuse Flags
          {flagCount > 0 && (
            <span className="ml-2 text-xs font-black bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
              {flagCount} open
            </span>
          )}
        </h2>
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {flags.map((fl, i) => (
            <div key={fl.id} className={`flex items-center gap-4 p-4 ${i > 0 ? 'border-t border-gray-100' : ''}`}>
              <div className="text-xl">🚩</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-gray-900 truncate">{fl.listingTitle}</p>
                <p className="text-xs text-gray-500">{fl.reason} · Reported by {fl.reportedBy} on {fl.at}</p>
              </div>
              <div className="shrink-0">
                {fl.resolved ? (
                  <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
                    Resolved
                  </span>
                ) : (
                  <button
                    onClick={() => resolveFlag(fl.id, fl.listingTitle)}
                    className="px-3 py-1.5 rounded-lg text-xs font-black bg-gray-800 text-white hover:bg-gray-900 transition-colors"
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Audit log ────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-black text-gray-800 mb-3">Audit Log</h2>
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {log.slice(0, 10).map((entry, i) => (
            <div key={i} className={`flex items-center gap-3 px-5 py-3 text-sm ${i > 0 ? 'border-t border-gray-100' : ''}`}>
              <span
                className="text-[10px] font-black px-2 py-0.5 rounded-full shrink-0"
                style={{
                  background: entry.action.includes('pproved') || entry.action.includes('erified') ? '#dcfce7' :
                              entry.action.includes('ejected') ? '#fee2e2' : '#f3f4f6',
                  color:      entry.action.includes('pproved') || entry.action.includes('erified') ? '#15803d' :
                              entry.action.includes('ejected') ? '#dc2626' : '#6b7280',
                }}
              >
                {entry.action}
              </span>
              <span className="flex-1 text-gray-700 truncate">{entry.target}</span>
              <span className="text-[11px] text-gray-400 shrink-0">{entry.at}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
