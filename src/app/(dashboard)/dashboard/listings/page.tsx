'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMyListings } from '@/hooks/useMyListings';
import { formatZAR, formatRelative } from '@/utils/format';
import type { ListingDoc, ListingStatus } from '@/types/firestore.types';
import type { Timestamp } from 'firebase/firestore';

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  draft:          { label: 'Draft listing',  bg: '#f1f5f9', text: '#475569' },
  submitted:      { label: 'Submitted',      bg: '#fef9c3', text: '#a16207' },
  pending_review: { label: 'Pending review', bg: '#dbeafe', text: '#1d4ed8' },
  approved:       { label: 'Approved',       bg: '#dcfce7', text: '#15803d' },
  live:           { label: 'Live',           bg: '#bbf7d0', text: '#166534' },
  rejected:       { label: 'Rejected',       bg: '#fee2e2', text: '#b91c1c' },
  sold:           { label: 'Sold',           bg: '#ede9fe', text: '#5b21b6' },
  expired:        { label: 'Expired',        bg: '#f1f5f9', text: '#64748b' },
  flagged:        { label: 'Flagged',        bg: '#ffedd5', text: '#c2410c' },
  suspended:      { label: 'Suspended',      bg: '#fecaca', text: '#991b1b' },
};

type FilterKey = 'all' | ListingStatus;

const FILTER_TABS: { key: FilterKey; label: string }[] = [
  { key: 'all',          label: 'All' },
  { key: 'draft',        label: 'Drafts' },
  { key: 'submitted',    label: 'Submitted' },
  { key: 'pending_review', label: 'Pending review' },
  { key: 'approved',     label: 'Approved' },
  { key: 'live',         label: 'Live' },
  { key: 'rejected',     label: 'Rejected' },
];

function tsToString(ts: Timestamp | null | undefined): string {
  if (!ts) return '—';
  try { return formatRelative(ts.toDate()); } catch { return '—'; }
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;
  return (
    <span
      className="text-[10px] font-black px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ background: cfg.bg, color: cfg.text }}
    >
      {cfg.label}
    </span>
  );
}

function ListingRow({ listing }: { listing: ListingDoc }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <StatusBadge status={listing.status} />
            <span className="text-[10px] text-gray-400 font-bold capitalize">
              {listing.listingType} · {listing.city}, {listing.province}
            </span>
          </div>
          <p className="text-sm font-black text-gray-900 leading-snug">{listing.title}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-sm font-black" style={{ color: '#0866ff' }}>
              {formatZAR(listing.price)}
            </span>
            {listing.negotiable && (
              <span className="text-xs text-gray-400 font-bold">Negotiable</span>
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[11px] text-gray-400">{tsToString(listing.updatedAt)}</p>
          {listing.status === 'draft' && (
            <Link
              href="/listings/new"
              className="text-xs font-black text-[#0866ff] hover:underline block mt-2"
            >
              Continue editing →
            </Link>
          )}
          {listing.status === 'rejected' && listing.rejectionReason && (
            <p className="text-xs text-red-600 font-bold mt-2 max-w-[160px]">
              {listing.rejectionReason}
            </p>
          )}
          {listing.status === 'live' && (
            <Link
              href={`/listing/${listing.id}`}
              className="text-xs font-black text-[#06b351] hover:underline block mt-2"
            >
              View live →
            </Link>
          )}
        </div>
      </div>

      {/* Progress indicator for active lifecycle */}
      {['submitted', 'pending_review'].includes(listing.status) && (
        <div className="mt-3 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shrink-0" />
            <p className="text-xs text-blue-600 font-bold">
              {listing.status === 'submitted'
                ? 'Your listing has been submitted and is awaiting MotorSphere review.'
                : 'Your listing is currently being reviewed by the MotorSphere team.'}
            </p>
          </div>
        </div>
      )}
      {listing.status === 'approved' && (
        <div className="mt-3 pt-3 border-t border-gray-50">
          <p className="text-xs text-green-600 font-bold">
            ✓ Approved — your listing will go live shortly.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MyListingsPage() {
  const { listings, loading, draftCount, pendingCount, activeCount, rejectedCount } = useMyListings();
  const [filter, setFilter] = useState<FilterKey>('all');

  const filtered = filter === 'all'
    ? listings
    : listings.filter(l => l.status === filter);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <h1 className="text-2xl font-black text-gray-900">My listings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your listings, track review status and monitor performance.
          </p>
        </div>
        <Link
          href="/listings/new"
          className="px-5 py-2.5 rounded-lg text-sm font-black text-white hover:opacity-90 transition-opacity shrink-0"
          style={{ background: '#0866ff' }}
        >
          + New listing
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Drafts',       value: draftCount,    color: '#64748b' },
          { label: 'Pending',      value: pendingCount,  color: '#a16207' },
          { label: 'Active / live',value: activeCount,   color: '#16a34a' },
          { label: 'Rejected',     value: rejectedCount, color: '#dc2626' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="text-2xl font-black" style={{ color: s.color }}>
              {loading ? '—' : s.value}
            </div>
            <div className="text-xs text-gray-400 font-bold mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {FILTER_TABS.map(t => {
          const count = t.key === 'all'
            ? listings.length
            : listings.filter(l => l.status === t.key).length;
          if (t.key !== 'all' && count === 0) return null;
          return (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-colors ${
                filter === t.key
                  ? 'text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
              style={filter === t.key ? { background: '#0866ff' } : {}}
            >
              {t.label}{count > 0 ? ` (${count})` : ''}
            </button>
          );
        })}
      </div>

      {/* Listings list */}
      {loading ? (
        <div className="py-12 text-center">
          <div className="w-6 h-6 border-2 border-[#0866ff] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-400 mt-3">Loading your listings…</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map(l => <ListingRow key={l.id} listing={l} />)}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          {filter === 'all' ? (
            <>
              <p className="text-sm font-black text-gray-500">No listings yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Create your first listing to get started.
              </p>
              <Link
                href="/listings/new"
                className="inline-block mt-4 px-5 py-2.5 rounded-lg text-sm font-black text-white hover:opacity-90 transition-opacity"
                style={{ background: '#0866ff' }}
              >
                Create a listing
              </Link>
            </>
          ) : (
            <p className="text-sm font-bold text-gray-400">
              No {filter.replace('_', ' ')} listings.
            </p>
          )}
        </div>
      )}

    </div>
  );
}
