import Link from 'next/link';
import Breadcrumb from '@/components/shared/Breadcrumb';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]} />

      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-black text-gray-900">About MotorSphere</h1>
        <p className="text-gray-500 mt-3">
          South Africa&rsquo;s first multi-role automotive marketplace — built for buyers, sellers, dealers, vendors and workshops.
        </p>
      </div>

      {/* Mission */}
      <div className="bg-gray-900 rounded-2xl p-8 text-center text-white">
        <p className="text-2xl font-black leading-snug">
          &ldquo;Making every automotive transaction in South Africa safer, faster and more transparent.&rdquo;
        </p>
      </div>

      {/* Story */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 className="text-xl font-black text-gray-900">Our Story</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            The South African automotive market has long lacked a single trusted destination. Buyers juggle multiple platforms.
            Sellers navigate disconnected listing tools. Workshops and parts vendors have no unified digital presence.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            MotorSphere changes that. We built a role-aware platform where each type of user — buyer, private seller,
            dealer, parts vendor, or workshop — gets the tools they actually need.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Every listing is admin-reviewed. Every seller can be verified. Every inquiry stays on-platform until you choose otherwise.
          </p>
        </div>
        <div className="bg-gray-100 rounded-2xl h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-2">🚗</div>
            <p className="text-sm font-bold text-gray-500">South Africa&rsquo;s Automotive Hub</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Categories',    value: '13',  icon: '📋' },
          { label: 'User Roles',    value: '5',   icon: '👥' },
          { label: 'Provinces',     value: '9',   icon: '🗺️' },
          { label: 'Build Stages',  value: '8',   icon: '🏗️' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-5 text-center">
            <div className="text-3xl mb-1">{s.icon}</div>
            <div className="text-2xl font-black text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Values */}
      <section>
        <h2 className="text-xl font-black text-gray-900 mb-5">Our Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: '🔒', title: 'Trust first',      desc: 'Every feature is designed to reduce fraud and increase confidence.' },
            { icon: '🌍', title: 'South Africa first',desc: 'Built for ZAR, POPIA, NaTIS, RMI and local market realities.' },
            { icon: '⚡', title: 'Speed and clarity', desc: 'Fast listings, clear pricing, no hidden steps.' },
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
      <div className="bg-[#0866ff] rounded-2xl p-6 text-center text-white">
        <h2 className="text-xl font-black">Join MotorSphere today</h2>
        <p className="text-white/70 text-sm mt-1">Register as a buyer, seller, dealer, vendor or workshop.</p>
        <div className="flex gap-3 mt-5 justify-center">
          <Link href="/register"
            className="px-6 py-3 rounded-xl text-sm font-black bg-white hover:bg-gray-100 transition-colors"
            style={{ color: '#0866ff' }}>
            Register Free
          </Link>
          <Link href="/category/vehicles"
            className="px-6 py-3 rounded-xl text-sm font-black border border-white/30 text-white hover:bg-white/10 transition-colors">
            Browse Listings
          </Link>
        </div>
      </div>

      <div className="flex gap-4 text-sm">
        <Link href="/trust-safety" className="font-bold text-[#0866ff] hover:underline">Trust &amp; Safety</Link>
        <Link href="/contact" className="font-bold text-[#0866ff] hover:underline">Contact Us</Link>
        <Link href="/privacy" className="font-bold text-[#0866ff] hover:underline">Privacy Policy</Link>
      </div>
    </div>
  );
}
