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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Insurance & Financial Services' }]} />

      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="text-4xl mb-3">🛡️</div>
        <h1 className="text-3xl font-black text-gray-900">Insurance & Financial Services Hub</h1>
        <p className="text-gray-500 mt-2 text-sm leading-relaxed">
          MotorSphere connects vehicle owners and buyers with insurance providers, vehicle finance
          partners, warranty options and protection services — all in one place.
        </p>
      </div>

      {/* Service categories */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: '🛡️', title: 'Vehicle Insurance',  desc: 'Compare cover options from South African insurance providers.' },
          { icon: '💳', title: 'Vehicle Finance',     desc: 'Connect with vehicle finance options for new and used vehicles.' },
          { icon: '🔧', title: 'Extended Warranty',   desc: 'Mechanical warranty and service plan options for used vehicles.' },
          { icon: '📡', title: 'Vehicle Tracking',    desc: 'GPS tracking and stolen vehicle recovery from verified providers.' },
        ].map(s => (
          <div key={s.title} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <div className="text-2xl mb-2">{s.icon}</div>
            <h3 className="text-xs font-black text-gray-900 mb-1">{s.title}</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Insurance quote form section */}
      <div>
        <h2 className="text-lg font-black text-gray-900 mb-1">Get a Vehicle Insurance Quote</h2>
        <p className="text-sm text-gray-500 mb-6">
          Submit your details and an insurance specialist will contact you with cover options.
        </p>

        {step === 'success' ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"
              style={{ background: '#dcfce7' }}>✅</div>
            <h2 className="text-xl font-black text-gray-900">Quote Request Submitted!</h2>
            <p className="text-sm text-gray-500 mt-2">
              An insurance specialist will contact you within 2 business hours.
            </p>
            <p className="text-xs text-gray-400 mt-1">Contact details sent to <strong>{email}</strong></p>
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
              <h3 className="text-base font-black text-gray-900">Why use MotorSphere for insurance?</h3>
              {[
                { icon: '🔍', title: 'Compare options',       desc: 'Connect with multiple insurance providers from a single quote request.' },
                { icon: '🔒', title: 'POPIA-compliant',       desc: 'Your data is shared only with selected providers, with your explicit consent.' },
                { icon: '📞', title: 'Specialist contact',    desc: 'An insurance specialist will contact you to walk through available options.' },
                { icon: '🛡️', title: 'South African focus',  desc: 'Insurance options relevant to SA vehicles, roads and compliance requirements.' },
              ].map(b => (
                <div key={b.title} className="flex gap-3">
                  <div className="text-2xl shrink-0">{b.icon}</div>
                  <div>
                    <p className="text-sm font-black text-gray-900">{b.title}</p>
                    <p className="text-xs text-gray-500">{b.desc}</p>
                  </div>
                </div>
              ))}

              {/* Soft partner reference */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  South African providers
                </p>
                <p className="text-xs text-gray-500">
                  Your quote request is shared with leading South African insurance providers
                  who are active in the vehicle insurance space. Provider availability may vary.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <h3 className="text-base font-black text-gray-900">Request a Quote</h3>

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
                🔒 By submitting, you consent to your details being shared with selected insurance
                providers for quoting purposes. POPIA compliant. You may withdraw consent at any time.
              </p>

              <button type="submit" disabled={submitting}
                className="w-full py-3 rounded-lg text-sm font-black text-white disabled:opacity-60 hover:opacity-90 transition-opacity"
                style={{ background: '#0866ff' }}>
                {submitting ? 'Submitting…' : 'Request Quotes'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Vehicle Finance */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-base font-black text-gray-900 mb-1">Vehicle Finance</h2>
        <p className="text-sm text-gray-500 mb-4 leading-relaxed">
          MotorSphere is building a network of vehicle finance partners to support buyers purchasing
          through the platform. Finance options will be available for new and used vehicles from
          verified dealers and private sellers.
        </p>
        <span className="inline-block text-[11px] font-black px-3 py-1 rounded-full"
          style={{ background: '#fef9c3', color: '#a16207' }}>
          Coming soon
        </span>
      </div>

      {/* Warranty & Tracking */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="text-2xl mb-2">🔧</div>
          <h3 className="font-black text-gray-900 text-sm mb-1">Extended Warranty</h3>
          <p className="text-xs text-gray-500 leading-relaxed mb-3">
            Mechanical warranty and extended service plan options for used vehicle buyers.
            Protection partner integrations are in development.
          </p>
          <span className="inline-block text-[11px] font-black px-3 py-1 rounded-full"
            style={{ background: '#fef9c3', color: '#a16207' }}>
            Coming soon
          </span>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="text-2xl mb-2">📡</div>
          <h3 className="font-black text-gray-900 text-sm mb-1">Vehicle Tracking</h3>
          <p className="text-xs text-gray-500 leading-relaxed mb-3">
            GPS tracking and stolen vehicle recovery service providers available in the
            MotorSphere directory. Connect directly with tracking providers.
          </p>
          <Link href="/category/tracking" className="text-xs font-bold text-[#0866ff] hover:underline">
            Browse tracking providers →
          </Link>
        </div>
      </div>

      {/* Partner CTA */}
      <div className="bg-gray-900 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-white">Are you an insurance or finance provider?</h2>
          <p className="text-sm text-white/60 mt-1">
            Partner with MotorSphere to reach active vehicle buyers and owners across South Africa.
          </p>
        </div>
        <Link href="/partnerships"
          className="shrink-0 px-6 py-3 rounded-xl text-sm font-black text-white hover:opacity-90 transition-colors"
          style={{ background: '#0866ff' }}>
          Partnership enquiries
        </Link>
      </div>
    </div>
  );
}
