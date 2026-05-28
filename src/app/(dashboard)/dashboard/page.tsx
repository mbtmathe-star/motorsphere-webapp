'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { toNavKey } from '@/lib/accountType';
import { getRoleDashboardPath } from '@/lib/permissions';
import OnboardingBanner from '@/components/dashboard/OnboardingBanner';

// ── Verification status display ───────────────────────────────────────────────

function verificationLabel(status: string | undefined): { label: string; color: string } {
  switch (status) {
    case 'not_required':   return { label: 'Not required', color: '#64748b' };
    case 'not_started':    return { label: 'Not started',  color: '#dc2626' };
    case 'submitted':      return { label: 'Under review', color: '#d97706' };
    case 'pending_review': return { label: 'Pending review', color: '#d97706' };
    case 'approved':       return { label: 'Approved ✓',   color: '#16a34a' };
    case 'rejected':       return { label: 'Rejected',     color: '#dc2626' };
    default:               return { label: 'Not started',  color: '#dc2626' };
  }
}

function accountStatusLabel(status: string | undefined): { label: string; color: string } {
  switch (status) {
    case 'active':    return { label: 'Active',    color: '#16a34a' };
    case 'suspended': return { label: 'Suspended', color: '#dc2626' };
    case 'deleted':   return { label: 'Deleted',   color: '#dc2626' };
    default:          return { label: 'Active',    color: '#16a34a' };
  }
}

// ── Role-specific quick links ─────────────────────────────────────────────────

const QUICK_LINKS: Record<string, { label: string; href: string }[]> = {
  buyer: [
    { label: 'Browse vehicles',              href: '/category/vehicles' },
    { label: 'Search for parts',             href: '/category/parts' },
    { label: 'Find a workshop',              href: '/workshops' },
    { label: 'View saved listings',          href: '/saved' },
  ],
  seller: [
    { label: 'Complete verification',        href: '/dashboard/verification' },
    { label: 'View my listings',             href: '/dashboard/seller' },
    { label: 'Browse the marketplace',       href: '/category/vehicles' },
  ],
  dealer: [
    { label: 'Complete verification',        href: '/dashboard/verification' },
    { label: 'View stock management',        href: '/dashboard/dealer' },
    { label: 'Browse the marketplace',       href: '/category/vehicles' },
  ],
  vendor: [
    { label: 'Complete verification',        href: '/dashboard/verification' },
    { label: 'View inventory',               href: '/dashboard/vendor' },
    { label: 'Browse the marketplace',       href: '/category/parts' },
  ],
  workshop: [
    { label: 'Complete verification',        href: '/dashboard/verification' },
    { label: 'View services',                href: '/dashboard/workshop' },
    { label: 'View the workshop directory',  href: '/workshops' },
  ],
  admin: [
    { label: 'Go to moderation',             href: '/admin' },
    { label: 'Admin hub',                    href: '/dashboard/admin' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user, profile } = useAuth();

  if (!user) return null;

  const navKey    = toNavKey(profile?.accountType);
  const quickLinks = QUICK_LINKS[navKey] ?? QUICK_LINKS.buyer;
  const name      = profile?.displayName ?? user.email ?? 'there';

  const vStatus   = verificationLabel(profile?.verificationStatus);
  const aStatus   = accountStatusLabel(profile?.accountStatus);
  const rolePath  = getRoleDashboardPath(profile?.accountType);

  return (
    <div className="space-y-6">

      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Welcome back, {name}</h1>
        <p className="text-sm text-gray-500 mt-1">
          Here&apos;s an overview of your MotorSphere account.
        </p>
      </div>

      {/* Onboarding banner */}
      <OnboardingBanner />

      {/* Account status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="text-xs text-gray-400 font-bold mb-1">Account status</div>
          <div className="text-lg font-black" style={{ color: aStatus.color }}>{aStatus.label}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="text-xs text-gray-400 font-bold mb-1">Verification</div>
          <div className="text-lg font-black" style={{ color: vStatus.color }}>{vStatus.label}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="text-xs text-gray-400 font-bold mb-1">Current plan</div>
          <div className="text-lg font-black text-gray-900">{profile?.packageName ?? 'Free'}</div>
        </div>
      </div>

      {/* CTA row */}
      <div className="flex flex-wrap gap-3">
        <Link
          href={rolePath}
          className="px-5 py-2.5 rounded-lg text-sm font-black text-white hover:opacity-90 transition-opacity"
          style={{ background: '#0866ff' }}
        >
          Go to my dashboard →
        </Link>
        <Link
          href="/dashboard/verification"
          className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          {profile?.onboardingComplete ? 'View verification status' : 'Complete onboarding'}
        </Link>
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-sm font-black text-gray-700 mb-3">Quick actions</h2>
        <ul className="space-y-2">
          {quickLinks.map(link => (
            <li key={link.href}>
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
