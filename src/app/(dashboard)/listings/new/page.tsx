'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { canSubmitListing } from '@/lib/permissions';
import { createListing, type CreateListingInput } from '@/lib/firebase/listings';
import { PROVINCES } from '@/types/firestore.types';
import type { AccountType, ContactPref, PartCondition, Province, VehicleCondition } from '@/types/firestore.types';

// ─── Constants ────────────────────────────────────────────────────────────────

const VEHICLE_MAKES = [
  'Audi', 'BMW', 'Chery', 'Chevrolet', 'Citroën', 'Ford', 'GWM', 'Haval',
  'Honda', 'Hyundai', 'Isuzu', 'Jeep', 'Kia', 'Land Rover', 'Mahindra',
  'Mazda', 'Mercedes-Benz', 'Mitsubishi', 'Nissan', 'Opel', 'Peugeot',
  'Renault', 'Suzuki', 'Toyota', 'Volkswagen', 'Volvo', 'Other',
];

const VEHICLE_TYPES = ['Car', 'Bakkie', 'SUV', 'Truck', 'Van', 'Bus', 'Motorcycle'];

const VEHICLE_TYPE_TO_CATEGORY: Record<string, string> = {
  Car:        'vehicles',
  Bakkie:     'bakkies',
  SUV:        'vehicles',
  Truck:      'trucks',
  Van:        'vans',
  Bus:        'buses',
  Motorcycle: 'motorcycles',
};

const PART_CATEGORIES = [
  'Engine & Drivetrain', 'Brakes', 'Suspension & Steering',
  'Electrical & Lighting', 'Body & Exterior', 'Interior',
  'Tyres & Wheels', 'Exhaust', 'Accessories', 'Other',
];

const SERVICE_TYPES = [
  'Full Vehicle Service', 'Panel Beating & Spray',
  'Tyre & Fitment', 'Suspension & Alignment',
  'Auto Electrical', 'Diagnostics & Scanning',
  'Air Conditioning', 'Transmission Service', 'Other',
];

// ─── Role config ──────────────────────────────────────────────────────────────

type ListingRole = 'seller' | 'dealer' | 'vendor' | 'workshop';

const ACCOUNT_TO_ROLE: Record<string, ListingRole> = {
  private_seller: 'seller',
  dealer:         'dealer',
  parts_vendor:   'vendor',
  workshop:       'workshop',
};

const ROLE_CONFIG: Record<ListingRole, {
  listingType: 'vehicle' | 'part' | 'service';
  heading:     string;
  subheading:  string;
  titleLabel:  string;
  titleHint:   string;
  descHint:    string;
  pricLabel:   string;
}> = {
  seller: {
    listingType: 'vehicle',
    heading:     'Create Listing',
    subheading:  'List a vehicle or spare part for sale. Your listing will be reviewed before going live.',
    titleLabel:  'Listing title',
    titleHint:   'e.g. 2021 Toyota Hilux 2.8 GD-6 Double Cab',
    descHint:    'Describe the vehicle — condition, extras, service history, any known faults.',
    pricLabel:   'Asking price (ZAR)',
  },
  dealer: {
    listingType: 'vehicle',
    heading:     'Add Stock',
    subheading:  'Add a vehicle to your dealership stock. Stock is reviewed before appearing in the marketplace.',
    titleLabel:  'Stock listing title',
    titleHint:   'e.g. 2023 Ford Ranger 2.0 BiTurbo Wildtrak',
    descHint:    'Describe the vehicle — specifications, extras, service plan, condition.',
    pricLabel:   'Retail price (ZAR)',
  },
  vendor: {
    listingType: 'part',
    heading:     'List a Part',
    subheading:  'Add a spare part or accessory to your inventory. Parts are reviewed before appearing in the marketplace.',
    titleLabel:  'Part listing title',
    titleHint:   'e.g. Toyota Hilux N70 Front Shock Absorbers (pair)',
    descHint:    'Describe the part — application, condition, brand, part number if known.',
    pricLabel:   'Selling price (ZAR)',
  },
  workshop: {
    listingType: 'service',
    heading:     'Add Service',
    subheading:  'Add a service offering to your workshop profile. Services are reviewed before appearing in the directory.',
    titleLabel:  'Service name',
    titleHint:   'e.g. Full Vehicle Service & Oil Change',
    descHint:    'Describe your service — what is included, typical turnaround, specialisations.',
    pricLabel:   'Starting price (ZAR)',
  },
};

