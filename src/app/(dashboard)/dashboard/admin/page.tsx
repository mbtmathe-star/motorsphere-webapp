'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { canAccessAdmin } from '@/lib/permissions';

export default function AdminDashboardPage() {
  const { user, profile } = useAuth();
  if (!user) return null;

  if (!canAccessAdmin(profile)) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <p className="text-sm font-bold text-gray-500">
          You do not have access to the admin area.
        </p>
      </div>
    );
  }

  const name = profile?.displayName ?? user.email ?? 'Admin';

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-black text-gray-900">Admin Hub</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome, {name}. Review listings, moderate content and manage platform integrity.
        </p>
      </div>

      {/* Admin quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Pending Listings',   value: '—', href: '/admin', color: '#df8a00' },
          { label: 'Flagged Listings',   value: '—', href: '/admin', color: '#ff3d0a' },
          { label: 'Pending Verifications', value: '—', href: '/admin', color: '#0866ff' },
        ].map(stat => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
          >
            <div className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin"
          className="px-5 py-2.5 rounded-lg text-sm font-black text-white hover:opacity-90 transition-opacity"
          style={{ background: '#0866ff' }}
        >
          Go to Moderation
        </Link>
      </div>

      {/* Admin quick links */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-sm font-black text-gray-700 mb-3">Admin actions</h2>
        <ul className="space-y-2">
          {[
            { label: 'Review pending listings',     href: '/admin' },
            { label: 'Check verification queue',    href: '/admin' },
            { label: 'Review flagged content',      href: '/admin' },
            { label: 'View audit log',              href: '/admin' },
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
  );
}
