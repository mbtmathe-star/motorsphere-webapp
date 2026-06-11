// src/components/home/FeaturedBusinessesSection.tsx
import Link from 'next/link';
import { allListings } from '@/data/home-data';

const businessIds = ['deal-1', 'svc-1', 'svc-2', 'track-1'];
const businesses = allListings.filter(l => businessIds.includes(l.id));

const typeConfig: Record<string, { label: string; bg: string; color: string; accent: string }> = {
  dealerships:     { label: 'Dealership',          bg: '#ede9fe', color: '#5b21b6', accent: '#7c3aed' },
  'rmi-workshops': { label: 'RMI Workshop',        bg: '#dcfce7', color: '#166534', accent: '#16a34a' },
  insurance:       { label: 'Insurance & Finance', bg: '#dbeafe', color: '#1d4ed8', accent: '#2563eb' },
  tracking:        { label: 'Tracking & Security', bg: '#d1fae5', color: '#065f46', accent: '#059669' },
};

export default function FeaturedBusinessesSection() {
  return (
    <section className="mb-10">
      {/* Section header */}
      <div className="flex items-end justify-between gap-4 mb-5 flex-wrap">
        <div>
          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#eef4ff] text-[#0866ff] text-[11px] font-black uppercase tracking-[.07em] mb-2">
            Featured businesses
          </span>
          <h2 className="m-0 text-[clamp(26px,3.8vw,40px)] font-black tracking-[-0.045em] text-[#121826] leading-none">
            Featured Businesses
          </h2>
          <p className="m-0 mt-2 text-[14px] text-[#687589] leading-[1.65] max-w-[680px]">
            Explore automotive businesses listed on MotorSphere, including dealerships, workshops,
            parts suppliers, towing services, tracking providers and insurance-related service providers.
          </p>
        </div>
        <Link
          href="/search"
          className="hidden sm:inline-flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-black bg-[#eef4ff] text-[#0866ff] border border-[#dbe8ff] hover:bg-[#dbe8ff] transition-colors shrink-0"
        >
          Browse Businesses &rarr;
        </Link>
      </div>

      {/* Business directory rail */}
      <div className="ms-rail gap-4">
        {businesses.map(biz => {
          const cfg = typeConfig[biz.type] ?? { label: biz.type, bg: '#f0f0f0', color: '#444', accent: '#666' };
          return (
            <div
              key={biz.id}
              className="flex-none snap-start w-[256px] bg-white rounded-[20px] overflow-hidden flex flex-col"
              style={{
                boxShadow: '0 4px 20px rgba(15,23,42,.09)',
                border: '1px solid rgba(0,0,0,.06)',
              }}
            >
              {/* Cover image */}
              <div className="relative h-[118px] overflow-hidden bg-[#e8eef7]">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url('${biz.image}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                <span
                  className="absolute top-3 left-3 text-[10px] font-black px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(255,255,255,.92)', color: cfg.color }}
                >
                  {cfg.label}
                </span>
              </div>

              {/* Accent stripe */}
              <div className="h-[3px] shrink-0" style={{ background: cfg.accent }} />

              {/* Business info */}
              <div className="flex-1 p-4">
                <h3 className="m-0 mb-0.5 text-[14px] font-black text-[#121826] leading-tight">
                  {biz.seller}
                </h3>
                <p className="m-0 mb-3 text-[12px] text-[#687589] leading-relaxed line-clamp-2">
                  {biz.desc}
                </p>
                <p className="m-0 mb-3 text-[11px] text-[#475569] font-medium">
                  {biz.location}
                </p>
                <div className="flex gap-1.5 flex-wrap">
                  {biz.meta.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: cfg.bg, color: cfg.color }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTAs */}
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href="/search"
          className="px-4 py-2.5 rounded-xl text-sm font-black bg-[#0866ff] text-white hover:bg-[#064dc1] transition-colors"
        >
          Browse Businesses
        </Link>
        <Link
          href="/advertise"
          className="px-4 py-2.5 rounded-xl text-sm font-black bg-[#eef4ff] text-[#0866ff] border border-[#dbe8ff] hover:bg-[#dbe8ff] transition-colors"
        >
          Feature Your Business
        </Link>
      </div>
    </section>
  );
}
