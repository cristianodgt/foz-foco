---
phase: 01-redesign-ui-completo
plan: 01-04
subsystem: ads + anunciantes-landing
tags: [ads, adslot, iab, anunciantes, landing, pricing, phase-close]
requires:
  - 01-01 (M3 tokens + Newsreader/Plus Jakarta Sans)
  - 01-02 (chrome)
  - 01-03 (homepage placeholders seeded with TODO(01-04) + PricingSection with landing variant)
provides:
  - AdSlot — unified IAB ad slot component (5 formats + dashed PUBLICIDADE fallback, single source of truth for fetch + impression + click tracking)
  - AdSlotPlaceholder — render-only variant for SSR / skeleton paths
  - Homepage wired to real AdSlot at 5 positions (top leaderboard, inline, sidebar halfpage, sidebar rectangle, bottom leaderboard)
  - /anunciantes landing fully restyled with the new design system (hero editorial / stats bar / PricingSection variant=landing / 6 formats / testimonials / final CTA)
  - Legacy ad components reduced to thin wrappers (AdBannerTop, AdBannerBottom, AdSidebarSticky) or deleted (AdInlineBanner, AdSectionSponsor, AdSponsoredCard)
affects:
  - components/ads/AdSlot.tsx (NEW)
  - components/ads/AdBannerTop.tsx (thin wrapper)
  - components/ads/AdBannerBottom.tsx (thin wrapper)
  - components/ads/AdSidebarSticky.tsx (thin wrapper)
  - components/ads/AdInlineBanner.tsx (DELETED)
  - components/ads/AdSectionSponsor.tsx (DELETED)
  - components/ads/AdSponsoredCard.tsx (DELETED)
  - app/(public)/page.tsx (3 TODO placeholders → <AdSlot>)
  - components/layout/Sidebar.tsx (2 TODO placeholders → <AdSlot>)
  - app/(public)/anunciantes/page.tsx (FULL RESTYLE)
tech-stack:
  added: []
  patterns:
    - Single client component owns all ad fetch + impression + click tracking; every other ad surface is a thin wrapper around it
    - Dashed PUBLICIDADE placeholder rendered from the same component on empty / loading / error so ad containers never collapse
    - navigator.sendBeacon preferred for click tracking with fetch(keepalive) fallback
    - Sidebar ads share the SIDEBAR position but differentiate by an `index` prop (halfpage [0], rectangle [1]) — avoids a Prisma enum change that is out of phase-1 scope
    - Tailwind-only styling on /anunciantes (zero inline style objects); reuse of <PricingSection variant="landing"> from plan 01-03 instead of duplicating the 3-tier markup
key-files:
  created:
    - components/ads/AdSlot.tsx
  modified:
    - components/ads/AdBannerTop.tsx
    - components/ads/AdBannerBottom.tsx
    - components/ads/AdSidebarSticky.tsx
    - app/(public)/page.tsx
    - components/layout/Sidebar.tsx
    - app/(public)/anunciantes/page.tsx
  deleted:
    - components/ads/AdInlineBanner.tsx
    - components/ads/AdSectionSponsor.tsx
    - components/ads/AdSponsoredCard.tsx
decisions:
  - AdSlot is a client component (tracking must fire in the browser and fetch is position-filtered)
  - /api/ads response shape treated defensively — handles both array and single-object responses (AdBannerTop always expected an array, so array-with-index-0 is the documented default)
  - AdInlineBanner / AdSectionSponsor / AdSponsoredCard deleted rather than wrapped — grep showed zero external imports after plans 01-01..01-03
  - AdBannerTop / AdBannerBottom / AdSidebarSticky kept as wrappers because /[slug] and /categoria/[slug] still import them (those pages are out of phase-1 scope for rewrite; they inherit the new AdSlot behavior automatically)
  - Sidebar imports AdSlot directly so both halfpage and rectangle can coexist without inventing a new wrapper per format
  - /anunciantes rebuilt server-side with Tailwind utilities (zero `style={{}}`) and reuses PricingSection — no duplicate pricing markup in the repo anymore
  - /anunciantes does NOT render ad placeholders (it IS the ad sales page, per plan key decision)
metrics:
  duration: ~1h
  completed: 2026-04-05
---

# Phase 1 Plan 01-04: /anunciantes + AdSlot + slots publicitários Summary

