'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/shared/Breadcrumb';
import { allListings, categories } from '@/data/home-data';
import { getOwnerListing } from '@/lib/firebase/listings';
import { useAuth } from '@/hooks/useAuth';
import { formatZAR } from '@/utils/format';
import type { ListingDoc } from '@/types/firestore.types';

// ─── Seeded listing detail (existing behaviour) ───────────────────────────────

const statusStyles: Record<string, string> = {
  green:  'bg-[#dcfce7] text-[#166534]',
  blue:   'bg-[#dbeafe] text-[#1d4ed8]',
  orange: 'bg-[#ffedd5] text-[#c2410c]',
  red:    'bg-[#fee2e2] text-[#b91c1c]',
  purple: 'bg-[#ede9fe] text-[#5b21b6]',
};

function SeededListingView({ listing }: { listing: typeof allListings[0] }) {
  const [saved,       setSaved]       = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const category = categories.find(c => c.id === listing.type);

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
    setShowContact(false);
  };

  return (
    <div className="max-w-[1240px] mx-auto px-[3.8vw] py-8">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <Breadcrumb crumbs={[
          { label: 'Home', href: '/' },
          { label: category?.label ?? 'Category', href: `/category/${listing.type}` },
          { label: listing.title },
        ]} />
        <Link href={`/category/${listing.type}`}
          className="text-[13px] font-bold text-[#0866ff] hover:underline flex items-center gap-1">
          ← Back to results
        </Link>
      </div>

      {inquirySent && (
        <div className="mb-6 rounded-2xl bg-[#dcfce7] border border-[#bbf7d0] p-4 flex items-start gap-3">
          <span className="text-2xl">✓</span>
          <div>
            <p className="font-black text-[#166534] mb-0.5">Inquiry submitted successfully!</p>
            <p className="text-[#15803d] text-sm">
              Your inquiry has been submitted. The seller will be notified through MotorSphere and will respond within 24 hours.
              Track replies in your <Link href="/inquiries" className="underline">Inquiries</Link> dashboard.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_.7fr] gap-6 items-start">
        <div>
          <div
            className="w-full rounded-[22px] overflow-hidden shadow-[0_16px_32px_rgba(0,0,0,.16)] bg-[#ddd]"
            style={{ height: '420px', backgroundImage: `url('${listing.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
          <div className="mt-4 bg-white rounded-2xl p-5 border border-black/[.08] shadow-[0_8px_20px_rgba(15,23,42,.06)]">
            <h2 className="text-lg font-black text-[#121826] mb-2">Description</h2>
            <p className="text-[#687589] text-sm leading-[1.7]">{listing.desc}</p>
          </div>
        </div>

        <div className="bg-white rounded-[22px] p-6 shadow-[0_16px_32px_rgba(15,23,42,.10)] border border-black/[.08] sticky top-20">
          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-black mb-3 ${statusStyles[listing.statusVariant]}`}>
            {listing.status}
          </span>
          <h1 className="text-2xl font-black tracking-[-0.04em] text-[#121826] mb-2">{listing.title}</h1>
          <div className="text-[#061a43] text-2xl font-black mb-3">{listing.priceDisplay}</div>
          <div className="grid grid-cols-2 gap-2 mb-5">
            {listing.meta.map(m => (
              <div key={m} className="bg-[#f8fafc] rounded-xl px-3 py-2.5">
                <span className="text-[11px] text-[#687589] font-bold block">Detail</span>
                <strong className="text-[13px] text-[#121826]">{m}</strong>
              </div>
            ))}
            <div className="bg-[#f8fafc] rounded-xl px-3 py-2.5">
              <span className="text-[11px] text-[#687589] font-bold block">Location</span>
              <strong className="text-[13px] text-[#121826]">{listing.location}</strong>
            </div>
            <div className="bg-[#f8fafc] rounded-xl px-3 py-2.5">
              <span className="text-[11px] text-[#687589] font-bold block">Seller</span>
              <strong className="text-[13px] text-[#121826]">{listing.seller}</strong>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {!showContact ? (
              <button onClick={() => setShowContact(true)}
                className="w-full rounded-xl py-3 bg-[#0866ff] text-white font-black text-sm hover:bg-[#064dc1] transition-colors">
                Contact Seller Securely
              </button>
            ) : (
              <form onSubmit={handleInquiry} className="space-y-3 border border-[#dbe8ff] rounded-xl p-4 bg-[#f8fbff]">
                <p className="text-sm font-black text-[#121826]">Contact seller through MotorSphere</p>
                <input required placeholder="Your name" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                  className="w-full border border-[#dbe3ee] rounded-xl px-3 py-2.5 text-sm outline-none bg-white text-[#121826] focus:border-[#0866ff]" />
                <input required type="email" placeholder="Your email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
                  className="w-full border border-[#dbe3ee] rounded-xl px-3 py-2.5 text-sm outline-none bg-white text-[#121826] focus:border-[#0866ff]" />
                <textarea required placeholder="Your message..." value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))}
                  rows={3}
                  className="w-full border border-[#dbe3ee] rounded-xl px-3 py-2.5 text-sm outline-none bg-white text-[#121826] resize-none focus:border-[#0866ff]" />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 rounded-xl py-2.5 bg-[#0866ff] text-white font-black text-sm hover:bg-[#064dc1] transition-colors">
                    Send
                  </button>
                  <button type="button" onClick={() => setShowContact(false)}
                    className="rounded-xl px-4 py-2.5 border border-black/[.12] text-[#687589] text-sm font-bold hover:bg-[#f4f7fb] transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            )}
            <button onClick={() => setSaved(s => !s)}
              className={`w-full rounded-xl py-3 font-black text-sm border transition-colors ${
                saved ? 'bg-[#dcfce7] text-[#166534] border-[#bbf7d0]' : 'bg-[#eef4ff] text-[#0866ff] border-[#dbe8ff] hover:bg-[#dbe8ff]'
              }`}>
              {saved ? '✓ Saved to your list' : 'Save listing to compare later'}
            </button>
            <Link href="/report"
              className="w-full text-center rounded-xl py-3 bg-[#fff1f2] text-[#e11d48] border border-[#fecdd3] font-black text-sm hover:bg-[#fee2e2] transition-colors block">
              Report Suspicious Information
            </Link>
          </div>

          <div className="mt-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] p-3 text-[12px] text-[#687589] leading-[1.5]">
            This listing is reviewed for marketplace quality before public visibility.{' '}
            <Link href="/trust-safety" className="text-[#0866ff] font-bold hover:underline">Learn about our trust model</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Firestore listing detail ─────────────────────────────────────────────────

const LISTING_STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  draft:          { label: 'Draft listing',  bg: '#f1f5f9', text: '#475569' },
  submitted:      { label: 'Submitted for review', bg: '#fef9c3', text: '#a16207' },
  pending_review: { label: 'Pending review', bg: '#dbeafe', text: '#1d4ed8' },
  approved:       { label: 'Approved',       bg: '#dcfce7', text: '#15803d' },
  live:           { label: 'Live listing',   bg: '#bbf7d0', text: '#166534' },
  rejected:       { label: 'Rejected',       bg: '#fee2e2', text: '#b91c1c' },
  sold:           { label: 'Sold',           bg: '#ede9fe', text: '#5b21b6' },
};

function FirestoreListingView({ listing, isOwner }: { listing: ListingDoc; isOwner: boolean }) {
  const [showContact, setShowContact] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const isPublic = ['live', 'approved'].includes(listing.status);
  const statusCfg = LISTING_STATUS_CONFIG[listing.status] ?? LISTING_STATUS_CONFIG.draft;

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
    setShowContact(false);
  };

  return (
    <div className="max-w-[1240px] mx-auto px-[3.8vw] py-8">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <Breadcrumb crumbs={[
          { label: 'Home', href: '/' },
          { label: listing.category ?? 'Listings', href: `/category/${listing.category ?? 'vehicles'}` },
          { label: listing.title },
        ]} />
        <Link href="/" className="text-[13px] font-bold text-[#0866ff] hover:underline flex items-center gap-1">
          ← Back
        </Link>
      </div>

      {/* Owner status panel */}
      {isOwner && !isPublic && (
        <div className="mb-6 rounded-2xl border p-4 flex items-start gap-3"
          style={{ background: statusCfg.bg + '33', borderColor: statusCfg.bg }}>
          <span
            className="text-[11px] font-black px-2.5 py-1 rounded-full shrink-0 mt-0.5"
            style={{ background: statusCfg.bg, color: statusCfg.text }}
          >
            {statusCfg.label}
          </span>
          <div>
            <p className="text-sm font-black" style={{ color: statusCfg.text }}>
              {listing.status === 'draft' && 'This listing is saved as a draft. Submit it for review when ready.'}
              {listing.status === 'submitted' && 'Your listing has been submitted for MotorSphere review.'}
              {listing.status === 'pending_review' && 'Your listing is currently being reviewed by the MotorSphere team.'}
              {listing.status === 'rejected' && 'Your listing was not approved.'}
            </p>
            {listing.status === 'rejected' && listing.rejectionReason && (
              <p className="text-sm text-red-700 mt-1">{listing.rejectionReason}</p>
            )}
            {listing.status === 'draft' && (
              <Link href="/listings/new" className="text-sm font-black text-[#0866ff] underline mt-1 inline-block">
                Complete listing →
              </Link>
            )}
          </div>
        </div>
      )}

      {inquirySent && (
        <div className="mb-6 rounded-2xl bg-[#dcfce7] border border-[#bbf7d0] p-4 flex items-start gap-3">
          <span className="text-2xl">✓</span>
          <div>
            <p className="font-black text-[#166534] mb-0.5">Inquiry submitted successfully!</p>
            <p className="text-[#15803d] text-sm">
              Your inquiry has been sent. Track replies in your{' '}
              <Link href="/inquiries" className="underline">Inquiries</Link> dashboard.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_.7fr] gap-6 items-start">
        {/* Left: Placeholder image */}
        <div>
          <div
            className="w-full rounded-[22px] overflow-hidden bg-[#e2e8f0] flex items-center justify-center"
            style={{ height: '420px' }}
          >
            <div className="text-center">
              <div className="text-5xl mb-2">
                {listing.listingType === 'vehicle' ? '🚗' : listing.listingType === 'part' ? '🔧' : '🔨'}
              </div>
              <p className="text-sm text-[#687589] font-bold">Photos coming soon</p>
            </div>
          </div>

          <div className="mt-4 bg-white rounded-2xl p-5 border border-black/[.08]">
            <h2 className="text-lg font-black text-[#121826] mb-2">Description</h2>
            <p className="text-[#687589] text-sm leading-[1.7] whitespace-pre-line">{listing.description}</p>
          </div>

          {/* Vehicle specs */}
          {listing.listingType === 'vehicle' && (
            <div className="mt-4 bg-white rounded-2xl p-5 border border-black/[.08]">
              <h2 className="text-lg font-black text-[#121826] mb-3">Vehicle details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { label: 'Make',         value: listing.make },
                  { label: 'Model',        value: listing.model },
                  { label: 'Year',         value: listing.year },
                  { label: 'Mileage',      value: listing.mileage ? `${listing.mileage.toLocaleString('en-ZA')} km` : null },
                  { label: 'Fuel',         value: listing.fuelType },
                  { label: 'Transmission', value: listing.transmission },
                  { label: 'Condition',    value: listing.condition },
                  { label: 'Colour',       value: listing.colour },
                  { label: 'Service history', value: listing.serviceHistory ? 'Available' : null },
                ].filter(s => s.value).map(s => (
                  <div key={s.label} className="bg-[#f8fafc] rounded-xl px-3 py-2.5">
                    <span className="text-[11px] text-[#687589] font-bold block capitalize">{s.label}</span>
                    <strong className="text-[13px] text-[#121826] capitalize">{String(s.value)}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Part specs */}
          {listing.listingType === 'part' && (
            <div className="mt-4 bg-white rounded-2xl p-5 border border-black/[.08]">
              <h2 className="text-lg font-black text-[#121826] mb-3">Part details</h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Category',       value: listing.partCategory },
                  { label: 'Condition',      value: listing.partCondition },
                  { label: 'Type',           value: listing.oemOrAftermarket?.toUpperCase() },
                  { label: 'Quantity',       value: listing.quantityAvailable },
                  { label: 'Compatible makes', value: listing.compatibleMakes?.join(', ') },
                  { label: 'Delivery',       value: listing.deliveryAvailable ? 'Available' : null },
                ].filter(s => s.value).map(s => (
                  <div key={s.label} className="bg-[#f8fafc] rounded-xl px-3 py-2.5">
                    <span className="text-[11px] text-[#687589] font-bold block">{s.label}</span>
                    <strong className="text-[13px] text-[#121826]">{String(s.value)}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Action panel */}
        <div className="bg-white rounded-[22px] p-6 shadow-[0_16px_32px_rgba(15,23,42,.10)] border border-black/[.08] sticky top-20">
          <span
            className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-black mb-3"
            style={{ background: statusCfg.bg, color: statusCfg.text }}
          >
            {statusCfg.label}
          </span>
          <h1 className="text-2xl font-black tracking-[-0.04em] text-[#121826] mb-2">{listing.title}</h1>
          <div className="text-[#061a43] text-2xl font-black mb-1">{formatZAR(listing.price)}</div>
          {listing.negotiable && (
            <p className="text-xs text-gray-400 font-bold mb-3">Open to negotiation</p>
          )}

          <div className="grid grid-cols-2 gap-2 mb-5">
            <div className="bg-[#f8fafc] rounded-xl px-3 py-2.5">
              <span className="text-[11px] text-[#687589] font-bold block">Location</span>
              <strong className="text-[13px] text-[#121826]">{listing.city}, {listing.province}</strong>
            </div>
            <div className="bg-[#f8fafc] rounded-xl px-3 py-2.5">
              <span className="text-[11px] text-[#687589] font-bold block">Seller</span>
              <strong className="text-[13px] text-[#121826]">{listing.ownerDisplayName}</strong>
            </div>
          </div>

          {/* Contact / owner actions */}
          {isPublic && !isOwner && (
            <div className="flex flex-col gap-2.5">
              {!showContact ? (
                <button onClick={() => setShowContact(true)}
                  className="w-full rounded-xl py-3 bg-[#0866ff] text-white font-black text-sm hover:bg-[#064dc1] transition-colors">
                  Contact Seller Securely
                </button>
              ) : (
                <form onSubmit={handleInquiry} className="space-y-3 border border-[#dbe8ff] rounded-xl p-4 bg-[#f8fbff]">
                  <p className="text-sm font-black text-[#121826]">Send an inquiry through MotorSphere</p>
                  <input required placeholder="Your name" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                    className="w-full border border-[#dbe3ee] rounded-xl px-3 py-2.5 text-sm outline-none bg-white text-[#121826] focus:border-[#0866ff]" />
                  <input required type="email" placeholder="Your email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
                    className="w-full border border-[#dbe3ee] rounded-xl px-3 py-2.5 text-sm outline-none bg-white text-[#121826] focus:border-[#0866ff]" />
                  <textarea required placeholder="Your message..." value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))}
                    rows={3} className="w-full border border-[#dbe3ee] rounded-xl px-3 py-2.5 text-sm outline-none bg-white text-[#121826] resize-none focus:border-[#0866ff]" />
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 rounded-xl py-2.5 bg-[#0866ff] text-white font-black text-sm hover:bg-[#064dc1] transition-colors">Send</button>
                    <button type="button" onClick={() => setShowContact(false)}
                      className="rounded-xl px-4 py-2.5 border border-black/[.12] text-[#687589] text-sm font-bold hover:bg-[#f4f7fb] transition-colors">Cancel</button>
                  </div>
                </form>
              )}
              <Link href="/report"
                className="w-full text-center rounded-xl py-3 bg-[#fff1f2] text-[#e11d48] border border-[#fecdd3] font-black text-sm hover:bg-[#fee2e2] transition-colors block">
                Report Suspicious Information
              </Link>
            </div>
          )}

          {isOwner && (
            <div className="flex flex-col gap-2">
              <Link href="/dashboard/listings"
                className="w-full text-center rounded-xl py-3 bg-[#0866ff] text-white font-black text-sm hover:bg-[#064dc1] transition-colors">
                Manage listing
              </Link>
            </div>
          )}

          <div className="mt-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] p-3 text-[12px] text-[#687589] leading-[1.5]">
            Listings are reviewed for marketplace quality before public visibility.{' '}
            <Link href="/trust-safety" className="text-[#0866ff] font-bold hover:underline">Learn about our trust model</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page state machine ───────────────────────────────────────────────────────

type PageState =
  | { kind: 'seeded'; listing: typeof allListings[0] }
  | { kind: 'loading' }
  | { kind: 'firestore'; listing: ListingDoc }
  | { kind: 'not_found' };

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }    = use(params);
  const { user }  = useAuth();

  const seeded = allListings.find(l => l.id === id);

  const [state, setState] = useState<PageState>(
    seeded ? { kind: 'seeded', listing: seeded } : { kind: 'loading' },
  );

  useEffect(() => {
    // If seeded data resolved, nothing to do
    if (seeded) return;

    let cancelled = false;

    async function fetch() {
      // getOwnerListing uses Firestore security rules:
      //   - owner can read their own listings (any status)
      //   - public can read live/approved only
      //   - non-owners reading non-public = permission denied → returns null
      const listing = await getOwnerListing(id);
      if (cancelled) return;
      if (listing) {
        setState({ kind: 'firestore', listing });
      } else {
        setState({ kind: 'not_found' });
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, [id, seeded]);

  // ── Render based on state ──────────────────────────────────────────────────

  if (state.kind === 'loading') {
    return (
      <div className="max-w-[1240px] mx-auto px-[3.8vw] py-16 text-center">
        <div className="w-8 h-8 border-2 border-[#0866ff] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-[#687589] mt-4">Loading listing…</p>
      </div>
    );
  }

  if (state.kind === 'not_found') {
    return (
      <div className="max-w-[1240px] mx-auto px-[3.8vw] py-16 text-center">
        <h1 className="text-3xl font-black text-[#121826] mb-4">Listing not found</h1>
        <p className="text-[#687589] mb-6">
          This listing may have been removed or the URL is incorrect.
        </p>
        <Link href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl px-[18px] py-3 bg-[#0866ff] text-white font-black text-sm">
          Back to Home
        </Link>
      </div>
    );
  }

  if (state.kind === 'seeded') {
    return <SeededListingView listing={state.listing} />;
  }

  // Firestore listing
  const isOwner = !!user && user.uid === state.listing.ownerId;
  return <FirestoreListingView listing={state.listing} isOwner={isOwner} />;
}
