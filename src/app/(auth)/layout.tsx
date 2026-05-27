import AppNavBar from '@/components/layout/AppNavBar';
import SiteFooterInner from '@/components/layout/SiteFooterInner';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f4f7fb' }}>
      <AppNavBar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        {children}
      </main>
      <SiteFooterInner />
    </div>
  );
}
