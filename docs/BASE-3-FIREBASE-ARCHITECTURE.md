# MotorSphere — BASE 3: Firebase Architecture & Project Setup Plan

> **Stage:** Base 3 — Firebase Architecture, Project Setup & Implementation Specification
> **Date:** 2026-05-27
> **Status:** Active Planning Document
> **Depends on:** [BASE-1](./BASE-1-PRODUCT-FOUNDATION.md) · [BASE-2](./BASE-2-UX-FIGMA-MAPPING.md) · [BASE-2B](./BASE-2B-FIGMA-SCREEN-MAPPING.md)
> **Next Stage:** Base 4 — Vehicle Listings

---

## ⚡ Recommended Next Step: Option B

> **Before the full document — read this first.**

Three paths were proposed for what to build next:

| Option | Description |
|---|---|
| **A** | Firebase architecture only, then UI |
| **B** | Project scaffold + Firebase config + temporary UI tokens |
| **C** | Full app build |

### Recommendation: **Option B**

**Reason:** MotorSphere needs all three foundations running simultaneously before feature code begins — Firebase cannot be tested without a UI surface, and UI components cannot be verified without data flowing through them.

| Why not A | Why not C |
|---|---|
| Firebase-only leaves no visual surface. Base 4 would start from scratch on UI layout, making the first listing card the first time you see the design system. Bugs found late are expensive. | Full app build is premature. Figma colour tokens are not confirmed (⚠️ still needed), Security Rules are not emulator-tested, and component boundaries aren't validated. Building everything at once concentrates all the risk. |

**What Option B delivers before any feature code:**

```
✓ Firebase Emulator running locally (Auth + Firestore + Storage + Functions)
✓ Firebase client SDK + Admin SDK initialised in correct Next.js locations
✓ Firestore Security Rules written and tested against emulator
✓ Firebase Storage Security Rules written and tested against emulator
✓ Composite indexes deployed to firestore.indexes.json
✓ Session cookie auth pattern working end-to-end
✓ shadcn/ui installed and dark theme configured
✓ globals.css with TEMP dark tokens (confirmed from Figma screenshots)
✓ Folder structure locked (components/, lib/, types/, hooks/, utils/)
✓ TypeScript types for all Firestore document shapes
✓ GitHub Actions CI (lint + type-check + build)
✓ vercel.json configured (Vercel is the active hosting provider; Firebase App Hosting deferred)
✓ .env.local.example with all variable keys documented
✓ CLAUDE.md for AI-assisted development context
```

After Option B is complete, Base 4 starts with a working environment, not a blank slate.

---

## Table of Contents

