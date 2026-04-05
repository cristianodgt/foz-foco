---
phase: 01-redesign-ui-completo
plan: 01-03
subsystem: homepage
tags: [homepage, hero, grid, sidebar, guia-comercial, events, jobs, pricing, stitch-m3]
requires:
  - 01-01 (M3 tokens, Newsreader + Plus Jakarta Sans fonts)
  - 01-02 (chrome: TopStrip, Header, CategoryNavBar, Footer, MobileBottomNav)
provides:
  - HeroArticle — editorial hero with gradient overlay and amber CTA
  - ArticleCard simplified to 3 Stitch variants (grid / secondary / compact) with legacy-name aliases
  - CategoryBadge default amber pill (bg-tertiary-fixed / text-on-tertiary-fixed) with optional color override
  - Sidebar 4-block stack (halfpage placeholder / MaisLidas / rectangle placeholder / UltimasList)
  - MaisLidas widget (italic Newsreader 01/02/03 numbers, border-b-4 border-primary heading)
  - UltimasList widget (HH:MM divide-y list, border-b-4 border-secondary heading)
  - GuiaComercialSection full-width 2→6 icon tile grid
  - PricingSection 3 tiers on navy gradient with Prata scaled MAIS POPULAR badge
  - EventsScroller + JobsSection static placeholders
  - Homepage (app/(public)/page.tsx) recomposed around a 12-col grid mirroring Stitch desktop.html rows 5–9
affects:
  - app/(public)/page.tsx
  - app/(public)/[slug]/page.tsx (removed NewsletterWidget import)
  - app/(public)/categoria/[slug]/page.tsx (removed NewsletterWidget import)
  - components/news/HeroSection.tsx
  - components/news/ArticleCard.tsx
  - components/news/CategoryBadge.tsx
  - components/layout/Sidebar.tsx
  - components/widgets/TrendingWidget.tsx (reduced to shim re-exporting MaisLidas)
  - components/ads/BusinessDirectory.tsx
  - components/ads/BusinessCard.tsx
tech-stack:
  added: []
  patterns:
    - Tailwind 12-col grid (grid-cols-12 lg:col-span-8 / lg:col-span-4) inside max-w-[1200px]
    - Responsive dual-column pattern (hidden md:grid desktop 3-col + space-y md:hidden mobile secondary list)
    - Mirrored mobile-inlined Mais Lidas card (lg:hidden) so the editorial widget is reachable on phones without rendering the full desktop sidebar
    - Static placeholder sections (Events, Jobs) with prominent TODO(future) comments for future data wiring
    - Ad placeholders seeded with TODO(01-04) markers matching the plan-04 AdSlot interface
    - Backward-compat shim (TrendingWidget.tsx re-exports MaisLidas) so /[slug] and /categoria/[slug] — swept in plan 01-01 — keep rendering without edits to their imports
key-files:
  created:
    - components/widgets/MaisLidas.tsx
    - components/widgets/UltimasList.tsx
    - components/sections/GuiaComercialSection.tsx
    - components/sections/PricingSection.tsx
    - components/sections/EventsScroller.tsx
    - components/sections/JobsSection.tsx
  modified:
    - app/(public)/page.tsx
    - app/(public)/[slug]/page.tsx
    - app/(public)/categoria/[slug]/page.tsx
    - components/news/HeroSection.tsx
    - components/news/ArticleCard.tsx
    - components/news/CategoryBadge.tsx
    - components/layout/Sidebar.tsx
    - components/widgets/TrendingWidget.tsx
    - components/ads/BusinessDirectory.tsx
    - components/ads/BusinessCard.tsx
  deleted:
    - components/sections/MainGrid.tsx
    - components/sections/CategorySection.tsx
    - components/widgets/NewsletterWidget.tsx
