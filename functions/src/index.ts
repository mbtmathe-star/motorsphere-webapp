/**
 * functions/src/index.ts
 *
 * Cloud Functions entry point — exports all functions.
 * Functions are scaffolded here; full implementation follows in Base 4–7.
 *
 * Function regions: africa-south1 preferred for SA latency.
 * If africa-south1 is not available for a function type, use us-central1.
 */

// ─── Auth Triggers ────────────────────────────────────────────────────────────
export { onUserCreate } from './auth/onUserCreate';
export { onUserDelete } from './auth/onUserDelete';

// ─── Firestore Triggers ───────────────────────────────────────────────────────
export { onVehicleCreate } from './listings/onVehicleCreate';
// export { onVehicleUpdate } from './listings/onVehicleUpdate';   // Base 4
// export { onPartsCreate   } from './listings/onPartsCreate';     // Base 5

// ─── Inquiry Triggers ─────────────────────────────────────────────────────────
// export { onInquiryCreate } from './inquiries/onInquiryCreate';  // Base 6
// export { onReplyCreate   } from './inquiries/onReplyCreate';     // Base 6

// ─── Storage Triggers ─────────────────────────────────────────────────────────
// export { onImageUpload } from './storage/onImageUpload';         // Base 4

// ─── Callable Functions ───────────────────────────────────────────────────────
// export { setUserRole        } from './callables/setUserRole';        // Base 7
// export { verifyUser         } from './callables/verifyUser';         // Base 7
// export { suspendUser        } from './callables/suspendUser';        // Base 7
// export { incrementViewCount } from './callables/incrementViewCount'; // Base 4
