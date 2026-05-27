'use client';

import { useState } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/shared/Breadcrumb';

export default function ContactPage() {
  const [step, setStep]       = useState<'form' | 'success'>('form');
  const [submitting, setSub]  = useState(false);
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSub(true);
    await new Promise(r => setTimeout(r, 1000));
    setSub(false);
    setStep('success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact Us' }]} />

      <div>
        <h1 className="text-3xl font-black text-gray-900">Contact Us</h1>
        <p className="text-gray-500 mt-1 text-sm">
          We are here to help. Send us a message and we will respond within 1 business day.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Info */}
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-black text-gray-800 mb-3">Get in touch</h2>
            <div className="space-y-3">
              {[
                { icon: '📧', label: 'Email',   value: 'support@motorsphere.co.za' },
                { icon: '📞', label: 'Phone',   value: '011 000 0000 (Mon–Fri 9–17)' },
                { icon: '🕐', label: 'Response',value: 'Within 1 business day' },
              ].map(item => (
                <div key={item.label} className="flex gap-3">
                  <span className="text-xl shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-xs font-black text-gray-500 uppercase tracking-wide">{item.label}</p>
                    <p className="text-sm font-bold text-gray-800">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-base font-black text-gray-800 mb-3">Quick links</h2>
            <ul className="space-y-2">
              {[
                { label: 'Trust & Safety',    href: '/trust-safety' },
                { label: 'Report a listing',  href: '/report' },
                { label: 'Privacy Policy',    href: '/privacy' },
                { label: 'Terms of Use',      href: '/terms' },
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

        {/* Form */}
        {step === 'success' ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
              style={{ background: '#dcfce7' }}>✅</div>
            <h2 className="text-xl font-black text-gray-900">Message Sent!</h2>
            <p className="text-sm text-gray-500">
              Thanks, <strong>{name}</strong>. We will reply to <strong>{email}</strong> within 1 business day.
            </p>
            <button
              onClick={() => { setStep('form'); setName(''); setEmail(''); setSubject(''); setMessage(''); }}
              className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-gray-700 mb-1">Your Name *</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="John Smith"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0866ff]" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-700 mb-1">Email *</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0866ff]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-700 mb-1">Subject *</label>
              <select required value={subject} onChange={e => setSubject(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0866ff] bg-white">
                <option value="">Select a topic…</option>
                <option value="general">General enquiry</option>
                <option value="listing">Issue with a listing</option>
                <option value="account">Account support</option>
                <option value="verification">Verification query</option>
                <option value="fraud">Report fraud</option>
                <option value="partner">Partnership enquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-700 mb-1">Message *</label>
              <textarea required rows={5} value={message} onChange={e => setMessage(e.target.value)}
                placeholder="Describe your issue or question in detail…"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0866ff] resize-none" />
            </div>

            <button type="submit" disabled={submitting}
              className="w-full py-3 rounded-lg text-sm font-black text-white disabled:opacity-60 hover:opacity-90 transition-opacity"
              style={{ background: '#0866ff' }}>
              {submitting ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
