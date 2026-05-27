'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/firebase/auth';
import { createUserProfile } from '@/lib/firebase/users';
import type { AccountType } from '@/types/firestore.types';

type Step = 'form' | 'role';

interface FormData {
  name:     string;
  email:    string;
  phone:    string;
  password: string;
}

interface RoleOption {
  id:    AccountType;
  label: string;
  desc:  string;
}

const ROLES: RoleOption[] = [
  {
    id:    'buyer',
    label: 'Buyer',
    desc:  'Search, save, compare and inquire on vehicles, parts and services across South Africa.',
  },
  {
    id:    'private_seller',
    label: 'Private Seller',
    desc:  'Create listings, upload vehicle details and track admin approval status before going live.',
  },
  {
    id:    'dealer',
    label: 'Registered Dealer',
    desc:  'Manage dealership stock, leads and your verified business profile on MotorSphere.',
  },
  {
    id:    'parts_vendor',
    label: 'Parts Vendor',
    desc:  'List parts and spares, manage inventory and respond to buyer inquiries.',
  },
  {
    id:    'workshop',
    label: 'Workshop / Mechanic',
    desc:  'Advertise services, receive booking requests and display your RMI verification status.',
  },
];

// Map Firebase Auth error codes to friendly messages
function friendlyError(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please sign in instead.';
    case 'auth/weak-password':
      return 'Your password must be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/network-request-failed':
      return 'A network error occurred. Please check your connection and try again.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

export default function RegisterPage() {
  const router = useRouter();
  const [step,          setStep]         = useState<Step>('form');
  const [loading,       setLoading]      = useState(false);
  const [error,         setError]        = useState<string | null>(null);
  const [selectedRole,  setSelectedRole] = useState<AccountType>('buyer');
  const [popiaAccepted, setPopiAccepted] = useState(false);
  const [form, setForm] = useState<FormData>({
    name: '', email: '', phone: '', password: '',
  });

  // ── Step 1: validate form fields ─────────────────────────────────────────────
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.password.length < 6) {
      setError('Your password must be at least 6 characters.');
      return;
    }
    setStep('role');
  };

  // ── Step 2: create account + profile ─────────────────────────────────────────
  const handleRegister = async () => {
    if (!popiaAccepted) {
      setError('Please accept the POPIA consent before continuing.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      // 1. Create Firebase Auth user + set session cookie
      const credential = await signUp(form.email, form.password, form.name);

      // 2. Create Firestore user profile
      await createUserProfile({
        uid:                  credential.user.uid,
        displayName:          form.name,
        email:                form.email,
        phone:                form.phone,
        accountType:          selectedRole,
        popiaConsentAccepted: true,
      });

      // 3. Navigate to dashboard — auth state will resolve via AuthProvider
      router.push('/dashboard');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      setError(friendlyError(code));
      setLoading(false);
    }
  };

  // ── Step 2: Role selection ────────────────────────────────────────────────────
  if (step === 'role') {
    return (
      <div className="w-full max-w-[540px] bg-white rounded-[24px] p-8 shadow-[0_20px_40px_rgba(15,23,42,.12)] border border-black/[.06]">
        <button
          onClick={() => { setStep('form'); setError(null); }}
          className="text-[13px] text-[#687589] font-bold mb-4 hover:text-[#121826] flex items-center gap-1"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-black tracking-[-0.04em] text-[#121826] mb-1">Choose your role</h1>
        <p className="text-[#687589] text-sm mb-6">
          Choose the role that best describes how you&rsquo;ll use MotorSphere. This determines your dashboard and available features.
        </p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-2 mb-6">
          {ROLES.map(role => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`w-full text-left rounded-2xl p-4 border-2 transition-all ${
                selectedRole === role.id
                  ? 'border-[#0866ff] bg-[#eef4ff]'
                  : 'border-transparent bg-[#f8fafc] hover:border-[#dbe8ff]'
              }`}
            >
              <div className="font-black text-[#121826] text-sm">{role.label}</div>
              <div className="text-[#687589] text-xs mt-0.5">{role.desc}</div>
            </button>
          ))}
        </div>

        <label className="flex items-start gap-2.5 text-[13px] text-[#475569] mb-5 cursor-pointer">
          <input
            type="checkbox"
            checked={popiaAccepted}
            onChange={e => setPopiAccepted(e.target.checked)}
            className="mt-0.5 accent-[#0866ff]"
          />
          <span>
            I consent to MotorSphere processing my information for account creation, marketplace safety, seller verification and platform communication in line with POPIA (Act 4 of 2013).
          </span>
        </label>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full rounded-xl py-3 bg-[#0866ff] text-white font-black text-sm hover:bg-[#064dc1] transition-colors disabled:opacity-60"
        >
          {loading ? 'Creating your account…' : 'Create Account & Continue'}
        </button>
      </div>
    );
  }

  // ── Step 1: Account details form ─────────────────────────────────────────────
  return (
    <div className="w-full max-w-[440px] bg-white rounded-[24px] p-8 shadow-[0_20px_40px_rgba(15,23,42,.12)] border border-black/[.06]">
      <h1 className="text-2xl font-black tracking-[-0.04em] text-[#121826] mb-1">Join MotorSphere</h1>
      <p className="text-[#687589] text-sm mb-6">
        Create your MotorSphere account to buy, sell, list, save, inquire and manage automotive services in one place.
      </p>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label className="block text-[13px] font-bold text-[#334155] mb-1.5">Full name *</label>
          <input
            required
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Your full name"
            className="w-full border border-[#dbe3ee] rounded-xl px-4 py-3 text-sm outline-none bg-white text-[#121826] focus:border-[#0866ff] transition-colors"
          />
        </div>
        <div>
          <label className="block text-[13px] font-bold text-[#334155] mb-1.5">Email address *</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="you@example.com"
            className="w-full border border-[#dbe3ee] rounded-xl px-4 py-3 text-sm outline-none bg-white text-[#121826] focus:border-[#0866ff] transition-colors"
          />
        </div>
        <div>
          <label className="block text-[13px] font-bold text-[#334155] mb-1.5">Contact number</label>
          <input
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            placeholder="+27 ..."
            className="w-full border border-[#dbe3ee] rounded-xl px-4 py-3 text-sm outline-none bg-white text-[#121826] focus:border-[#0866ff] transition-colors"
          />
        </div>
        <div>
          <label className="block text-[13px] font-bold text-[#334155] mb-1.5">Password *</label>
          <input
            required
            type="password"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            placeholder="Create a secure password (min. 6 characters)"
            className="w-full border border-[#dbe3ee] rounded-xl px-4 py-3 text-sm outline-none bg-white text-[#121826] focus:border-[#0866ff] transition-colors"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl py-3 bg-[#0866ff] text-white font-black text-sm hover:bg-[#064dc1] transition-colors"
        >
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
