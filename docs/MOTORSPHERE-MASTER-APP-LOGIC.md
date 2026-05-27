# MotorSphere — Master App Logic Document

> **Version:** 1.0  
> **Date:** 2026-05-27  
> **Status:** Authoritative source of truth — all build phases must align with this document.  
> **Audience:** Developers, designers, product owners, AI coding assistants.

---

## Table of Contents

1. [Platform Purpose](#1-platform-purpose)
2. [Core Rule — The Master Equation](#2-core-rule--the-master-equation)
3. [User Roles](#3-user-roles)
4. [Public Visitor Permissions](#4-public-visitor-permissions)
5. [Registration and Onboarding Logic](#5-registration-and-onboarding-logic)
6. [Role-Specific Onboarding Requirements](#6-role-specific-onboarding-requirements)
7. [Verification Logic](#7-verification-logic)
8. [Listing Lifecycle Logic](#8-listing-lifecycle-logic)
9. [Subscription and Package Logic](#9-subscription-and-package-logic)
10. [Entitlement Logic](#10-entitlement-logic)
11. [Inquiry and Contact Seller Logic](#11-inquiry-and-contact-seller-logic)
12. [Save and Compare Logic](#12-save-and-compare-logic)
13. [Admin Moderation Logic](#13-admin-moderation-logic)
14. [POPIA and Privacy Logic](#14-popia-and-privacy-logic)
15. [Dashboard Logic](#15-dashboard-logic)
16. [Error Handling Logic](#16-error-handling-logic)
17. [Prototype Logic vs Production Logic](#17-prototype-logic-vs-production-logic)
18. [Next Build Order](#18-next-build-order)

---

## 1. Platform Purpose

**MotorSphere** is a South African all-in-one automotive marketplace platform. It is not a single-category classifieds site — it is a unified ecosystem that connects every participant in the South African automotive value chain.

### What MotorSphere covers

| Domain | Description |
|---|---|
| **Vehicle listings** | New and used vehicles — private sellers, dealers, fleet disposals |
| **Parts & spares** | OEM, aftermarket, reconditioned parts and spares vendors |
| **Tyres & fitment** | Tyre retailers, wheel fitment, rim & tyre packages |
| **Workshops & mechanics** | Independent garages, franchise service centres, mobile mechanics |
| **Panel beaters & body shops** | Accident repair, spray painting, panel beating |
| **Dealerships** | Licensed vehicle dealers — floor stock, F&I products, trade-ins |
| **Insurance** | Vehicle insurance referrals and quote request submissions |
| **Towing services** | Emergency tow operators and roadside recovery |
| **Emergency roadside** | Roadside assistance providers, breakdown services |
| **Tracking & security** | Vehicle tracking, immobilisers, smash-and-grab |
| **Vehicle finance** | Finance referrals, affordability calculators (future) |
| **Auctions** | Live and timed auction listings (future) |

### What MotorSphere is NOT

- It is **not** an insurance provider — it facilitates quote requests.
- It is **not** a payment processor — it facilitates inquiries. Transactions happen off-platform (PayFast integration is a future phase).
- It is **not** a universal chat platform — it has a scoped inquiry/reply system.
- It is **not** publicly editable — every listing requires admin approval before going live.

---

## 2. Core Rule — The Master Equation

Every permitted action on MotorSphere is the result of evaluating **seven combined factors**. No single factor alone determines what a user can do.

```
userRole
  + accountStatus
  + onboardingStatus
  + verificationStatus
  + subscriptionStatus
  + listingStatus
  + adminApproval
= allowed actions
```

### Factor definitions

| Factor | What it represents | Where it lives |
|---|---|---|
| `userRole` | The platform role the user registered as | Firestore `users/{uid}.accountType` + Firebase Auth custom claim `role` |
| `accountStatus` | Whether the account is active, suspended, or pending deletion | Firestore `users/{uid}.isSuspended` |
| `onboardingStatus` | Whether the user has completed their role-specific onboarding | Firestore `users/{uid}.onboardingComplete` |
| `verificationStatus` | Whether the user/business identity has been verified by MotorSphere admin | Firestore `users/{uid}.verificationStatus` |
| `subscriptionStatus` | Active package tier — free, starter, pro, etc. | Firestore `subscriptions/{uid}` (future) |
| `listingStatus` | The current state of an individual listing | Firestore `vehicles/{id}.status` or `parts/{id}.status` |
| `adminApproval` | Whether an admin has reviewed and approved an action or listing | Set by admin via Cloud Function or admin panel |

### How factors combine — worked examples

**Example A — Buyer viewing a vehicle listing:**
```
role=buyer + active + onboarded + (verification not required) + free + listing=live + approved
→ CAN view listing, save it, send inquiry
→ CANNOT edit listing, approve listing, access seller dashboard
```

**Example B — Private seller posting a vehicle:**
```
role=private_seller + active + onboarded + verified + active_package + listing=draft
→ CAN create listing, submit for review
→ CANNOT self-approve the listing (admin required)
→ listing is NOT live until adminApproval is granted
```

**Example C — Dealer with suspended account:**
```
role=dealer + SUSPENDED + onboarded + verified + pro_package
→ ALL actions blocked regardless of other factors
→ Dashboard accessible but all write operations return 403
→ Live listings remain visible but no new listings permitted
```

**Example D — Workshop with incomplete onboarding:**
```
role=workshop + active + NOT ONBOARDED + not_started
→ Dashboard redirects to onboarding prompt
→ Cannot post service listings
→ Cannot appear in workshop directory
```

---

## 3. User Roles

### Role overview

| Role | `accountType` value | Auth claim `role` | Registration path |
|---|---|---|---|
| Visitor | — (not registered) | — | Public — no auth |
| Buyer | `buyer` | `user` | Public registration |
| Private Seller | `private_seller` | `user` | Public registration |
| Dealer | `dealer` | `user` | Public registration + verification |
| Parts Vendor | `parts_vendor` | `user` | Public registration + verification |
| Workshop / Mechanic | `workshop` | `user` | Public registration + verification |
| Admin | — | `admin` | **NOT public** — created by super_admin only |
| Super Admin | — | `super_admin` | **NOT public** — Firebase Console or existing super_admin |

### Critical admin rule

> **Admin accounts are never created through public registration.**  
> The `/register` page does not offer an admin or super_admin option.  
> Admin roles are assigned exclusively by an existing `super_admin` via:
> - Firebase Console (manual custom claim set)
> - A callable Cloud Function `setUserRole` — callable only by `super_admin`
> - The MotorSphere Admin Panel (Base 7)

If someone attempts to register with `role: 'admin'` or set it via a client request, Firestore Security Rules will reject it:

```
// firestore.rules — enforced on every write, cannot be bypassed
allow create: if request.resource.data.role == 'user'
```

### Role capability summary

| Capability | Visitor | Buyer | Private Seller | Dealer | Parts Vendor | Workshop | Admin |
|---|---|---|---|---|---|---|---|
| Browse listings | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Search | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View listing detail | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Save listing | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Send inquiry | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Post vehicle listing | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Post parts listing | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Post service listing | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Approve listings | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Verify users | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Suspend accounts | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Access admin panel | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 4. Public Visitor Permissions

### What visitors can do WITHOUT registering

| Action | Notes |
|---|---|
| Browse homepage | Category tiles, hero banner, marquee ticker |
| Browse category pages | `/category/vehicles`, `/category/parts`, etc. |
| Search listings | `/search?q=` — returns live/approved listings only |
| View listing detail | Vehicles, parts, workshops, services |
| View workshop directory | `/workshops` — lists verified workshop profiles |
| View roadside/insurance pages | Static informational pages |
| Read About Us | `/about` |
| Read Privacy Policy | `/privacy` |
| Read Terms of Service | `/terms` |
| Read Trust & Safety | `/trust-safety` |
| View public seller profile | Basic profile — name, rating, listings |

### What REQUIRES registration (any role)

| Action | Reason |
|---|---|
| Contact seller / send inquiry | Prevents spam; creates accountable inquiry record |
| Save listing to favourites | Requires a user account to persist saves |
| Compare listings | Saved state required |
| Post any listing | Must be authenticated and onboarded |
| Access dashboard | Protected route — session cookie required |
| Submit verification documents | Must be a registered user |
| Request POPIA data correction | Must be identified user |

### How visitor access is enforced

Three layers (outermost to innermost):

1. **`src/proxy.ts` (Edge Runtime)** — checks for `__session` cookie presence. Redirects unauthenticated users away from protected paths. This is a UX guard only.
2. **Server Component layouts** — call `adminAuth.verifySessionCookie()` cryptographically before rendering any sensitive content.
3. **Firestore Security Rules** — enforce on every database read/write, regardless of what any Next.js code does. Cannot be bypassed.

---

## 5. Registration and Onboarding Logic

### The correct user journey

```
[/register page]
    │
    ▼
Step 1: Basic credentials
    • Email address
    • Password (min 8 chars, confirmation)
    • Display name
    │
    ▼
Step 2: Choose account type
    • Buyer
    • Private Seller
    • Dealer
    • Parts Vendor
    • Workshop / Mechanic
    ─── Admin is NOT listed here ───
    │
    ▼
Step 3: POPIA consent
    • Explicit checkbox — required before proceeding
    • Links to full Privacy Policy
    • Records: popiaConsentAccepted: true, popiaConsentDate: Timestamp
    │
    ▼
Step 4: Firebase Auth account created
    • createUserWithEmailAndPassword()
    • ID token retrieved
    • Session cookie created via POST /api/auth/session
    │
    ▼
Step 5: Firestore users/{uid} profile created
    • role: 'user' (security role — fixed)
    • accountType: chosen type
    • isVerified: false
    • isSuspended: false
    • verificationStatus: 'not_started'
    • onboardingComplete: false
    • popiaConsentAccepted: true
    │
    ▼
Step 6: Role-specific onboarding
    • Buyer: lightweight (province, preferences) → can proceed immediately
    • Private Seller: contact details, province → can post after onboarding
    • Dealer: business details, RMI number → verification required
    • Parts Vendor: business details, location → verification required
    • Workshop: business details, specialisations → verification required
    │
    ▼
Step 7: Dashboard
    • Redirected to role-appropriate dashboard
    • If verification required: banner/prompt shown until verified
    • If onboarding incomplete: dashboard shows onboarding prompt
```

### Auth-only routes (redirect authenticated users away)

Authenticated users visiting `/login`, `/register`, or `/forgot-password` are immediately redirected to `/dashboard`.

### POPIA consent is mandatory and non-negotiable

- The register form's "Continue" button is disabled until the POPIA checkbox is checked.
- Unchecking after checking does not clear consent — the field must be explicitly unchecked and the user cannot proceed.
- Consent timestamp is stored in Firestore for compliance audit.
- If POPIA consent is missing from the profile at any later point, the account should be flagged for review.

---

## 6. Role-Specific Onboarding Requirements

---

### 6.1 Buyer

**Purpose:** Browse, save, and contact sellers. No listing capability.

| Item | Detail |
|---|---|
| Required fields at registration | Display name, email, password, province (optional but recommended) |
| Verification required | No |
| Dashboard destination | `/buyer` |
| Onboarding steps | Province selection, optional vehicle preferences |
| Allowed actions | Browse, search, save, inquire, compare, manage saved listings |
| Blocked actions | Post listings, approve listings, access seller tools, access admin |
| Subscription | Free — always |

**Buyer onboarding is lightweight.** The goal is to reduce friction — a buyer should be able to save a listing within 2 minutes of registration.

---

### 6.2 Private Seller

**Purpose:** List personal vehicles for sale (not a business — subject to private listing limits).

| Item | Detail |
|---|---|
| Required fields | Display name, email, password, phone number, province |
| Verification required | Soft — ID number or document may be requested for trust score; not mandatory before first listing |
| Dashboard destination | `/seller` |
| Onboarding steps | Phone number, province, accept seller terms |
| Allowed actions | Create vehicle listings (up to package limit), manage own listings, respond to inquiries, save other listings |
| Blocked actions | Dealer tools, inventory management, bulk listing, featured placement (requires upgrade) |
| Subscription | Free tier: limited listings — Starter / Pro tiers available later |

**Listing approval still required.** Even a basic private seller vehicle listing must go through admin review before becoming live.

---

### 6.3 Dealer

**Purpose:** Licensed motor vehicle dealer with stock floor, F&I products, potentially multiple locations.

| Item | Detail |
|---|---|
| Required fields | Dealership name, trading name, physical address, RMI membership number, contact person, phone, email |
| Verification required | **YES — mandatory before any listing goes live** |
| Verification documents | RMI certificate, business registration, ID of principal |
| Dashboard destination | `/dealer` |
| Onboarding steps | Business details form, upload verification documents, await admin review |
| Allowed actions (post-verification) | Bulk vehicle listings, dealer stock tools, showroom page, lead management, F&I referral links |
| Blocked actions (pre-verification) | Listings remain in draft — cannot be submitted for admin review |
| Subscription | Dealer packages — Basic, Standard, Premium (defined in §9) |

**Key rule:** A dealer account with `verificationStatus !== 'verified'` cannot submit listings for review. The listing submission button is disabled and shows: *"Complete verification to submit listings."*

---

### 6.4 Parts Vendor

**Purpose:** Business selling automotive parts, spares, and accessories — either a physical store or online.

| Item | Detail |
|---|---|
| Required fields | Business name, physical/postal address, type (OEM / aftermarket / reconditioned / mixed), phone, contact person |
| Verification required | **YES — mandatory** |
| Verification documents | Business registration, owner ID, stock inventory description |
| Dashboard destination | `/vendor` |
| Onboarding steps | Business profile form, upload documents, await verification |
| Allowed actions (post-verification) | Parts listings, category tagging, fitment vehicle compatibility tagging, bulk upload (future) |
| Blocked actions (pre-verification) | Listing submission blocked |
| Subscription | Vendor packages — Basic, Standard, Premium |

---

### 6.5 Workshop / Mechanic

**Purpose:** Automotive service provider — independent workshop, franchise service centre, mobile mechanic, panel beater, tyre fitment, etc.

| Item | Detail |
|---|---|
| Required fields | Business name, physical address, service types (multi-select), operating hours, contact person, phone |
| Verification required | **YES — mandatory for workshop directory listing** |
| Verification documents | Business registration, RMI certificate (if applicable), owner/manager ID |
| Dashboard destination | `/workshop` |
| Onboarding steps | Business profile form (services, hours, location), upload documents |
| Allowed actions (post-verification) | Appear in workshop directory, manage service listings, receive inquiries, display reviews (future) |
| Blocked actions (pre-verification) | Not visible in workshop directory, cannot receive inquiries |
| Subscription | Workshop packages — Basic, Standard, Premium |

**Note:** A mechanic operating from home (mobile mechanic) follows the same flow — verification confirms their identity and service legitimacy even without a registered business premises.

---

## 7. Verification Logic

Verification applies to the **user or business entity**, not automatically to every listing they submit. A verified user still has individual listings reviewed by admin before they go live.

### Verification statuses

| Status | Meaning | User-facing message |
|---|---|---|
| `not_started` | User has not initiated verification | "Start verification to unlock full features" |
| `in_progress` | User has opened the verification form but not submitted | "Complete your verification submission" |
| `submitted` | User has submitted documents — awaiting first admin view | "Verification submitted — under review" |
| `pending_review` | Admin has opened the submission and is actively reviewing | "Verification in progress — we'll notify you" |
| `verified` | Admin confirmed — user/business is legitimate | "Verified ✓" badge shown on profile and listings |
| `rejected` | Admin rejected the submission with a reason | "Verification rejected — see reason and resubmit" |
| `needs_more_info` | Admin reviewed but requires additional documents | "Additional information required — see notes" |

### Verification flow

```
User completes onboarding
    │
    ▼
User navigates to /verify
    │
    ▼
Verification form shown (role-specific document requirements)
    │
    ▼
User uploads documents (Firebase Storage — secure, admin-only access)
    │
    ▼
verificationStatus → 'submitted'
Admin notification triggered (Cloud Function)
    │
    ▼
Admin reviews in Admin Panel
    ├─ Approves → verificationStatus = 'verified'
    │              isVerified = true
    │              User notified
    │
    ├─ Rejects → verificationStatus = 'rejected'
    │             Rejection reason stored
    │             User notified with reason
    │
    └─ Needs more info → verificationStatus = 'needs_more_info'
                          Notes stored
                          User prompted to resubmit
```

### Verification document access

- Documents are uploaded to **Firebase Storage** in a path only accessible to the document owner and admins.
- Storage Security Rules enforce this — no public URL access to verification documents.
- Documents are **never** exposed in public Firestore reads.
- Documents may be retained per POPIA records requirements even after account deletion (see §14).

### What verification unlocks per role

| Role | Without Verification | With Verification |
|---|---|---|
| Buyer | Full access (verification not required) | — |
| Private Seller | Can draft listings; cannot submit for review | Can submit listings for admin review |
| Dealer | Cannot submit listings; not in dealer directory | Can submit listings; appears in dealer directory |
| Parts Vendor | Cannot submit listings | Can submit listings; appears in vendor directory |
| Workshop | Cannot appear in workshop directory | Appears in directory; receives inquiries |

---

## 8. Listing Lifecycle Logic

All listings — vehicles, parts, and services — follow the same lifecycle. A listing is **never visible to the public without admin approval**.

### Listing statuses

| Status | Who sets it | Public visible? | Description |
|---|---|---|---|
| `draft` | Seller (system default on create) | ❌ | Listing created but not submitted — only visible to owner |
| `submitted` | Seller (user action) | ❌ | Seller has submitted for review — awaiting admin |
| `pending_review` | Admin (on open) | ❌ | Admin has opened for review — in-progress |
| `approved` | Admin | ❌ | Admin approved — transitions to `live` immediately or on scheduled date |
| `live` | System (after approval) | ✅ | Publicly visible to all — appears in search results |
| `rejected` | Admin | ❌ | Admin rejected with reason — owner notified, can edit and resubmit |
| `sold` | Seller (user action) | ✅ (as sold, not for sale) | Vehicle/item sold — de-listed from search but accessible as record |
| `expired` | System (scheduled function) | ❌ | Listing age limit reached — owner prompted to renew |
| `flagged` | System / User report | ✅ (still live) | Reported by user — admin review queued, listing remains live until admin acts |
| `suspended` | Admin | ❌ | Admin suspended listing — owner notified with reason |

### Listing lifecycle flow

```
Seller creates listing
    │
    ▼
status: 'draft'
(visible to owner only — can edit freely)
    │
    ▼
Seller clicks "Submit for Review"
    │
    ▼
status: 'submitted'
Admin notification triggered
    │
    ▼
Admin opens listing in Admin Panel
    │
status: 'pending_review'
    │
    ├─ Admin approves
    │       │
    │       ▼
    │   status: 'approved' → immediately: status: 'live'
    │   Seller notified: "Your listing is now live"
    │
    ├─ Admin rejects
    │       │
    │       ▼
    │   status: 'rejected'
    │   Rejection reason stored on listing
    │   Seller notified with reason
    │   Seller can edit listing → resubmit → back to 'submitted'
    │
    └─ Admin requests changes
            │
            ▼
        status: 'rejected' (with reason type: 'changes_required')
        Seller edits and resubmits
```

### Seller actions per listing status

| Status | Seller can edit? | Seller can submit? | Seller can delete? | Seller can mark sold? |
|---|---|---|---|---|
| `draft` | ✅ | ✅ | ✅ | ❌ |
| `submitted` | ❌ | ❌ | ❌ | ❌ |
| `pending_review` | ❌ | ❌ | ❌ | ❌ |
| `approved` / `live` | ✅ (minor edits) | — | ✅ | ✅ |
| `rejected` | ✅ | ✅ | ✅ | ❌ |
| `sold` | ❌ | ❌ | ✅ | — |
| `expired` | ✅ | ✅ | ✅ | ❌ |
| `flagged` | ✅ | — | ✅ | ✅ |
| `suspended` | ❌ | ❌ | ❌ | ❌ |

### Listing visibility rules

Only listings with `status: 'live'` appear in:
- Public category browsing
- Search results
- "More from this seller" sections
- Workshop directory profiles

Firestore Security Rules enforce this:
```
function canReadListing(status, docUserId) {
  return status == 'live'
      || isOwner(docUserId)
      || isAdmin();
}
```

---

## 9. Subscription and Package Logic

> **⚠️ PayFast integration is deferred.** This section defines the intended business model and data structures. No payment processing is implemented in the current build. Package UI may be shown as "coming soon" screens in Base 8.

### Package tiers by role

#### Buyer — always free

| Feature | Free |
|---|---|
| Browse, search, save | ✅ |
| Inquiries | ✅ |
| Saved listings | ✅ unlimited |
| Compare | ✅ up to 4 |

#### Private Seller packages

| Feature | Free | Starter | Pro |
|---|---|---|---|
| Active vehicle listings | 2 | 5 | 15 |
| Photos per listing | 8 | 15 | 30 |
| Listing duration (days) | 30 | 60 | 90 |
| Featured listing | ❌ | 1 / month | 3 / month |
| Highlighted in search | ❌ | ❌ | ✅ |
| Inquiry management | Basic | Basic | Full |

#### Dealer packages

| Feature | Basic | Standard | Premium |
|---|---|---|---|
| Active vehicle listings | 25 | 75 | 250 |
| Photos per listing | 20 | 30 | 50 |
| Showroom profile page | ✅ | ✅ | ✅ + custom branding |
| Featured listings | 2 | 5 | 15 |
| Lead management tools | Basic | Full | Full + export |
| Finance calculator widget | ❌ | ✅ | ✅ |
| Bulk stock upload | ❌ | ✅ | ✅ |
| Advertising placements | ❌ | Banner eligible | Priority placement |

#### Parts Vendor packages

| Feature | Basic | Standard | Premium |
|---|---|---|---|
| Active parts listings | 50 | 200 | Unlimited |
| Photos per listing | 5 | 10 | 20 |
| Vehicle compatibility tagging | ❌ | ✅ | ✅ |
| Bulk upload (CSV) | ❌ | ✅ | ✅ |
| Featured listings | 1 | 5 | 15 |
| Brand storefront | ❌ | ❌ | ✅ |

#### Workshop packages

| Feature | Basic | Standard | Premium |
|---|---|---|---|
| Workshop directory listing | ✅ | ✅ | ✅ + priority |
| Service categories | 3 | All | All |
| Operating hours | ✅ | ✅ | ✅ |
| Photos on profile | 3 | 10 | 25 |
| Inquiry management | Basic | Full | Full |
| Promotional banner | ❌ | ❌ | ✅ |
| Customer reviews display | ❌ | ✅ | ✅ |

### Advertising / Featured listing packages

Advertising placements are sold separately and include:
- **Hero banner rotation** — homepage ad slideshow slot
- **Category page featured listing** — pinned at top of category
- **Search result spotlight** — highlighted card in search results
- **Workshop directory sponsored placement** — top of directory listing

These are admin-managed in the Advertising Banners section of the backoffice.

### PayFast integration (deferred — Base 9+)

- PayFast is South Africa's primary payment gateway.
- Integration will use PayFast's hosted payment pages (ITN — Instant Transaction Notification).
- Subscription records will be stored in Firestore `subscriptions/{uid}`.
- Payment records retained for 5 years per SARS/POPIA requirements.
- No payment card data will ever touch MotorSphere servers.

---

## 10. Entitlement Logic

Package status directly controls what a user can do within the platform. Entitlements are checked at the point of action — not just on page render.

### Entitlement checks and where they apply

| Entitlement | Checked in | Enforcement method |
|---|---|---|
| Listing limit | Listing creation flow + Cloud Function | Count active listings before allowing new draft |
| Photos per listing | Image upload component | Enforce max upload count client + Storage Rules |
| Featured listing quota | Feature toggle in listing editor | Cloud Function validates quota before setting featured=true |
| Bulk upload | Dashboard tools section | Gated component — only rendered if package includes feature |
| Lead access | Inquiry dashboard | Gated — basic plan sees preview only |
| Inventory tools | Dealer dashboard | Gated component — Basic plan sees upgrade prompt |
| Dealer stock tools | Dealer dashboard | Gated component |
| Workshop visibility | Workshop directory query | Only `verified` + `active_subscription` workshops returned |
| Advertising placements | Admin-set — not self-serve | Admin assigns placement slots via backoffice |

### Entitlement resolution order

```
1. Is account suspended?         → All entitlements blocked
2. Is onboarding complete?       → Blocked with onboarding prompt
3. Is subscription active?       → Check tier
4. Does tier include feature?    → Allow or show upgrade prompt
5. Has quota been reached?       → Allow or show quota message
6. Does listing/action qualify?  → Final allow/block decision
```

### Upgrade prompts

When a user hits an entitlement limit, they see:
- A clear explanation of what they hit (e.g., "You've used 2 of your 2 free listing slots")
- A direct CTA to upgrade (e.g., "Upgrade to Starter — R199/month")
- No error — the UI guides them, not blocks with a cryptic message

---

## 11. Inquiry and Contact Seller Logic

### Inquiry flow

```
Visitor views listing
    │
    ▼ (if not logged in)
"Contact Seller" button → redirected to /login?next=[listing-url]
    │
    ▼ (if logged in)
Buyer clicks "Contact Seller" or "Send Inquiry"
    │
    ▼
Inquiry form shown (pre-filled with listing context):
    • Message (required)
    • Phone number (optional — buyer's choice)
    │
    ▼
Firestore: /inquiries/{inquiryId} created
    • senderId = buyer uid
    • receiverId = listing owner uid
    • listingId = vehicle/parts id
    • listingType = 'vehicle' | 'part' | 'service'
    • message = buyer's message
    • isRead = false
    • status = 'open'
    • createdAt = Timestamp
    │
    ▼
Seller notification triggered (Cloud Function: onInquiryCreate)
    │
    ▼
Seller sees inquiry in /inquiries dashboard tab
    • Marked as new/unread
    • Can reply (thread of /replies sub-collection)
    │
    ▼
Buyer sees their inquiry in /inquiries history
    • Can view replies
    • Cannot delete inquiry (only admin can)
```

### Inquiry rules

- A buyer **cannot** send an inquiry to themselves (Firestore rule: `receiverId != uid()`).
- Only the sender and receiver can read an inquiry.
- Only the receiver can mark an inquiry as `isRead`.
- Only admins can delete inquiries.
- Inquiry content cannot be edited after creation — only replies can be added.
- Inquiries are retained for **24 months after account deletion** for dispute resolution (POPIA-compliant).

### Inquiry thread (replies)

```
/inquiries/{inquiryId}/replies/{replyId}
    • authorId
    • message
    • createdAt
```

- Both sender and receiver can create replies.
- Only admins can update or delete reply content (moderation).

---

## 12. Save and Compare Logic

### Save logic

```
Buyer clicks "Save" (heart/bookmark icon) on any listing
    │
    ├─ Not logged in → redirect to /login?next=[current-url]
    │
    └─ Logged in:
           Firestore: /savedListings/{savedId}
               • userId = uid
               • listingId = vehicle/parts id
               • listingType = 'vehicle' | 'part'
               • savedAt = Timestamp
           UI: icon toggles to "saved" state
```

### Saved listings rules

- Saves are **immutable** — to "unsave", the document is deleted and re-created on re-save.
- Only the owner can read, create, or delete their saved listings.
- If the underlying listing is deleted or suspended, the saved record remains but the UI shows "Listing no longer available."
- No limit on saved listings (buyers — always free).

### Compare logic

- Users can compare up to **4 listings** side by side.
- Comparison state is **session-only** (localStorage or React state) — not persisted to Firestore.
- Comparison is available for vehicles (compare specs, price, mileage) and parts (compare price, compatibility).
- Comparison UI is a dedicated overlay/page — `/compare?ids=id1,id2,id3`.

---

## 13. Admin Moderation Logic

### Admin access

- Admin routes are at `/admin/**`.
- Access requires Firebase Auth custom claim `role: 'admin'` or `role: 'super_admin'`.
- The proxy checks for `__session` cookie presence at the Edge.
- The `/admin` layout Server Component calls `adminAuth.verifySessionCookie()` and checks `decoded.role`.
- If role check fails: redirect to `/login` (not a 403 — avoid disclosing admin route existence to guessers).

### Admin moderation queues

| Queue | Contents | Admin actions available |
|---|---|---|
| **Pending listings** | All listings with `status: 'submitted'` or `'pending_review'` | Approve, Reject (with reason), Request changes |
| **Verification reviews** | Users with `verificationStatus: 'submitted'` or `'pending_review'` | Verify, Reject (with reason), Request more info |
| **Flagged listings** | Listings with `status: 'flagged'` (reported by users) | Clear flag, Suspend listing, Remove listing |
| **Reported users** | Users flagged via `adminFlags` collection | Warn, Suspend, Delete account |
| **Suspended accounts** | Users with `isSuspended: true` | Reinstate, Extend suspension, Permanently ban |

### Moderation data flow

```
User reports listing (flag button on listing detail)
    │
    ▼
Firestore: /adminFlags/{flagId}
    • type: 'listing' | 'user' | 'inquiry'
    • targetId: listing or user uid
    • reason: user-provided reason
    • flaggedBy: reporter uid
    • status: 'open'
    • createdAt: Timestamp
    │
    ▼
Admin sees flag in moderation queue
    │
    ▼
Admin reviews and acts:
    ├─ Clear flag → adminFlag status = 'resolved' (no action)
    ├─ Suspend listing → listing status = 'suspended'
    └─ Ban user → user isSuspended = true
```

### Audit logs (future — Base 7)

Every admin action is logged:
```
/auditLogs/{logId}
    • adminUid
    • action: 'approve_listing' | 'reject_listing' | 'verify_user' | etc.
    • targetId
    • targetType
    • reason (if applicable)
    • timestamp
```

Audit logs are **read-only** — no admin can delete them. Only `super_admin` can export them.

### Admin advertising management

- Admins manage the hero banner slideshow via the Backoffice modal (currently static data in `home-data.ts`).
- Future: admin creates banner records in Firestore → hero component reads from Firestore.
- Admin sets advertising placement for premium subscribers.
- Admin sees payment/subscription records (future — after PayFast integration).

---

## 14. POPIA and Privacy Logic

South Africa's **Protection of Personal Information Act (POPIA)** governs how MotorSphere handles user data.

### Data classification

| Data type | Classification | Who can access |
|---|---|---|
| Public listing content | Public | Anyone |
| User display name, public profile | Public | Anyone |
| User email address | Private | Owner + Admin only |
| Phone number | Private | Owner + Admin; shared with inquiry recipient only |
| Physical address | Private | Owner + Admin |
| Verification documents | Highly restricted | Admin only — never public |
| Payment records | Highly restricted | Admin + Finance (future) — never public |
| Inquiry messages | Private | Sender + Receiver + Admin |
| POPIA consent record | Private | Owner + Admin |

### Data retention rules

| Data type | Retention period | Reason |
|---|---|---|
| User profile | 30-day grace after deletion request | Allows account recovery |
| Verification documents | 2 years post-verification | Compliance and dispute resolution |
| Inquiry records | 24 months post-account deletion | Dispute resolution |
| Payment records | 5 years | SARS requirements |
| Audit logs | Indefinite | Platform integrity and compliance |
| Listings | 30 days post-deletion | SEO and buyer awareness |

### Account deletion flow (POPIA Article 24 — Right to Erasure)

```
User requests account deletion (from profile settings)
    │
    ▼
Account flagged: pendingDeletion = true, deletionRequestedAt = Timestamp
    │
    ▼
User loses access to platform (within 24 hours)
    │
    ▼
30-day grace period:
    • User can cancel deletion by contacting support
    • Active listings suspended immediately
    │
    ▼
After 30 days: Cloud Function executes deletion
    • Firebase Auth account deleted
    • Firestore user document anonymised (not deleted — replaced with tombstone)
    • PII fields: email, phone, displayName → replaced with anonymised values
    • Verification documents: deleted from Firebase Storage
    • Saved listings: deleted
    • Inquiries: sender/receiver fields anonymised — message content retained 24 months
    • Payment records: retained 5 years per SARS
```

### Data correction and access requests (POPIA Section 23)

Users may request:
- **Access** to all data MotorSphere holds about them → Admin exports and sends within 30 days
- **Correction** of inaccurate data → User can update most data via profile; sensitive corrections via support
- **Deletion** → Account deletion flow above

### Information Officer

- Required under POPIA before public launch.
- Must be a named person — registered with the Information Regulator.
- Contact must appear in the Privacy Policy.
- **Development is NOT blocked on this — it is a pre-launch requirement.**

---

## 15. Dashboard Logic

Each role has a purpose-built dashboard. The dashboard is the user's operational home — it shows where they are, what they can do, and what they need to do next.

### Dashboard routing

```
POST /login → /dashboard (generic entry point)
    │
    ▼
/dashboard page reads: profile.accountType via useAuth()
    │
    ▼
Redirects to role-specific dashboard:
    buyer           → /buyer
    private_seller  → /seller
    dealer          → /dealer
    parts_vendor    → /vendor
    workshop        → /workshop
    admin/super_admin → /admin
```

### What every dashboard must show

Every role-specific dashboard must always display:

| Element | Content |
|---|---|
| **Role badge** | "Buyer" / "Private Seller" / "Dealer" / etc. |
| **Account status** | Active / Suspended / Pending verification |
| **Onboarding status** | If incomplete: banner with next step CTA |
| **Verification status** | If required and not verified: banner with CTA |
| **Next step** | The single most important action the user should take right now |
| **Blocked actions** | Explain WHY and what they need to do to unblock |
| **Allowed actions** | Quick-access CTAs to key features |

---

### 15.1 Buyer Dashboard (`/buyer`)

| Section | Content |
|---|---|
| Header | "Good morning, [Name]" — role: Buyer |
| Status strip | Account active; no verification required |
| Next step | "Browse listings" or "View saved listings" |
| Quick actions | Browse vehicles · Browse parts · View saved · View inquiries |
| Saved listings | Last 3–5 saved listings with thumbnail |
| Inquiry history | Last 3–5 inquiries with status |
| No blocked actions | Buyers have full access |

---

### 15.2 Seller Dashboard (`/seller`)

| Section | Content |
|---|---|
| Header | "My Listings" — role: Private Seller |
| Status strip | Verification status (if required) |
| Next step | "Post your first listing" (if no listings) |
| Quick actions | New listing · My listings · Inquiries received |
| Listing summary | Active: N / Pending: N / Draft: N / Rejected: N |
| Recent inquiries | Latest inquiries on listings |
| Subscription status | Free (2 listings). "Upgrade for more" |
| Blocked actions | If not verified: "Submit listing" button disabled with reason |

---

### 15.3 Dealer Dashboard (`/dealer`)

| Section | Content |
|---|---|
| Header | "[Dealership Name]" — role: Dealer |
| Status strip | Verification status — prominent if pending |
| Next step | If unverified: "Complete verification" / If verified: "Add stock" |
| Quick actions | Add vehicle · Manage stock · Leads · Profile |
| Stock summary | Total stock / Live / Draft / Sold this month |
| Leads | New inquiries received today/this week |
| Subscription | Current package + listings used / allowed |
| Blocked actions | If unverified: cannot submit listings — shown clearly |

---

### 15.4 Vendor Dashboard (`/vendor`)

| Section | Content |
|---|---|
| Header | "[Business Name]" — role: Parts Vendor |
| Status strip | Verification status |
| Next step | "Add your first part listing" (if verified) or "Complete verification" |
| Quick actions | New listing · Manage listings · Inquiries |
| Listings summary | Active / Draft / Sold / Expired |
| Category performance | Top categories by views (future analytics) |
| Subscription | Current package + listing quota |

---

### 15.5 Workshop Dashboard (`/workshop`)

| Section | Content |
|---|---|
| Header | "[Workshop Name]" — role: Workshop |
| Status strip | Verification status — critical (not verified = not discoverable) |
| Next step | "Complete verification to appear in the workshop directory" |
| Quick actions | Edit profile · Manage services · View inquiries |
| Inquiry management | Customer inquiries received |
| Directory status | "Your workshop is live in the directory" / "Not yet visible" |
| Subscription | Current package |

---

### 15.6 Admin Dashboard (`/admin`)

| Section | Content |
|---|---|
| Header | "MotorSphere Backoffice" |
| Stats summary | Pending listings · Verification reviews · Flagged content · New inquiries |
| Queues | Pending listings / Verification reviews / Flagged listings / Reported users |
| User management | Search users, view profiles, change roles (super_admin only), suspend |
| Listing management | Search all listings regardless of status |
| Advertising | Manage hero banners and featured placements |
| Audit log | (future — Base 7) |
| Subscriptions/payments | (future — after PayFast) |

---

## 16. Error Handling Logic

All error states must give the user:
1. **What went wrong** — plain language, not an error code
2. **Why it went wrong** — brief context
3. **What to do next** — a clear CTA or instruction

### Error scenarios and correct responses

#### Email already registered
```
User tries to register with an existing email
    │
    ▼
Firebase Auth error: auth/email-already-in-use
    │
    ▼
UI shows: "An account with this email already exists.
           Sign in instead, or reset your password."
    • CTA: "Sign in" → /login
    • CTA: "Forgot password?" → /forgot-password
```

#### Failed profile creation (Firestore write fails after Auth succeeds)
```
Firebase Auth account created → Firestore write fails
    │
    ▼
UI shows: "Account created but we couldn't save your profile.
           Please sign in and complete your profile."
    • Log error to console (include uid for debugging)
    • DO NOT leave the user on a broken state
    • Redirect to /login
    • On login, onboardingComplete: false triggers onboarding prompt
```

#### Incomplete onboarding
```
User skips onboarding and tries to access restricted feature
    │
    ▼
Dashboard shows onboarding banner:
    "Complete your profile to unlock [feature]"
    • CTA links to specific incomplete step
    • Feature is disabled (not hidden — explains why)
```

#### Missing verification
```
Dealer/Vendor/Workshop tries to submit a listing without verification
    │
    ▼
Submit button disabled
Tooltip/Banner: "Verify your account to submit listings for review.
                Verification ensures trust for your buyers."
    • CTA: "Start verification" → /verify
```

#### Subscription inactive / quota reached
```
Private seller tries to create 3rd listing on free plan (limit: 2)
    │
    ▼
"New Listing" button disabled
Banner: "You've used 2 of your 2 free listing slots.
         Upgrade to Starter to list up to 5 vehicles."
    • CTA: "View packages" → /packages (Base 8)
```

#### Listing rejected
```
Seller's listing is rejected by admin
    │
    ▼
Listing appears in "Rejected" tab in seller dashboard
Email notification sent (Cloud Function)
Dashboard shows: "Listing rejected — [reason provided by admin]
                  Edit your listing and resubmit."
    • CTA: "Edit listing" → /listings/{id}/edit
    • CTA: "Contact support" → /contact
```

#### Unauthorized dashboard access
```
User navigates directly to /dealer when accountType = 'buyer'
    │
    ▼
Dashboard layout reads accountType from useAuth()
toNavKey(accountType) = 'buyer' → redirect to /buyer
No error shown — silent correct redirect
```

#### Session expired / cookie invalid
```
User's __session cookie expires (5-day TTL)
User navigates to any protected route
    │
    ▼
proxy.ts: no valid cookie → redirect to /login?next=[path]
After successful login → redirected back to intended path
```

#### Account suspended
```
User with isSuspended: true tries to access dashboard
    │
    ▼
Dashboard layout detects isSuspended: true
Shows: "Your account has been suspended.
        If you believe this is an error, contact support."
    • CTA: "Contact support" → /contact
    • All action buttons hidden (not just disabled)
    • Cannot post, inquire, save, or access listings management
```

---

## 17. Prototype Logic vs Production Logic

This section is critical for avoiding build confusion. It clearly separates what is currently static/clickable from what must connect to real systems.

### Current state (post Base 6A)

| Feature | Current State | What's needed for production |
|---|---|---|
| **User registration** | ✅ Real Firebase Auth | Live |
| **User login** | ✅ Real Firebase Auth | Live |
| **Session cookie** | ✅ Real httpOnly cookie | Live |
| **Firestore user profile** | ✅ Real — users/{uid} | Live |
| **Auth-aware nav bar** | ✅ Real — useAuth() | Live |
| **Protected routes** | ✅ Real — proxy.ts + layout | Live |
| **Role-based dashboard routing** | ✅ Real — accountType → /buyer, /seller etc. | Live |
| **Firestore Security Rules** | ✅ Real — deployed rules | Live |

### Currently static / prototype (must be replaced)

| Feature | Current State | Production replacement |
|---|---|---|
| **Listing creation** | Static form — no Firestore write | Base 6C: real Firestore write to /vehicles or /parts |
| **Listing display** | Static placeholder content | Base 6C: Firestore query for live listings |
| **Verification upload** | Form exists — no Storage write | Base 7: Firebase Storage upload + Cloud Function trigger |
| **Inquiry system** | Dashboard tab exists — no Firestore | Base 6D: real /inquiries Firestore writes |
| **Saved listings** | UI exists — no Firestore | Base 6D: real /savedListings Firestore writes |
| **Admin moderation** | Backoffice modal is static | Base 6E: real Firestore queries for pending/flagged |
| **Hero banner slideshow** | Static data in home-data.ts | Base 6E (admin): Firestore-backed banner records |
| **Workshop directory** | Static placeholder | Base 6C: Firestore query for verified workshops |
| **Subscription/packages** | No system exists | Base 8: package UI; Base 9: PayFast integration |
| **Email notifications** | Not implemented | Cloud Functions: Resend API for transactional email |
| **Push notifications** | Not implemented | Future |
| **Analytics/views count** | Static zeros | Cloud Function: incrementViewCount callable |
| **Image uploads** | Not implemented | Base 7: Firebase Storage + resize Function |
| **POPIA deletion workflow** | Not implemented | Base 8+: scheduled Cloud Function |

### What must connect to Firebase (not yet done)

| Action | Firebase service | Collection/path |
|---|---|---|
| Create listing | Firestore write | `/vehicles/{id}` or `/parts/{id}` |
| Upload listing images | Firebase Storage | `/listings/{listingId}/images/` |
| Submit for review | Firestore update | `status: 'submitted'` |
| Admin approve listing | Firestore update | `status: 'live'` |
| Send inquiry | Firestore write | `/inquiries/{id}` |
| Reply to inquiry | Firestore write | `/inquiries/{id}/replies/{id}` |
| Save listing | Firestore write | `/savedListings/{id}` |
| Upload verification docs | Firebase Storage | `/verification/{uid}/` |
| Admin verify user | Admin SDK callable | `isVerified: true`, `verificationStatus: 'verified'` |
| Flag listing | Firestore write | `/adminFlags/{id}` |
| Admin suspend user | Admin SDK callable | `isSuspended: true` |
| Set user role | Admin SDK callable | Custom claim via `setUserRole` |
| Subscription record | Firestore write | `/subscriptions/{uid}` (future) |
| Payment webhook | Cloud Function | PayFast ITN handler (future) |

### What must connect to PayFast (deferred — Base 9+)

- Package purchase / subscription initiation
- Subscription renewal
- Refund handling
- Payment record storage
- Invoice generation

---

## 18. Next Build Order

The following phases define the correct sequence for completing MotorSphere. Each phase builds directly on the previous one. Do not skip phases.

---

### Base 6B — Role-Based Onboarding and Verification Status UI

**Goal:** Complete the onboarding flow for each role and wire up verification status display.

**Scope:**
- Role-specific onboarding screens (post-registration step that's currently skipped)
  - Buyer: province, vehicle preferences
  - Private Seller: phone number, province
  - Dealer: business name, RMI number, address, contact
  - Parts Vendor: business name, type, address
  - Workshop: business name, services, hours, address
- Set `onboardingComplete: true` in Firestore on completion
- Dashboard onboarding banner if `onboardingComplete: false`
- Verification status display on dashboard (reading real `verificationStatus` from Firestore)
- `/verify` page: real file upload to Firebase Storage (basic — full Cloud Function in Base 7)
- `verificationStatus` update to `'submitted'` after upload

**Does not include:** Admin review of verification documents (Base 6E)

---

### Base 6C — Listing Creation and Approval Workflow

**Goal:** Real listing creation with Firestore writes and admin approval gate.

**Scope:**
- `/listings/new` form writes real data to Firestore `/vehicles/{id}` or `/parts/{id}`
- Listing status starts at `'draft'`
- "Submit for Review" action changes `status: 'submitted'`
- Seller dashboard reads real listings from Firestore (own listings only)
- Category pages and search return only `status: 'live'` listings
- Listing detail page reads from Firestore
- Admin moderation queue shows `status: 'submitted'` listings
- Admin can approve (→ `'live'`) or reject (→ `'rejected'` with reason)
- Seller sees rejection reason in dashboard
- Seller can edit rejected listing and resubmit

**Does not include:** Image uploads (Base 7), email notifications (separate Cloud Functions task)

---

### Base 6D — Inquiries and Saved Listings

**Goal:** Real inquiry and save functionality connected to Firestore.

**Scope:**
- "Contact Seller" creates real `/inquiries/{id}` document
- Inquiry thread (replies) — `/inquiries/{id}/replies/{id}`
- Seller sees real inquiries in dashboard `/inquiries` tab
- Buyer sees sent inquiry history
- Mark inquiry as read (receiver only)
- "Save listing" creates real `/savedListings/{id}`
- "Unsave" deletes the document
- Saved listings page reads from Firestore
- Inquiry → redirect to login if unauthenticated

---

### Base 6E — Admin Moderation Panel

**Goal:** Functional admin panel for listing approval, user verification review, and flagged content.

**Scope:**
- Admin dashboard reads real data from Firestore:
  - Pending listings count and queue
  - Submitted verification reviews count and queue
  - Flagged listings count and queue
- Approve / reject listings with reason
- Review and approve / reject user verification submissions
- View verification documents from Firebase Storage (admin-only signed URLs)
- Suspend users (set `isSuspended: true`)
- Clear or act on admin flags
- Hero banner management: Firestore-backed banner records replace static `home-data.ts`

---

### Base 7 — Firebase Storage Uploads

**Goal:** Image uploads for listings and verification documents.

**Scope:**
- Listing image upload component — upload to Storage, write metadata to `/vehicles/{id}/images/{id}`
- Image resize Cloud Function (WebP conversion, thumbnail generation)
- Verification document upload — secure path, admin-only read
- Storage Security Rules — enforce access patterns
- Image gallery component on listing detail page (reads from Storage URLs)
- Max images per listing enforced by package entitlement

---

### Base 8 — Packages and Subscription Planning UI

**Goal:** Show users the package structure and prepare data models for PayFast.

**Scope:**
- `/packages` page — display all tiers per role type
- Dashboard subscription widget — shows current plan and limits
- Entitlement enforcement (listing limit, photo limit) reading from package tier
- Upgrade prompt CTAs pointing to `/packages`
- Firestore `subscriptions/{uid}` data model (manual admin-set for now)
- "Coming soon" state for payment — no actual purchase yet

**Does not include:** Real payments (Base 9)

---

### Base 9 — PayFast Integration

**Goal:** Real subscription purchases and renewals via PayFast.

**Scope:**
- PayFast hosted payment page integration
- ITN (Instant Transaction Notification) Cloud Function webhook handler
- Subscription record creation/renewal on successful payment
- Failed payment handling
- Invoice generation and email dispatch
- Payment records in Firestore (5-year retention)
- Subscription status enforcement in entitlement checks

---

> **This document is the single source of truth for MotorSphere's operating logic.**  
> All feature implementations, Firebase rules, UI decisions, and API designs must be checked against this document before being built.  
> When this document conflicts with existing code, this document takes precedence — update the code, not the document, unless a deliberate product decision is made to change the logic, in which case update both.

---

*Last updated: 2026-05-27 — MotorSphere Base 6A complete, Base 6B pending.*
