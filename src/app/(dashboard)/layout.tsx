'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

type DemoUser = { email: string; role: string; name: string };

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
    { label: 'Overview',        href: '/dashboard' },
    { label: 'Inventory',       href: '/vendor' },
    { label: 'Add Part',        href: '/listings/new' },
    { label: 'Quote Requests',  href: '/inquiries' },
    { label: 'Profile',         href: '/profile' },
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

const ROLE_LABELS: Record<string, string> = {
  buyer:    'Buyer',
  seller:   'Private Seller',
  dealer:   'Dealer',
  vendor:   'Parts Vendor',
  workshop: 'Workshop',
  admin:    'Administrator',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser]           = useState<DemoUser | null>(null);
  const [sidebarOpen, setSidebar] = useState(false);
  const [mounted, setMounted]     = useState(false);
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('ms_demo_user');
    if (stored) {
      try { setUser(JSON.parse(stored) as DemoUser); } catch { /* ignore */ }
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('ms_demo_user');
    router.push('/');
  };

  if (!mounted || !user) return null;

  const navItems  = NAV_BY_ROLE[user.role] ?? NAV_BY_ROLE.buyer;
  const roleLabel = ROLE_LABELS[user.role] ?? 'User';

  return (
    <div className="min-h-screen flex" style={{ background: '#f4f7fb' }}>

      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 flex flex-col transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        style={{ background: '#121826' }}
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
                onClick={() => setSidebar(false)}
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
            <div className="text-xs font-bold text-white/80">{user.name}</div>
            <div className="text-[11px] text-white/40 truncate">{user.email}</div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-white/50 hover:text-white hover:bg-white/[.08] transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebar(false)}
        />
      )}

      {/* ── Main ────────────────────────────────────────── */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header
          className="sticky top-0 z-20 h-14 flex items-center justify-between px-4 md:px-6 border-b border-black/[.06] shrink-0"
          style={{ background: '#fff' }}
        >
          <button
            onClick={() => setSidebar(s => !s)}
            className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
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
              {user.name[0]?.toUpperCase() ?? 'U'}
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
