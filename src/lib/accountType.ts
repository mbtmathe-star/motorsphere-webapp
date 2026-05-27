/**
 * src/lib/accountType.ts
 *
 * Utility to map Firestore accountType values to the dashboard nav keys
 * used throughout the (dashboard) route group.
 *
 * accountType (Firestore) → navKey (dashboard maps)
 *   buyer          → 'buyer'
 *   private_seller → 'seller'
 *   dealer         → 'dealer'
 *   parts_vendor   → 'vendor'
 *   workshop       → 'workshop'
 *   admin_preview  → 'admin'
 */

import type { AccountType } from '@/types/firestore.types';

const MAP: Record<AccountType, string> = {
  buyer:          'buyer',
  private_seller: 'seller',
  dealer:         'dealer',
  parts_vendor:   'vendor',
  workshop:       'workshop',
  admin_preview:  'admin',
};

export function toNavKey(accountType: AccountType | undefined | null): string {
  return MAP[accountType ?? 'buyer'] ?? 'buyer';
}
