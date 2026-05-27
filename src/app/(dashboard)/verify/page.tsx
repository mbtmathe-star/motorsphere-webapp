'use client';

import { useEffect, useState } from 'react';

type DemoUser = { email: string; role: string; name: string };

type DocStatus = 'not_uploaded' | 'uploaded' | 'verified';

type Doc = {
  id: string;
  label: string;
  desc: string;
  required: boolean;
  status: DocStatus;
};

const DOCS_BY_ROLE: Record<string, Doc[]> = {
  seller: [
    { id: 'id', label: 'SA ID / Passport', desc: 'Clear copy of your South African ID or passport.', required: true, status: 'not_uploaded' },
    { id: 'proof', label: 'Proof of Address', desc: 'Bank statement or utility bill — not older than 3 months.', required: true, status: 'not_uploaded' },
    { id: 'selfie', label: 'Selfie with ID', desc: 'Hold your ID next to your face.', required: false, status: 'not_uploaded' },
  ],
  dealer: [
    { id: 'biz', label: 'Business Registration', desc: 'CIPC certificate or CK document.', required: true, status: 'not_uploaded' },
    { id: 'id', label: 'Director ID', desc: 'SA ID of the responsible director.', required: true, status: 'not_uploaded' },
    { id: 'vat', label: 'VAT Registration', desc: 'SARS VAT registration certificate.', required: false, status: 'not_uploaded' },
    { id: 'natis', label: 'NaTIS Dealer Licence', desc: 'Current Motor Dealer licence from NATIS.', required: true, status: 'not_uploaded' },
  ],
  workshop: [
    { id: 'id', label: 'Owner ID', desc: 'SA ID of the workshop owner.', required: true, status: 'not_uploaded' },
    { id: 'rmi', label: 'RMI Membership Certificate', desc: 'Current RMI membership or application.', required: false, status: 'not_uploaded' },
    { id: 'trade', label: 'Trade Licence', desc: 'Current municipal trade licence.', required: true, status: 'not_uploaded' },
  ],
  vendor: [
    { id: 'id', label: 'SA ID / Passport', desc: 'Clear copy of your South African ID or passport.', required: true, status: 'not_uploaded' },
    { id: 'biz', label: 'Business Registration', desc: 'CIPC certificate if trading as a business.', required: false, status: 'not_uploaded' },
  ],
};

const STATUS_STYLES: Record<DocStatus, { icon: string; label: string; bg: string; text: string }> = {
  not_uploaded: { icon: '📄', label: 'Not uploaded', bg: '#f3f4f6', text: '#6b7280' },
  uploaded:     { icon: '⏳', label: 'Under review', bg: '#fef9c3', text: '#a16207' },
  verified:     { icon: '✅', label: 'Verified',     bg: '#dcfce7', text: '#15803d' },
};

export default function VerifyPage() {
  const [user, setUser]   = useState<DemoUser | null>(null);
  const [docs, setDocs]   = useState<Doc[]>([]);
  const [submitted, setSub] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('ms_demo_user');
    if (stored) {
      try {
        const u = JSON.parse(stored) as DemoUser;
        setUser(u);
        const roleDocs = DOCS_BY_ROLE[u.role] ?? DOCS_BY_ROLE.seller;
        setDocs(roleDocs);
      } catch { /* ignore */ }
    }
  }, []);

  const upload = (id: string) => {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, status: 'uploaded' } : d));
  };

  const allRequired = docs.filter(d => d.required).every(d => d.status !== 'not_uploaded');

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Verify Your Account</h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload the required documents to get your verified badge and unlock higher listing limits.
        </p>
      </div>

      {/* Benefits */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-xs font-black text-blue-700 mb-2">Benefits of verification</p>
        <ul className="text-xs text-blue-600 space-y-1">
          <li>✓ Verified badge on your profile and listings</li>
          <li>✓ Higher listing limits and priority placement</li>
          <li>✓ Buyer trust — buyers prefer verified sellers</li>
          {user.role === 'dealer' && <li>✓ Dealer storefront page</li>}
          {user.role === 'workshop' && <li>✓ RMI workshop badge and directory listing</li>}
        </ul>
      </div>

      {/* POPIA notice */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-500">
        🔒 Documents are stored securely and only accessed by authorised MotorSphere administrators. All data handled in accordance with POPIA.
      </div>

      {/* Documents */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {docs.map((doc, i) => {
          const s = STATUS_STYLES[doc.status];
          return (
            <div key={doc.id} className={`p-4 ${i > 0 ? 'border-t border-gray-100' : ''}`}>
              <div className="flex items-start gap-3">
                <div className="text-2xl">{s.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-black text-gray-900">{doc.label}</p>
                    {doc.required && (
                      <span className="text-[10px] font-black text-red-500">Required</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{doc.desc}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span
                      className="text-[10px] font-black px-2 py-0.5 rounded-full"
                      style={{ background: s.bg, color: s.text }}
                    >
                      {s.label}
                    </span>
                    {doc.status === 'not_uploaded' && (
                      <button
                        onClick={() => upload(doc.id)}
                        className="text-xs font-bold text-[#0866ff] hover:underline"
                      >
                        Upload file (demo)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit */}
      {!submitted ? (
        <button
          disabled={!allRequired}
          onClick={() => setSub(true)}
          className="w-full py-3 rounded-xl text-sm font-black text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
          style={{ background: '#0866ff' }}
        >
          {allRequired ? 'Submit Verification Application' : 'Upload required documents to continue'}
        </button>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
          <div className="text-3xl mb-2">🎉</div>
          <p className="text-sm font-black text-green-800">Application Submitted!</p>
          <p className="text-xs text-green-700 mt-1">
            Our team will review your documents within 1–2 business days. You will receive an email notification.
          </p>
        </div>
      )}
    </div>
  );
}