// ─── Form data type ───────────────────────────────────────────────────────────

type FormData = {
  title:             string;
  description:       string;
  priceZAR:          string;
  negotiable:        boolean;
  province:          string;
  city:              string;
  contactPreference: ContactPref;
  // Vehicle
  vehicleType:       string;
  make:              string;
  model:             string;
  year:              string;
  mileage:           string;
  fuelType:          string;
  transmission:      string;
  condition:         VehicleCondition;
  colour:            string;
  serviceHistory:    boolean;
  ownershipDeclaration: boolean;
  // Part
  partCategory:      string;
  oemOrAftermarket:  'oem' | 'aftermarket';
  compatibleMakes:   string;
  compatibleModels:  string;
  quantityAvailable: string;
  partCondition:     PartCondition;
  warrantyPolicy:    string;
  deliveryAvailable: boolean;
  // Service
  serviceType:       string;
  serviceArea:       string;
  operatingHours:    string;
  emergencyAvailable: boolean;
};

const DEFAULT_FORM: FormData = {
  title: '', description: '', priceZAR: '', negotiable: false,
  province: '', city: '', contactPreference: 'platform_only',
  vehicleType: 'Car', make: '', model: '', year: '', mileage: '',
  fuelType: 'petrol', transmission: 'manual', condition: 'good',
  colour: '', serviceHistory: false, ownershipDeclaration: false,
  partCategory: '', oemOrAftermarket: 'aftermarket',
  compatibleMakes: '', compatibleModels: '',
  quantityAvailable: '1', partCondition: 'used',
  warrantyPolicy: '', deliveryAvailable: false,
  serviceType: '', serviceArea: '', operatingHours: '', emergencyAvailable: false,
};

// ─── Shared sub-components ────────────────────────────────────────────────────

const INP = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#0866ff] transition-colors bg-white';
const LBL = 'block text-xs font-black text-gray-700 mb-1';

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest pb-1">
      {children}
    </h3>
  );
}

