// src/components/home/FeaturedListingsPreview.tsx
import { featuredListings } from '@/data/home-data';
import ListingCard from '@/components/shared/ListingCard';

export default function FeaturedListingsPreview() {
  return (
    <section className="mb-7 bg-white/[.96] border border-white/[.78] rounded-[26px] shadow-[0_12px_28px_rgba(15,23,42,.12)] p-[clamp(22px,4vw,42px)] overflow-hidden text-[#121826]">
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#eef4ff] text-[#0866ff] text-[12px] font-black uppercase tracking-[.04em] mb-3">
        Featured marketplace preview
      </span>
      <h2 className="m-0 mb-3 text-[clamp(30px,4vw,48px)] leading-none font-black tracking-[-0.045em] text-[#121826]">
        Seeded listings that show the product direction.
      </h2>
      <p className="m-0 mb-6 text-[#687589] text-base leading-[1.7] max-w-[780px]">
        These cards preview what the final Firestore-powered marketplace will look like once listings,
        uploads, approvals and inquiries are connected.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
        {featuredListings.map(listing => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  );
}
