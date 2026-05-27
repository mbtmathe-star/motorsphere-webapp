// src/components/shared/ListingCard.tsx
import type { Listing } from '@/data/home-data';

const statusStyles: Record<string, string> = {
  green:  'bg-[#dcfce7] text-[#166534]',
  blue:   'bg-[#dbeafe] text-[#1d4ed8]',
  orange: 'bg-[#ffedd5] text-[#c2410c]',
  red:    'bg-[#fee2e2] text-[#b91c1c]',
  purple: 'bg-[#ede9fe] text-[#5b21b6]',
};

type Props = { listing: Listing };

export default function ListingCard({ listing }: Props) {
  return (
    <article className="overflow-hidden bg-white border border-black/[.08] rounded-[18px] shadow-[0_12px_24px_rgba(15,23,42,.08)] transition-all duration-[180ms] hover:-translate-y-1 hover:shadow-[0_18px_32px_rgba(15,23,42,.14)]">
      {/* Image */}
      <div className="relative h-[170px] bg-[#ddd] overflow-hidden">
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url('${listing.image}')` }}
          aria-hidden="true"
        />
        {/* Status badge */}
        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-black ${statusStyles[listing.statusVariant]}`}
        >
          {listing.status}
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="m-0 mb-1.5 text-lg font-bold tracking-tight text-[#121826]">{listing.title}</h3>
        <div className="text-[#687589] text-[13px] flex flex-wrap gap-2 mb-3">
          {listing.meta.map((m, i) => (
            <span key={i}>{i > 0 && <span className="opacity-40 mr-2">·</span>}{m}</span>
          ))}
        </div>
        <div className="text-[#061a43] text-xl font-black mb-3">{listing.priceDisplay}</div>
        <div className="flex items-center justify-between gap-3 text-[13px] text-[#475569] border-t border-[#eef2f7] pt-3">
          <span>{listing.location}</span>
          <strong className="font-bold">{listing.seller}</strong>
        </div>
      </div>
    </article>
  );
}
