'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { updateUserProfile } from '@/lib/firebase/users';
import type { AccountType } from '@/types/firestore.types';

const ROLE_LABELS: Record<AccountType, string> = {
  buyer:          'Buyer',
  private_seller: 'Private Seller',
  dealer:         'Dealer',
  parts_vendor:   'Parts Vendor',
  workshop:       'Workshop',
  admin_preview:  'Admin Preview',
};

export default function ProfilePage() {
  const { user, profile } = useAuth();

  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  // Form fields — pre-filled from Firestore profile
  const [displayName, setDisplayName] = useState('');
  const [phone,       setPhone]       = useState('');
  const [city,        setCity]        = useState('');
  const [bio,         setBio]         = useState('');

  // Pre-fill form when profile loads
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName ?? '');
      setPhone(profile.phone ?? '');
      setCity(profile.province ?? '');
      setBio(profile.bio ?? '');
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError(null);
    setSaving(true);
    try {
      await updateUserProfile(user.uid, {
        displayName,
        phone:    phone || null,
        province: city   || null,
        bio:      bio    || null,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Unable to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const email       = profile?.email     ?? user.email    ?? '';
  const name        = profile?.displayName ?? displayName ?? 'User';
  const accountType = profile?.accountType;
  const roleLabel   = accountType ? ROLE_LABELS[accountType] : 'Member';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account details and preferences.</p>
      </div>

      {/* Avatar / account summary */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-black shrink-0"
          style={{ background: '#0866ff' }}
        >
          {name[0]?.toUpperCase() ?? 'U'}
        </div>
        <div>
          <p className="font-black text-gray-900">{name}</p>
          <p className="text-sm text-gray-500">{email}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              {roleLabel}
            </span>
            {profile?.isVerified && (
              <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                ✓ Verified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Feedback banners */}
      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
          <span className="text-green-600">✅</span>
          <p className="text-sm font-bold text-green-700">Profile updated successfully.</p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <p className="text-sm font-bold text-red-700">{error}</p>
        </div>
      )}

      {/* Profile form */}
      <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <h2 className="text-sm font-black text-gray-700">Personal Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-gray-700 mb-1">Display Name *</label>
            <input
              required
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#0866ff]"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full border border-gray-100 rounded-lg px-3 py-2.5 text-sm text-gray-400 bg-gray-50 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-gray-700 mb-1">Contact Number</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="e.g. 082 000 0000"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#0866ff]"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-700 mb-1">Province / City</label>
            <input
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder="e.g. Cape Town"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#0866ff]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-gray-700 mb-1">Bio / About</label>
          <textarea
            rows={3}
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="Tell buyers a little about yourself…"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#0866ff] resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-lg text-sm font-black text-white hover:opacity-90 transition-opacity disabled:opacity-60"
          style={{ background: '#0866ff' }}
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>

      {/* Account settings */}
      <div className="bg-white rounded-xl border border-red-100 p-5 space-y-3">
        <h2 className="text-sm font-black text-red-600">Account Settings</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-800">Change Password</p>
            <p className="text-xs text-gray-500">Send a password reset link to {email}</p>
          </div>
          <button className="text-xs font-bold text-[#0866ff] hover:underline">Send link</button>
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <div>
            <p className="text-sm font-bold text-gray-800">Delete Account</p>
            <p className="text-xs text-gray-500">Permanently delete your data (30-day grace period, POPIA)</p>
          </div>
          <button className="text-xs font-bold text-red-500 hover:underline">Request deletion</button>
        </div>
      </div>
    </div>
  );
}
