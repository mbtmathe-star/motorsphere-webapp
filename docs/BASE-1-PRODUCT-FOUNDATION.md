# MotorSphere — BASE 1: Product Foundation

> **Stage:** Base 1 — Product Foundation & Architecture Direction
> **Date:** 2026-05-27
> **Status:** Active Planning Document
> **Next Stage:** Base 2 — Design System & Component Architecture

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
11. [Supabase Planning](#11-supabase-planning)
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

> **Note:** Dealership, Workshop, and Insurance roles are scoped to Phase 2. The role system in Supabase should be designed to accommodate them without requiring schema migrations.

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
- Email + password registration and login via Supabase Auth
- Social login: Google OAuth (optional, Phase 1b)
- Email verification flow
- Forgot password / password reset
- Public user profile page (display name, avatar, member since, listing count, review score)
- Private profile settings page (contact details, notification preferences)
- Account deletion with POPIA-compliant data handling

#### 5.2 Vehicle Listings
- Create, edit, publish, pause, and delete vehicle listings
- Listing fields: make, model, year, variant, mileage, transmission, fuel type, colour, condition, price, province, city, description, contact preference
- Up to 20 photos per vehicle listing (Supabase Storage)
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
| Real-time chat (WebSocket) | Phase 2 | Replace async messaging; consider Supabase Realtime |
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
  → Submit → Supabase creates auth user + profile record
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
| Provider | Supabase Auth |
| Methods | Email/password, Google OAuth (Phase 1b) |
| Session strategy | Supabase JWT (httpOnly cookie via SSR) |
| Key routes | `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email` |
| Middleware | `middleware.ts` — protect dashboard, listing creation, admin routes |

---

### Module: PROFILES

| Item | Detail |
|---|---|
| Public profile | `/profile/[username]` — display name, avatar, listings, rating (Phase 2) |
| Private settings | `/account/settings` — name, email, phone, province, avatar upload |
| Avatar storage | Supabase Storage bucket: `avatars` |
| Verification badge | Shown if `profiles.is_verified = true` |

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
| Delivery | Email to seller + stored in `inquiries` table |
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

**MVP Email Notifications (transactional via Supabase + Resend or similar):**

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
2. Developer implements variables in `globals.css` and `tailwind.config.ts`
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
| **Framework** | Next.js (App Router) | 16.x | SSR for SEO (critical for marketplace listings), API routes, image optimisation, Vercel-native |
| **Language** | TypeScript | 5.x | Type safety across frontend + API layer; catches listing schema mismatches early |
| **Styling** | Tailwind CSS | 4.x | Utility-first; v4 uses CSS-native cascade layers (faster, smaller output) |
| **UI Components** | shadcn/ui | Latest | Not a library — copies components into codebase. Full control, Radix primitives underneath, accessible |
| **Backend / DB** | Supabase | Latest | PostgreSQL, Auth, Storage, RLS, Edge Functions — dramatically reduces infrastructure overhead |
| **ORM / Query** | Supabase JS Client + typed schema | — | Generate types from DB schema; consider Drizzle ORM if complex queries needed later |
| **Icons** | Lucide React | Latest | Default icon set for shadcn/ui; consistent, tree-shakeable |
| **Email** | Resend | Latest | Simple API, Next.js SDK, generous free tier (3000 emails/month), reliable deliverability |

### Infrastructure

| Layer | Technology | Rationale |
|---|---|---|
| **Hosting** | Vercel | First-class Next.js support, edge network, preview deployments per PR, free tier sufficient for MVP |
| **Database / Auth** | Supabase (hosted) | Free tier: 500MB DB, 1GB storage, 50k MAU — more than sufficient for MVP |
| **Image Storage** | Supabase Storage | Integrated with RLS; CDN-served. Consider Cloudflare R2 if egress costs become an issue at scale |
| **Version Control** | GitHub | CI/CD via GitHub Actions; Vercel auto-deploys from `main` |
| **Workers / Integrations** | Render (Phase 2+) | For long-running jobs (image processing, logistics polling, data sync) that exceed Vercel function limits |

### Dev Tooling

| Tool | Purpose |
|---|---|
| ESLint + Next.js config | Linting (already configured) |
| Prettier | Code formatting (add in Base 2) |
| Husky + lint-staged | Pre-commit hooks (add in Base 2) |
| Supabase CLI | Local DB migrations, type generation, edge function development |
| GitHub Actions | CI: lint, type check, build on PR |

### Considered & Deferred

| Technology | Why Deferred |
|---|---|
| Prisma ORM | Adds complexity for MVP; Supabase client is sufficient until complex query needs arise |
| tRPC | Excellent type safety end-to-end, but adds setup overhead; revisit for Phase 2 |
| React Query / TanStack Query | Worth adding in Phase 2 for caching, background refetch, optimistic updates |
| Stripe | South African card payments better served by PayFast/Peach Payments; Phase 2 |
| Algolia / Typesense | Supabase full-text search (pg_fts) sufficient for MVP; migrate if search performance degrades |

---

## 11. Supabase Planning

### 11.1 Database Schema (MVP)

> All tables include `created_at` and `updated_at` timestamps. UUIDs are used for all primary keys.

#### `profiles`
```sql
id              uuid PRIMARY KEY REFERENCES auth.users(id)
username        text UNIQUE NOT NULL
display_name    text
avatar_url      text
phone           text  -- encrypted at rest
province        text  -- SA province enum
bio             text
is_verified     boolean DEFAULT false
role            text DEFAULT 'user'  -- 'user' | 'verified_seller' | 'admin' | 'super_admin'
is_suspended    boolean DEFAULT false
listing_count   integer DEFAULT 0  -- denormalised for performance
created_at      timestamptz
updated_at      timestamptz
```

#### `vehicle_listings`
```sql
id              uuid PRIMARY KEY
user_id         uuid REFERENCES profiles(id)
make            text NOT NULL
model           text NOT NULL
year            integer NOT NULL
variant         text
mileage         integer
transmission    text  -- enum: manual | automatic | semi-automatic
fuel_type       text  -- enum: petrol | diesel | hybrid | electric | lpg
colour          text
condition       text  -- enum: excellent | good | fair | salvage
price           integer NOT NULL  -- in ZAR cents
negotiable      boolean DEFAULT false
province        text NOT NULL
city            text
description     text
contact_pref    text DEFAULT 'platform_only'
status          text DEFAULT 'draft'  -- draft | pending_review | active | paused | sold | rejected
rejection_note  text
views_count     integer DEFAULT 0
featured        boolean DEFAULT false
created_at      timestamptz
updated_at      timestamptz
published_at    timestamptz
```

#### `parts_listings`
```sql
id              uuid PRIMARY KEY
user_id         uuid REFERENCES profiles(id)
title           text NOT NULL
category        text NOT NULL  -- parts category taxonomy slug
condition       text NOT NULL  -- new | used | refurbished
price           integer NOT NULL
quantity        integer DEFAULT 1
province        text NOT NULL
city            text
description     text
compatible_makes    text[]  -- array: ['toyota', 'ford']
compatible_models   text[]
compatible_years    int4range  -- year range: [2005, 2015)
status          text DEFAULT 'draft'
rejection_note  text
views_count     integer DEFAULT 0
created_at      timestamptz
updated_at      timestamptz
published_at    timestamptz
```

#### `listing_images`
```sql
id              uuid PRIMARY KEY
listing_id      uuid  -- polymorphic: vehicle or part
listing_type    text  -- 'vehicle' | 'part'
storage_path    text NOT NULL  -- Supabase Storage path
url             text  -- public CDN URL (cached)
sort_order      integer DEFAULT 0
is_primary      boolean DEFAULT false
created_at      timestamptz
```

#### `inquiries`
```sql
id              uuid PRIMARY KEY
listing_id      uuid  -- polymorphic
listing_type    text  -- 'vehicle' | 'part'
sender_id       uuid REFERENCES profiles(id)
receiver_id     uuid REFERENCES profiles(id)
message         text NOT NULL
is_read         boolean DEFAULT false
created_at      timestamptz
```

#### `inquiry_replies`
```sql
id              uuid PRIMARY KEY
inquiry_id      uuid REFERENCES inquiries(id)
sender_id       uuid REFERENCES profiles(id)
message         text NOT NULL
created_at      timestamptz
```

#### `saved_listings`
```sql
id              uuid PRIMARY KEY
user_id         uuid REFERENCES profiles(id)
listing_id      uuid
listing_type    text  -- 'vehicle' | 'part'
created_at      timestamptz
UNIQUE (user_id, listing_id, listing_type)
```

#### `admin_flags`
```sql
id              uuid PRIMARY KEY
listing_id      uuid
listing_type    text
flagged_by      uuid REFERENCES profiles(id)  -- null if auto-flagged
reason          text
resolved        boolean DEFAULT false
resolved_by     uuid REFERENCES profiles(id)
resolved_at     timestamptz
created_at      timestamptz
```

---

### 11.2 Row Level Security (RLS) Strategy

RLS is critical for MotorSphere — all user data must be protected at the database layer, not only at the API layer.

| Table | Policy Summary |
|---|---|
| `profiles` | Public read; owner can update own row; admin can update any row |
| `vehicle_listings` | Public read for `active` listings; owner CRUD on own; admin CRUD on any |
| `parts_listings` | Same as vehicle_listings |
| `listing_images` | Public read; owner can insert/delete own listing images |
| `inquiries` | Sender and receiver can read; sender can insert; receiver can mark read |
| `inquiry_replies` | Participants of inquiry thread can read and insert |
| `saved_listings` | Owner can read/insert/delete own |
| `admin_flags` | Admins full access; users can insert (flag) only |

**Key RLS Pattern:**
```sql
-- Example: users can only update their own profile
CREATE POLICY "Users update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Example: only active listings visible to public
CREATE POLICY "Public read active vehicle listings"
ON vehicle_listings FOR SELECT
USING (status = 'active' OR auth.uid() = user_id);
```

---

### 11.3 Supabase Storage Buckets

| Bucket | Access | Notes |
|---|---|---|
| `avatars` | Public | User profile photos. Path: `{user_id}/avatar.{ext}` |
| `vehicle-images` | Public | Vehicle listing photos. Path: `{user_id}/{listing_id}/{order}.{ext}` |
| `parts-images` | Public | Parts listing photos. Path: `{user_id}/{listing_id}/{order}.{ext}` |
| `admin-docs` | Private | Internal documents, verification uploads |

> **Image size limits:** Enforce in API layer and Supabase Storage policies. Max 5MB per image. Compress and resize on upload using `next/image` sharp pipeline.

---

### 11.4 Supabase Auth Configuration

| Setting | Value |
|---|---|
| Email confirmation | Required (verify before full access) |
| JWT expiry | 1 hour (default) |
| Refresh token rotation | Enabled |
| Google OAuth | Configure in Phase 1b |
| Password minimum length | 8 characters |
| Rate limiting | Enable Supabase built-in rate limiting |
| Custom SMTP | Configure Resend as SMTP provider |

---

### 11.5 Type Generation

Use Supabase CLI to generate TypeScript types from the database schema:

```bash
supabase gen types typescript --local > src/types/database.types.ts
```

This generates fully typed query responses — no manual type maintenance.

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
- How data is stored and protected (Supabase, Vercel, Resend)
- How long data is retained
- User rights under POPIA
- Contact details for the Information Officer
- Cookie policy
- Third-party services used

#### Security Measures

| Measure | Implementation |
|---|---|
| HTTPS everywhere | Vercel enforces HTTPS; HSTS headers |
| Auth tokens | Supabase JWT in httpOnly cookies (not localStorage) |
| RLS at database level | All Supabase tables protected by RLS policies |
| Input validation | Zod schemas on all API routes and form submissions |
| XSS prevention | React's default escaping + Content Security Policy headers |
| CSRF protection | Next.js App Router + SameSite cookie defaults |
| Rate limiting | Supabase built-in + Next.js middleware for API routes |
| File upload validation | Type and size checks before Supabase Storage write |
| Admin routes | Protected by middleware + role check in Supabase |
| Environment variables | All secrets in Vercel env vars; never in codebase |
| Dependency scanning | GitHub Dependabot + periodic `npm audit` |

---

### 12.4 Security Headers (next.config.ts)

```typescript
// To be configured in Base 2
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // Content-Security-Policy — configure per environment
];
```

---

## 13. Deployment Planning

### 13.1 Environment Strategy

| Environment | Hosting | Branch | Purpose |
|---|---|---|---|
| **Local Development** | localhost:3000 | feature/* branches | Development and testing |
| **Preview** | Vercel Preview | Any PR to `main` | PR review, stakeholder sign-off |
| **Production** | Vercel Production | `main` | Live platform |

> **Rule:** Nothing goes to production without a PR review and passing CI checks.

---

### 13.2 Supabase Environment Strategy

| Environment | Supabase Project | Notes |
|---|---|---|
| **Local** | Supabase CLI (Docker) | `supabase start` — full local stack |
| **Preview/Staging** | Separate Supabase project | Seeded with test data |
| **Production** | Production Supabase project | Real user data, full backups enabled |

> Using separate Supabase projects for staging and production is strongly recommended — it prevents accidental data loss and allows testing migrations safely.

---

### 13.3 CI/CD Pipeline (GitHub Actions)

**On Pull Request:**
```
1. npm ci
2. TypeScript type check (tsc --noEmit)
3. ESLint
4. Build check (next build)
5. Vercel preview deployment
```

**On merge to main:**
```
1. All PR checks must pass
2. Vercel auto-deploys to production
3. Supabase migration runs (via Supabase CLI in CI)
```

---

### 13.4 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # Server-side only, never exposed to client

# Resend (email)
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_ENV=          # development | preview | production

# Optional (Phase 1b)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
```

---

### 13.5 Phase 2 Infrastructure Additions (Render)

When the platform requires long-running background work, Render will host:
- **Image processing worker** — compress, resize, watermark uploaded images
- **Notification worker** — queue-based email/push notifications
- **Integration microservices** — logistics quote APIs, VIN decode, insurance broker APIs
- **Scheduled jobs** — stale listing cleanup, expired listing notifications

Communication between Next.js (Vercel) and workers (Render) via:
- Supabase Realtime or Postgres LISTEN/NOTIFY
- Simple REST API with shared secret
- Consider BullMQ + Redis (Render-hosted) for job queue

---

## 14. Risks & Assumptions

### Assumptions

| # | Assumption | Impact if Wrong |
|---|---|---|
| A1 | Users will trust the platform enough to list vehicles publicly | Core value prop fails; need to invest more heavily in trust mechanisms |
| A2 | Supabase free tier is sufficient for MVP traffic | May need to upgrade; plan for this at ~200 active listings |
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
| R2 | **Photo storage costs** scale faster than revenue | Medium | Medium | Enforce file size limits, compress on upload, monitor Supabase Storage egress |
| R3 | **POPIA non-compliance** exposes legal liability | Medium | High | Build Privacy Policy, data deletion, and consent flows before launch |
| R4 | **Poor SEO** if listings are client-rendered | Low (mitigated by Next.js SSR) | High | Ensure listing pages use SSR/SSG — do not render via client-only data fetching |
| R5 | **Supabase RLS misconfiguration** exposes user data | Low | Critical | Audit all RLS policies before launch; write integration tests against them |
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
- [x] Tech stack recommended
- [x] Supabase schema planned
- [x] POPIA obligations documented
- [x] Deployment strategy planned
- [x] Risks and assumptions captured

---

### ⬜ BASE 2 — Project Setup & Design System
- [ ] Repository structure established (`src/app`, `src/components`, `src/lib`, `src/types`, `src/hooks`, `src/utils`)
- [ ] shadcn/ui installed and configured
- [ ] Figma design tokens mapped to CSS variables in `globals.css`
- [ ] Tailwind theme extended with brand colours and typography
- [ ] Core UI components built: Button, Input, Card, Badge, Modal, Dropdown, Avatar
- [ ] Navigation component: Header (desktop + mobile), Footer
- [ ] Prettier + lint-staged + Husky configured
- [ ] GitHub Actions CI pipeline configured (lint, type-check, build)
- [ ] Vercel project linked; preview deployments working
- [ ] `.env.local.example` file created with all required variables
- [ ] `README.md` updated with dev setup instructions
- [ ] CLAUDE.md created for AI development context

---

### ⬜ BASE 3 — Auth & Profiles
- [ ] Supabase project created (local + staging + production)
- [ ] Supabase CLI configured; initial migrations written
- [ ] `profiles` table created with RLS policies
- [ ] Supabase client initialised in `src/lib/supabase/`
- [ ] TypeScript types generated from schema
- [ ] Middleware protecting authenticated routes
- [ ] Register page (`/register`)
- [ ] Login page (`/login`)
- [ ] Forgot password page (`/forgot-password`)
- [ ] Reset password page (`/reset-password`)
- [ ] Email verification handling (`/verify-email`)
- [ ] Auth layout wrapper
- [ ] User profile public page (`/profile/[username]`)
- [ ] Account settings page (`/account/settings`)
- [ ] Avatar upload to Supabase Storage
- [ ] Account deletion flow (with POPIA grace period)
- [ ] Resend configured; welcome and verification emails working

---

### ⬜ BASE 4 — Vehicle Listings
- [ ] `vehicle_listings` and `listing_images` tables + RLS policies
- [ ] List vehicle listing page + form (multi-step)
- [ ] Vehicle listing image upload (up to 20, primary photo selection)
- [ ] Listing submission → `pending_review` status
- [ ] Vehicle listings browse page with search + filters
- [ ] Vehicle listing detail page (SSR)
- [ ] Edit listing page
- [ ] Delete listing flow
- [ ] Mark as Sold flow
- [ ] My Listings dashboard page
- [ ] Open Graph meta tags on listing detail pages (for social sharing)

---

### ⬜ BASE 5 — Parts Listings
- [ ] `parts_listings` table + RLS policies
- [ ] Parts category taxonomy seeded in DB
- [ ] List parts listing page + form
- [ ] Parts listing image upload
- [ ] Parts browse page with fitment-based search
- [ ] Parts listing detail page (SSR)
- [ ] Edit / delete parts listing flow
- [ ] My Parts Listings in dashboard

---

### ⬜ BASE 6 — Inquiries & Saved Listings
- [ ] `inquiries` and `inquiry_replies` tables + RLS
- [ ] `saved_listings` table + RLS
- [ ] Contact Seller button + inquiry modal on listing detail pages
- [ ] Inquiry notification email to seller
- [ ] Seller reply flow + buyer notification email
- [ ] My Inquiries page (sent and received)
- [ ] Save / unsave listing (heart icon) on listing cards + detail pages
- [ ] My Saved Listings page

---

### ⬜ BASE 7 — Admin Moderation Panel
- [ ] Admin route group with middleware role check
- [ ] Admin dashboard overview (stats)
- [ ] Pending listing queue with approve/reject/edit
- [ ] All listings table with filters
- [ ] User management table (view, suspend, unsuspend, ban)
- [ ] Flagged content queue
- [ ] Email notifications on moderation actions
- [ ] Basic CSV export for listings and users

---

### ⬜ BASE 8 — Static Pages, POPIA & Launch Prep
- [ ] Homepage (hero, search, category tiles, featured listings)
- [ ] About page
- [ ] How It Works page
- [ ] Contact / Report a Problem page
- [ ] Terms & Conditions (reviewed by legal or reviewed with POPIA in mind)
- [ ] Privacy Policy (POPIA-compliant)
- [ ] Cookie consent banner (if analytics added)
- [ ] Security headers configured in `next.config.ts`
- [ ] `robots.txt` and `sitemap.xml` (dynamic, listing pages included)
- [ ] Performance audit (Lighthouse score target: ≥ 90 mobile)
- [ ] Cross-browser testing (Chrome, Safari, Firefox — mobile and desktop)
- [ ] Staging environment smoke test
- [ ] Production environment variables set in Vercel
- [ ] DNS and custom domain configured
- [ ] Error monitoring configured (Sentry or Vercel built-in)
- [ ] **Launch 🚀**

---

## Document Control

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-05-27 | MotorSphere Team | Initial BASE 1 document |

---

*This is a living document. Update it as product decisions evolve. All significant changes should be versioned in the table above.*
