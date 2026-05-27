// src/app/page.tsx
/**
 * MotorSphere Homepage — Phase 1 client-ready implementation
 * Reference: docs/design-reference.html
 *
 * Phase 1 scope:
 * - Dark automotive hero header with menu/language/settings interactions
 * - Hero ad slideshow (3 rotating banners, 4.5s auto-advance)
 * - Marketplace search bar (pill style with location pin)
 * - Category grid (13 coloured tiles with SVG icons)
 * - Announcement ticker (CSS marquee)
 * - Trust & ecosystem section (split layout with stock collage)
 * - Featured seeded listings (6 cards, static data)
 * - Ecosystem services section (dark section)
 * - How it works (4-step numbered flow)
 * - Role direction section (5 role pills)
 * - CTA section
 * - Footer
 * - Backoffice modal (settings button triggers)
 *
 * Static seeded data only — no Firebase connections.
 */

import SiteHeader from '@/components/home/SiteHeader';
import AnnouncementTicker from '@/components/home/AnnouncementTicker';
import TrustSection from '@/components/home/TrustSection';
import FeaturedListingsPreview from '@/components/home/FeaturedListingsPreview';
import EcosystemSection from '@/components/home/EcosystemSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import RoleDirectionSection from '@/components/home/RoleDirectionSection';
import CTASection from '@/components/home/CTASection';
import SiteFooter from '@/components/home/SiteFooter';

export default function HomePage() {
  return (
    <>
      {/* Dark hero: glassmorphism header, slideshow, search, category grid */}
      <SiteHeader />

      {/* Purple announcement ticker */}
      <AnnouncementTicker />

      {/* Light-bg content sections */}
      <div style={{ background: '#f4f7fb' }}>
        <div
          className="mx-auto px-[4vw] pb-20"
          style={{ maxWidth: '1240px', marginTop: '-24px' }}
        >
          <TrustSection />
          <FeaturedListingsPreview />
          <EcosystemSection />
          <HowItWorksSection />
          <RoleDirectionSection />
          <CTASection />
        </div>
      </div>

      {/* Footer */}
      <SiteFooter />
    </>
  );
}
