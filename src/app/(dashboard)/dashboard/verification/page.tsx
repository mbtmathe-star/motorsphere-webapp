'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { submitVerification } from '@/lib/firebase/users';
import { getRoleDashboardPath } from '@/lib/permissions';
import { PROVINCES } from '@/types/firestore.types';
import type { VerificationSubmission } from '@/lib/firebase/users';

// ─── File upload placeholder ──────────────────────────────────────────────────

function DocUpload({
  label,
  desc,
  required,
  name,
  onSelect,
}: {
  label:    string;
  desc:     string;
  required: boolean;
  name:     string;
  onSelect: (name: string, filename: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [filename, setFilename] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFilename(file.name);
      onSelect(name, file.name);
    }
  };

  return (
    <div className="border border-dashed border-gray-200 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="text-xl shrink-0">{filename ? '📎' : '📄'}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-black text-gray-900">{label}</p>
            {required && <span className="text-[10px] font-black text-red-500">Required</span>}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
          {filename ? (
            <p className="text-xs text-green-700 font-bold mt-1.5">✓ {filename}</p>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-2 text-xs font-bold text-[#0866ff] hover:underline"
            >
              Select document
            </button>
          )}
          {filename && (
            <button
              type="button"
              onClick={() => { setFilename(null); onSelect(name, ''); }}
              className="mt-1 text-xs text-gray-400 hover:text-gray-600"
            >
              Remove
            </button>
          )}
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Submitted state ──────────────────────────────────────────────────────────

function SubmittedState({ status }: { status: string }) {
  const isApproved = status === 'approved';
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Verification Status</h1>
        <p className="text-sm text-gray-500 mt-1">Your current verification status on MotorSphere.</p>
      </div>
      <div className={`rounded-xl border p-6 text-center ${isApproved ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
        <div className="text-4xl mb-3">{isApproved ? '✅' : '⏳'}</div>
        <p className={`text-base font-black ${isApproved ? 'text-green-800' : 'text-amber-800'}`}>
          {isApproved
            ? 'Verification approved'
            : 'Verification under review'}
        </p>
        <p className={`text-sm mt-2 ${isApproved ? 'text-green-700' : 'text-amber-700'}`}>
          {isApproved
            ? 'Your account has been verified. You can now submit listings for admin review.'
            : 'Our team is reviewing your application. You will be notified within 1–2 business days.'}
        </p>
      </div>
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-500">
        🔒 Documents are stored securely and accessed only by authorised MotorSphere administrators. All data handled in accordance with POPIA (Act 4 of 2013).
      </div>
    </div>
  );
}

// ─── Buyer form ───────────────────────────────────────────────────────────────

function BuyerForm({ onSubmit, loading }: { onSubmit: (d: Partial<VerificationSubmission>) => void; loading: boolean }) {
  const [city,       setCity]       = useState('');
  const [province,   setProvince]   = useState('');
  const [interests,  setInterests]  = useState<string[]>([]);

  const INTERESTS = ['Vehicles', 'Parts', 'Services', 'Insurance'];

  const toggleInterest = (i: string) =>
    setInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit({ city, province, preferredInterests: interests }); }} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-black text-gray-700 mb-1.5">City</label>
          <input value={city} onChange={e => setCity(e.target.value)}
            placeholder="e.g. Johannesburg"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0866ff] bg-white" />
        </div>
        <div>
          <label className="block text-xs font-black text-gray-700 mb-1.5">Province</label>
          <select value={province} onChange={e => setProvince(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0866ff] bg-white">
            <option value="">Select province</option>
            {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-black text-gray-700 mb-2">Preferred interests</label>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map(i => (
            <button key={i} type="button" onClick={() => toggleInterest(i)}
              className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${
                interests.includes(i)
                  ? 'bg-[#0866ff] text-white border-[#0866ff]'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-[#0866ff]'
              }`}>
              {i}
            </button>
          ))}
        </div>
      </div>
      <button type="submit" disabled={loading}
        className="w-full py-3 rounded-xl text-sm font-black text-white disabled:opacity-60 hover:opacity-90 transition-opacity"
        style={{ background: '#0866ff' }}>
        {loading ? 'Saving…' : 'Complete Profile'}
      </button>
    </form>
  );
}

// ─── Private Seller form ──────────────────────────────────────────────────────

