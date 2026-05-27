import AppNavBar from '@/components/layout/AppNavBar';
import SiteFooterInner from '@/components/layout/SiteFooterInner';

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f4f7fb' }}>
      <AppNavBar />
      <main className="flex-1">{children}</main>
      <SiteFooterInner />
    </div>
  );
}
