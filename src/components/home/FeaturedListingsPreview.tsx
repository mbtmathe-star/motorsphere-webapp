// src/components/home/FeaturedListingsPreview.tsx
import Link from 'next/link';
import { featuredListings } from '@/data/home-data';
import ListingCard from '@/components/shared/ListingCard';

export default function FeaturedListingsPreview() {
  return (
    <section className="mb-7 bg-white/[.96] border border-white/[.78] rounded-[26px] shadow-[0_12px_28px_rgba(15,23,42,.12)] p-[clamp(22px,4vw,42px)] overflow-hidden text-[#121826]">
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#eef4ff] text-[#0866ff] text-[12px] font-black uppercase tracking-[.04em] mb-3">
        Featured listings
      </span>
      <h2 className="m-0 mb-3 text-[clamp(30px,4vw,48px)] leading-none font-black tracking-[-0.045em] text-[#121826]">
        Featured Automotive Listings
      </h2>
      <p className="m-0 mb-6 text-[#687589] text-base leading-[1.7] max-w-[780px]">
        Explore vehicles, parts and service providers across South Africa. Every listing on MotorSphere is reviewed
        before it goes live so buyers can browse with confidence.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
        {featuredListings.map(listing => (
          <Link key={listing.id} href={`/listing/${listing.id}`} className="block hover:no-underline">
            <ListingCard listing={listing} />
          </Link>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/category/vehicles"
          className="inline-flex items-center justify-center gap-2 rounded-xl px-[18px] py-3 bg-[#0866ff] text-white font-black text-sm hover:bg-[#064dc1] transition-colors">
          Browse Vehicles
        </Link>
        <Link href="/category/parts"
          className="inline-flex items-center justify-center gap-2 rounded-xl px-[18px] py-3 bg-[#eef4ff] text-[#0866ff] border border-[#dbe8ff] font-black text-sm hover:bg-[#dbe8ff] transition-colors">
          Find Parts
        </Link>
      </div>
    </section>
  );
}
