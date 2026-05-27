// src/components/home/RoleDirectionSection.tsx
import Link from 'next/link';
import { roles } from '@/data/home-data';

export default function RoleDirectionSection() {
  return (
    <section className="mb-7 bg-white/[.96] border border-white/[.78] rounded-[26px] shadow-[0_12px_28px_rgba(15,23,42,.12)] p-[clamp(22px,4vw,42px)] overflow-hidden text-[#121826]">
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#eef4ff] text-[#0866ff] text-[12px] font-black uppercase tracking-[.04em] mb-3">
        Built for every automotive user
      </span>
      <h2 className="m-0 mb-3 text-[clamp(30px,4vw,48px)] leading-none font-black tracking-[-0.045em] text-[#121826]">
        Your platform, built around your role.
      </h2>
      <p className="m-0 mb-6 text-[#687589] text-base leading-[1.7] max-w-[780px]">
        Whether you are buying, selling, managing stock or offering services, MotorSphere gives you a dedicated
        dashboard and the tools that match how you work in the automotive industry.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {roles.map(role => (
          <Link
            key={role.id}
            href={role.route}
            className="rounded-2xl border border-[#e2e8f0] bg-white p-4 text-left shadow-[0_10px_22px_rgba(15,23,42,.06)] hover:border-[#0866ff] hover:shadow-[0_12px_28px_rgba(8,102,255,.12)] transition-all duration-200 block"
          >
            <h3 className="m-0 mb-1 text-[15px] font-bold text-[#121826]">{role.title}</h3>
            <p className="m-0 text-[#687589] text-[12px] leading-[1.5]">{role.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
