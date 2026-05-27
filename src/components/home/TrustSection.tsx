// src/components/home/TrustSection.tsx
import Link from 'next/link';
import { Icon } from './icons';
import { trustCards } from '@/data/home-data';

const stockImages = [
  {
    url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80',
    label: 'Premium verified vehicles',
    tall: true,
  },
  {
    url: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=900&q=80',
    label: 'Workshops & mechanics',
    tall: false,
  },
  {
    url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=900&q=80',
    label: 'Parts and spares',
    tall: false,
  },
];

export default function TrustSection() {
  return (
    <section className="mb-7 bg-white/[.96] border border-white/[.78] rounded-[26px] shadow-[0_12px_28px_rgba(15,23,42,.12)] p-[clamp(22px,4vw,42px)] overflow-hidden text-[#121826]">
      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_.95fr] gap-7 items-center">

        {/* Left column */}
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#eef4ff] text-[#0866ff] text-[12px] font-black uppercase tracking-[.04em] mb-3">
            Built for verified automotive trade
          </span>
          <h2 className="m-0 mb-3 text-[clamp(30px,4vw,48px)] leading-none font-black tracking-[-0.045em] text-[#121826]">
            One trusted place for vehicles, parts, services and automotive support.
          </h2>
          <p className="m-0 mb-6 text-[#687589] text-base leading-[1.7] max-w-[780px]">
            MotorSphere is not just a classifieds page. It is designed as a safer South African automotive
            ecosystem where buyers, private sellers, dealerships, parts vendors, workshops and service providers
            can connect through a verified marketplace flow.
          </p>

          <div className="flex flex-wrap gap-2.5 mb-6">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-[18px] py-3 bg-[#0866ff] text-white font-black text-sm hover:bg-[#064dc1] transition-colors"
            >
              Create account
            </Link>
            <Link
              href="/trust-safety"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-[18px] py-3 bg-[#eef4ff] text-[#0866ff] border border-[#dbe8ff] font-black text-sm hover:bg-[#dbe8ff] transition-colors"
            >
              See trust model
            </Link>
          </div>

          {/* Trust cards grid */}
          <div className="grid grid-cols-2 gap-3.5">
            {trustCards.map(card => (
              <div
                key={card.icon}
                className="bg-white border border-[#e8eef7] rounded-[18px] p-[18px] min-h-[138px] shadow-[0_10px_24px_rgba(15,23,42,.07)]"
              >
                <div className="w-[42px] h-[42px] rounded-[14px] grid place-items-center bg-[#eef4ff] text-[#0866ff] mb-3">
                  <span className="w-6 h-6"><Icon name={card.icon} /></span>
                </div>
                <h3 className="m-0 mb-1.5 text-base font-bold text-[#121826]">{card.title}</h3>
                <p className="m-0 text-[#687589] text-[13px] leading-[1.55]">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: stock collage */}
        <div
          className="grid gap-3.5 min-h-[390px]"
          style={{ gridTemplateColumns: '1.15fr .85fr' }}
        >
          {stockImages.map(img => (
            <div
              key={img.label}
              className={`relative rounded-[22px] overflow-hidden bg-[#ddd] shadow-[0_16px_32px_rgba(0,0,0,.16)] ${img.tall ? 'row-span-2 min-h-[180px]' : 'min-h-[180px]'}`}
              style={{ backgroundImage: `url('${img.url}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[35%] to-black/[.72]" />
              <div className="absolute left-4 bottom-4 right-4 z-[2] text-white font-black drop-shadow-[0_2px_14px_rgba(0,0,0,.4)]">
                {img.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
