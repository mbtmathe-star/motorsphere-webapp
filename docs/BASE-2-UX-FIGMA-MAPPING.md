# MotorSphere — BASE 2: UX / Figma Mapping & App Structure Plan

> **Stage:** Base 2 — UX Architecture, Figma Mapping & Design System Plan
> **Date:** 2026-05-27
> **Status:** Active Planning Document — Firebase pivot applied 2026-05-27
> **Depends on:** [BASE-1-PRODUCT-FOUNDATION.md](./BASE-1-PRODUCT-FOUNDATION.md)
> **Next Stage:** Base 3 — Firebase Setup, shadcn/ui Install & Auth

---

> ### ⚡ Stack Pivot Note — Supabase → Firebase (2026-05-27)
>
> The backend has moved from Supabase (PostgreSQL + RLS) to Firebase (Firestore + Auth + Storage + Security Rules + Cloud Functions). See BASE-1 Section 11 for the full Firebase architecture.
>
> **Impact on this document (BASE-2):**
> - All API routes now call Firebase SDK methods instead of Supabase client methods — the route shapes are the same, the implementation layer changes
> - `src/lib/supabase/` → `src/lib/firebase/` (client SDK init, Admin SDK init, emulator config)
> - `src/types/database.types.ts` (Supabase auto-generated) → `src/types/firestore.types.ts` (manually maintained TypeScript interfaces matching Firestore document shapes from BASE-1 Section 11.3)
> - Session management: Firebase ID token → httpOnly session cookie via `/api/auth/session` (not Supabase JWT cookies)
> - Middleware: verifies Firebase session cookie via Admin SDK (not Supabase `createServerClient`)
> - Base 3 starts with Firebase Emulator setup, not Supabase CLI
>
> **What does not change in this document:**
> Tailwind v4 CSS-first tokens, shadcn/ui compatibility layer, route groups, SSR listing detail pages, skeleton loaders, mobile-first layout, SA ZAR price formatting, component hierarchy, accessibility rules, and all Figma/design system decisions.

---


---

## Table of Contents

