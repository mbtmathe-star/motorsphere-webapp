// src/components/home/EcosystemSection.tsx
import Link from 'next/link';
import { Icon } from './icons';
import { ecosystemServices } from '@/data/home-data';

export default function EcosystemSection() {
  return (
    <section
      className="mb-7 rounded-[26px] shadow-[0_12px_28px_rgba(15,23,42,.12)] p-[clamp(22px,4vw,42px)] overflow-hidden text-white border border-white/[.15]"
      style={{
        background: `
          linear-gradient(135deg, rgba(6,18,45,.92), rgba(8,102,255,.66)),
          url("https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1600&q=80") center / cover
        `,
      }}
    >
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[.14] text-white border border-white/[.16] text-[12px] font-black uppercase tracking-[.04em] mb-3">
        Full ecosystem direction
      </span>
      <h2 className="m-0 mb-3 text-[clamp(30px,4vw,48px)] leading-none font-black tracking-[-0.045em]">
        More than buying and selling cars.
      </h2>
      <p className="m-0 mb-6 text-white/[.86] text-base leading-[1.7] max-w-[780px]">
        MotorSphere is planned to connect the full ownership journey: finding vehicles, sourcing parts,
        comparing insurance, booking services, handling emergencies and supporting commercial transport needs.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {ecosystemServices.map(svc => (
          <Link
            key={svc.route}
            href={svc.route}
            className="block rounded-[18px] p-[18px] min-h-[128px] border border-white/[.16] text-white hover:bg-white/[.18] transition-colors"
            style={{ background: 'rgba(255,255,255,.11)', backdropFilter: 'blur(10px)' }}
          >
            <span className="block w-[30px] h-[30px] mb-2.5">
              <Icon name={svc.icon} className="w-full h-full stroke-white" />
            </span>
            <h3 className="m-0 mb-1.5 text-base font-bold">{svc.title}</h3>
            <p className="m-0 text-white/[.80] text-[13px] leading-[1.55]">{svc.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
