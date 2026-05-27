/**
 * src/app/(admin)/layout.tsx
 *
 * Admin route group layout — Server Component.
 *
 * This performs FULL session cookie verification (not just presence check).
 * Unlike middleware.ts (Edge Runtime — presence check only), this layout
 * uses the Admin SDK to cryptographically verify the session AND check the
 * admin role claim.
 *
 * Security layers:
 *   1. middleware.ts  — redirects if __session cookie absent (UX guard)
 *   2. This layout    — verifies session is valid + user has admin/super_admin role
 *   3. Firebase Rules — enforces on every DB read/write (cannot be bypassed)
 */

import { getAdminAuth } from '@/lib/firebase/admin';
import { cookies }   from 'next/headers';
import { redirect }  from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get('__session')?.value;

  // No session — send to login
  if (!session) {
    redirect('/login');
  }

  try {
    // Full cryptographic verification — checks revocation too
    const decoded = await getAdminAuth().verifySessionCookie(session, true);
    const role = decoded.role as string | undefined;

    // Authenticated but not admin — send to dashboard
    if (!role || !['admin', 'super_admin'].includes(role)) {
      redirect('/dashboard');
    }
  } catch {
    // Invalid, expired, or revoked session
    redirect('/login');
  }

  // Admin verified — render the admin panel
  // TODO: wrap with AdminShell (sidebar, nav) in Base 7
  return (
    <div className="min-h-screen bg-background text-foreground">
      {children}
    </div>
  );
}
