'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function AppNavBar() {
  const { user, profile, loading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const displayName = profile?.displayName ?? user?.email?.split('@')[0] ?? null;

  return (
    <header
      className="sticky top-0 z-50 h-14 flex items-center justify-between px-[3.8vw] border-b border-white/[.08]"
      style={{ background: '#121826' }}
    >
      {/* Logo */}
      <Link href="/" className="inline-flex items-center gap-2 text-white font-black text-[17px] tracking-tight">
        <span
          className="w-5 h-[15px] inline-block rounded-[3px] shadow-[0_2px_8px_rgba(0,0,0,.25)]"
          style={{ background: 'linear-gradient(135deg,#fff 0 45%,transparent 46%),linear-gradient(45deg,#31c4ff,#06b351)' }}
        />
        <span>MotorSphere SA</span>
      </Link>

      {/* Centre nav */}
      <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
        {[
          { label: 'Vehicles',  href: '/category/vehicles' },
          { label: 'Parts',     href: '/category/parts' },
          { label: 'Workshops', href: '/workshops' },
          { label: 'Insurance', href: '/insurance' },
        ].map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="px-3 py-1.5 rounded-lg text-sm font-bold text-white/80 hover:text-white hover:bg-white/[.08] transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Right actions — auth-aware */}
      <div className="flex items-center gap-2">
        {loading ? (
          // Skeleton while auth resolves — prevents flash of wrong state
          <div className="w-24 h-8 rounded-lg bg-white/10 animate-pulse" />
        ) : user ? (
          // Signed in
          <>
            <Link
              href="/dashboard"
              className="px-3 py-1.5 rounded-lg text-sm font-bold text-white/80 hover:text-white hover:bg-white/[.08] transition-colors"
            >
              {displayName ? `Hi, ${displayName.split(' ')[0]}` : 'Dashboard'}
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 rounded-lg text-sm font-black text-white/70 border border-white/20 hover:text-white hover:bg-white/[.08] transition-colors"
            >
              Sign out
            </button>
          </>
        ) : (
          // Signed out
          <>
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-lg text-sm font-bold text-white/80 hover:text-white hover:bg-white/[.08] transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-1.5 rounded-lg text-sm font-black text-white transition-colors hover:bg-[#064dc1]"
              style={{ background: '#0866ff' }}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