function SellerForm({ onSubmit, loading }: { onSubmit: (d: Partial<VerificationSubmission>) => void; loading: boolean }) {
  const [city,        setCity]        = useState('');
  const [province,    setProvince]    = useState('');
  const [declaration, setDeclaration] = useState(false);
  const [authorised,  setAuthorised]  = useState(false);
  const [contactPref, setContactPref] = useState('platform_only');
  const [docs,        setDocs]        = useState<Record<string, string>>({});

  const handleDoc = (name: string, filename: string) =>
    setDocs(prev => ({ ...prev, [name]: filename }));

  const allRequiredDocs = Boolean(docs['id'] && docs['proof']);
  const canSubmit = declaration && authorised && allRequiredDocs;

  return (
    <form onSubmit={e => {
      e.preventDefault();
      onSubmit({
        city, province,
        sellerDeclaration: declaration,
        authorisedToSell: authorised,
        preferredContactMethod: contactPref,
        documentsSubmitted: Object.values(docs).filter(Boolean),
      });
    }} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-black text-gray-700 mb-1.5">City</label>
          <input value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Cape Town"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0866ff] bg-white" />
        </div>
        <div>
          <label className="block text-xs font-black text-gray-700 mb-1.5">Province</label>
          <select value={province} onChange={e => setProvince(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0866ff] bg-white">
            <option value="">Select province</option>
            {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-black text-gray-700 mb-1.5">Preferred contact method</label>
        <select value={contactPref} onChange={e => setContactPref(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0866ff] bg-white">
          <option value="platform_only">Platform messages only</option>
          <option value="show_phone">Show phone number to buyers</option>
          <option value="show_whatsapp">Show WhatsApp to buyers</option>
        </select>
      </div>
      <div className="space-y-3">
        <p className="text-xs font-black text-gray-700">Verification documents</p>
        <DocUpload label="SA ID / Passport" desc="Clear copy of your South African ID or passport." required name="id" onSelect={handleDoc} />
        <DocUpload label="Proof of Address" desc="Bank statement or utility bill — not older than 3 months." required name="proof" onSelect={handleDoc} />
        <DocUpload label="Selfie with ID" desc="Hold your ID next to your face." required={false} name="selfie" onSelect={handleDoc} />
      </div>
      <div className="space-y-3 border-t border-gray-100 pt-4">
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input type="checkbox" checked={declaration} onChange={e => setDeclaration(e.target.checked)}
            className="mt-0.5 accent-[#0866ff]" />
          <span className="text-xs text-gray-600">I declare that all information provided is accurate and that I am the authorised representative for this seller account.</span>
        </label>
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input type="checkbox" checked={authorised} onChange={e => setAuthorised(e.target.checked)}
            className="mt-0.5 accent-[#0866ff]" />
          <span className="text-xs text-gray-600">I confirm that I am authorised to sell the vehicles or parts I will be listing on MotorSphere.</span>
        </label>
      </div>
      <button type="submit" disabled={!canSubmit || loading}
        className="w-full py-3 rounded-xl text-sm font-black text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
        style={{ background: '#0866ff' }}>
        {loading ? 'Submitting…' : canSubmit ? 'Submit Verification Application' : 'Complete all required fields to continue'}
      </button>
    </form>
  );
}

// ─── Dealer form ──────────────────────────────────────────────────────────────

function DealerForm({ onSubmit, loading }: { onSubmit: (d: Partial<VerificationSubmission>) => void; loading: boolean }) {
  const [dealershipName, setDealershipName] = useState('');
  const [regNumber,      setRegNumber]      = useState('');
  const [address,        setAddress]        = useState('');
  const [city,           setCity]           = useState('');
  const [province,       setProvince]       = useState('');
  const [authorisedRep,  setAuthorisedRep]  = useState('');
  const [vehicleTypes,   setVehicleTypes]   = useState<string[]>([]);
  const [docs,           setDocs]           = useState<Record<string, string>>({});

  const VEHICLE_TYPES = ['Sedans', 'SUVs', 'Bakkies', 'Trucks', 'Motorcycles', 'Commercial'];
  const toggleType = (t: string) =>
    setVehicleTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const handleDoc = (name: string, filename: string) =>
    setDocs(prev => ({ ...prev, [name]: filename }));

  const canSubmit = dealershipName && regNumber && address && authorisedRep;

  return (
    <form onSubmit={e => {
      e.preventDefault();
      onSubmit({
        dealershipName, companyRegNumber: regNumber, businessAddress: address,
        city, province, authorisedRep, vehicleTypesSold: vehicleTypes,
        documentsSubmitted: Object.values(docs).filter(Boolean),
      });
    }} className="space-y-5">
      <div>
        <label className="block text-xs font-black text-gray-700 mb-1.5">Dealership name <span className="text-red-500">*</span></label>
        <input value={dealershipName} onChange={e => setDealershipName(e.target.value)} required placeholder="e.g. Apex Motors"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0866ff] bg-white" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-black text-gray-700 mb-1.5">Company registration number <span className="text-red-500">*</span></label>
          <input value={regNumber} onChange={e => setRegNumber(e.target.value)} required placeholder="e.g. 2023/123456/07"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0866ff] bg-white" />
        </div>
        <div>
          <label className="block text-xs font-black text-gray-700 mb-1.5">Authorised representative <span className="text-red-500">*</span></label>
          <input value={authorisedRep} onChange={e => setAuthorisedRep(e.target.value)} required placeholder="Full name"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0866ff] bg-white" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-black text-gray-700 mb-1.5">Business address <span className="text-red-500">*</span></label>
        <textarea value={address} onChange={e => setAddress(e.target.value)} required rows={2} placeholder="Street, suburb, city"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0866ff] bg-white resize-none" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-black text-gray-700 mb-1.5">City</label>
          <input value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Pretoria"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0866ff] bg-white" />
        </div>
        <div>
          <label className="block text-xs font-black text-gray-700 mb-1.5">Province</label>
          <select value={province} onChange={e => setProvince(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0866ff] bg-white">
            <option value="">Select province</option>
            {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-black text-gray-700 mb-2">Vehicle types sold</label>
        <div className="flex flex-wrap gap-2">
          {VEHICLE_TYPES.map(t => (
            <button key={t} type="button" onClick={() => toggleType(t)}
              className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${
                vehicleTypes.includes(t)
                  ? 'bg-[#0866ff] text-white border-[#0866ff]'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-[#0866ff]'
              }`}>{t}</button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-xs font-black text-gray-700">Verification documents</p>
        <DocUpload label="Business Registration (CIPC)" desc="CIPC certificate or CK document." required name="biz" onSelect={handleDoc} />
        <DocUpload label="Director ID" desc="SA ID of the responsible director." required name="id" onSelect={handleDoc} />
        <DocUpload label="Dealership / Premises Proof" desc="Photograph or lease of dealership premises." required={false} name="premises" onSelect={handleDoc} />
        <DocUpload label="VAT Registration" desc="SARS VAT registration certificate (if applicable)." required={false} name="vat" onSelect={handleDoc} />
      </div>
      <button type="submit" disabled={!canSubmit || loading}
        className="w-full py-3 rounded-xl text-sm font-black text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
        style={{ background: '#0866ff' }}>
        {loading ? 'Submitting…' : 'Submit Dealership Verification'}
      </button>
    </form>
  );
}

// ─── Parts Vendor form ────────────────────────────────────────────────────────

function VendorForm({ onSubmit, loading }: { onSubmit: (d: Partial<VerificationSubmission>) => void; loading: boolean }) {
  const [vendorName,   setVendorName]   = useState('');
  const [supplierType, setSupplierType] = useState('');
  const [categories,   setCategories]   = useState('');
  const [makes,        setMakes]        = useState('');
  const [delivery,     setDelivery]     = useState('');
  const [warranty,     setWarranty]     = useState('');
  const [city,         setCity]         = useState('');
  const [province,     setProvince]     = useState('');
  const [docs,         setDocs]         = useState<Record<string, string>>({});

  const handleDoc = (name: string, filename: string) =>
    setDocs(prev => ({ ...prev, [name]: filename }));

  const canSubmit = vendorName && supplierType;

  return (
    <form onSubmit={e => {
      e.preventDefault();
      onSubmit({
        vendorName, supplierType,
        categoriesSupplied: categories.split(',').map(c => c.trim()).filter(Boolean),
        vehicleMakesSupported: makes.split(',').map(m => m.trim()).filter(Boolean),
        deliveryAreas: delivery,
        warrantyPolicy: warranty,
        city, province,
        documentsSubmitted: Object.values(docs).filter(Boolean),
      });
    }} className="space-y-5">
      <div>
        <label className="block text-xs font-black text-gray-700 mb-1.5">Business / vendor name <span className="text-red-500">*</span></label>
        <input value={vendorName} onChange={e => setVendorName(e.target.value)} required placeholder="e.g. SA Spares Direct"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0866ff] bg-white" />
      </div>
      <div>
        <label className="block text-xs font-black text-gray-700 mb-1.5">Supplier type <span className="text-red-500">*</span></label>
        <select value={supplierType} onChange={e => setSupplierType(e.target.value)} required
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0866ff] bg-white">
          <option value="">Select supplier type</option>
          <option value="new_parts">New parts</option>
          <option value="used_parts">Used / second-hand parts</option>
          <option value="oem">OEM parts</option>
          <option value="aftermarket">Aftermarket parts</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-black text-gray-700 mb-1.5">Categories supplied <span className="text-xs font-normal text-gray-400">(comma-separated)</span></label>
        <input value={categories} onChange={e => setCategories(e.target.value)} placeholder="e.g. Engine, Brakes, Suspension"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0866ff] bg-white" />
      </div>
      <div>
        <label className="block text-xs font-black text-gray-700 mb-1.5">Vehicle makes supported <span className="text-xs font-normal text-gray-400">(comma-separated)</span></label>
        <input value={makes} onChange={e => setMakes(e.target.value)} placeholder="e.g. Toyota, VW, BMW"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0866ff] bg-white" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-black text-gray-700 mb-1.5">Delivery areas</label>
          <input value={delivery} onChange={e => setDelivery(e.target.value)} placeholder="e.g. Nationwide, Gauteng only"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0866ff] bg-white" />
        </div>
        <div>
          <label className="block text-xs font-black text-gray-700 mb-1.5">Return / warranty policy</label>
          <input value={warranty} onChange={e => setWarranty(e.target.value)} placeholder="e.g. 30-day return, 6-month warranty"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0866ff] bg-white" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-black text-gray-700 mb-1.5">City</label>
          <input value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Durban"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0866ff] bg-white" />
        </div>
        <div>
          <label className="block text-xs font-black text-gray-700 mb-1.5">Province</label>
          <select value={province} onChange={e => setProvince(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0866ff] bg-white">
            <option value="">Select province</option>
            {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-xs font-black text-gray-700">Verification documents</p>
        <DocUpload label="Business / Trading Proof" desc="CIPC certificate, business registration or trading licence." required name="biz" onSelect={handleDoc} />
        <DocUpload label="Owner ID" desc="SA ID or passport of the business owner." required={false} name="id" onSelect={handleDoc} />
      </div>
      <button type="submit" disabled={!canSubmit || loading}
        className="w-full py-3 rounded-xl text-sm font-black text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
        style={{ background: '#0866ff' }}>
        {loading ? 'Submitting…' : 'Submit Supplier Verification'}
      </button>
    </form>
  );
}

// ─── Workshop form ────────────────────────────────────────────────────────────

function WorkshopForm({ onSubmit, loading }: { onSubmit: (d: Partial<VerificationSubmission>) => void; loading: boolean }) {
  const [tradingName,   setTradingName]   = useState('');
  const [city,          setCity]          = useState('');
  const [province,      setProvince]      = useState('');
  const [rmiRegistered, setRmiRegistered] = useState<boolean | undefined>(undefined);
  const [workshopType,  setWorkshopType]  = useState('');
  const [services,      setServices]      = useState<string[]>([]);
  const [hours,         setHours]         = useState('');
  const [serviceArea,   setServiceArea]   = useState('');
  const [emergency,     setEmergency]     = useState(false);
  const [docs,          setDocs]          = useState<Record<string, string>>({});

  const SERVICES = ['Mechanical repairs', 'Electrical', 'Panel beating', 'Spray painting', 'Tyres & fitment', 'Wheel alignment', 'Air conditioning', 'Diagnostics', 'Servicing', 'Roadworthy testing'];
  const toggleService = (s: string) =>
    setServices(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handleDoc = (name: string, filename: string) =>
    setDocs(prev => ({ ...prev, [name]: filename }));

  const canSubmit = tradingName && workshopType;

  return (
    <form onSubmit={e => {
      e.preventDefault();
      onSubmit({
        tradingName, city, province, rmiRegistered,
        workshopType, servicesOffered: services,
        operatingHours: hours, serviceArea,
        emergencyAvailable: emergency,
        documentsSubmitted: Object.values(docs).filter(Boolean),
      });
    }} className="space-y-5">
      <div>
        <label className="block text-xs font-black text-gray-700 mb-1.5">Business / trading name <span className="text-red-500">*</span></label>
        <input value={tradingName} onChange={e => setTradingName(e.target.value)} required placeholder="e.g. Fast Fix Auto"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0866ff] bg-white" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-black text-gray-700 mb-1.5">City</label>
          <input value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Johannesburg"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0866ff] bg-white" />
        </div>
        <div>
          <label className="block text-xs font-black text-gray-700 mb-1.5">Province</label>
          <select value={province} onChange={e => setProvince(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0866ff] bg-white">
            <option value="">Select province</option>
            {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-black text-gray-700 mb-2">RMI registered?</label>
        <div className="flex gap-3">
          {[{ val: true, label: 'Yes — RMI member' }, { val: false, label: 'No — independent' }].map(opt => (
            <button key={String(opt.val)} type="button" onClick={() => setRmiRegistered(opt.val)}
              className={`text-xs font-bold px-4 py-2 rounded-lg border transition-colors ${
                rmiRegistered === opt.val
                  ? 'bg-[#0866ff] text-white border-[#0866ff]'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-[#0866ff]'
              }`}>{opt.label}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-black text-gray-700 mb-1.5">Workshop type <span className="text-red-500">*</span></label>
        <select value={workshopType} onChange={e => setWorkshopType(e.target.value)} required
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0866ff] bg-white">
          <option value="">Select workshop type</option>
          <option value="rmi_workshop">RMI registered workshop</option>
          <option value="independent_mechanic">Independent mechanic</option>
          <option value="mobile_mechanic">Mobile mechanic</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-black text-gray-700 mb-2">Services offered</label>
        <div className="flex flex-wrap gap-2">
          {SERVICES.map(s => (
            <button key={s} type="button" onClick={() => toggleService(s)}
              className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${
                services.includes(s)
                  ? 'bg-[#0866ff] text-white border-[#0866ff]'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-[#0866ff]'
              }`}>{s}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-black text-gray-700 mb-1.5">Operating hours</label>
          <input value={hours} onChange={e => setHours(e.target.value)} placeholder="e.g. Mon–Fri 7:30–17:00"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0866ff] bg-white" />
        </div>
        <div>
          <label className="block text-xs font-black text-gray-700 mb-1.5">Service area</label>
          <input value={serviceArea} onChange={e => setServiceArea(e.target.value)} placeholder="e.g. Sandton, Midrand"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0866ff] bg-white" />
        </div>
      </div>
      <label className="flex items-start gap-2.5 cursor-pointer">
        <input type="checkbox" checked={emergency} onChange={e => setEmergency(e.target.checked)} className="mt-0.5 accent-[#0866ff]" />
        <span className="text-xs text-gray-600">Available for emergency / roadside assistance</span>
      </label>
      <div className="space-y-3">
        <p className="text-xs font-black text-gray-700">Verification documents</p>
        <DocUpload label="RMI Certificate / Business Proof" desc="Current RMI membership certificate or business registration." required name="cert" onSelect={handleDoc} />
        <DocUpload label="Trade Licence" desc="Current municipal trade licence." required={false} name="trade" onSelect={handleDoc} />
        <DocUpload label="Qualification / Certification Proof" desc="Relevant trade qualification or certification (optional)." required={false} name="qual" onSelect={handleDoc} />
      </div>
      <button type="submit" disabled={!canSubmit || loading}
        className="w-full py-3 rounded-xl text-sm font-black text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
        style={{ background: '#0866ff' }}>
        {loading ? 'Submitting…' : 'Submit Workshop Verification'}
      </button>
    </form>
  );
}

// ─── Main verification page ───────────────────────────────────────────────────

const PAGE_CONFIG: Record<string, { title: string; subtitle: string; benefits: string[] }> = {
  buyer: {
    title:    'Complete Your Profile',
    subtitle: 'Add your location and interests to get personalised recommendations.',
    benefits: ['Personalised vehicle and parts recommendations', 'Faster inquiry management', 'Saved listings and comparison tools'],
  },
  private_seller: {
    title:    'Seller Verification',
    subtitle: 'Verify your identity to list vehicles and parts on MotorSphere.',
    benefits: ['Verified badge on your profile and listings', 'Buyer trust — verified sellers receive more inquiries', 'Higher listing limits on paid plans'],
  },
  dealer: {
    title:    'Dealership Verification',
    subtitle: 'Verify your business to manage dealership stock and buyer leads.',
    benefits: ['Verified dealer badge and dealership profile page', 'Stock management and lead tracking', 'Priority placement on dealer plans'],
  },
  parts_vendor: {
    title:    'Supplier Verification',
    subtitle: 'Verify your supplier account to list parts and receive buyer inquiries.',
    benefits: ['Verified supplier badge', 'Parts listings with compatibility search', 'Buyer inquiry management'],
  },
  workshop: {
    title:    'Workshop Verification',
    subtitle: 'Verify your workshop to appear in the MotorSphere directory.',
    benefits: ['Workshop directory listing', 'Booking request management', 'RMI badge (if registered)'],
  },
};

export default function VerificationPage() {
  const { user, profile } = useAuth();
  const router = useRouter();

  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  if (!user || !profile) return null;

  const accountType = profile.accountType ?? 'buyer';
  const vs          = profile.verificationStatus ?? 'not_started';

  // Already submitted / under review / approved — show status
  if (!submitted && (vs === 'submitted' || vs === 'pending_review' || vs === 'approved')) {
    return <SubmittedState status={vs} />;
  }

  // Already completed as buyer (not_required)
  if (!submitted && profile.onboardingComplete && vs === 'not_required') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-black text-gray-900">Profile Complete</h1>
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">✅</div>
          <p className="text-base font-black text-green-800">Your profile is complete</p>
          <p className="text-sm text-green-700 mt-2">
            You can now save listings, manage inquiries and contact sellers across MotorSphere.
          </p>
        </div>
      </div>
    );
  }

  // Success state (just submitted this session)
  if (submitted) {
    const isBuyer = accountType === 'buyer';
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">🎉</div>
          <p className="text-base font-black text-green-800">
            {isBuyer ? 'Profile complete!' : 'Verification submitted!'}
          </p>
          <p className="text-sm text-green-700 mt-2">
            {isBuyer
              ? 'Your profile is now complete. Explore the marketplace.'
              : 'Our team will review your application within 1–2 business days. You will receive an email notification.'}
          </p>
        </div>
        <button
          onClick={() => router.push(getRoleDashboardPath(accountType))}
          className="w-full py-3 rounded-xl text-sm font-black text-white hover:opacity-90 transition-opacity"
          style={{ background: '#0866ff' }}
        >
          Go to my dashboard →
        </button>
      </div>
    );
  }

  const config = PAGE_CONFIG[accountType] ?? PAGE_CONFIG.buyer;

  const handleSubmit = async (data: Partial<VerificationSubmission>) => {
    setLoading(true);
    setError(null);
    try {
      await submitVerification(user.uid, {
        accountType,
        ...data,
      } as VerificationSubmission);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      <div>
        <h1 className="text-2xl font-black text-gray-900">{config.title}</h1>
        <p className="text-sm text-gray-500 mt-1">{config.subtitle}</p>
      </div>

      {/* Benefits */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-xs font-black text-blue-700 mb-2">
          {accountType === 'buyer' ? 'Profile benefits' : 'Verification benefits'}
        </p>
        <ul className="text-xs text-blue-600 space-y-1">
          {config.benefits.map(b => <li key={b}>✓ {b}</li>)}
        </ul>
      </div>

      {/* POPIA notice */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-500">
        🔒 Information is collected and processed for seller verification and marketplace safety in accordance with POPIA (Act 4 of 2013). Documents are accessed only by authorised MotorSphere administrators.
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <p className="text-xs text-red-700 font-bold">{error}</p>
        </div>
      )}

      {/* Role-specific form */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        {accountType === 'buyer'          && <BuyerForm    onSubmit={handleSubmit} loading={loading} />}
        {accountType === 'private_seller' && <SellerForm   onSubmit={handleSubmit} loading={loading} />}
        {accountType === 'dealer'         && <DealerForm   onSubmit={handleSubmit} loading={loading} />}
        {accountType === 'parts_vendor'   && <VendorForm   onSubmit={handleSubmit} loading={loading} />}
        {accountType === 'workshop'       && <WorkshopForm onSubmit={handleSubmit} loading={loading} />}
      </div>

    </div>
  );
}
