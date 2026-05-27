'use client';

/**
 * src/hooks/useAuth.ts
 *
 * Thin re-export hook for the auth context.
 * Provides: user, profile, loading, logout
 *
 * Usage:
 *   const { user, profile, loading, logout } = useAuth();
 *
 * Only works inside components rendered within <AuthProvider>.
 */

export { useAuthContext as useAuth } from '@/components/providers/AuthProvider';
