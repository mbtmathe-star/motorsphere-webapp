/**
 * src/app/(admin)/layout.tsx
 *
 * Admin route group layout.
 *
 * DEMO MODE: Auth check bypassed for client prototype.
 * Production: Re-enable Firebase Admin verifySessionCookie() before Base 7 launch.
 *
 * Security layers (production):
 *   1. proxy.ts  — UX guard (cookie presence)
 *   2. This layout — cryptographic session + role verify
 *   3. Firebase Rules — actual security boundary
 */

import AppNavBar from '@/components/layout/AppNavBar';
import SiteFooterInner from '@/components/layout/SiteFooterInner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // TODO Base 7: Re-enable Firebase Admin auth check here
  // const cookieStore = await cookies();
  // const session = cookieStore.get('__session')?.value;
  // if (!session) redirect('/login');
  // const decoded = await getAdminAuth().verifySessionCookie(session, true);
  // if (!['admin','super_admin'].includes(decoded.role)) redirect('/dashboard');

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f4f7fb' }}>
      <AppNavBar />
      <main className="flex-1">{children}</main>
      <SiteFooterInner />
    </div>
  );
}
