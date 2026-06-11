# MotorSphere — Claude Code Context

This file gives Claude Code project context for AI-assisted development.
Read this before suggesting code changes.

---

## Project Overview

**MotorSphere** is a South African automotive marketplace built with:
- Next.js 16.x App Router, React 19, TypeScript 5 (strict mode)
- Tailwind CSS v4 (CSS-first — `@theme {}` in globals.css — NO `tailwind.config.ts`)
- shadcn/ui (component copies, dark theme, Tailwind v4 mode)
- Firebase (Auth + Firestore + Storage + Security Rules + Functions — backend only)
- Vercel (hosting/deployment — GitHub integration, Cape Town region `cpt1`, preview deployments)

**Repo:** https://github.com/mbtmathe-star/motorsphere-webapp
**Stage docs:** `docs/` directory — read the relevant BASE doc before making changes.

---

## Critical Rules

### Firebase
- **Client SDK** (`src/lib/firebase/client.ts`): Client Components (`"use client"`) only
- **Admin SDK** (`src/lib/firebase/admin.ts`): Server Components, API routes only
- **NEVER** import `firebase-admin` in client components — it uses Node.js APIs
- **NEVER** use `firebase.auth().currentUser` in Server Components — it doesn't exist server-side
- Admin SDK API: use **factory functions** (lazy init — prevents build-time failures):
  ```typescript
  import { getAdminAuth, getAdminDb, getAdminStorage } from '@/lib/firebase/admin';
  const decoded = await getAdminAuth().verifySessionCookie(session, true);
  const snap    = await getAdminDb().collection('vehicles').get();
  ```
- Proxy (`src/proxy.ts`): Next.js 16 renamed `middleware.ts` → `proxy.ts`, export `proxy` (not `middleware`)

### Pricing
- **All prices stored as ZAR cents (integer)**: R 150 000 = `15000000`
- **Display**: use `formatZAR(cents)` from `src/utils/format.ts`
- **Format**: `R 150 000` (space separator, no comma — South African standard)

### Timestamps
- Store as Firestore `Timestamp` objects, NOT strings or numbers
- At Server Component → Client Component boundary: convert to ISO strings
- Use `Serialized<T>` from `src/types/firestore.types.ts`

### Design Tokens
- Dark theme ONLY — `<html className="dark">` forced in layout.tsx
- All tokens in `src/app/globals.css` under `@theme {}`
- ⚠️ All values marked `⚠️ TEMP` need Figma confirmation before going live
- shadcn/ui CSS variables are aliased to MotorSphere tokens in `:root {}` block

### Tailwind v4
- **NO `tailwind.config.ts`** — this is v4, CSS-first configuration
- Custom tokens go in `src/app/globals.css` `@theme {}` block
- Utilities go in `@layer utilities {}` in globals.css

---

## Security Architecture

```
Layer 1: middleware.ts (Edge)       — UX guard, presence check only
Layer 2: Server Component layouts   — cryptographic verifySessionCookie()
Layer 3: Firebase Security Rules    — ACTUAL security boundary (cannot bypass)
```

Do NOT treat middleware as a security boundary. Security Rules enforce on every
Firebase read/write regardless of what any Next.js code does.

---

## Folder Structure

```
src/
├── app/
│   ├── (admin)/          ← Admin panel routes — role verified in layout
│   ├── (auth)/           ← Login, register, forgot-password
│   ├── (dashboard)/      ← Authenticated user routes
│   ├── (marketplace)/    ← Public vehicle/parts browsing
│   ├── api/
│   │   └── auth/session/ ← POST (create cookie) + DELETE (clear cookie)
│   ├── globals.css        ← Tailwind v4 @theme tokens — ALL tokens here
│   └── layout.tsx         ← Root layout (dark class, metadata)
├── components/
│   ├── ui/               ← shadcn/ui component copies (do not edit internals)
│   ├── layout/           ← Header, Footer, Sidebar, SiteShell
│   ├── marketplace/      ← Category tiles, search bar, marquee ticker
│   ├── listings/         ← Vehicle card, parts card, listing detail
│   ├── forms/            ← Create listing, inquiry, filter forms
│   ├── admin/            ← Moderation queue, flag review, role management
│   ├── shared/           ← Badge, avatar, price display, image gallery
│   └── providers/        ← ToastProvider, AuthProvider (client wrappers)
├── hooks/                ← useAuth, useSavedListings, useInquiries
├── lib/
│   ├── firebase/
│   │   ├── client.ts     ← Client SDK (Client Components only)
│   │   ├── admin.ts      ← Admin SDK (Server Components only)
│   │   └── queries/      ← Typed Firestore query helpers
│   └── validations/      ← Zod schemas for forms
├── middleware.ts          ← Edge Runtime routing guard
├── types/
│   └── firestore.types.ts ← All Firestore document interfaces
└── utils/
    └── format.ts          ← formatZAR, formatMileage, formatDate, etc.

functions/                 ← Cloud Functions (Node.js, firebase-admin)
├── src/
│   ├── index.ts           ← Exports all functions
│   ├── auth/              ← onUserCreate, onUserDelete
│   ├── listings/          ← onVehicleCreate, onVehicleUpdate, onPartsCreate
│   ├── inquiries/         ← onInquiryCreate, onReplyCreate
│   ├── storage/           ← onImageUpload (resize + WebP)
│   ├── callables/         ← setUserRole, verifyUser, suspendUser, incrementViewCount
│   └── utils/             ← email.ts, timestamps.ts, validation.ts
```

