'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { canAccessAdmin } from '@/lib/permissions';
import { subscribePendingListings } from '@/lib/firebase/listings';
import { formatZAR, formatRelative } from '@/utils/format';
import type { ListingDoc } from '@/types/firestore.types';
import type { Timestamp } from 'firebase/firestore';

function tsToString(ts: Timestamp | null | undefined): string {
  if (!ts) return '—';
  try { return formatRelative(ts.toDate()); } catch { return '—'; }
}

function PendingListingsPanel() {
  const [pending, setPending] = useState<ListingDoc[]>([]);
  const [loaded,  setLoaded]  = useState(false);

  useEffect(() => {
    const unsub = subscribePendingListings(listings => {
      setPending(listings);
      setLoaded(true);
    });
    return unsub;
  }, []);

  if (!loaded) {
    return (
      <div className="py-4 text-center">
        <div className="w-5 h-5 border-2 border-[#0866ff] border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (pending.length === 0) {
    return (
      <p className="text-sm text-gray-400 py-4 text-center">
        No listings pending review.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {pending.slice(0, 8).map(l => (
        <div key={l.id} className="flex items-center justify-between gap-4 py-2.5 border-b border-gray-50 last:border-b-0">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-gray-900 truncate">{l.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              <span className="capitalize">{l.ownerRole}</span>
              <span className="mx-1.5 text-gray-200">·</span>
              {formatZAR(l.price)}
              <span className="mx-1.5 text-gray-200">·</span>
              {l.city}, {l.province}
              <span className="mx-1.5 text-gray-200">·</span>
              {tsToString(l.submittedAt)}
            </p>
          </div>
          <span className="text-[10px] font-black px-2.5 py-1 rounded-full shrink-0"
            style={{ background: '#dbeafe', color: '#1d4ed8' }}>
            Pending review
          </span>
        </div>
      ))}
      {pending.length > 8 && (
        <p className="text-xs text-gray-400 pt-1">
          + {pending.length - 8} more pending listings. Go to the moderation panel.
        </p>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  const { user, profile } = useAuth();
  if (!user) return null;

  const isAdmin    = ['admin', 'super_admin'].includes(profile?.role ?? '');
  const hasAdminUI = canAccessAdmin(profile);

  if (!hasAdminUI) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <p className="text-sm font-bold text-gray-500">
          You do not have access to the admin area.
        </p>
      </div>
    );
  }

  const name = profile?.displayName ?? user.email ?? 'Admin';

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-black text-gray-900">Admin Hub</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome, {name}. Review listings, moderate content and manage platform integrity.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Pending listings',      value: '—', href: '/admin', color: '#df8a00' },
          { label: 'Flagged listings',      value: '—', href: '/admin', color: '#ff3d0a' },
          { label: 'Pending verifications', value: '—', href: '/admin', color: '#0866ff' },
        ].map(stat => (
          <Link key={stat.label} href={stat.href}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/admin"
          className="px-5 py-2.5 rounded-lg text-sm font-black text-white hover:opacity-90 transition-opacity"
          style={{ background: '#0866ff' }}>
          Go to moderation
        </Link>
      </div>

      {/* Pending listings preview — only for users with actual admin role claim */}
      {isAdmin ? (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-gray-700">Listings pending review</h2>
            <Link href="/admin" className="text-xs font-black text-[#0866ff] hover:underline">
              Full moderation panel →
            </Link>
          </div>
          <PendingListingsPanel />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-black text-gray-700 mb-2">Moderation panel</h2>
          <p className="text-sm text-gray-400">
            Full moderation access requires an admin role. Contact the platform owner to have your role elevated.
          </p>
        </div>
      )}

      {/* Admin quick links */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-sm font-black text-gray-700 mb-3">Admin actions</h2>
        <ul className="space-y-2">
          {[
            { label: 'Review pending listings',  href: '/admin' },
            { label: 'Check verification queue', href: '/admin' },
            { label: 'Review flagged content',   href: '/admin' },
            { label: 'View audit log',           href: '/admin' },
          ].map(link => (
            <li key={link.label}>
              <Link href={link.href} className="text-sm font-bold text-[#0866ff] hover:underline">
                → {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
