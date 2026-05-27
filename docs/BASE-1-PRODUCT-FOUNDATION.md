# MotorSphere — BASE 1: Product Foundation

> **Stage:** Base 1 — Product Foundation & Architecture Direction
> **Date:** 2026-05-27
> **Status:** Active Planning Document — Firebase pivot applied 2026-05-27
> **Next Stage:** Base 2 — Design System & Component Architecture

---

> ### ⚡ Stack Pivot Note — Supabase → Firebase (2026-05-27)
>
> **Original stack:** Supabase (PostgreSQL + Auth + Storage + RLS + Edge Functions)
>
> **New stack:** Firebase (Firebase Auth + Cloud Firestore + Firebase Storage + Security Rules + Cloud Functions) + Netlify (hosting/deployment)
>
> **Why the change:**
> The team chose Firebase as the backend platform on the Blaze (pay-as-you-go) plan. Firebase provides a tightly integrated, Google-managed ecosystem — Auth, Firestore, Storage, Security Rules, Cloud Functions — all working together natively under a single Firebase project config. The Firebase SDK is first-class in Next.js, the Admin SDK is mature, and the Firebase Emulator Suite enables full offline-local development without Docker. Netlify hosts the Next.js app with GitHub-based auto-deploys and preview deployments.
>
> **Architectural consequence:**
> This is no longer a relational Postgres/RLS app. The data layer is **Cloud Firestore** — a NoSQL document database. All schema planning has been reworked as Firestore collections, document shapes, composite indexes, and Security Rules. Cloud Functions replaces Supabase Edge Functions for backend logic and email triggers. Firebase Storage handles all file uploads. All Supabase-specific references in this document have been replaced.
>
> **What does not change:** Next.js App Router, TypeScript, Tailwind CSS v4, shadcn/ui, GitHub, Resend (email), POPIA obligations, all product decisions, user journeys, and feature scope.

---

## Table of Contents

