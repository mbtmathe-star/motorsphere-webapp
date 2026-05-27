# MotorSphere — BASE 4: Environment Setup Checklist

> **Stage:** Base 4 — Pre-Development Environment Setup
> **Date:** 2026-05-27
> **Status:** Active Checklist — complete all items before writing feature code
> **Depends on:** [BASE-3-FIREBASE-ARCHITECTURE.md](./BASE-3-FIREBASE-ARCHITECTURE.md)
> **Next Stage:** Base 4 — Vehicle Listings (feature code begins)

---

> ### Purpose
>
> This checklist separates **one-time setup tasks** from **feature development**. Every item here must be completed and verified before any Base 4 feature code is written. Items are grouped by who/what performs them so nothing falls between the cracks.

---

## Table of Contents

1. [Claude Code Tasks (already done)](#1-claude-code-tasks-already-done)
2. [Firebase Console Tasks](#2-firebase-console-tasks)
3. [Firebase Storage Tasks](#3-firebase-storage-tasks)
4. [Firebase App Hosting Tasks (deferred)](#4-firebase-app-hosting-tasks-deferred)
5. [Environment Variable Checklist](#5-environment-variable-checklist)
6. [Local Emulator Verification](#6-local-emulator-verification)
7. [Security Warnings — What Never to Expose](#7-security-warnings--what-never-to-expose)

---

## 1. Claude Code Tasks (already done)

These were completed during Base 3 scaffold (2026-05-27). Verify each file exists.

### 1.1 — Project Scaffold
- [x] `src/app/layout.tsx` — dark mode forced (`<html className="dark">`), MotorSphere metadata
- [x] `src/app/globals.css` — Tailwind v4 `@theme {}` design tokens (⚠️ TEMP values — confirm from Figma)
- [x] `src/proxy.ts` — Next.js 16 routing guard (exported as `proxy`, not `middleware`)
- [x] `src/app/api/auth/session/route.ts` — POST (create cookie) + DELETE (sign out)
- [x] `src/app/(admin)/layout.tsx` — Server Component with `verifySessionCookie` + role check

### 1.2 — Firebase SDK
- [x] `src/lib/firebase/client.ts` — Auth + Firestore + Storage client SDK, emulator connections
- [x] `src/lib/firebase/admin.ts` — Lazy factory functions: `getAdminAuth()`, `getAdminDb()`, `getAdminStorage()`

### 1.3 — Types and Utilities
- [x] `src/types/firestore.types.ts` — All 7 collection interfaces + `Serialized<T>`
- [x] `src/utils/format.ts` — `formatZAR()`, `formatMileage()`, `formatDate()`, etc.
- [x] `src/lib/utils.ts` — shadcn `cn()` utility

### 1.4 — Firebase Config Files
- [x] `firestore.rules` — Complete MVP Firestore Security Rules
- [x] `storage.rules` — Complete MVP Storage Security Rules (public listing images, private verification docs)
- [x] `firestore.indexes.json` — 17 composite indexes (strict JSON — no comments)
- [x] `firebase.json` — Emulator ports: Auth 9099, Firestore 8080, Storage 9199, Functions 5001, UI 4000
- [x] `.firebaserc` — staging + prod project aliases
- [x] `apphosting.yaml` — Firebase App Hosting config (committed, deployment deferred)

### 1.5 — Cloud Functions Scaffold
- [x] `functions/src/index.ts` — exports onUserCreate, onUserDelete, onVehicleCreate
- [x] `functions/src/auth/onUserCreate.ts` — creates user doc + sets role claim
- [x] `functions/src/auth/onUserDelete.ts` — POPIA-compliant soft delete
- [x] `functions/src/listings/onVehicleCreate.ts` — validates listing, notifies admin
- [x] `functions/src/utils/email.ts` — Resend email helper stub
- [x] `functions/package.json` + `functions/tsconfig.json`

### 1.6 — Dev Config
- [x] `.env.local.example` — all env var keys documented
- [x] `CLAUDE.md` — AI development context
- [x] `.github/workflows/ci.yml` — lint + typecheck + build + functions typecheck
- [x] `apphosting.yaml` — Firebase App Hosting config (committed, deployment deferred to Base 8)
- [x] `tsconfig.json` — `"exclude": ["functions"]` to prevent root typecheck picking up functions/
- [x] `package.json` — `dev`, `dev:full`, `emulators`, `build`, `lint`, `typecheck` scripts

### 1.7 — Verification
- [x] `npx tsc --noEmit` — passes with zero errors
- [x] `npm run build` — clean build, no errors

---

## 2. Firebase Console Tasks

> Complete for **both** projects: `motorsphere-staging` and `motorsphere-prod`

### 2.1 — Project Creation
- [ ] Firebase project created: `motorsphere-staging`
- [ ] Firebase project created: `motorsphere-prod`
- [ ] Blaze (pay-as-you-go) billing plan enabled on **both** projects
  - Blaze is required for: Cloud Functions (deployed), Firebase Storage (beyond free tier)
  - Local Emulator development does NOT require Blaze

### 2.2 — Firebase Authentication
- [ ] Email/Password provider enabled
  - Go to: Firebase Console → Authentication → Sign-in method → Email/Password → Enable
- [ ] Email enumeration protection enabled (prevents user enumeration attacks)
  - Go to: Firebase Console → Authentication → Settings → User actions → Enable email enumeration protection
- [ ] Minimum password length set to 8 characters
  - Go to: Firebase Console → Authentication → Settings → Password policy
- [ ] ❌ Google OAuth — do NOT enable yet (Phase 1b)
- [ ] ❌ Phone Auth — do NOT enable (not used at MVP)

### 2.3 — Firestore Database
- [ ] Default Firestore database created (do NOT create named databases)
  - Go to: Firebase Console → Firestore Database → Create database
  - Select: Start in **production mode** (rules deployed manually)
  - Region: **africa-south1** (Johannesburg) — lowest latency for SA users
- [ ] Firestore Security Rules deployed from `firestore.rules`:
  ```bash
  firebase deploy --only firestore:rules --project staging
  ```
- [ ] Composite indexes deployed from `firestore.indexes.json`:
  ```bash
  firebase deploy --only firestore:indexes --project staging
  ```

### 2.4 — Firebase CLI Setup
- [ ] Firebase CLI installed globally:
  ```bash
  npm install -g firebase-tools
  ```
- [ ] Firebase login completed:
  ```bash
  firebase login
  ```
- [ ] Default project confirmed as motorsphere-staging:
  ```bash
  firebase use staging
  firebase projects:list  # verify motorsphere-staging shows as current
  ```

### 2.5 — Service Account (Admin SDK)
- [ ] Admin SDK private key generated for `motorsphere-staging`:
  - Firebase Console → Project Settings → Service accounts → Generate new private key
  - Download the JSON file
  - Extract: `project_id`, `client_email`, `private_key`
  - Copy values into `.env.local` (see Section 5)
  - **Delete the downloaded JSON file immediately after copying values**

---

## 3. Firebase Storage Tasks

### 3.1 — Enable Storage
- [ ] Firebase Storage enabled in `motorsphere-staging`:
  - Firebase Console → Storage → Get started
  - Start in **production mode** (rules deployed manually)
  - Location: **africa-south1** (same as Firestore)
- [ ] Firebase Storage enabled in `motorsphere-prod` (when ready for production)

### 3.2 — Deploy Storage Rules
- [ ] Storage Security Rules deployed from `storage.rules`:
  ```bash
  firebase deploy --only storage --project staging
  ```
- [ ] Verify rules are live:
  - Firebase Console → Storage → Rules tab → confirm rules match `storage.rules`

### 3.3 — Upload Limits (configured in `storage.rules`)
The following limits are enforced in `storage.rules` — verify they are correct:

| Type | Max File Size | Max Count | Path |
|---|---|---|---|
| Vehicle image | 5MB | 20 per listing | `vehicles/{uid}/{vehicleId}/{n}.*` |
| Parts image | 5MB | 10 per listing | `parts/{uid}/{partId}/{n}.*` |
| Avatar | 2MB | 1 per user | `avatars/{uid}/avatar.*` |
| Verification doc | 10MB | 5 per user | `admin/{uid}/verify/{n}` — Phase 2 |

### 3.4 — Image Compression (Cloud Function — deferred)
Image compression (resize to max 1200px + WebP conversion) will be done by `onImageUpload` Cloud Function. Until Cloud Functions are deployed, upload raw images — they will be processed retroactively when the function is deployed.

### 3.5 — Emulator Storage
- [ ] Storage emulator confirmed working locally:
  ```bash
  npm run emulators
  # Go to http://localhost:4000/storage and verify Storage tab appears
  ```

---

## 4. Firebase App Hosting Tasks (deferred)

> **These tasks are NOT required before Base 4 feature development.** App Hosting is set up when the app is ready for public deployment (Base 8 readiness check). Complete the checklist items below when that time comes.

### 4.1 — When to Activate
App Hosting should be activated when:
- [ ] All Core user journeys are working in the emulator
- [ ] Security Rules have been tested with `@firebase/rules-unit-testing`
- [ ] `npm run build` produces a clean build
- [ ] All environment variables are confirmed and available

### 4.2 — Setup Steps (when ready)
- [ ] Firebase App Hosting backend created in Firebase Console for `motorsphere-staging`
- [ ] GitHub repository connected to Firebase App Hosting
- [ ] `apphosting.yaml` is already committed — review minInstances/maxInstances settings
- [ ] Live branch set to `main`
- [ ] All secrets added to Google Cloud Secret Manager (see Section 5)
- [ ] Custom domain `motorsphere.co.za` configured in Firebase App Hosting DNS
- [ ] Preview deployments confirmed working on PR branches
- [ ] Same setup repeated for `motorsphere-prod`

---

## 5. Environment Variable Checklist

### 5.1 — Variables Required for Local Development (`.env.local`)

Copy `.env.local.example` to `.env.local` and fill in all values:

```bash
cp .env.local.example .env.local
```

| Variable | Where to Get It | Required? |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Console → Project Settings → Web app config | ✅ |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Console → Project Settings → Web app config | ✅ |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Console → Project Settings → Web app config | ✅ |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Console → Project Settings → Web app config | ✅ |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Console → Project Settings → Web app config | ✅ |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase Console → Project Settings → Web app config | ✅ |
| `FIREBASE_ADMIN_PROJECT_ID` | Same as `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ✅ |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Service account JSON → `client_email` field | ✅ |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Service account JSON → `private_key` field | ✅ |
| `RESEND_API_KEY` | resend.com → API Keys | ✅ |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` for local dev | ✅ |
| `NEXT_PUBLIC_APP_ENV` | `development` | ✅ |
| `NEXT_PUBLIC_USE_FIREBASE_EMULATORS` | `true` (use emulators locally) | ✅ |

### 5.2 — `FIREBASE_ADMIN_PRIVATE_KEY` Format

The private key from the downloaded JSON contains literal `\n` characters for newlines. In `.env.local`, paste it in one of these two ways:

**Option A — quoted with literal `\n`:**
```env
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
```

**Option B — multi-line with actual newlines (in `.env.local` only):**
```env
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBg...
-----END PRIVATE KEY-----
"
```

The `admin.ts` factory function handles both: `process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(/\\n/g, '\n')`.

### 5.3 — Verify `.env.local` Is Working

```bash
# Start the dev server — it should connect to the emulator without errors
npm run dev:full

# In the browser:
# 1. Go to http://localhost:4000 — Emulator UI should load
# 2. Go to http://localhost:3000 — App should load without console errors
```

### 5.4 — Variables for Production (Firebase App Hosting)

When App Hosting is activated (Section 4), add these to **Google Cloud Secret Manager** for each project:

- `FIREBASE_ADMIN_PRIVATE_KEY` — the full private key (paste with literal `\n`)
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_PROJECT_ID`
- `RESEND_API_KEY`

Public vars (`NEXT_PUBLIC_*`) go in the Firebase App Hosting console environment config (not Secret Manager — they are not sensitive).

---

## 6. Local Emulator Verification

> Run through this checklist after `.env.local` is filled in. Do not start Base 4 feature code until these pass.

### 6.1 — Start and Check Emulators

```bash
npm run dev:full
```

- [ ] Terminal shows no errors — emulators start successfully
- [ ] Emulator UI loads: http://localhost:4000
- [ ] Auth tab visible at http://localhost:4000/auth
- [ ] Firestore tab visible at http://localhost:4000/firestore
- [ ] Storage tab visible at http://localhost:4000/storage
- [ ] Functions tab visible at http://localhost:4000/functions (may show no functions until Cloud Functions are deployed)

### 6.2 — Create Test Users in Emulator Auth

```
admin@test.motorsphere.co.za    password: TestAdmin123!    role: admin
seller@test.motorsphere.co.za   password: TestSeller123!   role: verified_seller
buyer@test.motorsphere.co.za    password: TestBuyer123!    role: user
```

- [ ] Three test users created via Emulator UI → Authentication tab
- [ ] Custom claims set for each user (manually for now — Cloud Functions will automate this):
  - Go to Emulator UI → Auth → click user → "Edit" → add custom claim `{ "role": "admin" }`
- [ ] User documents exist in Firestore `/users/{uid}` for each test user (create manually if onUserCreate function not deployed)

### 6.3 — Seed Vehicle Listings

Create in Emulator UI → Firestore:

```
/vehicles/{auto-id}:
  status: "active"
  userId: {sellerId from Auth}
  userDisplayName: "Test Seller"
  make: "Toyota"
  model: "Hilux"
  year: 2022
  price: 45000000   ← R450 000 in ZAR cents
  province: "Gauteng"
  description: "Test listing"
  primaryImageUrl: null
  imageCount: 0
  featured: false
  viewsCount: 0
  negotiable: true
  createdAt: {server timestamp}
  updatedAt: {server timestamp}
  publishedAt: {server timestamp}
```

- [ ] At least 2 active vehicle listings seeded
- [ ] 1 pending_review listing seeded (for admin queue testing)
- [ ] Export seed data after creation:
  ```bash
  firebase emulators:export ./emulator-data
  ```

### 6.4 — Typecheck and Build

```bash
npx tsc --noEmit   # must show zero errors
npm run build      # must complete with no errors
npm run lint       # must show zero lint errors
```

- [ ] All three commands pass

---

## 7. Security Warnings — What Never to Expose Publicly

### 7.1 — Files That Must Never Be Committed to Git

| File | Why |
|---|---|
| `.env.local` | Contains Firebase Admin private key and Resend API key |
| `*.json` downloaded from Firebase (service account) | Contains the raw private key — delete after extracting values |
| `emulator-data/auth_export/` | Contains emulator user tokens (safe for test data, but avoid real passwords) |

Verify `.gitignore` contains:
```
.env.local
.env*.local
*.pem
service-account*.json
```

### 7.2 — Variables That Must Never Reach the Client Bundle

| Variable | Risk if Exposed |
|---|---|
| `FIREBASE_ADMIN_PRIVATE_KEY` | Full admin access to all Firebase data — catastrophic |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Identifies the service account — low risk alone, but paired with key is dangerous |
| `RESEND_API_KEY` | Attacker can send emails from your domain |

**Rule:** Any variable WITHOUT the `NEXT_PUBLIC_` prefix is server-side only. Next.js does NOT include it in the client bundle. Never manually reference these in `"use client"` components.

### 7.3 — Firebase Admin SDK in Client Components

```typescript
// ❌ NEVER do this in any "use client" component:
import { getAdminAuth } from '@/lib/firebase/admin';   // Node.js API — will crash in browser

// ✅ Client components use the client SDK only:
import { auth, db, storage } from '@/lib/firebase/client';
```

### 7.4 — Firestore Default Database

- [ ] Only the **default** Firestore database is used — identified as `(default)` in the Firebase Console
- [ ] No named databases have been created
- [ ] All `getAdminDb()` calls connect to the default database automatically (no explicit database name needed)

### 7.5 — Security Rules Are the Real Security Boundary

| Layer | What It Does | Is It a Security Boundary? |
|---|---|---|
| `proxy.ts` (Edge) | Redirects unauthenticated users away from protected routes | ❌ UX guard only — can be bypassed |
| Server Component layouts | Verifies session cookie cryptographically | ⚠️ Yes, for this page render |
| **Firebase Security Rules** | Enforced on every Firebase read/write, regardless of what code does | ✅ **YES — this is the actual security boundary** |

Do not rely on `proxy.ts` or Server Components as the sole security mechanism. Security Rules must be correct and emulator-tested.

### 7.6 — Storage Rules for Private Documents

The `/admin/{userId}/verify/` storage path is private — only the owner and admins can read it. This path is reserved for Phase 2 seller verification documents. Do not store sensitive documents in public paths (`/vehicles/`, `/parts/`, `/avatars/`).

---

## Document Control

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-05-27 | MotorSphere Team | Initial BASE 4 setup checklist. Full Firebase stack (Auth + Firestore + Storage + App Hosting deferred). Separated Claude Code tasks, Firebase Console tasks, Storage tasks, App Hosting (deferred), env var checklist, emulator verification, and security warnings. |

---

*Complete every non-deferred item in this checklist before writing any Base 4 (Vehicle Listings) feature code. The emulator must be running, the seed data must be loaded, and the typecheck + build must pass.*
