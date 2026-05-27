import Link from 'next/link';
import Breadcrumb from '@/components/shared/Breadcrumb';
import ListingCard from '@/components/shared/ListingCard';
import EmptyState from '@/components/shared/EmptyState';
import { allListings } from '@/data/home-data';

const FILTERS = ['All', 'Vehicles', 'Parts', 'Spares', 'Services', 'Workshops'];

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q = '' } = await searchParams;
  const term = q.toLowerCase().trim();

  const results = term
    ? allListings.filter(l =>
        [l.title, l.location, l.seller, l.type, ...l.meta, l.desc]
          .join(' ').toLowerCase().includes(term)
      )
    : allListings;

  return (
    <div className="max-w-[1240px] mx-auto px-[3.8vw] py-8">
      <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Search results' }]} />

      <div className="mt-4 mb-6">
        <h1 className="text-3xl font-black tracking-[-0.04em] text-[#121826] mb-1">
          {term ? `Results for "${q}"` : 'All listings'}
        </h1>
        <p className="text-[#687589] text-sm">{results.length} {results.length === 1 ? 'result' : 'results'} found</p>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f, i) => (
          <span key={f}
            className={`rounded-full px-3 py-2 text-[13px] font-bold cursor-pointer border ${
              i === 0 ? 'bg-[#0866ff] text-white border-[#0866ff]' : 'bg-white text-[#334155] border-black/[.12] hover:border-[#0866ff] hover:text-[#0866ff]'
            }`}>
            {f}
          </span>
        ))}
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
          {results.map(listing => (
            <Link key={listing.id} href={`/listing/${listing.id}`} className="block hover:no-underline">
              <ListingCard listing={listing} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[26px] shadow-[0_12px_28px_rgba(15,23,42,.08)] border border-black/[.06]">
          <EmptyState
            title="No results found"
            desc={`We couldn't find any listings matching "${q}". Try searching for Hilux, parts, insurance, towing, or workshop.`}
            action={
              <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-xl px-[18px] py-3 bg-[#0866ff] text-white font-black text-sm">
                Back to Home
              </Link>
            }
          />
        </div>
      )}

    </div>
  );
}