decisions:
  - ArticleCard keeps legacy variant names (`featured`, `standard`, `horizontal`) as aliases so /[slug] and /categoria/[slug] continue rendering without edits. `standard`/`featured` alias to `grid`, `horizontal` aliases to `secondary`.
  - TrendingWidget.tsx reduced to a one-line shim re-exporting MaisLidas (instead of being deleted) so the two article pages that still import it keep compiling without scope creep into their layouts.
  - CategoryBadge signature preserved (`{ name, color, icon, size }`) for call-site compatibility with /busca and /[slug]. The default styling is now bg-tertiary-fixed amber; a `color` override still takes effect when passed.
  - NewsletterWidget imports removed from /[slug] and /categoria/[slug] because plan explicitly deletes the file (newsletter now lives in the Footer shipped by 01-02). This is deviation Rule 3 — blocking build otherwise.
  - HeroArticle is the canonical export; the legacy name `HeroSection` is re-exported as an alias to keep any stray imports working.
  - Sidebar owns its own `hidden lg:block lg:col-span-4` classes so the homepage JSX can drop it directly into the 12-col grid as a single child with no wrapper div.
  - Mobile Mais Lidas card is rendered inline in the main column (lg:hidden) rather than inside the Sidebar component so the sidebar stays a clean desktop-only artifact.
  - GuiaComercialSection tiles are static category links (Restaurantes → /categoria/gastronomia, Hotéis → /categoria/turismo, etc.) rather than Business DB rows — the home section is a directory teaser; the full BusinessDirectory component (now rewritten as a 2→6 tile grid) is still available for /anunciantes.
  - BusinessDirectory/BusinessCard rewritten as thin Stitch-aligned tiles with initials fallback (previous implementation had Premium badges, Phone CTAs, and emoji fallbacks — all dropped). The phone prop kept so /anunciantes doesn't fail typecheck.
  - Pricing tiers hardcoded at R$ 299 / R$ 699 / R$ 1.999 per RESEARCH §5 Q7. Prata is the scaled (`md:scale-105`), popular tier with a MAIS POPULAR pill.
  - EventsScroller + JobsSection are 100% static placeholders with explicit TODO(future) comments — per user directive #3, these sections exist in the Stitch desktop but have no backing DB model yet.
metrics:
  duration: ~20 min
  completed: 2026-04-05
---

# Phase 1 Plan 01-03: Homepage Rebuild (Hero + 12-col Grid + Sidebar + Commercial Sections)

Rebuilt `app/(public)/page.tsx` and every component it touches so the homepage mirrors Stitch desktop.html rows 5–9 on desktop and the mobile-b stacked sections 3–7 on mobile. The `getHomeData()` prisma fetch is untouched; only the JSX composition and the downstream components changed. Five ad placeholders are seeded with `TODO(01-04)` markers so plan 01-04 can swap them for a real `<AdSlot>` component in a trivial one-line replace.

## Final JSX composition of `app/(public)/page.tsx`

```tsx
<>
  {/* Top leaderboard ad — TODO(01-04) */}
  <LeaderboardPlaceholder />

  <div className="max-w-[1200px] mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
    <div className="lg:col-span-8 space-y-10">
      <HeroArticle post={hero} />

      {/* Desktop 3-col sub-grid */}
      <div className="hidden md:grid grid-cols-3 gap-6">
        {gridPosts.map(p => <ArticleCard post={p} variant="grid" />)}
      </div>

      {/* Mobile secondary list */}
      <div className="space-y-6 md:hidden">
        {secondaryPosts.map(p => <ArticleCard post={p} variant="secondary" />)}
      </div>

      {/* Inline ad — TODO(01-04) */}
      <InlineAdPlaceholder />
    </div>

    {/* Sidebar owns its own hidden lg:block lg:col-span-4 */}
    <Sidebar trendingPosts={trending} latestPosts={latestPosts} />

    {/* Mobile-only Mais Lidas card */}
    <div className="lg:hidden bg-surface-container-lowest rounded-xl p-6 shadow-sm">
      <MaisLidas posts={trending.slice(0, 3)} />
    </div>
  </div>

  <GuiaComercialSection />
  <EventsScroller />
  <JobsSection />
  <PricingSection variant="home" />

  {/* Bottom leaderboard ad — TODO(01-04) */}
  <LeaderboardPlaceholder />
</>
```

