import Link from 'next/link';
import Breadcrumb from '@/components/shared/Breadcrumb';

export default function AdvertisePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
      <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Advertise' }]} />

      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-black text-gray-900">Advertise with MotorSphere</h1>
        <p className="text-gray-500 mt-3 leading-relaxed">
          Reach a qualified audience of South African vehicle buyers, sellers, dealers,
          parts seekers and automotive professionals — all in one targeted digital ecosystem.
        </p>
      </div>

      {/* Value proposition */}
      <div
        className="rounded-2xl p-8 text-white"
        style={{ background: 'linear-gradient(135deg,#121826,#0866ff)' }}
      >
        <h2 className="text-xl font-black mb-3">Why advertise on MotorSphere?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { icon: '🎯', title: 'Automotive audience',   desc: 'Every visitor is engaged with vehicles, parts, services or automotive decisions — highly relevant placement.' },
            { icon: '🌍', title: 'National reach',        desc: 'Coverage across all South African provinces, with location-aware listing and discovery.' },
            { icon: '📊', title: 'Qualified intent',      desc: 'Users on MotorSphere are actively buying, selling or seeking services — not casual browsing.' },
          ].map(f => (
            <div key={f.title} className="bg-white/[.10] rounded-xl p-5 border border-white/[.14]">
              <div className="text-2xl mb-2">{f.icon}</div>
              <p className="text-sm font-black mb-1">{f.title}</p>
              <p className="text-xs text-white/70 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Advertising formats */}
      <section className="space-y-5">
        <h2 className="text-xl font-black text-gray-900">Advertising formats</h2>
        <p className="text-sm text-gray-500">
          MotorSphere offers a range of advertising placements suited to different budgets, campaign
          goals and business types. Pricing and availability are discussed directly with our
          partnerships team.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            {
              icon: '🖼️', title: 'Banner Advertising',
              desc: 'Display advertising placements across homepage, category pages and listing detail pages. Targeted by location, category and user role.',
              tags: ['Homepage', 'Category pages', 'Listing pages'],
            },
            {
              icon: '⭐', title: 'Sponsored Listings',
              desc: 'Feature your vehicle, parts or service listings at the top of search results and category pages. Separate from organic listings, clearly labelled.',
              tags: ['Search results', 'Category top', 'Featured tiles'],
            },
            {
              icon: '🏪', title: 'Featured Business Profiles',
              desc: 'Promote your dealership, workshop, parts business or service provider profile as a featured result in directory and search pages.',
              tags: ['Dealer profiles', 'Workshop directory', 'Parts vendors'],
            },
            {
              icon: '📞', title: 'Lead Generation Campaigns',
              desc: 'Capture and route qualified leads directly to your sales team or call centre. Suitable for insurance, finance, warranty and fleet operations.',
              tags: ['Insurance', 'Finance', 'Fleet', 'Warranty'],
            },
          ].map(f => (
            <div key={f.title} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-black text-gray-900 text-base mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-3">{f.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {f.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[10px] font-black px-2 py-0.5 rounded-full"
                    style={{ background: '#eef5ff', color: '#0866ff' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Who should advertise */}
      <section className="space-y-4">
        <h2 className="text-xl font-black text-gray-900">Who should advertise on MotorSphere?</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { icon: '🏢', title: 'Dealer groups',         desc: 'Brand presence, stock promotion and lead capture across multiple branches.' },
            { icon: '🛡️', title: 'Insurance brands',     desc: 'Reach vehicle owners at the point of purchase, renewal or service.' },
            { icon: '💳', title: 'Finance providers',    desc: 'Connect with active buyers seeking vehicle finance options.' },
            { icon: '🔧', title: 'Parts distributors',  desc: 'Promote product ranges to a qualified parts-seeking audience.' },
            { icon: '🏅', title: 'Workshop chains',      desc: 'Grow bookings and brand awareness across your service locations.' },
            { icon: '📡', title: 'Tracking companies',  desc: 'Reach vehicle buyers at the optimal moment to offer tracking solutions.' },
            { icon: '🚛', title: 'Fleet operators',     desc: 'Source vehicles, promote fleet services and reach commercial buyers.' },
            { icon: '🎨', title: 'Accessory brands',    desc: 'Display product ads to vehicle owners actively upgrading or fitting out.' },
            { icon: '📣', title: 'Automotive events',   desc: 'Promote motorsport, trade shows and automotive events to a relevant audience.' },
          ].map(item => (
            <div key={item.title} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="text-2xl mb-1.5">{item.icon}</div>
              <h3 className="text-xs font-black text-gray-900 mb-1">{item.title}</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing note */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
        <h2 className="text-sm font-black text-gray-800 mb-2">Pricing &amp; availability</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Advertising rates and placement availability are not listed publicly. All commercial
          proposals are discussed directly between MotorSphere and the advertising partner to
          ensure the right fit, targeting and campaign structure.
          Contact our team for a tailored media proposal.
        </p>
      </div>

      {/* How it works */}
      <section className="space-y-4">
        <h2 className="text-xl font-black text-gray-900">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { step: '1', title: 'Contact us',         desc: 'Reach out via the contact form with your advertising enquiry.' },
            { step: '2', title: 'Campaign brief',     desc: 'We discuss your goals, audience and placement preferences.' },
            { step: '3', title: 'Proposal',           desc: 'We prepare a tailored placement and pricing proposal for your review.' },
            { step: '4', title: 'Go live',            desc: 'Creative is approved, campaign goes live, and you get a reporting view.' },
          ].map(s => (
            <div key={s.step} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-black mx-auto mb-3"
                style={{ background: '#0866ff' }}
              >
                {s.step}
              </div>
              <h3 className="text-sm font-black text-gray-900 mb-1">{s.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div
        className="rounded-2xl p-8 text-white text-center"
        style={{ background: '#0866ff' }}
      >
        <h2 className="text-xl font-black mb-2">Ready to advertise?</h2>
        <p className="text-white/70 text-sm mb-6 max-w-lg mx-auto">
          Contact our team to discuss your campaign goals, audience targeting and placement options.
          We&rsquo;ll prepare a tailored proposal for your business.
        </p>
        <Link
          href="/contact"
          className="inline-block px-8 py-3 rounded-xl text-sm font-black bg-white hover:bg-gray-100 transition-colors"
          style={{ color: '#0866ff' }}
        >
          Get in Touch
        </Link>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/partnerships"  className="font-bold text-[#0866ff] hover:underline">Partnership Opportunities</Link>
        <Link href="/about"         className="font-bold text-[#0866ff] hover:underline">About MotorSphere</Link>
        <Link href="/contact"       className="font-bold text-[#0866ff] hover:underline">Contact Us</Link>
      </div>
    </div>
  );
}