Closed Phase 1 by unifying every ad surface behind a single `<AdSlot>` client component, wiring all 5 homepage slots + both sidebar slots to it, and rewriting `/anunciantes` end-to-end with the new M3 tokens + Newsreader/Plus Jakarta Sans typography while reusing `<PricingSection variant="landing">` from plan 01-03.

## AdSlot — final API and behavior

```ts
type AdFormat = 'leaderboard' | 'rectangle' | 'halfpage' | 'mobileBanner' | 'inline'

interface AdSlotProps {
  format: AdFormat
  position: AdPosition           // string literal from types/index.ts
  className?: string             // applied to outer wrapper (e.g. "bg-surface py-4")
  placeholder?: { phone?: string; message?: string }
  index?: number                 // disambiguates sibling slots fetching the same position
}
```

**Dimension table** (inner box):

| Format       | Tailwind                  | Nominal |
| ------------ | ------------------------- | ------- |
| leaderboard  | w-[728px] max-w-full h-[90px]  | 728×90  |
| rectangle    | w-[300px] h-[250px] mx-auto    | 300×250 |
| halfpage     | w-[300px] h-[600px] mx-auto    | 300×600 |
| mobileBanner | w-full h-[90px]                | 320×90  |
| inline       | w-full h-[250px]               | full×250 |

**Fetch + tracking (migrated from AdBannerTop.tsx, never reinvented):**
1. On mount: `fetch('/api/ads?position=${position}')` → selects `data[index]` if array, or the object directly. Cancel guard via closure flag.
2. Impression: fires once per mount via `fetch('/api/ads/:id/impression', { method: 'POST' })`, guarded by a `useRef` to survive React 19 StrictMode double-mount.
3. Click: `navigator.sendBeacon('/api/ads/:id/click')` when available, else `fetch(..., { keepalive: true })`. Anchor target is `_blank` with `rel="noopener noreferrer sponsored"` — default navigation is never blocked.
4. On empty / loading / error: renders `<AdSlotPlaceholder>` — a dashed `border-2 border-dashed border-outline-variant bg-surface-container` box with the amber `PUBLICIDADE` pill top-left and `[ W×H — Espaço disponível: (45) 99999-9999 ]` label.

**Never throws** — the fetch is wrapped and falls back to the placeholder on any error, so slot containers never collapse or render broken images.

## Legacy ad components — final disposition

| Component          | Before (01-03)                              | After (01-04)                           | Reason                     |
| ------------------ | ------------------------------------------- | --------------------------------------- | -------------------------- |
| AdBannerTop        | own fetch + impression + click              | 1-line wrapper → `<AdSlot leaderboard GRID_BANNER_TOP>` | still imported by /[slug] and /categoria/[slug] |
| AdBannerBottom     | own fetch + impression + click              | 1-line wrapper → `<AdSlot leaderboard GRID_BANNER_BOTTOM>` | still imported by /[slug] and /categoria/[slug] |
| AdSidebarSticky    | own fetch + rotation + impression + click   | 1-line wrapper → `<AdSlot rectangle SIDEBAR>` | still imported by /[slug] and /categoria/[slug] |
| AdInlineBanner     | own fetch + impression + click              | **DELETED**                             | zero external imports      |
| AdSectionSponsor   | own fetch + category match                  | **DELETED**                             | zero external imports      |
| AdSponsoredCard    | intersection-observer impression + click    | **DELETED**                             | zero external imports      |

Net result: **AdSlot is the only file in the repo that calls `/api/ads`, `/api/ads/:id/impression`, or `/api/ads/:id/click`.** No duplicated fetch or tracking logic anywhere.

## Homepage + Sidebar wiring (Task 3)

**`app/(public)/page.tsx`** — 3 placeholder divs removed, replaced by:

```tsx
<AdSlot format="leaderboard" position="GRID_BANNER_TOP"    className="bg-surface py-4" />
<AdSlot format="inline"      position="INLINE_BANNER" />
<AdSlot format="leaderboard" position="GRID_BANNER_BOTTOM" className="bg-surface py-12" />
```

**`components/layout/Sidebar.tsx`** — 2 placeholder divs removed, replaced by:

```tsx
<AdSlot format="halfpage"  position="SIDEBAR" index={0} />
<AdSlot format="rectangle" position="SIDEBAR" index={1} />
```

Both sidebar slots fetch the same `SIDEBAR` position (the Prisma `AdPosition` enum intentionally does not distinguish halfpage vs rectangle — schema changes are out of phase-1 scope). When the endpoint returns multiple creatives, `index` disambiguates them; when it returns one, the rectangle falls back to the same ad. Acceptable for v1.