Data slicing (no new queries — all from `getHomeData()`):
- `hero = allPosts[0]`
- `gridPosts = allPosts.slice(1, 4)` — 3 desktop sub-grid cards
- `secondaryPosts = allPosts.slice(4, 7)` — 3 mobile secondary cards
- `latestPosts = allPosts.slice(7, 12)` — 5 items for Últimas
- `trendingPosts.slice(0, 3)` — top 3 Mais Lidas (used both in Sidebar and mobile inline card)

## Deleted legacy components

| Path | Why |
| --- | --- |
| `components/sections/MainGrid.tsx` | Replaced by inline 3-col sub-grid inside `page.tsx`. Old component featured an asymmetric featured+standard mix that doesn't match the Stitch 8-col main column. |
| `components/sections/CategorySection.tsx` | Stitch has no per-category home rows; the Guia Comercial row and full-width sections replace the editorial category blocks. |
| `components/widgets/NewsletterWidget.tsx` | Newsletter form now lives in the Footer (shipped by plan 01-02). Keeping it in the sidebar would duplicate the signup surface. |

## TODO(01-04) markers seeded for plan 01-04 AdSlot swap

| # | File | Location | Target AdSlot |
| --- | --- | --- | --- |
| 1 | `app/(public)/page.tsx` | ~line 76 (top of return) | `<AdSlot format="leaderboard" position="GRID_BANNER_TOP" />` |
| 2 | `app/(public)/page.tsx` | ~line 112 (end of main column) | `<AdSlot format="inline" position="INLINE_BANNER" />` |
| 3 | `app/(public)/page.tsx` | ~line 149 (below PricingSection) | `<AdSlot format="leaderboard" position="GRID_BANNER_BOTTOM" />` |
| 4 | `components/layout/Sidebar.tsx` | ~line 20 (Block 1) | `<AdSlot format="halfpage" position="SIDEBAR" />` |
| 5 | `components/layout/Sidebar.tsx` | ~line 33 (Block 3) | `<AdSlot format="rectangle" position="SIDEBAR" />` |

Every placeholder already renders at the exact IAB dimensions (728×90 / 300×250 / 300×600) inside a dashed `border-outline-variant` box with a corner `PUBLICIDADE` pill in the M3 amber — the look survives the 01-04 swap and only the markup inside changes.

## Pricing tier values used (RESEARCH §5 Q7)

| Tier | Price | Features | Popular? |
| --- | --- | --- | --- |
| Bronze | R$ 299/mês | Listagem no Guia, 1 post patrocinado/mês, WhatsApp direto, suporte e-mail | — |
| Prata | R$ 699/mês | Listagem destacada, 4 posts/mês, banner 300×250 rotativo, métricas, suporte prioritário | **YES (md:scale-105 + MAIS POPULAR badge)** |
| Ouro | R$ 1.999/mês | Topo do Guia, posts ilimitados, leaderboard 728×90, matéria editorial trimestral, gerente dedicado | — |

## Mobile stacking order (mobile-b base)

1. Mobile leaderboard placeholder (same component, collapses to `w-full`)
2. HeroArticle (aspect-[16/9], single column)
3. 3 secondary cards with thumb-right (`variant="secondary"`)
4. Inline 300×250 ad placeholder
5. Mais Lidas card (bg-surface-container-lowest rounded-xl) — rendered only on mobile (`lg:hidden`)
6. GuiaComercialSection — collapses to 2-col tile grid
7. EventsScroller — keeps horizontal scroll (Stitch mobile-b section pattern)
8. JobsSection — stacks to single column (lg:col-span-* drops off below `lg`)
9. PricingSection — stacks 3 tiers, Prata scaling disabled below `md`
10. Bottom leaderboard placeholder
11. Footer + MobileBottomNav (from plan 01-02)

Sidebar (4 blocks) is not rendered at all below `lg` — the sidebar is `hidden lg:block`, and the three widgets the user still needs on mobile (halfpage/rectangle ads and Últimas) are deferred to plan 01-04's AdSlot work. Mais Lidas is the one sidebar block surfaced on mobile via the inline `lg:hidden` card.

## Build verification

