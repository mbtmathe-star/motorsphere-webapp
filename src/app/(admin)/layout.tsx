import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAdminAuth } from '@/lib/firebase/admin';
import AppNavBar from '@/components/layout/AppNavBar';
import SiteFooterInner from '@/components/layout/SiteFooterInner';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('__session')?.value;

  if (!session) redirect('/login');

  try {
    const decoded = await getAdminAuth().verifySessionCookie(session, true);
    if (!['admin', 'super_admin'].includes(decoded.role)) redirect('/dashboard');
  } catch {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f4f7fb' }}>
      <AppNavBar />
      <main className="flex-1">{children}</main>
      <SiteFooterInner />
    </div>
  );
}