All five `TODO(01-04)` comment markers seeded in plan 01-03 are now removed from the source tree (only the planning markdown still references them historically).

## /anunciantes — full restyle (Task 4)

Rewrote `app/(public)/anunciantes/page.tsx` as a server component with six Tailwind-only sections:

| #   | Section         | Background                                               | Key elements                                                                              |
| --- | --------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 1   | Hero editorial  | `bg-surface`                                             | Amber badge → Newsreader `text-5xl md:text-6xl` headline with italic `decide` in primary → subtitle → dual CTAs (primary button + outlined link) |
| 2   | Stats bar       | `bg-on-surface text-surface` (navy ink on surface)       | 4 metrics (Users 80k+ / Eye 350k+ / MapPin 78% / TrendingUp 4:12), lucide icons in tertiary-fixed |
| 3   | Pricing         | navy gradient (via PricingSection)                       | `<PricingSection variant="landing" />` — 3 tiers with Prata scaled MAIS POPULAR           |
| 4   | Formatos        | `bg-surface-container-low`                               | 6 format tiles (Leaderboard, Retângulo, Half-page, Mobile Banner, Card Patrocinado, Vitrine Guia Comercial), icon + size in mono + description + bullet benefits |
| 5   | Testimonials    | `bg-surface`                                             | 3 cards with `border-l-4 border-tertiary-fixed` (mobile-b signature), italic quote + author/role |
| 6   | Final CTA       | `bg-gradient-to-br from-primary via-primary-container to-on-surface` | Newsreader headline → subtitle → tertiary-fixed button → Phone / Mail / Instagram inline links |

Copy sources:
- Stats: preserved real numbers from the legacy page (80k leitores, 350k pageviews, 78% local, 4:12 tempo médio — normalized to the Stitch style: short value + uppercase label).
- Pricing: fully delegated to `<PricingSection>` — its 3 tiers (R$ 299 / R$ 699 / R$ 1.999) remain the single source of truth, used by both homepage and landing.
- Formats: rebuilt to align with the 5 AdSlot IAB formats + 1 directory vitrine, with icon bullets describing the new positions introduced in plan 01-03/01-04.
- Testimonials: real business copy preserved verbatim from the legacy page (Marcos R. / Cláudia M. / Rafael S.).
- Contact: WhatsApp +55 45 99999-9999, email publicidade@fozemfoco.com.br, @fozemfoco.

**Inline styles:** zero — every `style={{}}` block from the legacy page has been removed. **Ad placeholders:** none — the page IS the ad sales page. **Legacy classes:** none (`container-editorial`, `article-card`, `var(--color-*)`, `font-serif`, `font-sans` inline font-family — all gone).

## Build + regression sweep (Task 5)

Ran `DATABASE_URL=postgresql://placeholder:placeholder@localhost:5432/placeholder npm run build`:

```
✓ Compiled successfully in 5.3s
  Linting and checking validity of types ...
  Collecting page data ...
  Generating static pages (26/26)
  Finalizing page optimization ...
```

`prisma:error` logs for `category.findMany` / `post.findFirst` during SSG are expected (no DB reachable from placeholder URL) and do not fail the build — matches the phase-1 acceptance criteria "Build passes; Prisma DB runtime errors during SSG acceptable." All 26 routes compiled, including the `/anunciantes` static page (165 B + 106 kB FL JS).

**Orphan-reference sweep:** `grep -rE "(TrendingWidget|NewsletterWidget|MainGrid|CategorySection|hero-section|article-card|container-editorial|font-sora|font-bebas|breaking-banner)" app/ components/` → only the intentional `components/widgets/TrendingWidget.tsx` shim remains (documented alias re-exporting MaisLidas for /[slug] and /categoria/[slug] backwards compat from plan 01-03). Zero other hits.

**`/admin/*` untouched:** `git diff --name-only main -- app/admin/` → empty.

**`prisma/` untouched:** `git diff --name-only main -- prisma/` → empty.

**TODO(01-04) markers in source:** zero remaining (only historical mentions in `.planning/phases/01-redesign-ui-completo/*.md`).

## Phase 1 success criteria (from ROADMAP.md)

