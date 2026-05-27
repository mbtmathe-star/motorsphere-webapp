'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type DemoUser = { email: string; role: string; name: string };

type HubConfig = {
  greeting: string;
  desc: string;
  primaryCta: string;
  primaryHref: string;
  secondaryCta: string;
  secondaryHref: string;
  stats: { label: string; value: string; href: string; color: string }[];
  quickLinks: { label: string; href: string }[];
};

const HUBS: Record<string, HubConfig> = {
  buyer: {
    greeting: 'Welcome back',
    desc: 'Track saved listings, manage inquiries and compare vehicles, parts and service providers.',
    primaryCta: 'Browse Vehicles',
    primaryHref: '/category/vehicles',
    secondaryCta: 'View Saved',
    secondaryHref: '/saved',
    stats: [
      { label: 'Saved Listings',  value: '3',  href: '/saved',              color: '#0866ff' },
      { label: 'Active Inquiries',value: '1',  href: '/inquiries',          color: '#06b351' },
      { label: 'Recent Views',    value: '12', href: '/category/vehicles',  color: '#df8a00' },
    ],
    quickLinks: [
      { label: 'Search for a Toyota',  href: '/search?q=toyota' },
      { label: 'Browse parts',         href: '/category/parts' },
      { label: 'Find a workshop near you', href: '/workshops' },
      { label: 'Get a vehicle insurance quote', href: '/insurance' },
    ],
  },
  seller: {
    greeting: 'Seller Hub',
    desc: 'Create listings, upload vehicle details and track your approval status before going live.',
    primaryCta: 'Create Listing',
    primaryHref: '/listings/new',
    secondaryCta: 'View My Listings',
    secondaryHref: '/seller',
    stats: [
      { label: 'Active Listings',   value: '1', href: '/seller',   color: '#06b351' },
      { label: 'Pending Approval',  value: '1', href: '/seller',   color: '#df8a00' },
      { label: 'Inquiries Received',value: '2', href: '/inquiries',color: '#0866ff' },
    ],
    quickLinks: [
      { label: 'Create new listing', href: '/listings/new' },
      { label: 'Verify account',     href: '/verify' },
      { label: 'View inquiries',     href: '/inquiries' },
    ],
  },
  dealer: {
    greeting: 'Dealer Dashboard',
    desc: 'Manage dealership stock, leads, business information and verification status on MotorSphere.',
    primaryCta: 'Add Stock',
    primaryHref: '/listings/new',
    secondaryCta: 'View Stock',
    secondaryHref: '/dealer',
    stats: [
      { label: 'Vehicles in Stock', value: '12', href: '/dealer',   color: '#06b351' },
      { label: 'Active Leads',      value: '5',  href: '/inquiries',color: '#0866ff' },
      { label: 'Pending Listings',  value: '2',  href: '/dealer',   color: '#df8a00' },
    ],
    quickLinks: [
      { label: 'Add new vehicle',     href: '/listings/new' },
      { label: 'View all leads',      href: '/inquiries' },
      { label: 'Verify dealership',   href: '/verify' },
    ],
  },
  vendor: {
    greeting: 'Parts Vendor Hub',
    desc: 'Manage parts inventory, compatibility details, inquiries and your supplier visibility on MotorSphere.',
    primaryCta: 'Add Part',
    primaryHref: '/listings/new',
    secondaryCta: 'Manage Inventory',
    secondaryHref: '/vendor',
    stats: [
      { label: 'Parts Listed',       value: '28', href: '/vendor',   color: '#06b351' },
      { label: 'Quote Requests',     value: '4',  href: '/inquiries',color: '#0866ff' },
      { label: 'Low Stock Alerts',   value: '3',  href: '/vendor',   color: '#ff3d0a' },
    ],
    quickLinks: [
      { label: 'Add new part',           href: '/listings/new' },
      { label: 'View quote requests',    href: '/inquiries' },
      { label: 'Update profile',         href: '/profile' },
    ],
  },
  workshop: {
    greeting: 'Workshop Dashboard',
    desc: 'Manage services, quote requests, RMI status and customer leads. Build your automotive service profile on MotorSphere.',
    primaryCta: 'Manage Services',
    primaryHref: '/workshop',
    secondaryCta: 'View Bookings',
    secondaryHref: '/inquiries',
    stats: [
      { label: 'Services Listed',  value: '6',       href: '/workshop',  color: '#06b351' },
      { label: 'Booking Requests', value: '3',       href: '/inquiries', color: '#0866ff' },
      { label: 'RMI Status',       value: 'Pending', href: '/verify',    color: '#df8a00' },
    ],
    quickLinks: [
      { label: 'Apply for RMI badge',     href: '/verify' },
      { label: 'View booking requests',   href: '/inquiries' },
      { label: 'Update services',         href: '/workshop' },
    ],
  },
  admin: {
    greeting: 'Admin Panel',
    desc: 'Review listings, approve or reject submissions, monitor flagged content and support marketplace integrity.',
    primaryCta: 'Go to Moderation',
    primaryHref: '/admin',
    secondaryCta: 'View Audit Log',
    secondaryHref: '/admin',
    stats: [
      { label: 'Pending Listings', value: '7', href: '/admin', color: '#df8a00' },
      { label: 'Flagged Listings', value: '2', href: '/admin', color: '#ff3d0a' },
      { label: 'Verifications',    value: '3', href: '/admin', color: '#0866ff' },
    ],
    quickLinks: [
      { label: 'Review pending listings', href: '/admin' },
      { label: 'Check verifications',     href: '/admin' },
      { label: 'View fraud flags',        href: '/admin' },
    ],
  },
};

export default function DashboardPage() {
  const [user, setUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('ms_demo_user');
    if (stored) {
      try { setUser(JSON.parse(stored) as DemoUser); } catch { /* ignore */ }
    }
  }, []);

  if (!user) return null;

  const hub = HUBS[user.role] ?? HUBS.buyer;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">
          {hub.greeting}, {user.name}
        </h1>
        <p className="text-sm text-gray-500 mt-1">{hub.desc}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {hub.stats.map(stat => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
          >
            <div className="text-2xl font-black" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex flex-wrap gap-3">
        <Link
          href={hub.primaryHref}
          className="px-5 py-2.5 rounded-lg text-sm font-black text-white hover:opacity-90 transition-opacity"
          style={{ background: '#0866ff' }}
        >
          {hub.primaryCta}
        </Link>
        <Link
          href={hub.secondaryHref}
          className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          {hub.secondaryCta}
        </Link>
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-sm font-black text-gray-700 mb-3">Quick actions</h2>
        <ul className="space-y-2">
          {hub.quickLinks.map(link => (
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
