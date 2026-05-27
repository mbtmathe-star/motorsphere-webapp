'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import type { AccountType } from '@/types/firestore.types';

// ── Map accountType → sidebar nav key ────────────────────────────────────────

const ACCOUNT_TYPE_TO_NAV: Record<AccountType, string> = {
  buyer:          'buyer',
  private_seller: 'seller',
  dealer:         'dealer',
  parts_vendor:   'vendor',
  workshop:       'workshop',
  admin_preview:  'admin',
};

// ── Nav items by role ─────────────────────────────────────────────────────────

const NAV_BY_ROLE: Record<string, { label: string; href: string }[]> = {
  buyer: [
    { label: 'Overview',       href: '/dashboard' },
    { label: 'Saved Listings', href: '/saved' },
    { label: 'My Inquiries',   href: '/inquiries' },
    { label: 'Profile',        href: '/profile' },
  ],
  seller: [
    { label: 'Overview',       href: '/dashboard' },
    { label: 'My Listings',    href: '/seller' },
    { label: 'Create Listing', href: '/listings/new' },
    { label: 'Inquiries',      href: '/inquiries' },
    { label: 'Verify Account', href: '/verify' },
    { label: 'Profile',        href: '/profile' },
  ],
  dealer: [
    { label: 'Overview',         href: '/dashboard' },
    { label: 'Stock Management', href: '/dealer' },
    { label: 'Add Stock',        href: '/listings/new' },
    { label: 'Leads',            href: '/inquiries' },
    { label: 'Verify Account',   href: '/verify' },
    { label: 'Profile',          href: '/profile' },
  ],
  vendor: [
    { label: 'Overview',       href: '/dashboard' },
    { label: 'Inventory',      href: '/vendor' },
    { label: 'Add Part',       href: '/listings/new' },
    { label: 'Quote Requests', href: '/inquiries' },
    { label: 'Profile',        href: '/profile' },
  ],
  workshop: [
    { label: 'Overview',         href: '/dashboard' },
    { label: 'Services',         href: '/workshop' },
    { label: 'Booking Requests', href: '/inquiries' },
    { label: 'RMI / Verify',     href: '/verify' },
    { label: 'Profile',          href: '/profile' },
  ],
  admin: [
    { label: 'Moderation', href: '/admin' },
    { label: 'Overview',   href: '/dashboard' },
    { label: 'Profile',    href: '/profile' },
  ],
};

const ROLE_LABELS: Record<AccountType, string> = {
  buyer:          'Buyer',
  private_seller: 'Private Seller',
  dealer:         'Dealer',
  parts_vendor:   'Parts Vendor',
  workshop:       'Workshop',
  admin_preview:  'Admin Preview',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, logout } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();

  // While auth resolves — show nothing to avoid flash
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f4f7fb' }}>
        <div className="w-8 h-8 border-2 border-[#0866ff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not signed in — redirect to login
  if (!user) {
    router.push('/login');
    return null;
  }

  const accountType = profile?.accountType ?? 'buyer';
  const navKey      = ACCOUNT_TYPE_TO_NAV[accountType] ?? 'buyer';
  const navItems    = NAV_BY_ROLE[navKey] ?? NAV_BY_ROLE.buyer;
  const roleLabel   = ROLE_LABELS[accountType] ?? 'User';
  const displayName = profile?.displayName ?? user.email ?? 'User';
  const email       = profile?.email ?? user.email ?? '';

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#f4f7fb' }}>

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside
        className="fixed inset-y-0 left-0 z-40 w-60 flex flex-col md:translate-x-0 -translate-x-full transition-transform duration-200"
        style={{ background: '#121826' }}
        id="ms-sidebar"
      >
        {/* Logo */}
        <div className="h-14 flex items-center px-5 border-b border-white/[.08] shrink-0">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white font-black text-[15px] tracking-tight"
          >
            <span
              className="w-4 h-[11px] inline-block rounded-[3px]"
              style={{ background: 'linear-gradient(135deg,#fff 0 45%,transparent 46%),linear-gradient(45deg,#31c4ff,#06b351)' }}
            />
            <span>MotorSphere</span>
          </Link>
        </div>

        {/* Role badge */}
        <div className="px-5 py-3 border-b border-white/[.06] shrink-0">
          <span
            className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded text-white/60"
            style={{ background: 'rgba(255,255,255,.06)' }}
          >
            {roleLabel}
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                  active ? 'text-white' : 'text-white/60 hover:text-white hover:bg-white/[.08]'
                }`}
                style={active ? { background: '#0866ff' } : {}}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="px-3 py-4 border-t border-white/[.08] space-y-1 shrink-0">
          <div className="px-3 py-1 truncate">
            <div className="text-xs font-bold text-white/80 truncate">{displayName}</div>
            <div className="text-[11px] text-white/40 truncate">{email}</div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-white/50 hover:text-white hover:bg-white/[.08] transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header
          className="sticky top-0 z-20 h-14 flex items-center justify-between px-4 md:px-6 border-b border-black/[.06] shrink-0"
          style={{ background: '#fff' }}
        >
          <div className="hidden md:block text-sm font-bold text-gray-600 capitalize">
            {roleLabel} Portal
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <Link href="/category/vehicles" className="text-xs font-bold text-[#0866ff] hover:underline">
              ← Marketplace
            </Link>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-black"
              style={{ background: '#0866ff' }}
            >
              {displayName[0]?.toUpperCase() ?? 'U'}
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 p-4 md:p-6 max-w-5xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
