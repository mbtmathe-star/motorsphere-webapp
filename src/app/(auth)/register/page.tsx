'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ROLES = [
  { id: 'buyer',    label: 'Buyer',             desc: 'Search, save, compare and inquire on vehicles, parts and services', route: '/buyer' },
  { id: 'seller',   label: 'Private Seller',    desc: 'Create listings, upload vehicle details and track approval status', route: '/seller' },
  { id: 'dealer',   label: 'Dealer',            desc: 'Manage dealership stock, leads and business verification', route: '/dealer' },
  { id: 'vendor',   label: 'Parts Vendor',      desc: 'List parts and spares, manage inventory and respond to inquiries', route: '/vendor' },
  { id: 'workshop', label: 'Workshop / Mechanic', desc: 'Advertise services, receive bookings and display your RMI status', route: '/workshop' },
];

export default function RegisterPage() {
  const router  = useRouter();
  const [step, setStep]                 = useState<'form' | 'role'>('form');
  const [loading, setLoading]           = useState(false);
  const [selectedRole, setSelectedRole] = useState('buyer');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('role');
  };

  const handleRegister = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const role = ROLES.find(r => r.id === selectedRole)!;
    localStorage.setItem('ms_demo_user', JSON.stringify({ ...form, role: selectedRole }));
    router.push(role.route);
  };

  if (step === 'role') {
    return (
      <div className="w-full max-w-[540px] bg-white rounded-[24px] p-8 shadow-[0_20px_40px_rgba(15,23,42,.12)] border border-black/[.06]">
        <button onClick={() => setStep('form')} className="text-[13px] text-[#687589] font-bold mb-4 hover:text-[#121826] flex items-center gap-1">
          ← Back
        </button>
        <h1 className="text-2xl font-black tracking-[-0.04em] text-[#121826] mb-1">Choose your role</h1>
        <p className="text-[#687589] text-sm mb-6">
          Choose the role that best describes how you&rsquo;ll use MotorSphere. This determines your dashboard and available features.
        </p>

        <div className="space-y-2 mb-6">
          {ROLES.map(role => (
            <button key={role.id} onClick={() => setSelectedRole(role.id)}
              className={`w-full text-left rounded-2xl p-4 border-2 transition-all ${
                selectedRole === role.id
                  ? 'border-[#0866ff] bg-[#eef4ff]'
                  : 'border-transparent bg-[#f8fafc] hover:border-[#dbe8ff]'
              }`}>
              <div className="font-black text-[#121826] text-sm">{role.label}</div>
              <div className="text-[#687589] text-xs mt-0.5">{role.desc}</div>
            </button>
          ))}
        </div>

        <label className="flex items-start gap-2.5 text-[13px] text-[#475569] mb-5 cursor-pointer">
          <input type="checkbox" required className="mt-0.5 accent-[#0866ff]" />
          I consent to MotorSphere processing my information for account creation, marketplace safety, seller verification and platform communication in line with POPIA (Act 4 of 2013).
        </label>

        <button onClick={handleRegister} disabled={loading}
          className="w-full rounded-xl py-3 bg-[#0866ff] text-white font-black text-sm hover:bg-[#064dc1] transition-colors disabled:opacity-60">
          {loading ? 'Creating account…' : 'Create Account & Continue'}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[440px] bg-white rounded-[24px] p-8 shadow-[0_20px_40px_rgba(15,23,42,.12)] border border-black/[.06]">
      <h1 className="text-2xl font-black tracking-[-0.04em] text-[#121826] mb-1">Join MotorSphere</h1>
      <p className="text-[#687589] text-sm mb-6">
        Create your MotorSphere account to buy, sell, list, save, inquire and manage automotive services in one place.
      </p>

      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label className="block text-[13px] font-bold text-[#334155] mb-1.5">Full name *</label>
          <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
            placeholder="Your full name"
            className="w-full border border-[#dbe3ee] rounded-xl px-4 py-3 text-sm outline-none bg-white text-[#121826] focus:border-[#0866ff] transition-colors" />
        </div>
        <div>
          <label className="block text-[13px] font-bold text-[#334155] mb-1.5">Email address *</label>
          <input required type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
            placeholder="you@example.com"
            className="w-full border border-[#dbe3ee] rounded-xl px-4 py-3 text-sm outline-none bg-white text-[#121826] focus:border-[#0866ff] transition-colors" />
        </div>
        <div>
          <label className="block text-[13px] font-bold text-[#334155] mb-1.5">Contact number</label>
          <input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))}
            placeholder="+27 ..."
            className="w-full border border-[#dbe3ee] rounded-xl px-4 py-3 text-sm outline-none bg-white text-[#121826] focus:border-[#0866ff] transition-colors" />
        </div>
        <div>
          <label className="block text-[13px] font-bold text-[#334155] mb-1.5">Password *</label>
          <input required type="password" value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))}
            placeholder="Create a secure password"
            className="w-full border border-[#dbe3ee] rounded-xl px-4 py-3 text-sm outline-none bg-white text-[#121826] focus:border-[#0866ff] transition-colors" />
        </div>
        <button type="submit" className="w-full rounded-xl py-3 bg-[#0866ff] text-white font-black text-sm hover:bg-[#064dc1] transition-colors">
          Continue — Choose your role →
        </button>
      </form>

      <p className="text-center text-[13px] text-[#687589] mt-5">
        Already have an account?{' '}
        <Link href="/login" className="text-[#0866ff] font-bold hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
