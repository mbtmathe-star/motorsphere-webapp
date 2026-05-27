import Link from 'next/link';
import Breadcrumb from '@/components/shared/Breadcrumb';

export default function TrustSafetyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Trust & Safety' }]} />

      <div>
        <h1 className="text-3xl font-black text-gray-900">Trust &amp; Safety</h1>
        <p className="text-gray-500 mt-2 text-sm">
          How MotorSphere protects buyers, sellers and the broader automotive community.
        </p>
      </div>

      {/* Why safer */}
      <section>
        <h2 className="text-xl font-black text-gray-800 mb-5">Why MotorSphere is safer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: '✅', title: 'Admin-approved listings',
              desc: 'Every listing is reviewed by a human moderator before it goes live. No self-published spam.',
            },
            {
              icon: '🔒', title: 'Verified sellers',
              desc: 'Sellers upload government ID and proof of address. Dealer and workshop verification is mandatory.',
            },
            {
              icon: '🚩', title: 'Fraud reporting',
              desc: 'Any user can report a listing. Flagged listings are reviewed within 24 hours.',
            },
            {
              icon: '🛡️', title: 'POPIA-compliant data',
              desc: 'Your data is handled in line with South African POPIA. Consent required, deletion supported.',
            },
            {
              icon: '💬', title: 'Platform-only contact',
              desc: 'Initial contact stays within MotorSphere. Your phone number is hidden until you choose to share.',
            },
            {
              icon: '📋', title: 'Audit trail',
              desc: 'All moderation actions are logged. Platform activity is tracked for dispute resolution.',
            },
          ].map(item => (
            <div key={item.title} className="bg-white rounded-xl border border-gray-100 p-5 flex gap-4">
              <div className="text-2xl shrink-0">{item.icon}</div>
              <div>
                <h3 className="font-black text-gray-900 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Verification tiers */}
      <section>
        <h2 className="text-xl font-black text-gray-800 mb-5">Verification Levels</h2>
        <div className="space-y-3">
          {[
            { badge: 'Email Verified',    color: '#dbeafe', text: '#1d4ed8', desc: 'Email address confirmed on registration.' },
            { badge: 'ID Verified',       color: '#dcfce7', text: '#15803d', desc: 'SA ID or passport document reviewed and approved.' },
            { badge: 'Dealer Verified',   color: '#f3e8ff', text: '#6d28d9', desc: 'Business registration, NaTIS licence and director ID confirmed.' },
            { badge: 'RMI Workshop',      color: '#fef9c3', text: '#a16207', desc: 'RMI membership or application in progress and validated.' },
          ].map(tier => (
            <div key={tier.badge} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
              <span
                className="text-[11px] font-black px-3 py-1 rounded-full shrink-0"
                style={{ background: tier.color, color: tier.text }}
              >
                {tier.badge}
              </span>
              <p className="text-sm text-gray-600">{tier.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tips for buyers */}
      <section>
        <h2 className="text-xl font-black text-gray-800 mb-4">Tips for Staying Safe</h2>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 space-y-3">
          {[
            '✅ Always meet in a public, well-lit location for vehicle inspections.',
            '✅ Never pay a deposit before seeing the vehicle in person.',
            '✅ Verify the seller\'s ID matches the vehicle\'s NaTIS registration.',
            '✅ Use the platform inquiry system — never move to WhatsApp for first contact.',
            '✅ Report listings that seem too good to be true.',
            '✅ Get an independent inspection before committing to a purchase.',
          ].map(tip => (
            <p key={tip} className="text-sm text-amber-800">{tip}</p>
          ))}
        </div>
      </section>

      {/* Report CTA */}
      <div className="bg-gray-900 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white">Spotted something suspicious?</h2>
          <p className="text-sm text-white/60 mt-1">Report a listing and our moderation team will review it immediately.</p>
        </div>
        <Link href="/report"
          className="shrink-0 px-6 py-3 rounded-xl text-sm font-black text-white bg-red-600 hover:bg-red-700 transition-colors">
          Report a Listing
        </Link>
      </div>

      <div className="flex gap-4 text-sm">
        <Link href="/privacy" className="font-bold text-[#0866ff] hover:underline">Privacy Policy</Link>
        <Link href="/terms" className="font-bold text-[#0866ff] hover:underline">Terms of Use</Link>
        <Link href="/contact" className="font-bold text-[#0866ff] hover:underline">Contact Support</Link>
      </div>
    </div>
  );
}