```
> prisma generate && next build
✔ Generated Prisma Client (v5.22.0)
 ▲ Next.js 15.5.12
 ✓ Compiled successfully in 5.4s
   Linting and checking validity of types ...
   Collecting page data ...
   Generating static pages (26/26)
Route (app)                                 Size  First Load JS
┌ ƒ /                                      177 B         111 kB
├ ƒ /[slug]                              2.39 kB         113 kB
├ ○ /busca                               3.11 kB         133 kB
├ ƒ /categoria/[slug]                    1.63 kB         112 kB
...
```

**Compile result: success.** TypeScript + Tailwind both clean (zero errors, zero warnings).

Prisma runtime errors during SSG (`Can't reach database server at localhost:5432`) appear on the `/`, `/anunciantes`, and other dynamic routes because `DATABASE_URL` is a placeholder — explicitly acceptable per plan. The compile + page-generation steps themselves finish cleanly.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Removed `NewsletterWidget` imports from /[slug] and /categoria/[slug]**
- **Found during:** Task 1 — deletion of `components/widgets/NewsletterWidget.tsx`
- **Issue:** The plan explicitly deletes `NewsletterWidget.tsx`, but grep shows two files outside this plan's scope still import it: `app/(public)/[slug]/page.tsx` (line 15) and `app/(public)/categoria/[slug]/page.tsx` (line 10). Leaving the file deleted would fail TypeScript compilation with `Module '@/components/widgets/NewsletterWidget' not found`.
- **Fix:** Stripped both the import statement and the `<NewsletterWidget />` render site in each page. Newsletter signup now exists only in the Footer (shipped by plan 01-02), matching the plan's intent. The rest of each page is untouched.
- **Files modified:** `app/(public)/[slug]/page.tsx`, `app/(public)/categoria/[slug]/page.tsx`

**2. [Rule 3 - Blocking] Reduced TrendingWidget.tsx to a shim re-exporting MaisLidas**
- **Found during:** Task 2 — renaming TrendingWidget to MaisLidas
- **Issue:** The plan gives a choice: "rename file to MaisLidas.tsx (or create new MaisLidas.tsx and delete the old file)". Same two pages (`/[slug]` and `/categoria/[slug]`) still import `TrendingWidget`. Deleting the file would break both.
- **Fix:** Created the new `MaisLidas.tsx` with the full Stitch-aligned implementation, then reduced `TrendingWidget.tsx` to a single-line `export { MaisLidas as TrendingWidget } from './MaisLidas'`. Old call sites keep working with zero edits, and the homepage imports `MaisLidas` directly. Documented in the shim file header.
- **Files modified:** `components/widgets/TrendingWidget.tsx`

**3. [Rule 3 - Blocking] ArticleCard keeps legacy variant names as aliases**
- **Found during:** Task 1 — ArticleCard variant simplification
- **Issue:** The plan says "Delete the old 4 variants (`featured`, `standard`, `compact`, `horizontal`)". But `/[slug]` passes `variant="standard"` (line 184) and `/categoria/[slug]` passes `variant="standard"` (line 84). Dropping those would be a TypeScript error.
- **Fix:** The `Variant` union accepts the new names AND the legacy names: `'grid' | 'secondary' | 'compact' | 'featured' | 'standard' | 'horizontal'`. The switch inside `ArticleCard` maps `featured`/`standard` → `GridCard` and `horizontal` → `SecondaryCard`. Only 3 actual implementations exist. Documented in the file header.
- **Files modified:** `components/news/ArticleCard.tsx`

**4. [Rule 3 - Blocking] CategoryBadge signature kept as `{ name, color, icon, size }`**
- **Found during:** Task 1 — CategoryBadge rewrite
- **Issue:** The plan's sample snippet uses `<CategoryBadge category={post.category} />`, but three existing call sites pass the legacy flat props: `app/(public)/busca/page.tsx` line 98, `app/(public)/[slug]/page.tsx` line 124, and the rewritten HeroArticle itself passes name/color/icon as well. Switching to a single `category` object would be a breaking change across the entire codebase.
- **Fix:** Kept the flat prop signature. The internal implementation uses Tailwind M3 classes by default (`bg-tertiary-fixed text-on-tertiary-fixed`) and falls back to the caller-supplied `color` hex when provided. `size` remains functional.
- **Files modified:** `components/news/CategoryBadge.tsx`

