// src/components/home/ListingPackagesSection.tsx
import Link from 'next/link';

const packages = [
  {
    name: 'Standard Listing',
    price: 'R 250',
    period: 'per listing',
    highlight: false,
    features: [
      'List any vehicle, part or service',
      'Admin review before going live',
      '30-day listing duration',
      'Buyer inquiry notifications',
      'Basic seller profile',
    ],
    cta: 'Create a Listing',
    href: '/listings/new',
  },
  {
    name: 'Featured Placement',
    price: 'From R 750',
    period: 'per listing',
    highlight: true,
    features: [
      'Everything in Standard',
      'Homepage featured placement',
      'Category page priority position',
      'Sponsored badge on listing',
      'Extended 60-day duration',
    ],
    cta: 'Get Featured',
    href: '/advertise',
  },
  {
    name: 'Business Profile',
    price: 'Contact us',
    period: 'monthly packages',
    highlight: false,
    features: [
      'Everything in Featured',
      'Dedicated business profile page',
      'Multiple active listings',
      'Lead form & inquiry routing',
      'Analytics and visibility reports',
    ],
    cta: 'Feature Your Business',
    href: '/advertise',
  },
];

export default function ListingPackagesSection() {
  return (
    <section className="mb-10">
      {/* Header */}
      <div className="mb-7">
        <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#eef4ff] text-[#0866ff] text-[11px] font-black uppercase tracking-[.07em] mb-2">
          Listing packages
        </span>
        <h2 className="m-0 text-[clamp(26px,3.8vw,40px)] font-black tracking-[-0.045em] text-[#121826] leading-none">
          List Your Vehicle or Business from R&thinsp;250
        </h2>
        <p className="m-0 mt-2 text-[15px] text-[#687589] leading-[1.65] max-w-[600px]">
          Every listing on MotorSphere is reviewed by our team before it goes live.
          Start with a standard listing or get maximum visibility with featured and business packages.
        </p>
      </div>

      {/* Package cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {packages.map(pkg => (
          <div
            key={pkg.name}
            className="relative bg-white rounded-[22px] p-6 flex flex-col"
            style={{
              boxShadow: pkg.highlight
                ? '0 8px 40px rgba(8,102,255,.18)'
                : '0 4px 20px rgba(15,23,42,.09)',
              border: pkg.highlight
                ? '2px solid #0866ff'
                : '1px solid rgba(0,0,0,.06)',
            }}
          >
            {pkg.highlight && (
              <span
                className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[.08em] px-3 py-1 rounded-full text-white whitespace-nowrap"
                style={{ background: '#0866ff' }}
              >
                Most Popular
              </span>
            )}

            {/* Package name & price */}
            <div className="mb-5">
              <p className="m-0 mb-1 text-[12px] font-black text-[#687589] uppercase tracking-[.06em]">
                {pkg.name}
              </p>
              <p className="m-0 text-[32px] font-black tracking-tight text-[#121826] leading-none">
                {pkg.price}
              </p>
              <p className="m-0 mt-1 text-[12px] text-[#687589]">{pkg.period}</p>
            </div>

            {/* Features */}
            <ul className="m-0 p-0 list-none flex flex-col gap-2.5 mb-7 flex-1">
              {pkg.features.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-[13px] text-[#475569]">
                  <span
                    className="shrink-0 mt-0.5 text-sm font-black"
                    style={{ color: pkg.highlight ? '#0866ff' : '#16a34a' }}
                  >
                    &#10003;
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href={pkg.href}
              className="block text-center rounded-xl px-5 py-3 font-black text-sm transition-colors"
              style={
                pkg.highlight
                  ? { background: '#0866ff', color: '#fff' }
                  : { background: '#f0f4ff', color: '#0866ff', border: '1px solid #dbe8ff' }
              }
            >
              {pkg.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
