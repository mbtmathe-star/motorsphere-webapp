import Link from 'next/link';
import Breadcrumb from '@/components/shared/Breadcrumb';

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy' }]} />

      <div>
        <h1 className="text-3xl font-black text-gray-900">Privacy Policy</h1>
        <p className="text-gray-500 mt-2 text-sm">Last updated: May 2025 · In compliance with POPIA (Act 4 of 2013)</p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
        <span className="text-xl">🔒</span>
        <div>
          <p className="text-sm font-black text-blue-800">POPIA Compliance</p>
          <p className="text-xs text-blue-600 mt-1">
            MotorSphere SA (Pty) Ltd is committed to protecting your personal information in accordance with the Protection of Personal Information Act (POPIA), Act 4 of 2013.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 prose prose-sm max-w-none text-gray-700 space-y-6">

        <section>
          <h2 className="text-base font-black text-gray-900">1. Responsible Party</h2>
          <p className="text-sm text-gray-600">
            MotorSphere SA (Pty) Ltd is the Responsible Party for the purposes of POPIA.
            Our Information Officer is reachable via the contact details below.
            Contact: <Link href="/contact" className="text-[#0866ff] hover:underline">Contact Us</Link>
          </p>
        </section>

        <section>
          <h2 className="text-base font-black text-gray-900">2. Information We Collect</h2>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
            <li>Name, email address and contact number on registration</li>
            <li>Identity documents for verified seller / dealer accounts</li>
            <li>Listing details and images you submit</li>
            <li>Inquiry messages and communications on-platform</li>
            <li>Usage data: pages visited, search queries, listing views</li>
            <li>Device and browser information (standard web analytics)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-black text-gray-900">3. Why We Collect It</h2>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
            <li>To provide the MotorSphere marketplace service</li>
            <li>To verify seller, dealer and workshop identities</li>
            <li>To facilitate buyer-seller communication</li>
            <li>To moderate listings and prevent fraud</li>
            <li>To comply with South African law and regulations</li>
            <li>To improve our service (analytics, with your consent)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-black text-gray-900">4. Who We Share It With</h2>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
            <li>Insurance partners — only with your explicit consent when requesting a quote</li>
            <li>Firebase (Google) — cloud hosting and authentication (GDPR/POPIA compliant)</li>
            <li>Law enforcement — only when required by a court order</li>
            <li>We do <strong>not</strong> sell your data to third parties</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-black text-gray-900">5. Data Retention</h2>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
            <li>Account data: retained while your account is active</li>
            <li>After deletion request: 30-day grace period, then permanent deletion</li>
            <li>Inquiry records: retained 24 months for dispute resolution</li>
            <li>Verification documents: deleted within 30 days of account closure</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-black text-gray-900">6. Your Rights (POPIA Section 5)</h2>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
            <li>Right to access your personal information</li>
            <li>Right to correct inaccurate information</li>
            <li>Right to request deletion of your data</li>
            <li>Right to object to processing</li>
            <li>Right to lodge a complaint with the Information Regulator</li>
          </ul>
          <p className="text-sm text-gray-600 mt-2">
            To exercise these rights, contact us via <Link href="/contact" className="text-[#0866ff] hover:underline">our contact form</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-base font-black text-gray-900">7. Cookies</h2>
          <p className="text-sm text-gray-600">
            We use session cookies (authentication), preference cookies (language, theme) and optional analytics cookies.
            Analytics cookies require your consent and can be declined.
          </p>
        </section>

        <section>
          <h2 className="text-base font-black text-gray-900">8. Changes to This Policy</h2>
          <p className="text-sm text-gray-600">
            We may update this policy. Material changes will be communicated by email and a notice on the platform.
            Continued use after notification constitutes acceptance.
          </p>
        </section>
      </div>

      <div className="flex gap-4 text-sm">
        <Link href="/terms" className="font-bold text-[#0866ff] hover:underline">Terms of Use</Link>
        <Link href="/trust-safety" className="font-bold text-[#0866ff] hover:underline">Trust &amp; Safety</Link>
        <Link href="/contact" className="font-bold text-[#0866ff] hover:underline">Contact Us</Link>
      </div>
    </div>
  );
}
