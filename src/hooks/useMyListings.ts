'use client';

/**
 * src/hooks/useMyListings.ts
 *
 * Real-time subscription hook for the current user's listings.
 * Wraps subscribeUserListings() from lib/firebase/listings.ts.
 *
 * Usage:
 *   const { listings, loading, draftCount, pendingCount, activeCount } = useMyListings();
 */

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { subscribeUserListings } from '@/lib/firebase/listings';
import type { ListingDoc } from '@/types/firestore.types';

export interface UseMyListingsReturn {
  listings:      ListingDoc[];
  loading:       boolean;
  draftCount:    number;
  pendingCount:  number;   // submitted + pending_review
  activeCount:   number;   // approved + live
  rejectedCount: number;
}

export function useMyListings(): UseMyListingsReturn {
  const { user }    = useAuth();
  const [listings,  setListings] = useState<ListingDoc[]>([]);
  const [loading,   setLoading]  = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsub = subscribeUserListings(user.uid, docs => {
      setListings(docs);
      setLoading(false);
    });

    return unsub;
  }, [user?.uid]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return { listings: [], loading: false, draftCount: 0, pendingCount: 0, activeCount: 0, rejectedCount: 0 };
  }

  const draftCount    = listings.filter(l => l.status === 'draft').length;
  const pendingCount  = listings.filter(l => ['submitted', 'pending_review'].includes(l.status)).length;
  const activeCount   = listings.filter(l => ['approved', 'live'].includes(l.status)).length;
  const rejectedCount = listings.filter(l => l.status === 'rejected').length;

  return { listings, loading, draftCount, pendingCount, activeCount, rejectedCount };
}
