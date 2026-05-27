'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/firebase/auth';

// Map Firebase Auth error codes to friendly user-facing messages
function friendlyError(code: string): string {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-email':
      return 'We could not sign you in. Please check your email and password.';
    case 'auth/user-disabled':
      return 'This account has been suspended. Please contact support.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment before trying again.';
    case 'auth/network-request-failed':
      return 'A network error occurred. Please check your connection and try again.';
    default:
      return 'We could not sign you in. Please check your details.';
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(email, password);
      // Session cookie is now set — navigate to dashboard
      router.push('/dashboard');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      setError(friendlyError(code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] bg-white rounded-[24px] p-8 shadow-[0_20px_40px_rgba(15,23,42,.12)] border border-black/[.06]">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-[-0.04em] text-[#121826] mb-1">Welcome back</h1>
        <p className="text-[#687589] text-sm">Sign in to access your MotorSphere dashboard and listings.</p>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[13px] font-bold text-[#334155] mb-1.5">Email address</label>
          <input
            required
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full border border-[#dbe3ee] rounded-xl px-4 py-3 text-sm outline-none bg-white text-[#121826] focus:border-[#0866ff] transition-colors"
          />
        </div>
        <div>
          <label className="block text-[13px] font-bold text-[#334155] mb-1.5">Password</label>
          <input
            required
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Your password"
            className="w-full border border-[#dbe3ee] rounded-xl px-4 py-3 text-sm outline-none bg-white text-[#121826] focus:border-[#0866ff] transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl py-3 bg-[#0866ff] text-white font-black text-sm hover:bg-[#064dc1] transition-colors disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <div className="mt-5 pt-5 border-t border-[#eef2f7] text-center space-y-2">
        <p className="text-[13px] text-[#687589]">
          Don&rsquo;t have an account?{' '}
          <Link href="/register" className="text-[#0866ff] font-bold hover:underline">Create account</Link>
        </p>
        <p className="text-[13px] text-[#687589]">
          <Link href="/trust-safety" className="text-[#0866ff] font-bold hover:underline">Trust &amp; Safety</Link>
          {' · '}
          <Link href="/privacy" className="text-[#0866ff] font-bold hover:underline">Privacy / POPIA</Link>
        </p>
      </div>
    </div>
  );
}
