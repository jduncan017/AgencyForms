# AgencyForms — Productization Plan

## Vision

Turn AgencyForms from a single-agency internal tool into a multi-tenant SaaS platform where any agency can sign up, collect client credentials securely, and optionally white-label the entire experience as their own.

---

## Current State

- Stateless form config encoded in URL (`?data=base64url`)
- Hardcoded to DigitalNova Studio (logo, brand color, email templates, PDF header)
- Single admin: one `RESEND_API_KEY`, one `EMAIL_FROM`, one `PDF_PASSWORD`
- No auth, no database, no user accounts
- Preset library is code-level (adding presets requires a deploy)
- Works great for one agency — needs multi-tenancy to work for many

---

## Pricing

Two tiers. Simple, no free plan — the Starter price is low enough to be a no-brainer.

| | Starter | Pro |
|---|---|---|
| **Price** | **$19/mo** | **$49/mo** |
| Branding | "Powered by AgencyForms" badge | Fully white-labeled |
| Custom logo & colors | No — AgencyForms branding | Yes — their brand everywhere |
| Custom email sender | No — sent from AgencyForms | Yes — their verified domain |
| PDF branding | AgencyForms header | Their company name + logo |
| Submissions/mo | 50 | Unlimited |
| Custom presets | 5 | Unlimited |
| Team members | 2 | 10 |
| Custom domain | No | Yes |
| Submission history | Yes | Yes |
| Priority support | No | Yes |

**Early-bird lifetime deal**: $149 Starter / $299 Pro — use for initial traction and testimonials before switching to recurring only.

**Why no free tier**: The product handles sensitive credentials. A free tier invites abuse (phishing, throwaway accounts). The $19 entry point filters for real agencies and keeps support volume manageable. The "Powered by AgencyForms" badge on every Starter form is the organic growth engine instead.

---

## Go-to-Market Strategy

### Phase 0 — Pre-Launch (2-3 weeks before launch)

**Landing page** at `agencyforms.com`:
- Hero: "Stop chasing client credentials over email." — clear problem/solution framing
- Demo video or animated walkthrough showing the form flow (record the existing app)
- Social proof placeholder: "Built by an agency, for agencies"
- Two pricing cards (Starter / Pro) with feature comparison
- Early-access signup form — collect emails with a "Get early access" CTA
- FAQ section addressing security concerns (encrypted PDF, no credential storage, HTTPS)
- Tech stack: Next.js landing page, can live in the same repo or standalone

**Waitlist building:**
- Post in agency communities: Reddit (r/webdev, r/agencies, r/freelance), Facebook groups, Slack communities (e.g. The Futur, Webflow communities)
- Twitter/X thread: "I built an internal tool for collecting client credentials. Turning it into a product. Here's why..." — build-in-public angle
- Product Hunt upcoming page

### Phase 1 — Soft Launch (Starter tier only)

Ship the Starter tier first. This is the fastest path to revenue because you skip all white-label work.

**What Starter requires you to build:**
- Auth (Clerk) + agency accounts
- Dashboard with form builder (evolve current `/generate`)
- "Powered by AgencyForms" footer on forms
- Stripe checkout for $19/mo subscription
- Submission history (lightweight metadata log)
- That's it. The form flow, PDF generation, and email delivery already work.

**Launch channels:**
- **Product Hunt launch** — "Secure client credential collection for agencies"
- **AppSumo marketplace** — Lifetime deal listing. AppSumo's audience is exactly small agencies and freelancers. Run the $149/$299 LTD here to generate volume and reviews.
- **Agency directories** — List on agency tool roundups, SaaS directories (SaaSHub, AlternativeTo, etc.)
- **Content marketing** — Write 3-5 SEO articles:
  - "How to securely collect client passwords"
  - "Client onboarding checklist for web agencies"
  - "Why you should never ask for passwords over email"
  - "Best tools for agency client onboarding"
- **Cold outreach** — DM 50-100 agency owners on Twitter/LinkedIn with a personalized message + free month offer. Target agencies that post about client onboarding pain.

**Conversion engine:**
Every form sent by a Starter customer has "Powered by AgencyForms" at the bottom. The client's client sees it. If they're also an agency, they click through. This is the Calendly playbook — the product markets itself through usage.

### Phase 2 — Pro Tier Launch

Once Starter has 50-100 paying customers and you've validated demand:
- Ship the white-label features (theming, custom emails, PDF branding)
- Email all Starter customers: "Want your branding instead of ours? Upgrade to Pro."
- The upgrade trigger is built-in — every time they send a form and see the AgencyForms badge, they're reminded they could remove it.