---

## Firestore Collections

```
/users/{uid}
/vehicles/{vehicleId}
  └── /images/{imageId}
/parts/{partId}
  └── /images/{imageId}
/inquiries/{inquiryId}
  └── /replies/{replyId}
/savedListings/{savedId}
/adminFlags/{flagId}
```

See `src/types/firestore.types.ts` for full document shapes.

---

## User Roles (Custom Claims)

| Role | Claim | Access |
|---|---|---|
| `user` | `{ role: 'user' }` | Default — can list, inquire, save |
| `verified_seller` | `{ role: 'verified_seller' }` | Higher limits, verified badge |
| `admin` | `{ role: 'admin' }` | Full moderation |
| `super_admin` | `{ role: 'super_admin' }` | Platform configuration |

Claims checked in Security Rules as: `request.auth.token.role`
Claims checked in Server Components as: `decoded.role` from `verifySessionCookie()`

---

## Emulator Setup

```bash
npm run dev:full         # Start both Next.js + Firebase Emulator
npm run dev              # Next.js only (no emulator)
npm run emulators        # Emulator only

# Access points:
# App:          http://localhost:3000
# Emulator UI:  http://localhost:4000
# Auth:         http://localhost:9099
# Firestore:    http://localhost:8080
# Storage:      http://localhost:9199
# Functions:    http://localhost:5001
```

Emulator toggle: `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true` in `.env.local`

---

## Build Stages

| Stage | Status | Doc |
|---|---|---|
| BASE 1 | ✅ Complete | docs/BASE-1-PRODUCT-FOUNDATION.md |
| BASE 2 | ✅ Complete | docs/BASE-2-UX-FIGMA-MAPPING.md |
| BASE 2B | ✅ Complete | docs/BASE-2B-FIGMA-SCREEN-MAPPING.md |
| BASE 3 | ✅ Complete | docs/BASE-3-FIREBASE-ARCHITECTURE.md |
| BASE 6A | ✅ Complete | Real Firebase Auth + user profiles |
| BASE 6B | 🔲 Next | Role onboarding + verification status |
| BASE 6C | ⏳ Pending | Listing creation + approval workflow |
| BASE 6D | ⏳ Pending | Inquiries + saved listings |
| BASE 6E | ⏳ Pending | Admin moderation panel |
| BASE 7 | ⏳ Pending | Firebase Storage uploads |
| BASE 8 | ⏳ Pending | Packages + subscription planning UI |
| BASE 9 | ⏳ Pending | PayFast integration |

---

## POPIA Compliance Notes

- South African POPIA compliance required
- Data deletion: 30-day grace period after account deletion (Cloud Function scheduled)
- Inquiries retained 24 months after account deletion (dispute resolution)
- Consent: required before data collection — implement before Base 8
- Information Officer: TBD — do not block development on this
- Privacy Policy: required before launch

---

## Deployment — Vercel

- Active hosting: **Vercel** — `vercel.json` in repo root
- Region: `cpt1` (Cape Town, South Africa) — lowest latency for SA users
- Build command: `npm run build` (unchanged — Vercel auto-detects Next.js)
- GitHub → Vercel: push to `main` → auto production deploy; any PR → preview deployment
- Environment variables: set in **Vercel Dashboard → Project → Settings → Environment Variables**
- `NEXT_PUBLIC_USE_FIREBASE_EMULATORS` must be `false` in Vercel
- `FIREBASE_ADMIN_PRIVATE_KEY`: paste the full key with literal `\n` for newlines
- `NEXT_PUBLIC_APP_URL`: set to the final Vercel production domain (or custom domain `motorsphere.co.za`)
- PayFast webhook URLs (Base 9+): must use the final Vercel production domain — not a preview URL
- `apphosting.yaml` is committed but deferred (Firebase App Hosting — not active)

## What Not To Do

- ❌ Do NOT import `firebase-admin` in any `"use client"` component
- ❌ Do NOT store prices as floats (use ZAR cents integers)
- ❌ Do NOT store Timestamps as strings or numbers in Firestore
- ❌ Do NOT commit `.env.local` to git
- ❌ Do NOT expose `FIREBASE_ADMIN_PRIVATE_KEY` to client code
- ❌ Do NOT treat middleware as a security boundary
- ❌ Do NOT add `tailwind.config.ts` (Tailwind v4 is CSS-first)
- ❌ Do NOT add light mode variants at MVP (dark theme only)
- ❌ Do NOT skip emulator testing for Security Rules changes