1. [Product Summary](#1-product-summary)
2. [Problem Statement](#2-problem-statement)
3. [Target Users](#3-target-users)
4. [Core User Roles](#4-core-user-roles)
5. [MVP Scope](#5-mvp-scope)
6. [Out-of-Scope for MVP](#6-out-of-scope-for-mvp)
7. [Core User Journeys](#7-core-user-journeys)
8. [Feature Modules](#8-feature-modules)
9. [Figma Design Handoff Plan](#9-figma-design-handoff-plan)
10. [Recommended Tech Stack](#10-recommended-tech-stack)
11. [Firebase Planning](#11-firebase-planning)
12. [Security & POPIA Planning](#12-security--popia-planning)
13. [Deployment Planning](#13-deployment-planning)
14. [Risks & Assumptions](#14-risks--assumptions)
15. [Phase 1 Build Checklist](#15-phase-1-build-checklist)

---

## 1. Product Summary

**MotorSphere** is a South African automotive ecosystem platform that brings together vehicle buyers and sellers, parts and accessories traders, workshops, insurance providers, and logistics operators under one roof.

Unlike single-category classified sites, MotorSphere is designed as an interconnected marketplace — a vehicle listing can link directly to relevant parts, nearby workshops, insurance quotes, and delivery options. Each category reinforces the others, creating compounding network value over time.

**Vision:** The go-to digital destination for everything automotive in South Africa.

**MVP Positioning:** A focused, trust-first vehicle and parts marketplace with verified profiles, structured listings, and human-assisted admin moderation — before opening up to workshops, insurance, and logistics integrations.

---

## 2. Problem Statement

### The South African Automotive Market Gap

South African buyers and sellers of vehicles and parts currently navigate a fragmented landscape:

| Pain Point | Current Reality |
|---|---|
| **Fragmented marketplaces** | AutoTrader for cars, OLX for parts, Facebook Marketplace for informal deals — no unified platform |
| **Trust deficit** | Scams, misrepresented vehicles, unverified sellers are common on open classifieds |
| **No ecosystem continuity** | After buying a car, the user leaves the platform entirely to find parts, insurance, or a workshop |
| **Poor mobile experience** | Existing platforms have outdated UIs with poor mobile performance |
| **No structured parts taxonomy** | Parts listings are unstructured, making it hard to find the right fitment for a specific vehicle |
| **Payment & logistics friction** | No integrated path from listing to payment to delivery for parts |
| **POPIA non-compliance risk** | Many platforms store personal data carelessly; South African users are increasingly aware of their rights |

### Opportunity
A modern, mobile-first, trust-anchored platform that starts with vehicles and parts, then grows into a full automotive ecosystem, can capture significant share from fragmented legacy competitors.

---

## 3. Target Users

### Primary Users (MVP Focus)

| Segment | Description | Motivation |
|---|---|---|
| **Private Vehicle Sellers** | Individuals selling 1–3 vehicles | Get fair price, reach serious buyers, avoid scams |
| **Private Vehicle Buyers** | Individuals actively shopping for a used vehicle | Find trustworthy listings, compare easily, get financing info |
| **Parts Sellers** | Individuals and small businesses selling new or used parts | Reach targeted buyers, move stock efficiently |
| **Parts Buyers** | DIY mechanics, car owners, workshops | Find the right part for their specific vehicle, compare prices |

### Secondary Users (Post-MVP, Phase 2+)

| Segment | Notes |
|---|---|
| **Dealerships** | Bulk listing tools, subscription tiers, lead management |
| **Workshop Owners** | Service listings, booking management, reviews |
| **Insurance Brokers** | Quote integration tied to vehicle listings |
| **Logistics Providers** | Delivery quoting for parts purchases |
| **Fleet Operators** | Bulk vehicle management tools |

### User Demographics (South Africa Context)
- Primary language: English, with Afrikaans and Zulu content considerations for Phase 2
- Device: Mobile-first (60–70% expected mobile traffic based on SA market data)
- Payment familiarity: PayFast, EFT, SnapScan common; card payments growing
- Location: All 9 provinces, with Gauteng, Western Cape, and KZN being highest automotive market density

---

## 4. Core User Roles

### Role Matrix

| Role | Short Name | Description | Access Level |
|---|---|---|---|
| **Unauthenticated Visitor** | `guest` | Browsing only — can view public listings, search, and filter | Read-only, public listings |
| **Registered User** | `user` | Authenticated. Can create listings, send inquiries, save favourites, manage profile | Standard authenticated |
| **Verified Seller** | `verified_seller` | Elevated trust tier. ID and/or business verification completed | Listing quantity increase, verified badge |
| **Admin** | `admin` | Internal team. Full platform access — moderation, user management, reporting | Full access |
| **Super Admin** | `super_admin` | Technical owner. Platform configuration, admin management | Unrestricted |

> **Note:** Dealership, Workshop, and Insurance roles are scoped to Phase 2. The Firebase custom claims and Firestore role field should be designed to accommodate them without requiring document migrations.

### Role Capabilities (MVP)

| Capability | guest | user | verified_seller | admin | super_admin |
|---|---|---|---|---|---|
| Browse listings | ✅ | ✅ | ✅ | ✅ | ✅ |
| Search & filter | ✅ | ✅ | ✅ | ✅ | ✅ |
| View listing detail | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create vehicle listing | ❌ | ✅ (limit 3) | ✅ (limit 10) | ✅ | ✅ |
| Create parts listing | ❌ | ✅ (limit 5) | ✅ (limit 20) | ✅ | ✅ |
| Send inquiry | ❌ | ✅ | ✅ | ✅ | ✅ |
| Save favourites | ❌ | ✅ | ✅ | ✅ | ✅ |
| Manage own profile | ❌ | ✅ | ✅ | ✅ | ✅ |
| Moderate listings | ❌ | ❌ | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ❌ | ✅ | ✅ |
| Platform config | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 5. MVP Scope

The MVP is deliberately focused to deliver a complete, polished experience in the core categories before expanding. Quality and trust over breadth.

### In Scope for MVP

#### 5.1 Authentication & Profiles
- Email + password registration and login via Firebase Auth
- Social login: Google OAuth (optional, Phase 1b — Firebase Auth natively supports this)
- Email verification flow
- Forgot password / password reset
- Public user profile page (display name, avatar, member since, listing count, review score)
- Private profile settings page (contact details, notification preferences)
- Account deletion with POPIA-compliant data handling

#### 5.2 Vehicle Listings
- Create, edit, publish, pause, and delete vehicle listings
- Listing fields: make, model, year, variant, mileage, transmission, fuel type, colour, condition, price, province, city, description, contact preference
- Up to 20 photos per vehicle listing (Firebase Storage)
- Listing status workflow: `draft → pending_review → active → paused → sold`
- Search by: make, model, year range, price range, province, transmission, fuel type
- Sort by: newest, price low/high, mileage low/high
- Vehicle listing detail page with inquiry button
- Mark as Sold flow

#### 5.3 Parts & Accessories Listings
- Create, edit, publish, pause, and delete parts listings
- Listing fields: part name, category, compatible makes/models/years, condition (new/used/refurbished), price, quantity, province, city, description
- Up to 10 photos per parts listing
- Parts category taxonomy (predefined — see Feature Modules)
- Search by: category, compatible vehicle, condition, price range, province
- Listing status workflow mirrors vehicle listings

#### 5.4 Inquiries / Messaging
- Buyer sends inquiry on a listing (text message + contact details)
- Seller receives email notification
- Basic in-platform message thread per inquiry (no real-time chat at MVP — async only)
- Seller can reply via platform

#### 5.5 Saved Listings / Favourites
- Authenticated users can save/unsave any listing
- Dedicated "My Saved" page with saved vehicles and parts

#### 5.6 Admin Moderation Panel
- Admin dashboard: listing queue, user list, flagged content
- Review and approve/reject pending listings with optional rejection reason
- Flag listings for review
- Suspend or ban users
- Basic reporting: total listings by status, new users per week, listings per category
- Manual listing edit capability (for corrections before approval)

#### 5.7 Static / Marketing Pages
- Homepage with featured/recent listings, search bar, category tiles
- About page
- How It Works page
- Contact / Report a Problem page
- Terms & Conditions
- Privacy Policy (POPIA-compliant)

---

## 6. Out-of-Scope for MVP

The following are **explicitly deferred** to keep the MVP focused. They are listed here so the architecture can be designed to accommodate them later.

| Feature | Target Phase | Notes |
|---|---|---|
| Workshop listings & booking | Phase 2 | Requires scheduling engine, workshop profiles |
| Insurance integration | Phase 2 | Requires broker partnerships and quote API |
| Logistics / delivery quoting | Phase 2 | Integration with Courier Guy, Aramex SA |
| Dealership accounts & bulk tools | Phase 2 | Dealer portal, bulk CSV import, subscription billing |
| Real-time chat (WebSocket) | Phase 2 | Replace async messaging; Firebase Realtime Database or Firestore listeners are the natural upgrade path |
| Payment processing | Phase 2 | PayFast / Peach Payments integration for secure checkout |
| Vehicle valuation / pricing tool | Phase 2 | Integration with TransUnion / WesBank data |
| Financing calculator | Phase 2 | WesBank or ABSA API |
| Alerts / saved searches | Phase 2 | Email/push notifications when matching listings appear |
| Mobile app (React Native) | Phase 3 | Share logic via shared API layer |
| Multi-language (Afrikaans, Zulu) | Phase 3 | i18n infrastructure to be designed in from Phase 2 |
| Seller subscription tiers | Phase 2 | Free / Basic / Pro plans |
| VIN decode / vehicle history | Phase 2 | eNaTIS data or third-party VIN API |
| Review & rating system | Phase 2 | Post-transaction reviews |
| Social sharing integrations | Phase 1b | Open Graph meta tags in Phase 1, share buttons Phase 1b |
| Analytics dashboard (seller) | Phase 2 | Listing view counts, inquiry rates |

---

## 7. Core User Journeys

### Journey 1 — Buyer Finds and Inquires on a Vehicle

```
[Homepage] 
  → Search bar / Browse Vehicles
  → [Vehicle Listing Grid] (filtered/sorted)
  → [Vehicle Detail Page]
  → "Send Inquiry" button
  → [Inquiry Modal] (if not logged in → prompt to register/login first)
  → Message sent confirmation
  → Seller receives email notification
  → Seller replies via [Admin Messages] or [My Listings > Inquiries]
  → Buyer receives email with reply
```

### Journey 2 — Seller Posts a Vehicle Listing

```
[Register / Login]
  → [Dashboard / My Listings]
  → "Post a Vehicle" CTA
  → [Listing Form — Step 1: Vehicle Details]
  → [Listing Form — Step 2: Photos Upload]
  → [Listing Form — Step 3: Pricing & Contact]
  → Review & Submit
  → Listing status: pending_review
  → Admin receives notification → approves listing
  → Listing status: active
  → Seller receives "Your listing is live" email
  → Listing visible on platform
```

### Journey 3 — New User Registration

```
[Homepage or Listing Page]
  → "Sign Up" CTA
  → [Register Page] (name, email, password, province)
  → Submit → Firebase Auth creates user → Cloud Function creates Firestore profile document
  → Verification email sent
  → User clicks verify link
  → [Email Verified] confirmation page
  → Redirect to [Dashboard]
```

### Journey 4 — Admin Moderates Pending Listing

```
[Admin Dashboard]
  → Pending Listings queue (sorted by submission date)
  → Click listing → [Admin Listing Review]
  → Review all fields, photos, description
  → Approve → listing goes live, seller notified
  OR
  → Reject → select rejection reason → seller notified with reason
  OR
  → Edit minor details → then approve
```

### Journey 5 — Parts Buyer Searches by Vehicle Fitment

```
[Homepage]
  → "Find Parts" tab
  → Select Make → Model → Year
  → [Parts Grid] filtered by compatible fitment
  → [Part Detail Page]
  → "Contact Seller" → inquiry flow
```

### Journey 6 — User Saves and Returns to a Listing

```
[Vehicle Detail Page]
  → Click ♡ (Save)  → [Login prompt if not authenticated]
  → Listing saved to user's favourites
  → [My Saved Listings] page
  → User returns later, clicks saved listing
  → [Vehicle Detail Page] — listing status shown (active / sold)
```

---

## 8. Feature Modules

### Module Map

```
MotorSphere MVP
│
├── AUTH            Authentication & Session Management
├── PROFILES        User Profiles & Account Settings
├── VEHICLES        Vehicle Listings (CRUD + Search + Detail)
├── PARTS           Parts & Accessories Listings (CRUD + Search + Detail)
├── INQUIRIES       Messaging / Inquiry System
├── SAVED           Favourites & Saved Searches
├── ADMIN           Admin Moderation Panel
├── NOTIFICATIONS   Email Notification System
└── STATIC          Marketing Pages & Legal
```

---

### Module: AUTH

| Item | Detail |
|---|---|
| Provider | Firebase Auth |
| Methods | Email/password, Google OAuth (Phase 1b — built into Firebase Auth) |
| Session strategy | Firebase ID token → exchanged for httpOnly session cookie via `/api/auth/session` route |
| Key routes | `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email` |
| Middleware | `middleware.ts` — verifies session cookie via Firebase Admin SDK; protects dashboard, listing creation, admin routes |

---

### Module: PROFILES

| Item | Detail |
|---|---|
| Public profile | `/profile/[username]` — display name, avatar, listings, rating (Phase 2) |
| Private settings | `/account/settings` — name, email, phone, province, avatar upload |
| Avatar storage | Firebase Storage path: `avatars/{userId}/avatar.{ext}` |
| Verification badge | Shown if `users/{userId}.isVerified == true` in Firestore |

---

### Module: VEHICLES

**Listing Fields:**

| Field | Type | Notes |
|---|---|---|
| `make` | text | Dropdown from predefined list + "Other" |
| `model` | text | Dependent on make |
| `year` | integer | 1970–current year |
| `variant` | text | Optional free text |
| `mileage` | integer | Odometer in km |
| `transmission` | enum | `manual`, `automatic`, `semi-automatic` |
| `fuel_type` | enum | `petrol`, `diesel`, `hybrid`, `electric`, `lpg` |
| `colour` | text | Predefined palette + custom |
| `condition` | enum | `excellent`, `good`, `fair`, `salvage` |
| `price` | integer | In ZAR (cents to avoid float) |
| `negotiable` | boolean | |
| `province` | enum | All 9 SA provinces |
| `city` | text | Free text |
| `description` | text | Max 2000 chars |
| `contact_preference` | enum | `platform_only`, `show_phone`, `show_whatsapp` |
| `status` | enum | `draft`, `pending_review`, `active`, `paused`, `sold`, `rejected` |

**SA Vehicle Make Taxonomy (MVP seed list):**
Toyota, Volkswagen, Ford, Nissan, Hyundai, Kia, BMW, Mercedes-Benz, Audi, Renault, Chevrolet (legacy), Suzuki, Isuzu, Mazda, Mitsubishi, Honda, Jeep, Land Rover, Peugeot, Citroën, Opel, Haval, Chery, BAIC, Other.

---

### Module: PARTS

**Parts Category Taxonomy (MVP):**

```
Engine & Drivetrain
  └── Engine Components, Gearbox & Transmission, Clutch, Driveshaft, Turbo & Supercharger

Suspension & Steering
  └── Shocks & Struts, Control Arms, Wheel Bearings, Tie Rods, Power Steering

Brakes
  └── Brake Pads, Brake Discs/Rotors, Calipers, Brake Lines, Master Cylinder

Electrical & Electronics
  └── Batteries, Alternators, Starters, Sensors, ECU/TCU, Lighting, Wiring Looms

Body & Exterior
  └── Panels, Bumpers, Mirrors, Grilles, Bonnet, Doors, Glass

Interior
  └── Seats, Dashboards, Carpets, Trim, Steering Wheels, Sound Deadening

Wheels & Tyres
  └── Steel Rims, Alloy Wheels, Tyres (new/used), Hub Caps, Wheel Nuts

Cooling & Heating
  └── Radiators, Fans, Thermostats, Heater Cores, A/C Components

Exhaust System
  └── Manifolds, Catalytic Converters, Silencers, Pipes

Accessories & Performance
  └── Bull Bars, Nudge Guards, Roof Racks, Seat Covers, Sound Systems, Tuning Parts

Tools & Workshop Equipment
  └── Hand Tools, Diagnostic Tools, Lifts & Stands

Other / Miscellaneous
```

---

### Module: INQUIRIES

| Item | Detail |
|---|---|
| Trigger | "Contact Seller" button on listing detail page |
| Auth gate | Must be logged in to send inquiry |
| Fields | Message text (max 500 chars), read-only seller contact info |
| Delivery | Email to seller (via Cloud Function trigger on new Firestore inquiry document) + stored in `inquiries` collection |
| Reply flow | Seller replies via platform or direct contact (Phase 1) |
| Spam protection | Rate limit: max 5 inquiries per user per hour |

---

### Module: ADMIN

**Admin Dashboard Sections:**

| Section | Description |
|---|---|
| **Overview** | Platform stats: active listings, pending queue, new users (7d), flagged items |
| **Listing Queue** | All `pending_review` listings — review, approve, reject, edit |
| **All Listings** | Full listing table with filters by status, category, date, user |
| **Users** | User list, profile view, suspend/ban, verification management |
| **Flagged Content** | Listings flagged by users or auto-flagged |
| **Reports** | Basic CSV exports |

---

### Module: NOTIFICATIONS

**MVP Email Notifications (transactional via Cloud Functions + Resend):**

| Trigger | Recipient | Content |
|---|---|---|
| Registration | New user | Welcome + email verification link |
| Listing submitted | Admin | New listing pending review |
| Listing approved | Seller | "Your listing is live" + link |
| Listing rejected | Seller | Rejection reason + edit link |
| New inquiry | Seller | Inquiry message + reply link |
| Inquiry reply | Buyer | Seller's reply + listing link |
| Password reset | User | Reset link |

> **Recommended provider:** Resend (simple API, generous free tier, excellent Next.js SDK)

---

## 9. Figma Design Handoff Plan

### Design → Development Contract

The Figma file should be treated as the **single source of truth for visual design**. Before any component is coded, the designer and developer must align on the following:

### 9.1 What to Establish in Figma First

| Design Artefact | Description | Required Before Coding |
|---|---|---|
| **Colour Palette** | Primary, secondary, neutral, semantic (success, warning, error, info) tokens | ✅ Yes |
| **Typography Scale** | Font family, size scale (xs → 4xl), weights, line heights | ✅ Yes |
| **Spacing Scale** | Base unit (4px or 8px system), spacing tokens | ✅ Yes |
| **Component Library** | Buttons, inputs, cards, badges, modals, nav, footer | ✅ Yes |
| **Icon Set** | Preferred icon library (Lucide React recommended — consistent with shadcn/ui) | ✅ Yes |
| **Breakpoints** | Mobile (375px), Tablet (768px), Desktop (1280px) | ✅ Yes |
| **Key Page Wireframes** | Homepage, Listing Grid, Listing Detail, Dashboard, Admin Panel | ✅ Yes |
| **Dark Mode** | Specify if required at launch or deferred | Decide before coding |

### 9.2 Figma → shadcn/ui Token Mapping

shadcn/ui uses CSS variables for theming. The Figma design tokens should be mapped to these variables:

```css
/* These will live in globals.css */
--background       /* Page background */
--foreground       /* Primary text */
--primary          /* Brand primary colour */
--primary-foreground
--secondary        /* Secondary UI colour */
--secondary-foreground
--muted            /* Muted backgrounds */
--muted-foreground
--accent           /* Hover / highlight states */
--destructive      /* Error / danger states */
--border           /* Border colour */
--ring             /* Focus ring */
--radius           /* Border radius base */
```

### 9.3 Recommended Figma Workflow

1. Designer exports Figma Variables/Tokens as JSON or manually maps to the CSS variable list above
2. Developer implements variables in `globals.css` using Tailwind v4 `@theme` blocks
3. Implement shadcn/ui base theme using those variables
4. Build components starting with the Figma component library (Buttons → Cards → Forms → Layouts)
5. Each Figma component frame is linked to a corresponding component file in code (`/components/ui/`)

### 9.4 Design Principles for MotorSphere

- **Mobile-first:** Design at 375px viewport width first, then scale up
- **Trust signals prominent:** Verified badges, listing completeness indicators, clear seller info
- **Speed perception:** Skeleton loaders, optimistic UI, Next.js Image optimisation
- **South African context:** ZAR formatting (R 150 000), SA province names, local date formats (DD/MM/YYYY)
- **Accessibility:** WCAG AA minimum — sufficient colour contrast, keyboard navigable, screen reader friendly

---

## 10. Recommended Tech Stack

> These are planning recommendations. They reflect the best-fit choices given MotorSphere's requirements, South African context, and the team's stated preferences. Nothing here is irreversible.

### Core Stack

| Layer | Technology | Version | Rationale |
|---|---|---|---|
| **Framework** | Next.js (App Router) | 16.x | SSR for SEO (critical for marketplace listings), API routes, image optimisation |
| **Language** | TypeScript | 5.x | Type safety across frontend + API layer; catches Firestore document shape mismatches early |
| **Styling** | Tailwind CSS | 4.x | Utility-first; v4 uses CSS-native cascade layers (faster, smaller output) |
| **UI Components** | shadcn/ui | Latest | Not a library — copies components into codebase. Full control, Radix primitives underneath, accessible |
| **Auth** | Firebase Auth | Latest | Email/password, Google OAuth, email verification, password reset — all built-in; integrates with Firestore Security Rules |
| **Database** | Cloud Firestore | Latest | NoSQL document database; real-time capable, offline-ready, scales automatically, Security Rules enforced at DB layer |
| **File Storage** | Firebase Storage | Latest | CDN-served object storage; Security Rules integrated with Firebase Auth; same project config as Firestore and Auth |
| **Backend Functions** | Cloud Functions for Firebase | 2nd gen | Triggered by Firestore writes, Auth events, HTTP calls; handles email dispatch, role assignment, admin tasks |
| **Icons** | Lucide React | Latest | Default icon set for shadcn/ui; consistent, tree-shakeable |
| **Email** | Resend | Latest | Simple API, Next.js SDK, generous free tier (3000 emails/month), reliable deliverability; called from Cloud Functions |

### Infrastructure

| Layer | Technology | Rationale |
|---|---|---|
| **App Hosting** | Netlify | Next.js SSR hosting via `@netlify/plugin-nextjs`. GitHub-based auto-deploy, preview deploys on PRs, managed SSL. Firebase App Hosting kept as a deferred alternative. |
| **Database / Auth / Storage** | Firebase (single project) | All Firebase services share one project config — one set of credentials, unified Security Rules, one console |
| **Backend Logic** | Cloud Functions (2nd gen) | Collocated with Firebase project; triggered by Firestore/Auth events; no separate infrastructure needed. Deferred until needed. |
| **Version Control** | GitHub | CI/CD via GitHub Actions; Netlify auto-deploys from `main` |
| **AI Development** | Claude Code | AI-assisted development within the project; documented in `CLAUDE.md` |

### Dev Tooling

| Tool | Purpose |
|---|---|
| ESLint + Next.js config | Linting (already configured) |
| Prettier | Code formatting (add in Base 2) |
| Husky + lint-staged | Pre-commit hooks (add in Base 2) |
| Firebase CLI | Local emulator suite, function deployment, Security Rules deployment, Firestore index management |
| Firebase Emulator Suite | Full local Firebase stack (Auth, Firestore, Storage, Functions) — no Docker required |
| GitHub Actions | CI: lint, type check, build on PR |

### Considered & Deferred

| Technology | Why Deferred |
|---|---|
| tRPC | Excellent type safety end-to-end, but adds setup overhead; revisit for Phase 2 |
| React Query / TanStack Query | Worth adding in Phase 2 for caching, background refetch, optimistic updates |
| Stripe | South African card payments better served by PayFast/Peach Payments; Phase 2 |
| Algolia / Typesense | Firestore's composite index queries are sufficient for MVP filters; add Algolia if full-text search needs grow |
| Firebase Realtime Database | Not needed alongside Firestore at MVP; revisit for real-time chat in Phase 2 |

---

## 11. Firebase Planning

### 11.1 Firebase Auth Role Strategy

Firebase Auth handles authentication. Roles are managed using a **two-layer approach**:

**Layer 1 — Firebase Custom Claims** (authoritative, checked in Security Rules):
- Custom claims are set on the Firebase Auth token by Cloud Functions
- The `role` claim is the security-enforced role: `'user'` | `'verified_seller'` | `'admin'` | `'super_admin'`
- Security Rules read `request.auth.token.role` — this cannot be spoofed by the client
- Setting custom claims requires the Firebase Admin SDK (server-side only)

**Layer 2 — Firestore `users` document** (display layer, UI logic):
- `users/{userId}.role` mirrors the custom claim — used for UI rendering and admin queries
- Must be kept in sync with custom claims via Cloud Function when role changes

**Role assignment flow:**
```
Admin sets role in admin panel
  → API route calls Firebase Admin SDK: auth.setCustomUserClaims(uid, { role: 'admin' })
  → Cloud Function also writes role to users/{uid} Firestore document
  → User's next token refresh picks up the new claim
  → Security Rules enforce the new role immediately on next request
```

**Auth configuration:**

| Setting | Value |
|---|---|
| Email verification | Required — enforced in middleware before dashboard access |
| Session strategy | Firebase ID token → POST `/api/auth/session` → httpOnly session cookie (1 hour expiry) |
| Session cookie verification | Firebase Admin SDK `auth.verifySessionCookie()` in `middleware.ts` |
| Google OAuth | Configured in Firebase Console → Authentication providers (Phase 1b) |
| Password minimum length | 8 characters (enforced in Firebase Console + Zod schema) |
| Custom email templates | Configure via Firebase Console or override with Resend Cloud Function |

> **Session cookie pattern for Next.js SSR:** Firebase ID tokens are short-lived (1 hour) and not suitable as httpOnly cookies directly. The recommended pattern is: client gets ID token → calls `/api/auth/session` → server creates a session cookie via `auth.createSessionCookie()` → this cookie is sent httpOnly and verified in middleware. This enables SSR with Firebase Auth without exposing tokens to JavaScript.

---

### 11.2 Firestore Collection Architecture

> Firestore is a NoSQL document database. There are no joins, no foreign keys, and no migrations. Design collections around access patterns, not normalisation.

**Top-level collections:**

```
/users/{userId}                     ← User profiles (one per Firebase Auth UID)
/vehicles/{vehicleId}               ← Vehicle listings
  /images/{imageId}                 ← Subcollection: vehicle listing images
/parts/{partId}                     ← Parts listings
  /images/{imageId}                 ← Subcollection: parts listing images
/inquiries/{inquiryId}              ← Inquiry threads
  /replies/{replyId}                ← Subcollection: replies to an inquiry
/savedListings/{savedId}            ← Saved/favourited listings (by any user)
/adminFlags/{flagId}                ← Flagged listings (moderation)
/adminLogs/{logId}                  ← Admin action audit log (Phase 2)
```

**Access pattern decisions:**

| Decision | Rationale |
|---|---|
| Images as subcollection of listing | Keeps image reads scoped to their parent listing; Security Rules inherit from parent |
| Replies as subcollection of inquiry | Enables real-time listener on a single inquiry thread in Phase 2 |
| `savedListings` as top-level collection | Allows querying all saves by a user; alternative (subcollection under user) makes counting total saves harder |
| No polymorphic listing collection | `vehicles` and `parts` are separate collections — cleaner Security Rules, simpler composite indexes |

---

### 11.3 Firestore Document Shapes

#### `/users/{userId}`
```typescript
{
  uid:            string;          // = Firebase Auth UID (document ID)
  username:       string;          // unique — enforced via Cloud Function
  displayName:    string;
  avatarUrl:      string | null;
  phone:          string | null;   // stored in Firestore; not in Firebase Auth
  province:       string | null;   // SA province
  bio:            string | null;
  isVerified:     boolean;         // default false
  isSuspended:    boolean;         // default false
  role:           'user' | 'verified_seller' | 'admin' | 'super_admin';
  listingCount:   number;          // denormalised — incremented by Cloud Function
  createdAt:      Timestamp;
  updatedAt:      Timestamp;
}
```

#### `/vehicles/{vehicleId}`
```typescript
{
  id:             string;          // Firestore document ID
  userId:         string;          // Firebase Auth UID of seller
  userDisplayName: string;         // denormalised for display (avoids extra read)
  userIsVerified: boolean;         // denormalised
  make:           string;
  model:          string;
  year:           number;
  variant:        string | null;
  mileage:        number | null;
  transmission:   'manual' | 'automatic' | 'semi-automatic';
  fuelType:       'petrol' | 'diesel' | 'hybrid' | 'electric' | 'lpg';
  colour:         string | null;
  condition:      'excellent' | 'good' | 'fair' | 'salvage';
  price:          number;          // ZAR in cents (integer, no float)
  negotiable:     boolean;
  province:       string;
  city:           string | null;
  description:    string;
  contactPref:    'platform_only' | 'show_phone' | 'show_whatsapp';
  primaryImageUrl: string | null;  // denormalised — first/primary image URL for card rendering
  imageCount:     number;          // denormalised — avoids subcollection count query
  status:         'draft' | 'pending_review' | 'active' | 'paused' | 'sold' | 'rejected';
  rejectionNote:  string | null;
  viewsCount:     number;          // incremented server-side via Cloud Function
  featured:       boolean;
  createdAt:      Timestamp;
  updatedAt:      Timestamp;
  publishedAt:    Timestamp | null;
}
```

#### `/vehicles/{vehicleId}/images/{imageId}`
```typescript
{
  id:         string;
  storagePath: string;    // Firebase Storage path: vehicles/{userId}/{vehicleId}/{n}.webp
  url:        string;     // Firebase Storage download URL (CDN)
  sortOrder:  number;
  isPrimary:  boolean;
  createdAt:  Timestamp;
}
```

#### `/parts/{partId}`
```typescript
{
  id:               string;
  userId:           string;
  userDisplayName:  string;         // denormalised
  userIsVerified:   boolean;        // denormalised
  title:            string;
  category:         string;         // parts taxonomy slug
  condition:        'new' | 'used' | 'refurbished';
  price:            number;         // ZAR cents
  quantity:         number;
  province:         string;
  city:             string | null;
  description:      string;
  compatibleMakes:  string[];       // e.g. ['toyota', 'ford']
  compatibleModels: string[];
  compatibleYearFrom: number | null;
  compatibleYearTo:   number | null;
  primaryImageUrl:  string | null;  // denormalised
  imageCount:       number;         // denormalised
  status:           'draft' | 'pending_review' | 'active' | 'paused' | 'sold' | 'rejected';
  rejectionNote:    string | null;
  viewsCount:       number;
  createdAt:        Timestamp;
  updatedAt:        Timestamp;
  publishedAt:      Timestamp | null;
}
```

#### `/inquiries/{inquiryId}`
```typescript
{
  id:           string;
  listingId:    string;
  listingType:  'vehicle' | 'part';
  listingTitle: string;     // denormalised: "[Make] [Model] [Year]" or part title
  senderId:     string;     // Firebase Auth UID
  senderName:   string;     // denormalised
  receiverId:   string;     // Firebase Auth UID of listing owner
  message:      string;
  isRead:       boolean;
  replyCount:   number;     // denormalised
  createdAt:    Timestamp;
}
```

#### `/inquiries/{inquiryId}/replies/{replyId}`
```typescript
{
  id:         string;
  senderId:   string;
  senderName: string;   // denormalised
  message:    string;
  createdAt:  Timestamp;
}
```

#### `/savedListings/{savedId}`
```typescript
{
  id:           string;
  userId:       string;
  listingId:    string;
  listingType:  'vehicle' | 'part';
  listingTitle: string;         // denormalised — for display without extra fetch
  listingPrice: number;         // denormalised — ZAR cents
  listingStatus: string;        // denormalised — show if listing became sold
  primaryImageUrl: string | null;
  createdAt:    Timestamp;
}
```

> **Denormalisation note:** Firestore does not support joins. Frequently-displayed fields (seller name, primary image URL, listing status in saves) are deliberately duplicated into documents that need them. Cloud Functions keep these in sync when source documents change.

---

### 11.4 Firestore Composite Indexes

Firestore requires explicit composite indexes for queries that filter or sort on multiple fields. These must be defined in `firestore.indexes.json` and deployed via Firebase CLI.

**Required indexes for MVP:**

```json
{
  "indexes": [
    // Vehicles — public browse
    { "collectionGroup": "vehicles", "fields": [
      { "fieldPath": "status", "order": "ASCENDING" },
      { "fieldPath": "createdAt", "order": "DESCENDING" }
    ]},
    // Vehicles — filter by make
    { "collectionGroup": "vehicles", "fields": [
      { "fieldPath": "status", "order": "ASCENDING" },
      { "fieldPath": "make", "order": "ASCENDING" },
      { "fieldPath": "createdAt", "order": "DESCENDING" }
    ]},
    // Vehicles — filter by province
    { "collectionGroup": "vehicles", "fields": [
      { "fieldPath": "status", "order": "ASCENDING" },
      { "fieldPath": "province", "order": "ASCENDING" },
      { "fieldPath": "createdAt", "order": "DESCENDING" }
    ]},
    // Vehicles — sort by price ascending
    { "collectionGroup": "vehicles", "fields": [
      { "fieldPath": "status", "order": "ASCENDING" },
      { "fieldPath": "price", "order": "ASCENDING" }
    ]},
    // Vehicles — by seller (dashboard)
    { "collectionGroup": "vehicles", "fields": [
      { "fieldPath": "userId", "order": "ASCENDING" },
      { "fieldPath": "createdAt", "order": "DESCENDING" }
    ]},
    // Vehicles — admin pending queue
    { "collectionGroup": "vehicles", "fields": [
      { "fieldPath": "status", "order": "ASCENDING" },
      { "fieldPath": "createdAt", "order": "ASCENDING" }
    ]},
    // Parts — browse by category
    { "collectionGroup": "parts", "fields": [
      { "fieldPath": "status", "order": "ASCENDING" },
      { "fieldPath": "category", "order": "ASCENDING" },
      { "fieldPath": "createdAt", "order": "DESCENDING" }
    ]},
    // Parts — by compatible make (fitment search)
    { "collectionGroup": "parts", "fields": [
      { "fieldPath": "status", "order": "ASCENDING" },
      { "fieldPath": "compatibleMakes", "arrayConfig": "CONTAINS" },
      { "fieldPath": "createdAt", "order": "DESCENDING" }
    ]},
    // Saved listings — by user
    { "collectionGroup": "savedListings", "fields": [
      { "fieldPath": "userId", "order": "ASCENDING" },
      { "fieldPath": "createdAt", "order": "DESCENDING" }
    ]},
    // Inquiries — by receiver (seller's inbox)
    { "collectionGroup": "inquiries", "fields": [
      { "fieldPath": "receiverId", "order": "ASCENDING" },
      { "fieldPath": "createdAt", "order": "DESCENDING" }
    ]},
    // Inquiries — by sender
    { "collectionGroup": "inquiries", "fields": [
      { "fieldPath": "senderId", "order": "ASCENDING" },
      { "fieldPath": "createdAt", "order": "DESCENDING" }
    ]}
  ]
}
```

> **Search limitation note:** Firestore does not support full-text search. `status == 'active' AND make == 'toyota' AND province == 'Gauteng'` works fine via composite index. Free-text description search does not. See Section 11.10 for mitigation.

---

### 11.5 Firebase Security Rules Strategy

Security Rules run server-side in Firebase infrastructure — they cannot be bypassed from the client. They are the equivalent of Supabase RLS but written in Firebase's CEL-like rules language.

**`firestore.rules` — MVP ruleset:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ─── Helper Functions ───────────────────────────────────
    function isAuth() {
      return request.auth != null;
    }
    function uid() {
      return request.auth.uid;
    }
    function isOwner(docUserId) {
      return isAuth() && uid() == docUserId;
    }
    function isAdmin() {
      return isAuth() && request.auth.token.role in ['admin', 'super_admin'];
    }
    function isVerifiedOrAbove() {
      return isAuth() && request.auth.token.role in
             ['verified_seller', 'admin', 'super_admin'];
    }
    function isActiveOrOwnerOrAdmin(status, docUserId) {
      return status == 'active'
          || isOwner(docUserId)
          || isAdmin();
    }

    // ─── Users ──────────────────────────────────────────────
    match /users/{userId} {
      allow read:   if true;                        // public profiles
      allow create: if isAuth() && uid() == userId; // own profile only on register
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isOwner(userId) || isAdmin();
    }

    // ─── Vehicle Listings ────────────────────────────────────
    match /vehicles/{vehicleId} {
      allow read:   if isActiveOrOwnerOrAdmin(resource.data.status, resource.data.userId);
      allow create: if isAuth()
                    && request.resource.data.userId == uid()
                    && request.resource.data.status == 'draft'; // must start as draft
      allow update: if isOwner(resource.data.userId) || isAdmin();
      allow delete: if isOwner(resource.data.userId) || isAdmin();

      // Images subcollection
      match /images/{imageId} {
        allow read:   if isActiveOrOwnerOrAdmin(
                        get(/databases/$(database)/documents/vehicles/$(vehicleId)).data.status,
                        get(/databases/$(database)/documents/vehicles/$(vehicleId)).data.userId
                      );
        allow write:  if isOwner(
                        get(/databases/$(database)/documents/vehicles/$(vehicleId)).data.userId
                      ) || isAdmin();
      }
    }

    // ─── Parts Listings ──────────────────────────────────────
    match /parts/{partId} {
      allow read:   if isActiveOrOwnerOrAdmin(resource.data.status, resource.data.userId);
      allow create: if isAuth()
                    && request.resource.data.userId == uid()
                    && request.resource.data.status == 'draft';
      allow update: if isOwner(resource.data.userId) || isAdmin();
      allow delete: if isOwner(resource.data.userId) || isAdmin();

      match /images/{imageId} {
        allow read:   if isActiveOrOwnerOrAdmin(
                        get(/databases/$(database)/documents/parts/$(partId)).data.status,
                        get(/databases/$(database)/documents/parts/$(partId)).data.userId
                      );
        allow write:  if isOwner(
                        get(/databases/$(database)/documents/parts/$(partId)).data.userId
                      ) || isAdmin();
      }
    }

    // ─── Inquiries ───────────────────────────────────────────
    match /inquiries/{inquiryId} {
      allow read:   if isAuth() && (
                      uid() == resource.data.senderId ||
                      uid() == resource.data.receiverId ||
                      isAdmin()
                    );
      allow create: if isAuth() && request.resource.data.senderId == uid();
      allow update: if isAuth() && (
                      uid() == resource.data.receiverId || isAdmin()
                    ); // receiver can mark as read

      match /replies/{replyId} {
        allow read:   if isAuth() && (
                        uid() == get(/databases/$(database)/documents/inquiries/$(inquiryId)).data.senderId ||
                        uid() == get(/databases/$(database)/documents/inquiries/$(inquiryId)).data.receiverId ||
                        isAdmin()
                      );
        allow create: if isAuth() && (
                        uid() == get(/databases/$(database)/documents/inquiries/$(inquiryId)).data.senderId ||
                        uid() == get(/databases/$(database)/documents/inquiries/$(inquiryId)).data.receiverId
                      );
      }
    }

    // ─── Saved Listings ──────────────────────────────────────
    match /savedListings/{savedId} {
      allow read, write: if isAuth() && uid() == resource.data.userId;
      allow create:      if isAuth() && request.resource.data.userId == uid();
    }

    // ─── Admin Flags ─────────────────────────────────────────
    match /adminFlags/{flagId} {
      allow read:   if isAdmin();
      allow create: if isAuth(); // any user can flag
      allow update, delete: if isAdmin();
    }
  }
}
```

**Firebase Storage Rules (`storage.rules`):**

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Avatars — owner read/write, public read
    match /avatars/{userId}/{allPaths=**} {
      allow read:  if true;
      allow write: if request.auth != null && request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024  // 5MB max
                   && request.resource.contentType.matches('image/.*');
    }

    // Vehicle images — owner write, public read
    match /vehicles/{userId}/{vehicleId}/{allPaths=**} {
      allow read:  if true;
      allow write: if request.auth != null && request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }

    // Parts images — owner write, public read
    match /parts/{userId}/{partId}/{allPaths=**} {
      allow read:  if true;
      allow write: if request.auth != null && request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }

    // Admin documents — admin only
    match /admin/{allPaths=**} {
      allow read, write: if request.auth.token.role in ['admin', 'super_admin'];
    }
  }
}
```

---

### 11.6 Firebase Storage Bucket / Folder Strategy

| Path | Access | Max Size | Notes |
|---|---|---|---|
| `avatars/{userId}/avatar.{ext}` | Public read, owner write | 5MB | Replace on update |
| `vehicles/{userId}/{vehicleId}/{n}.webp` | Public read, owner write | 5MB | Convert to webp on upload via Cloud Function |
| `parts/{userId}/{partId}/{n}.webp` | Public read, owner write | 5MB | Same as above |
| `admin/{document}` | Admin only | — | Verification documents, internal files |

> **Image processing:** Upload original → Cloud Function trigger (`onObjectFinalized`) → resize to max 1200px wide → convert to WebP → write back to same path with optimised filename. Store final CDN URL in Firestore image document. This keeps storage costs low and load times fast.

---

### 11.7 Cloud Functions Strategy

All Cloud Functions use the **2nd generation** runtime (`firebase-functions/v2`). Functions are in `functions/src/`.

**Auth-triggered functions:**

| Function | Trigger | Action |
|---|---|---|
| `onUserCreate` | `auth.user().onCreate()` | Create `users/{uid}` Firestore document with default role `'user'`; send welcome + verification email via Resend |
| `onUserDelete` | `auth.user().onDelete()` | Soft-delete user's Firestore document; mark listings as `paused`; POPIA-compliant data handling |

**Firestore-triggered functions:**

| Function | Trigger | Action |
|---|---|---|
| `onVehicleListingCreate` | `vehicles` onCreate | Notify admin of new pending listing; validate listing data |
| `onVehicleListingUpdate` | `vehicles` onUpdate | If status changes to `active` → email seller "Your listing is live"; if `rejected` → email seller with reason |
| `onPartsListingCreate` | `parts` onCreate | Same as vehicle listing |
| `onPartsListingUpdate` | `parts` onUpdate | Same as vehicle listing |
| `onInquiryCreate` | `inquiries` onCreate | Email seller with inquiry message + reply link |
| `onInquiryReplyCreate` | `inquiries/{id}/replies` onCreate | Email original inquiry sender with reply |
| `onImageUpload` | Storage `onObjectFinalized` | Resize + convert to WebP; update Firestore image document with final URL |

**Callable functions (called from client via Firebase SDK):**

| Function | Who Can Call | Action |
|---|---|---|
| `setUserRole` | Admin only (checked server-side) | Set Firebase custom claim + update Firestore role field |
| `incrementViewCount` | Any authenticated user | Increment `viewsCount` on listing (prevents client-side manipulation) |
| `verifyUser` | Admin only | Set `isVerified: true` + grant `verified_seller` claim |
| `suspendUser` | Admin only | Set `isSuspended: true`; disable Firebase Auth account |

**HTTP functions (scheduled — Phase 2):**

| Function | Schedule | Action |
|---|---|---|
| `cleanupExpiredListings` | Daily | Move listings older than 90 days (no renewal) to `paused` |
| `dailyAdminReport` | Daily | Summary email to admin of platform stats |

---

### 11.8 Firebase Emulator Suite Strategy

The Firebase Emulator Suite provides a full local Firebase stack for development and testing — **no network access, no cloud costs, no data risk**.

**Emulators used for MotorSphere:**

| Emulator | Port | Purpose |
|---|---|---|
| Auth | 9099 | Local user creation, login, custom claims |
| Firestore | 8080 | Local document reads/writes, Security Rules testing |
| Storage | 9199 | Local image upload/download |
| Functions | 5001 | Local Cloud Function testing with triggers |
| Emulator UI | 4000 | Web dashboard for all emulators |

**`firebase.json` emulator config:**
```json
{
  "emulators": {
    "auth":      { "port": 9099 },
    "firestore": { "port": 8080 },
    "storage":   { "port": 9199 },
    "functions": { "port": 5001 },
    "ui":        { "enabled": true, "port": 4000 }
  },
  "firestore": { "rules": "firestore.rules", "indexes": "firestore.indexes.json" },
  "storage":   { "rules": "storage.rules" },
  "functions": { "source": "functions" },
  "hosting":   { "source": "." }
}
```

**Next.js ↔ Emulator connection** (in `.env.local`):
```env
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true
```

The Firebase client init in `src/lib/firebase/client.ts` reads this flag and calls `connectFirestoreEmulator()`, `connectAuthEmulator()`, `connectStorageEmulator()` when true.

**Emulator data seeding:**
- `firebase emulators:start --import=./emulator-data` — load seed data
- `firebase emulators:export ./emulator-data` — save current emulator state
- Seed data includes test users, sample vehicle and parts listings, admin accounts

**Start command:**
```bash
firebase emulators:start --import=./emulator-data
```

---

### 11.9 Netlify Deployment Plan

Netlify is the active hosting provider for MotorSphere. Firebase handles the full backend (Auth, Firestore, Storage, Security Rules, Cloud Functions). Netlify handles hosting the Next.js app with GitHub-based auto-deploys and preview deployments.

> **Firebase App Hosting** is configured in `apphosting.yaml` (committed) but deferred as an alternative. It can be activated at Base 8 if the team decides to move to a fully-Firebase deployment stack.

**`netlify.toml` config:**
```toml
[build]
  command   = "npm run build"
  publish   = ".next"

[build.environment]
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

**Deployment environments:**

| Environment | Hosting | Firebase Project | Branch | Purpose |
|---|---|---|---|---|
| **Local** | Firebase Emulator Suite | — (local only) | feature/* branches | Development, Security Rules testing |
| **Preview** | Netlify preview URL | `motorsphere-staging` | Any PR to `main` | PR review; staging Firebase, preview URL |
| **Production** | Netlify (motorsphere.co.za) | `motorsphere-prod` | `main` | Live platform |

> **Two Firebase projects:** Staging and production are separate Firebase projects — separate Firestore databases, separate Storage buckets, separate Auth users. Prevents accidental data exposure.

**GitHub → Netlify auto-deploy:**
- Netlify connects directly to the GitHub repository
- Push to `main` → automatic production deploy
- Open PR → automatic preview deploy with unique URL (e.g. `https://deploy-preview-42--motorsphere.netlify.app`)
- No GitHub Actions deploy step needed (Netlify handles it)
- GitHub Actions still runs lint, type-check, and build verification

---

### 11.10 Required Environment Variables

```env
# ─── Firebase Client (public — safe to expose) ────────────────────
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=    # optional — Firebase Analytics

# ─── Firebase Admin SDK (server-side only — NEVER expose to client) ─
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=             # JSON string of private key — store in Secret Manager

# ─── Email (Resend) ────────────────────────────────────────────────
RESEND_API_KEY=

# ─── App ────────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=                    # https://motorsphere.co.za
NEXT_PUBLIC_APP_ENV=                    # development | staging | production

# ─── Emulator toggle ────────────────────────────────────────────────
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=     # true | false
```

> **Where to create Firebase credentials:**
> 1. Firebase Console → Project Settings → General → Your apps → Add web app → copy config values
> 2. Firebase Console → Project Settings → Service accounts → Generate new private key → use for Admin SDK
> 3. For Cloud Functions, secrets are managed in Firebase Secret Manager (not `.env` files)

---

### 11.11 Firestore Search Limitations & Mitigation

**The challenge:**
Firestore is not a search engine. It excels at structured queries (equality filters, range on one field, ordering) but cannot do:
- Full-text search (e.g., "find vehicles where description contains 'sunroof'")
- Multi-range queries (e.g., `year > 2010 AND price < 200000` — requires composite index, limited combinations)
- Fuzzy matching
- Relevance ranking

**What Firestore CAN do well for MotorSphere MVP:**

| Query | Supported? |
|---|---|
| All active vehicles, sorted by newest | ✅ Composite index |
| Active vehicles in Gauteng | ✅ Composite index |
| Active vehicles by make (Toyota) | ✅ Composite index |
| Active vehicles sorted by price | ✅ Composite index |
| Parts by category, newest first | ✅ Composite index |
| Parts compatible with Toyota (array-contains) | ✅ Composite index |
| My listings (by userId) | ✅ Composite index |
| Active vehicles in Gauteng, sorted by price | ✅ Composite index |

**Where it breaks down at scale:**

| Query | Firestore Limitation | Mitigation |
|---|---|---|
| Text search in listing titles | Not supported | Phase 2: Algolia or Typesense |
| Filter by make + province + price range simultaneously | Requires multiple composite indexes, limited combinations | For MVP: filter make + province server-side, filter price client-side on returned set |
| "Find parts compatible with 2015 Toyota Corolla" (make + model + year) | Array-contains on one field only per query | Store `compatibleMakes` array; filter model/year client-side on the returned set |
| Sorting by mileage + filtering by province | Not supported in one query without additional index | Pre-filter by province, sort client-side on small result set |

**MVP strategy:**
1. Use Firestore composite indexes for the most common filter combinations (make + status, province + status, category + status)
2. For multi-filter scenarios beyond Firestore's capability, fetch a broader set and filter client-side (acceptable at MVP scale with <10,000 listings)
3. Denormalise key filter fields into listings documents (already done in document shapes above)
4. Plan for Algolia integration in Phase 2 — the listing creation Cloud Function will be the trigger to sync to Algolia

---

## 12. Security & POPIA Planning

### 12.1 POPIA Overview

The **Protection of Personal Information Act (POPIA)** — South Africa's data protection law (effective 1 July 2021) — applies to MotorSphere as a responsible party processing personal information of South African data subjects.

Key obligations:

| Obligation | MotorSphere Action |
|---|---|
| **Lawful processing** | Process only data necessary for the stated purpose |
| **Purpose specification** | Clearly state why data is collected |
| **Consent** | Obtain explicit consent for marketing communications |
| **Security safeguards** | Protect personal information from unauthorised access |
| **Data subject rights** | Users can access, correct, and delete their personal data |
| **Notification of breach** | Notify the Information Regulator and affected users within reasonable time (aim: 72 hours) |
| **Information Officer** | Appoint and register an Information Officer with the Information Regulator |

---

### 12.2 Personal Information Inventory

| Data Point | Category | Retention | Justification |
|---|---|---|---|
| Name | Personal | Account lifetime + 12 months | Platform operation |
| Email address | Personal | Account lifetime + 12 months | Authentication, notifications |
| Phone number | Personal | Account lifetime | Contact preference (if opted in) |
| Province | Personal (soft) | Account lifetime | Listing location, search relevance |
| IP address | Technical | 30 days | Security / fraud detection |
| Listing content | User content | Listing lifetime + 6 months | Marketplace operation |
| Inquiry messages | Personal | 24 months | Dispute resolution |
| Payment details | Sensitive (Phase 2) | Per PCI-DSS requirements | Transaction processing |

---

### 12.3 POPIA Implementation Plan

#### Privacy by Design
- Collect minimum data required — no unnecessary fields
- All personal data fields clearly labelled in UI ("Why do we need this?")
- Cookie consent banner (if any analytics cookies are used)
- Marketing email opt-in is explicit, separate from registration

#### Data Access & Deletion
- "My Account" settings page includes:
  - "Download my data" (export personal data as JSON)
  - "Delete my account" (soft delete → hard delete after 30-day grace period)
- Admin panel includes tools to action POPIA requests manually (for MVP; automate in Phase 2)

#### Privacy Policy Requirements
The Privacy Policy page must cover (in plain English):
- What data is collected and why
- How data is stored and protected (Firebase/Google Cloud, Netlify, Resend)
- How long data is retained
- User rights under POPIA
- Contact details for the Information Officer
- Cookie policy
- Third-party services used

#### Security Measures

| Measure | Implementation |
|---|---|
| HTTPS everywhere | Netlify enforces HTTPS on all deployments; HSTS headers configured |
| Auth tokens | Firebase ID token → httpOnly session cookie via `/api/auth/session`; never stored in localStorage |
| Security Rules at DB layer | All Firestore collections and Storage paths protected by Firebase Security Rules (enforced server-side, cannot be bypassed) |
| Custom claims for roles | Admin roles enforced in Security Rules via `request.auth.token.role` — not just in application code |
| Input validation | Zod schemas on all API routes and form submissions |
| XSS prevention | React's default escaping + Content Security Policy headers |
| CSRF protection | Next.js App Router + SameSite cookie defaults |
| Rate limiting | Firebase App Check (Phase 2) + Next.js middleware for API routes + Cloud Function rate checks |
| File upload validation | Type and size checks in Firebase Storage Security Rules + Cloud Function validation |
| Admin routes | Protected by `proxy.ts` — verifies session cookie + checks `role` custom claim via Admin SDK |
| Environment variables | All secrets in Netlify Dashboard → Environment variables (server-side only); Cloud Functions use Firebase Secret Manager; never committed to codebase |
| Dependency scanning | GitHub Dependabot + periodic `npm audit` |

---

### 12.4 Security Headers (next.config.ts)

```typescript
// To be configured in Base 3 — next.config.ts
// To be configured in Base 3 — next.config.ts
// Note: Security headers can be set in next.config.ts or Netlify _headers file
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // Content-Security-Policy — must allowlist Firebase domains:
  // *.googleapis.com, *.firebaseapp.com, *.firebaseio.com, storage.googleapis.com
];
```

---

## 13. Deployment Planning

### 13.1 Environment Strategy

| Environment | Hosting | Firebase Project | Branch | Purpose |
|---|---|---|---|---|
| **Local Development** | Firebase Emulator Suite | — (local only) | feature/* branches | Full offline development |
| **Preview / Staging** | Netlify preview URL | `motorsphere-staging` | Any PR to `main` | PR review, stakeholder sign-off, staging data |
| **Production** | Netlify (motorsphere.co.za) | `motorsphere-prod` | `main` | Live platform, real user data |

> **Rule:** Nothing goes to production without a PR review and passing CI checks. Two separate Firebase projects for staging vs production — they do not share any data or credentials.

---

### 13.2 Firebase Project Setup

Each environment requires its own Firebase project:

**`motorsphere-staging` project:**
- Used for all PR preview deployments
- Seeded with realistic test data (no real user data)
- Firebase Auth test users pre-created
- Security Rules identical to production

**`motorsphere-prod` project:**
- Production only — accessed by live users
- Firestore backups enabled (Firebase automated daily backups)
- All Cloud Functions deployed here
- Monitoring and alerting enabled (Firebase Crashlytics / Cloud Monitoring)

**Firebase project files to commit to repo:**
```
.firebaserc             ← project aliases: "staging" and "prod"
firebase.json           ← hosting, functions, emulator, rules config
firestore.rules         ← Firestore Security Rules
firestore.indexes.json  ← Composite indexes
storage.rules           ← Firebase Storage Security Rules
netlify.toml            ← Netlify deployment config (active hosting)
apphosting.yaml         ← Firebase App Hosting config (deferred alternative)
functions/              ← Cloud Functions source
```

**`.firebaserc`:**
```json
{
  "projects": {
    "default":  "motorsphere-staging",
    "staging":  "motorsphere-staging",
    "prod":     "motorsphere-prod"
  }
}
```

---

### 13.3 CI/CD Pipeline (GitHub Actions)

Netlify handles deployment automatically from GitHub. GitHub Actions handles quality gates.

**On Pull Request (`ci.yml`):**
```
1. npm ci
2. TypeScript type check (tsc --noEmit)
3. ESLint (npm run lint)
4. Build check (npm run build)
5. Netlify auto-creates a preview deployment for the PR
```

**On merge to `main`:**
```
1. All CI checks must pass (enforced by branch protection)
2. Netlify auto-deploys to production
3. Cloud Functions deployed: firebase deploy --only functions --project prod
4. Security Rules deployed: firebase deploy --only firestore:rules,storage --project prod
5. Firestore indexes deployed: firebase deploy --only firestore:indexes --project prod
```

> **Rules and indexes are code.** `firestore.rules`, `storage.rules`, and `firestore.indexes.json` live in the repository and are deployed on every merge to `main`. They are never edited manually in the Firebase Console.

---

### 13.4 Environment Variables

Full variable list: see Section 11.10. Summary of where variables are managed:

| Variable Type | Where Stored |
|---|---|
| Firebase client config (`NEXT_PUBLIC_FIREBASE_*`) | Netlify Dashboard → Environment variables |
| Firebase Admin SDK private key | Netlify Dashboard → Environment variables (server-side only) |
| Resend API key | Netlify Dashboard → Environment variables |
| App URL, App Env | Netlify Dashboard → Environment variables |
| Emulator toggle | `.env.local` only (never committed) |

`.env.local` for local development (never committed to git):
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-staging-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=motorsphere-staging.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=motorsphere-staging
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=motorsphere-staging.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
FIREBASE_ADMIN_PROJECT_ID=motorsphere-staging
FIREBASE_ADMIN_CLIENT_EMAIL=...
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
RESEND_API_KEY=re_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true
```

---

### 13.5 Phase 2 Infrastructure Additions

Firebase handles most background work via Cloud Functions. If tasks exceed Cloud Function limits (9-minute timeout, memory constraints), they can be moved to Cloud Run (Google Cloud — same GCP ecosystem as Firebase):
- **Heavy image processing** — Cloud Run container for batch image compression
- **Scheduled bulk operations** — Cloud Run Jobs
- **External integration polling** — Cloud Run with Pub/Sub trigger

Communication between Firebase and Cloud Run:
- Firestore document writes trigger Cloud Functions which invoke Cloud Run
- Pub/Sub for event-driven architecture
- All within Google Cloud ecosystem — no cross-cloud complexity

---

## 14. Risks & Assumptions

### Assumptions

| # | Assumption | Impact if Wrong |
|---|---|---|
| A1 | Users will trust the platform enough to list vehicles publicly | Core value prop fails; need to invest more heavily in trust mechanisms |
| A2 | Firebase Spark (free) tier is sufficient for MVP traffic | Firestore: 50k reads/day free; Storage: 5GB free; Functions: 125k/month free. Plan to upgrade to Blaze at ~500 active users or significant daily traffic |
| A3 | Admin moderation can be manual at launch | Will bottleneck at scale; automate review queuing early |
| A4 | Email-only auth is sufficient for MVP | If Google OAuth demand is high, prioritise Phase 1b fast |
| A5 | South African users are comfortable with English-only platform | Monitor; Afrikaans and Zulu support may be needed sooner than Phase 3 |
| A6 | Figma design is available and reasonably complete before Base 2 begins | If not, Base 2 (Design System) will be blocked |
| A7 | The team has access to a South African payment gateway before Phase 2 | PayFast merchant account setup takes time; apply early |

---

### Risks

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | **Spam/fake listings** at launch | High | High | Admin moderation queue, listing limits per account, CAPTCHA on submission |
| R2 | **Photo storage costs** scale faster than revenue | Medium | Medium | Enforce file size limits, compress + convert to WebP via Cloud Function, monitor Firebase Storage egress in Google Cloud Console |
| R3 | **POPIA non-compliance** exposes legal liability | Medium | High | Build Privacy Policy, data deletion, and consent flows before launch |
| R4 | **Poor SEO** if listings are client-rendered | Low (mitigated by Next.js SSR) | High | Ensure listing pages use SSR/SSG — do not render via client-only data fetching |
| R5 | **Firebase Security Rules misconfiguration** exposes user data | Low | Critical | Test all Security Rules using Firebase Emulator + `@firebase/rules-unit-testing`; audit rules before launch |
| R6 | **Design inconsistency** if Figma handoff is incomplete | Medium | Medium | Establish design tokens and component library before building pages |
| R7 | **Scope creep** delays MVP | High | High | This document exists to enforce MVP boundaries; revisit weekly |
| R8 | **Email deliverability** issues | Low | Medium | Use Resend with custom domain; set up SPF/DKIM/DMARC records |
| R9 | **South African logistics/payment APIs** are poorly documented | Medium | Medium | Research PayFast, Peach Payments, Courier Guy APIs early in Phase 2 |
| R10 | **Vehicle listing duplication** (same car listed multiple times) | Medium | Medium | Admin flagging, image similarity detection (Phase 2), user reporting |

---

## 15. Phase 1 Build Checklist

> This checklist covers everything required to complete Base 1 → Base 5 (MVP Live). Tick items off as each Base is completed. Do not skip Bases.

### ✅ BASE 1 — Product Foundation *(this document)*
- [x] Product Summary written
- [x] Problem Statement defined
- [x] Target users and personas documented
- [x] User roles and permissions matrix defined
- [x] MVP scope locked
- [x] Out-of-scope items documented
- [x] Core user journeys mapped
- [x] Feature modules defined
- [x] Figma handoff plan established
- [x] Tech stack defined (Firebase pivot applied)
- [x] Firebase Firestore collection architecture planned
- [x] Firebase Auth role strategy planned
- [x] Firebase Security Rules planned
- [x] Cloud Functions strategy planned
- [x] Firebase Emulator Suite strategy planned
- [x] POPIA obligations documented
- [x] Netlify deployment strategy planned (Firebase App Hosting kept as deferred alternative)
- [x] Risks and assumptions captured

---

### ⬜ BASE 2 — UX / Figma Mapping & App Structure Plan
- [ ] Repository structure established (`src/app`, `src/components`, `src/lib`, `src/types`, `src/hooks`, `src/utils`)
- [ ] shadcn/ui installed and configured
- [ ] Figma design tokens mapped to CSS variables in `globals.css` (Tailwind v4 `@theme` blocks)
- [ ] Tailwind theme extended with brand colours and typography
- [ ] Core UI components built: Button, Input, Card, Badge, Modal, Dropdown, Avatar
- [ ] Navigation component: Header (desktop + mobile), Footer
- [ ] Prettier + lint-staged + Husky configured
- [ ] GitHub Actions CI pipeline configured (lint, type-check, build)
- [ ] Netlify site linked to GitHub; preview deployments working
- [ ] `.env.local.example` file created with all Firebase env var keys
- [ ] `README.md` updated with dev setup instructions and Firebase Emulator setup
- [ ] CLAUDE.md created for AI development context

---

### ⬜ BASE 3 — Firebase Setup, Auth & Profiles
- [ ] Firebase project created: `motorsphere-staging` and `motorsphere-prod`
- [ ] Firebase CLI installed and configured (`firebase login`, `.firebaserc` set up)
- [ ] Firebase Emulator Suite configured (`firebase.json`, emulator ports set)
- [ ] Emulator seed data created (test users, sample listings)
- [ ] Firebase client SDK initialised in `src/lib/firebase/client.ts`
- [ ] Firebase Admin SDK initialised in `src/lib/firebase/admin.ts`
- [ ] Emulator connection logic in client SDK (reads `NEXT_PUBLIC_USE_FIREBASE_EMULATORS`)
- [ ] `firestore.rules` written and tested against emulator
- [ ] `storage.rules` written and tested against emulator
- [ ] `firestore.indexes.json` created with all MVP composite indexes
- [ ] `onUserCreate` Cloud Function written: creates `users/{uid}` document, sends welcome email
- [ ] Session cookie API route: `POST /api/auth/session` (ID token → session cookie)
- [ ] Session cookie API route: `DELETE /api/auth/session` (sign out)
- [ ] `proxy.ts` written: verifies session cookie presence, protects dashboard + admin routes (Next.js 16 convention)
- [ ] Register page (`/register`)
- [ ] Login page (`/login`)
- [ ] Forgot password page (`/forgot-password`)
- [ ] Reset password page (`/reset-password`)
- [ ] Email verification handling (`/verify-email`)
- [ ] Auth layout wrapper
- [ ] User profile public page (`/profile/[username]`)
- [ ] Account settings page (`/account/settings`)
- [ ] Avatar upload to Firebase Storage (`avatars/{userId}/avatar.{ext}`)
- [ ] Account deletion flow (with POPIA grace period; `onUserDelete` Cloud Function)
- [ ] Resend configured via Cloud Function; welcome and verification emails working

---

### ⬜ BASE 4 — Vehicle Listings
- [ ] `vehicles` collection Security Rules verified in emulator
- [ ] Vehicle listing composite indexes deployed
- [ ] `onVehicleListingCreate` Cloud Function: status validation, admin notification
- [ ] `onVehicleListingUpdate` Cloud Function: status change email triggers
- [ ] `onImageUpload` Cloud Function: resize + WebP conversion for vehicle images
- [ ] Create vehicle listing page + multi-step form
- [ ] Vehicle listing image upload to Firebase Storage (`vehicles/{userId}/{id}/`)
- [ ] Listing submission → `pending_review` status
- [ ] Vehicle listings browse page with Firestore-backed search + filters
- [ ] Vehicle listing detail page (SSR — reads Firestore via Admin SDK)
- [ ] Edit listing page
- [ ] Delete listing flow
- [ ] Mark as Sold flow
- [ ] My Listings dashboard page
- [ ] Open Graph meta tags on listing detail pages (for social sharing)

---

### ⬜ BASE 5 — Parts Listings
- [ ] `parts` collection Security Rules verified
- [ ] Parts composite indexes deployed (category, compatibleMakes, status)
- [ ] Parts category taxonomy seeded as Firestore documents or static config
- [ ] `onPartsListingCreate` / `onPartsListingUpdate` Cloud Functions
- [ ] Create parts listing page + form
- [ ] Parts listing image upload to Firebase Storage
- [ ] Parts browse page with fitment-based Firestore queries
- [ ] Parts listing detail page (SSR)
- [ ] Edit / delete parts listing flow
- [ ] My Parts Listings in dashboard

---

### ⬜ BASE 6 — Inquiries & Saved Listings
- [ ] `inquiries` and `inquiries/{id}/replies` Security Rules verified
- [ ] `savedListings` Security Rules verified
- [ ] `onInquiryCreate` Cloud Function: email seller
- [ ] `onInquiryReplyCreate` Cloud Function: email buyer
- [ ] Contact Seller button + inquiry modal on listing detail pages
- [ ] Seller reply flow + buyer notification email
- [ ] My Inquiries page (sent and received)
- [ ] Save / unsave listing (heart icon) — optimistic UI, Firestore write
- [ ] My Saved Listings page (reads `savedListings` collection filtered by userId)

---

### ⬜ BASE 7 — Admin Moderation Panel
- [ ] `setUserRole` callable Cloud Function: Admin SDK sets custom claim + Firestore role field
- [ ] `verifyUser` callable Cloud Function
- [ ] `suspendUser` callable Cloud Function: disables Firebase Auth account
- [ ] Admin route group with middleware role check (custom claim `admin` / `super_admin`)
- [ ] Admin dashboard overview (Firestore aggregate reads for stats)
- [ ] Pending listing queue with approve/reject/edit
- [ ] All listings table with Firestore filters
- [ ] User management table (view, set role, suspend, unsuspend)
- [ ] Flagged content queue (`adminFlags` collection)
- [ ] Email notifications on all moderation actions
- [ ] Basic CSV export (client-side from Firestore query results)

---

### ⬜ BASE 8 — Static Pages, POPIA & Launch Prep
- [ ] Homepage (hero, search, category tiles, featured listings)
- [ ] About page
- [ ] How It Works page
- [ ] Contact / Report a Problem page
- [ ] Terms & Conditions (POPIA-reviewed)
- [ ] Privacy Policy (lists Firebase/Google Cloud, Resend, Netlify as data processors)
- [ ] Cookie consent banner (if Firebase Analytics added)
- [ ] Security headers configured in `next.config.ts` (Firebase domains allowlisted in CSP)
- [ ] `robots.txt` and `sitemap.xml` (dynamic — listing pages included)
- [ ] Performance audit (Lighthouse score target: ≥ 90 mobile)
- [ ] Cross-browser testing (Chrome, Safari, Firefox — mobile and desktop)
- [ ] Firebase Security Rules audit — test all rules with `@firebase/rules-unit-testing`
- [ ] Staging environment smoke test (all core journeys on `motorsphere-staging`)
- [ ] Production Firebase project fully configured (Auth, Firestore backups, Functions deployed)
- [ ] DNS and custom domain configured in Netlify
- [ ] Error monitoring configured (Firebase Crashlytics or Sentry)
- [ ] **Launch 🚀**

---

## Document Control

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-05-27 | MotorSphere Team | Initial BASE 1 document |
| 1.1 | 2026-05-27 | MotorSphere Team | Stack pivot: Supabase → Firebase. Replaced Section 11 (Supabase Planning) with full Firebase planning (Auth roles, Firestore collections, Security Rules, Cloud Functions, Emulator, App Hosting). Updated tech stack, deployment, security, risks, and all checklist items. |
| 1.2 | 2026-05-27 | MotorSphere Team | Final stack confirmed. Firebase Blaze plan. Firebase Storage for all uploads. Firebase App Hosting for deployment (deferred). Updated Stack Pivot Note; confirmed Email/Password auth first (Google OAuth Phase 1b); Cloud Functions and App Hosting deferred until needed. All doc references to non-Firebase providers removed. |
| 1.3 | 2026-05-27 | MotorSphere Team | Deployment stack update: Netlify is now the active hosting provider (replaces Firebase App Hosting as primary). Firebase App Hosting kept as deferred alternative. Updated Infrastructure table, Section 11.9, Section 13 (environment strategy, CI/CD, env vars), and all build checklists. Firebase backend unchanged. |

---

*This is a living document. Update it as product decisions evolve. All significant changes should be versioned in the table above.*
