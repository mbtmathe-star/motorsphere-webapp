// src/components/home/TrustSection.tsx
import Link from 'next/link';
import { Icon } from './icons';
import { trustCards } from '@/data/home-data';

const iconColors = ['#4f8fff', '#22c55e', '#ffd400', '#22d3ee'];
const iconBgs    = [
  'rgba(79,143,255,.20)',
  'rgba(34,197,94,.18)',
  'rgba(255,213,0,.16)',
  'rgba(34,211,238,.18)',
];

export default function TrustSection() {
  return (
    <section
      className="mb-7 rounded-[26px] overflow-hidden text-white"
      style={{
        background: 'linear-gradient(135deg, #0d1421 0%, #0b1d3a 55%, #06121e 100%)',
        boxShadow: '0 16px 48px rgba(0,0,0,.34)',
      }}
    >
      <div className="p-[clamp(28px,5vw,54px)]">

        {/* Header row */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-start mb-10">
          <div>
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/[.10] text-white border border-white/[.12] text-[11px] font-black uppercase tracking-[.08em] mb-4">
              Trust &amp; Safety
            </span>
            <h2 className="m-0 mb-3 text-[clamp(26px,4vw,44px)] font-black tracking-[-0.045em] text-white leading-[1.06]">
              Marketplace Integrity<br />Built In
            </h2>
            <p className="m-0 text-white/[.58] text-[15px] leading-[1.75] max-w-[500px]">
              Every listing is reviewed before going live. Seller identity is verified. All
              interactions stay on-platform. Aligned with South African POPIA requirements.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 lg:flex-col lg:items-end shrink-0">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 bg-[#0866ff] text-white font-black text-sm hover:bg-[#064dc1] transition-colors whitespace-nowrap"
            >
              Create Account
            </Link>
            <Link
              href="/trust-safety"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-black text-sm border border-white/[.22] text-white hover:bg-white/[.08] transition-colors whitespace-nowrap"
            >
              Trust Model &rarr;
            </Link>
          </div>
        </div>

        {/* Trust infrastructure cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {trustCards.map((card, i) => (
            <div
              key={card.icon}
              className="rounded-[18px] p-5 border border-white/[.08]"
              style={{ background: 'rgba(255,255,255,.06)', backdropFilter: 'blur(10px)' }}
            >
              <div
                className="w-10 h-10 rounded-[12px] grid place-items-center mb-3"
                style={{ background: iconBgs[i] }}
              >
                <div className="w-5 h-5" style={{ color: iconColors[i] }}>
                  <Icon name={card.icon} className="w-full h-full" />
                </div>
              </div>
              <h3 className="m-0 mb-1.5 text-[14px] font-black text-white leading-tight">
                {card.title}
              </h3>
              <p className="m-0 text-[12px] text-white/[.52] leading-[1.6]">{card.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
