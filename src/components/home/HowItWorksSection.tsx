// src/components/home/HowItWorksSection.tsx
import { howItWorksSteps } from '@/data/home-data';

export default function HowItWorksSection() {
  return (
    <section className="mb-7 bg-white/[.96] border border-white/[.78] rounded-[26px] shadow-[0_12px_28px_rgba(15,23,42,.12)] p-[clamp(22px,4vw,42px)] overflow-hidden text-[#121826]">
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#eef4ff] text-[#0866ff] text-[12px] font-black uppercase tracking-[.04em] mb-3">
        How the platform works
      </span>
      <h2 className="m-0 mb-3 text-[clamp(30px,4vw,48px)] leading-none font-black tracking-[-0.045em] text-[#121826]">
        A safer listing lifecycle from draft to live marketplace.
      </h2>
      <p className="m-0 mb-6 text-[#687589] text-base leading-[1.7] max-w-[780px]">
        The final app makes trust visible. Every serious listing journey needs upload, verification,
        moderation, approval and reporting states.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {howItWorksSteps.map(step => (
          <div
            key={step.step}
            className="relative bg-[#f8fafc] border border-[#e2e8f0] rounded-[18px] p-[18px]"
          >
            <span className="grid place-items-center w-[34px] h-[34px] rounded-full bg-[#0866ff] text-white mb-3 text-sm font-black">
              {step.step}
            </span>
            <h3 className="m-0 mb-1.5 text-base font-bold text-[#121826]">{step.title}</h3>
            <p className="m-0 text-[#687589] text-[13px] leading-[1.55]">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
