import Link from 'next/link';

const links = [
  { label: 'About', href: '/about' },
  { label: 'Trust & Safety', href: '/trust-safety' },
  { label: 'Privacy / POPIA', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Contact', href: '/contact' },
];

export default function SiteFooterInner() {
  return (
    <footer className="border-t border-black/[.08] py-8 px-[3.8vw]" style={{ background: '#121826' }}>
      <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" className="inline-flex items-center gap-2 text-white font-black text-[15px]">
          <span className="w-4 h-[12px] inline-block rounded-[3px]"
            style={{ background: 'linear-gradient(135deg,#fff 0 45%,transparent 46%),linear-gradient(45deg,#31c4ff,#06b351)' }} />
          MotorSphere SA
        </Link>
        <nav className="flex flex-wrap items-center gap-4 justify-center">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="text-white/60 text-xs font-bold hover:text-white transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="text-white/40 text-xs">© 2025 MotorSphere SA. All rights reserved.</p>
      </div>
    </footer>
  );
}
