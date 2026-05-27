import Link from 'next/link';
import Breadcrumb from '@/components/shared/Breadcrumb';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]} />

      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-black text-gray-900">About MotorSphere</h1>
        <p className="text-gray-500 mt-3">
          South Africa&rsquo;s all-in-one digital automotive marketplace — built for buyers, sellers, dealers, vendors, workshops and service providers.
        </p>
      </div>

      {/* Vision */}
      <div className="bg-gray-900 rounded-2xl p-8 text-center text-white">
        <p className="text-xs font-black uppercase tracking-widest text-white/50 mb-3">Our Vision</p>
        <p className="text-xl font-black leading-snug max-w-2xl mx-auto">
          &ldquo;To revolutionise the South African automotive industry by providing a trusted, all-in-one digital platform that simplifies every aspect of vehicle ownership, trade and services.&rdquo;
        </p>
      </div>

      {/* Mission */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
        <p className="text-xs font-black uppercase tracking-widest text-blue-500 mb-2">Our Mission</p>
        <p className="text-base font-bold text-blue-900 leading-relaxed max-w-2xl mx-auto">
          To create a secure, efficient and user-friendly marketplace that connects buyers, sellers and service providers while maintaining high standards of legal compliance, transparency and data protection.
        </p>
      </div>

      {/* What MotorSphere does */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <h2 className="text-xl font-black text-gray-900">More than a classifieds website</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            MotorSphere is a comprehensive South African digital automotive marketplace designed to bring every part of the automotive industry into one unified platform.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Whether you are buying or selling a vehicle, sourcing new or used parts, finding a trusted workshop, comparing insurance, or needing emergency roadside assistance — MotorSphere connects you with the right people, in a safer, more verified environment.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Every listing is reviewed by our admin team before it goes live. Every seller can be verified. Every buyer can browse with confidence, knowing that MotorSphere screens what is on the platform.
          </p>
        </div>
        <div className="space-y-3">
          <h2 className="text-xl font-black text-gray-900">What MotorSphere covers</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            {[
              'Buy and sell cars, bakkies, trucks, buses and commercial vehicles',
              'Source new and used vehicle parts and spares',
              'Find accessories and compatibility-matched components',
              'Connect with RMI-registered workshops and independent mechanics',
              'Access vehicle insurance options and compare cover',
              'Access towing, roadside and emergency support nationwide',
              'Support logistics and delivery for parts and accessories',
              'Transact in a verified, POPIA-conscious automotive environment',
            ].map(item => (
              <li key={item} className="flex gap-2">
                <span className="text-[#0866ff] shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Who we serve */}
      <section>
        <h2 className="text-xl font-black text-gray-900 mb-5">Who MotorSphere serves</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { role: 'Private Buyers',       icon: '🔍', desc: 'Search, compare and safely inquire on verified listings.' },
            { role: 'Private Sellers',      icon: '🚗', desc: 'List vehicles with admin approval before marketplace visibility.' },
            { role: 'Registered Dealerships',icon: '🏢', desc: 'Manage stock, verification and customer leads in one place.' },
            { role: 'Parts Suppliers',      icon: '🔧', desc: 'Reach buyers with compatibility-matched inventory.' },
            { role: 'Workshops',            icon: '🏅', desc: 'Advertise services, display RMI status and receive bookings.' },
            { role: 'Insurance Partners',   icon: '🛡️', desc: 'Connect with vehicle owners actively seeking cover.' },
            { role: 'Logistics Providers',  icon: '📦', desc: 'Support parts delivery and automotive services.' },
            { role: 'Fleet Operators',      icon: '🚛', desc: 'Source commercial vehicles, maintenance and tracking.' },
            { role: 'Mechanics',            icon: '⚙️', desc: 'Build your online presence and reach local vehicle owners.' },
          ].map(item => (
            <div key={item.role} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="text-2xl mb-2">{item.icon}</div>
              <h3 className="font-black text-gray-900 text-sm">{item.role}</h3>
              <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core values */}
      <section>
        <h2 className="text-xl font-black text-gray-900 mb-5">Our core commitments</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: '🔒', title: 'Trust first',        desc: 'Seller verification, admin approval and fraud reporting are built into every listing flow.' },
            { icon: '🌍', title: 'South Africa first', desc: 'Designed for ZAR pricing, POPIA compliance, NaTIS processes and the local automotive market.' },
            { icon: '⚡', title: 'Accessible to all',  desc: 'Low-cost listing options for private sellers, dealers and service providers of every size.' },
          ].map(v => (
            <div key={v.title} className="bg-white rounded-xl border border-gray-100 p-5 text-center">
              <div className="text-3xl mb-2">{v.icon}</div>
              <h3 className="font-black text-gray-900 text-sm">{v.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="rounded-2xl p-6 text-center text-white" style={{ background: '#0866ff' }}>
        <h2 className="text-xl font-black">Join MotorSphere today</h2>
        <p className="text-white/70 text-sm mt-1">Register as a buyer, seller, dealer, vendor or workshop. Free to join.</p>
        <div className="flex gap-3 mt-5 justify-center">
          <Link href="/register"
            className="px-6 py-3 rounded-xl text-sm font-black bg-white hover:bg-gray-100 transition-colors"
            style={{ color: '#0866ff' }}>
            Register Free
          </Link>
          <Link href="/category/vehicles"
            className="px-6 py-3 rounded-xl text-sm font-black border border-white/30 text-white hover:bg-white/10 transition-colors">
            Browse Listings
          </Link>
        </div>
      </div>

      <div className="flex gap-4 text-sm">
        <Link href="/trust-safety" className="font-bold text-[#0866ff] hover:underline">Trust &amp; Safety</Link>
        <Link href="/contact" className="font-bold text-[#0866ff] hover:underline">Contact Us</Link>
        <Link href="/privacy" className="font-bold text-[#0866ff] hover:underline">Privacy Policy</Link>
      </div>
    </div>
  );
}