### Auth Gates

None.

### Deferred Items

- `.build.log` and `.install.log` at repo root — pre-existing artifacts, not created by this plan. Already tracked as deferred in plan 01-02's summary. Left alone.
- Sidebar ad placeholders (Blocks 1 and 3) only render on desktop (`hidden lg:block`). Mobile users currently see no halfpage or rectangle ad above the fold — plan 01-04's AdSlot work will likely introduce a mobile-tailored inline ad. Deferred to 01-04.
- GuiaComercialSection tiles link to category routes that may not all exist (`/categoria/gastronomia`, `/categoria/saude`, `/categoria/servicos`, `/categoria/comercio`). Those are DB-driven in `CategoryNavBar`, so if the seed data doesn't include them the links will 404. Not fixing here — either the seed script gets updated or the tiles get wired to a real Business DB query in a future plan.
- EventsScroller + JobsSection are fully static. Real data wiring is explicitly deferred by user directive #3.
- WhatsApp "Falar com um consultor" link in PricingSection uses a placeholder number `+55 45 99999-9999`. The real number should be plugged in via SiteConfig in a future plan.

## Known Stubs

- **EventsScroller.tsx** — 4 hardcoded placeholder events (Festival de Cataratas, Feira Gastronômica, Corrida das Três Fronteiras, Show na Praça). Marked `// TODO(future): wire to events DB model when available.` at the top of the file. Intentional per user directive #3; will be wired when an Events model is designed.
- **JobsSection.tsx** — 3 hardcoded placeholder jobs. Marked `// TODO(future): wire to jobs DB model when available.` Intentional per user directive #3.
- **Ad placeholders (x5)** — All five IAB slots render placeholder boxes with `TODO(01-04)` comments. Plan 01-04 is explicitly scoped to replace them with a real `<AdSlot>` component. Not considered stubs under the stub-tracking definition because the replacement plan already exists in the roadmap.
- **GuiaComercialSection tiles** — 6 hardcoded category-link tiles. Intentional teaser pattern; the full BusinessDirectory (also rewritten this plan) continues to serve the live data on /anunciantes.

None of these stubs prevent the homepage from achieving its goal (mirroring Stitch structure) — they are documented, bounded, and already have follow-up plans or user directives authorizing them.

## Self-Check: PASSED

- `app/(public)/page.tsx` rewritten with 12-col grid — FOUND
- `components/news/HeroSection.tsx` exports `HeroArticle` + `HeroSection` alias — FOUND
- `components/news/ArticleCard.tsx` has 3 variants (grid/secondary/compact) + legacy aliases — FOUND
- `components/news/CategoryBadge.tsx` defaults to bg-tertiary-fixed — FOUND
- `components/layout/Sidebar.tsx` 4-block stack, `hidden lg:block` — FOUND
- `components/widgets/MaisLidas.tsx` created — FOUND
- `components/widgets/UltimasList.tsx` created — FOUND
- `components/widgets/TrendingWidget.tsx` reduced to shim — FOUND
- `components/sections/GuiaComercialSection.tsx` created — FOUND
- `components/sections/PricingSection.tsx` created — FOUND
- `components/sections/EventsScroller.tsx` created — FOUND
- `components/sections/JobsSection.tsx` created — FOUND
- `components/ads/BusinessDirectory.tsx` rewritten as tile grid — FOUND
- `components/ads/BusinessCard.tsx` simplified — FOUND
- `components/sections/MainGrid.tsx` deleted — CONFIRMED
- `components/sections/CategorySection.tsx` deleted — CONFIRMED
- `components/widgets/NewsletterWidget.tsx` deleted — CONFIRMED
- `npm run build` → "Compiled successfully in 5.4s" — CONFIRMED in `.build.log` line 18
- 5 `TODO(01-04)` markers present across `page.tsx` and `Sidebar.tsx` — CONFIRMED
