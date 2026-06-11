import Link from 'next/link';
import Breadcrumb from '@/components/shared/Breadcrumb';

export default function PartnershipsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
      <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Partnerships' }]} />

      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-black text-gray-900">Partnership Opportunities</h1>
        <p className="text-gray-500 mt-3 leading-relaxed">
          MotorSphere is building South Africa&rsquo;s leading automotive digital ecosystem.
          We are actively seeking strategic partners across every division — from auction houses
          to insurance providers, dealerships, parts suppliers and advertising partners.
        </p>
      </div>

      {/* Intro */}
      <div
        className="rounded-2xl p-8 text-white text-center"
        style={{ background: 'linear-gradient(135deg,#121826,#0866ff)' }}
      >
        <p className="text-xs font-black uppercase tracking-widest text-white/50 mb-3">Our proposition</p>
        <p className="text-xl font-black leading-snug max-w-2xl mx-auto">
          One platform. Multiple verticals. A national audience of vehicle buyers, sellers,
          dealers and service seekers — all in one trusted digital ecosystem.
        </p>
      </div>

      {/* Auction Partner */}
      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔨</span>
          <div>
            <h2 className="text-xl font-black text-gray-900">Auction House Partners</h2>
            <p className="text-sm text-gray-500">Strategic auction partnership — the primary growth vertical</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">
          MotorSphere is actively seeking established, licensed automotive auction companies to
          partner with. Under this model, the auction partner retains full responsibility for all
          auction operations — MotorSphere provides digital reach and ecosystem integration.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-gray-50 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-black text-gray-800">What the auction partner handles</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {[
                'Auction administration and event management',
                'Vehicle inspections, condition reports and valuations',
                'Bidder registration and KYC/FICA compliance',
                'Reserve price setting and floor operations',
                'Payment processing and settlement',
                'Vehicle transfer (NaTIS) and title documentation',
                'Customer support and dispute resolution',
                'All legal and regulatory obligations',
              ].map(item => (
                <li key={item} className="flex gap-2">
                  <span className="text-gray-400 shrink-0">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl p-5 space-y-3" style={{ background: '#eef5ff' }}>
            <h3 className="text-sm font-black text-gray-800">What MotorSphere provides</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {[
                'Digital exposure across the full MotorSphere platform',
                'Marketing support and content promotion',
                'National buyer and dealer audience reach',
                'Lead generation and qualified buyer referrals',
                'Listing management and digital presentation',
                'Brand promotion within the ecosystem',
                'Seamless integration with our marketplace',
                'Analytics and performance reporting',
              ].map(item => (
                <li key={item} className="flex gap-2">
                  <span className="text-[#0866ff] shrink-0">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-600 leading-relaxed">
            <strong className="text-gray-900">Ideal auction partner:</strong> An established, licensed
            automotive auction company conducting regular vehicle, fleet, repossession or salvage
            auctions — seeking to expand digital reach and attract a wider, qualified buyer pool.
            Partnership terms are discussed directly and tailored to each partner&rsquo;s operations.
          </p>
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* Dealer Partners */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏢</span>
          <h2 className="text-xl font-black text-gray-900">Dealership Partners</h2>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          Registered dealerships can join MotorSphere as verified dealer partners, gaining access
          to dedicated stock management, lead generation, buyer inquiries and a verified profile
          visible to buyers across South Africa.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: '🏪', title: 'Verified profile',   desc: 'Dealer-verified badge and dedicated storefront.' },
            { icon: '📋', title: 'Stock management',   desc: 'Manage your full vehicle inventory in one place.' },
            { icon: '📞', title: 'Lead generation',    desc: 'Qualified buyer inquiries delivered to your dashboard.' },
            { icon: '⭐', title: 'Promoted listings',  desc: 'Feature your stock at the top of search results.' },
          ].map(f => (
            <div key={f.title} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <div className="text-2xl mb-1">{f.icon}</div>
              <p className="text-xs font-black text-gray-900 mb-1">{f.title}</p>
              <p className="text-[11px] text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
        <Link href="/register" className="inline-block text-sm font-bold text-[#0866ff] hover:underline">
          Register as a dealer →
        </Link>
      </section>

      <hr className="border-gray-100" />

      {/* Insurance & Finance */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🛡️</span>
          <h2 className="text-xl font-black text-gray-900">Insurance &amp; Financial Services Partners</h2>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          MotorSphere connects vehicle buyers, sellers and owners with insurance and financial
          service providers. We are building a network of partners in vehicle insurance, vehicle
          finance, extended warranty, GAP cover and tracking products.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: '🛡️', title: 'Vehicle insurance',    desc: 'Reach active vehicle buyers and owners at the moment of purchase or renewal.' },
            { icon: '💳', title: 'Vehicle finance',       desc: 'Connect with buyers actively seeking finance options for new and used vehicle purchases.' },
            { icon: '🔧', title: 'Warranty & protection', desc: 'Offer extended warranty, service plan and GAP cover products to a qualified audience.' },
          ].map(f => (
            <div key={f.title} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="text-2xl mb-2">{f.icon}</div>
              <h3 className="text-sm font-black text-gray-900 mb-1">{f.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* Parts Suppliers */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔧</span>
          <h2 className="text-xl font-black text-gray-900">Parts, Accessories &amp; Supplier Partners</h2>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          Parts vendors, tyre fitment centres, accessory retailers and automotive component
          suppliers can list their inventory on MotorSphere and reach buyers searching for
          compatible products by make, model and year.
        </p>
        <Link href="/register" className="inline-block text-sm font-bold text-[#0866ff] hover:underline">
          Register as a parts vendor →
        </Link>
      </section>

      <hr className="border-gray-100" />

      {/* Advertising */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📣</span>
          <h2 className="text-xl font-black text-gray-900">Advertising Partners</h2>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          MotorSphere offers targeted advertising placements to automotive brands, accessory
          retailers, parts distributors, workshop chains, insurance brands and any business
          seeking to reach South African vehicle owners and automotive professionals.
        </p>
        <Link href="/advertise" className="inline-block text-sm font-bold text-[#0866ff] hover:underline">
          Explore advertising options →
        </Link>
      </section>

      <hr className="border-gray-100" />

      {/* Investor / Stakeholder */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📈</span>
          <h2 className="text-xl font-black text-gray-900">Investor &amp; Stakeholder Enquiries</h2>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          MotorSphere is in active development and is building toward becoming a comprehensive,
          revenue-generating automotive ecosystem. If you are interested in strategic investment,
          stakeholder participation or a formal commercial proposal, please contact us directly.
        </p>
        <p className="text-sm text-gray-500">
          Detailed financial projections, partnership terms and investment proposals are shared
          privately and in confidence — they are not published on this platform.
        </p>
      </section>

      {/* Contact CTA */}
      <div
        className="rounded-2xl p-8 text-white text-center"
        style={{ background: '#0866ff' }}
      >
        <h2 className="text-xl font-black mb-2">Ready to explore a partnership?</h2>
        <p className="text-white/70 text-sm mb-6 max-w-lg mx-auto">
          Whether you are an auction house, insurer, finance provider, dealer group or advertising
          partner — we would like to hear from you. Contact our partnerships team to start the conversation.
        </p>
        <Link
          href="/contact"
          className="inline-block px-8 py-3 rounded-xl text-sm font-black bg-white hover:bg-gray-100 transition-colors"
          style={{ color: '#0866ff' }}
        >
          Contact Our Partnerships Team
        </Link>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/about"    className="font-bold text-[#0866ff] hover:underline">About MotorSphere</Link>
        <Link href="/advertise" className="font-bold text-[#0866ff] hover:underline">Advertise with Us</Link>
        <Link href="/auctions" className="font-bold text-[#0866ff] hover:underline">Auction Partnerships</Link>
        <Link href="/contact"  className="font-bold text-[#0866ff] hover:underline">Contact Us</Link>
      </div>
    </div>
  );
}
