// src/app/page.tsx
import SiteHeader from '@/components/home/SiteHeader';
import SponsoredListingsSection from '@/components/home/SponsoredListingsSection';
import FeaturedListingsPreview from '@/components/home/FeaturedListingsPreview';
import BrowseCategoriesSection from '@/components/home/BrowseCategoriesSection';
import FeaturedBusinessesSection from '@/components/home/FeaturedBusinessesSection';
import AuctionOpportunitiesSection from '@/components/home/AuctionOpportunitiesSection';
import AdvertisePartnerSection from '@/components/home/AdvertisePartnerSection';
import TrustSection from '@/components/home/TrustSection';
import SiteFooter from '@/components/home/SiteFooter';

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <div style={{ background: '#f4f7fb' }}>
        <div className="mx-auto px-[4vw] pb-20 pt-8" style={{ maxWidth: '1240px' }}>
          <SponsoredListingsSection />
          <FeaturedListingsPreview />
          <BrowseCategoriesSection />
          <FeaturedBusinessesSection />
          <AuctionOpportunitiesSection />
          <AdvertisePartnerSection />
          <TrustSection />
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
