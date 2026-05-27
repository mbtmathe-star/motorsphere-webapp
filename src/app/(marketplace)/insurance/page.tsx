'use client';

import { useState } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/shared/Breadcrumb';

export default function InsurancePage() {
  const [step, setStep]         = useState<'form' | 'success'>('form');
  const [submitting, setSub]    = useState(false);
  const [vehicleReg, setVReg]   = useState('');
  const [vehicleYear, setVYear] = useState('');
  const [vehicleMake, setVMake] = useState('');
  const [email, setEmail]       = useState('');
  const [phone, setPhone]       = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSub(true);
    await new Promise(r => setTimeout(r, 1200));
    setSub(false);
    setStep('success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Insurance Quotes' }]} />

      <div className="text-center max-w-2xl mx-auto">
        <div className="text-4xl mb-3">🛡️</div>
        <h1 className="text-3xl font-black text-gray-900">Vehicle Insurance Quotes</h1>
        <p className="text-gray-500 mt-2 text-sm">
          Get instant quotes from South Africa&rsquo;s leading insurance partners. Save up to 30% on your premium.
        </p>
      </div>

      {/* Partners strip */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <p className="text-[11px] font-black text-gray-400 text-center uppercase tracking-widest mb-3">Partner insurers</p>
        <div className="flex items-center justify-center gap-6 flex-wrap">
          {['Santam', 'OUTsurance', 'MiWay', 'Discovery', 'King Price'].map(brand => (
            <span key={brand} className="text-sm font-black text-gray-500">{brand}</span>
          ))}
        </div>
      </div>

      {step === 'success' ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"
            style={{ background: '#dcfce7' }}>✅</div>
          <h2 className="text-xl font-black text-gray-900">Quote Request Submitted!</h2>
          <p className="text-sm text-gray-500 mt-2">
            An insurance specialist will contact you within 2 business hours.
          </p>
          <p className="text-xs text-gray-400 mt-1">Quotes sent to <strong>{email}</strong></p>
          <div className="flex gap-3 mt-6 justify-center">
            <Link href="/" className="px-5 py-2.5 rounded-lg text-sm font-black text-white hover:opacity-90 transition-opacity" style={{ background: '#0866ff' }}>
              Back to Home
            </Link>
            <button
              onClick={() => setStep('form')}
              className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Another Quote
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Benefits */}
          <div className="space-y-4">
            <h2 className="text-lg font-black text-gray-900">Why use MotorSphere Insurance?</h2>
            {[
              { icon: '⚡', title: 'Instant comparison',  desc: 'Compare multiple quotes from top insurers in minutes.' },
              { icon: '💰', title: 'Best price guarantee', desc: 'We match the lowest available premium for your profile.' },
              { icon: '🔒', title: 'POPIA-compliant',      desc: 'Your data shared only with selected insurers, with consent.' },
              { icon: '📞', title: 'Dedicated support',    desc: 'A specialist will call you to walk through your options.' },
            ].map(b => (
              <div key={b.title} className="flex gap-3">
                <div className="text-2xl shrink-0">{b.icon}</div>
                <div>
                  <p className="text-sm font-black text-gray-900">{b.title}</p>
                  <p className="text-xs text-gray-500">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="text-base font-black text-gray-900">Get Your Quote</h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-gray-700 mb-1">Vehicle Year *</label>
                <input required type="text" value={vehicleYear} onChange={e => setVYear(e.target.value)}
                  placeholder="e.g. 2021"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0866ff]" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-700 mb-1">Make / Model *</label>
                <input required type="text" value={vehicleMake} onChange={e => setVMake(e.target.value)}
                  placeholder="e.g. Toyota Hilux"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0866ff]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-700 mb-1">Registration Number</label>
              <input type="text" value={vehicleReg} onChange={e => setVReg(e.target.value)}
                placeholder="e.g. CA 123 456"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0866ff]" />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-700 mb-1">Your Email *</label>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0866ff]" />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-700 mb-1">Contact Number *</label>
              <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="082 000 0000"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0866ff]" />
            </div>

            <p className="text-[11px] text-gray-400 bg-gray-50 rounded-lg p-2">
              🔒 By submitting, you consent to your details being shared with selected insurance partners for quoting purposes. POPIA compliant.
            </p>

            <button type="submit" disabled={submitting}
              className="w-full py-3 rounded-lg text-sm font-black text-white disabled:opacity-60 hover:opacity-90 transition-opacity"
              style={{ background: '#0866ff' }}>
              {submitting ? 'Submitting…' : 'Get My Quotes'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
