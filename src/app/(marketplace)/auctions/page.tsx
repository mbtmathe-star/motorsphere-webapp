import Link from 'next/link';
import Breadcrumb from '@/components/shared/Breadcrumb';
import { allListings } from '@/data/home-data';

const PREVIEW_LISTINGS = allListings.filter(l =>
  ['vehicles', 'trucks-buses', 'parts'].includes(l.type)
).slice(0, 6);

export default function AuctionsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Auctions' }]} />

      {/* Coming soon hero */}
      <div
        className="rounded-2xl p-8 text-center text-white overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg,#121826,#1e3a5f)' }}
      >
        <div className="text-6xl mb-4">🔨</div>
        <div className="inline-block bg-white/10 text-white/80 text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">
          Coming Soon
        </div>
        <h1 className="text-3xl font-black">MotorSphere Auctions</h1>
        <p className="text-white/70 mt-2 text-sm max-w-lg mx-auto">
          Bid on vehicles, parts and salvage lots from verified sellers across South Africa.
          Register your interest and be first to access when auctions go live.
        </p>
        <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
          {[
            { label: 'Live Bidding', icon: '⚡' },
            { label: 'Verified Lots', icon: '🔒' },
            { label: 'Reserve Prices', icon: '💰' },
            { label: 'Instant Payments', icon: '💳' },
          ].map(f => (
            <div key={f.label} className="text-center">
              <div className="text-2xl">{f.icon}</div>
              <p className="text-xs text-white/70 mt-1">{f.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Notify form */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-lg mx-auto text-center">
        <h2 className="text-base font-black text-gray-900">Get notified when auctions launch</h2>
        <p className="text-xs text-gray-500 mt-1">Be first to know when live bidding goes live.</p>
        <div className="flex gap-2 mt-4">
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
      </div>

      {/* Preview listings */}
      <div>
        <h2 className="text-lg font-black text-gray-900 mb-4">
          Listings Available on MotorSphere
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {PREVIEW_LISTINGS.map(listing => (
            <Link
              key={listing.id}
              href={`/listing/${listing.id}`}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={listing.image} alt={listing.title} className="w-full h-36 object-cover" />
                <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  Available Now
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm font-black text-gray-900 truncate">{listing.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{listing.location}</p>
                <p className="text-sm font-black mt-2" style={{ color: '#0866ff' }}>
                  {listing.priceDisplay}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Link href="/category/vehicles" className="text-sm font-bold text-[#0866ff] hover:underline">
          ← Browse available listings now
        </Link>
      </div>
    </div>
  );
}
