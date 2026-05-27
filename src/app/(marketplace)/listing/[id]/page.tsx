'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/shared/Breadcrumb';
import { allListings, categories } from '@/data/home-data';

// Status badge styles
const statusStyles: Record<string, string> = {
  green:  'bg-[#dcfce7] text-[#166534]',
  blue:   'bg-[#dbeafe] text-[#1d4ed8]',
  orange: 'bg-[#ffedd5] text-[#c2410c]',
  red:    'bg-[#fee2e2] text-[#b91c1c]',
  purple: 'bg-[#ede9fe] text-[#5b21b6]',
};

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const listing = allListings.find(l => l.id === id);

  const [saved, setSaved]             = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);
  const [form, setForm]               = useState({ name: '', email: '', message: '' });

  if (!listing) {
    return (
      <div className="max-w-[1240px] mx-auto px-[3.8vw] py-16 text-center">
        <h1 className="text-3xl font-black text-[#121826] mb-4">Listing not found</h1>
        <p className="text-[#687589] mb-6">This listing may have been removed or the URL is incorrect.</p>
        <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-xl px-[18px] py-3 bg-[#0866ff] text-white font-black text-sm">
          Back to Home
        </Link>
      </div>
    );
  }

  const category = categories.find(c => c.id === listing.type);

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
    setShowContact(false);
  };

  return (
    <div className="max-w-[1240px] mx-auto px-[3.8vw] py-8">
      {/* Breadcrumb + back */}
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

      {/* Inquiry success banner */}
      {inquirySent && (
        <div className="mb-6 rounded-2xl bg-[#dcfce7] border border-[#bbf7d0] p-4 flex items-start gap-3">
          <span className="text-2xl">✓</span>
          <div>
            <p className="font-black text-[#166534] mb-0.5">Inquiry sent successfully!</p>
            <p className="text-[#15803d] text-sm">The seller will respond to your email within 24 hours. You can track this in your <Link href="/inquiries" className="underline">Inquiries</Link> section.</p>
          </div>
        </div>
      )}

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_.7fr] gap-6 items-start">

        {/* Left: Image */}
        <div>
          <div
            className="w-full rounded-[22px] overflow-hidden shadow-[0_16px_32px_rgba(0,0,0,.16)] bg-[#ddd]"
            style={{ height: '420px', backgroundImage: `url('${listing.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
          {/* Description */}
          <div className="mt-4 bg-white rounded-2xl p-5 border border-black/[.08] shadow-[0_8px_20px_rgba(15,23,42,.06)]">
            <h2 className="text-lg font-black text-[#121826] mb-2">Description</h2>
            <p className="text-[#687589] text-sm leading-[1.7]">{listing.desc}</p>
          </div>
        </div>

        {/* Right: Detail panel */}
        <div className="bg-white rounded-[22px] p-6 shadow-[0_16px_32px_rgba(15,23,42,.10)] border border-black/[.08] sticky top-20">
          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-black mb-3 ${statusStyles[listing.statusVariant]}`}>
            {listing.status}
          </span>
          <h1 className="text-2xl font-black tracking-[-0.04em] text-[#121826] mb-2">{listing.title}</h1>
          <div className="text-[#061a43] text-2xl font-black mb-3">{listing.priceDisplay}</div>

          {/* Specs */}
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

          {/* CTAs */}
          <div className="flex flex-col gap-2.5">
            {!showContact ? (
              <button onClick={() => setShowContact(true)}
                className="w-full rounded-xl py-3 bg-[#0866ff] text-white font-black text-sm hover:bg-[#064dc1] transition-colors">
                Contact Seller
              </button>
            ) : (
              <form onSubmit={handleInquiry} className="space-y-3 border border-[#dbe8ff] rounded-xl p-4 bg-[#f8fbff]">
                <p className="text-sm font-black text-[#121826]">Send an inquiry</p>
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
                saved
                  ? 'bg-[#dcfce7] text-[#166534] border-[#bbf7d0]'
                  : 'bg-[#eef4ff] text-[#0866ff] border-[#dbe8ff] hover:bg-[#dbe8ff]'
              }`}>
              {saved ? '✓ Saved' : 'Save Listing'}
            </button>

            <Link href="/report"
              className="w-full text-center rounded-xl py-3 bg-[#fff1f2] text-[#e11d48] border border-[#fecdd3] font-black text-sm hover:bg-[#fee2e2] transition-colors block">
              Report Listing
            </Link>
          </div>

          {/* Trust note */}
          <div className="mt-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] p-3 text-[12px] text-[#687589] leading-[1.5]">
            MotorSphere verifies sellers and moderates listings before they go live. <Link href="/trust-safety" className="text-[#0866ff] font-bold hover:underline">Learn more</Link>
          </div>
        </div>
      </div>

      {/* Demo note */}
      <div className="mt-8 rounded-2xl bg-[#eef4ff] border border-[#dbe8ff] p-4 text-[13px] text-[#1d4ed8] font-bold">
        Demo prototype — inquiry forms are simulated. Production uses Firebase Firestore and email workflows.
      </div>
    </div>
  );
}
