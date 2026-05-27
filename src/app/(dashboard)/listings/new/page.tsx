'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { toNavKey } from '@/lib/accountType';

type FormData = {
  title:         string;
  type:          string;
  price:         string;
  location:      string;
  description:   string;
  mileage:       string;
  condition:     string;
  contactNumber: string;
};

const LISTING_TYPES_BY_NAV_KEY: Record<string, string[]> = {
  seller:   ['Vehicle', 'Bakkie', 'Truck'],
  dealer:   ['Vehicle', 'Bakkie', 'Truck', 'Bus', 'Motorcycle'],
  vendor:   ['Part', 'Spare', 'Tyre', 'Accessory'],
  workshop: ['Service', 'Package'],
  buyer:    ['Vehicle'],
  admin:    ['Vehicle', 'Part', 'Service'],
};

const LOCATIONS = [
  'Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Bloemfontein',
  'Port Elizabeth', 'Kimberley', 'East London', 'Polokwane', 'Nelspruit',
];

export default function NewListingPage() {
  const { user, profile } = useAuth();
  const [step,      setStep]  = useState<'form' | 'success'>('form');
  const [submitting, setSub]  = useState(false);

  const [form, setForm] = useState<FormData>({
    title: '', type: '', price: '', location: '', description: '',
    mileage: '', condition: 'Used', contactNumber: '',
  });

  const update = (k: keyof FormData, v: string) =>
    setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSub(true);
    // Listing creation will connect to Firestore in a later base
    await new Promise(r => setTimeout(r, 1200));
    setSub(false);
    setStep('success');
  };

  if (!user) return null;

  const navKey    = toNavKey(profile?.accountType);
  const types     = LISTING_TYPES_BY_NAV_KEY[navKey] ?? ['Vehicle'];
  const isService = navKey === 'workshop';

  if (step === 'success') {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"
            style={{ background: '#dcfce7' }}>✅</div>
          <h1 className="text-xl font-black text-gray-900">Listing Submitted!</h1>
          <p className="text-sm text-gray-500 mt-2">
            <strong className="text-gray-700">&ldquo;{form.title}&rdquo;</strong> has been submitted
            and is now <strong className="text-amber-600">pending admin review</strong>.
          </p>
          <p className="text-xs text-gray-400 mt-3">
            Most listings are reviewed within 24 hours. You will receive a notification once approved.
          </p>

          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100 text-left">
            <p className="text-xs font-black text-amber-700 mb-1">What happens next?</p>
            <ol className="text-xs text-amber-700 space-y-1 list-decimal list-inside">
              <li>Admin reviews your listing for accuracy</li>
              <li>Once approved, it goes live on the marketplace</li>
              <li>Buyers can then inquire directly</li>
            </ol>
          </div>

          <div className="flex gap-3 mt-6 justify-center">
            <Link
              href="/seller"
              className="px-5 py-2.5 rounded-lg text-sm font-black text-white hover:opacity-90 transition-opacity"
              style={{ background: '#0866ff' }}
            >
              View My Listings
            </Link>
            <button
              onClick={() => {
                setStep('form');
                setForm({ title:'',type:'',price:'',location:'',description:'',mileage:'',condition:'Used',contactNumber:'' });
              }}
              className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Add Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">
          {isService ? 'Add Service' : 'Create Listing'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Fill in the details below. Your listing will go through admin review before going live.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">

        {/* Title */}
        <div>
          <label className="block text-xs font-black text-gray-700 mb-1">
            {isService ? 'Service Name *' : 'Listing Title *'}
          </label>
          <input
            required
            type="text"
            value={form.title}
            onChange={e => update('title', e.target.value)}
            placeholder={isService ? 'e.g. Full Vehicle Service' : 'e.g. 2021 Toyota Hilux 2.8 GD-6'}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#0866ff] transition-colors"
          />
        </div>

        {/* Type + Condition */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-gray-700 mb-1">
              {isService ? 'Service Type *' : 'Listing Type *'}
            </label>
            <select
              required
              value={form.type}
              onChange={e => update('type', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#0866ff] bg-white"
            >
              <option value="">Select…</option>
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          {!isService && (
            <div>
              <label className="block text-xs font-black text-gray-700 mb-1">Condition *</label>
              <select
                value={form.condition}
                onChange={e => update('condition', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#0866ff] bg-white"
              >
                <option value="Used">Used</option>
                <option value="New">New</option>
                <option value="Demo">Demo</option>
                <option value="Salvage">Salvage</option>
              </select>
            </div>
          )}
        </div>

        {/* Price + Mileage */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-gray-700 mb-1">
              {isService ? 'Starting Price (ZAR) *' : 'Asking Price (ZAR) *'}
            </label>
            <input
              required
              type="number"
              min="0"
              value={form.price}
              onChange={e => update('price', e.target.value)}
              placeholder="e.g. 429900"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#0866ff]"
            />
          </div>
          {!isService && navKey !== 'vendor' && (
            <div>
              <label className="block text-xs font-black text-gray-700 mb-1">Mileage (km)</label>
              <input
                type="number"
                min="0"
                value={form.mileage}
                onChange={e => update('mileage', e.target.value)}
                placeholder="e.g. 85000"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#0866ff]"
              />
            </div>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-black text-gray-700 mb-1">Location *</label>
          <select
            required
            value={form.location}
            onChange={e => update('location', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#0866ff] bg-white"
          >
            <option value="">Select city…</option>
            {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-black text-gray-700 mb-1">Description *</label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={e => update('description', e.target.value)}
            placeholder="Describe the listing in detail. Include condition, service history, extras, etc."
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#0866ff] resize-none"
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-xs font-black text-gray-700 mb-1">Photos</label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
            <div className="text-3xl mb-2">📸</div>
            <p className="text-sm font-bold text-gray-500">Photo upload available after account verification</p>
            <p className="text-xs text-gray-400 mt-1">Up to 10 images per listing — high quality photos improve buyer response rates</p>
          </div>
        </div>

        {/* Contact */}
        <div>
          <label className="block text-xs font-black text-gray-700 mb-1">Contact Number *</label>
          <input
            required
            type="tel"
            value={form.contactNumber}
            onChange={e => update('contactNumber', e.target.value)}
            placeholder="e.g. 082 000 0000"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#0866ff]"
          />
        </div>

        {/* POPIA notice */}
        <p className="text-[11px] text-gray-400 bg-gray-50 rounded-lg p-3">
          🔒 Your contact details are only visible to buyers who send an inquiry. MotorSphere handles all data in accordance with POPIA.
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-lg text-sm font-black text-white hover:opacity-90 transition-opacity disabled:opacity-60"
          style={{ background: '#0866ff' }}
        >
          {submitting ? 'Submitting…' : 'Submit for Review'}
        </button>
      </form>
    </div>
  );
}
