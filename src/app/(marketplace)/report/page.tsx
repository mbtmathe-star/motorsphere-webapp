'use client';

import { useState } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/shared/Breadcrumb';

export default function ReportPage() {
  const [step, setStep]       = useState<'form' | 'success'>('form');
  const [submitting, setSub]  = useState(false);
  const [listingUrl, setUrl]  = useState('');
  const [reason, setReason]   = useState('');
  const [detail, setDetail]   = useState('');
  const [email, setEmail]     = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSub(true);
    await new Promise(r => setTimeout(r, 1000));
    setSub(false);
    setStep('success');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Report a Listing' }]} />

      <div>
        <h1 className="text-3xl font-black text-gray-900">Report a Listing</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Spotted something suspicious or misleading? Let us know — our team reviews every report.
        </p>
      </div>

      {step === 'success' ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-3xl"
            style={{ background: '#dcfce7' }}>✅</div>
          <h2 className="text-xl font-black text-gray-900">Report Submitted</h2>
          <p className="text-sm text-gray-500">
            Thank you for helping keep MotorSphere safe. Our moderation team will review this within 24 hours.
          </p>
          {email && (
            <p className="text-xs text-gray-400">A confirmation has been sent to <strong>{email}</strong></p>
          )}
          <div className="flex gap-3 mt-2 justify-center">
            <Link href="/category/vehicles"
              className="px-5 py-2.5 rounded-lg text-sm font-black text-white hover:opacity-90 transition-opacity"
              style={{ background: '#0866ff' }}>
              Browse Listings
            </Link>
            <button
              onClick={() => { setStep('form'); setUrl(''); setReason(''); setDetail(''); setEmail(''); }}
              className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Submit Another
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">

          <div>
            <label className="block text-xs font-black text-gray-700 mb-1">Listing URL or ID *</label>
            <input required type="text" value={listingUrl} onChange={e => setUrl(e.target.value)}
              placeholder="e.g. https://motorsphere.co.za/listing/veh-1 or veh-1"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0866ff]" />
            <p className="text-[11px] text-gray-400 mt-1">You can copy the URL from your browser address bar.</p>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-700 mb-1">Reason for Report *</label>
            <select required value={reason} onChange={e => setReason(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0866ff] bg-white">
              <option value="">Select a reason…</option>
              <option value="stolen">Suspected stolen vehicle</option>
              <option value="fake">Fake or non-existent listing</option>
              <option value="counterfeit">Counterfeit or fake parts</option>
              <option value="misleading">Misleading price or description</option>
              <option value="scam">Suspected scam or fraud</option>
              <option value="illegal">Illegal modifications or items</option>
              <option value="duplicate">Duplicate listing</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-700 mb-1">Additional Detail *</label>
            <textarea required rows={4} value={detail} onChange={e => setDetail(e.target.value)}
              placeholder="Please describe what you noticed in detail. The more context you provide, the faster we can act."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0866ff] resize-none" />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-700 mb-1">Your Email (optional)</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com — for follow-up only"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0866ff]" />
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-[11px] text-gray-500">
              🔒 Reports are confidential. Your identity will not be shared with the listing owner.
              Malicious or false reports may result in account suspension.
            </p>
          </div>

          <button type="submit" disabled={submitting}
            className="w-full py-3 rounded-lg text-sm font-black text-white disabled:opacity-60 hover:opacity-90 transition-opacity"
            style={{ background: '#ff003b' }}>
            {submitting ? 'Submitting…' : 'Submit Report'}
          </button>
        </form>
      )}

      <div className="flex gap-4 text-sm">
        <Link href="/trust-safety" className="font-bold text-[#0866ff] hover:underline">Trust &amp; Safety</Link>
        <Link href="/contact" className="font-bold text-[#0866ff] hover:underline">Contact Support</Link>
      </div>
    </div>
  );
}
