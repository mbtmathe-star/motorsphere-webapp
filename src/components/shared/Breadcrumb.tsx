import Link from 'next/link';

type Crumb = { label: string; href?: string };

export default function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-[13px] text-[#687589] flex-wrap" aria-label="Breadcrumb">
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="opacity-40">/</span>}
          {c.href ? (
            <Link href={c.href} className="hover:text-[#0866ff] transition-colors font-medium">{c.label}</Link>
          ) : (
            <span className="text-[#121826] font-bold">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