### Phase 3 — Scale

- **Affiliate program** — Give agencies 20-30% recurring commission for referrals. Agencies talk to each other. This is the highest-leverage channel.
- **Agency partnerships** — Partner with web hosting companies, website builders, CRM tools for cross-promotion.
- **Templates marketplace** — Curate industry-specific preset packs (dental, e-commerce, SaaS, real estate). "One-click setup for [industry] client onboarding."
- **Case studies** — Turn successful customers into case studies. "How [Agency] cut client onboarding from 2 weeks to 2 days."

### Positioning

**Tagline options:**
- "Client credentials, collected securely."
- "Stop chasing passwords over email."
- "Secure client onboarding for agencies."

**Key differentiators vs. building it yourself / using Google Forms / etc.:**
- Password-protected PDF — credentials never stored online
- Guided onboarding flow — clients create accounts step-by-step with instructions
- Professional and branded — not a janky Google Form
- Stateless architecture — nothing to maintain, no data liability

---

## Architecture

### Stateless hybrid approach

Keep the form rendering stateless (config stays in the URL) but add a thin database layer for agency accounts and settings. The URL gains an agency identifier (slug) that resolves branding at render time.

**URL structure:**
```
https://agencyforms.com/{agency-slug}/form?data=...
```

Or with custom domains (Pro):
```
https://onboard.clientagency.com/form?data=...
```

### Tech additions to the T3 stack

- **Database**: Drizzle ORM + PostgreSQL (Neon or Supabase) — fits the T3 ecosystem
- **Auth**: Clerk (recommended for speed) or NextAuth.js
- **Billing**: Stripe Checkout + webhooks
- **Custom domains** (Pro only): Vercel wildcard domains or Cloudflare for SaaS

---

## Build Phases

### Phase 1 — Starter Tier (Ship First)

The fastest path to revenue. No white-labeling, no theming — just multi-tenancy and a dashboard.

#### 1.1 Database schema

```
agencies
├── id (uuid, pk)
├── slug (unique, url-safe)
├── name
├── owner_email
├── created_at
├── plan (starter | pro)
├── stripe_customer_id
└── stripe_subscription_id

agency_members
├── id (uuid, pk)
├── agency_id (fk → agencies)
├── user_id (from Clerk)
├── role (owner | admin | member)
└── invited_at

presets (agency-defined)
├── id (uuid, pk)
├── agency_id (fk → agencies, nullable for global presets)
├── code (shorthand, unique per agency)
├── platform_name
├── fields (json array of FieldType)
├── signup_url (optional)
├── instructions (json array of InstructionStep)
├── logo_url (optional)
└── login_url (optional)

submissions (metadata only — no credentials stored)
├── id (uuid, pk)
├── agency_id (fk → agencies)
├── client_name
├── business_name
├── submitted_at
├── had_uploads (boolean)
└── had_client_copy (boolean)
```

#### 1.2 Auth + agency onboarding

- Sign up flow: email → create agency → set slug → done (no branding setup on Starter)
- Clerk for auth (fast, handles magic links, OAuth, team invites)
- Middleware resolves agency from slug in URL path
- Team invites: owner can invite up to 2 members (Starter limit)

#### 1.3 Route restructuring

```
Landing / Marketing:
/                             → landing page
/pricing                      → pricing page

Auth:
/sign-in                      → Clerk sign-in
/sign-up                      → Clerk sign-up

Dashboard (authed):
/dashboard                    → agency home (submission history, quick stats)
/dashboard/forms/new          → build a new form link
/dashboard/presets            → manage custom presets
/dashboard/settings           → account settings, billing
/dashboard/team               → team members + invites

Client-facing (public):
/[slug]/form?data=...         → client form
/[slug]/success               → thank you page
/api/submit                   → processes submission
/api/webhooks/stripe          → billing events
```

#### 1.4 "Powered by" badge

- Rendered in the form footer on all Starter accounts
- Links to `agencyforms.com?ref={slug}` for attribution tracking
- Clean, subtle design — not obnoxious, but visible

#### 1.5 Stripe integration

- Stripe Checkout for subscription creation ($19/mo Starter)
- Webhook handler for `invoice.paid`, `customer.subscription.updated`, `customer.subscription.deleted`
- Usage tracking: count submissions per billing cycle against the 50/mo limit
- Soft limit: warn at 80%, show upgrade prompt at 100%

#### 1.6 Landing page

Built as pages in the same Next.js app:

