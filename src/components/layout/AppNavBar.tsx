import Link from 'next/link';

export default function AppNavBar() {
  return (
    <header className="sticky top-0 z-50 h-14 flex items-center justify-between px-[3.8vw] border-b border-white/[.08]" style={{ background: '#121826' }}>
      {/* Logo */}
      <Link href="/" className="inline-flex items-center gap-2 text-white font-black text-[17px] tracking-tight">
        <span className="w-5 h-[15px] inline-block rounded-[3px] shadow-[0_2px_8px_rgba(0,0,0,.25)]"
          style={{ background: 'linear-gradient(135deg,#fff 0 45%,transparent 46%),linear-gradient(45deg,#31c4ff,#06b351)' }} />
        <span>MotorSphere SA</span>
      </Link>

      {/* Centre nav */}
      <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
        {[
          { label: 'Vehicles', href: '/category/vehicles' },
          { label: 'Parts',    href: '/category/parts' },
          { label: 'Workshops',href: '/workshops' },
          { label: 'Insurance',href: '/insurance' },
        ].map(item => (
          <Link key={item.href} href={item.href}
            className="px-3 py-1.5 rounded-lg text-sm font-bold text-white/80 hover:text-white hover:bg-white/[.08] transition-colors">
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <Link href="/login"
          className="px-3 py-1.5 rounded-lg text-sm font-bold text-white/80 hover:text-white hover:bg-white/[.08] transition-colors">
          Login
        </Link>
        <Link href="/register"
          className="px-4 py-1.5 rounded-lg text-sm font-black text-white transition-colors hover:bg-[#064dc1]"
          style={{ background: '#0866ff' }}>
          Register
        </Link>
      </div>
    </header>
  );
}
