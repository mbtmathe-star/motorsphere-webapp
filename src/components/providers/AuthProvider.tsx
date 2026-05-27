'use client';

/**
 * src/components/providers/AuthProvider.tsx
 *
 * Provides Firebase Auth state and the user's Firestore profile to all
 * client components via React context.
 *
 * Wrap the app with <AuthProvider> in src/app/layout.tsx.
 * Consume with the useAuth() hook in src/hooks/useAuth.ts.
 */

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { getUserProfile } from '@/lib/firebase/users';
import { signOut } from '@/lib/firebase/auth';
import type { UserDoc } from '@/types/firestore.types';

// ─── Context shape ────────────────────────────────────────────────────────────

export interface AuthContextType {
  /** Firebase Auth user — null if signed out */
  user:    User | null;
  /** Firestore user profile — null if signed out or not yet loaded */
  profile: UserDoc | null;
  /** True until auth state has been resolved on first mount */
  loading: boolean;
  /** Sign out — clears Firebase auth + session cookie */
  logout:  () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null);
  const [profile, setProfile] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Fetch the Firestore profile — may be null on first mount immediately
        // after registration (race condition handled gracefully by null check)
        try {
          const profileDoc = await getUserProfile(firebaseUser.uid);
          setProfile(profileDoc);
        } catch {
          // Network error or missing doc — profile stays null, app still works
          setProfile(null);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    await signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAuthContext(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used inside <AuthProvider>');
  }
  return ctx;
}
