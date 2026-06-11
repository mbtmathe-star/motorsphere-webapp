// src/components/home/AdvertisePartnerSection.tsx
import Link from 'next/link';

const advertiseBenefits = [
  'Sponsored listings across the marketplace',
  'Featured business profile with direct CTA',
  'Banner placements on browse and search pages',
  'Lead generation across vehicles, parts and services',
  'Targeting by location, role and category',
];

const partnerBenefits = [
  'Auction house partnerships and buyer referrals',
  'Insurance & finance provider integration',
  'Dealership group and fleet programmes',
  'Workshop & service directory presence',
  'Tracking and vehicle security solutions',
];

export default function AdvertisePartnerSection() {
  return (
    <section className="mb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Advertise panel */}
        <div
          className="rounded-[24px] overflow-hidden relative flex flex-col"
          style={{
            background:
              'linear-gradient(145deg, #05122a 0%, #0554cc 100%), ' +
              'url("https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=40") center / cover',
            boxShadow: '0 12px 40px rgba(8,102,255,.28)',
            minHeight: '360px',
          }}
        >
          {/* Subtle image texture on top */}
          <div
            className="absolute inset-0 opacity-[.06]"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=40")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          <div className="relative z-10 p-[clamp(24px,4vw,44px)] flex flex-col h-full flex-1">
            <span className="inline-flex self-start items-center px-3 py-1 rounded-full bg-white/[.12] text-white text-[11px] font-black uppercase tracking-[.08em] mb-5 border border-white/[.16]">
              Advertising
            </span>
            <h2 className="m-0 mb-5 text-[clamp(22px,3.2vw,34px)] font-black tracking-[-0.04em] text-white leading-[1.1]">
              Advertise with<br />MotorSphere
            </h2>
            <ul className="m-0 p-0 list-none flex flex-col gap-2.5 mb-8 flex-1">
              {advertiseBenefits.map(point => (
                <li key={point} className="flex items-center gap-2.5 text-[13px] text-white/75">
                  <span className="shrink-0 font-black text-sm" style={{ color: '#ffd400' }}>
                    &rarr;
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/advertise"
              className="self-start inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-white font-black text-sm hover:bg-white/90 transition-colors"
              style={{ color: '#0554cc' }}
            >
              View Advertising Options
            </Link>
          </div>
        </div>

        {/* Partner panel */}
        <div
          className="rounded-[24px] overflow-hidden relative flex flex-col"
          style={{
            background:
              'linear-gradient(145deg, #040e1c 0%, #056648 100%), ' +
              'url("https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=40") center / cover',
            boxShadow: '0 12px 40px rgba(5,102,72,.32)',
            minHeight: '360px',
          }}
        >
          {/* Subtle image texture */}
          <div
            className="absolute inset-0 opacity-[.06]"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=40")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          <div className="relative z-10 p-[clamp(24px,4vw,44px)] flex flex-col h-full flex-1">
            <span className="inline-flex self-start items-center px-3 py-1 rounded-full bg-white/[.12] text-white text-[11px] font-black uppercase tracking-[.08em] mb-5 border border-white/[.16]">
              Strategic partners
            </span>
            <h2 className="m-0 mb-5 text-[clamp(22px,3.2vw,34px)] font-black tracking-[-0.04em] text-white leading-[1.1]">
              Partner with<br />MotorSphere
            </h2>
            <ul className="m-0 p-0 list-none flex flex-col gap-2.5 mb-8 flex-1">
              {partnerBenefits.map(point => (
                <li key={point} className="flex items-center gap-2.5 text-[13px] text-white/75">
                  <span className="shrink-0 font-black text-sm" style={{ color: '#34d399' }}>
                    &rarr;
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/partnerships"
              className="self-start inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-white font-black text-sm hover:bg-white/90 transition-colors"
              style={{ color: '#056648' }}
            >
              Explore Partnerships
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