1. [Firebase Project Setup Plan](#1-firebase-project-setup-plan)
2. [Recommended Firebase Services](#2-recommended-firebase-services)
3. [Firebase Auth Architecture](#3-firebase-auth-architecture)
4. [User Role Strategy — Custom Claims](#4-user-role-strategy--custom-claims)
5. [Firestore Collection Architecture](#5-firestore-collection-architecture)
6. [Firestore Document Types](#6-firestore-document-types)
7. [Marketplace Query Strategy](#7-marketplace-query-strategy)
8. [Required Firestore Indexes](#8-required-firestore-indexes)
9. [Firebase Storage Structure](#9-firebase-storage-structure)
10. [Firestore Security Rules](#10-firestore-security-rules)
11. [Firebase Storage Rules](#11-firebase-storage-rules)
12. [Cloud Functions Strategy](#12-cloud-functions-strategy)
13. [Firebase Emulator Suite Setup](#13-firebase-emulator-suite-setup)
14. [Deployment Plan (Vercel)](#14-deployment-plan-vercel)
15. [Environment Variables & Secrets Plan](#15-environment-variables--secrets-plan)
16. [Local Development Workflow](#16-local-development-workflow)
17. [GitHub Workflow](#17-github-workflow)
18. [Temporary Design Token Scaffold](#18-temporary-design-token-scaffold)
19. [Risks, Trade-offs & Recommendations](#19-risks-trade-offs--recommendations)
20. [Base 3 Implementation Checklist](#20-base-3-implementation-checklist)

---

## 1. Firebase Project Setup Plan

### 1.1 — Two-Project Strategy

MotorSphere requires two separate Firebase projects — never share data between environments.

| Project | Firebase ID | Purpose |
|---|---|---|
| `motorsphere-staging` | Choose in Console | All development and PR previews. Seeded test data. |
| `motorsphere-prod` | Choose in Console | Production only. Real user data. Backups enabled. |

> **Rule:** Developers never touch `motorsphere-prod` directly. All changes go through `motorsphere-staging` first, then deploy via `main` branch.

---

### 1.2 — Services to Enable in Firebase Console

For **both** projects, enable the following in the Firebase Console:

```
Authentication
  ✓ Enable Email/Password provider
  ✓ Enable Email link (passwordless) — Phase 1b optional
  ✓ Google provider — configure in Phase 1b (NOT now)
  ✗ Phone Auth — do NOT enable (not used at MVP)
  ✓ Set password minimum length: 8 characters
  ✓ Enable email enumeration protection (prevents user enumeration attacks)

Firestore Database
  ✓ Use the DEFAULT database (do NOT create named databases)
  ✓ Create database in production mode (rules will be written manually)
  ✓ Location: africa-south1 (Johannesburg) — lowest latency for SA users
  ✓ Rules will be written manually

Storage
  ✓ Enable Cloud Storage
  ✓ Location: same as Firestore (africa-south1)
  ✓ Rules will be written manually
  ✓ Set upload size limits (enforced in Storage Security Rules)

Functions
  ✓ Blaze plan is required for deploying Cloud Functions to Google Cloud
  ✓ For local development: Firebase Emulator runs Functions on any plan
  ✓ Functions deploy from functions/ directory — deferred until needed

App Hosting (Firebase) — DEFERRED ALTERNATIVE
  ✗ Do NOT configure Firebase App Hosting now
  ✓ Vercel is the active hosting provider (vercel.json is committed)
  ✓ Firebase App Hosting can be activated at a later stage as an alternative to Vercel
```

> **On region selection:** `africa-south1` (Johannesburg) is available for Firestore, Storage, and Cloud Functions. This gives SA users the lowest latency. Functions can be `us-central1` or `europe-west1` if `africa-south1` has limitations for specific Function triggers.
>
> **Firebase Blaze plan:** Required for Cloud Functions (deployed) and Firebase Storage write operations beyond free tier. The Emulator Suite runs all services locally on any plan.

---

### 1.3 — Firebase CLI Setup

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login
firebase login

# Initialise Firebase in the project root
firebase init

# Select (in the init wizard):
#   ✓ Firestore: Configure security rules and indexes files
#   ✓ Functions: Configure a Cloud Functions directory
#   ✓ Storage: Configure a security rules file
#   ✓ Emulators: Set up local emulators
#   ✗ App Hosting: Skip — Vercel is the active hosting provider (vercel.json is committed)

# When prompted for project: select motorsphere-staging as default
```

**After init, these files will exist (commit all to git):**
```
.firebaserc
firebase.json
firestore.rules
firestore.indexes.json
storage.rules
apphosting.yaml
functions/
  package.json
  tsconfig.json
  src/
    index.ts
```

---

### 1.4 — `.firebaserc`

```json
{
  "projects": {
    "default": "motorsphere-staging",
    "staging":  "motorsphere-staging",
    "prod":     "motorsphere-prod"
  },
  "targets": {},
  "etags": {}
}
```

**Usage:**
```bash
firebase use staging    # switch to staging project
firebase use prod       # switch to production project
firebase use default    # switch back to staging (default)
```

---

## 2. Recommended Firebase Services

### 2.1 — Services Used (MVP)

| Service | Usage | Why |
|---|---|---|
| **Firebase Auth** | User registration, login (Email/Password first), email verification, password reset, session cookies | Built-in, integrates natively with Security Rules via `request.auth` |
| **Cloud Firestore** | All application data — listings, users, inquiries, saves, flags. Default database only. | Scales automatically, Security Rules enforced at DB level, real-time capable |
| **Firebase Storage** | Vehicle images, parts images, user avatars, future verification documents | CDN-served, Security Rules tied to Auth, same project config as Firestore |
| **Cloud Functions** (2nd gen) | Auth triggers, Firestore triggers, Storage triggers, email dispatch, admin operations | Serverless, collocated with Firebase project, triggered by events. Deferred until needed. |
| **Vercel** | Next.js SSR hosting | Active hosting provider. First-class Next.js support, Cape Town region (`cpt1`), GitHub integration, preview deploys on PRs. `vercel.json` committed. |
| **Firebase App Hosting** | Next.js App Router SSR deployment (deferred alternative) | Native Next.js support, CDN, auto-scaling, GitHub integration. `apphosting.yaml` committed. Activate at a later stage if replacing Vercel. |
| **Firebase Emulator Suite** | Local development | Full offline Firebase stack (Auth + Firestore + Storage + Functions), no cloud costs during dev |

### 2.2 — Services NOT Used (MVP)

| Service | Reason Not Used |
|---|---|
| Firebase Realtime Database | Firestore is sufficient for MVP; RTDB would be for real-time chat (Phase 2) |
| Firebase Remote Config | No A/B testing or feature flags at MVP |
| Firebase Analytics | Add with cookie consent in Phase 1b if needed |
| Firebase App Check | Adds backend verification of client requests; add in Phase 2 for anti-abuse |
| Firebase Crashlytics | Consider for Phase 1b |
| Firebase Performance Monitoring | Consider for Phase 1b |
| Firebase ML | Not relevant |

---

## 3. Firebase Auth Architecture

### 3.1 — The Session Cookie Pattern

Firebase ID tokens (JWT, 1 hour expiry) are not suitable as direct cookies — they expire too quickly and refreshing them requires client-side JavaScript on every server render. The solution is Firebase Session Cookies.

**Full auth flow:**

```
SIGN IN:
  1. Client: firebase.auth().signInWithEmailAndPassword(email, password)
  2. Client: const idToken = await user.getIdToken()
  3. Client: POST /api/auth/session  { body: { idToken } }
  4. Server: admin.auth().verifyIdToken(idToken)          ← verify before creating cookie
  5. Server: admin.auth().createSessionCookie(idToken, { expiresIn: 5 * 24 * 60 * 60 * 1000 })
  6. Server: Set-Cookie: __session=<cookie>; HttpOnly; Secure; SameSite=Strict; Path=/
  7. Server: return { success: true }
  8. Client: redirect to /dashboard

EVERY REQUEST:
  9. Browser sends __session cookie automatically
 10. middleware.ts reads __session cookie (presence check — Edge Runtime compatible)
 11. Protected routes: redirect to /login if cookie absent
 12. Server Components/API routes: admin.auth().verifySessionCookie(cookie, checkRevoked: true)

SIGN OUT:
 13. Client: await firebase.auth().signOut()
 14. Client: DELETE /api/auth/session
 15. Server: Clear __session cookie (set Max-Age=0)
 16. Client: redirect to /homepage
```

**Why 5-day session expiry?** Short enough to limit risk, long enough that active users don't get repeatedly logged out. Firebase session cookies can be up to 2 weeks; 5 days is a good balance.

---

### 3.2 — Next.js App Router + Firebase Auth Integration

The key constraint: **`firebase-admin` uses Node.js APIs not available in the Next.js Edge Runtime.**

Next.js middleware always runs in the Edge Runtime. This means:

| Layer | Runtime | Firebase SDK | Can Do |
|---|---|---|---|
| `proxy.ts` (Next.js 16) | Edge Runtime | ❌ Admin SDK | Cookie presence check only |
| `app/api/*/route.ts` | Node.js (default) | ✅ Admin SDK | Full verification, Firestore Admin |
| `app/**/page.tsx` (Server Component) | Node.js | ✅ Admin SDK | SSR with Firestore data |
| `src/components/**` (Client Component) | Browser | ✅ Client SDK | Firestore realtime, Auth state |
| `functions/src/**` | Node.js (Cloud Functions) | ✅ Admin SDK | All Firebase operations |

**Middleware strategy — lightweight Edge-compatible check:**

```typescript
// src/proxy.ts  ← Next.js 16: middleware.ts renamed to proxy.ts; export named 'proxy'
import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PREFIXES = ['/dashboard', '/account'];
const ADMIN_PREFIX = '/admin';
const AUTH_ROUTES = ['/login', '/register', '/forgot-password'];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = req.cookies.get('__session')?.value;

  const isProtected = PROTECTED_PREFIXES.some(p => pathname.startsWith(p));
  const isAdmin     = pathname.startsWith(ADMIN_PREFIX);
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  // Redirect unauthenticated users away from protected routes
  if ((isProtected || isAdmin) && !session) {
    const url = new URL('/login', req.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
```

> **Security note:** The middleware checks cookie PRESENCE only — it does not cryptographically verify the cookie. The actual security enforcement has two layers:
> 1. **Firebase Security Rules** — enforced server-side by Firebase on every read/write regardless of middleware
> 2. **Server Component / API route verification** — `admin.auth().verifySessionCookie()` before any sensitive operation
>
> Middleware is a UX routing guard, not a security boundary. This is correct — the database layer is the security boundary.

**Admin route role check — in layout Server Component:**

```typescript
// src/app/(admin)/layout.tsx
import { getAdminAuth } from '@/lib/firebase/admin';  // ← lazy factory function
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('__session')?.value;

  if (!session) redirect('/login');

  try {
    const decoded = await getAdminAuth().verifySessionCookie(session, true);
    const role = decoded.role as string | undefined;

    if (!role || !['admin', 'super_admin'].includes(role)) {
      redirect('/dashboard'); // Authenticated but not admin
    }
  } catch {
    redirect('/login');
  }

  return <>{children}</>;
}
```

---

### 3.3 — Firebase SDK Initialisation Files

**`src/lib/firebase/client.ts`** (Client Components only):

```typescript
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Prevent duplicate initialisation during hot reload
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);

// Connect to emulators in development
if (
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true' &&
  typeof window !== 'undefined'
) {
  // Guard prevents connecting twice during React strict mode double-render
  if (!(auth as any)._delegate?._config?.emulator) {
    connectAuthEmulator(auth,    'http://localhost:9099', { disableWarnings: true });
    connectFirestoreEmulator(db,  'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
  }
}
```

**`src/lib/firebase/admin.ts`** (Server Components, API routes — Node.js only):

```typescript
import { getApps, getApp, initializeApp, cert, App } from 'firebase-admin/app';
import { getAuth }      from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage }   from 'firebase-admin/storage';

let _app: App | undefined;

function getAdminApp(): App {
  if (_app) return _app;
  if (getApps().length > 0) { _app = getApp(); return _app; }
  _app = initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_ADMIN_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
      privateKey:  process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  });
  return _app;
}

// Lazy factory functions — called at request time, NOT at module import time.
// This prevents build-time failures when env vars contain placeholder values.
export function getAdminAuth()    { return getAuth(getAdminApp()); }
export function getAdminDb()      { return getFirestore(getAdminApp()); }
export function getAdminStorage() { return getStorage(getAdminApp()); }
```

> **Lazy initialization pattern:** `getAdminAuth()`, `getAdminDb()`, and `getAdminStorage()` are factory functions that initialize on first call. This is CRITICAL — pre-initialized module-level constants (like `const adminAuth = getAuth(adminApp)`) cause `cert()` to parse the private key during `next build`, which fails with placeholder credentials in CI.
>
> **`privateKey.replace(/\\n/g, '\n')`** — environment variables serialize the private key newlines as `\n` literal string. This replace restores the actual newlines required by the RSA private key format.

---

## 4. User Role Strategy — Custom Claims

### 4.1 — Role Definitions (unchanged from BASE-1)

| Role | Custom Claim | Capabilities |
|---|---|---|
| `user` | `{ role: 'user' }` | Default. Can list (limits apply), inquire, save. |
| `verified_seller` | `{ role: 'verified_seller' }` | Higher listing limits, verified badge |
| `admin` | `{ role: 'admin' }` | Full moderation access |
| `super_admin` | `{ role: 'super_admin' }` | Platform configuration |

### 4.2 — How Custom Claims Work in Firebase

Custom claims are arbitrary key-value pairs embedded in the Firebase Auth JWT. They are set by the Firebase Admin SDK and propagated to:
- The Firebase Auth token (verified in Security Rules as `request.auth.token.role`)
- The Firestore `users/{uid}.role` field (mirror, kept in sync by Cloud Function)
- The session cookie decoded payload (checked in Server Components/API routes)

**Critical constraint:** Custom claims have a maximum size of **1000 bytes** across all claims combined. Keep claims minimal — `{ role: 'admin' }` not `{ role: 'admin', permissions: [...] }`.

### 4.3 — Setting Custom Claims

Custom claims can only be set server-side via the Admin SDK:

```typescript
// Cloud Function or API route (admin only)
await adminAuth.setCustomUserClaims(uid, { role: 'admin' });
```

After setting claims, the user's token must refresh before the new claim takes effect. Two ways:
1. Force token refresh: `await user.getIdToken(true)` on the client
2. Session cookie is re-issued on the next sign-in
3. For immediate effect in Security Rules: Security Rules read the **token**, which updates when the user's ID token refreshes

**For MVP:** Admin assigns roles manually. Cloud Function `setUserRole` (callable) handles the claim update + Firestore sync.

### 4.4 — Role Verification in Server Components

```typescript
// Anywhere you need the current user's role in a Server Component
import { getAdminAuth } from '@/lib/firebase/admin';
import { cookies }      from 'next/headers';

async function getCurrentUserRole(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('__session')?.value;
  if (!session) return null;

  try {
    const decoded = await getAdminAuth().verifySessionCookie(session, true);
    return (decoded.role as string) ?? 'user';
  } catch {
    return null;
  }
}
```

---

## 5. Firestore Collection Architecture

### 5.1 — Collection Map

```
/users/{uid}                              User profiles
/vehicles/{vehicleId}                     Vehicle listings
  └── /images/{imageId}                   Subcollection: images
/parts/{partId}                           Parts listings
  └── /images/{imageId}                   Subcollection: images
/inquiries/{inquiryId}                    Inquiry threads
  └── /replies/{replyId}                  Subcollection: thread replies
/savedListings/{savedId}                  User saves/favourites
/adminFlags/{flagId}                      Reported/flagged listings
```

### 5.2 — Denormalisation Strategy

Firestore has no joins. Fields that are frequently displayed alongside a document are copied (denormalised) into that document at write time. Cloud Functions keep them in sync.

| Denormalised Field | Stored In | Source | Sync Trigger |
|---|---|---|---|
| `userDisplayName` | `vehicles`, `parts`, `inquiries`, `replies` | `users/{uid}.displayName` | `onUserUpdate` Cloud Function |
| `userIsVerified` | `vehicles`, `parts` | `users/{uid}.isVerified` | `onUserVerified` Cloud Function |
| `primaryImageUrl` | `vehicles`, `parts` | First image document | `onImageCreate` / `onImageDelete` |
| `imageCount` | `vehicles`, `parts` | Count of image subcollection docs | `onImageCreate` / `onImageDelete` |
| `listingTitle` | `savedListings`, `inquiries` | `vehicles.make+model+year` or `parts.title` | `onListingUpdate` Cloud Function |
| `listingPrice` | `savedListings` | `vehicles.price` / `parts.price` | `onListingUpdate` Cloud Function |
| `listingStatus` | `savedListings` | `vehicles.status` / `parts.status` | `onListingUpdate` Cloud Function |
| `replyCount` | `inquiries` | Count of replies subcollection | `onReplyCreate` |

> **Sync lag is acceptable for denormalised display fields.** If a user changes their display name, cards showing their listings will update within seconds (Cloud Function latency). This is fine — it is not a financial transaction.

---

## 6. Firestore Document Types

**`src/types/firestore.types.ts`** — canonical TypeScript types for all Firestore documents:

```typescript
import type { Timestamp } from 'firebase/firestore';

// ─── Enums (as const objects for runtime use) ─────────────────────────────

export const PROVINCES = [
  'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape',
  'Limpopo', 'Mpumalanga', 'North West', 'Free State', 'Northern Cape',
] as const;
export type Province = typeof PROVINCES[number];

export const VEHICLE_TRANSMISSION = ['manual', 'automatic', 'semi-automatic'] as const;
export type VehicleTransmission = typeof VEHICLE_TRANSMISSION[number];

export const FUEL_TYPES = ['petrol', 'diesel', 'hybrid', 'electric', 'lpg'] as const;
export type FuelType = typeof FUEL_TYPES[number];

export const VEHICLE_CONDITIONS = ['excellent', 'good', 'fair', 'salvage'] as const;
export type VehicleCondition = typeof VEHICLE_CONDITIONS[number];

export const PART_CONDITIONS = ['new', 'used', 'refurbished'] as const;
export type PartCondition = typeof PART_CONDITIONS[number];

export const LISTING_STATUSES = [
  'draft', 'pending_review', 'active', 'paused', 'sold', 'rejected',
] as const;
export type ListingStatus = typeof LISTING_STATUSES[number];

export const USER_ROLES = ['user', 'verified_seller', 'admin', 'super_admin'] as const;
export type UserRole = typeof USER_ROLES[number];

export const CONTACT_PREFS = ['platform_only', 'show_phone', 'show_whatsapp'] as const;
export type ContactPref = typeof CONTACT_PREFS[number];

export const LISTING_TYPES = ['vehicle', 'part'] as const;
export type ListingType = typeof LISTING_TYPES[number];

// ─── /users/{uid} ─────────────────────────────────────────────────────────

export interface UserDoc {
  uid:          string;          // = document ID = Firebase Auth UID
  username:     string;
  displayName:  string;
  avatarUrl:    string | null;
  phone:        string | null;
  province:     Province | null;
  bio:          string | null;
  isVerified:   boolean;
  isSuspended:  boolean;
  role:         UserRole;
  listingCount: number;
  createdAt:    Timestamp;
  updatedAt:    Timestamp;
}

// ─── /vehicles/{vehicleId} ────────────────────────────────────────────────

export interface VehicleDoc {
  id:              string;
  userId:          string;
  userDisplayName: string;        // denormalised
  userIsVerified:  boolean;       // denormalised
  make:            string;
  model:           string;
  year:            number;
  variant:         string | null;
  mileage:         number | null;
  transmission:    VehicleTransmission;
  fuelType:        FuelType;
  colour:          string | null;
  condition:       VehicleCondition;
  price:           number;        // ZAR cents — ALWAYS store as integer
  negotiable:      boolean;
  province:        Province;
  city:            string | null;
  description:     string;
  contactPref:     ContactPref;
  primaryImageUrl: string | null; // denormalised
  imageCount:      number;        // denormalised
  status:          ListingStatus;
  rejectionNote:   string | null;
  viewsCount:      number;
  featured:        boolean;
  createdAt:       Timestamp;
  updatedAt:       Timestamp;
  publishedAt:     Timestamp | null;
}

// ─── /vehicles/{vehicleId}/images/{imageId} ───────────────────────────────

export interface ListingImageDoc {
  id:          string;
  storagePath: string;    // Firebase Storage path
  url:         string;    // CDN download URL
  sortOrder:   number;
  isPrimary:   boolean;
  createdAt:   Timestamp;
}

// ─── /parts/{partId} ──────────────────────────────────────────────────────

export interface PartDoc {
  id:                 string;
  userId:             string;
  userDisplayName:    string;     // denormalised
  userIsVerified:     boolean;    // denormalised
  title:              string;
  category:           string;     // slug from parts taxonomy
  condition:          PartCondition;
  price:              number;     // ZAR cents
  quantity:           number;
  province:           Province;
  city:               string | null;
  description:        string;
  compatibleMakes:    string[];
  compatibleModels:   string[];
  compatibleYearFrom: number | null;
  compatibleYearTo:   number | null;
  primaryImageUrl:    string | null; // denormalised
  imageCount:         number;        // denormalised
  status:             ListingStatus;
  rejectionNote:      string | null;
  viewsCount:         number;
  createdAt:          Timestamp;
  updatedAt:          Timestamp;
  publishedAt:        Timestamp | null;
}

// ─── /inquiries/{inquiryId} ───────────────────────────────────────────────

export interface InquiryDoc {
  id:           string;
  listingId:    string;
  listingType:  ListingType;
  listingTitle: string;     // denormalised
  senderId:     string;
  senderName:   string;     // denormalised
  receiverId:   string;
  message:      string;
  isRead:       boolean;
  replyCount:   number;     // denormalised
  createdAt:    Timestamp;
}

// ─── /inquiries/{inquiryId}/replies/{replyId} ─────────────────────────────

export interface ReplyDoc {
  id:         string;
  senderId:   string;
  senderName: string;   // denormalised
  message:    string;
  createdAt:  Timestamp;
}

// ─── /savedListings/{savedId} ─────────────────────────────────────────────

export interface SavedListingDoc {
  id:              string;
  userId:          string;
  listingId:       string;
  listingType:     ListingType;
  listingTitle:    string;       // denormalised
  listingPrice:    number;       // denormalised — ZAR cents
  listingStatus:   ListingStatus; // denormalised — detect when sold
  primaryImageUrl: string | null;
  createdAt:       Timestamp;
}

// ─── /adminFlags/{flagId} ─────────────────────────────────────────────────

export interface AdminFlagDoc {
  id:          string;
  listingId:   string;
  listingType: ListingType;
  flaggedBy:   string | null;  // null = system auto-flag
  reason:      string;
  resolved:    boolean;
  resolvedBy:  string | null;
  resolvedAt:  Timestamp | null;
  createdAt:   Timestamp;
}

// ─── Utility types ────────────────────────────────────────────────────────

/** Strip Firestore Timestamps for client-side serialization (JSON-safe) */
export type Serialized<T> = {
  [K in keyof T]: T[K] extends Timestamp
    ? string           // ISO date string
    : T[K] extends Timestamp | null
      ? string | null
      : T[K];
};

export type SerializedVehicle   = Serialized<VehicleDoc>;
export type SerializedPart      = Serialized<PartDoc>;
export type SerializedUser      = Serialized<UserDoc>;
export type SerializedInquiry   = Serialized<InquiryDoc>;
```

> **`Serialized<T>` pattern is critical.** Next.js Server Components pass data to Client Components as props. Firestore `Timestamp` objects are not JSON-serializable. Convert Timestamps to ISO strings at the Server Component boundary before passing to client.

---

## 7. Marketplace Query Strategy

### 7.1 — What Firestore Can Do for MotorSphere

Firestore handles equality and range filters well when composite indexes are defined. The following query patterns are supported:

```typescript
// Pattern 1: All active vehicles, newest first
db.collection('vehicles')
  .where('status', '==', 'active')
  .orderBy('createdAt', 'desc')
  .limit(20)

// Pattern 2: Filter by make + status
db.collection('vehicles')
  .where('status', '==', 'active')
  .where('make', '==', 'toyota')
  .orderBy('createdAt', 'desc')
  .limit(20)

// Pattern 3: Filter by province + status
db.collection('vehicles')
  .where('status', '==', 'active')
  .where('province', '==', 'Gauteng')
  .orderBy('createdAt', 'desc')
  .limit(20)

// Pattern 4: My listings (user dashboard)
db.collection('vehicles')
  .where('userId', '==', currentUid)
  .orderBy('createdAt', 'desc')

// Pattern 5: Parts by category (fitment)
db.collection('parts')
  .where('status', '==', 'active')
  .where('category', '==', 'engine-drivetrain')
  .orderBy('createdAt', 'desc')
  .limit(20)

// Pattern 6: Parts by compatible make (array-contains)
db.collection('parts')
  .where('status', '==', 'active')
  .where('compatibleMakes', 'array-contains', 'toyota')
  .orderBy('createdAt', 'desc')
  .limit(20)

// Pattern 7: Admin pending queue
db.collection('vehicles')
  .where('status', '==', 'pending_review')
  .orderBy('createdAt', 'asc')  // oldest first for fair queue
```

### 7.2 — Multi-Filter Strategy (Where Firestore Limits Apply)

Firestore allows only one `array-contains` or `array-contains-any` per query. It does not support `OR` queries across different fields natively (Firestore v9 added `OR` queries but with limitations).

**For MVP, use this layered approach:**

| Filter Combination | Strategy |
|---|---|
| status + make | Composite index ✅ |
| status + province | Composite index ✅ |
| status + make + province | Firestore supports this with a 3-field composite index ✅ |
| status + price range | Composite index (status + price ASC) ✅ |
| status + make + price range | Fetch status+make, filter price client-side on the returned set ⚠️ |
| Full-text title/description search | Not supported — navigate to structured filters, Phase 2: Algolia ❌ |

**Client-side filter pattern for unsupported combinations:**

```typescript
// Server: fetch by most selective filter (make is selective)
const vehicles = await db.collection('vehicles')
  .where('status', '==', 'active')
  .where('make', '==', selectedMake)
  .orderBy('createdAt', 'desc')
  .limit(100)  // Fetch more, filter down
  .get();

// Client: apply secondary filters on the returned set
const filtered = vehicles.docs
  .map(d => d.data() as VehicleDoc)
  .filter(v => {
    if (priceMin && v.price < priceMin) return false;
    if (priceMax && v.price > priceMax) return false;
    if (selectedProvince && v.province !== selectedProvince) return false;
    return true;
  });
```

> **Acceptable at MVP scale** (< 10,000 active listings). At ~50,000 listings, migrate to Algolia for search + Firestore for persistence.

### 7.3 — Cursor-Based Pagination

Firestore pagination uses document cursors, not page offsets. This is the only correct pattern for Firestore.

```typescript
// src/lib/firebase/queries/vehicles.ts

interface VehicleQueryParams {
  status?:    ListingStatus;
  make?:      string;
  province?:  Province;
  sortBy?:    'newest' | 'price_asc' | 'price_desc' | 'mileage_asc';
  limit?:     number;
  cursor?:    DocumentSnapshot;  // for next-page requests
}

export async function queryVehicles(params: VehicleQueryParams) {
  const { status = 'active', make, province, sortBy = 'newest', limit: pageSize = 20, cursor } = params;

  let q = query(
    collection(db, 'vehicles'),
    where('status', '==', status),
  );

  if (make)     q = query(q, where('make',     '==', make));
  if (province) q = query(q, where('province', '==', province));

  const orderField = sortBy === 'newest'     ? 'createdAt'
                   : sortBy === 'price_asc'  ? 'price'
                   : sortBy === 'price_desc' ? 'price'
                   : 'mileage';
  const orderDir   = sortBy === 'price_desc' ? 'desc' : (sortBy === 'newest' ? 'desc' : 'asc');

  q = query(q, orderBy(orderField, orderDir), firestoreLimit(pageSize + 1));
  if (cursor) q = query(q, startAfter(cursor));

  const snap = await getDocs(q);
  const hasMore = snap.docs.length > pageSize;
  const docs = hasMore ? snap.docs.slice(0, pageSize) : snap.docs;
  const lastVisible = docs[docs.length - 1] ?? null;

  return {
    vehicles:    docs.map(d => ({ id: d.id, ...d.data() }) as VehicleDoc),
    hasMore,
    lastVisible, // Pass to next page request
  };
}
```

---

## 8. Required Firestore Indexes

**`firestore.indexes.json`** — complete file for MVP:

```json
{
  "indexes": [
    {
      "collectionGroup": "vehicles",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status",    "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "vehicles",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "make",   "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "vehicles",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status",   "order": "ASCENDING" },
        { "fieldPath": "province", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "vehicles",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "make",   "order": "ASCENDING" },
        { "fieldPath": "province", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "vehicles",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "price",  "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "vehicles",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status",  "order": "ASCENDING" },
        { "fieldPath": "mileage", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "vehicles",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId",    "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "vehicles",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "featured",  "order": "ASCENDING" },
        { "fieldPath": "status",    "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "parts",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status",    "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "parts",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status",   "order": "ASCENDING" },
        { "fieldPath": "category", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "parts",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status",           "order": "ASCENDING" },
        { "fieldPath": "compatibleMakes",  "arrayConfig": "CONTAINS" },
        { "fieldPath": "createdAt",        "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "parts",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId",    "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "savedListings",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId",    "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "savedListings",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId",      "order": "ASCENDING" },
        { "fieldPath": "listingType", "order": "ASCENDING" },
        { "fieldPath": "createdAt",   "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "inquiries",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "receiverId", "order": "ASCENDING" },
        { "fieldPath": "createdAt",  "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "inquiries",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "senderId",  "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "inquiries",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "receiverId", "order": "ASCENDING" },
        { "fieldPath": "isRead",     "order": "ASCENDING" },
        { "fieldPath": "createdAt",  "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

---

## 9. Firebase Storage Structure

### 9.1 — Folder Paths

```
Firebase Storage bucket: {project-id}.appspot.com

/avatars/
  {userId}/
    avatar.webp           ← Always overwrites the same file on update

/vehicles/
  {userId}/
    {vehicleId}/
      0.webp              ← Primary image (sort order 0)
      1.webp
      2.webp
      ...
      19.webp             ← Maximum 20 images per vehicle listing

/parts/
  {userId}/
    {partId}/
      0.webp              ← Maximum 10 images per parts listing
      ...
      9.webp

/admin/
  {document}              ← Private admin documents (verification docs — Phase 2)
```

### 9.2 — Upload Flow

```
Client selects file
  → Validate client-side: type (image/jpeg, image/png, image/webp), size (< 5MB)
  → Upload to Firebase Storage via client SDK (uploadBytesResumable)
  → Storage Security Rules enforce same validation server-side
  → Cloud Function onObjectFinalized triggers:
      → Resize to max 1200px wide (maintain aspect ratio)
      → Convert to WebP (if not already)
      → Update Firestore image document with final CDN URL
      → If isPrimary: update parent listing's primaryImageUrl
```

### 9.3 — File Size and Count Limits

| Type | Max Size (client) | Max Count | Storage Path |
|---|---|---|---|
| Vehicle image | 5MB (→ ~200–400KB after WebP) | 20 | `vehicles/{uid}/{id}/{n}.webp` |
| Parts image | 5MB (→ ~200–400KB after WebP) | 10 | `parts/{uid}/{id}/{n}.webp` |
| Avatar | 2MB (→ ~50–100KB after WebP) | 1 | `avatars/{uid}/avatar.webp` |
| Verification doc | 10MB | 5 | `admin/{uid}/verify/{n}` — private, Phase 2 |

> **Size limits are enforced at two layers:** (1) client-side validation before upload starts, and (2) Firebase Storage Security Rules rejecting uploads that exceed the size limit server-side.

---

## 10. Firestore Security Rules

**`firestore.rules`** — complete MVP ruleset:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ─── Helper functions ────────────────────────────────────────────────

    function isAuth() {
      return request.auth != null;
    }

    function uid() {
      return request.auth.uid;
    }

    function isOwner(docUserId) {
      return isAuth() && uid() == docUserId;
    }

    function hasRole(roles) {
      return isAuth() && request.auth.token.role in roles;
    }

    function isAdmin() {
      return hasRole(['admin', 'super_admin']);
    }

    function isVerifiedOrAbove() {
      return hasRole(['verified_seller', 'admin', 'super_admin']);
    }

    function canReadListing(status, docUserId) {
      return status == 'active'
          || isOwner(docUserId)
          || isAdmin();
    }

    // ─── /users ──────────────────────────────────────────────────────────

    match /users/{userId} {
      allow read:   if true;  // Public profiles are readable by everyone

      allow create: if isAuth()
                    && uid() == userId
                    // Enforce safe initial values on create
                    && request.resource.data.role == 'user'
                    && request.resource.data.isVerified == false
                    && request.resource.data.isSuspended == false;

      allow update: if (isOwner(userId)
                        // Users cannot escalate their own role or verify themselves
                        && request.resource.data.role == resource.data.role
                        && request.resource.data.isVerified == resource.data.isVerified
                        && request.resource.data.isSuspended == resource.data.isSuspended)
                    || isAdmin();  // Admins can update anything

      allow delete: if isOwner(userId) || isAdmin();
    }

    // ─── /vehicles ───────────────────────────────────────────────────────

    match /vehicles/{vehicleId} {
      allow read: if canReadListing(resource.data.status, resource.data.userId);

      allow create: if isAuth()
                    && request.resource.data.userId == uid()
                    && request.resource.data.status in ['draft', 'pending_review']
                    // Prevent client from setting admin-only fields
                    && request.resource.data.featured == false
                    && request.resource.data.viewsCount == 0;

      allow update: if (isOwner(resource.data.userId)
                        // Users cannot self-approve listings
                        && !(resource.data.status != 'active'
                             && request.resource.data.status == 'active'))
                    || isAdmin();

      allow delete: if isOwner(resource.data.userId) || isAdmin();

      // ── /vehicles/{vehicleId}/images ─────────────────────────────────
      match /images/{imageId} {
        allow read: if canReadListing(
          get(/databases/$(database)/documents/vehicles/$(vehicleId)).data.status,
          get(/databases/$(database)/documents/vehicles/$(vehicleId)).data.userId
        );
        allow create, update, delete: if isOwner(
          get(/databases/$(database)/documents/vehicles/$(vehicleId)).data.userId
        ) || isAdmin();
      }
    }

    // ─── /parts ──────────────────────────────────────────────────────────

    match /parts/{partId} {
      allow read: if canReadListing(resource.data.status, resource.data.userId);

      allow create: if isAuth()
                    && request.resource.data.userId == uid()
                    && request.resource.data.status in ['draft', 'pending_review']
                    && request.resource.data.featured == false
                    && request.resource.data.viewsCount == 0;

      allow update: if (isOwner(resource.data.userId)
                        && !(resource.data.status != 'active'
                             && request.resource.data.status == 'active'))
                    || isAdmin();

      allow delete: if isOwner(resource.data.userId) || isAdmin();

      match /images/{imageId} {
        allow read: if canReadListing(
          get(/databases/$(database)/documents/parts/$(partId)).data.status,
          get(/databases/$(database)/documents/parts/$(partId)).data.userId
        );
        allow create, update, delete: if isOwner(
          get(/databases/$(database)/documents/parts/$(partId)).data.userId
        ) || isAdmin();
      }
    }

    // ─── /inquiries ──────────────────────────────────────────────────────

    match /inquiries/{inquiryId} {
      allow read: if isAuth() && (
                    uid() == resource.data.senderId ||
                    uid() == resource.data.receiverId ||
                    isAdmin()
                  );

      allow create: if isAuth()
                    && request.resource.data.senderId == uid()
                    // Cannot send inquiry to yourself
                    && request.resource.data.receiverId != uid();

      // Only receiver can mark as read; sender cannot alter the document
      allow update: if (isAuth() && uid() == resource.data.receiverId
                        && request.resource.data.diff(resource.data).affectedKeys()
                           .hasOnly(['isRead']))
                    || isAdmin();

      // Replies subcollection
      match /replies/{replyId} {
        allow read: if isAuth() && (
                      uid() == get(/databases/$(database)/documents/inquiries/$(inquiryId)).data.senderId ||
                      uid() == get(/databases/$(database)/documents/inquiries/$(inquiryId)).data.receiverId ||
                      isAdmin()
                    );
        allow create: if isAuth() && (
                        uid() == get(/databases/$(database)/documents/inquiries/$(inquiryId)).data.senderId ||
                        uid() == get(/databases/$(database)/documents/inquiries/$(inquiryId)).data.receiverId
                      );
        allow update, delete: if isAdmin();
      }
    }

    // ─── /savedListings ──────────────────────────────────────────────────

    match /savedListings/{savedId} {
      allow read:   if isAuth() && uid() == resource.data.userId;
      allow create: if isAuth() && request.resource.data.userId == uid();
      allow delete: if isAuth() && uid() == resource.data.userId;
      allow update: if false; // Saves are immutable — delete and re-create
    }

    // ─── /adminFlags ─────────────────────────────────────────────────────

    match /adminFlags/{flagId} {
      allow read:   if isAdmin();
      allow create: if isAuth()
                    && request.resource.data.flaggedBy == uid();
      allow update, delete: if isAdmin();
    }
  }
}
```

> **Rules testing:** Use `@firebase/rules-unit-testing` with the Firestore Emulator to write unit tests for every rule. Do not deploy Security Rules to production until all tests pass.

---

## 11. Firebase Storage Rules

**`storage.rules`** — complete MVP ruleset:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // ─── Helper functions ────────────────────────────────────────────────

    function isAuth() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuth() && request.auth.uid == userId;
    }

    function isAdmin() {
      return isAuth() && request.auth.token.role in ['admin', 'super_admin'];
    }

    function isValidImage() {
      return request.resource.contentType.matches('image/.*')
          && request.resource.size < 5 * 1024 * 1024;  // 5MB max
    }

    function isValidAvatar() {
      return request.resource.contentType.matches('image/.*')
          && request.resource.size < 2 * 1024 * 1024;  // 2MB max for avatars
    }

    function isValidDoc() {
      return request.resource.size < 10 * 1024 * 1024; // 10MB max for docs
    }

    // ─── Avatars — public read, owner write ───────────────────────────────

    match /avatars/{userId}/{allPaths=**} {
      allow read:   if true;                              // Public CDN
      allow write:  if isOwner(userId) && isValidAvatar();
      allow delete: if isOwner(userId) || isAdmin();
    }

    // ─── Vehicle images — public read, owner write ────────────────────────

    match /vehicles/{userId}/{vehicleId}/{allPaths=**} {
      allow read:   if true;                              // Public CDN
      allow write:  if isOwner(userId) && isValidImage();
      allow delete: if isOwner(userId) || isAdmin();
    }

    // ─── Parts images — public read, owner write ──────────────────────────

    match /parts/{userId}/{partId}/{allPaths=**} {
      allow read:   if true;
      allow write:  if isOwner(userId) && isValidImage();
      allow delete: if isOwner(userId) || isAdmin();
    }

    // ─── Admin / verification documents — private ─────────────────────────
    // Phase 2: seller verification documents are only readable by admins and
    // the owning user. Sellers upload; only admins can read.

    match /admin/{userId}/{allPaths=**} {
      allow read:   if isOwner(userId) || isAdmin();
      allow write:  if isOwner(userId) && isValidDoc();
      allow delete: if isAdmin();
    }
  }
}
```

> **Rules testing:** Use `@firebase/rules-unit-testing` with the Storage Emulator to write unit tests for every rule. Do not deploy Storage Rules to production until all tests pass.

---

## 12. Cloud Functions Strategy

### 12.1 — Folder Structure

```
functions/
├── src/
│   ├── index.ts                 ← Exports all functions
│   │
│   ├── auth/
│   │   ├── onUserCreate.ts      ← Creates Firestore user doc + sends welcome email
│   │   └── onUserDelete.ts      ← POPIA-compliant cleanup on account deletion
│   │
│   ├── listings/
│   │   ├── onVehicleCreate.ts   ← Validates listing, notifies admin
│   │   ├── onVehicleUpdate.ts   ← Status change emails, denorm sync
│   │   ├── onPartsCreate.ts     ← Same as vehicle
│   │   └── onPartsUpdate.ts     ← Same as vehicle
│   │
│   ├── inquiries/
│   │   ├── onInquiryCreate.ts   ← Emails seller with inquiry
│   │   └── onReplyCreate.ts     ← Emails inquiry sender with reply
│   │
│   ├── storage/
│   │   └── onImageUpload.ts     ← Resize + WebP conversion + Firestore URL update
│   │
│   ├── callables/
│   │   ├── setUserRole.ts       ← Admin: set custom claim + Firestore role
│   │   ├── verifyUser.ts        ← Admin: grant verified_seller status
│   │   ├── suspendUser.ts       ← Admin: disable Auth account + Firestore flag
│   │   └── incrementViewCount.ts ← Increment viewsCount server-side
│   │
│   └── utils/
│       ├── email.ts             ← Resend email helper
│       ├── timestamps.ts        ← Timestamp helpers
│       └── validation.ts        ← Shared validation
│
├── package.json
└── tsconfig.json
```

### 12.2 — Function Specifications

#### `onUserCreate` — Auth trigger
```
Trigger:  functions.auth.user().onCreate()
Action:
  1. Create /users/{uid} document with default values (role: 'user', isVerified: false)
  2. Enforce username uniqueness (check /users where username == displayName, adjust if taken)
  3. Send welcome + email verification email via Resend
  4. Set custom claim: { role: 'user' } (default — safe to set on creation)
```

#### `onUserDelete` — Auth trigger
```
Trigger:  functions.auth.user().onDelete()
Action:
  1. Mark /users/{uid} as deleted (soft delete: deletedAt: now(), isDeleted: true)
  2. Change all user's active listings to status: 'paused'
  3. Do NOT delete inquiries (POPIA: retain for dispute resolution, 24 months)
  4. Schedule hard delete for 30 days later (POPIA grace period)
  5. Delete Firebase Storage files: avatars/{uid}/**, vehicles/{uid}/**, parts/{uid}/**
```

#### `onVehicleCreate` — Firestore trigger
```
Trigger:  onDocumentCreated('vehicles/{vehicleId}')
Action:
  1. If status == 'pending_review': send email to admin notification address
  2. Validate required fields (server-side safety net beyond Security Rules)
  3. Increment users/{userId}.listingCount
```

#### `onVehicleUpdate` — Firestore trigger
```
Trigger:  onDocumentUpdated('vehicles/{vehicleId}')
Action:
  1. If status changed to 'active':   email seller "Your listing is live"
  2. If status changed to 'rejected': email seller with rejectionNote
  3. If userDisplayName/userIsVerified changed in /users/{userId}:
     — sync denormalised fields in this listing document (handled by onUserUpdate)
  4. If primaryImageUrl changed: no action needed (already denormalised)
```

#### `onInquiryCreate` — Firestore trigger
```
Trigger:  onDocumentCreated('inquiries/{inquiryId}')
Action:
  1. Read receiver user from /users/{receiverId}
  2. Send email to receiver: inquiry message + link to /dashboard/inquiries
  3. Rate limit check: if sender sent > 5 inquiries in last hour, mark as suspicious + flag
```

#### `onReplyCreate` — Firestore trigger
```
Trigger:  onDocumentCreated('inquiries/{inquiryId}/replies/{replyId}')
Action:
  1. Read parent inquiry to get senderId (original inquiry sender)
  2. If reply senderId != original inquiry senderId: email original sender with reply
  3. Increment inquiries/{inquiryId}.replyCount
```

#### `onImageUpload` — Storage trigger
```
Trigger:  onObjectFinalized (Firebase Storage)
Action:
  1. Check if file is in /vehicles/ or /parts/ path
  2. Download the uploaded file
  3. Resize to max 1200px (width or height, maintain aspect ratio) using sharp
  4. Convert to WebP format (quality: 80)
  5. Upload optimised file back (same path or with .webp extension)
  6. Get download URL
  7. Update corresponding Firestore image document with final URL
  8. If isPrimary: update parent listing's primaryImageUrl
  9. Delete original non-webp file if format was different
```

#### `setUserRole` — Callable function
```
Trigger:  onCall() — requires caller to have role 'admin' or 'super_admin'
Input:    { uid: string, role: UserRole }
Action:
  1. Verify caller has admin custom claim (checked server-side, not client claim)
  2. Set custom claim: admin.auth().setCustomUserClaims(uid, { role })
  3. Update /users/{uid}.role in Firestore
  4. Return success
Security: Enforce that non-admins cannot call this function
```

### 12.3 — Email Templates (via Resend)

All emails are plain-text with HTML for email clients. Templates live in `functions/src/utils/email.ts`.

| Template | Subject | Key Content |
|---|---|---|
| `welcome` | "Welcome to MotorSphere" | Verification link, what to do next |
| `listing-live` | "Your listing is live on MotorSphere" | Listing title, link to listing, view count |
| `listing-rejected` | "Update needed on your MotorSphere listing" | Listing title, rejection reason, edit link |
| `new-inquiry` | "New inquiry on your [Make Model Year]" | Buyer message, reply link, listing link |
| `inquiry-reply` | "[Seller name] replied to your inquiry" | Reply message, listing link |
| `admin-new-listing` | "[ADMIN] New listing pending review" | Listing title, admin review link |

---

## 13. Firebase Emulator Suite Setup

### 13.1 — `firebase.json` (complete)

```json
{
  "firestore": {
    "rules":   "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  },
  "functions": {
    "source":  "functions",
    "runtime": "nodejs20"
  },
  "hosting": {
    "source": ".",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "frameworksBackend": {
      "region": "africa-south1"
    }
  },
  "emulators": {
    "auth": {
      "port": 9099
    },
    "firestore": {
      "port": 8080
    },
    "storage": {
      "port": 9199
    },
    "functions": {
      "port": 5001
    },
    "hosting": {
      "port": 5000
    },
    "ui": {
      "enabled": true,
      "port": 4000
    },
    "singleProjectMode": true
  }
}
```

### 13.2 — Emulator Start Commands

Add to `package.json` (root):

```json
{
  "scripts": {
    "dev":       "next dev",
    "dev:full":  "concurrently \"npm run emulators\" \"npm run dev\"",
    "emulators": "firebase emulators:start --import=./emulator-data --export-on-exit",
    "build":     "next build",
    "lint":      "eslint",
    "typecheck": "tsc --noEmit"
  }
}
```

**Install `concurrently`:**
```bash
npm install -D concurrently
```

**Daily start command:**
```bash
npm run dev:full
# Opens Next.js at localhost:3000
# Opens Firebase Emulator UI at localhost:4000
# Auth emulator at localhost:9099
# Firestore emulator at localhost:8080
# Storage emulator at localhost:9199
# Functions emulator at localhost:5001
```

### 13.3 — Emulator Seed Data

Create `emulator-data/` directory (committed to git, safe test data only):

**Seed user accounts:**
```
admin@test.motorsphere.co.za    password: TestAdmin123!   role: admin
seller@test.motorsphere.co.za   password: TestSeller123!  role: verified_seller
buyer@test.motorsphere.co.za    password: TestBuyer123!   role: user
```

**Seed vehicle listings:**
- 5 active listings (mix of makes, provinces, prices)
- 2 pending_review listings (for admin queue testing)
- 1 sold listing
- 1 draft listing

**Seed parts listings:**
- 3 active parts listings (engine, brakes, suspension categories)

**Load seed data:**
```bash
# First time: start emulators, manually create test data via Emulator UI at localhost:4000
# Then export:
firebase emulators:export ./emulator-data

# Subsequently: start with seed data loaded
firebase emulators:start --import=./emulator-data
```

---

## 14. Deployment Plan (Vercel)

> **Active hosting provider: Vercel.** Firebase handles the full backend (Auth, Firestore, Storage, Security Rules, Cloud Functions). Vercel hosts the Next.js app with GitHub-based auto-deploys and preview deployments.
>
> **Firebase App Hosting** is configured in `apphosting.yaml` (committed to git) but deferred as an alternative — it can be activated at a later stage if the team decides to move to a fully Firebase-native deployment stack.

### 14.1 — `vercel.json` (active)

```json
{
  "framework": "nextjs",
  "regions": ["cpt1"],
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "outputDirectory": ".next"
}
```

> **All environment variables** (both public and server-side) are set in the Vercel Dashboard → Project → Settings → Environment Variables. Cloud Functions still use Firebase Secret Manager for their own runtime secrets.

### 14.2 — Deployment Environments

| Environment | Hosting | Firebase Project | Branch | Purpose |
|---|---|---|---|---|
| **Local** | Firebase Emulator Suite | — (local only) | feature/* branches | Full offline development |
| **Preview** | Vercel preview URL | `motorsphere-staging` | Any PR to `main` | PR review, stakeholder sign-off |
| **Production** | Vercel (motorsphere.co.za) | `motorsphere-prod` | `main` | Live platform, real user data |

> **Two Firebase projects:** Staging and production remain separate Firebase projects — separate Firestore databases, separate Storage buckets, separate Auth users. Vercel environment variables can be scoped to preview vs production, mapping to the correct Firebase project.

### 14.3 — Vercel Deployment Flow

```
Developer pushes to feature branch
  → GitHub Actions CI: lint + typecheck + build
  → If CI passes: PR can be merged

PR opened
  → Vercel auto-creates a preview deployment
  → Unique URL: https://{project-name}-{hash}.vercel.app
  → Useful for stakeholder review before merge

PR merged to main
  → Vercel detects push to main
  → Automatic production deploy begins
  → Build command: npm run build
  → Previous deployment kept for instant rollback
  → Deploy typically completes in 1–3 minutes
```

### 14.4 — Firebase App Hosting (deferred alternative)

> `apphosting.yaml` is committed to the repository and ready. Activate Firebase App Hosting at a later stage if the team decides to replace Vercel with a fully Firebase-native stack.

```yaml
# apphosting.yaml — Firebase App Hosting configuration (DEFERRED)
# Active hosting provider is Vercel (vercel.json)
# Activate this only if switching from Vercel to Firebase App Hosting

runConfig:
  minInstances: 0      # scale to zero when idle
  maxInstances: 10     # cap for cost control during MVP
  concurrency: 80
  cpu: 1
  memoryMiB: 512

env:
  - variable: NEXT_PUBLIC_APP_ENV
    value: production
  - variable: NEXT_PUBLIC_APP_URL
    value: https://motorsphere.co.za
  - variable: NEXT_PUBLIC_USE_FIREBASE_EMULATORS
    value: "false"
  # Secrets managed in Google Cloud Secret Manager:
  - variable: FIREBASE_ADMIN_PRIVATE_KEY
    secret: FIREBASE_ADMIN_PRIVATE_KEY
  - variable: RESEND_API_KEY
    secret: RESEND_API_KEY
```

---

## 15. Environment Variables & Secrets Plan

### 15.1 — Variable Categories

| Category | Where stored | Visibility |
|---|---|---|
| Firebase client config (`NEXT_PUBLIC_FIREBASE_*`) | Vercel Dashboard → Environment Variables / `.env.local` | Public — embedded in client bundle |
| Firebase Admin SDK credentials | Vercel Dashboard → Environment Variables / `.env.local` | Server-side only — NEVER in client bundle |
| Resend API key | Vercel Dashboard → Environment Variables / `.env.local` | Server-side only |
| App config (`NEXT_PUBLIC_APP_*`) | Vercel Dashboard → Environment Variables / `.env.local` | Public |
| Emulator toggle | `.env.local` only | Local dev only — never deployed |

### 15.2 — `.env.local.example` (commit this; never commit `.env.local`)

```env
# ════════════════════════════════════════════════════════════════
# MotorSphere — Local Development Environment Variables
# Copy this file to .env.local and fill in your values
# NEVER commit .env.local to git
# ════════════════════════════════════════════════════════════════

# ─── Firebase Client Config (public) ───────────────────────────
# Get from: Firebase Console → Project Settings → Your apps → Web app
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=   # Optional (Analytics)

# ─── Firebase Admin SDK (server-side only) ──────────────────────
# Get from: Firebase Console → Project Settings → Service accounts → Generate new private key
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
# Note: The private key must be a single-line JSON string with \n for newlines

# ─── Email (Resend) ─────────────────────────────────────────────
# Get from: https://resend.com → API Keys
RESEND_API_KEY=re_

# ─── App Config ─────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_ENV=development

# ─── Local Firebase Emulators ───────────────────────────────────
# Set to true to use local Firebase emulators instead of cloud Firebase
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true
```

### 15.3 — How to Get Firebase Credentials

```
Firebase Client Config:
  Firebase Console → [Select project] → Project Settings (gear icon)
  → General tab → "Your apps" section → Web app → firebaseConfig

Firebase Admin SDK Private Key:
  Firebase Console → [Select project] → Project Settings (gear icon)
  → Service accounts tab → "Firebase Admin SDK" section
  → "Generate new private key" button → download JSON file
  → Extract: project_id, client_email, private_key from the JSON
```

---

## 16. Local Development Workflow

### 16.1 — Day-to-Day Development

```bash
# Start everything with one command
npm run dev:full

# This runs concurrently:
# - Firebase Emulator Suite (with seed data loaded)
# - Next.js dev server

# Access points:
# App:          http://localhost:3000
# Emulator UI:  http://localhost:4000  ← View/edit Firestore, Auth, Storage
# Functions:    http://localhost:5001
```

### 16.2 — Working with the Emulator

```bash
# View Firestore data in the browser
open http://localhost:4000/firestore

# View Auth users
open http://localhost:4000/auth

# View Storage files
open http://localhost:4000/storage

# Export current emulator state (save your test data)
firebase emulators:export ./emulator-data

# Clear emulator data and start fresh
firebase emulators:start  # (without --import flag)

# Test a Cloud Function manually (from a new terminal)
curl -X POST http://localhost:5001/motorsphere-staging/us-central1/myFunction \
  -H "Content-Type: application/json" \
  -d '{"data": {}}'
```

### 16.3 — Working with Cloud Functions

```bash
# Navigate to functions directory
cd functions

# Install dependencies
npm install

# Run TypeScript compiler in watch mode (in functions/)
npm run build:watch

# Functions automatically reload in the emulator when code changes
```

### 16.4 — Deploying Security Rules (Staging)

```bash
# Deploy only rules (fast, no Next.js build)
firebase deploy --only firestore:rules,storage --project staging

# Deploy only indexes
firebase deploy --only firestore:indexes --project staging

# Deploy only functions
firebase deploy --only functions --project staging

# Deploy everything
firebase deploy --project staging
```

### 16.5 — Running Security Rules Tests

```bash
# Install testing library
npm install -D @firebase/rules-unit-testing

# Run tests (from project root)
npm run test:rules

# The test file: tests/firestore.rules.test.ts
# Tests every rule path: anonymous, user, admin, cross-user attempts
```

---

## 17. GitHub Workflow

### 17.1 — Branch Strategy

```
main                        ← Production-ready code only
  └── feature/[name]        ← All feature development
  └── fix/[name]            ← Bug fixes
  └── chore/[name]          ← Tooling, config, dependencies
  └── docs/[name]           ← Documentation only
```

**Rules:**
- No direct commits to `main`
- Every PR requires passing CI checks
- Every PR should reference a Base stage or feature
- Squash-merge PRs to keep `main` history clean

### 17.2 — GitHub Actions CI (`ci.yml`)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    name: Lint, Type Check & Build
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npx tsc --noEmit

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build
        env:
          # Minimal env for build to succeed — not real values
          NEXT_PUBLIC_FIREBASE_API_KEY: build-placeholder
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: build-placeholder.firebaseapp.com
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: build-placeholder
          NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: build-placeholder.appspot.com
          NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "000000000000"
          NEXT_PUBLIC_FIREBASE_APP_ID: 1:000000000000:web:placeholder
          NEXT_PUBLIC_APP_URL: http://localhost:3000
          NEXT_PUBLIC_APP_ENV: test
          NEXT_PUBLIC_USE_FIREBASE_EMULATORS: "false"
          # Admin SDK — use dummy values for build (not used at build time)
          FIREBASE_ADMIN_PROJECT_ID: build-placeholder
          FIREBASE_ADMIN_CLIENT_EMAIL: build@build-placeholder.iam.gserviceaccount.com
          FIREBASE_ADMIN_PRIVATE_KEY: '{"type":"placeholder"}'
          RESEND_API_KEY: re_placeholder

  functions:
    name: Functions Type Check
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: functions/package-lock.json

      - name: Install functions dependencies
        run: cd functions && npm ci

      - name: Type check functions
        run: cd functions && npx tsc --noEmit
```

> **On build-time env vars:** The `next build` command needs `NEXT_PUBLIC_*` vars at build time because Next.js embeds them. Using placeholder strings prevents the build from failing while CI has no real credentials. The actual values are only needed at runtime.

### 17.3 — Commit Message Convention

```
feat: add vehicle listing create form
fix: correct price formatting in ZAR display
chore: install firebase-admin and client SDK
docs: update BASE-3 Firebase architecture plan
refactor: move query logic to lib/firebase/queries
test: add Security Rules unit tests for vehicles
```

---

## 18. Temporary Design Token Scaffold

> ⚠️ **TEMP TOKENS** — These are estimated from Figma screenshots (BASE-2B analysis).
> Replace all values marked `⚠️ TEMP` when exact Figma hex values are confirmed.
> File: `src/app/globals.css`
> Reference: `docs/BASE-2B-FIGMA-SCREEN-MAPPING.md` Section 3 for replacement values.

```css
@import "tailwindcss";

/* ═══════════════════════════════════════════════════════════════
   MotorSphere Design Tokens
   Theme: Dark (default — Figma confirmed dark-first design)
   Status: ⚠️ TEMP values estimated from screenshots
   Action: Replace ⚠️ TEMP values with confirmed Figma hex values
   ════════════════════════════════════════════════════════════════ */

@theme {

  /* ─── Backgrounds ─────────────────────────────────────────────
     ⚠️ TEMP: Estimated from screenshot dark backgrounds          */
  --color-background:         #0A0A0A;   /* ⚠️ TEMP */
  --color-surface:            #141414;   /* ⚠️ TEMP */
  --color-surface-muted:      #1C1C1C;   /* ⚠️ TEMP */
  --color-surface-elevated:   #222222;   /* ⚠️ TEMP */
  --color-header-bg:          #000000;   /* ⚠️ TEMP */

  /* ─── Text ─────────────────────────────────────────────────────
     High confidence — white text on dark confirmed               */
  --color-foreground:         #FFFFFF;
  --color-foreground-muted:   #A0A0A0;   /* ⚠️ TEMP */
  --color-foreground-subtle:  #606060;   /* ⚠️ TEMP */
  --color-foreground-inverse: #0A0A0A;   /* ⚠️ TEMP */

  /* ─── Brand Primary ────────────────────────────────────────────
     ⚠️ TEMP: Blue from "Search" button — exact value TBD         */
  --color-brand-primary:      #1976D2;   /* ⚠️ TEMP */
  --color-brand-primary-hover:#1565C0;   /* ⚠️ TEMP */
  --color-brand-primary-fg:   #FFFFFF;

  /* ─── Ticker / Marquee ─────────────────────────────────────────
     ⚠️ TEMP: Blue marquee strip                                  */
  --color-ticker-bg:          #1565C0;   /* ⚠️ TEMP */
  --color-ticker-fg:          #FFFFFF;
  --color-ticker-star:        #FFD700;   /* ⚠️ TEMP — gold ★ */

  /* ─── Borders ──────────────────────────────────────────────── */
  --color-border:             #2A2A2A;   /* ⚠️ TEMP */
  --color-border-strong:      #3A3A3A;   /* ⚠️ TEMP */
  --color-ring:               #1976D2;   /* ⚠️ TEMP */

  /* ─── Semantic Colours ──────────────────────────────────────── */
  --color-success:            #2E7D32;
  --color-success-bg:         #1A2E1A;
  --color-success-fg:         #81C784;

  --color-warning:            #F57F17;
  --color-warning-bg:         #2A1F0A;
  --color-warning-fg:         #FFB300;

  --color-destructive:        #C62828;
  --color-destructive-bg:     #2A1010;
  --color-destructive-fg:     #FFFFFF;

  --color-info:               #1565C0;
  --color-info-bg:            #0A1A2E;
  --color-info-fg:            #64B5F6;

  /* ─── Listing Status ──────────────────────────────────────────*/
  --color-status-active:      #2E7D32;
  --color-status-pending:     #F57F17;
  --color-status-sold:        #505050;
  --color-status-paused:      #404040;
  --color-status-rejected:    #C62828;
  --color-status-draft:       #404040;

  /* ─── Category Tile Colours ─────────────────────────────────
     ⚠️ ALL TEMP — replace with exact Figma hex values
     Reference: BASE-2B Section 3.1 Category Tile Colours table  */
  --color-tile-vehicle-search:  #1976D2;  /* ⚠️ TEMP */
  --color-tile-trucks:          #1E2D4A;  /* ⚠️ TEMP */
  --color-tile-parts:           #2E7D32;  /* ⚠️ TEMP */
  --color-tile-spares:          #C62828;  /* ⚠️ TEMP */
  --color-tile-tyres:           #37474F;  /* ⚠️ TEMP */
  --color-tile-panelbeaters:    #E65100;  /* ⚠️ TEMP */
  --color-tile-tracking:        #00796B;  /* ⚠️ TEMP */
  --color-tile-dealerships:     #B71C1C;  /* ⚠️ TEMP */
  --color-tile-insurance:       #00695C;  /* ⚠️ TEMP */
  --color-tile-rmi-workshops:   #4527A0;  /* ⚠️ TEMP */
  --color-tile-non-rmi:         #00897B;  /* ⚠️ TEMP */
  --color-tile-towing:          #E65100;  /* ⚠️ TEMP */
  --color-tile-emergency:       #C62828;  /* ⚠️ TEMP */

  /* ─── Typography ────────────────────────────────────────────
     ⚠️ TEMP — font family from layout.tsx (Geist) used as fallback
     Replace --font-sans with confirmed Figma font              */
  --font-sans: var(--font-geist-sans), "Inter", ui-sans-serif, sans-serif; /* ⚠️ TEMP */
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;

  /* ─── Font Sizes ───────────────────────────────────────────── */
  --font-size-xs:    0.75rem;
  --font-size-sm:    0.875rem;
  --font-size-base:  1rem;
  --font-size-lg:    1.125rem;
  --font-size-xl:    1.25rem;
  --font-size-2xl:   1.5rem;
  --font-size-3xl:   1.875rem;
  --font-size-4xl:   2.25rem;
  --font-size-5xl:   3rem;

  /* ─── Radius ──────────────────────────────────────────────────
     ⚠️ TEMP — tile radius estimated ~12-16px from screenshots   */
  --radius-sm:    4px;
  --radius-md:    8px;
  --radius-lg:    12px;   /* ⚠️ TEMP — category tiles */
  --radius-xl:    16px;   /* ⚠️ TEMP */
  --radius-full:  9999px; /* Search bar, pill buttons — confirmed */

  /* ─── Layout ──────────────────────────────────────────────── */
  --header-height:       64px;    /* ⚠️ TEMP */
  --max-width-page:      1280px;
  --spacing-page-x:      1rem;
  --spacing-page-x-md:   1.5rem;
  --spacing-page-x-lg:   2rem;
  --sidebar-width:       240px;
  --admin-sidebar-width: 260px;
}

/* ─── shadcn/ui CSS Variable Aliases ──────────────────────────────────────
   shadcn/ui components reference these specific variable names.
   We alias them to our MotorSphere tokens above.
   Source: BASE-2 Section 6.3                                              */
:root {
  --background:              var(--color-background);
  --foreground:              var(--color-foreground);
  --card:                    var(--color-surface);
  --card-foreground:         var(--color-foreground);
  --popover:                 var(--color-surface-elevated);
  --popover-foreground:      var(--color-foreground);
  --primary:                 var(--color-brand-primary);
  --primary-foreground:      var(--color-brand-primary-fg);
  --secondary:               var(--color-surface-muted);
  --secondary-foreground:    var(--color-foreground);
  --muted:                   var(--color-surface-muted);
  --muted-foreground:        var(--color-foreground-muted);
  --accent:                  var(--color-brand-primary);
  --accent-foreground:       var(--color-brand-primary-fg);
  --destructive:             var(--color-destructive);
  --destructive-foreground:  var(--color-destructive-fg);
  --border:                  var(--color-border);
  --input:                   var(--color-border);
  --ring:                    var(--color-ring);
  --radius:                  var(--radius-lg);
}

/* ─── Base Styles ────────────────────────────────────────────────────────── */
@layer base {
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    -webkit-text-size-adjust: 100%;
    /* Force dark mode — MotorSphere is dark-first */
    color-scheme: dark;
  }

  body {
    background-color: var(--color-background);
    color:            var(--color-foreground);
    font-family:      var(--font-sans);
    font-size:        var(--font-size-base);
    line-height:      1.5;
    min-height:       100dvh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  :focus-visible {
    outline:        2px solid var(--color-ring);
    outline-offset: 2px;
    border-radius:  var(--radius-sm);
  }

  :focus:not(:focus-visible) {
    outline: none;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight:     700;
    line-height:     1.25;
    letter-spacing: -0.025em;
  }

  img, video {
    max-width: 100%;
    height:    auto;
  }

  button {
    cursor: pointer;
  }

  a {
    color:           inherit;
    text-decoration: none;
  }
}

/* ─── Utility Layer ────────────────────────────────────────────────────────*/
@layer utilities {
  /* Responsive page container */
  .page-container {
    width:          100%;
    max-width:      var(--max-width-page);
    margin-inline:  auto;
    padding-inline: var(--spacing-page-x);
  }

  @media (min-width: 768px) {
    .page-container { padding-inline: var(--spacing-page-x-md); }
  }

  @media (min-width: 1024px) {
    .page-container { padding-inline: var(--spacing-page-x-lg); }
  }

  /* ZAR price text style */
  .text-price {
    font-size:      var(--font-size-2xl);
    font-weight:    700;
    letter-spacing: -0.025em;
    color:          var(--color-foreground);
  }

  /* Skeleton pulse animation */
  .skeleton-pulse {
    animation: skeleton-pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    background-color: var(--color-surface-muted);
    border-radius:    var(--radius-md);
  }

  @keyframes skeleton-pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.5; }
  }

  @media (prefers-reduced-motion: reduce) {
    .skeleton-pulse { animation: none; }
  }

  /* Marquee scroll animation */
  .marquee-track {
    animation: marquee-scroll 30s linear infinite;
  }

  .marquee-track:hover,
  .marquee-wrapper:hover .marquee-track {
    animation-play-state: paused;
  }

  @keyframes marquee-scroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  @media (prefers-reduced-motion: reduce) {
    .marquee-track { animation: none; }
  }
}
```

**Update `src/app/layout.tsx` for dark-first mode:**

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MotorSphere — South Africa\'s Automotive Marketplace',
  description: 'Buy and sell vehicles, parts, and accessories across South Africa.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // 'dark' class forces shadcn/ui dark mode — MotorSphere is dark-first
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
```

---

## 19. Risks, Trade-offs & Recommendations

### 19.1 — Firebase-Specific Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Security Rules bug allows data leak** | Low | Critical | Unit-test every rule path with `@firebase/rules-unit-testing`; peer-review rules before production deploy |
| **Firestore read cost spikes** — browse pages fire many reads | Medium | Medium | Pagination (20 items/page); use `limit()` everywhere; monitor reads in Firebase Console |
| **Cold start latency on Cloud Functions** | Medium | Low-Medium | Use 2nd gen Functions with `minInstances: 1` for critical functions (e.g., `onUserCreate`); accept cold start on less-critical paths |
| **Session cookie not refreshed on role change** | Low | Medium | Force token refresh on admin role assignment; add a `/api/auth/refresh` route for this case |
| **Firestore free tier exceeded** | Low (MVP) | Low | Free tier: 50K reads/day, 20K writes/day, 20K deletes/day. At MVP scale this is ample. Set Firebase budget alert at $10/month. |
| **Storage egress costs** | Low (MVP) | Medium | WebP conversion halves image sizes. Firebase CDN cache reduces egress. Monitor in Cloud Console. |
| **Custom claims size limit** | Very Low | Low | Keep claims to `{ role: string }` only — well within 1000 byte limit |

### 19.2 — Architecture Trade-offs

| Decision | Trade-off |
|---|---|
| **Session cookies over ID tokens** | More secure (httpOnly, no JS access), but adds a server round-trip on sign-in. Correct choice for Next.js SSR. |
| **Lightweight middleware (presence check only)** | Simpler Edge Runtime code, but relies on Security Rules for actual enforcement. Correct layered approach. |
| **Denormalised Firestore fields** | Faster reads (no extra document fetch), but adds Cloud Function complexity to keep fields in sync. Accepted trade-off for a marketplace. |
| **No Algolia at MVP** | Firestore indexed queries are sufficient for structured filters. Full-text search not available until Algolia is added. Accepted — document clearly for users. |
| **africa-south1 region** | Best latency for SA users, but some Google Cloud services not available in this region. Evaluate which services are needed before committing. |
| **firebase-admin in Server Components** | Powerful, but requires careful Server/Client Component boundary management. Do not import `firebase-admin` in Client Components. |

### 19.3 — Recommendations

1. **Upgrade to Firebase Blaze plan immediately.** Cloud Functions require Blaze (pay-as-you-go). At MVP scale, costs will be < $5/month. Set a budget alert at $25/month as a safety net.

2. **Use africa-south1 for Firestore and Storage.** The latency improvement for South African users is measurable. Verify Cloud Functions support there before committing.

3. **Write Security Rules tests before writing any feature code.** Rules bugs found in production are a data breach. Tests found in development are a 10-minute fix.

4. **Add a `CLAUDE.md` to the repository root.** This file gives Claude Code context about the project structure, Firebase patterns, naming conventions, and what not to do. It dramatically improves AI-assisted development quality.

5. **Never use `firebase.auth().currentUser` in Server Components.** It doesn't exist server-side. Always use `adminAuth.verifySessionCookie()` in server contexts.

6. **Store timestamps as Firestore `Timestamp` objects, never as strings or numbers.** Use the `Serialized<T>` utility type when passing documents as props to Client Components.

---

## 20. Base 3 Implementation Checklist

> These are the concrete tasks to complete Base 3. Base 3 = the working development environment that all feature Bases depend on.

### 20.1 — Firebase Project Setup

```
[ ] Firebase project created: motorsphere-staging (with Blaze plan)
[ ] Firebase project created: motorsphere-prod (with Blaze plan)
[ ] Firebase Auth enabled on both projects (email/password provider)
[ ] Firestore created on both projects (production mode, africa-south1)
[ ] Firebase Storage enabled on both projects (africa-south1)
[ ] Cloud Functions enabled on both projects
[ ] Vercel project created and linked to GitHub repository (motorsphere-webapp)
[ ] Firebase CLI installed: npm install -g firebase-tools
[ ] firebase login completed
[ ] firebase init completed from project root
[ ] .firebaserc created with staging/prod aliases
[ ] firebase.json created (Section 13.1)
[ ] firestore.rules written (Section 10)
[ ] storage.rules written (Section 11)
[ ] firestore.indexes.json written (Section 8)
[ ] vercel.json configured (Section 14.1 — Vercel deployment config)
[ ] apphosting.yaml created (Section 14.4 — deferred alternative)
```

### 20.2 — Firebase SDK Setup

```
[ ] firebase + firebase-admin packages installed:
    npm install firebase firebase-admin
[ ] src/lib/firebase/client.ts created (Section 3.3)
[ ] src/lib/firebase/admin.ts created (Section 3.3)
[ ] Emulator connection logic in client.ts confirmed working
[ ] NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true in .env.local
[ ] Emulator starts without errors: firebase emulators:start
[ ] Next.js connects to emulator: confirmed in browser console
```

### 20.3 — TypeScript Types

```
[ ] src/types/firestore.types.ts created (Section 6)
[ ] All const enum arrays defined (PROVINCES, VEHICLE_TRANSMISSION, etc.)
[ ] All document interfaces defined (UserDoc, VehicleDoc, PartDoc, etc.)
[ ] Serialized<T> utility type defined
[ ] No TypeScript errors: npx tsc --noEmit
```

### 20.4 — Security Rules Testing

```
[ ] @firebase/rules-unit-testing installed:
    npm install -D @firebase/rules-unit-testing jest ts-jest
[ ] tests/firestore.rules.test.ts created
[ ] Tests cover: anonymous read, user CRUD own data, cross-user access denied,
    admin access, status=active visibility, listing self-approval blocked
[ ] tests/storage.rules.test.ts created
[ ] All Security Rules tests pass against emulator
[ ] Rules deployed to staging: firebase deploy --only firestore:rules,storage --project staging
[ ] Indexes deployed to staging: firebase deploy --only firestore:indexes --project staging
```

### 20.5 — Auth Session Pattern

```
[ ] POST /api/auth/session route created (creates session cookie from ID token)
[ ] DELETE /api/auth/session route created (clears session cookie)
[ ] src/middleware.ts written (Section 3.2)
[ ] Admin layout.tsx Server Component with full verifySessionCookie check
[ ] Manual test: sign in → cookie set → refresh → still logged in → sign out → cookie cleared
[ ] Manual test: accessing /dashboard without session → redirect to /login
[ ] Manual test: accessing /admin without admin claim → redirect to /dashboard
```

### 20.6 — Project Scaffold (Option B deliverables)

```
[ ] Default create-next-app content removed (page.tsx replaced, README.md updated)
[ ] Folder structure created:
    src/components/ui/
    src/components/layout/
    src/components/marketplace/
    src/components/listings/
    src/components/forms/
    src/components/admin/
    src/components/shared/
    src/components/providers/
    src/hooks/
    src/lib/firebase/
    src/lib/validations/
    src/types/
    src/utils/
[ ] src/utils/format.ts created with formatZAR() function
[ ] src/app/layout.tsx updated (dark class, metadata, Section 18)
[ ] src/app/globals.css replaced with TEMP token scaffold (Section 18)
[ ] shadcn/ui initialised: npx shadcn@latest init (Tailwind v4 mode)
[ ] Base shadcn components installed (see BASE-2 Section 6.1 list)
[ ] src/components/providers/ToastProvider.tsx created (Sonner)
[ ] .env.local.example created (Section 15.2)
[ ] .env.local created (fill in staging project values)
[ ] CLAUDE.md created at project root
[ ] README.md updated with full setup instructions
```

### 20.7 — Emulator Seed Data

```
[ ] emulator-data/ directory created
[ ] Seed users created via Emulator UI Auth tab:
    admin@test.motorsphere.co.za    role: admin
    seller@test.motorsphere.co.za   role: verified_seller
    buyer@test.motorsphere.co.za    role: user
[ ] Custom claims set on seed users (via Cloud Function or Admin SDK script)
[ ] Seed Firestore documents created:
    - 5 active vehicle listings (mix of makes/provinces)
    - 2 pending_review vehicle listings
    - 3 active parts listings (different categories)
    - 1 saved listing (for buyer@test user)
[ ] Emulator data exported: firebase emulators:export ./emulator-data
[ ] npm run dev:full confirmed: both Next.js + emulator start together
```

### 20.8 — CI/CD

```
[ ] .github/workflows/ci.yml created (Section 17.2)
[ ] GitHub Actions CI passes on first run (lint + typecheck + build)
[ ] Vercel project created and linked to GitHub repository
[ ] Vercel: auto-deploy enabled for main branch
[ ] Vercel: preview deployments enabled for PRs
[ ] All Firebase environment variables added to Vercel Dashboard → Project → Settings → Environment Variables
[ ] First staging preview deployment confirmed working
```

### 20.9 — Cloud Functions (Scaffold)

```
[ ] functions/src/index.ts created (exports placeholder)
[ ] functions/src/utils/email.ts created (Resend helper stub)
[ ] functions/src/auth/onUserCreate.ts scaffold created
[ ] functions/src/listings/onVehicleCreate.ts scaffold created
[ ] functions can build without errors: cd functions && npx tsc --noEmit
[ ] Functions deploy to staging emulator without errors
```

### 20.10 — Documentation

```
[ ] BASE-3-FIREBASE-ARCHITECTURE.md committed ✅ (this document)
[ ] CLAUDE.md created and committed
[ ] .env.local.example committed
[ ] README.md fully updated
[ ] BASE-4 planning begun (vehicle listings spec)
```

---

## Document Control

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-05-27 | MotorSphere Team | Initial BASE 3 document — Firebase architecture, implementation-ready spec, Option B recommendation, TEMP design tokens |
| 1.1 | 2026-05-27 | MotorSphere Team | Deployment configuration updated. Section 14 replaced with active hosting plan. Section 15 env var storage updated. Section 20.8 CI/CD checklist updated. Services table updated. Final hosting provider: Vercel (see vercel.json). |

---

*All `⚠️ TEMP` values in Section 18 are estimated from Figma screenshots. Replace with confirmed Figma hex values when available. Everything else in this document is implementation-ready.*
