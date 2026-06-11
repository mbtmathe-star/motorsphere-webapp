// src/components/home/AuctionOpportunitiesSection.tsx
import Link from 'next/link';

const features = [
  {
    num: '01',
    title: 'Partner-run auctions',
    desc: 'All events operated by licensed, independent auction companies — not MotorSphere directly.',
  },
  {
    num: '02',
    title: 'National reach',
    desc: 'Access auction opportunities across all South African provinces through a growing partner network.',
  },
  {
    num: '03',
    title: 'Qualified buyer referrals',
    desc: 'MotorSphere provides digital reach and buyer referrals to support our auction partners’ events.',
  },
];

export default function AuctionOpportunitiesSection() {
  return (
    <section
      className="mb-10 rounded-[26px] overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, rgba(6,18,45,.98) 0%, rgba(8,28,60,.96) 55%, rgba(4,40,24,.95) 100%), ' +
          'url("https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1600&q=80") center / cover',
        boxShadow: '0 16px 48px rgba(0,0,0,.38)',
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_.85fr] gap-8 p-[clamp(28px,5vw,54px)]">

        {/* Left — editorial text */}
        <div>
          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/[.10] text-white border border-white/[.14] text-[11px] font-black uppercase tracking-[.08em] mb-5">
            Auction opportunities
          </span>

          <h2 className="m-0 mb-5 text-[clamp(26px,4vw,44px)] font-black tracking-[-0.045em] text-white leading-[1.06]">
            Access Auction Vehicles Through Trusted Partners
          </h2>

          {/* Italic block quote — partner wording */}
          <blockquote
            className="m-0 mb-5 text-white/[.78] text-[15px] leading-[1.75] max-w-[480px]"
            style={{
              fontStyle: 'italic',
              borderLeft: '3px solid rgba(255,213,0,.55)',
              paddingLeft: '16px',
            }}
          >
            MotorSphere connects sellers and buyers to professional auction opportunities through
            strategic auction partners.
          </blockquote>

          <p className="m-0 mb-8 text-white/[.52] text-[13px] leading-[1.7] max-w-[460px]">
            All auction operations &mdash; including registration, bidding, payment and vehicle
            transfer &mdash; are managed exclusively by our licensed auction house partners.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/auctions"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-black text-sm hover:opacity-90 transition-opacity"
              style={{ background: '#ffd400', color: '#78350f' }}
            >
              View Auction Listings
            </Link>
            <Link
              href="/partnerships"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-black text-sm border border-white/[.22] text-white hover:bg-white/[.08] transition-colors"
            >
              Become a Partner
            </Link>
          </div>
        </div>

        {/* Right — numbered feature cards */}
        <div className="flex flex-col gap-3 justify-center">
          {features.map(item => (
            <div
              key={item.num}
              className="flex items-start gap-4 rounded-[16px] p-4 border border-white/[.10]"
              style={{ background: 'rgba(255,255,255,.07)', backdropFilter: 'blur(14px)' }}
            >
              <span
                className="shrink-0 text-[13px] font-black tabular-nums mt-0.5"
                style={{ color: 'rgba(255,213,0,.70)' }}
              >
                {item.num}
              </span>
              <div>
                <h3 className="m-0 mb-1 text-[14px] font-black text-white">{item.title}</h3>
                <p className="m-0 text-[12px] text-white/[.58] leading-[1.6]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
