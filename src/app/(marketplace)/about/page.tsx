import Link from 'next/link';
import Breadcrumb from '@/components/shared/Breadcrumb';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
      <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]} />

      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-black text-gray-900">About MotorSphere</h1>
        <p className="text-gray-500 mt-3 leading-relaxed">
          Connecting South Africa&rsquo;s automotive industry through one digital ecosystem —
          built for buyers, sellers, dealers, service providers, insurers, fleet operators and
          industry partners.
        </p>
      </div>

      {/* Vision */}
      <div className="bg-gray-900 rounded-2xl p-8 text-center text-white">
        <p className="text-xs font-black uppercase tracking-widest text-white/50 mb-3">Our Vision</p>
        <p className="text-xl font-black leading-snug max-w-2xl mx-auto">
          &ldquo;To be the leading digital ecosystem for South Africa&rsquo;s automotive industry —
          connecting every participant in the value chain through one trusted, integrated platform.&rdquo;
        </p>
      </div>

      {/* Mission */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
        <p className="text-xs font-black uppercase tracking-widest text-blue-500 mb-2">Our Mission</p>
        <p className="text-base font-bold text-blue-900 leading-relaxed max-w-2xl mx-auto">
          To connect every participant in South Africa&rsquo;s automotive industry — buyers, sellers,
          dealers, parts vendors, workshops, service providers, insurers and financial institutions —
          through a single, trusted digital platform that simplifies every aspect of vehicle ownership,
          trade and services.
        </p>
      </div>

      {/* The Ecosystem */}
      <section>
        <h2 className="text-2xl font-black text-gray-900 mb-2">The MotorSphere Ecosystem</h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          MotorSphere is not a classifieds website. It is a multi-division digital automotive
          ecosystem designed to bring every part of South Africa&rsquo;s automotive industry into
          one unified platform — with strategic partnerships supporting each vertical.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: '🚗', title: 'Vehicle Marketplace',
              desc: 'Buy and sell cars, bakkies, trucks, buses and commercial vehicles. Private sellers, dealerships and fleet disposals — all in one place.',
            },
            {
              icon: '🔧', title: 'Parts & Accessories',
              desc: 'New and used parts, spares, accessories and fitment services. Compatibility-matched inventory from verified parts vendors nationwide.',
            },
            {
              icon: '🏅', title: 'Workshops & Services',
              desc: 'RMI-accredited and independent workshops, mechanics, panelbeaters, tyre fitment and mobile service providers.',
            },
            {
              icon: '🛡️', title: 'Insurance & Financial Services',
              desc: 'Vehicle insurance comparison, vehicle finance options, warranty products, tracking and protection services — connected to industry partners.',
            },
            {
              icon: '🔨', title: 'Auction Partner Network',
              desc: 'MotorSphere connects buyers with established, licensed automotive auction partners. Auction administration, compliance and transactions are handled by the partner.',
            },
            {
              icon: '🚨', title: 'Roadside & Emergency',
              desc: 'Towing, roadside assistance and emergency support providers across all provinces, available 24 hours a day.',
            },
            {
              icon: '📡', title: 'Fleet & Commercial',
              desc: 'Fleet vehicle sourcing, tracking solutions, commercial vehicle listings and fleet management support for operators of all sizes.',
            },
            {
              icon: '📣', title: 'Advertising & Partnerships',
              desc: 'Targeted digital advertising, sponsored placements, featured listings and strategic partnership opportunities for automotive brands.',
            },
          ].map(item => (
            <div key={item.title} className="bg-white rounded-xl border border-gray-100 p-5 flex gap-4">
              <div className="text-3xl shrink-0">{item.icon}</div>
              <div>
                <h3 className="font-black text-gray-900 text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Strategic Auction Partnership */}
      <section className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-black text-gray-900">Strategic Auction Partnership Model</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          MotorSphere does not directly conduct vehicle auctions. We actively seek partnerships
          with established, licensed auction companies to bring their inventory and reach to our
          platform audience.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Auction partner handles</p>
            <ul className="text-xs text-gray-600 space-y-1.5">
              {[
                'Auction administration and event management',
                'Vehicle inspections, valuations and condition reports',
                'Bidder registration, KYC/FICA and compliance',
                'Payment processing and vehicle transfer (NaTIS)',
                'Legal and regulatory obligations',
              ].map(i => (
                <li key={i} className="flex gap-2"><span className="text-gray-400">·</span>{i}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-black text-gray-700 uppercase tracking-widest mb-2">MotorSphere provides</p>
            <ul className="text-xs text-gray-600 space-y-1.5">
              {[
                'Digital exposure and marketing support',
                'Platform traffic and audience generation',
                'Lead generation and buyer referrals',
                'Listing management and digital presentation',
                'Brand promotion within the ecosystem',
              ].map(i => (
                <li key={i} className="flex gap-2"><span className="text-[#0866ff]">·</span>{i}</li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <Link href="/partnerships" className="text-sm font-bold text-[#0866ff] hover:underline">
            Explore auction partnership opportunities →
          </Link>
        </div>
      </section>

      {/* Market Opportunity */}
      <section>
        <h2 className="text-xl font-black text-gray-900 mb-4">The South African Automotive Market</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
            <p>
              South Africa has one of the most significant automotive markets on the African continent,
              with millions of registered vehicles, a large and growing used-car segment, and a
              fragmented service industry that lacks a unified digital presence.
            </p>
            <p>
              MotorSphere is positioned to consolidate this fragmentation — bringing verified listings,
              trusted service providers, financial products and industry partners into one accessible
              platform built specifically for the South African context: ZAR pricing, NaTIS processes,
              POPIA compliance and province-level discovery.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { stat: 'Multi-division', label: 'Platform ecosystem' },
              { stat: 'Nationwide',     label: 'Province-level reach' },
              { stat: 'POPIA-aligned',  label: 'Data compliance' },
              { stat: 'ZAR-native',     label: 'South African pricing' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                <div className="text-base font-black text-[#0866ff]">{s.stat}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Growth Strategy */}
      <section>
        <h2 className="text-xl font-black text-gray-900 mb-5">Growth Strategy</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              phase: 'Phase 1', title: 'Platform & Marketplace',
              desc: 'Vehicle and parts marketplace live with verified listings, role-based dashboards and admin moderation.',
              status: 'In progress',
              statusColor: '#06b351',
            },
            {
              phase: 'Phase 2', title: 'Service & Partner Network',
              desc: 'Workshops, mechanics, panelbeaters and roadside providers onboarded with directory and booking flows.',
              status: 'Upcoming',
              statusColor: '#df8a00',
            },
            {
              phase: 'Phase 3', title: 'Insurance & Finance Hub',
              desc: 'Insurance comparison, vehicle finance, warranty and tracking products connected through partner integrations.',
              status: 'Upcoming',
              statusColor: '#df8a00',
            },
            {
              phase: 'Phase 4', title: 'Auction Partner Launch',
              desc: 'Live auction partner listings integrated with established auctioneers. Advertising and premium subscriptions.',
              status: 'Planned',
              statusColor: '#8b5cf6',
            },
          ].map(p => (
            <div key={p.phase} className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{p.phase}</span>
              <h3 className="font-black text-gray-900 text-sm mb-2">{p.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed flex-1">{p.desc}</p>
              <div className="mt-3">
                <span
                  className="text-[10px] font-black px-2 py-0.5 rounded-full"
                  style={{ background: `${p.statusColor}20`, color: p.statusColor }}
                >
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Who we serve */}
      <section>
        <h2 className="text-xl font-black text-gray-900 mb-5">Who MotorSphere serves</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { role: 'Private Buyers',        icon: '🔍', desc: 'Search, compare and safely inquire on verified listings.' },
            { role: 'Private Sellers',       icon: '🚗', desc: 'List vehicles with admin approval before marketplace visibility.' },
            { role: 'Dealerships',           icon: '🏢', desc: 'Manage stock, verification and customer leads in one place.' },
            { role: 'Parts Suppliers',       icon: '🔧', desc: 'Reach buyers with compatibility-matched inventory.' },
            { role: 'Workshops',             icon: '🏅', desc: 'Advertise services, display RMI status and receive bookings.' },
            { role: 'Insurance Partners',    icon: '🛡️', desc: 'Connect with vehicle owners actively seeking cover.' },
            { role: 'Auction Partners',      icon: '🔨', desc: 'Reach a national audience through a trusted digital ecosystem.' },
            { role: 'Finance Providers',     icon: '💳', desc: 'Surface finance options to active vehicle buyers and sellers.' },
            { role: 'Fleet Operators',       icon: '🚛', desc: 'Source commercial vehicles, maintenance and tracking solutions.' },
          ].map(item => (
            <div key={item.role} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="text-2xl mb-2">{item.icon}</div>
              <h3 className="font-black text-gray-900 text-sm">{item.role}</h3>
              <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core values */}
      <section>
        <h2 className="text-xl font-black text-gray-900 mb-5">Our core commitments</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: '🔒', title: 'Trust first',        desc: 'Seller verification, admin approval and fraud reporting are built into every listing flow.' },
            { icon: '🌍', title: 'South Africa first', desc: 'Designed for ZAR pricing, POPIA compliance, NaTIS processes and the local automotive market.' },
            { icon: '⚡', title: 'Accessible to all',  desc: 'Listing options for private sellers, dealers, vendors, workshops and service providers of every size.' },
          ].map(v => (
            <div key={v.title} className="bg-white rounded-xl border border-gray-100 p-5 text-center">
              <div className="text-3xl mb-2">{v.icon}</div>
              <h3 className="font-black text-gray-900 text-sm">{v.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="rounded-2xl p-6 text-center text-white" style={{ background: '#0866ff' }}>
        <h2 className="text-xl font-black">Join MotorSphere today</h2>
        <p className="text-white/70 text-sm mt-1">Register as a buyer, seller, dealer, vendor or workshop. Free to join.</p>
        <div className="flex gap-3 mt-5 justify-center flex-wrap">
          <Link href="/register"
            className="px-6 py-3 rounded-xl text-sm font-black bg-white hover:bg-gray-100 transition-colors"
            style={{ color: '#0866ff' }}>
            Register Free
          </Link>
          <Link href="/partnerships"
            className="px-6 py-3 rounded-xl text-sm font-black border border-white/30 text-white hover:bg-white/10 transition-colors">
            Partnership Enquiries
          </Link>
          <Link href="/category/vehicles"
            className="px-6 py-3 rounded-xl text-sm font-black border border-white/30 text-white hover:bg-white/10 transition-colors">
            Browse Listings
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/trust-safety"    className="font-bold text-[#0866ff] hover:underline">Trust &amp; Safety</Link>
        <Link href="/partnerships"    className="font-bold text-[#0866ff] hover:underline">Partnership Opportunities</Link>
        <Link href="/advertise"       className="font-bold text-[#0866ff] hover:underline">Advertise with Us</Link>
        <Link href="/contact"         className="font-bold text-[#0866ff] hover:underline">Contact Us</Link>
        <Link href="/privacy"         className="font-bold text-[#0866ff] hover:underline">Privacy Policy</Link>
      </div>
    </div>
  );
}