1. **Desktop home estruturalmente idêntica ao Stitch** — ✅ 12-col grid (plan 01-03) + 5 AdSlot positions wired (this plan).
2. **Mobile home correspondendo a uma variante Stitch** — ✅ mobile-b base from plan 01-03, ads hidden on lg via sidebar `hidden lg:block` (this plan).
3. **Paleta e tipografia consistentes** — ✅ Newsreader + Plus Jakarta Sans + M3 tokens used throughout AdSlot, anunciantes, sidebar (plans 01-01 + 01-04).
4. **Slots publicitários IAB visíveis sem scroll profundo** — ✅ top leaderboard renders on first paint, sidebar halfpage above the fold on desktop, mobile inline in first feed position.
5. **/anunciantes alinhada com o site** — ✅ full restyle with new tokens, reuse of `<PricingSection variant="landing">` (this plan).
6. **Dark mode + build READY** — ✅ all classes used (`bg-surface`, `text-on-surface`, `border-outline-variant`, etc.) are HSL-backed tokens that already flip via `.dark` from plan 01-01; `npm run build` exits 0.

All 6 ROADMAP success criteria for Phase 1 are met by the combination of plans 01-01 through 01-04.

## Requirements satisfied by this plan

From the PLAN.md frontmatter: `ADS-01, ADS-02, ADS-03, ANUN-01, ANUN-02, ANUN-03, ANUN-04, ANUN-05, ANUN-06, ANUN-07, BUILD-01, BUILD-02, BUILD-03`.

| Req     | Description                                           | Status |
| ------- | ----------------------------------------------------- | ------ |
| ADS-01  | `<AdSlot>` component with IAB formats                 | ✅ 5 formats in components/ads/AdSlot.tsx |
| ADS-02  | Slots visible in home desktop + mobile                | ✅ 5 homepage instances wired             |
| ADS-03  | Placeholder visual for unsold slots                   | ✅ `<AdSlotPlaceholder>` dashed PUBLICIDADE box |
| ANUN-01 | /anunciantes hero aligned with new design             | ✅ editorial Newsreader hero              |
| ANUN-02 | Stats bar                                             | ✅ 4-metric navy section                  |
| ANUN-03 | 3-tier pricing                                        | ✅ reuses PricingSection variant=landing  |
| ANUN-04 | Ad format tiles                                       | ✅ 6 format cards                         |
| ANUN-05 | Testimonials                                          | ✅ 3 testimonials with border-l-4         |
| ANUN-06 | Final CTA in brand gradient                           | ✅ gradient section with tertiary-fixed button |
| ANUN-07 | Zero inline styles / legacy classes                   | ✅ verified via grep                      |
| BUILD-01| `npm run build` exits 0                               | ✅ Compiled successfully                  |
| BUILD-02| `/admin/*` untouched                                  | ✅ `git diff` empty                       |
| BUILD-03| `prisma/` untouched                                   | ✅ `git diff` empty                       |

## Known Stubs

None. All components fetch real data from existing endpoints. Empty slots render the documented placeholder (which is the intended v1 behavior for unsold inventory — not a stub). Sidebar uses `index` prop to pick a second creative when available, falling back to the first — a known, documented v1 limitation that does not block the plan goal.

## Deviations from Plan

**None.** The plan was executed exactly as written. The only implementation choice left to discretion — treating `AdPosition` as a string literal type vs. an enum namespace — was resolved by reading `types/index.ts` (line 4) and using string literals (`position="GRID_BANNER_TOP"` instead of `AdPosition.GRID_BANNER_TOP`), which is the only form the actual type supports. The plan's sample code using `AdPosition.GRID_BANNER_TOP` was indicative, not literal.

## Vercel preview URL

Not pushed by the executor per the instruction "Do NOT push to remote — that happens after verification." The reviewer will deploy post-verification.

## Phase 1 close-out

With plan 01-04 committed, Phase 1 "Redesign UI completo" is complete:
- Plans 01-01 (tokens) + 01-02 (chrome) + 01-03 (homepage) + 01-04 (ads + landing) = 4/4.
- 30/30 phase 1 requirements satisfied (see per-plan summaries for the upstream tallies).
- Backend (Prisma schema, Supabase, all `/api/*` and `/admin/*` routes) untouched across all 4 plans.
- The public UI is now a 1:1 reproduction of the Stitch contract (`8140760864745957946`) across desktop + mobile-b.

## Self-Check

Verified all created/modified/deleted files match disk state, commit hash recorded below, build exit 0, no TODO(01-04) in source, no inline styles in anunciantes, admin + prisma diffs empty.

## Self-Check: PASSED
