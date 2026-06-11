// src/components/home/FeaturedListingsPreview.tsx
import Link from 'next/link';
import { featuredListings } from '@/data/home-data';

const statusStyles: Record<string, { bg: string; color: string }> = {
  green:  { bg: '#dcfce7', color: '#166534' },
  blue:   { bg: '#dbeafe', color: '#1d4ed8' },
  orange: { bg: '#ffedd5', color: '#c2410c' },
  red:    { bg: '#fee2e2', color: '#b91c1c' },
  purple: { bg: '#ede9fe', color: '#5b21b6' },
};

const displayListings = featuredListings.slice(0, 4);

export default function FeaturedListingsPreview() {
  return (
    <section className="mb-10">
      {/* Section header */}
      <div className="flex items-end justify-between gap-4 mb-5 flex-wrap">
        <div>
          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#eef4ff] text-[#0866ff] text-[11px] font-black uppercase tracking-[.07em] mb-2">
            Marketplace
          </span>
          <h2 className="m-0 text-[clamp(26px,3.8vw,40px)] font-black tracking-[-0.045em] text-[#121826] leading-none">
            Featured Listings
          </h2>
        </div>
        <div className="flex gap-2.5 pb-1 shrink-0">
          <Link
            href="/search"
            className="px-4 py-2.5 rounded-xl text-sm font-black bg-[#0866ff] text-white hover:bg-[#064dc1] transition-colors"
          >
            View All Listings
          </Link>
          <Link
            href="/auctions"
            className="px-4 py-2.5 rounded-xl text-sm font-black bg-[#eef4ff] text-[#0866ff] border border-[#dbe8ff] hover:bg-[#dbe8ff] transition-colors"
          >
            Auctions
          </Link>
        </div>
      </div>

      {/* Listings grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayListings.map(listing => {
          const sty = statusStyles[listing.statusVariant] ?? { bg: '#f0f0f0', color: '#444' };
          return (
            <Link
              key={listing.id}
              href={`/listing/${listing.id}`}
              className="block group"
            >
              <article
                className="overflow-hidden bg-white rounded-[20px] h-full transition-all duration-200 group-hover:-translate-y-1"
                style={{
                  boxShadow: '0 4px 20px rgba(15,23,42,.09)',
                  border: '1px solid rgba(0,0,0,.06)',
                }}
              >
                {/* Image area */}
                <div className="relative h-[168px] bg-[#e8eef7] overflow-hidden">
                  <div
                    className="absolute inset-0 transition-transform duration-300 group-hover:scale-105"
                    style={{
                      backgroundImage: `url('${listing.image}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <span
                    className="absolute left-3 top-3 text-[11px] font-black px-2.5 py-1 rounded-full"
                    style={{ background: sty.bg, color: sty.color }}
                  >
                    {listing.status}
                  </span>
                  <div className="absolute bottom-2.5 right-2.5 flex gap-1.5">
                    {listing.meta.slice(0, 2).map(m => (
                      <span
                        key={m}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/55 text-white backdrop-blur-sm"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Body */}
                <div className="p-4">
                  <h3 className="m-0 mb-1 text-[13px] font-black text-[#121826] leading-tight line-clamp-2">
                    {listing.title}
                  </h3>
                  <p
                    className="m-0 mb-3 text-[22px] font-black tracking-tight leading-none"
                    style={{ color: '#0866ff' }}
                  >
                    {listing.priceDisplay}
                  </p>
                  <div
                    className="flex items-center justify-between text-[11px] text-[#687589] pt-2.5"
                    style={{ borderTop: '1px solid #f0f4ff' }}
                  >
                    <span>{listing.location}</span>
                    <strong className="font-bold text-[#475569]">{listing.seller}</strong>
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