function Field({ label, required, children }: {
  label: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <label className={LBL}>{label}{required && ' *'}</label>
      {children}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

function CheckField({ label, hint, checked, onChange }: {
  label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="mt-0.5 accent-[#0866ff] w-4 h-4 shrink-0"
      />
      <span>
        <span className="text-sm font-bold text-gray-700 block leading-snug">{label}</span>
        {hint && <span className="text-xs text-gray-400 block mt-0.5">{hint}</span>}
      </span>
    </label>
  );
}

// ─── Role-specific sections ───────────────────────────────────────────────────

function VehicleSection({
  form, update, isDealer,
}: {
  form: FormData;
  update: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
  isDealer: boolean;
}) {
  return (
    <div className="space-y-4">
      <SectionHeader>Vehicle details</SectionHeader>

      <Row>
        <Field label="Vehicle type" required>
          <select value={form.vehicleType} onChange={e => update('vehicleType', e.target.value)} className={INP}>
            {VEHICLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Condition" required>
          <select value={form.condition} onChange={e => update('condition', e.target.value as VehicleCondition)} className={INP}>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="salvage">Salvage / damaged</option>
          </select>
        </Field>
      </Row>

      <Row>
        <Field label="Make" required>
          <select value={form.make} onChange={e => update('make', e.target.value)} className={INP}>
            <option value="">Select make…</option>
            {VEHICLE_MAKES.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="Model" required>
          <input
            type="text"
            value={form.model}
            onChange={e => update('model', e.target.value)}
            placeholder="e.g. Hilux 2.8 GD-6"
            className={INP}
          />
        </Field>
      </Row>

      <Row>
        <Field label="Year" required>
          <input
            type="number"
            min="1960"
            max={new Date().getFullYear() + 1}
            value={form.year}
            onChange={e => update('year', e.target.value)}
            placeholder="e.g. 2021"
            className={INP}
          />
        </Field>
        <Field label="Mileage (km)">
          <input
            type="number"
            min="0"
            value={form.mileage}
            onChange={e => update('mileage', e.target.value)}
            placeholder="e.g. 85 000"
            className={INP}
          />
        </Field>
      </Row>

      <Row>
        <Field label="Fuel type" required>
          <select value={form.fuelType} onChange={e => update('fuelType', e.target.value)} className={INP}>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="hybrid">Hybrid</option>
            <option value="electric">Electric</option>
            <option value="lpg">LPG</option>
          </select>
        </Field>
        <Field label="Transmission" required>
          <select value={form.transmission} onChange={e => update('transmission', e.target.value)} className={INP}>
            <option value="manual">Manual</option>
            <option value="automatic">Automatic</option>
            <option value="semi-automatic">Semi-automatic</option>
          </select>
        </Field>
      </Row>

      <Field label="Colour">
        <input
          type="text"
          value={form.colour}
          onChange={e => update('colour', e.target.value)}
          placeholder="e.g. Glacier White"
          className={INP}
        />
      </Field>

      <div className="space-y-3 pt-1">
        <CheckField
          label="Full service history available"
          hint="Stamped service book or digital records can be shown to serious buyers."
          checked={form.serviceHistory}
          onChange={v => update('serviceHistory', v)}
        />
        {isDealer && (
          <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2.5 border border-gray-100">
            🏢 This listing will display under your dealership name.
          </p>
        )}
      </div>
    </div>
  );
}

function PartSection({
  form, update,
}: {
  form: FormData;
  update: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
}) {
  return (
    <div className="space-y-4">
      <SectionHeader>Part details</SectionHeader>

      <Row>
        <Field label="Part category" required>
          <select value={form.partCategory} onChange={e => update('partCategory', e.target.value)} className={INP}>
            <option value="">Select category…</option>
            {PART_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Condition" required>
          <select value={form.partCondition} onChange={e => update('partCondition', e.target.value as PartCondition)} className={INP}>
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="refurbished">Refurbished</option>
          </select>
        </Field>
      </Row>

      <Row>
        <Field label="OEM or aftermarket">
          <select value={form.oemOrAftermarket} onChange={e => update('oemOrAftermarket', e.target.value as 'oem' | 'aftermarket')} className={INP}>
            <option value="oem">OEM (Original Equipment)</option>
            <option value="aftermarket">Aftermarket</option>
          </select>
        </Field>
        <Field label="Quantity available" required>
          <input
            type="number"
            min="1"
            value={form.quantityAvailable}
            onChange={e => update('quantityAvailable', e.target.value)}
            className={INP}
          />
        </Field>
      </Row>

      <Field label="Compatible vehicle makes (comma-separated)">
        <input
          type="text"
          value={form.compatibleMakes}
          onChange={e => update('compatibleMakes', e.target.value)}
          placeholder="e.g. Toyota, Ford, Nissan"
          className={INP}
        />
      </Field>

      <Field label="Compatible models (comma-separated)">
        <input
          type="text"
          value={form.compatibleModels}
          onChange={e => update('compatibleModels', e.target.value)}
          placeholder="e.g. Hilux 2.4, Ranger 2.2, Navara 2.5"
          className={INP}
        />
      </Field>

      <Row>
        <Field label="Warranty policy">
          <input
            type="text"
            value={form.warrantyPolicy}
            onChange={e => update('warrantyPolicy', e.target.value)}
            placeholder="e.g. 6-month supplier warranty"
            className={INP}
          />
        </Field>
        <div className="flex items-end pb-0.5">
          <CheckField
            label="Delivery available"
            hint="You can arrange delivery to the buyer."
            checked={form.deliveryAvailable}
            onChange={v => update('deliveryAvailable', v)}
          />
        </div>
      </Row>
    </div>
  );
}

function ServiceSection({
  form, update, rmiRegistered,
}: {
  form: FormData;
  update: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
  rmiRegistered?: boolean;
}) {
  return (
    <div className="space-y-4">
      <SectionHeader>Service details</SectionHeader>

      <Field label="Service type" required>
        <select value={form.serviceType} onChange={e => update('serviceType', e.target.value)} className={INP}>
          <option value="">Select service type…</option>
          {SERVICE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </Field>

      {rmiRegistered !== undefined && (
        <div className="text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5">
          Workshop RMI status:{' '}
          <strong className={rmiRegistered ? 'text-green-700' : 'text-gray-600'}>
            {rmiRegistered ? '✓ RMI Registered' : 'Non-RMI Workshop'}
          </strong>
          <span className="text-gray-400 ml-1">· Sourced from your workshop profile</span>
        </div>
      )}

      <Field label="Service area">
        <input
          type="text"
          value={form.serviceArea}
          onChange={e => update('serviceArea', e.target.value)}
          placeholder="e.g. Pretoria & surrounding areas"
          className={INP}
        />
      </Field>

      <Field label="Operating hours">
        <input
          type="text"
          value={form.operatingHours}
          onChange={e => update('operatingHours', e.target.value)}
          placeholder="e.g. Mon–Fri 08:00–17:00 · Sat 08:00–13:00"
          className={INP}
        />
      </Field>

      <CheckField
        label="Emergency / after-hours available"
        hint="You can be contacted and may assist outside normal business hours."
        checked={form.emergencyAvailable}
        onChange={v => update('emergencyAvailable', v)}
      />
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

type Step = 'form' | 'success';

export default function NewListingPage() {
  const { user, profile } = useAuth();
  const router            = useRouter();

  const [step,     setStep]    = useState<Step>('form');
  const [saving,   setSaving]  = useState(false);
  const [error,    setError]   = useState<string | null>(null);
  const [wasDraft, setWasDraft] = useState(false);
  const [savedTitle, setSavedTitle] = useState('');

  const [form, setForm] = useState<FormData>(DEFAULT_FORM);
  const update = <K extends keyof FormData>(k: K, v: FormData[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  if (!user) return null;

  const accountType = (profile?.accountType ?? 'private_seller') as AccountType;
  const roleKey     = ACCOUNT_TO_ROLE[accountType] ?? 'seller';
  const config      = ROLE_CONFIG[roleKey];
  const canSubmit   = canSubmitListing(profile);
  const isDealer    = roleKey === 'dealer';

  // ── Submit handler ──────────────────────────────────────────────────────────

  async function handleSave(asDraft: boolean) {
    if (!user || !profile) return;
    setError(null);
    setSaving(true);

    try {
      // Validate price
      const priceRand = parseFloat(form.priceZAR.replace(/[^0-9.]/g, ''));
      if (!priceRand || priceRand <= 0) {
        setError('Please enter a valid price.');
        setSaving(false);
        return;
      }
      // Store as ZAR cents (integer)
      const priceCents = Math.round(priceRand * 100);

      // Validate required common fields
      if (!form.title.trim()) { setError('Please enter a listing title.'); setSaving(false); return; }
      if (!form.description.trim()) { setError('Please enter a description.'); setSaving(false); return; }
      if (!form.province) { setError('Please select a province.'); setSaving(false); return; }
      if (!form.city.trim()) { setError('Please enter a city.'); setSaving(false); return; }

      const province = form.province as Province;

      // Build listing input
      const input: CreateListingInput = {
        listingType:       config.listingType,
        category:          config.listingType === 'vehicle'
                             ? (VEHICLE_TYPE_TO_CATEGORY[form.vehicleType] ?? 'vehicles')
                             : config.listingType === 'part'
                             ? 'parts'
                             : 'services',
        title:             form.title.trim(),
        description:       form.description.trim(),
        price:             priceCents,
        negotiable:        form.negotiable,
        province,
        city:              form.city.trim(),
        contactPreference: form.contactPreference,
        imagePlaceholders: [],

        // Vehicle fields
        ...(config.listingType === 'vehicle' && {
          vehicleType:          form.vehicleType as 'Car',
          make:                 form.make,
          model:                form.model.trim(),
          year:                 parseInt(form.year, 10) || new Date().getFullYear(),
          mileage:              form.mileage ? parseInt(form.mileage, 10) : null,
          fuelType:             form.fuelType,
          transmission:         form.transmission,
          condition:            form.condition,
          colour:               form.colour.trim() || null,
          serviceHistory:       form.serviceHistory,
          ownershipDeclaration: form.ownershipDeclaration,
        }),

        // Part fields
        ...(config.listingType === 'part' && {
          partName:          form.title.trim(),
          partCategory:      form.partCategory,
          oemOrAftermarket:  form.oemOrAftermarket,
          compatibleMakes:   form.compatibleMakes.split(',').map(s => s.trim()).filter(Boolean),
          compatibleModels:  form.compatibleModels.split(',').map(s => s.trim()).filter(Boolean),
          quantityAvailable: parseInt(form.quantityAvailable, 10) || 1,
          partCondition:     form.partCondition,
          warrantyPolicy:    form.warrantyPolicy.trim(),
          deliveryAvailable: form.deliveryAvailable,
        }),

        // Service fields
        ...(config.listingType === 'service' && {
          serviceType:        form.serviceType,
          rmiStatus:          profile?.rmiRegistered ?? false,
          serviceArea:        form.serviceArea.trim(),
          operatingHours:     form.operatingHours.trim(),
          emergencyAvailable: form.emergencyAvailable,
        }),
      };

      await createListing(
        user.uid,
        profile?.displayName ?? user.email ?? '',
        accountType,
        input,
        asDraft,
      );

      setSavedTitle(form.title.trim());
      setWasDraft(asDraft);
      setStep('success');
    } catch (err) {
      console.error('[listings/new] error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  // ── Success state ────────────────────────────────────────────────────────────

  if (step === 'success') {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"
            style={{ background: wasDraft ? '#f1f5f9' : '#dcfce7' }}
          >
            {wasDraft ? '📋' : '✅'}
          </div>

          <h1 className="text-xl font-black text-gray-900">
            {wasDraft ? 'Draft saved' : 'Submitted for review'}
          </h1>

          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            {wasDraft ? (
              <>
                <strong className="text-gray-700">&ldquo;{savedTitle}&rdquo;</strong> has been saved
                as a draft. Complete it and submit when ready.
              </>
            ) : (
              <>
                <strong className="text-gray-700">&ldquo;{savedTitle}&rdquo;</strong> has been
                submitted for MotorSphere review. Most listings are reviewed within 1 business day.
              </>
            )}
          </p>

          {!wasDraft && (
            <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100 text-left">
              <p className="text-xs font-black text-amber-700 mb-1.5">What happens next?</p>
              <ol className="text-xs text-amber-700 space-y-1 list-decimal list-inside">
                <li>MotorSphere reviews your listing for accuracy and completeness</li>
                <li>Once approved, it goes live in the marketplace</li>
                <li>Buyers can view and contact you directly through the platform</li>
              </ol>
            </div>
          )}

          <div className="flex gap-3 mt-6 justify-center flex-wrap">
            <button
              onClick={() => router.push('/dashboard/listings')}
              className="px-5 py-2.5 rounded-lg text-sm font-black text-white hover:opacity-90 transition-opacity"
              style={{ background: '#0866ff' }}
            >
              View my listings
            </button>
            <button
              onClick={() => { setStep('form'); setForm(DEFAULT_FORM); setError(null); }}
              className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Add another
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      <div>
        <h1 className="text-2xl font-black text-gray-900">{config.heading}</h1>
        <p className="text-sm text-gray-500 mt-1">{config.subheading}</p>
      </div>

      {/* Verification warning */}
      {!canSubmit && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm font-black text-amber-800">Verification required to submit</p>
          <p className="text-xs text-amber-700 mt-1">
            Complete your account verification before submitting listings for review.
            You can save a draft now and submit once your account is verified.
          </p>
        </div>
      )}

      <form
        onSubmit={e => { e.preventDefault(); handleSave(false); }}
        className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6"
      >

        {/* ── Listing details (common) ── */}
        <div className="space-y-4">
          <SectionHeader>Listing details</SectionHeader>

          <Field label={config.titleLabel} required>
            <input
              type="text"
              required
              value={form.title}
              onChange={e => update('title', e.target.value)}
              placeholder={config.titleHint}
              className={INP}
            />
          </Field>

          <Field label="Description" required>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={e => update('description', e.target.value)}
              placeholder={config.descHint}
              className={`${INP} resize-none`}
            />
          </Field>
        </div>

        <hr className="border-gray-100" />

        {/* ── Role-specific section ── */}
        {config.listingType === 'vehicle' && (
          <VehicleSection form={form} update={update} isDealer={isDealer} />
        )}
        {config.listingType === 'part' && (
          <PartSection form={form} update={update} />
        )}
        {config.listingType === 'service' && (
          <ServiceSection form={form} update={update} rmiRegistered={profile?.rmiRegistered} />
        )}

        <hr className="border-gray-100" />

        {/* ── Pricing ── */}
        <div className="space-y-4">
          <SectionHeader>Pricing</SectionHeader>
          <Row>
            <Field label={config.pricLabel} required>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400 pointer-events-none">
                  R
                </span>
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  value={form.priceZAR}
                  onChange={e => update('priceZAR', e.target.value)}
                  placeholder="e.g. 429900"
                  className={`${INP} pl-7`}
                />
              </div>
            </Field>
            <div className="flex items-end pb-1">
              <CheckField
                label="Open to negotiation"
                checked={form.negotiable}
                onChange={v => update('negotiable', v)}
              />
            </div>
          </Row>
        </div>

        <hr className="border-gray-100" />

        {/* ── Location ── */}
        <div className="space-y-4">
          <SectionHeader>Location</SectionHeader>
          <Row>
            <Field label="Province" required>
              <select
                required
                value={form.province}
                onChange={e => update('province', e.target.value)}
                className={INP}
              >
                <option value="">Select province…</option>
                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="City / Town" required>
              <input
                required
                type="text"
                value={form.city}
                onChange={e => update('city', e.target.value)}
                placeholder="e.g. Johannesburg"
                className={INP}
              />
            </Field>
          </Row>
        </div>

        <hr className="border-gray-100" />

        {/* ── Contact method ── */}
        <div className="space-y-3">
          <SectionHeader>Contact method</SectionHeader>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {([
              { value: 'platform_only', label: 'Platform messages only' },
              { value: 'show_phone',    label: 'Show phone number' },
              { value: 'show_whatsapp', label: 'Show WhatsApp' },
            ] as const).map(opt => (
              <label
                key={opt.value}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer text-sm font-bold transition-colors ${
                  form.contactPreference === opt.value
                    ? 'border-[#0866ff] bg-[#f0f6ff] text-[#0866ff]'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="contactPref"
                  value={opt.value}
                  checked={form.contactPreference === opt.value}
                  onChange={() => update('contactPreference', opt.value)}
                  className="sr-only"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* ── Photos (placeholder) ── */}
        <div className="space-y-2">
          <SectionHeader>Photos</SectionHeader>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
            <div className="text-3xl mb-2">📸</div>
            <p className="text-sm font-bold text-gray-500">Photo upload coming in the next release</p>
            <p className="text-xs text-gray-400 mt-1">
              Up to 10 high-quality photos per listing — photos significantly improve buyer response rates.
            </p>
          </div>
        </div>

        {/* ── Ownership declaration (vehicles only) ── */}
        {config.listingType === 'vehicle' && (
          <>
            <hr className="border-gray-100" />
            <div className="space-y-3">
              <SectionHeader>Declaration</SectionHeader>
              <CheckField
                label="I am authorised to sell this vehicle"
                hint="I confirm I am the registered owner or have written authorisation to list this vehicle."
                checked={form.ownershipDeclaration}
                onChange={v => update('ownershipDeclaration', v)}
              />
            </div>
          </>
        )}

        {/* ── POPIA notice ── */}
        <p className="text-[11px] text-gray-400 bg-gray-50 border border-gray-100 rounded-lg p-3 leading-relaxed">
          🔒 Your contact details are only shared with verified buyers who submit an inquiry. MotorSphere processes all personal information in accordance with POPIA.
        </p>

        {/* ── Error ── */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-sm text-red-700 font-bold">
            {error}
          </div>
        )}

        {/* ── Action buttons ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(true)}
            className="flex-1 py-3 rounded-lg text-sm font-black text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save as draft'}
          </button>
          <button
            type="submit"
            disabled={saving || !canSubmit}
            title={!canSubmit ? 'Complete your account verification to submit listings for review' : undefined}
            className="flex-1 py-3 rounded-lg text-sm font-black text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: '#0866ff' }}
          >
            {saving ? 'Submitting…' : 'Submit for review'}
          </button>
        </div>

        {!canSubmit && (
          <p className="text-xs text-amber-600 text-center -mt-2">
            Submit is disabled until your account verification is complete.{' '}
            <a href="/dashboard/verification" className="underline font-bold">Complete verification →</a>
          </p>
        )}

      </form>
    </div>
  );
}
