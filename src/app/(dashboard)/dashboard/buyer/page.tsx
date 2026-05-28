'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import OnboardingBanner from '@/components/dashboard/OnboardingBanner';
import PackageCard from '@/components/dashboard/PackageCard';

export default function BuyerDashboardPage() {
  const { user, profile } = useAuth();
  if (!user) return null;

  const name = profile?.displayName ?? user.email ?? 'there';

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-black text-gray-900">Welcome back, {name}</h1>
        <p className="text-sm text-gray-500 mt-1">
          Browse, save and compare vehicles, parts and service providers across South Africa.
        </p>
      </div>

      <OnboardingBanner />

      {/* Activity summary — real data deferred to Base 6D */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Saved Listings',   value: profile?.listingCount ?? 0,  href: '/saved',     color: '#0866ff' },
          { label: 'Active Inquiries', value: '—',                         href: '/inquiries', color: '#06b351' },
          { label: 'Recent Views',     value: '—',                         href: '/category/vehicles', color: '#df8a00' },
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

      {/* Marketplace CTAs */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/category/vehicles"
          className="px-5 py-2.5 rounded-lg text-sm font-black text-white hover:opacity-90 transition-opacity"
          style={{ background: '#0866ff' }}
        >
          Browse Vehicles
        </Link>
        <Link
          href="/saved"
          className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          View Saved
        </Link>
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-sm font-black text-gray-700 mb-3">Explore MotorSphere</h2>
        <ul className="space-y-2">
          {[
            { label: 'Search for a Toyota',          href: '/search?q=toyota' },
            { label: 'Browse parts and spares',      href: '/category/parts' },
            { label: 'Find a workshop near you',     href: '/workshops' },
            { label: 'Get a vehicle insurance quote',href: '/insurance' },
          ].map(link => (
            <li key={link.href}>
              <Link href={link.href} className="text-sm font-bold text-[#0866ff] hover:underline">
                → {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <PackageCard />

    </div>
  );
}
