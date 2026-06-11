// src/components/home/SponsoredListingsSection.tsx
import Link from 'next/link';
import { allListings } from '@/data/home-data';

const sponsoredIds = ['veh-1', 'veh-5', 'part-2', 'tyre-1'];
const sponsoredListings = allListings.filter(l => sponsoredIds.includes(l.id));

export default function SponsoredListingsSection() {
  return (
    <section className="mb-10">
      {/* Section label row */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center text-[11px] font-black uppercase tracking-[.07em] px-3 py-1.5 rounded-full"
            style={{ background: '#fef3c7', color: '#92400e' }}
          >
            Sponsored
          </span>
          <span className="text-[13px] font-semibold text-[#687589]">
            Promoted listings across the MotorSphere marketplace.
          </span>
        </div>
        <Link href="/advertise" className="hidden sm:block text-[12px] font-bold text-[#0866ff] hover:underline shrink-0">
          Advertise here &rarr;
        </Link>
      </div>

      {/* Auto-sliding carousel */}
      <div className="ms-auto-carousel">
        <div className="ms-auto-carousel-track">
          {/* Render twice for seamless loop */}
          {[...sponsoredListings, ...sponsoredListings].map((listing, i) => (
            <div key={`${listing.id}-${i}`} className="flex-none pr-4">
              <Link
                href={`/listing/${listing.id}`}
                className="block w-[310px] h-[210px] rounded-[20px] overflow-hidden relative group"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,.22)' }}
                tabIndex={i >= sponsoredListings.length ? -1 : 0}
                aria-hidden={i >= sponsoredListings.length ? 'true' : undefined}
              >
                {/* Full image background */}
                <div
                  className="absolute inset-0 transition-transform duration-300 group-hover:scale-105"
                  style={{
                    backgroundImage: `url('${listing.image}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/28 to-black/10" />
                {/* Sponsored badge */}
                <span
                  className="absolute top-3 left-3 text-[10px] font-black px-2.5 py-1 rounded-full z-10"
                  style={{ background: 'rgba(255,213,0,.90)', color: '#78350f' }}
                >
                  Sponsored
                </span>
                {/* Status chip */}
                <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/40 text-white border border-white/[.18] backdrop-blur-sm z-10">
                  {listing.status}
                </span>
                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
                  <p className="m-0 font-black text-[15px] leading-tight mb-1.5 drop-shadow-[0_1px_4px_rgba(0,0,0,.6)]">
                    {listing.title}
                  </p>
                  <div className="flex items-end justify-between gap-2">
                    <span className="text-[22px] font-black leading-none" style={{ color: '#ffd400' }}>
                      {listing.priceDisplay}
                    </span>
                    <span className="text-[11px] text-white/70 pb-0.5">{listing.location}</span>
                  </div>
                  <p className="m-0 mt-1 text-[11px] text-white/55">{listing.seller}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile advertise link */}
      <div className="mt-3 sm:hidden">
        <Link href="/advertise" className="text-[12px] font-bold text-[#0866ff] hover:underline">
          Advertise here &rarr;
        </Link>
      </div>
    </section>
  );
}
