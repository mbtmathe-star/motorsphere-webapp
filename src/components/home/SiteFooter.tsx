// src/components/home/SiteFooter.tsx
import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer
      className="min-h-[126px] grid place-items-center text-center text-white py-6 px-6"
      style={{
        background: `
          linear-gradient(rgba(0,0,0,.80), rgba(0,0,0,.88)),
          url("https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80") center / cover
        `,
      }}
    >
      <div>
        <Link href="/" className="inline-flex items-center gap-2 text-white font-black text-[17px] tracking-tight mb-4 justify-center">
          <span
            className="w-6 h-[18px] inline-block rounded-[4px] shadow-[0_4px_12px_rgba(0,0,0,.25)]"
            style={{
              background: 'linear-gradient(135deg, #fff 0 45%, transparent 46%), linear-gradient(45deg, #31c4ff, #06b351)',
            }}
          />
          <span>MotorSphere SA</span>
        </Link>
        <p className="text-white/[.82] text-sm m-0">is part of the local4u Group Of Companies</p>
        <nav className="flex flex-wrap gap-4 justify-center mt-4" aria-label="Footer links">
          {[
            { label: 'Privacy', href: '/privacy' },
            { label: 'Terms', href: '/terms' },
            { label: 'Trust & Safety', href: '/trust-safety' },
            { label: 'Contact', href: '/contact' },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/[.72] text-xs font-bold hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
