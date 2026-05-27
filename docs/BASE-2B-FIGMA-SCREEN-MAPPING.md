# MotorSphere — BASE 2B: Figma Screen Mapping & Design Intake

> **Stage:** Base 2B — Figma Visual Analysis, Screen Mapping & Design Token Extraction
> **Date:** 2026-05-27
> **Figma File:** [Vehicle and Parts Website — Version 8](https://www.figma.com/make/0X4YLBYbmKavN1jQgZNv1f/Vehicle-and-Parts-Website?t=bomxajMwEvjDwJkU-1)
> **Status:** Partial — extracted from screenshots; items marked ⚠️ need Figma confirmation
> **Depends on:** [BASE-2-UX-FIGMA-MAPPING.md](./BASE-2-UX-FIGMA-MAPPING.md)
> **Next Stage:** Base 3 — Firebase Setup & Auth

---

## Table of Contents

1. [What Was Extracted from Screenshots](#1-what-was-extracted-from-screenshots)
2. [Critical Design Finding — Dark Theme](#2-critical-design-finding--dark-theme)
3. [Confirmed Design Tokens](#3-confirmed-design-tokens)
4. [Missing Design Information — Provide These Before Base 3](#4-missing-design-information--provide-these-before-base-3)
5. [Figma-to-App Screen Mapping](#5-figma-to-app-screen-mapping)
6. [Homepage — Detailed Component Breakdown](#6-homepage--detailed-component-breakdown)
7. [Category System — MVP vs Phase 2 Split](#7-category-system--mvp-vs-phase-2-split)
8. [Design Improvement Recommendations](#8-design-improvement-recommendations)
9. [Updated Design Token Plan (Dark Theme)](#9-updated-design-token-plan-dark-theme)
10. [Component Mapping from Figma Screenshots](#10-component-mapping-from-figma-screenshots)
11. [What to Send Next](#11-what-to-send-next)

---

## 1. What Was Extracted from Screenshots

Two screenshots were provided, both showing the homepage of the Figma design. The Figma link is confirmed accessible as a viewer. The following was extracted visually — confidence level noted for each item.

### 1.1 — Homepage (Above the Fold)

| Element | What I Can See | Confidence |
|---|---|---|
| Overall colour theme | **Dark / near-black** — entire page background is very dark (estimated `#0A0A0A` – `#111111`) | High |
| Header background | Black / very dark, full width | High |
| Header — left content | `≡ Menu` (hamburger icon + "Menu" text label) | High |
| Header — right content | `🌐 English` language selector + ⚙ settings icon | High |
| Header — logo | **Not visible in header** (viewport cuts it off, or logo is absent at top) | Medium |
| Hero section | Full-width dark automotive background photo (nighttime/bokeh car image) | High |
| Hero — overlay | Promotional card/banner: "**Premium Car Insurance — Save up to 30%**" sub "Get comprehensive coverage with the best rates in South Africa" | High |
| Hero — CTA button | "**Learn More**" — white background, blue text, rounded corners | High |
| Hero — dismiss | `×` close button (top-right of the banner card) | High |
| Hero — pagination | 3 dots (carousel indicator) — first dot white/active, others muted | High |
| Search bar | Wide, dark rounded rectangle. Placeholder: "Search vehicles, parts, or auctions..." Location pin icon (right-inside). Blue "**Search**" pill button (right) | High |
| Category grid — layout | 6 tiles per row on this viewport (desktop) | High |
| Tile — shape | Rounded rectangle, consistent height (~150–170px estimated), icon centered above, label below | High |

### 1.2 — Homepage (Scrolled — Category Grid + Below)

| Element | What I Can See | Confidence |
|---|---|---|
| Category tiles — Row 1 (top) | Vehicle Search (blue), Trucks & Buses (dark navy), Parts (green), Spares (orange-red), Tyres (dark grey), Panelbeaters (orange) | High |
| Category tiles — Row 2 | Vehicle Tracking (teal-green), Dealerships (red), Vehicle Insurance (dark teal), RMI Workshops (purple), Non RMI Mechanic (teal), Towing Services (amber) | High |
| Category tiles — Row 3 | Emergency Roadside (red) — single tile, appears same width as other tiles (not full-width) | High |
| Tile icons | White outline/line-style icons (not filled), automotive/service-themed | High |
| Tile text | White, bold, centred | High |
| Marquee/ticker | Full-width blue strip (darker blue than the search button). White text + gold/yellow ★ separators. Scrolling content visible: "...itive Prices ★ 24/7 Emergency Roadside Assistance Available ★ Certified RMI Workshops in Your Area ★ Get Instant Vehicle In..." | High |
| Background behind categories | Dark blurred automotive background photo (engine/gearshift area) — extends behind tiles | High |
| Footer area | Dark background. Broken/placeholder logo image + "MotorSphere SA Logo" text label | Medium |

---

## 2. Critical Design Finding — Dark Theme

> **This changes Base 2's token plan significantly.**

The Figma design is **dark-first** — the primary theme is near-black backgrounds, white/light text, and vibrant coloured accents (category tiles, buttons). This is not a light-mode design with an optional dark mode.

**Implications for implementation:**

| Decision | Recommendation |
|---|---|
| **Primary theme** | Dark mode — implement dark as the default, not an option |
| **Background tokens** | Near-black (`#0A0A0A` to `#111111`), not white |
| **Surface tokens** | Dark surfaces (`#1A1A1A` to `#262626`) for cards, inputs |
| **Text tokens** | White/light primary, mid-grey secondary |
| **shadcn/ui theming** | Set dark mode as default class on `<html>` element |
| **Tailwind** | Design dark-first in `@theme` — no need for `prefers-color-scheme: dark` switching |
| **Light mode** | Defer entirely. Build dark-first, consider light mode as Phase 2 if needed |

**What this means for `globals.css`:**
The token plan from BASE-2 assumed a light-mode default with dark mode as a media query override. That plan must be inverted — dark is the base, light is never built for MVP.

---

## 3. Confirmed Design Tokens

### 3.1 — Colours (from screenshots — hex values are estimates; ⚠️ = must confirm in Figma)

#### Background & Surface
| Token | Estimated Value | Source | Status |
|---|---|---|---|
| `--color-background` | `#0A0A0A` | Page background | ⚠️ Confirm |
| `--color-surface` | `#141414` | Card/section surfaces | ⚠️ Confirm |
| `--color-surface-muted` | `#1C1C1C` | Input backgrounds, subtle dividers | ⚠️ Confirm |
| `--color-surface-elevated` | `#222222` | Modals, dropdowns | ⚠️ Confirm |
| `--color-header-bg` | `#000000` | Header background | ⚠️ Confirm |

#### Text
| Token | Estimated Value | Source | Status |
|---|---|---|---|
| `--color-foreground` | `#FFFFFF` | Primary text (tile labels, headings) | High confidence |
| `--color-foreground-muted` | `#A0A0A0` | Secondary text, captions | ⚠️ Confirm |
| `--color-foreground-subtle` | `#606060` | Placeholder text | ⚠️ Confirm |

#### Brand / Interactive
| Token | Estimated Value | Source | Status |
|---|---|---|---|
| `--color-brand-primary` | `#1976D2` or `#2196F3` | "Search" button, "Learn More" text, active elements | ⚠️ Confirm exact |
| `--color-brand-primary-fg` | `#FFFFFF` | Text on primary colour | High confidence |
| `--color-ticker-bg` | `#1565C0` or `#1A56DB` | Marquee strip background | ⚠️ Confirm |

#### Category Tile Colours (all ⚠️ — confirm exact hex from Figma)

These are the most distinctive brand colours in the design. Each category has an assigned colour.

| Category | Tile Colour (estimated) | Figma Confirmed? |
|---|---|---|
| Vehicle Search | `#1976D2` (medium blue) | ⚠️ |
| Trucks & Buses | `#1E2D4A` (dark navy) | ⚠️ |
| Parts | `#2E7D32` (green) | ⚠️ |
| Spares | `#C62828` (orange-red) | ⚠️ |
| Tyres | `#37474F` (dark blue-grey) | ⚠️ |
| Panelbeaters | `#E65100` (deep orange) | ⚠️ |
| Vehicle Tracking | `#00796B` (teal) | ⚠️ |
| Dealerships | `#B71C1C` (dark red) | ⚠️ |
| Vehicle Insurance | `#00695C` (dark teal) | ⚠️ |
| RMI Workshops | `#4527A0` (deep purple) | ⚠️ |
| Non RMI Mechanic | `#00897B` (medium teal) | ⚠️ |
| Towing Services | `#E65100` (amber-orange) | ⚠️ |
| Emergency Roadside | `#C62828` (red) | ⚠️ |

> **Note:** Spares and Emergency Roadside appear to share the same red. Dealerships is slightly darker red than Emergency Roadside. These need exact hex values — the category colours are core to the visual identity.

### 3.2 — Spacing & Shape (from screenshots)

| Token | Estimated Value | Status |
|---|---|---|
| Search bar border radius | `9999px` (full pill/rounded) | High confidence |
| Category tile border radius | `12px` – `16px` | ⚠️ Confirm |
| "Learn More" button border radius | `6px` – `8px` | ⚠️ Confirm |
| Header height | `60px` – `70px` | ⚠️ Confirm |
| Category tile gap | `8px` – `12px` | ⚠️ Confirm |
| Category tile height | `~150px` – `170px` | ⚠️ Confirm |
| Page horizontal padding | `~16px` – `24px` | ⚠️ Confirm |

### 3.3 — Typography (from screenshots)

| Property | Observation | Status |
|---|---|---|
| Font family | Clean sans-serif — looks like **Inter**, **Poppins**, or similar | ⚠️ Confirm in Figma |
| Hero heading weight | Bold (700) | High confidence |
| Hero heading size | ~`28px` – `32px` at this viewport | ⚠️ Confirm |
| Category tile label | Bold (600–700), ~`13px` – `15px` | ⚠️ Confirm |
| Search placeholder | Regular (400), ~`14px` – `16px` | ⚠️ Confirm |
| Marquee text | Medium (500), ~`13px` – `14px` | ⚠️ Confirm |

### 3.4 — Layout

| Property | Observation | Status |
|---|---|---|
| Page max-width | Appears full-width with internal max-width container | ⚠️ Confirm |
| Category grid | 6 columns at desktop viewport (~1280px+) | High confidence |
| Hero image | 100vw, fixed height or aspect-ratio based | ⚠️ Confirm height |
| Search bar position | Below the hero image, centered, ~80% of page width | ⚠️ Confirm |
| Marquee position | Below category grid, above footer | High confidence |

---

## 4. Missing Design Information — Provide These Before Base 3

> These items cannot be determined from the two screenshots. Work through this list and provide screenshots, exports, or values.

### PRIORITY 1 — Block Base 3 if missing

```
[ ] Exact hex colour for brand primary (search button blue)
[ ] Exact hex for all 13 category tile colours
[ ] Font family name (used for body + headings)
[ ] Vehicle listing card design — grid view (CRITICAL — first thing built in Base 4)
[ ] Parts listing card design (CRITICAL — needed in Base 5)
[ ] Login and Register page designs
[ ] Mobile homepage (375px) — how does the 6-column category grid collapse?
[ ] Mobile navigation — what does the "≡ Menu" open to?
```

### PRIORITY 2 — Need before or during Base 4

```
[ ] Vehicle browse/search page (listing grid + filters)
[ ] Vehicle detail page (images, details, inquiry button)
[ ] Dashboard overview page (user)
[ ] Create vehicle listing form (multi-step or single page?)
[ ] Header — authenticated state (avatar, notifications, etc.)
[ ] "Coming Soon" treatment for Phase 2 category tiles
```

### PRIORITY 3 — Need before Base 7

```
[ ] Parts browse page
[ ] Parts detail page
[ ] My Listings page
[ ] Inquiry flow (modal? page?)
[ ] Saved listings page
[ ] Account settings page
[ ] Admin dashboard design (or confirm: build independently without Figma)
```

### NICE TO HAVE

```
[ ] 404 page
[ ] Empty state illustration style
[ ] Hover states on category tiles
[ ] Hover states on buttons
[ ] Form field error states
[ ] Toast/notification design
[ ] Loading skeleton style
[ ] Footer — full design (links, columns, legal text)
[ ] Logo file (SVG) — currently showing as broken image in Figma
```

---

## 5. Figma-to-App Screen Mapping

> **Legend:**
> - ✅ Visible in screenshots
> - 🔗 Confirmed in Figma (not yet accessed)
> - ⬜ Not yet seen — design unknown
> - 🔴 Design improvement recommended — see Section 8

| # | Figma Screen | Next.js Route | Key Components Needed | Firebase Collections | Responsive Behaviour | Priority |
|---|---|---|---|---|---|---|
| 1 | **Homepage** | `/` | `Hero`, `SearchBar`, `CategoryGrid`, `CategoryTile`, `Marquee`, `Header`, `Footer` | `vehicles` (featured, recent), `parts` (recent) | 6-col tiles → 3-col → 2-col → 1-col. Hero stack. Search full-width. | BASE 8 |
| 2 | **Vehicle Browse** | `/vehicles` | `ListingGrid`, `VehicleCard`, `ListingFilters`, `SortDropdown`, `ActiveFilters`, `Pagination` | `vehicles` (status=active, indexed) | Filters drawer on mobile. Grid 4→3→2→1 col. | BASE 4 |
| 3 | **Vehicle Detail** | `/vehicles/[id]` | `ImageGallery`, `VehicleDetails`, `SellerCard`, `InquiryDialog`, `SaveButton`, `BreadcrumbNav` | `vehicles/{id}`, `users/{sellerId}` | Single column on mobile. Gallery stacks. | BASE 4 |
| 4 | **Parts Browse** | `/parts` | `ListingGrid`, `PartsCard`, `ListingFilters`, `FitmentSelector` | `parts` (status=active, indexed) | Same as vehicles browse | BASE 5 |
| 5 | **Parts Detail** | `/parts/[id]` | `ImageGallery`, `PartsDetails`, `CompatibilityTable`, `InquiryDialog`, `SaveButton` | `parts/{id}`, `users/{sellerId}` | Same as vehicle detail | BASE 5 |
| 6 | **Login** ⬜ | `/login` | `AuthLayout`, `LoginForm`, `SocialLoginButton` | Firebase Auth only | Centred card, full-height | BASE 3 |
| 7 | **Register** ⬜ | `/register` | `AuthLayout`, `RegisterForm`, `SocialLoginButton` | Firebase Auth, `users` (created on register) | Centred card, full-height | BASE 3 |
| 8 | **Forgot Password** ⬜ | `/forgot-password` | `AuthLayout`, `ForgotPasswordForm` | Firebase Auth only | Centred card | BASE 3 |
| 9 | **Email Verify** ⬜ | `/verify-email` | `AuthLayout`, `VerifyEmailStatus` | Firebase Auth only | Centred card | BASE 3 |
| 10 | **Dashboard** ⬜ | `/dashboard` | `DashboardLayout`, `StatsCards`, `RecentListings`, `RecentInquiries` | `vehicles` (userId=me), `parts` (userId=me), `inquiries` | Sidebar collapses on mobile | BASE 4 |
| 11 | **My Listings** ⬜ | `/dashboard/listings` | `DashboardLayout`, `MyListingTable`, `ListingStatusBadge` | `vehicles` + `parts` (userId=me) | Table → stacked cards on mobile | BASE 4 |
| 12 | **New Vehicle Listing** ⬜ | `/dashboard/listings/new/vehicle` | `MultiStepForm`, `MakeModelSelector`, `ImageUploader`, `PriceInput` | `vehicles`, Firebase Storage | Full-width steps on mobile | BASE 4 |
| 13 | **New Parts Listing** ⬜ | `/dashboard/listings/new/parts` | `MultiStepForm`, `PartsCategorySelector`, `FitmentSelector`, `ImageUploader` | `parts`, Firebase Storage | Full-width steps on mobile | BASE 5 |
| 14 | **My Inquiries** ⬜ | `/dashboard/inquiries` | `DashboardLayout`, `InquiryList`, `InquiryThread`, `ReplyForm` | `inquiries/{id}`, `inquiries/{id}/replies` | Thread stacks on mobile | BASE 6 |
| 15 | **Saved Listings** ⬜ | `/dashboard/saved` | `DashboardLayout`, `SavedListingGrid`, `VehicleCard`, `PartsCard` | `savedListings` (userId=me) | Same as browse grids | BASE 6 |
| 16 | **Account Settings** ⬜ | `/account/settings` | `DashboardLayout`, `ProfileForm`, `AvatarUpload`, `DangerZone` | `users/{uid}`, Firebase Storage | Stacked on mobile | BASE 3 |
| 17 | **Public Profile** ⬜ | `/profile/[username]` | `ProfileHeader`, `SellerListingGrid`, `VerifiedBadge` | `users/{username}`, `vehicles`, `parts` | Stacked on mobile | BASE 4 |
| 18 | **Admin Dashboard** ⬜ | `/admin` | `AdminLayout`, `AdminStats`, `PendingQueue`, `RecentUsers` | `vehicles`+`parts` (status=pending), `users` (recent) | Desktop primary | BASE 7 |
| 19 | **Admin Pending** ⬜ | `/admin/listings/pending` | `AdminLayout`, `PendingListingCard`, `ModerationActions` | `vehicles`+`parts` (status=pending_review) | Desktop primary | BASE 7 |
| 20 | **Admin Users** ⬜ | `/admin/users` | `AdminLayout`, `UserTable`, `UserActionMenu` | `users` | Desktop primary | BASE 7 |
| 21 | **How It Works** ⬜ | `/how-it-works` | `HowItWorksLayout`, `StepCards` | None | Standard page | BASE 8 |
| 22 | **About** ⬜ | `/about` | Static content | None | Standard page | BASE 8 |
| 23 | **Contact** ⬜ | `/contact` | `ContactForm` | None (email via Cloud Function) | Standard page | BASE 8 |
| 24 | **Privacy Policy** ⬜ | `/privacy` | Static content | None | Standard page | BASE 8 |
| 25 | **Terms** ⬜ | `/terms` | Static content | None | Standard page | BASE 8 |
| 26 | **404** ⬜ | `not-found.tsx` | `ErrorPage` | None | Standard page | BASE 8 |

---

## 6. Homepage — Detailed Component Breakdown

The homepage is the most visually detailed screen visible. Breaking it down component by component.

---

### 6.1 — `<Header>`

**What Figma shows:**
```
┌─────────────────────────────────────────────────────────────────┐
│  ≡ Menu                                    🌐 English   ⚙       │
└─────────────────────────────────────────────────────────────────┘
  Dark/black background. No visible logo at this scroll position.
```

**Design improvement flagged (see Section 8 #1):** The hamburger "Menu" on desktop is unconventional for a marketplace. Recommend: keep the hamburger on mobile (<1024px), switch to full nav links on desktop.

**Component:** `src/components/layout/Header.tsx`

```
Props needed:
  - isAuthenticated: boolean
  - user?: { displayName, avatarUrl, role }

Mobile:   [≡]  [Logo]  [Avatar or Sign In]
Desktop:  [Logo]  [Vehicles] [Parts] [How It Works]  [🔔] [Avatar ▾ ] or [Sign In] [Post Listing →]
```

---

### 6.2 — `<HeroSection>`

**What Figma shows:**
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   [Dark automotive photo background, full width]                │
│                                                                 │
│   ┌────────────────────────────────────────────┐    ×          │
│   │  Premium Car Insurance - Save up to 30%    │               │
│   │  Get comprehensive coverage with...         │               │
│   │                                             │               │
│   │  [ Learn More ]                             │               │
│   └────────────────────────────────────────────┘               │
│                                                                 │
│                            ● ○ ○                                │
└─────────────────────────────────────────────────────────────────┘
```

**Notes:**
- Background: Dark hero image (car/automotive theme)
- The promotional banner is a CAROUSEL — 3 slides (insurance ad is slide 1)
- Each slide: heading + sub-heading + CTA button
- The `×` dismiss closes the current slide / collapses the banner
- Pagination dots navigate between slides
- The hero height appears to be `~280px–320px` at this desktop viewport

**Design improvement flagged (see Section 8 #2):** The hero is used for insurance ads at MVP launch, but insurance is a Phase 2 feature. Recommend: for MVP launch, populate the hero carousel with MotorSphere's own value props (e.g., "Find your next vehicle", "South Africa's newest marketplace", "List in minutes").

**Component:** `src/components/marketplace/HeroSection.tsx`

```typescript
// Carousel slides come from one of:
// a) Static config array (MVP — no Firestore read needed)
// b) Firestore 'promotions' collection (Phase 2 — for paid banner ads)
// Decision: Static config for MVP. Add Firestore promotions in Phase 2.

type HeroSlide = {
  heading: string;
  subheading: string;
  ctaLabel: string;
  ctaHref: string;
  backgroundImage?: string;
}
```

---

### 6.3 — `<HeroSearchBar>`

**What Figma shows:**
```
┌────────────────────────────────────────────────────────────────────┐
│ 🔍  Search vehicles, parts, or auctions...              📍 [Search]│
└────────────────────────────────────────────────────────────────────┘
   Full pill/rounded rectangle. Dark background. Blue "Search" button.
```

**Critical note on search implementation with Firestore:**
The search bar in Figma says "Search vehicles, parts, or auctions..." — this implies free-text search. Firestore cannot do this natively. For MVP:
- Search triggers a route navigation: `/vehicles?q=toyota+corolla` or `/parts?q=brake+pads`
- The route page then runs Firestore queries by structured fields (make, model, category)
- Free-text search is NOT implemented at MVP — the URL param is used for pre-filling filter dropdowns

**Component:** `src/components/marketplace/HeroSearchBar.tsx`
- On desktop: single bar with a location/area dropdown hidden inside
- On mobile: full-width, tappable — opens a dedicated search/filter sheet

---

### 6.4 — `<CategoryGrid>` + `<CategoryTile>`

**What Figma shows:**
```
Row 1: [Vehicle Search] [Trucks & Buses] [Parts] [Spares] [Tyres] [Panelbeaters]
Row 2: [Vehicle Tracking] [Dealerships] [Vehicle Insurance] [RMI Workshops] [Non RMI Mechanic] [Towing Services]
Row 3: [Emergency Roadside]

Each tile:
┌──────────────────┐
│                  │
│   [white icon]   │
│                  │
│   Category Name  │  ← bold, white, centered
└──────────────────┘
  Coloured background (unique per category)
  Rounded corners (~12–16px)
  Equal width and height in grid
```

**Component:** `src/components/marketplace/CategoryGrid.tsx` + `src/components/marketplace/CategoryTile.tsx`

```typescript
type CategoryTile = {
  id: string;
  label: string;
  icon: LucideIcon | string;   // Lucide icon or custom SVG
  colour: string;               // hex — from category config
  href: string;                 // route or '#coming-soon'
  isAvailable: boolean;         // false = Phase 2, show "Coming Soon"
  phase: 1 | 2;
}
```

**Responsive behaviour:**
| Viewport | Columns |
|---|---|
| Mobile (< 640px) | 3 columns |
| Tablet (640px–1023px) | 4 columns |
| Desktop (≥ 1024px) | 6 columns |

The tile row with only 1 tile (Emergency Roadside) at 6 columns looks visually odd. Recommendation: group Emergency Roadside with Towing Services in the same tile row, or align the orphan tile left with `justify-start`.

---

### 6.5 — `<MarqueeTicker>`

**What Figma shows:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ★ Competitive Prices  ★ 24/7 Emergency Roadside Assistance Available
 ★ Certified RMI Workshops in Your Area  ★ Get Instant Vehicle Insurance
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Full-width blue strip. White text. Gold/yellow ★ separators. Scrolling right-to-left.
```

**Component:** `src/components/marketplace/MarqueeTicker.tsx`

```typescript
// Content: static config array for MVP
// Use CSS animation: scroll marquee using @keyframes translateX
// Must respect prefers-reduced-motion: pause animation

type TickerItem = { text: string }
```

**Accessibility note:** A scrolling marquee must pause on hover and respect `prefers-reduced-motion`. It must not be the only place important information appears.

---

### 6.6 — `<Footer>`

**What Figma shows (partial):**
```
  Dark background.
  [broken image] MotorSphere SA Logo
  (links and columns not visible in screenshot)
```

**What's confirmed:**
- Dark background (matches overall theme)
- Logo present (though broken in Figma — needs final logo asset)
- Full footer content not visible — needs a dedicated screenshot

---

## 7. Category System — MVP vs Phase 2 Split

The Figma shows 13 category tiles. Only 2 are in the MVP scope. The rest must be handled gracefully at launch.

| Category Tile | MVP Status | Route | Treatment at Launch |
|---|---|---|---|
| **Vehicle Search** | ✅ MVP | `/vehicles` | Fully functional |
| **Parts** | ✅ MVP | `/parts` | Fully functional |
| **Spares** | ⚠️ Consider | `/parts?category=spares` | Could redirect to Parts with category filter |
| **Trucks & Buses** | ⬜ Phase 2 | — | "Coming Soon" overlay on tile |
| **Tyres** | ⬜ Phase 2 | — | "Coming Soon" overlay — or merge into Parts |
| **Panelbeaters** | ⬜ Phase 2 | — | "Coming Soon" overlay |
| **Vehicle Tracking** | ⬜ Phase 2 | — | "Coming Soon" overlay |
| **Dealerships** | ⬜ Phase 2 | — | "Coming Soon" overlay |
| **Vehicle Insurance** | ⬜ Phase 2 | — | "Coming Soon" overlay |
| **RMI Workshops** | ⬜ Phase 2 | — | "Coming Soon" overlay |
| **Non RMI Mechanic** | ⬜ Phase 2 | — | "Coming Soon" overlay |
| **Towing Services** | ⬜ Phase 2 | — | "Coming Soon" overlay |
| **Emergency Roadside** | ⬜ Phase 2 | — | "Coming Soon" overlay |

**"Spares" decision:** In South African automotive context, "Spares" (used parts) and "Parts" (new parts/accessories) are distinct in the market. Recommend treating Spares as a filter within the Parts collection (`condition: 'used'`) rather than a separate route.

**"Coming Soon" tile treatment:**
```
┌──────────────────┐
│  [dim icon]      │
│  Category Name   │
│  ──────────────  │
│  Coming Soon     │  ← small badge or text overlay
└──────────────────┘
  Reduced opacity (~0.5), cursor: default, no hover effect
  OR: Full opacity but opens an "Email me when available" modal
```

**Recommendation:** Use a full-opacity "Coming Soon" badge rather than dimming. Dimmed tiles look broken — the "Coming Soon" treatment builds anticipation instead.

---

## 8. Design Improvement Recommendations

> These are flagged improvements to the Figma design. None block implementation — they are recommendations to review with the designer before building the affected screens.

---

### #1 — Desktop Navigation: Hamburger Menu

**Figma:** `≡ Menu` on all viewports including desktop.

**Issue:** Desktop users expect a visible navigation bar — a hamburger on desktop forces an extra click for every navigation action, which is uncommon and mildly disorienting on a marketplace.

**Recommendation:**
- Mobile (< 1024px): keep `≡ Menu` hamburger → slide-over sheet
- Desktop (≥ 1024px): show full nav links inline: `[Vehicles] [Parts] [How It Works]` + auth CTAs

**This is a standard responsive pattern and does not conflict with the Figma's mobile intent.**

---

### #2 — Hero Carousel: Insurance Ad at MVP Launch

**Figma:** Hero slide 1 is "Premium Car Insurance — Save up to 30%" — a Phase 2 feature.

**Issue:** Leading with an insurance ad when insurance isn't available yet creates user confusion and unmet expectations.

**Recommendation for MVP launch:** Replace carousel content with MotorSphere's own value props:
- Slide 1: "Find your next vehicle" — [Browse Vehicles →]
- Slide 2: "South Africa's newest automotive marketplace" — [How It Works →]
- Slide 3: "List your vehicle in minutes" — [Post a Vehicle →]

The carousel infrastructure stays exactly as Figma designed. Only the content changes for MVP.

---

### #3 — Search Bar: "Auctions" in Placeholder

**Figma:** Placeholder reads "Search vehicles, parts, or auctions..."

**Issue:** Auctions are not in scope for MVP or even Phase 2 planning.

**Recommendation:** Change placeholder to "Search vehicles, parts, or accessories..." for MVP. Update to include "auctions" when that feature is built.

---

### #4 — Category Grid: Orphan Tile (Emergency Roadside)

**Figma:** Emergency Roadside is a single tile in Row 3, leaving 5 empty grid positions.

**Issue:** A single tile in a 6-column grid creates significant visual imbalance, especially if Phase 2 tiles are shown as "Coming Soon".

**Recommendation:** At MVP (when most tiles are Coming Soon), show the active categories (Vehicle Search, Parts) prominently with larger tiles, and group Coming Soon tiles into a smaller secondary row or a single "More Coming Soon" collapsed section.

---

### #5 — Search Implementation vs Figma Expectations

**Figma:** A single global search bar (like Google) implying free-text search.

**Reality:** Firestore cannot do free-text search. Querying `where description contains 'corolla'` is not supported.

**Recommendation:**
- The search bar on the homepage navigates to `/vehicles` or `/parts` with query params
- On the browse page, the "search" becomes structured filter dropdowns (Make, Model, Province, Price Range)
- Add a visible note in the search bar's expanded state: "Search by make, model, location, or category"
- Phase 2: add Algolia to power true free-text search without changing the UI

---

### #6 — Language Selector (English / Afrikaans / Zulu)

**Figma:** `🌐 English` selector visible in header.

**Issue:** Multi-language is deferred to Phase 3 in our product plan.

**Recommendation:** Keep the visual element (it's in the header) but disable it with a tooltip "More languages coming soon" for MVP. This avoids a jarring redesign when i18n is implemented.

---

### #7 — Logo Status

**Figma:** Broken/placeholder logo image visible in both header area and footer.

**Issue:** No final logo asset is available. The MVP launch requires a production-quality logo SVG.

**Recommendation:** Use a text wordmark "**MotorSphere**" as an interim solution. Build the `<Logo>` component to accept an `src` prop — swap from text to SVG with zero code changes when the final asset arrives.

---

## 9. Updated Design Token Plan (Dark Theme)

> This replaces the light-mode-first token plan in BASE-2 Section 5. Dark is the default. No light mode at MVP.

**Updated `globals.css` structure:**

```css
@import "tailwindcss";

/* ─── MotorSphere Design Tokens — Dark Theme (default) ────────── */
@theme {

  /* ─── Backgrounds ─────────────────────────────────────────── */
  --color-background:         #0A0A0A;   /* ⚠️ Confirm from Figma */
  --color-surface:            #141414;   /* ⚠️ Confirm */
  --color-surface-muted:      #1C1C1C;   /* ⚠️ Confirm */
  --color-surface-elevated:   #222222;   /* ⚠️ Confirm */
  --color-header-bg:          #000000;   /* ⚠️ Confirm */

  /* ─── Text / Foreground ──────────────────────────────────── */
  --color-foreground:         #FFFFFF;
  --color-foreground-muted:   #A0A0A0;   /* ⚠️ Confirm */
  --color-foreground-subtle:  #606060;   /* ⚠️ Confirm */
  --color-foreground-inverse: #0A0A0A;

  /* ─── Brand Primary (blue — search button, links, CTAs) ───── */
  --color-brand-primary:      #1976D2;   /* ⚠️ Confirm exact */
  --color-brand-primary-hover:#1565C0;   /* ⚠️ Confirm */
  --color-brand-primary-fg:   #FFFFFF;

  /* ─── Ticker / Marquee ────────────────────────────────────── */
  --color-ticker-bg:          #1565C0;   /* ⚠️ Confirm */
  --color-ticker-fg:          #FFFFFF;
  --color-ticker-star:        #FFD700;   /* Gold ★ separators */

  /* ─── Borders ─────────────────────────────────────────────── */
  --color-border:             #2A2A2A;   /* ⚠️ Confirm */
  --color-border-strong:      #3A3A3A;   /* ⚠️ Confirm */
  --color-ring:               #1976D2;   /* Focus ring = brand primary */

  /* ─── Semantic ────────────────────────────────────────────── */
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

  /* ─── Listing Status ──────────────────────────────────────── */
  --color-status-active:      #2E7D32;
  --color-status-pending:     #F57F17;
  --color-status-sold:        #505050;
  --color-status-paused:      #404040;
  --color-status-rejected:    #C62828;
  --color-status-draft:       #404040;

  /* ─── Category Tile Colours ⚠️ All need Figma confirmation ── */
  --color-tile-vehicle-search:  #1976D2;
  --color-tile-trucks:          #1E2D4A;
  --color-tile-parts:           #2E7D32;
  --color-tile-spares:          #C62828;
  --color-tile-tyres:           #37474F;
  --color-tile-panelbeaters:    #E65100;
  --color-tile-tracking:        #00796B;
  --color-tile-dealerships:     #B71C1C;
  --color-tile-insurance:       #00695C;
  --color-tile-rmi-workshops:   #4527A0;
  --color-tile-non-rmi:         #00897B;
  --color-tile-towing:          #E65100;
  --color-tile-emergency:       #C62828;

  /* ─── Typography ──────────────────────────────────────────── */
  --font-sans:    "Inter", var(--font-geist-sans), ui-sans-serif, sans-serif; /* ⚠️ Confirm font */
  --font-mono:    var(--font-geist-mono), ui-monospace, monospace;

  /* ─── Radius ──────────────────────────────────────────────── */
  --radius-sm:    4px;
  --radius-md:    8px;     /* ⚠️ Confirm — category tiles appear ~12–16px */
  --radius-lg:    12px;    /* Tiles */
  --radius-xl:    16px;
  --radius-full:  9999px;  /* Search bar, pill buttons */

  /* ─── Layout ──────────────────────────────────────────────── */
  --header-height:        64px;   /* ⚠️ Confirm */
  --max-width-page:       1280px;
  --spacing-page-x:       1rem;
  --spacing-page-x-md:    1.5rem;
  --spacing-page-x-lg:    2rem;
}

/* ─── shadcn/ui compatibility aliases (dark defaults) ──────────── */
:root {
  --background:           var(--color-background);
  --foreground:           var(--color-foreground);
  --card:                 var(--color-surface);
  --card-foreground:      var(--color-foreground);
  --popover:              var(--color-surface-elevated);
  --popover-foreground:   var(--color-foreground);
  --primary:              var(--color-brand-primary);
  --primary-foreground:   var(--color-brand-primary-fg);
  --secondary:            var(--color-surface-muted);
  --secondary-foreground: var(--color-foreground);
  --muted:                var(--color-surface-muted);
  --muted-foreground:     var(--color-foreground-muted);
  --accent:               var(--color-brand-primary);
  --accent-foreground:    var(--color-brand-primary-fg);
  --destructive:          var(--color-destructive);
  --destructive-foreground: var(--color-destructive-fg);
  --border:               var(--color-border);
  --input:                var(--color-border);
  --ring:                 var(--color-ring);
  --radius:               var(--radius-lg);
}
```

> **Important:** shadcn/ui components by default expect light mode CSS variables. After running `npx shadcn@latest init`, you must either:
> (a) Force the `.dark` class on `<html>` permanently for dark-first mode, or
> (b) Override the `:root` variables directly with dark values (recommended for MotorSphere — dark is the only mode at MVP)
>
> Set `<html className="dark">` in `layout.tsx` so shadcn components render in dark mode automatically.

---

## 10. Component Mapping from Figma Screenshots

Based solely on what is visible in the two screenshots, these components are confirmed as needed:

### Confirmed Components (Homepage only)

| Component File | Figma Source | shadcn Base | Status |
|---|---|---|---|
| `layout/Header.tsx` | ≡ Menu + Language selector | `Sheet` (mobile nav) | Needs design input for desktop nav |
| `marketplace/HeroSection.tsx` | Full hero with carousel + overlay | — | Needs slide content config |
| `marketplace/HeroCarousel.tsx` | 3-slide carousel with dots | — | Consider `embla-carousel-react` |
| `marketplace/HeroSearchBar.tsx` | Search bar + location pin + button | `Input`, `Button` | Pill radius variant |
| `marketplace/CategoryGrid.tsx` | 6-col grid of category tiles | — | Responsive grid wrapper |
| `marketplace/CategoryTile.tsx` | Individual coloured tile + icon + label | — | Needs all 13 colour variants |
| `marketplace/MarqueeTicker.tsx` | Blue scrolling strip | — | CSS `@keyframes`, pause on hover |
| `layout/Footer.tsx` | Dark footer with logo | — | Needs full footer screenshot |

### Components Needed But Not Visible Yet

| Component File | For Screen | Priority |
|---|---|---|
| `listings/VehicleCard.tsx` | Vehicle browse page | HIGH — Base 4 |
| `listings/PartsCard.tsx` | Parts browse page | HIGH — Base 5 |
| `listings/ImageGallery.tsx` | Listing detail pages | HIGH — Base 4 |
| `forms/MultiStepForm.tsx` | Create listing | HIGH — Base 4 |
| `forms/MakeModelSelector.tsx` | Create vehicle listing | HIGH — Base 4 |
| `forms/ImageUploader.tsx` | Create listing (both) | HIGH — Base 4 |
| `layout/DashboardSidebar.tsx` | Dashboard | MEDIUM — Base 4 |
| `admin/PendingListingCard.tsx` | Admin moderation | MEDIUM — Base 7 |
| `shared/EmptyState.tsx` | All empty list views | MEDIUM — Base 4 |
| `shared/Pagination.tsx` | Browse pages | MEDIUM — Base 4 |

---

## 11. What to Send Next

To unblock Base 3 and beyond, provide the following in order of priority:

### 🔴 Send Now (unblocks Base 3 immediately)

1. **Exact hex values** for the brand primary blue (search button) — inspect in Figma: click the Search button → look at fill colour
2. **Exact hex values** for all 13 category tile colours — inspect each tile in Figma
3. **Font family name** — click any text in Figma → look at the font property in the right panel
4. **Login / Register page screenshots** (mobile + desktop) — these are needed before any auth code is written
5. **Mobile homepage screenshot** (at 375px width) — shows how the 6-col category grid collapses

### 🟡 Send Before Base 4

6. **Vehicle listing card** — screenshot of the card used in the vehicle browse grid
7. **Vehicle detail page** — full mobile + desktop screenshot
8. **Dashboard overview page** — screenshot
9. **Header — authenticated state** — what shows when a user is logged in?

### 🟢 Send Before Base 5–7

10. **Parts listing card and detail page**
11. **Create vehicle listing form** (multi-step? single page? each step if multi)
12. **My Listings page** — table or card list?
13. **Inquiry modal/dialog** — what does "Contact Seller" look like?
14. **Admin dashboard** (or confirm: design independently without Figma)
15. **Final logo SVG** — header and footer

### 🔵 Also useful (can work without these)

16. **Footer full design** — full screenshot showing all columns and links
17. **404 page design**
18. **Any hover/active state** examples (tiles, buttons, cards)
19. **Empty state illustration** style or examples

---

## Document Control

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-05-27 | MotorSphere Team | Initial Figma intake document — extracted from 2 homepage screenshots + Figma URL |

---

*Colour tokens marked ⚠️ must be confirmed from Figma before globals.css is finalised. Everything else (routes, component names, architecture, Firebase collections, responsive rules) is locked from this analysis.*