**Homepage (`/`)**
- Hero section with headline, subheadline, CTA
- Animated or screenshot walkthrough of the form flow
- "How it works" — 3-step breakdown (Generate link → Client fills form → Get encrypted PDF)
- Security section — "Your clients' credentials are never stored"
- Pricing cards
- FAQ
- Footer with links

**Pricing page (`/pricing`)**
- Side-by-side Starter / Pro comparison
- FAQ specific to billing (cancel anytime, what happens to existing links, etc.)

### Phase 2 — Pro Tier (White-Label)

Everything from Phase 1, plus:

#### 2.1 Theming system

Replace hardcoded brand colors with CSS custom properties set at render time.

```css
:root {
  --brand-500: #00A7D3;  /* AgencyForms default */
}
```

At form render, inject the agency's brand color:
```tsx
<div style={{ '--brand-500': agency.brandColor } as React.CSSProperties}>
```

Update `tailwind.config.ts` to reference the CSS variable:
```ts
brand: {
  500: 'var(--brand-500)',
  // generate shade palette from the variable
}
```

#### 2.2 Branding settings (`/dashboard/settings/branding`)

Pro-only settings page:
- Logo upload (store via UploadThing or S3)
- Brand color picker with live preview
- Company name (used in emails + PDF header)
- Reply-to email with domain verification (Resend domain verification API)
- Default PDF password

#### 2.3 Branded emails + PDF

- Email templates: inject `agency.brandColor`, `agency.logoUrl`, `agency.companyName`
- PDF header: replace "AgencyForms" with agency's company name
- "Powered by" badge removed from forms

#### 2.4 Custom domains

- Agency enters their desired domain (e.g. `onboard.theiragency.com`)
- App provides CNAME target
- Background job verifies DNS propagation
- Vercel handles SSL automatically
- Middleware checks `Host` header → resolves to agency

#### 2.5 Preset manager expansion

- Unlimited custom presets
- Import from global library (fork a built-in preset and customize)
- Custom instruction slides with image uploads

### Phase 3 — Growth Features

Build based on customer demand:

#### 3.1 Analytics dashboard
- Submissions over time
- Completion rate tracking
- Average time to complete

#### 3.2 Webhooks / integrations
- Notify agency's Slack/Discord on submission
- Zapier integration via webhook
- API endpoint for programmatic form generation

#### 3.3 Form management
- Dashboard shows active links with expiry dates
- Bulk expire / extend
- Auto-reminder email to client before expiry
- Save forms as reusable templates

#### 3.4 Client portal
- Recurring clients get a login instead of one-time links
- Can update credentials over time
- View history of submissions

#### 3.5 Localization
- Multi-language form UI
- Agency sets default language, client can switch

---

## Migration Path (DigitalNova → Multi-Tenant)

1. Add database + auth without breaking the current flow
2. Create a "DigitalNova Studio" agency record as the seed tenant
3. Existing `/generate` becomes the dashboard form builder behind auth
4. Existing `/form?data=...` continues working but also accepts `/{slug}/form?data=...`
5. Move presets from code to database, seed with current presets as global defaults
6. Update email templates and PDF to read from agency settings instead of hardcoded values
7. Once stable, redirect old routes to new structure

This approach lets us ship incrementally without breaking the existing production flow.

---

## Revenue Projections

Conservative estimates assuming organic growth + the "Powered by" viral loop:

| Month | Starter ($19) | Pro ($49) | MRR |
|---|---|---|---|
| 1 | 15 | 0 | $285 |
| 3 | 60 | 10 | $1,630 |
| 6 | 150 | 40 | $4,810 |
| 12 | 350 | 100 | $11,550 |

These don't include lifetime deal revenue from the early-bird launch, which could front-load $5-15k depending on AppSumo volume.

---

## Key Risks

- **Email deliverability**: Pro agencies sending from their own domain need SPF/DKIM setup. Resend handles this well but the onboarding UX for domain verification needs to be clear.
- **PDF password management**: Per-agency passwords stored securely. Consider encrypting at rest.
- **Abuse potential**: Credential collection tool could be used for phishing. Mitigate with: required email verification, rate limiting on Starter, manual review flags for suspicious patterns, terms of service.
- **Custom domains**: Operationally complex. Defer to Phase 2 and validate demand first. Slugs (`agencyforms.com/their-slug/form`) work fine initially.
- **URL length**: Agency branding stays in the database, not the URL. The slug-in-path + config-in-query approach keeps URLs manageable.
- **Support load**: Starter at $19/mo means high volume, low revenue per customer. Keep the product self-serve with good docs. Reserve priority support for Pro.
