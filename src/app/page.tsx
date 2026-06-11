// src/app/page.tsx
import SiteHeader from '@/components/home/SiteHeader';
import SponsoredListingsSection from '@/components/home/SponsoredListingsSection';
import FeaturedListingsPreview from '@/components/home/FeaturedListingsPreview';
import BrowseCategoriesSection from '@/components/home/BrowseCategoriesSection';
import AuctionOpportunitiesSection from '@/components/home/AuctionOpportunitiesSection';
import ListingPackagesSection from '@/components/home/ListingPackagesSection';
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
          <AuctionOpportunitiesSection />
          <ListingPackagesSection />
          <AdvertisePartnerSection />
          <TrustSection />
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
