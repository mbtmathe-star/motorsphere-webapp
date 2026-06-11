import Link from 'next/link';
import Breadcrumb from '@/components/shared/Breadcrumb';

export default function AuctionsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Auctions' }]} />

      {/* Hero */}
      <div
        className="rounded-2xl p-8 text-center text-white overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg,#121826,#1e3a5f)' }}
      >
        <div className="text-6xl mb-4">🔨</div>
        <div className="inline-block bg-white/10 text-white/80 text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">
          Partnership Programme
        </div>
        <h1 className="text-3xl font-black">Automotive Auctions on MotorSphere</h1>
        <p className="text-white/70 mt-2 text-sm max-w-xl mx-auto">
          MotorSphere is building a strategic auction partnership network to connect South Africa&rsquo;s
          established automotive auctioneers with our marketplace audience of buyers, dealers and
          fleet operators — all in one digital ecosystem.
        </p>
      </div>

      {/* What the model is */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-6">
        <h2 className="text-xl font-black text-gray-900">How the auction partnership works</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          MotorSphere does not directly conduct, administer or operate vehicle auctions.
          We partner with established, licensed auction companies who manage all regulatory,
          operational and transactional aspects of the auction process.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* What the auction partner does */}
          <div className="bg-gray-50 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-black text-gray-800">What our auction partner handles</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {[
                'Auction administration and event management',
                'Vehicle inspections and condition reports',
                'Valuations and reserve-price setting',
                'Bidder registration and KYC/FICA compliance',
                'Payment processing and transaction settlement',
                'Vehicle transfer (NaTIS) and title documentation',
                'Customer support and dispute resolution',
                'All legal and regulatory obligations',
              ].map(item => (
                <li key={item} className="flex gap-2">
                  <span className="text-[#0866ff] shrink-0 font-black">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What MotorSphere provides */}
          <div className="rounded-xl p-5 space-y-3" style={{ background: '#eef5ff' }}>
            <h3 className="text-sm font-black text-gray-800">What MotorSphere provides</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {[
                'Digital exposure across the MotorSphere platform',
                'Marketing support and content promotion',
                'Traffic and audience generation',
                'Lead generation and buyer referrals',
                'Listing management and digital presentation',
                'Brand promotion within the ecosystem',
                'Access to verified dealer and seller network',
                'Integrated marketplace discovery',
              ].map(item => (
                <li key={item} className="flex gap-2">
                  <span className="text-[#06b351] shrink-0 font-black">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Who should partner */}
      <div className="bg-gray-900 rounded-2xl p-6 md:p-8 text-white">
        <h2 className="text-xl font-black mb-2">Are you an established auction house?</h2>
        <p className="text-sm text-white/70 leading-relaxed mb-6 max-w-2xl">
          MotorSphere is actively seeking partnership agreements with reputable, licensed automotive
          auction companies across South Africa. If you run vehicle auctions — including cars,
          trucks, fleet, salvage or repo stock — we want to hear from you.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { icon: '📡', title: 'Reach',    desc: 'Tap into MotorSphere\'s growing buyer and dealer audience across all provinces.' },
            { icon: '🔗', title: 'Exposure', desc: 'Your auction listings featured prominently within a trusted automotive ecosystem.' },
            { icon: '📊', title: 'Leads',    desc: 'Qualified buyer referrals directed to your platform and registration process.' },
          ].map(f => (
            <div key={f.title} className="bg-white/[.08] rounded-xl p-4 border border-white/[.12]">
              <div className="text-2xl mb-2">{f.icon}</div>
              <p className="text-sm font-black text-white mb-1">{f.title}</p>
              <p className="text-xs text-white/60">{f.desc}</p>
            </div>
          ))}
        </div>
        <Link
          href="/partnerships"
          className="inline-block px-6 py-3 rounded-xl text-sm font-black text-white hover:opacity-90 transition-opacity"
          style={{ background: '#0866ff' }}
        >
          Explore partnership opportunities →
        </Link>
      </div>

      {/* Buyer interest capture */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-lg mx-auto text-center">
        <h2 className="text-base font-black text-gray-900">Interested in auction listings?</h2>
        <p className="text-xs text-gray-500 mt-1 mb-4">
          Register your interest and we&rsquo;ll notify you when auction partner listings become available on MotorSphere.
        </p>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0866ff]"
          />
          <button
            className="px-4 py-2.5 rounded-lg text-sm font-black text-white hover:opacity-90 transition-opacity"
            style={{ background: '#0866ff' }}
          >
            Notify Me
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-3">
          No spam. We&rsquo;ll only contact you when auction listings are available.
        </p>
      </div>

      {/* Browse existing marketplace */}
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-500">Looking for vehicles available now?</p>
        <Link href="/category/vehicles" className="text-sm font-bold text-[#0866ff] hover:underline">
          Browse verified vehicle listings →
        </Link>
      </div>
    </div>
  );
}
