'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MenuIcon, GlobeIcon, SettingsIcon, SearchIcon, MapPinIcon,
  PlusIcon, ImageIcon, Icon,
} from './icons';
import { heroSlides, categories } from '@/data/home-data';

const SA_LANGUAGES = [
  'English', 'Afrikaans', 'Zulu', 'Xhosa', 'Sotho',
  'Tswana', 'Tsonga', 'Swati', 'Venda', 'Ndebele', 'Northern Sotho',
];

const MENU_ITEMS = [
  { label: 'About Us',        icon: 'layout', href: '/about' },
  { label: 'Contact Us',      icon: 'phone',  href: '/contact' },
  { label: 'Trust & Safety',  icon: 'shield', href: '/trust-safety' },
  { label: 'POPIA / Privacy', icon: 'lock',   href: '/privacy' },
  { label: 'Post Listing',    icon: 'plus',   href: '/listings/new' },
  { label: 'Dashboard',       icon: 'layout', href: '/dashboard' },
];

export default function SiteHeader() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [language, setLanguage] = useState('English');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advanceSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(advanceSlide, 4500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [advanceSlide]);

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(advanceSlide, 4500);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest('#ms-menu-btn') && !target.closest('#ms-menu-dropdown')) {
        setMenuOpen(false);
      }
      if (!target.closest('#ms-lang-btn') && !target.closest('#ms-lang-dropdown')) {
        setLangOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const slide = heroSlides[currentSlide];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* ── Hero Section ───────────────────────────────────────────────────────── */}
      <section
        className="relative pb-8"
        style={{
          background: `url("https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80") center top / cover`,
        }}
      >
        {/* ── Top Controls ─────────────────────────────────────────────────────── */}
        <div className="px-[3.8vw] grid grid-cols-[1fr_auto_1fr] items-center min-h-[64px] relative z-20" style={{ background: '#0866ff' }}>

          {/* Left: Menu */}
          <div className="relative flex items-center gap-2.5">
            <button
              id="ms-menu-btn"
              onClick={() => { setMenuOpen(o => !o); setLangOpen(false); }}
              className="inline-flex items-center gap-2.5 min-h-[40px] px-[17px] text-white rounded-[10px] text-base font-bold shadow-[0_8px_22px_rgba(0,0,0,.22)] transition-all duration-200 hover:-translate-y-px"
              style={{ background: 'rgba(255,255,255,.2)' }}
              aria-expanded={menuOpen}
              aria-label="Main menu"
            >
              <span className="w-5 h-5"><MenuIcon /></span>
              <span>Menu</span>
            </button>

            {/* Menu Dropdown */}
            {menuOpen && (
              <div
                id="ms-menu-dropdown"
                className="absolute top-12 left-0 w-[250px] bg-white text-[#1a2635] rounded-[10px] shadow-[0_18px_45px_rgba(0,0,0,.22)] border border-black/[.08] overflow-hidden z-40"
              >
                {MENU_ITEMS.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3.5 w-full px-4 py-3.5 text-[15px] font-bold text-[#30415a] hover:bg-[#eef5ff] hover:text-[#065df4] transition-colors"
                  >
                    <span className="w-5 h-5 shrink-0"><Icon name={item.icon} /></span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Center: Logo */}
          <Link
            href="/"
            className="justify-self-center text-center inline-flex items-center gap-2 text-white/[.92] text-[17px] font-black tracking-tight drop-shadow-[0_3px_18px_rgba(0,0,0,.45)]"
          >
            {/* Logo mark */}
            <span
              className="w-6 h-[18px] inline-block rounded-[4px] shadow-[0_4px_12px_rgba(0,0,0,.25)]"
              style={{
                background: 'linear-gradient(135deg, #fff 0 45%, transparent 46%), linear-gradient(45deg, #31c4ff, #06b351)',
              }}
            />
            <span>MotorSphere SA</span>
          </Link>

          {/* Right: Language + Settings */}
          <div className="justify-self-end flex items-center gap-2.5 relative">
            {/* Language button */}
            <button
              id="ms-lang-btn"
              onClick={() => { setLangOpen(o => !o); setMenuOpen(false); }}
              className="inline-flex items-center gap-2.5 min-h-[40px] px-[17px] text-white rounded-[10px] text-base font-bold shadow-[0_8px_22px_rgba(0,0,0,.22)] transition-all duration-200 hover:-translate-y-px"
              style={{ background: 'rgba(255,255,255,.2)' }}
              aria-expanded={langOpen}
              aria-label="Select language"
            >
              <span className="w-5 h-5"><GlobeIcon /></span>
              <span>{language}</span>
            </button>

            {/* Language Dropdown */}
            {langOpen && (
              <div
                id="ms-lang-dropdown"
                className="absolute top-12 right-14 w-[190px] max-h-[400px] overflow-y-auto bg-white text-[#1a2635] rounded-[10px] shadow-[0_18px_45px_rgba(0,0,0,.22)] border border-black/[.08] z-40"
              >
                {SA_LANGUAGES.map(lang => (
                  <button
                    key={lang}
                    onClick={() => { setLanguage(lang); setLangOpen(false); }}
                    className={`flex w-full items-center px-4 py-3 text-sm font-bold text-left transition-colors hover:bg-[#eef5ff] hover:text-[#065df4] ${language === lang ? 'bg-[#eef5ff] text-[#065df4]' : ''}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}

            {/* Settings button */}
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center justify-center w-10 h-10 text-white rounded-[10px] shadow-[0_8px_22px_rgba(0,0,0,.22)] transition-all duration-200 hover:-translate-y-px"
              style={{ background: 'rgba(255,255,255,.2)' }}
              aria-label="Open backoffice settings"
            >
              <span className="w-5 h-5"><SettingsIcon /></span>
            </button>
          </div>
        </div>

        {/* ── Ad Banner Slideshow ───────────────────────────────────────────────── */}
        {bannerVisible && (
          <div
            className="relative mx-[-3.8vw] min-h-[164px] flex items-center overflow-hidden z-10"
            style={{
              background: `linear-gradient(90deg, rgba(0,0,0,.58), rgba(0,0,0,.18)), url("${slide.image}") center / cover`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-[#0d194d]/25 to-black/55" />

            {/* Content */}
            <div className="relative z-10 w-full max-w-[980px] min-w-0 px-[3.8vw] pr-16 text-white">
              <h1 className="m-0 mb-2 text-3xl sm:text-4xl leading-[1.05] font-black tracking-[-0.03em]">
                {slide.title}
              </h1>
              <p className="m-0 mb-4 text-base text-white/90">{slide.subtitle}</p>
              <Link
                href={slide.route}
                className="inline-block border-0 rounded-full px-6 py-3 bg-white text-[#0866ff] text-base shadow-[0_8px_20px_rgba(0,0,0,.12)] font-bold hover:bg-white/90 transition-colors"
              >
                Learn More
              </Link>
            </div>

            {/* Close banner */}
            <button
              onClick={() => setBannerVisible(false)}
              className="absolute right-4 top-4 w-[30px] h-[30px] border-0 rounded-full text-white flex items-center justify-center hover:bg-black/60 transition-colors"
              style={{ background: 'rgba(0,0,0,.45)' }}
              aria-label="Close banner"
            >
              <span className="text-xl leading-none">×</span>
            </button>

            {/* Slide dots */}
            <div className="absolute left-1/2 bottom-2.5 -translate-x-1/2 flex items-center gap-2">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    idx === currentSlide
                      ? 'w-[26px] h-[9px] bg-white'
                      : 'w-[9px] h-[9px] bg-white/45 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Search Bar ───────────────────────────────────────────────────────── */}
        <form
          onSubmit={handleSearch}
          className="relative z-10 mx-auto mt-12 mb-8 flex items-center gap-0 rounded-full bg-white shadow-[0_20px_38px_rgba(0,0,0,.16)]"
          style={{ width: 'min(810px, 88vw)', padding: '8px' }}
        >
          <span className="grid place-items-center w-[38px] text-[#8b9bb0]">
            <SearchIcon className="w-[22px] h-[22px]" />
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search vehicles, parts, services, or auctions..."
            className="flex-1 min-w-0 border-0 outline-none bg-transparent text-[#313b4b] text-base placeholder-[#929cab]"
          />
          <button
            type="button"
            title="Use current location"
            className="grid place-items-center w-[42px] text-[#0866ff] bg-transparent border-0"
            aria-label="Use my location"
          >
            <MapPinIcon className="w-[22px] h-[22px]" />
          </button>
          <button
            type="submit"
            className="h-12 min-w-[116px] border-0 rounded-full bg-[#0866ff] text-white font-black text-[15px] hover:bg-[#064dc1] transition-colors"
          >
            Search
          </button>
        </form>

        {/* ── Category Grid ─────────────────────────────────────────────────────── */}
        <section className="relative z-10 px-[2.6vw] py-6">
          <div
            className="grid gap-4 mx-auto"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              maxWidth: '1280px',
            }}
          >
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className="flex flex-col items-center justify-center text-center min-h-[112px] rounded-[14px] p-3.5 text-white font-bold transition-all duration-[180ms] hover:-translate-y-[5px] hover:brightness-110 active:scale-95"
                style={{
                  background:           'rgba(255,255,255,.13)',
                  backdropFilter:       'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  border:               '1px solid rgba(255,255,255,.22)',
                  boxShadow:            '0 4px 20px rgba(0,0,0,.22), inset 0 1px 0 rgba(255,255,255,.18)',
                }}
                title={cat.desc}
              >
                <span className="w-[38px] h-[38px] mb-2.5 drop-shadow-[0_2px_6px_rgba(0,0,0,.35)]">
                  <Icon name={cat.icon} className="w-full h-full" />
                </span>
                <span className="text-sm leading-[1.2] drop-shadow-[0_1px_3px_rgba(0,0,0,.4)]">{cat.label}</span>
              </Link>
            ))}
          </div>
        </section>
      </section>

      {/* ── Backoffice Modal ──────────────────────────────────────────────────────── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,.68)', backdropFilter: 'blur(2px)' }}
          onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}
          role="dialog"
          aria-modal="true"
          aria-label="MotorSphere Backoffice"
        >
          <div
            className="w-full max-w-[1150px] min-h-[400px] bg-white text-[#121212] rounded-xl overflow-hidden shadow-[0_28px_80px_rgba(0,0,0,.36)]"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="h-[90px] border-b border-[#eee] flex items-center justify-between px-6">
              <h2 className="text-2xl font-bold m-0">MotorSphere Backoffice</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-3xl leading-none text-[#111] bg-transparent border-0 hover:text-[#555] transition-colors"
                aria-label="Close backoffice"
              >
                ×
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 pb-16">
              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8">
                {[
                  { value: '12', label: 'Pending listings' },
                  { value: '48', label: 'Live listings' },
                  { value: '7',  label: 'Verification reviews' },
                  { value: '23', label: 'New inquiries' },
                ].map(stat => (
                  <div key={stat.label} className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-4">
                    <strong className="block text-2xl font-black tracking-tight text-[#121826]">{stat.value}</strong>
                    <span className="text-[#687589] text-xs font-bold">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Banner section header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold m-0 text-[#121826]">Advertising Banners</h3>
                <button className="inline-flex items-center gap-2 border-0 rounded-xl px-4 py-3 bg-[#0866ff] text-white font-bold text-sm hover:bg-[#064dc1] transition-colors">
                  <span className="w-4 h-4"><PlusIcon /></span>
                  Add New Banner
                </button>
              </div>

              {/* Empty state */}
              <div className="flex flex-col items-center justify-center py-10 text-[#647083]">
                <span className="w-16 h-16 mb-4 text-[#aeb6c2]">
                  <ImageIcon />
                </span>
                <p className="text-sm">No banners created yet. Click &#34;Add New Banner&#34; to get started.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
