'use client';

/**
 * src/components/dashboard/MyListingsSection.tsx
 *
 * Shows a user's recent listings with status badges and next-action CTAs.
 * Used inline on role-specific dashboard pages (seller, dealer, vendor, workshop).
 */

import Link from 'next/link';
import type { ListingDoc } from '@/types/firestore.types';
import { formatZAR, formatRelative } from '@/utils/format';
import type { Timestamp } from 'firebase/firestore';

// ─── Status display config ────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  draft:          { label: 'Draft listing',   bg: '#f1f5f9', text: '#475569' },
  submitted:      { label: 'Submitted',       bg: '#fef9c3', text: '#a16207' },
  pending_review: { label: 'Pending review',  bg: '#dbeafe', text: '#1d4ed8' },
  approved:       { label: 'Approved',        bg: '#dcfce7', text: '#15803d' },
  live:           { label: 'Live listing',    bg: '#bbf7d0', text: '#166534' },
  rejected:       { label: 'Rejected',        bg: '#fee2e2', text: '#b91c1c' },
  sold:           { label: 'Sold',            bg: '#ede9fe', text: '#5b21b6' },
  expired:        { label: 'Expired',         bg: '#f1f5f9', text: '#64748b' },
  flagged:        { label: 'Flagged',         bg: '#ffedd5', text: '#c2410c' },
  suspended:      { label: 'Suspended',       bg: '#fecaca', text: '#991b1b' },
};

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

function nextActionLabel(status: string): string {
  switch (status) {
    case 'draft':          return 'Complete & submit';
    case 'submitted':      return 'Under review';
    case 'pending_review': return 'Pending review';
    case 'approved':       return 'Goes live soon';
    case 'live':           return 'View live listing';
    case 'rejected':       return 'View feedback';
    case 'sold':           return 'Mark as sold ✓';
    case 'expired':        return 'Renew listing';
    default:               return '';
  }
}

function tsToString(ts: Timestamp | null | undefined): string {
  if (!ts) return '—';
  try {
    return formatRelative(ts.toDate());
  } catch {
    return '—';
  }
}

// ─── Listing card ─────────────────────────────────────────────────────────────

function ListingCard({ listing }: { listing: ListingDoc }) {
  const action = nextActionLabel(listing.status);

  return (
    <div className="flex items-start justify-between gap-3 py-3 border-b border-gray-50 last:border-b-0">
      {/* Left */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <StatusBadge status={listing.status} />
          <span className="text-[10px] text-gray-400 font-bold capitalize">
            {listing.listingType}
          </span>
        </div>
        <p className="text-sm font-black text-gray-900 truncate">{listing.title}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {formatZAR(listing.price)}
          {listing.negotiable && <span className="ml-1 text-gray-300">· Negotiable</span>}
          <span className="ml-2 text-gray-300">·</span>
          <span className="ml-2">{tsToString(listing.updatedAt)}</span>
        </p>
      </div>

      {/* Right */}
      {action && (
        <Link
          href="/dashboard/listings"
          className="text-[11px] font-black text-[#0866ff] hover:underline whitespace-nowrap shrink-0 mt-0.5"
        >
          {action} →
        </Link>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  listings: ListingDoc[];
  loading:  boolean;
  /** Max items to show before "View all" link. Default 5. */
  limit?:   number;
}

export default function MyListingsSection({ listings, loading, limit = 5 }: Props) {
  const shown = listings.slice(0, limit);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-black text-gray-700">My listings</h2>
        {listings.length > 0 && (
          <Link
            href="/dashboard/listings"
            className="text-xs font-black text-[#0866ff] hover:underline"
          >
            View all ({listings.length}) →
          </Link>
        )}
      </div>

      {loading ? (
        <div className="py-4 text-center">
          <div className="w-5 h-5 border-2 border-[#0866ff] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : shown.length > 0 ? (
        <div>
          {shown.map(l => <ListingCard key={l.id} listing={l} />)}
          {listings.length > limit && (
            <Link
              href="/dashboard/listings"
              className="block mt-3 text-xs font-black text-[#0866ff] hover:underline text-center"
            >
              + {listings.length - limit} more listings
            </Link>
          )}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-sm font-bold text-gray-400">No listings yet</p>
          <p className="text-xs text-gray-300 mt-1">
            Create your first listing to get started.
          </p>
          <Link
            href="/listings/new"
            className="inline-block mt-3 px-4 py-2 rounded-lg text-xs font-black text-white hover:opacity-90 transition-opacity"
            style={{ background: '#0866ff' }}
          >
            Create a listing
          </Link>
        </div>
      )}
    </div>
  );
}