1. [Figma Handoff Checklist](#1-figma-handoff-checklist)
2. [Figma Screen Inventory Template](#2-figma-screen-inventory-template)
3. [Route Mapping](#3-route-mapping)
4. [Component Mapping](#4-component-mapping)
5. [Design Token Plan](#5-design-token-plan)
6. [shadcn/ui Component Strategy](#6-shadcnui-component-strategy)
7. [Tailwind Theme Plan](#7-tailwind-theme-plan)
8. [Responsive Layout Rules](#8-responsive-layout-rules)
9. [Navigation Structure](#9-navigation-structure)
10. [Dashboard Layout Structure](#10-dashboard-layout-structure)
11. [Admin Dashboard Layout Structure](#11-admin-dashboard-layout-structure)
12. [Marketplace Card Design System](#12-marketplace-card-design-system)
13. [Forms and Validation UI Rules](#13-forms-and-validation-ui-rules)
14. [Empty States, Loading States, and Error States](#14-empty-states-loading-states-and-error-states)
15. [Accessibility Checklist](#15-accessibility-checklist)
16. [Base 2 Implementation Checklist](#16-base-2-implementation-checklist)

---

## 1. Figma Handoff Checklist

> The Figma file is not directly accessible by the development environment. Use this checklist to extract and supply the design inputs needed to begin Base 3. Work through each item with the designer before the first component is coded.

### 1.1 — Colour Tokens

Provide the following, ideally as exact hex/OKLCH/HSL values or exported JSON tokens:

```
[ ] Primary brand colour           (main CTA, links, active nav)
[ ] Primary hover state            (darker shade of primary)
[ ] Primary foreground             (text on primary-coloured surfaces)
[ ] Secondary brand colour         (secondary buttons, accents)
[ ] Secondary foreground
[ ] Background — page              (main page background, light mode)
[ ] Background — card              (card/surface background)
[ ] Background — muted             (sidebar, secondary sections)
[ ] Foreground — body text         (main readable text)
[ ] Foreground — muted text        (labels, captions, secondary info)
[ ] Foreground — placeholder       (form field placeholder text)
[ ] Border — default               (card edges, dividers, inputs)
[ ] Border — focus                 (focused input ring)
[ ] Semantic — success             (active listing, confirmed actions)
[ ] Semantic — warning             (pending review, caution states)
[ ] Semantic — error/destructive   (rejections, form errors, danger buttons)
[ ] Semantic — info                (informational banners)
[ ] Semantic — sold                (sold vehicle badge)
[ ] Dark mode variants             (all of the above, dark theme)
```

---

### 1.2 — Typography

```
[ ] Primary font family            (body, headings — name + Google Fonts or licence)
[ ] Monospace font family          (for prices, codes — if any)
[ ] Heading scale                  (H1 → H6: size + weight + line-height per breakpoint)
[ ] Body text size                 (default paragraph size + line-height)
[ ] Small / caption text size
[ ] Label text size                (form labels)
[ ] Price display style            (vehicles: large, bold ZAR formatting)
[ ] Badge / status text style      (all-caps? size? weight?)
[ ] Font weights used              (e.g. 400, 500, 600, 700)
[ ] Letter spacing rules           (any tight/loose exceptions?)
```

---

### 1.3 — Spacing & Layout

```
[ ] Base spacing unit              (4px system or 8px system?)
[ ] Page max-width                 (e.g. 1280px, 1440px, or fluid?)
[ ] Page horizontal gutter         (mobile / tablet / desktop)
[ ] Section vertical padding       (between major page sections)
[ ] Card internal padding          (inner padding of listing cards)
[ ] Grid columns                   (marketplace grid: 2 col? 3 col? 4 col?)
[ ] Grid gap                       (between cards in grid)
[ ] Form field vertical gap        (between form fields)
[ ] Input height                   (standard input field height)
[ ] Button height                  (small / default / large)
```

---

### 1.4 — Radius & Shadow

```
[ ] Border radius — buttons        (sharp/rounded/pill?)
[ ] Border radius — cards          (matches button or different?)
[ ] Border radius — inputs         (matches cards or different?)
[ ] Border radius — badges         (likely pill: 9999px)
[ ] Border radius — modals/dialogs
[ ] Shadow — card default          (elevation level for listing cards)
[ ] Shadow — card hover            (hover elevation)
[ ] Shadow — modal                 (dialog elevation)
[ ] Shadow — dropdown              (menu/popover elevation)
```

---

### 1.5 — Iconography

```
[ ] Icon library used              (Lucide? Heroicons? Custom? Mixed?)
[ ] Icon sizes used                (12px, 16px, 20px, 24px?)
[ ] Icon stroke weight             (1px, 1.5px, 2px?)
[ ] Custom icons list              (any brand-specific icons not in the library)
[ ] Icon + label pairing rules     (gap, alignment)
[ ] Favicon and brand mark assets  (SVG preferred)
```

---

### 1.6 — Component Exports Needed

Provide screenshots or Figma exports for each component at mobile (375px) and desktop (1280px):

```
[ ] Primary button (default, hover, focus, disabled, loading)
[ ] Secondary button
[ ] Ghost/outline button
[ ] Destructive button
[ ] Text input (empty, focused, filled, error, disabled)
[ ] Search bar (with icon, with clear button)
[ ] Select/dropdown
[ ] Textarea
[ ] Checkbox and radio
[ ] Form field with label + error message
[ ] Vehicle listing card (grid view)
[ ] Vehicle listing card (list view)
[ ] Parts listing card
[ ] Listing status badge (Active / Pending / Sold / Paused / Rejected)
[ ] Verified seller badge
[ ] Price display component (ZAR format)
[ ] User avatar (small / medium / large, with fallback initials)
[ ] Navigation header (desktop — authenticated and unauthenticated)
[ ] Navigation header (mobile — open and closed)
[ ] Footer
[ ] Hero section (homepage)
[ ] Search bar (homepage hero variant)
[ ] Category tiles (homepage)
[ ] Inquiry modal / form
[ ] Toast / notification
[ ] Empty state (with illustration or icon)
[ ] Skeleton loader (card)
[ ] Image gallery / photo viewer
[ ] Admin listing review card
[ ] Admin stats overview cards
[ ] Pagination component
[ ] Breadcrumb
```

---

### 1.7 — Page Designs Needed

Provide full-page Figma frames or screenshots for:

```
[ ] Homepage (mobile + desktop)
[ ] Vehicle browse page (mobile + desktop)
[ ] Vehicle detail page (mobile + desktop)
[ ] Parts browse page
[ ] Parts detail page
[ ] Register / Login pages
[ ] User dashboard — overview
[ ] User dashboard — my listings
[ ] Create vehicle listing (step 1, 2, 3)
[ ] My saved listings
[ ] My inquiries
[ ] Account settings
[ ] Admin dashboard — overview
[ ] Admin — pending listings queue
[ ] Admin — listing review detail
[ ] Admin — user list
[ ] 404 error page
[ ] General error page
```

---

### 1.8 — Brand Assets

```
[ ] Wordmark / logo (SVG + PNG)    (light and dark variants)
[ ] Logo mark / icon only          (for favicon, app icon, small spaces)
[ ] OG image template              (1200×630px for social sharing)
[ ] Loading/splash screen          (if applicable)
[ ] Illustration style             (for empty states — flat? line-art? photographic?)
[ ] Imagery direction              (vehicle photography style: studio? real SA streets?)
[ ] Tone guidance                  (bold and confident? clean and premium? approachable?)
```

> **If Figma is not yet complete:** Prioritise items 1.1 (colours), 1.2 (typography), 1.4 (radii/shadow), and 1.6 (Button, Input, Card components). These are the minimum needed to begin building the design system in code.

---

## 2. Figma Screen Inventory Template

> Fill in this table as each Figma frame is reviewed. Track which screens are designed, which need to be built, and whether any need UX improvements before coding.

| Screen | Route | Figma Status | Mobile Frame | Desktop Frame | Notes / UX Concerns |
|---|---|---|---|---|---|
| Homepage | `/` | ⬜ Pending | — | — | — |
| Vehicle Browse | `/vehicles` | ⬜ Pending | — | — | — |
| Vehicle Detail | `/vehicles/[id]` | ⬜ Pending | — | — | — |
| Parts Browse | `/parts` | ⬜ Pending | — | — | — |
| Parts Detail | `/parts/[id]` | ⬜ Pending | — | — | — |
| Public Profile | `/profile/[username]` | ⬜ Pending | — | — | — |
| Login | `/login` | ⬜ Pending | — | — | — |
| Register | `/register` | ⬜ Pending | — | — | — |
| Forgot Password | `/forgot-password` | ⬜ Pending | — | — | — |
| Reset Password | `/reset-password` | ⬜ Pending | — | — | — |
| Email Verify | `/verify-email` | ⬜ Pending | — | — | — |
| Dashboard Overview | `/dashboard` | ⬜ Pending | — | — | — |
| My Listings | `/dashboard/listings` | ⬜ Pending | — | — | — |
| New Vehicle Listing | `/dashboard/listings/new/vehicle` | ⬜ Pending | — | — | Multi-step |
| New Parts Listing | `/dashboard/listings/new/parts` | ⬜ Pending | — | — | Multi-step |
| Edit Listing | `/dashboard/listings/[id]/edit` | ⬜ Pending | — | — | — |
| My Inquiries | `/dashboard/inquiries` | ⬜ Pending | — | — | — |
| Saved Listings | `/dashboard/saved` | ⬜ Pending | — | — | — |
| Account Settings | `/account/settings` | ⬜ Pending | — | — | — |
| Admin Overview | `/admin` | ⬜ Pending | — | — | Desktop-primary |
| Admin Pending Queue | `/admin/listings/pending` | ⬜ Pending | — | — | — |
| Admin All Listings | `/admin/listings` | ⬜ Pending | — | — | — |
| Admin Listing Review | `/admin/listings/[id]` | ⬜ Pending | — | — | — |
| Admin Users | `/admin/users` | ⬜ Pending | — | — | — |
| Admin User Detail | `/admin/users/[id]` | ⬜ Pending | — | — | — |
| Admin Flags | `/admin/flags` | ⬜ Pending | — | — | — |
| Admin Reports | `/admin/reports` | ⬜ Pending | — | — | — |
| About | `/about` | ⬜ Pending | — | — | Static |
| How It Works | `/how-it-works` | ⬜ Pending | — | — | Static |
| Contact | `/contact` | ⬜ Pending | — | — | — |
| Terms & Conditions | `/terms` | ⬜ Pending | — | — | Legal |
| Privacy Policy | `/privacy` | ⬜ Pending | — | — | Legal/POPIA |
| 404 Page | `not-found` | ⬜ Pending | — | — | — |
| Error Page | `error` | ⬜ Pending | — | — | — |

**Status Legend:** ⬜ Pending | 🟡 In Figma (needs review) | 🟢 Reviewed & approved | 🔴 UX issues flagged | ✅ Built

---

## 3. Route Mapping

### 3.1 Next.js App Router Directory Structure

```
src/app/
│
├── (marketing)/                        # Route group: marketing layout (header + footer only)
│   ├── layout.tsx                      # Marketing layout — full nav, standard footer
│   ├── page.tsx                        # GET /          → Homepage
│   ├── about/
│   │   └── page.tsx                    # GET /about
│   ├── how-it-works/
│   │   └── page.tsx                    # GET /how-it-works
│   ├── contact/
│   │   └── page.tsx                    # GET /contact
│   ├── terms/
│   │   └── page.tsx                    # GET /terms
│   └── privacy/
│       └── page.tsx                    # GET /privacy
│
├── (marketplace)/                      # Route group: marketplace layout (same as marketing)
│   ├── layout.tsx                      # Marketplace layout — inherits marketing layout
│   ├── vehicles/
│   │   ├── page.tsx                    # GET /vehicles        → Browse vehicles
│   │   └── [id]/
│   │       └── page.tsx                # GET /vehicles/[id]   → Vehicle detail (SSR)
│   ├── parts/
│   │   ├── page.tsx                    # GET /parts           → Browse parts
│   │   └── [id]/
│   │       └── page.tsx                # GET /parts/[id]      → Part detail (SSR)
│   └── profile/
│       └── [username]/
│           └── page.tsx                # GET /profile/[username] → Public profile
│
├── (auth)/                             # Route group: auth layout (centered card, no main nav)
│   ├── layout.tsx                      # Auth layout — logo, centered form card, link to home
│   ├── login/
│   │   └── page.tsx                    # GET /login
│   ├── register/
│   │   └── page.tsx                    # GET /register
│   ├── forgot-password/
│   │   └── page.tsx                    # GET /forgot-password
│   ├── reset-password/
│   │   └── page.tsx                    # GET /reset-password  (reads ?token from URL)
│   └── verify-email/
│       └── page.tsx                    # GET /verify-email    (reads ?token from URL)
│
├── (dashboard)/                        # Route group: authenticated user dashboard
│   ├── layout.tsx                      # Dashboard layout — sidebar + top bar
│   ├── dashboard/
│   │   └── page.tsx                    # GET /dashboard       → User overview
│   ├── dashboard/
│   │   └── listings/
│   │       ├── page.tsx                # GET /dashboard/listings
│   │       ├── new/
│   │       │   ├── vehicle/
│   │       │   │   └── page.tsx        # GET /dashboard/listings/new/vehicle
│   │       │   └── parts/
│   │       │       └── page.tsx        # GET /dashboard/listings/new/parts
│   │       └── [id]/
│   │           └── edit/
│   │               └── page.tsx        # GET /dashboard/listings/[id]/edit
│   ├── dashboard/
│   │   └── inquiries/
│   │       └── page.tsx                # GET /dashboard/inquiries
│   └── dashboard/
│       └── saved/
│           └── page.tsx                # GET /dashboard/saved
├── account/
│   ├── settings/
│   │   └── page.tsx                    # GET /account/settings
│   └── verification/
│       └── page.tsx                    # GET /account/verification
│
├── (admin)/                            # Route group: admin panel
│   ├── layout.tsx                      # Admin layout — admin sidebar + top bar
│   └── admin/
│       ├── page.tsx                    # GET /admin            → Admin overview
│       ├── listings/
│       │   ├── page.tsx                # GET /admin/listings
│       │   ├── pending/
│       │   │   └── page.tsx            # GET /admin/listings/pending
│       │   └── [id]/
│       │       └── page.tsx            # GET /admin/listings/[id]
│       ├── users/
│       │   ├── page.tsx                # GET /admin/users
│       │   └── [id]/
│       │       └── page.tsx            # GET /admin/users/[id]
│       ├── flags/
│       │   └── page.tsx                # GET /admin/flags
│       └── reports/
│           └── page.tsx                # GET /admin/reports
│
├── api/                                # API Routes
│   ├── auth/
│   │   ├── session/
│   │   │   └── route.ts                # POST: ID token → session cookie | DELETE: sign out
│   │   └── callback/
│   │       └── route.ts                # Google OAuth callback (Phase 1b)
│   ├── listings/
│   │   ├── vehicles/
│   │   │   └── route.ts                # POST /api/listings/vehicles (writes to Firestore)
│   │   ├── vehicles/[id]/
│   │   │   └── route.ts                # GET/PUT/DELETE /api/listings/vehicles/[id]
│   │   ├── parts/
│   │   │   └── route.ts                # POST /api/listings/parts
│   │   └── parts/[id]/
│   │       └── route.ts                # GET/PUT/DELETE /api/listings/parts/[id]
│   ├── inquiries/
│   │   └── route.ts                    # POST /api/inquiries (writes Firestore; Cloud Function sends email)
│   ├── saved/
│   │   └── route.ts                    # GET/POST/DELETE /api/saved
│   ├── upload/
│   │   └── route.ts                    # POST /api/upload (generates Firebase Storage upload URL)
│   └── admin/
│       ├── listings/
│       │   └── [id]/
│       │       └── route.ts            # Admin approve/reject (updates Firestore status)
│       └── users/
│           └── [id]/
│               └── route.ts            # Admin suspend/set-role (calls Firebase Admin SDK)
│
├── not-found.tsx                       # 404 page
├── error.tsx                           # Global error boundary
├── loading.tsx                         # Global suspense loading
└── middleware.ts                       # Auth + route protection (at src/ root, not app/)
```

> **Note:** `middleware.ts` lives at `src/middleware.ts`, not inside `app/`.

---

### 3.2 Route Protection Rules

| Route Pattern | Rule | Redirect If Fails |
|---|---|---|
| `/dashboard/*` | Must be authenticated | `/login?next=/dashboard` |
| `/account/*` | Must be authenticated | `/login?next=/account/settings` |
| `/admin/*` | Must be authenticated + role `admin` or `super_admin` | `/login` (not dashboard — prevent role info leak) |
| `/login`, `/register` | Must NOT be authenticated | `/dashboard` |
| All others | Public — no restriction | — |

**Implementation:** `src/middleware.ts` calls `auth.verifySessionCookie()` via Firebase Admin SDK to check session. Role check for `/admin/*` reads the `role` custom claim from the verified token — no extra Firestore read needed.

---

### 3.3 SEO & Rendering Strategy

| Route | Rendering | Reason |
|---|---|---|
| `/` | ISR (revalidate: 300s) | Featured listings update periodically |
| `/vehicles` | SSR | Dynamic search params, always fresh |
| `/vehicles/[id]` | SSR | Listing must show current status (active/sold) |
| `/parts` | SSR | Dynamic search/filter |
| `/parts/[id]` | SSR | Current status required |
| `/profile/[username]` | SSR | Listing count, active listings |
| `/about`, `/how-it-works`, etc. | SSG (static) | Never changes |
| `/dashboard/*` | Client (no crawling needed) | Authenticated, dynamic |
| `/admin/*` | Client | Authenticated, dynamic |

> **Critical:** All listing detail pages MUST be server-rendered. Client-rendered listing pages will not be indexed by Google — this is a high-traffic SEO surface.

---

## 4. Component Mapping

### 4.1 Source of Truth: Component Hierarchy

```
src/
├── components/
│   ├── ui/                  ← shadcn/ui base components (do not customise here)
│   ├── layout/              ← Structural layout components
│   ├── marketplace/         ← Marketplace-specific (search, filters, tiles)
│   ├── listings/            ← Listing cards, galleries, detail views
│   ├── forms/               ← Multi-step forms, custom form controls
│   ├── admin/               ← Admin panel components
│   ├── shared/              ← Reusable app-wide components
│   └── providers/           ← Context providers (Auth, Theme, Toast)
├── hooks/                   ← Custom React hooks
├── lib/                     ← Utilities, Firebase client + Admin SDK, validators
├── types/                   ← TypeScript type definitions
└── utils/                   ← Pure helper functions (formatting, etc.)
```

---

### 4.2 Figma Component → Code Component Map

#### Layout Components

| Figma Component | Code File | shadcn/ui Base | Notes |
|---|---|---|---|
| Navigation Bar (desktop) | `layout/Header.tsx` | `NavigationMenu` | Logo, main nav links, auth CTA |
| Mobile Navigation | `layout/MobileNav.tsx` | `Sheet` | Slide-out drawer from left |
| Footer | `layout/Footer.tsx` | — | Links, legal, social |
| Marketing Layout | `(marketing)/layout.tsx` | — | Header + Footer wrapper |
| Auth Layout | `(auth)/layout.tsx` | — | Centred card, logo only |
| Dashboard Sidebar | `layout/DashboardSidebar.tsx` | — | User navigation |
| Dashboard Top Bar | `layout/DashboardTopBar.tsx` | `Avatar`, `DropdownMenu` | User menu |
| Admin Sidebar | `layout/AdminSidebar.tsx` | — | Admin navigation |

#### Listing Components

| Figma Component | Code File | shadcn/ui Base | Notes |
|---|---|---|---|
| Vehicle Card (grid) | `listings/VehicleCard.tsx` | `Card` | Primary marketplace card |
| Vehicle Card (list) | `listings/VehicleCardRow.tsx` | `Card` | List-view variant |
| Vehicle Card Skeleton | `listings/VehicleCardSkeleton.tsx` | `Skeleton` | Loading state |
| Parts Card (grid) | `listings/PartsCard.tsx` | `Card` | Similar to vehicle card |
| Parts Card Skeleton | `listings/PartsCardSkeleton.tsx` | `Skeleton` | — |
| Listing Grid | `listings/ListingGrid.tsx` | — | Responsive grid wrapper |
| Listing Filters Sidebar | `listings/ListingFilters.tsx` | `Checkbox`, `Slider`, `Select` | |
| Active Filters Bar | `listings/ActiveFilters.tsx` | `Badge` | Dismissable filter chips |
| Sort Dropdown | `listings/SortDropdown.tsx` | `Select` | Sort by options |
| Image Gallery | `listings/ImageGallery.tsx` | `Dialog` | Thumbnail strip + lightbox |
| Price Display | `listings/PriceDisplay.tsx` | — | ZAR format, negotiable flag |
| Listing Status Badge | `listings/ListingStatusBadge.tsx` | `Badge` | Active/Pending/Sold etc |
| Verified Badge | `listings/VerifiedBadge.tsx` | `Badge` | Seller verification indicator |
| Inquiry Button + Modal | `listings/InquiryDialog.tsx` | `Dialog`, `Form` | Auth-gated |
| Save Button (heart) | `listings/SaveButton.tsx` | — | Toggle, optimistic update |
| View Counter | `listings/ViewCounter.tsx` | — | "X people viewed" |

#### Marketplace Components

| Figma Component | Code File | shadcn/ui Base | Notes |
|---|---|---|---|
| Hero Section | `marketplace/Hero.tsx` | — | Homepage hero with search |
| Homepage Search Bar | `marketplace/HeroSearch.tsx` | `Input`, `Select`, `Button` | Make/model/province |
| Category Tiles | `marketplace/CategoryTiles.tsx` | — | Vehicles, Parts, Phase2... |
| Featured Listings Strip | `marketplace/FeaturedListings.tsx` | — | Horizontal scroll on mobile |
| How It Works Strip | `marketplace/HowItWorks.tsx` | — | 3-step explainer |
| Trust Signals Bar | `marketplace/TrustSignals.tsx` | — | Verified, SA-based, POPIA |

#### Form Components

| Figma Component | Code File | shadcn/ui Base | Notes |
|---|---|---|---|
| Multi-step Form Wrapper | `forms/MultiStepForm.tsx` | `Progress` | Step indicator |
| Step Indicator | `forms/StepIndicator.tsx` | — | Visual progress (1/3, 2/3) |
| Make / Model Selector | `forms/MakeModelSelector.tsx` | `Select` (cascading) | Dependent dropdowns |
| Province Selector | `forms/ProvinceSelector.tsx` | `Select` | All 9 SA provinces |
| Image Uploader | `forms/ImageUploader.tsx` | — | Drag-drop, preview, reorder |
| Price Input (ZAR) | `forms/PriceInput.tsx` | `Input` | Formats to R 100 000 on blur |
| Year Range Selector | `forms/YearRange.tsx` | `Select` pair | From/to year selectors |
| Condition Selector | `forms/ConditionSelector.tsx` | `RadioGroup` | Visual card-style radio |
| Contact Preference | `forms/ContactPreference.tsx` | `RadioGroup` | Platform / phone / WhatsApp |

#### Shared Components

| Figma Component | Code File | shadcn/ui Base | Notes |
|---|---|---|---|
| Empty State | `shared/EmptyState.tsx` | — | Icon + heading + CTA |
| Error State | `shared/ErrorState.tsx` | `Alert` | Inline or full-page |
| Page Header | `shared/PageHeader.tsx` | — | Title + breadcrumb + CTA |
| Breadcrumb | `shared/Breadcrumb.tsx` | — | Custom (shadcn has none) |
| Confirm Dialog | `shared/ConfirmDialog.tsx` | `AlertDialog` | Destructive confirmations |
| Status Badge | `shared/StatusBadge.tsx` | `Badge` | Generic status colour map |
| Pagination | `shared/Pagination.tsx` | — | Custom (shadcn has none) |
| Loading Spinner | `shared/LoadingSpinner.tsx` | — | Inline spinner |
| Avatar with Fallback | — | `Avatar` | initials fallback built-in |
| Toast Notifications | `providers/ToastProvider.tsx` | `Sonner` | Wraps app root |

#### Admin Components

| Figma Component | Code File | shadcn/ui Base | Notes |
|---|---|---|---|
| Admin Stats Card | `admin/StatsCard.tsx` | `Card` | Number + trend + icon |
| Pending Listing Card | `admin/PendingListingCard.tsx` | `Card` | Approve/reject actions |
| Listing Table | `admin/ListingTable.tsx` | `Table` | All listings with filters |
| User Table | `admin/UserTable.tsx` | `Table` | User management |
| Moderation Action Bar | `admin/ModerationActions.tsx` | `Button`, `AlertDialog` | Approve / reject / edit |
| Rejection Reason Form | `admin/RejectionForm.tsx` | `Form`, `Textarea` | Reason + send notification |
| Admin User Card | `admin/UserDetailCard.tsx` | `Card` | User info + actions |
| Flag Queue Item | `admin/FlagItem.tsx` | `Card` | Flagged listing row |

---

## 5. Design Token Plan

> **Important:** MotorSphere uses **Tailwind CSS v4**, which is CSS-first. There is no `tailwind.config.ts` for theme values — all tokens are defined in `globals.css` using `@theme` blocks and CSS custom properties.
>
> Values marked `[CONFIRM FROM FIGMA]` are placeholders to be replaced with actual Figma values once the handoff checklist (Section 1) is completed. The token *structure* is locked; only values change.

---

### 5.1 Colour Tokens

The colour system uses **OKLCH** (Oklab lightness-chroma-hue) — the correct colour space for Tailwind v4 and perceptually uniform. Hex equivalents are shown for reference.

```css
/* In globals.css — inside @theme block */

/* ─── Brand ─────────────────────────────────────────────── */
--color-brand-primary:          oklch(35% 0.18 255);   /* [CONFIRM FROM FIGMA] — deep navy/blue */
--color-brand-primary-hover:    oklch(30% 0.18 255);
--color-brand-primary-fg:       oklch(98% 0 0);        /* text on primary bg */

--color-brand-accent:           oklch(62% 0.22 35);    /* [CONFIRM FROM FIGMA] — orange/amber */
--color-brand-accent-hover:     oklch(55% 0.22 35);
--color-brand-accent-fg:        oklch(98% 0 0);

/* ─── Surface / Background ───────────────────────────────── */
--color-background:             oklch(98.5% 0 0);       /* near-white page bg */
--color-surface:                oklch(100% 0 0);        /* card bg */
--color-surface-muted:          oklch(96% 0.005 265);   /* sidebar, secondary sections */
--color-surface-elevated:       oklch(100% 0 0);        /* modal, dropdown */

/* ─── Text / Foreground ──────────────────────────────────── */
--color-foreground:             oklch(15% 0.01 265);    /* primary body text */
--color-foreground-muted:       oklch(50% 0.01 265);    /* captions, labels */
--color-foreground-subtle:      oklch(70% 0.01 265);    /* placeholder text */
--color-foreground-inverse:     oklch(98% 0 0);         /* text on dark bg */

/* ─── Border ─────────────────────────────────────────────── */
--color-border:                 oklch(88% 0.005 265);
--color-border-strong:          oklch(75% 0.01 265);
--color-ring:                   oklch(35% 0.18 255);    /* focus ring = primary */

/* ─── Semantic Colours ───────────────────────────────────── */
--color-success:                oklch(55% 0.18 142);    /* green — active listing */
--color-success-bg:             oklch(96% 0.04 142);
--color-success-fg:             oklch(30% 0.12 142);

--color-warning:                oklch(72% 0.18 75);     /* amber — pending review */
--color-warning-bg:             oklch(97% 0.05 75);
--color-warning-fg:             oklch(35% 0.14 75);

--color-destructive:            oklch(55% 0.22 25);     /* red — errors, rejection */
--color-destructive-bg:         oklch(97% 0.04 25);
--color-destructive-fg:         oklch(98% 0 0);

--color-info:                   oklch(60% 0.18 240);    /* blue — informational */
--color-info-bg:                oklch(97% 0.03 240);
--color-info-fg:                oklch(30% 0.14 240);

/* ─── Listing Status Colours ─────────────────────────────── */
--color-status-active:          var(--color-success);
--color-status-pending:         var(--color-warning);
--color-status-sold:            oklch(40% 0.01 265);    /* neutral dark — sold/ended */
--color-status-paused:          oklch(60% 0.02 265);
--color-status-rejected:        var(--color-destructive);
--color-status-draft:           var(--color-foreground-subtle);
```

**Dark Mode Tokens** (placed inside `@media (prefers-color-scheme: dark)` or `.dark` class):

```css
/* ─── Dark Mode Overrides ────────────────────────────────── */
--color-background:             oklch(12% 0.01 265);
--color-surface:                oklch(16% 0.01 265);
--color-surface-muted:          oklch(20% 0.01 265);
--color-surface-elevated:       oklch(22% 0.01 265);
--color-foreground:             oklch(94% 0.005 265);
--color-foreground-muted:       oklch(65% 0.01 265);
--color-foreground-subtle:      oklch(45% 0.01 265);
--color-border:                 oklch(25% 0.01 265);
--color-border-strong:          oklch(35% 0.01 265);
```

> **Defer dark mode until after MVP is functional.** Structure the CSS variables for it from the start (as above) — flipping dark mode later is then just swapping values, not restructuring.

---

### 5.2 Typography Tokens

```css
@theme {
  /* ─── Font Families ──────────────────────────────────────── */
  --font-sans:      "Inter", var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono:      var(--font-geist-mono), ui-monospace, monospace;
  /* ↑ [CONFIRM FROM FIGMA] — replace Inter with actual brand font if different */

  /* ─── Font Sizes ─────────────────────────────────────────── */
  --font-size-xs:   0.75rem;    /* 12px — captions, badges */
  --font-size-sm:   0.875rem;   /* 14px — secondary labels, small body */
  --font-size-base: 1rem;       /* 16px — body default */
  --font-size-lg:   1.125rem;   /* 18px — large body, card titles */
  --font-size-xl:   1.25rem;    /* 20px — subheadings */
  --font-size-2xl:  1.5rem;     /* 24px — section headings */
  --font-size-3xl:  1.875rem;   /* 30px — page headings */
  --font-size-4xl:  2.25rem;    /* 36px — hero headings */
  --font-size-5xl:  3rem;       /* 48px — large hero (desktop only) */

  /* ─── Font Weights ───────────────────────────────────────── */
  --font-weight-normal:    400;
  --font-weight-medium:    500;
  --font-weight-semibold:  600;
  --font-weight-bold:      700;

  /* ─── Line Heights ───────────────────────────────────────── */
  --leading-tight:    1.25;
  --leading-snug:     1.375;
  --leading-normal:   1.5;
  --leading-relaxed:  1.625;

  /* ─── Letter Spacing ─────────────────────────────────────── */
  --tracking-tight:   -0.025em;
  --tracking-normal:   0em;
  --tracking-wide:     0.025em;
  --tracking-wider:    0.05em;
  --tracking-widest:   0.1em;   /* badge text, all-caps labels */
}
```

**Special Typography — Price Display:**

```
Vehicle price:     font-size-3xl, font-weight-bold, tracking-tight, color-foreground
Parts price:       font-size-xl, font-weight-semibold, color-foreground
"Negotiable" tag:  font-size-sm, font-weight-medium, color-foreground-muted, italic
"R" prefix:        Same size, font-weight-normal, color-foreground-muted
```

---

### 5.3 Spacing Tokens

```css
@theme {
  /* ─── Base Spacing Scale (8px base unit) ─────────────────── */
  --spacing-0:    0px;
  --spacing-0-5:  2px;
  --spacing-1:    4px;
  --spacing-1-5:  6px;
  --spacing-2:    8px;
  --spacing-3:    12px;
  --spacing-4:    16px;
  --spacing-5:    20px;
  --spacing-6:    24px;
  --spacing-7:    28px;
  --spacing-8:    32px;
  --spacing-10:   40px;
  --spacing-12:   48px;
  --spacing-14:   56px;
  --spacing-16:   64px;
  --spacing-20:   80px;
  --spacing-24:   96px;

  /* ─── Semantic Spacing ───────────────────────────────────── */
  --spacing-page-x:      1rem;         /* horizontal page padding — mobile */
  --spacing-page-x-md:   1.5rem;       /* tablet */
  --spacing-page-x-lg:   2rem;         /* desktop */
  --spacing-section-y:   4rem;         /* vertical gap between page sections */
  --spacing-card-pad:    1rem;         /* card inner padding — mobile */
  --spacing-card-pad-lg: 1.5rem;       /* card inner padding — desktop */
  --spacing-form-gap:    1.25rem;      /* gap between form fields */

  /* ─── Layout ─────────────────────────────────────────────── */
  --max-width-page:      1280px;       /* [CONFIRM FROM FIGMA] */
  --max-width-content:   768px;        /* prose/article max width */
  --max-width-form:      480px;        /* auth and narrow form pages */
  --sidebar-width:       240px;        /* dashboard sidebar */
  --admin-sidebar-width: 260px;        /* admin sidebar */
  --header-height:       64px;         /* sticky header height */
}
```

---

### 5.4 Radius & Shadow Tokens

```css
@theme {
  /* ─── Border Radius ──────────────────────────────────────── */
  --radius-sm:     4px;     /* subtle — inputs */
  --radius-md:     8px;     /* cards, buttons (default)  [CONFIRM FROM FIGMA] */
  --radius-lg:     12px;    /* modals, larger cards */
  --radius-xl:     16px;    /* hero cards, feature blocks */
  --radius-2xl:    24px;    /* large featured elements */
  --radius-full:   9999px;  /* badges, pills, avatar, toggle */

  /* ─── Shadows ─────────────────────────────────────────────── */
  --shadow-sm:     0 1px 2px 0 oklch(0% 0 0 / 0.05);
  --shadow-md:     0 4px 6px -1px oklch(0% 0 0 / 0.07), 0 2px 4px -2px oklch(0% 0 0 / 0.05);
  --shadow-lg:     0 10px 15px -3px oklch(0% 0 0 / 0.08), 0 4px 6px -4px oklch(0% 0 0 / 0.05);
  --shadow-xl:     0 20px 25px -5px oklch(0% 0 0 / 0.10), 0 8px 10px -6px oklch(0% 0 0 / 0.05);
  --shadow-card:   var(--shadow-sm);
  --shadow-card-hover: var(--shadow-md);
  --shadow-modal:  var(--shadow-xl);
  --shadow-dropdown: var(--shadow-lg);
}
```

---

### 5.5 Transition & Animation Tokens

```css
@theme {
  /* ─── Transitions ────────────────────────────────────────── */
  --transition-fast:    150ms ease;
  --transition-base:    200ms ease;
  --transition-slow:    300ms ease;
  --transition-colors:  color 150ms ease, background-color 150ms ease, border-color 150ms ease;
}
```

---

## 6. shadcn/ui Component Strategy

### 6.1 Installation Plan

shadcn/ui is NOT a dependency — it copies component source into the project. Use the CLI to install components individually as they are needed in each Base stage.

```bash
# Base 3 (first install — run this once to initialise)
npx shadcn@latest init

# Install components as needed (examples):
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add form
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add dialog
npx shadcn@latest add sheet
npx shadcn@latest add select
npx shadcn@latest add textarea
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group
npx shadcn@latest add avatar
npx shadcn@latest add skeleton
npx shadcn@latest add alert
npx shadcn@latest add sonner        # toast notifications
npx shadcn@latest add dropdown-menu
npx shadcn@latest add navigation-menu
npx shadcn@latest add tabs
npx shadcn@latest add table
npx shadcn@latest add separator
npx shadcn@latest add label
npx shadcn@latest add progress
npx shadcn@latest add alert-dialog  # for ConfirmDialog
npx shadcn@latest add scroll-area
npx shadcn@latest add tooltip
```

> **Tailwind v4 note:** Run `npx shadcn@latest init` — the CLI detects Tailwind v4 and configures accordingly. Do NOT follow Tailwind v3 shadcn setup guides.

---

### 6.2 Shadcn/ui → MotorSphere Customisation Rules

| Rule | Detail |
|---|---|
| **Never edit `src/components/ui/`** | These are shadcn copies. Re-running `npx shadcn@latest add button` overwrites them. Put overrides in the consuming component. |
| **Extend via wrapper components** | `VehicleCard.tsx` uses `<Card>` internally — customise at wrapper level, not at `card.tsx` level |
| **Use `cn()` consistently** | `cn()` from `@/lib/utils` merges Tailwind classes correctly. Always use it when combining dynamic classes |
| **Keep shadcn CSS vars** | shadcn/ui components reference `--background`, `--foreground`, `--primary`, `--destructive` etc. These must be set in `globals.css` as aliases to MotorSphere tokens |
| **Don't fight the component API** | Use shadcn component props as intended. Fighting the API creates maintainability debt |

---

### 6.3 shadcn/ui CSS Variable Aliases (Required Setup)

The shadcn/ui components expect specific CSS variable names. These must be set up in `globals.css` as aliases to MotorSphere design tokens:

```css
/* globals.css — shadcn/ui compatibility layer */
:root {
  --background:             var(--color-background);
  --foreground:             var(--color-foreground);

  --card:                   var(--color-surface);
  --card-foreground:        var(--color-foreground);

  --popover:                var(--color-surface-elevated);
  --popover-foreground:     var(--color-foreground);

  --primary:                var(--color-brand-primary);
  --primary-foreground:     var(--color-brand-primary-fg);

  --secondary:              var(--color-surface-muted);
  --secondary-foreground:   var(--color-foreground);

  --muted:                  var(--color-surface-muted);
  --muted-foreground:       var(--color-foreground-muted);

  --accent:                 var(--color-brand-accent);
  --accent-foreground:      var(--color-brand-accent-fg);

  --destructive:            var(--color-destructive);
  --destructive-foreground: var(--color-destructive-fg);

  --border:                 var(--color-border);
  --input:                  var(--color-border);
  --ring:                   var(--color-ring);

  --radius:                 var(--radius-md);  /* shadcn base radius */
}
```

This aliasing pattern means:
- MotorSphere tokens are the source of truth
- shadcn/ui components automatically inherit the brand
- Updating a MotorSphere token updates all shadcn components using it

---

### 6.4 Component Tier System

| Tier | Location | Description | Rules |
|---|---|---|---|
| **Tier 1 — Base** | `src/components/ui/` | Raw shadcn copies | Do not customise |
| **Tier 2 — Extended** | `src/components/shared/` | Wraps Tier 1 with MotorSphere-specific logic | Small wrappers, typed props |
| **Tier 3 — Feature** | `src/components/listings/`, `forms/`, `admin/` | Assembles Tier 2 components into feature units | Business logic lives here |
| **Tier 4 — Page** | `src/app/(group)/page.tsx` | Composes Tier 3 components into pages | Layout only, no business logic |

---

## 7. Tailwind Theme Plan

### 7.1 globals.css Full Structure

```css
/* ─────────────────────────────────────────────────────────────
   MotorSphere Global Styles
   Last updated: [date]
   ────────────────────────────────────────────────────────────── */

@import "tailwindcss";

/* ─── 1. Design Tokens (MotorSphere) ─────────────────────────── */
@theme {
  /* All --color-*, --font-*, --spacing-*, --radius-*, --shadow-*
     tokens defined in Section 5 of BASE-2-UX-FIGMA-MAPPING.md    */
}

/* ─── 2. shadcn/ui Compatibility Aliases ─────────────────────── */
:root {
  /* All --background, --foreground, --primary etc. aliases
     from Section 6.3 of BASE-2-UX-FIGMA-MAPPING.md              */
}

/* ─── 3. Dark Mode Overrides ──────────────────────────────────── */
@media (prefers-color-scheme: dark) {
  :root {
    /* Dark mode token overrides from Section 5.1 */
  }
}
/* Also support class-based dark mode for admin toggle */
.dark {
  /* Same as above — for manual dark mode toggle */
}

/* ─── 4. Base Styles ──────────────────────────────────────────── */
@layer base {
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    -webkit-text-size-adjust: 100%;
  }

  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
    font-family: var(--font-sans);
    font-size: var(--font-size-base);
    line-height: var(--leading-normal);
    min-height: 100dvh;
  }

  /* Focus visible ring — accessible, not ugly */
  :focus-visible {
    outline: 2px solid var(--color-ring);
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }

  /* Remove focus outline for mouse/touch, keep for keyboard */
  :focus:not(:focus-visible) {
    outline: none;
  }

  /* Headings */
  h1, h2, h3, h4, h5, h6 {
    font-weight: var(--font-weight-semibold);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
  }

  /* Links */
  a {
    color: inherit;
    text-decoration: none;
  }

  /* Images */
  img, video {
    max-width: 100%;
    height: auto;
  }

  /* Buttons reset */
  button {
    cursor: pointer;
  }
}

/* ─── 5. Utility Layer — MotorSphere Custom Utilities ─────────── */
@layer utilities {
  /* ZAR price format helper (not a CSS utility — use formatZAR() in JS) */

  /* Responsive page container */
  .page-container {
    width: 100%;
    max-width: var(--max-width-page);
    margin-inline: auto;
    padding-inline: var(--spacing-page-x);
  }

  @media (min-width: 768px) {
    .page-container {
      padding-inline: var(--spacing-page-x-md);
    }
  }

  @media (min-width: 1024px) {
    .page-container {
      padding-inline: var(--spacing-page-x-lg);
    }
  }

  /* Smooth skeleton animation */
  .skeleton-pulse {
    animation: skeleton-pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes skeleton-pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.5; }
  }
}
```

---

### 7.2 Custom Tailwind Utilities to Define

These are application-specific utilities that should be registered in the `@layer utilities` block:

| Utility Class | Purpose |
|---|---|
| `.page-container` | Max-width centred container with responsive gutters |
| `.section-gap` | Consistent vertical spacing between page sections |
| `.card-hover` | Standard card hover state (shadow lift + border colour) |
| `.price-display` | Large ZAR price formatting |
| `.badge-status-active` | Green active listing badge styling |
| `.badge-status-pending` | Amber pending badge |
| `.badge-status-sold` | Muted sold badge |
| `.badge-status-rejected` | Red rejected badge |
| `.badge-status-draft` | Subtle draft badge |
| `.text-price` | Bold, tight price text |
| `.line-clamp-2` | 2-line text truncation (already in Tailwind but alias for clarity) |

---

## 8. Responsive Layout Rules

### 8.1 Breakpoint System

MotorSphere uses Tailwind's default breakpoints, which map to common device widths:

| Breakpoint | Prefix | Min Width | Target Devices |
|---|---|---|---|
| Default | (none) | 0px | Mobile S (320px) |
| Small | `sm:` | 640px | Mobile L, small tablets |
| Medium | `md:` | 768px | Tablets, phablets |
| Large | `lg:` | 1024px | Laptops, desktop |
| Extra Large | `xl:` | 1280px | Wide desktop |
| 2XL | `2xl:` | 1536px | Ultra-wide, admin dashboards |

**Design targets (mobile-first order):**
1. **375px** — base design, primary mobile target (iPhone SE, most Android)
2. **768px** — tablet / hybrid adjustments
3. **1280px** — desktop / primary content-rich layout

---

### 8.2 Layout Grid Rules

#### Marketplace Listing Grids

| Viewport | Columns | Gap | Card Width |
|---|---|---|---|
| < 640px (mobile) | 1 column | 16px | Full width |
| 640px–767px (sm) | 2 columns | 16px | ~50% |
| 768px–1023px (md) | 2 columns | 20px | ~50% |
| 1024px–1279px (lg) | 3 columns | 24px | ~33% |
| ≥ 1280px (xl) | 4 columns | 24px | ~25% |

```
Tailwind classes: grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6
```

> **Design decision:** Do NOT go below 1-column on mobile. Listing cards need room to breathe. Two columns at 375px is too cramped for a vehicle card with photo + details.

#### Browse Page Layout (Filters + Grid)

| Viewport | Layout |
|---|---|
| < 1024px (mobile/tablet) | Filters hidden in slide-over Sheet, triggered by "Filter" button |
| ≥ 1024px (desktop) | Filters in left sidebar (240px fixed), listing grid in remaining space |

```
lg:grid lg:grid-cols-[240px_1fr] lg:gap-6
```

---

### 8.3 Typography Responsive Scale

| Element | Mobile | Tablet (md:) | Desktop (lg:) |
|---|---|---|---|
| Hero heading | `text-3xl` (30px) | `text-4xl` (36px) | `text-5xl` (48px) |
| Page heading (H1) | `text-2xl` (24px) | `text-3xl` (30px) | `text-3xl` (30px) |
| Section heading (H2) | `text-xl` (20px) | `text-2xl` (24px) | `text-2xl` (24px) |
| Card title | `text-base` (16px) | `text-lg` (18px) | `text-lg` (18px) |
| Vehicle price | `text-2xl` (24px) | `text-2xl` (24px) | `text-3xl` (30px) |
| Body text | `text-sm` (14px) | `text-base` (16px) | `text-base` (16px) |
| Caption / badge | `text-xs` (12px) | `text-xs` (12px) | `text-xs` (12px) |

---

### 8.4 Component Responsive Rules

| Component | Mobile Behaviour | Desktop Behaviour |
|---|---|---|
| Header | Hamburger + logo only | Full nav links + auth CTAs |
| Listing filters | Sheet/drawer (off-canvas) | Left sidebar (fixed) |
| Listing card | Full width, image left or top depending on view | Fixed grid card |
| Vehicle detail images | Single image + thumbnail strip below | Gallery with main + grid |
| Dashboard nav | Bottom tab bar (mobile) or slide-over | Left sidebar |
| Admin nav | Full sidebar, no mobile bottom bar | Left sidebar |
| Multi-step form | Full-screen each step | Two-column (form + summary) |
| Inquiry modal | Full-screen bottom sheet | Centered dialog |
| Stats cards (admin) | 2-per-row | 4-per-row |

---

### 8.5 Touch Target Rules

For South African mobile users (60–70% of expected traffic):

- Minimum tap target: **44×44px** (Apple HIG) / **48×48dp** (Material)
- Spacing between tappable elements: minimum **8px**
- Form inputs: minimum height **48px** on mobile
- Primary CTAs: minimum height **52px** on mobile
- "Save" heart icon on listing card: minimum **44×44px** hit area (use padding)

---

## 9. Navigation Structure

### 9.1 Global Header

**Unauthenticated state:**

```
[Logo]   [Vehicles]  [Parts]  [How It Works]          [Sign In]  [List a Vehicle →]
```

**Authenticated state:**

```
[Logo]   [Vehicles]  [Parts]              [Notifications ♔]  [Avatar ▾]
                                                                  ├── My Dashboard
                                                                  ├── My Listings
                                                                  ├── Saved Listings
                                                                  ├── My Inquiries
                                                                  ├── Account Settings
                                                                  └── Sign Out
```

**Admin user additional item:**

```
                                           [Admin Panel ⚙]  [Avatar ▾]
```

---

**Mobile header (< 1024px):**

```
[≡ Menu]  [Logo/Wordmark]  [Avatar or Sign In]
```

Mobile slide-over navigation (Sheet):

```
[Close ×]
─────────────────────
[Logo]
─────────────────────
Browse
  ├── Vehicles
  └── Parts
─────────────────────
[Authenticated only:]
  My Dashboard
  My Listings
  Saved Listings
  My Inquiries
─────────────────────
About
How It Works
Contact
─────────────────────
[Sign In / Register]
or
[Sign Out]
```

---

### 9.2 Header Scroll Behaviour

| State | Behaviour |
|---|---|
| At top of page | Transparent or brand background (Figma-guided) |
| Scrolled down 50px | Solid background + `shadow-sm` |
| All admin pages | Always solid, no transparency |
| All auth pages | No main header — auth layout only shows logo |

---

### 9.3 Footer Structure

```
─────────────────────────────────────────────────────────
[Logo]                     [Vehicles]  [Parts]  [About]
[Tagline]                  [How It Works]       [Contact]
[motorsphere.co.za]        [Terms]      [Privacy Policy]
─────────────────────────────────────────────────────────
© 2026 MotorSphere (Pty) Ltd · South Africa
POPIA Information Officer: [TBD] · info@motorsphere.co.za
─────────────────────────────────────────────────────────
```

Mobile footer: stacked single column.

---

### 9.4 Breadcrumb Rules

| Route | Breadcrumb |
|---|---|
| `/vehicles` | Browse > Vehicles |
| `/vehicles/[id]` | Browse > Vehicles > [Make Model Year] |
| `/parts` | Browse > Parts |
| `/parts/[id]` | Browse > Parts > [Part Title] |
| `/dashboard/listings` | Dashboard > My Listings |
| `/admin/listings/pending` | Admin > Listings > Pending Review |

Breadcrumbs are **not shown** on: homepage, auth pages, account settings (those use page headers only).

---

## 10. Dashboard Layout Structure

### 10.1 Dashboard Layout Overview

The user dashboard uses a **sidebar + main content** layout on desktop, and a **bottom navigation + full-screen content** pattern on mobile.

```
┌──────────────────────────────────────────────────────────────┐
│  HEADER: Logo + "Dashboard" label + user avatar/menu          │
├──────────────┬───────────────────────────────────────────────┤
│              │                                               │
│  SIDEBAR     │  MAIN CONTENT AREA                            │
│  (240px)     │                                               │
│              │  [Page Header: Title + CTA]                   │
│  Overview    │                                               │
│  My Listings │  [Page Body: cards, tables, forms]            │
│  Parts       │                                               │
│  Inquiries   │                                               │
│  Saved       │                                               │
│  ─────────── │                                               │
│  Settings    │                                               │
│  Sign Out    │                                               │
│              │                                               │
└──────────────┴───────────────────────────────────────────────┘
```

**Mobile Dashboard (< 1024px):**

```
┌──────────────────────────────────┐
│  HEADER: Logo + avatar           │
├──────────────────────────────────┤
│                                  │
│  MAIN CONTENT AREA               │
│  (full width)                    │
│                                  │
│                                  │
├──────────────────────────────────┤
│  BOTTOM NAV: Home | Listings     │
│              Inquiries | Saved   │
│              ⊕ Post New          │
└──────────────────────────────────┘
```

---

### 10.2 Dashboard Sidebar Navigation Items

```
Overview             → /dashboard
─────────────────────────────────
My Listings          → /dashboard/listings
  + New Vehicle      → /dashboard/listings/new/vehicle
  + New Part         → /dashboard/listings/new/parts
─────────────────────────────────
Inquiries            → /dashboard/inquiries
  (unread badge)
Saved Listings       → /dashboard/saved
─────────────────────────────────
[bottom of sidebar]
Account Settings     → /account/settings
Verification         → /account/verification
Sign Out
```

---

### 10.3 Dashboard Overview Cards

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Active       │  │ Pending      │  │ Total Views  │  │ Inquiries    │
│ Listings     │  │ Review       │  │ (all time)   │  │ Unread       │
│ [Number]     │  │ [Number]     │  │ [Number]     │  │ [Number]     │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

Below stats: recent listings table (last 5) + recent inquiries (last 3).

---

### 10.4 "Post New Listing" Primary CTA Placement

The **"Post a Vehicle" / "Post a Part"** CTA must be extremely visible on the dashboard — this is the highest-value user action:

- Desktop: Prominent button in top-right of page header area
- Mobile: Persistent **floating action button** (bottom-right, "+" icon) or bottom nav centre item
- Dashboard overview: Hero CTA card if user has 0 listings ("Start selling on MotorSphere")

---

## 11. Admin Dashboard Layout Structure

### 11.1 Admin Layout Overview

Admin panel is **desktop-primary** but must be usable on tablet. Mobile admin is deprioritised (admins work at desks).

```
┌────────────────────────────────────────────────────────────────────┐
│  ADMIN HEADER: MotorSphere [ADMIN] wordmark + user + notifications  │
├────────────────┬───────────────────────────────────────────────────┤
│                │                                                   │
│  ADMIN SIDEBAR │  MAIN ADMIN CONTENT                               │
│  (260px)       │                                                   │
│                │  [Section Header: Title + action buttons]         │
│  Overview      │                                                   │
│                │  [Data table / queue / cards]                     │
│  Listings ▾    │                                                   │
│    Pending  ●  │                                                   │
│    All         │                                                   │
│    Flagged     │                                                   │
│                │                                                   │
│  Users         │                                                   │
│                │                                                   │
│  Reports       │                                                   │
│                │                                                   │
│  ──────────    │                                                   │
│  ← Back to     │                                                   │
│    Platform    │                                                   │
│                │                                                   │
└────────────────┴───────────────────────────────────────────────────┘
```

The `●` indicator next to "Pending" shows the count of listings awaiting review.

---

### 11.2 Admin Overview Stats

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Pending      │  │ Active       │  │ New Users    │  │ Flagged      │
│ Review       │  │ Listings     │  │ (7 days)     │  │ Items        │
│ [N] ⚠        │  │ [N]          │  │ [N] ↑        │  │ [N] 🚩       │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

Below stats: pending listings queue (first 10, sorted by date), recent signups (last 5).

---

### 11.3 Admin Listing Review Flow

When an admin opens a listing for review, the layout is:

```
┌────────────────────────────────────────────────────────────────────┐
│ ← Pending Queue                                          [1 of 12] │
├─────────────────────────────┬──────────────────────────────────────┤
│                             │ SELLER INFO                          │
│  IMAGE GALLERY              │ Name, member since, listing count    │
│  (main + thumbnails)        │ ─────────────────────────────────    │
│                             │ LISTING DETAILS                      │
│                             │ Make, model, year, mileage, price    │
│                             │ Province, description...             │
│                             │                                      │
│                             │ ─────────────────────────────────    │
│                             │ MODERATION ACTIONS                   │
│                             │ [✓ Approve]  [✗ Reject]  [✎ Edit]   │
│                             │                                      │
│                             │ Rejection reason (shows if reject    │
│                             │ selected): dropdown + optional note  │
└─────────────────────────────┴──────────────────────────────────────┘
```

**Rejection reason presets (dropdown):**
- Incorrect / misleading information
- Images do not match description
- Suspicious or likely fraudulent listing
- Duplicate listing
- Prohibited item
- Incomplete listing (missing required fields)
- Price appears unrealistic
- Contact details in description (policy violation)
- Other (free text required)

---

### 11.4 Admin Colour Differentiation

Admin panel should feel distinctly different from the public marketplace to reduce accidental admin actions:

- Admin sidebar: uses `--color-surface-muted` or a dark sidebar (`#1A1A2E` range — [CONFIRM FROM FIGMA])
- "You are in the Admin panel" indicator in header
- Destructive admin actions (suspend, ban, reject) require `AlertDialog` confirmation step
- All admin actions are logged (to be implemented in audit log table — Phase 2)

---

## 12. Marketplace Card Design System

### 12.1 Vehicle Listing Card — Grid View

```
┌─────────────────────────────────────┐
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  │   PRIMARY PHOTO             │    │
│  │   (16:9 ratio, object-cover)│ ♡  │  ← Save button (top-right corner of image)
│  │                             │    │
│  └─────────────────────────────┘    │
│                                     │
│  [MAKE MODEL]                       │  ← text-lg, font-semibold
│  [Year · Transmission · Fuel]       │  ← text-sm, muted
│  [Province, City]                   │  ← text-sm, muted, location icon
│                                     │
│  R [PRICE]                          │  ← text-2xl, font-bold
│  [Negotiable]  [MILEAGE km]         │  ← text-xs badges
│                                     │
│  [Verified ✓]   [Active ●]   [Time] │  ← seller badge, status, time ago
└─────────────────────────────────────┘
```

**Card states:**

| State | Visual Treatment |
|---|---|
| Default | `shadow-card`, white background |
| Hover | `shadow-card-hover`, border-colour shift, slight translateY(-2px) |
| Saved | Heart icon filled (brand accent colour) |
| Sold | Greyscale filter on image + "SOLD" overlay badge |
| Pending (owner view only) | Amber top border + "Pending Review" badge |
| Rejected (owner view only) | Red top border + "Rejected" badge + reason tooltip |
| Featured | Border uses `--color-brand-accent`, subtle glow shadow |

---

### 12.2 Vehicle Listing Card — List View

```
┌───────────────────────────────────────────────────────────────────┐
│ ┌──────────────┐  MAKE MODEL YEAR             R [PRICE]       ♡   │
│ │  PHOTO       │  Transmission · Fuel         [MILEAGE km]        │
│ │  (4:3)       │  Province, City              [Active ●]          │
│ │              │  [Verified ✓] · 2 days ago                       │
│ └──────────────┘                                                   │
└───────────────────────────────────────────────────────────────────┘
```

Toggle between grid and list view: icon buttons in top-right of browse page header.

---

### 12.3 Parts Listing Card

```
┌─────────────────────────────────────┐
│  ┌─────────────────────────────┐    │
│  │   PART PHOTO                │ ♡  │
│  │   (1:1 ratio, object-cover) │    │
│  └─────────────────────────────┘    │
│                                     │
│  [PART TITLE]                       │  ← text-base, font-semibold, 2-line clamp
│  [Category]  [Condition badge]      │  ← text-xs, muted | New/Used/Refurb badge
│  Compatible: [Makes]                │  ← text-xs, muted
│  [Province, City]                   │  ← text-sm, muted
│                                     │
│  R [PRICE]                          │  ← text-xl, font-bold
│  [In Stock: Qty]  [Active ●]        │
└─────────────────────────────────────┘
```

---

### 12.4 Status Badge Design

| Status | Background | Text | Dot Colour | Icon |
|---|---|---|---|---|
| `active` | `--color-success-bg` | `--color-success-fg` | Green ● | — |
| `pending_review` | `--color-warning-bg` | `--color-warning-fg` | Amber ● | Clock |
| `sold` | `--color-surface-muted` | `--color-foreground-muted` | Grey ● | — |
| `paused` | `--color-surface-muted` | `--color-foreground-muted` | Grey ● | Pause |
| `rejected` | `--color-destructive-bg` | `--color-destructive-fg` | Red ● | X |
| `draft` | `--color-surface-muted` | `--color-foreground-subtle` | Grey — | Edit |
| `featured` | `--color-brand-accent` (bg) | `--color-brand-accent-fg` | — | Star |
| `verified` | `--color-brand-primary` (bg) | `--color-brand-primary-fg` | — | Shield |

---

### 12.5 Card Interaction Design Rules

1. **The entire card is clickable** to the listing detail page — use `<Link>` wrapping the card, with the save button as a nested interactive element (`e.stopPropagation()`)
2. **Image aspect ratio** must be enforced with `aspect-video` (16:9) for vehicle cards and `aspect-square` (1:1) for parts cards — never let image dimensions break the grid
3. **Image fallback** when photo fails to load: grey background + car silhouette SVG for vehicles, wrench SVG for parts
4. **Price formatting**: always `R 150 000` (with space, no comma — South African convention). Use `Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' })` in a `formatZAR()` utility
5. **Time ago**: "2 hours ago", "3 days ago" — never show raw timestamps on cards
6. **Listing title truncation**: 2-line clamp on card title, full title on detail page
7. **Hover state**: apply `transition-transform duration-200` for subtle lift — no jarring animations

---

### 12.6 Featured Listings Strip (Homepage)

```
[Section Header]  "Recently Listed"           [View All →]
─────────────────────────────────────────────────────────
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│      │ │      │ │      │ │      │ │      │ │      │
│ card │ │ card │ │ card │ │ card │ │ card │ │ card │
└──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘
         ◀ ───────────────────────────────────── ▶
```

- Desktop: 4 visible cards, arrows scroll
- Mobile: 1.2 cards visible (peek at next card), swipe to scroll (`overflow-x-auto`, `snap-x`)
- No pagination on the strip — link to full browse page

---

## 13. Forms and Validation UI Rules

### 13.1 Form Stack Choice

| Library | Role |
|---|---|
| `react-hook-form` | Form state, validation trigger, field registration |
| `zod` | Schema validation (shared between client and API routes) |
| `@hookform/resolvers` | Connects zod to react-hook-form |
| shadcn/ui `<Form>` components | Accessible wrapper (uses react-hook-form context) |

---

### 13.2 Shared Zod Schema Pattern

Schemas live in `src/lib/validations/` and are imported by both form components and API routes:

```
src/lib/validations/
├── vehicle-listing.ts    ← VehicleListingSchema (used in form + POST /api/listings/vehicles)
├── parts-listing.ts      ← PartsListingSchema
├── inquiry.ts            ← InquirySchema
├── auth.ts               ← LoginSchema, RegisterSchema
└── profile.ts            ← ProfileUpdateSchema
```

---

### 13.3 Multi-Step Form Structure (Vehicle Listing)

**Step 1 — Vehicle Details**

Fields: Make, Model, Year, Variant, Mileage, Transmission, Fuel Type, Colour, Condition, Description

**Step 2 — Photos**

Fields: Photo upload (drag & drop, up to 20 photos), primary photo selection, reorder

**Step 3 — Pricing & Contact**

Fields: Price, Negotiable, Province, City, Contact Preference

**Step Indicator:**

```
① Vehicle Details  ──  ② Photos  ──  ③ Pricing & Contact
[filled/active]       [upcoming]     [upcoming]
```

- Step indicator is not clickable (must proceed linearly for MVP)
- Each step validates before proceeding to next
- "Save as Draft" available at any step
- Step 3 has a review summary of all entered data before final submit

---

### 13.4 Form Field UI Rules

#### Field Anatomy

```
[Label text]                    [Optional: "Required" or "Optional" tag]
┌────────────────────────────────────────────────────────┐
│  Input / Select / Textarea                             │
└────────────────────────────────────────────────────────┘
[Helper text — appears below in muted colour]
[Error message — replaces helper text when error present]
```

#### State Styles

| State | Visual |
|---|---|
| Default | `border: --color-border`, `bg: --color-surface` |
| Focus | `border: --color-ring`, `ring: 2px --color-ring / 30%`, no outline shift |
| Filled / Valid | Same as default (do not show green on every filled field — visual noise) |
| Error | `border: --color-destructive`, error message in `--color-destructive` below |
| Disabled | `opacity-50`, `cursor-not-allowed`, no hover effects |
| Loading / Submitting | Spinner inside field or button; field disabled during async operation |

#### Error Message Rules

1. Show errors **on blur** for individual fields (not on every keystroke)
2. Show all errors on **submit** attempt if form is invalid
3. Error messages are **concise and actionable**: "Enter a valid price" not "price_amount must be a positive integer"
4. Place error messages **immediately below** the field, not at the top of the form (inline, not toast)
5. Toast notifications are for **server-side errors** only (e.g., "Failed to save listing — please try again")

---

### 13.5 Specific Field Rules

| Field | Rule |
|---|---|
| **Price** | Numbers only, formatted `R 150 000` on blur. Min R 500, max R 25 000 000 for vehicles. ZAR cents stored in DB. |
| **Mileage** | Numbers only. Min 0, max 2 000 000. Show "km" unit suffix inside input. |
| **Year** | 4-digit integer. Min 1970, max current year. Select dropdown preferred over free input. |
| **Phone** | SA format: `+27` prefix, 9 remaining digits. Show formatted mask. |
| **Email** | Standard email validation. Lowercase on blur. |
| **Description** | Textarea, min 30 chars, max 2000 chars. Show character counter `[120 / 2000]`. |
| **Province** | Required Select from 9 SA provinces. No "International" option. |
| **Image upload** | Max 5MB per file. Accepted: jpg, jpeg, png, webp. Show per-file progress. Error inline on failed files. |
| **Make / Model** | Dependent dropdowns. If "Other" selected for Make, free-text Model appears. |

---

### 13.6 Button States During Submission

```
Default:   [Submit Listing]
Loading:   [Submitting…  ◌]   ← spinner icon, button disabled
Success:   (redirect — do not show "Success" state on same button)
Error:     [Submit Listing]   ← return to default, toast shows error
```

Never leave the user staring at a spinning button for more than 10 seconds without feedback. Add a fallback message after 8 seconds: "Still working…".

---

## 14. Empty States, Loading States, and Error States

### 14.1 Empty States

Every list view, grid, and dashboard section must have a defined empty state. Never show a blank area.

| Context | Heading | Subtext | CTA |
|---|---|---|---|
| Browse vehicles (no results) | "No vehicles match your filters" | "Try adjusting your search or clearing filters" | [Clear Filters] |
| Browse parts (no results) | "No parts found" | "Try a different category or search term" | [Clear Filters] |
| My Listings (0 listings) | "You haven't listed anything yet" | "It only takes a few minutes to reach thousands of buyers" | [Post a Vehicle] [Post a Part] |
| My Saved (0 saved) | "Nothing saved yet" | "Browse vehicles and parts and save ones you like" | [Browse Vehicles] |
| My Inquiries (0 sent) | "No inquiries yet" | "Find a listing and send a message to the seller" | [Browse] |
| My Inquiries (0 received) | "No one has messaged you yet" | "Make sure your listings are active and approved" | [My Listings] |
| Admin pending queue (0) | "All clear!" | "No listings waiting for review" | — |
| Admin flagged (0) | "No flagged content" | "Nothing has been reported" | — |

**Empty state component structure:**
```
[Illustration / Icon]     ← 64px icon from Lucide, or custom SVG
[Heading]                 ← text-lg, font-semibold
[Subtext]                 ← text-sm, muted, max-width 320px, centred
[CTA Button(s)]           ← primary or ghost variant
```

---

### 14.2 Loading States

#### Skeleton Loaders (Preferred over spinners for content)

Every content-heavy component has a corresponding skeleton:

| Component | Skeleton Component |
|---|---|
| `VehicleCard` | `VehicleCardSkeleton` — grey rects mimicking card layout |
| `PartsCard` | `PartsCardSkeleton` |
| `ListingGrid` | Renders 8× `VehicleCardSkeleton` |
| `VehicleDetail` | `VehicleDetailSkeleton` — full-page skeleton |
| Dashboard stats | `StatsCardSkeleton` — 4× grey card rects |
| Listing table (admin) | `TableSkeleton` — row-height grey bars |
| Profile page | `ProfileSkeleton` |

**Skeleton rules:**
- Use `animate-pulse` (via `.skeleton-pulse` utility)
- Background: `--color-surface-muted` (not solid grey — subtle)
- Respect the layout of the real component (same height, spacing)
- Show skeletons for maximum 3 seconds before switching to error state if data hasn't loaded

#### Inline Spinners (For triggered actions)

Use inline spinners for:
- Button loading states (form submission)
- Image upload progress
- Inquiry sending

Use page-level skeleton for:
- Initial data load

**Never use a full-page spinner** (the white-screen-with-spinning-circle experience) — always use skeleton loaders for page-level loads.

---

### 14.3 Error States

#### Levels of Error

| Level | Trigger | Component | Behaviour |
|---|---|---|---|
| **Field error** | Form validation | Inline text below field | Visible on blur / submit |
| **Form error** | Server rejects form submission | Alert above submit button | "Could not save listing. [Reason]" |
| **Section error** | Async data load fails | `<ErrorState>` replaces content area | Heading + retry button |
| **Page error** | Fatal load error | `error.tsx` boundary | Full-page with "Something went wrong" |
| **Toast error** | Background action fails | Sonner toast (bottom-right) | Auto-dismiss 5s |
| **404 Not Found** | Missing route | `not-found.tsx` | Branded 404 page |

#### `<ErrorState>` Component Design

```
[⚠ Icon — 48px]
[Heading: "Couldn't load listings"]
[Subtext: "Check your connection and try again."]
[Button: Retry]
```

#### Error Messages — Writing Rules

| ❌ Don't write | ✅ Do write |
|---|---|
| "Error 500: Internal Server Error" | "Something went wrong. Please try again." |
| "Cannot read property of undefined" | "This listing is no longer available." |
| "Validation failed: price_amount must be > 0" | "Please enter a valid price." |
| "JWT expired" | "Your session has expired. Please sign in again." |
| "Row violates RLS policy" | "You don't have permission to do that." |
| "ECONNREFUSED" | "We're having trouble connecting. Try refreshing." |

---

### 14.4 Success States

| Action | Feedback Pattern |
|---|---|
| Listing submitted for review | Full-page success screen (not toast): "Your listing is submitted! We'll review it shortly." + next steps |
| Listing approved | Email notification + toast on next dashboard visit |
| Inquiry sent | Toast: "Message sent to seller" (not full-page redirect) |
| Listing saved | Instant heart toggle (optimistic) + silent success |
| Profile updated | Toast: "Profile updated" |
| Listing deleted | Toast: "Listing deleted" + removed from list (optimistic) |
| Password changed | Toast: "Password updated successfully" |
| Account deleted | Redirect to homepage + toast: "Your account has been deleted" |

---

## 15. Accessibility Checklist

> **Target:** WCAG 2.1 Level AA compliance. This is both an ethical requirement and a legal consideration in South Africa under the Employment Equity Act and general consumer protection principles.

### 15.1 Colour & Contrast

```
[ ] All body text achieves 4.5:1 contrast ratio against background
[ ] Large text (18px+ bold, 24px+ normal) achieves 3:1 minimum
[ ] Interactive element focus states are clearly visible (3:1 against adjacent colours)
[ ] Status badges: text colour achieves 4.5:1 against badge background
[ ] Price text: verified against background
[ ] Placeholder text: minimum 4.5:1 (often fails — override browser default)
[ ] Error state: red colour not the ONLY indicator — also use icon + text
[ ] Success state: green not the ONLY indicator — also use icon + text
[ ] Never use colour alone to convey information
```

### 15.2 Keyboard Navigation

```
[ ] All interactive elements reachable via Tab key
[ ] Tab order follows visual reading order (no focus jumping)
[ ] Skip-to-main-content link present (visually hidden, visible on focus)
[ ] Dropdown menus navigable with arrow keys (shadcn NavigationMenu handles this)
[ ] Modals: focus trapped inside when open; focus returns to trigger on close
[ ] Image gallery lightbox: keyboard navigable (arrow keys for next/prev, Esc to close)
[ ] Form fields: all labels programmatically associated (shadcn Form handles this)
[ ] Buttons: never implement as <div onClick> — use <button>
[ ] Links: never implement as <span onClick> — use <a> or <Link>
```

### 15.3 Screen Reader Support

```
[ ] All images have descriptive alt text (not "image1.jpg")
[ ] Vehicle listing cards: alt text = "[Make] [Model] [Year] - [Price]"
[ ] Decorative images: alt=""
[ ] Icons used as buttons: aria-label provided ("Save listing", "Close dialog")
[ ] Icon-only buttons: aria-label (not just title attribute)
[ ] Status badges: text content is sufficient (screen readers read the text)
[ ] Loading states: aria-live="polite" on content area; announce "Loading listings"
[ ] Error messages: aria-describedby linking field to its error message
[ ] Required fields: aria-required="true" (shadcn Form handles this via zod)
[ ] Page title: changes on route navigation (Next.js metadata API)
[ ] Landmark roles: <header>, <main>, <nav>, <footer> used correctly
[ ] Breadcrumb: aria-label="Breadcrumb" on nav, aria-current="page" on last item
[ ] Dialog: aria-modal="true", aria-labelledby pointing to dialog title
```

### 15.4 Motion & Animation

```
[ ] Respect prefers-reduced-motion: card hover lift disabled
[ ] Skeleton pulse animation: disabled or slowed with prefers-reduced-motion
[ ] Page transitions: minimal (Next.js has no built-in transition — keep it simple)
[ ] Auto-playing content: none at MVP
[ ] Infinite scroll (if added): pause-on-no-interaction (Phase 2 concern)
```

### 15.5 Forms Accessibility

```
[ ] Every input has a visible label (not placeholder as label)
[ ] Labels remain visible when input is filled
[ ] Error messages are announced to screen readers (aria-live or aria-describedby)
[ ] Multi-step form: current step announced ("Step 2 of 3: Photos")
[ ] Image upload: keyboard accessible drag-drop alternative (file input button)
[ ] Required field indicators: marked with both asterisk (*) and aria-required
[ ] Autocomplete attributes set correctly (name, email, phone, etc.)
```

### 15.6 Mobile Accessibility

```
[ ] Touch targets minimum 44×44px
[ ] Text resizable to 200% without loss of content or functionality
[ ] Pinch-to-zoom not disabled (do NOT use user-scalable=no in viewport meta)
[ ] Bottom navigation: labels visible (not icon-only) or tooltip on long-press
```

### 15.7 Accessibility Testing Plan

| Method | Timing | Coverage |
|---|---|---|
| Automated: axe DevTools browser extension | Per component as built | ~30% of issues caught automatically |
| Manual keyboard test | Per page before marking complete | All interactive elements |
| Screen reader test: NVDA (Windows) + VoiceOver (macOS) | Pre-launch | All core user journeys |
| Colour contrast audit: Figma or browser DevTools | During design token finalisation | All colour combinations |
| Real device test: Android TalkBack | Pre-launch | Mobile core journeys |

---

## 16. Base 2 Implementation Checklist

> These are the concrete tasks to complete before Base 3 begins. Base 2 is a **setup and planning** base — no application routes or business logic should be built here.

### 16.1 Design Input

```
[ ] Figma handoff checklist (Section 1) completed and submitted to developer
[ ] Figma screen inventory (Section 2) filled with at least: Homepage, Vehicle Browse, 
    Vehicle Detail, Login, Register, Dashboard — mobile and desktop
[ ] Colour tokens (Section 5.1) confirmed from Figma and values updated in this document
[ ] Typography confirmed — font family verified/licensed
[ ] Radius and shadow values confirmed from Figma
[ ] Icon library confirmed (Lucide assumed — confirm or replace)
[ ] Logo / wordmark SVG assets received
[ ] OG image template received
```

### 16.2 Project Setup

```
[ ] Repository cleaned of default create-next-app content (page.tsx, default CSS)
[ ] /docs folder created with BASE-1 and BASE-2 documents committed
[ ] .gitignore reviewed — .env.local present, node_modules present, functions/node_modules present
[ ] .env.local.example created with all Firebase env var keys (see BASE-1 Section 11.10)
[ ] README.md updated with: project description, tech stack, dev setup instructions,
    environment variable documentation, Firebase Emulator setup steps
[ ] CLAUDE.md created with codebase context for AI-assisted development sessions
[ ] firebase.json created (placeholder — will be completed in Base 3)
[ ] .firebaserc created with staging and prod project aliases
[ ] firestore.rules placeholder created
[ ] storage.rules placeholder created
[ ] firestore.indexes.json placeholder created
[ ] vercel.json created (framework: nextjs, region: cpt1 — Cape Town)
[ ] apphosting.yaml created (deferred alternative — Vercel is the active hosting provider)
```

### 16.3 Prettier & Git Hooks

```
[ ] Prettier installed: npm install -D prettier
[ ] .prettierrc.json created with project rules (singleQuote, semi, tabWidth: 2)
[ ] .prettierignore created (node_modules, .next, public)
[ ] lint-staged installed: npm install -D lint-staged
[ ] Husky installed: npx husky init
[ ] Pre-commit hook: runs lint-staged (prettier + eslint on staged files)
[ ] Commit message hook: optional — conventional commits pattern
```

### 16.4 shadcn/ui Installation

```
[ ] shadcn/ui initialised: npx shadcn@latest init (with Tailwind v4 config)
[ ] components.json verified (paths, tailwind, rsc options)
[ ] Base set of components installed (see Section 6.1 install list)
[ ] src/lib/utils.ts present with cn() function
[ ] All shadcn components confirmed rendering correctly in a test page
```

### 16.5 Design System Implementation

```
[ ] globals.css restructured with @theme block for MotorSphere tokens
[ ] Colour tokens written in globals.css (placeholders replaced with confirmed Figma values)
[ ] Typography tokens written in globals.css
[ ] Spacing tokens written in globals.css
[ ] Radius and shadow tokens written in globals.css
[ ] shadcn/ui CSS variable aliases written in :root (Section 6.3)
[ ] Dark mode CSS variables stubbed in (even if dark mode is deferred)
[ ] page-container utility class defined
[ ] layout.tsx updated: metadata, lang="en", correct font variables
[ ] Tailwind v4 confirmed working: run npm run build with no CSS errors
```

### 16.6 Folder Structure

```
[ ] src/components/ui/         ← shadcn copies (created by npx shadcn@latest add)
[ ] src/components/layout/     ← Header.tsx (shell), Footer.tsx (shell), MobileNav.tsx (shell)
[ ] src/components/shared/     ← EmptyState.tsx, LoadingSpinner.tsx (shells)
[ ] src/components/listings/   ← folder created, empty
[ ] src/components/forms/      ← folder created, empty
[ ] src/components/admin/      ← folder created, empty
[ ] src/components/providers/  ← ToastProvider.tsx wrapping Sonner
[ ] src/hooks/                 ← folder created, empty
[ ] src/lib/firebase/          ← placeholder files: client.ts (Firebase client SDK), admin.ts (Admin SDK)
[ ] src/lib/validations/       ← folder created, empty
[ ] src/types/                 ← firestore.types.ts with TypeScript interfaces matching BASE-1 Section 11.3 document shapes
[ ] src/utils/                 ← format.ts with formatZAR() stub
```

### 16.7 GitHub Actions CI

```
[ ] .github/workflows/ci.yml created
[ ] CI job: npm ci
[ ] CI job: npx tsc --noEmit (type check)
[ ] CI job: npm run lint
[ ] CI job: npm run build
[ ] CI triggers: on push to main, on pull_request to main
[ ] README badge showing CI status
```

### 16.8 Vercel Deployment Setup

> Active hosting provider: **Vercel**. See `vercel.json`.

```
[ ] Firebase CLI installed globally: npm install -g firebase-tools
[ ] Firebase login: firebase login
[ ] Firebase Emulator Suite confirmed working: firebase emulators:start
[ ] Vercel project created and linked to GitHub repository (vercel.com → Add New → Project)
[ ] Build settings confirmed in Vercel: Next.js auto-detected, npm run build, region cpt1
[ ] vercel.json committed (framework: nextjs, region: cpt1)
[ ] Environment variable placeholders added in Vercel Dashboard → Project → Settings → Environment Variables
    (real values added when Firebase projects are configured in Base 3)
[ ] Preview deployments enabled: Vercel auto-deploys any PR to a preview URL (enabled by default)
[ ] Firebase Auth: *.vercel.app added to Authorised Domains in Firebase Console
[ ] First deploy confirmed working (Vercel build log shows no errors)
```

> **Firebase App Hosting** is configured in `apphosting.yaml` (committed) but deferred. Activate it at a later stage if the team decides to replace Vercel with Firebase-native hosting.

### 16.9 Component Shells for Design Verification

> Build these as **visual-only shells** (no data, no logic) to verify the design system looks correct before Base 3. These become real components in Base 3+.

```
[ ] Shell: Header (desktop + mobile) with placeholder links and logo text
[ ] Shell: Footer with placeholder links
[ ] Shell: VehicleCard with hardcoded placeholder data — verify card design
[ ] Shell: VehicleCardSkeleton — verify skeleton matches card layout
[ ] Shell: EmptyState — verify icon + text + button layout
[ ] Shell: StatusBadge — render all 7 status variants side by side
[ ] Shell: StatsCard (admin) — render 4 side by side
[ ] Design verification page at /design (development only) rendering all shells
```

### 16.10 Documentation

```
[ ] BASE-1-PRODUCT-FOUNDATION.md — committed ✅
[ ] BASE-2-UX-FIGMA-MAPPING.md — committed ✅ (this document)
[ ] Figma screen inventory (Section 2) — updated with confirmed screens
[ ] .env.local.example — committed
[ ] README.md — updated
[ ] CLAUDE.md — created
[ ] BASE-3 document created before Base 3 work begins
```

---

## Document Control

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-05-27 | MotorSphere Team | Initial BASE 2 document |
| 1.1 | 2026-05-27 | MotorSphere Team | Stack pivot: Supabase → Firebase. Added Stack Pivot Note. Updated middleware auth strategy, API routes, lib folder structure, types file, and Base 2 setup checklist to reflect Firebase. All Figma/UI/design system decisions unchanged. |

---

*Design tokens marked `[CONFIRM FROM FIGMA]` must be updated with real values before Base 3 begins. Do not start building components until colour tokens, typography, and spacing are confirmed.*
