// src/components/home/AdvertisePartnerSection.tsx
import Link from 'next/link';

const highlights = [
  'Sponsored listing placements',
  'Advertising placements across the platform',
  'Auction house partnerships',
  'Supplier and parts vendor visibility',
  'Dealership group programmes',
  'Insurance and finance partner opportunities',
];

export default function AdvertisePartnerSection() {
  return (
    <section
      className="mb-10 rounded-[26px] overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #040e1e 0%, #071a3e 45%, #050f1a 100%), ' +
          'url("https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=60") center / cover',
        boxShadow: '0 16px 48px rgba(0,0,0,.30)',
      }}
    >
      {/* Subtle image texture */}
      <div
        className="relative"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=60")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(4,14,30,.97) 0%, rgba(7,26,62,.94) 50%, rgba(5,15,26,.96) 100%)',
          }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 p-[clamp(32px,5vw,60px)]">

          {/* Left — heading, subtext, CTAs */}
          <div>
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/[.10] text-white border border-white/[.13] text-[11px] font-black uppercase tracking-[.08em] mb-5">
              Advertising &amp; Partnerships
            </span>

            <h2 className="m-0 mb-4 text-[clamp(26px,4vw,44px)] font-black tracking-[-0.045em] text-white leading-[1.06]">
              Advertise or Partner<br />With MotorSphere
            </h2>

            <p className="m-0 mb-8 text-white/[.65] text-[15px] leading-[1.75] max-w-[500px]">
              Reach automotive buyers, sellers, dealerships, suppliers, service providers and
              industry stakeholders through South Africa&rsquo;s growing automotive ecosystem.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/advertise"
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-black text-sm transition-colors"
                style={{ background: '#0866ff', color: '#fff' }}
              >
                Advertise With Us
              </Link>
              <Link
                href="/partnerships"
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-black text-sm border border-white/[.22] text-white hover:bg-white/[.08] transition-colors"
              >
                Partner With MotorSphere
              </Link>
            </div>
          </div>

          {/* Right — feature highlights */}
          <div className="flex flex-col justify-center gap-2.5">
            {highlights.map(item => (
              <div
                key={item}
                className="flex items-center gap-3.5 rounded-[14px] px-4 py-3.5 border border-white/[.08]"
                style={{ background: 'rgba(255,255,255,.06)', backdropFilter: 'blur(10px)' }}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: '#ffd400' }}
                />
                <span className="text-[13px] text-white/[.80] font-medium">{item}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
