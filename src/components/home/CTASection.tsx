// src/components/home/CTASection.tsx
import Link from 'next/link';

export default function CTASection() {
  return (
    <section
      className="mb-7 rounded-[26px] shadow-[0_12px_28px_rgba(15,23,42,.12)] p-[clamp(22px,4vw,42px)] overflow-hidden text-white border border-white/[.15] grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center"
      style={{
        background: `
          linear-gradient(135deg, rgba(3,10,29,.92), rgba(6,179,81,.72)),
          url("https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80") center / cover
        `,
      }}
    >
      <div>
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[.14] text-white border border-white/[.16] text-[12px] font-black uppercase tracking-[.04em] mb-3">
          Ready for production conversion
        </span>
        <h2 className="m-0 mb-3 text-[clamp(30px,4vw,48px)] leading-none font-black tracking-[-0.045em]">
          Use this prototype as the homepage and UX source of truth.
        </h2>
        <p className="m-0 text-white/[.84] text-base leading-[1.7] max-w-[780px]">
          Claude Code should convert this into Next.js components, Tailwind v4 tokens, Firebase-backed
          data flows and protected dashboard routes.
        </p>
      </div>
      <div className="flex flex-wrap gap-2.5">
        <Link
          href="/register"
          className="inline-flex items-center justify-center gap-2 rounded-xl px-[18px] py-3 bg-[#0866ff] text-white font-black text-sm hover:bg-[#064dc1] transition-colors whitespace-nowrap"
        >
          Start registration
        </Link>
        <Link
          href="/admin"
          className="inline-flex items-center justify-center gap-2 rounded-xl px-[18px] py-3 bg-[#eef4ff] text-[#0866ff] border border-[#dbe8ff] font-black text-sm hover:bg-[#dbe8ff] transition-colors whitespace-nowrap"
        >
          View admin flow
        </Link>
      </div>
    </section>
  );
}
