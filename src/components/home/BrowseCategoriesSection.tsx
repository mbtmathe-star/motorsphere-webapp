// src/components/home/BrowseCategoriesSection.tsx
import Link from 'next/link';

const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=75`;

const browseCategories = [
  { label: 'Vehicle Marketplace',        route: '/category/vehicles',    image: U('1492144534655-ae79c964c9d7'), desc: 'Private & dealer listings' },
  { label: 'Auction Vehicles',           route: '/auctions',             image: U('1549317661-bd32c8ce0db2'),   desc: 'Auction partner opportunities' },
  { label: 'Parts, Spares & Tyres',      route: '/category/parts',       image: U('1486262715619-67b85e0b08d3'), desc: 'New and used components' },
  { label: 'Dealerships',                route: '/category/dealerships', image: U('1560958089-b8a1929cea89'),   desc: 'Registered dealer profiles' },
  { label: 'Workshops & Repairs',        route: '/workshops',            image: U('1487754180451-c456f719a1fc'), desc: 'RMI & independent workshops' },
  { label: 'Towing & Roadside Assistance', route: '/roadside',           image: U('1449965408869-eaa3f722e40d'), desc: '24/7 nationwide support' },
  { label: 'Insurance, Finance & Warranty', route: '/insurance',         image: U('1560518883-ce09059eeffa'),   desc: 'Protection & finance options' },
  { label: 'Tracking & Vehicle Security', route: '/category/tracking',   image: U('1502920917128-1aa500764cbd'), desc: 'GPS, fleet & recovery' },
  { label: 'Accessories Marketplace',   route: '/category/accessories',  image: U('1533473359331-0135ef1b58bf'), desc: 'Fitment & modifications' },
];

export default function BrowseCategoriesSection() {
  return (
    <section className="mb-10">
      {/* Section header */}
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#eef4ff] text-[#0866ff] text-[11px] font-black uppercase tracking-[.07em] mb-2">
            Explore
          </span>
          <h2 className="m-0 text-[clamp(26px,3.8vw,40px)] font-black tracking-[-0.045em] text-[#121826] leading-none">
            Browse Categories
          </h2>
        </div>
      </div>

      {/* Auto-sliding category carousel */}
      <div className="ms-auto-carousel">
        <div className="ms-auto-carousel-track" style={{ animationDuration: '28s' }}>
          {[...browseCategories, ...browseCategories].map((cat, i) => (
            <div key={`${cat.route}-${i}`} className="flex-none pr-3">
              <Link
                href={cat.route}
                className="block w-[200px] h-[148px] rounded-[18px] overflow-hidden relative group"
                style={{ boxShadow: '0 6px 24px rgba(0,0,0,.22)' }}
                tabIndex={i >= browseCategories.length ? -1 : 0}
                aria-hidden={i >= browseCategories.length ? 'true' : undefined}
              >
                {/* Background image */}
                <div
                  className="absolute inset-0 transition-transform duration-300 group-hover:scale-105"
                  style={{
                    backgroundImage: `url("${cat.image}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/30 to-black/10" />

                {/* Index number */}
                <span className="absolute top-3 left-3 text-[11px] font-black text-white/50 z-10 tabular-nums">
                  {String((i % browseCategories.length) + 1).padStart(2, '0')}
                </span>

                {/* Arrow */}
                <span className="absolute top-3 right-3 text-white/50 text-[15px] z-10 transition-[color,transform] duration-200 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  &nearr;
                </span>

                {/* Label */}
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white z-10">
                  <p className="m-0 text-[12px] font-black leading-snug drop-shadow-[0_1px_4px_rgba(0,0,0,.7)]">
                    {cat.label}
                  </p>
                  <p className="m-0 mt-0.5 text-[10px] text-white/65 font-medium leading-snug">
                    {cat.desc}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
