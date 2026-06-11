// src/app/page.tsx
import SiteHeader from '@/components/home/SiteHeader';
import AnnouncementTicker from '@/components/home/AnnouncementTicker';
import SponsoredListingsSection from '@/components/home/SponsoredListingsSection';
import FeaturedListingsPreview from '@/components/home/FeaturedListingsPreview';
import FeaturedBusinessesSection from '@/components/home/FeaturedBusinessesSection';
import BrowseCategoriesSection from '@/components/home/BrowseCategoriesSection';
import AuctionOpportunitiesSection from '@/components/home/AuctionOpportunitiesSection';
import AdvertisePartnerSection from '@/components/home/AdvertisePartnerSection';
import TrustSection from '@/components/home/TrustSection';
import SiteFooter from '@/components/home/SiteFooter';

export default function HomePage() {
  return (
    <>
      {/* Dark hero: glassmorphism header, slideshow, search bar */}
      <SiteHeader />

      {/* Purple announcement ticker */}
      <AnnouncementTicker />

      {/* Light-bg content sections */}
      <div style={{ background: '#f4f7fb' }}>
        <div
          className="mx-auto px-[4vw] pb-20"
          style={{ maxWidth: '1240px', marginTop: '-24px' }}
        >
          <SponsoredListingsSection />
          <FeaturedListingsPreview />
          <FeaturedBusinessesSection />
          <BrowseCategoriesSection />
          <AuctionOpportunitiesSection />
          <AdvertisePartnerSection />
          <TrustSection />
        </div>
      </div>

      {/* Footer */}
      <SiteFooter />
    </>
  );
}
