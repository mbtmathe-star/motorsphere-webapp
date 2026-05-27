import { notFound } from 'next/navigation';
import Link from 'next/link';
import Breadcrumb from '@/components/shared/Breadcrumb';
import ListingCard from '@/components/shared/ListingCard';
import EmptyState from '@/components/shared/EmptyState';
import { categories, allListings } from '@/data/home-data';

const FILTERS = ['All', 'Verified', 'Near me', 'Newest', 'Price ↑', 'Price ↓'];

type Props = { params: Promise<{ slug: string }> };

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = categories.find(c => c.id === slug);
  if (!category) notFound();

  const listings = allListings.filter(l => l.type === slug);

  return (
    <div className="max-w-[1240px] mx-auto px-[3.8vw] py-8">
      {/* Breadcrumb */}
      <Breadcrumb crumbs={[
        { label: 'Home', href: '/' },
        { label: category.label },
      ]} />

      {/* Page header */}
      <div className="mt-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-[-0.04em] text-[#121826] mb-1">{category.label}</h1>
          <p className="text-[#687589] text-sm">{category.desc}</p>
        </div>
        <Link href="/listings/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl px-[18px] py-3 bg-[#0866ff] text-white font-black text-sm hover:bg-[#064dc1] transition-colors whitespace-nowrap self-start">
          + Post in {category.label}
        </Link>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f, i) => (
          <span key={f}
            className={`rounded-full px-3 py-2 text-[13px] font-bold cursor-pointer transition-colors ${
              i === 0
                ? 'bg-[#0866ff] text-white border border-[#0866ff]'
                : 'bg-white text-[#334155] border border-black/[.12] hover:border-[#0866ff] hover:text-[#0866ff]'
            }`}>
            {f}
          </span>
        ))}
        <span className="ml-auto text-[13px] text-[#687589] self-center font-bold">
          {listings.length} {listings.length === 1 ? 'result' : 'results'}
        </span>
      </div>

      {/* Listings grid */}
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
          {listings.map(listing => (
            <Link key={listing.id} href={`/listing/${listing.id}`} className="block hover:no-underline">
              <ListingCard listing={listing} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[26px] shadow-[0_12px_28px_rgba(15,23,42,.08)] border border-black/[.06]">
          <EmptyState
            title={`No ${category.label} listed yet`}
            desc="Be the first to post in this category. Listings are reviewed by our admin team before going live."
            action={
              <Link href="/listings/new"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-[18px] py-3 bg-[#0866ff] text-white font-black text-sm hover:bg-[#064dc1] transition-colors">
                Post a listing
              </Link>
            }
          />
        </div>
      )}

    </div>
  );
}
