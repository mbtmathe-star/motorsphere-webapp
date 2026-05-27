import Link from 'next/link';
import Breadcrumb from '@/components/shared/Breadcrumb';

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Terms of Use' }]} />

      <div>
        <h1 className="text-3xl font-black text-gray-900">Terms of Use</h1>
        <p className="text-gray-500 mt-2 text-sm">Last updated: May 2025</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6 text-gray-700">

        <section>
          <h2 className="text-base font-black text-gray-900">1. Acceptance of Terms</h2>
          <p className="text-sm text-gray-600 mt-1">
            By accessing or using the MotorSphere platform, you agree to be bound by these Terms of Use and our Privacy Policy.
            If you do not agree, please do not use the platform.
          </p>
        </section>

        <section>
          <h2 className="text-base font-black text-gray-900">2. Platform Description</h2>
          <p className="text-sm text-gray-600 mt-1">
            MotorSphere is an online marketplace connecting buyers and sellers of vehicles, automotive parts, and related services in South Africa.
            MotorSphere acts as a platform only and is not a party to any transaction between users.
          </p>
        </section>

        <section>
          <h2 className="text-base font-black text-gray-900">3. User Accounts</h2>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 mt-1">
            <li>You must be 18 years or older to create an account</li>
            <li>You are responsible for maintaining the security of your credentials</li>
            <li>One account per person — multiple accounts are prohibited</li>
            <li>Business accounts require valid CIPC registration</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-black text-gray-900">4. Listing Rules</h2>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 mt-1">
            <li>All information must be accurate, complete and not misleading</li>
            <li>Photos must be of the actual item being sold</li>
            <li>You may only list items you legally own or are authorised to sell</li>
            <li>Stolen vehicles, counterfeit parts or illegal modifications are prohibited</li>
            <li>All listings are subject to admin review before going live</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-black text-gray-900">5. Fees and Payments</h2>
          <p className="text-sm text-gray-600 mt-1">
            Basic listings are currently free during the beta phase. Premium features and pricing will be introduced in a future version.
            All applicable taxes (VAT) will be added where required by South African law.
          </p>
        </section>

        <section>
          <h2 className="text-base font-black text-gray-900">6. Prohibited Conduct</h2>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 mt-1">
            <li>Spam, scams, phishing or fraudulent listings</li>
            <li>Harassment or abusive communication</li>
            <li>Scraping or automated access to the platform</li>
            <li>Circumventing admin moderation or review processes</li>
            <li>Posting false or misleading vehicle information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-black text-gray-900">7. Limitation of Liability</h2>
          <p className="text-sm text-gray-600 mt-1">
            MotorSphere provides a platform only. We do not verify the mechanical condition of vehicles listed,
            and are not liable for disputes between buyers and sellers. Transactions are between users directly.
            We strongly recommend independent inspections before purchasing any vehicle.
          </p>
        </section>

        <section>
          <h2 className="text-base font-black text-gray-900">8. Intellectual Property</h2>
          <p className="text-sm text-gray-600 mt-1">
            All platform code, design, branding and content created by MotorSphere remains our property.
            User-submitted content (photos, listings) remains the property of the user, with a licence granted to MotorSphere for display purposes.
          </p>
        </section>

        <section>
          <h2 className="text-base font-black text-gray-900">9. Governing Law</h2>
          <p className="text-sm text-gray-600 mt-1">
            These terms are governed by South African law. Disputes shall be subject to the jurisdiction of South African courts.
          </p>
        </section>

        <section>
          <h2 className="text-base font-black text-gray-900">10. Contact</h2>
          <p className="text-sm text-gray-600 mt-1">
            Questions about these terms? <Link href="/contact" className="text-[#0866ff] hover:underline">Contact us here</Link>.
          </p>
        </section>
      </div>

      <div className="flex gap-4 text-sm">
        <Link href="/privacy" className="font-bold text-[#0866ff] hover:underline">Privacy Policy</Link>
        <Link href="/trust-safety" className="font-bold text-[#0866ff] hover:underline">Trust &amp; Safety</Link>
      </div>
    </div>
  );
}
