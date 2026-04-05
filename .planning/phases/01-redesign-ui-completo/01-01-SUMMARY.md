---
phase: 01-redesign-ui-completo
plan: 01-01
subsystem: design-system-foundation
tags: [tokens, fonts, tailwind, globals-css, dark-mode, sweep]
requires: []
provides:
  - Stitch M3 palette as first-class Tailwind utilities
  - Newsreader + Plus Jakarta Sans via next/font/google
  - shadcn HSL tokens recalibrated from M3 (light + .dark)
  - Slim globals.css with .article-body + .scrollbar-hide
  - Class migration on /[slug], /categoria/[slug], /busca
affects:
  - app/layout.tsx
  - tailwind.config.ts
  - app/globals.css
  - app/(public)/[slug]/page.tsx
  - app/(public)/categoria/[slug]/page.tsx
  - app/(public)/busca/page.tsx
tech-stack:
  added:
    - next/font/google (Newsreader, Plus_Jakarta_Sans)
  patterns:
    - M3 color tokens exposed flat in tailwind theme.extend.colors
    - shadcn HSL tokens kept flat for Radix primitives
    - Dark mode via .dark class with recalibrated HSL triplets tracing back to M3 hex values
key-files:
  created: []
  modified:
    - tailwind.config.ts
    - app/layout.tsx
    - app/globals.css
    - app/(public)/[slug]/page.tsx
    - app/(public)/categoria/[slug]/page.tsx
    - app/(public)/busca/page.tsx
decisions:
  - M3 tokens live at the top level of theme.extend.colors (bg-primary-container, text-on-tertiary-container, border-outline-variant resolve directly).
  - shadcn HSL tokens (foreground, border, input, ring, muted, card, popover, accent, destructive) kept flat alongside M3 so existing Radix components keep rendering.
  - `background` key resolves to hsl(var(--background)) so `bg-background` flips in dark mode; the light HSL triplet equals M3 surface #fcf8ff.
  - Dark mode mapping documented inline in globals.css above the .dark block so 01-02/01-03/01-04 can rely on a stable contract.
  - Legacy `prose-content` class inside /[slug] post page replaced with `article-body` (which is now the canonical Tiptap typography wrapper).
metrics:
  duration: ~15 min
  completed: 2026-04-05
---

# Phase 1 Plan 01-01: Stitch M3 Design-System Foundation

Installed the Stitch M3 color palette, Newsreader + Plus Jakarta Sans font loaders, and recalibrated shadcn HSL tokens so every downstream plan can compose UI with Tailwind utilities backed by the Stitch design language. Also deleted all legacy editorial CSS (.hero-section, .article-card, .main-grid, .container-editorial, .nav-pill, .business-grid, .footer, .section-*) from globals.css and migrated /[slug], /categoria/[slug], /busca off those class names.

## Palette keys added to tailwind.config.ts

Top-level `theme.extend.colors` (verbatim from RESEARCH §1.5):

- `primary` `#00355f`, `primary-container` `#0f4c81`, `primary-fixed` `#d2e4ff`, `primary-fixed-dim` `#a0c9ff`, `on-primary` `#ffffff`, `on-primary-container` `#8ebdf9`, `on-primary-fixed` `#001c37`, `on-primary-fixed-variant` `#07497d`
- `secondary` `#bc0004`, `secondary-container` `#e42018`, `secondary-fixed` `#ffdad5`, `secondary-fixed-dim` `#ffb4a9`, `on-secondary` `#ffffff`, `on-secondary-container` `#fffbff`, `on-secondary-fixed` `#410000`, `on-secondary-fixed-variant` `#930002`
- `tertiary` `#472f00`, `tertiary-container` `#644400`, `tertiary-fixed` `#ffdeac`, `tertiary-fixed-dim` `#ffba38`, `on-tertiary` `#ffffff`, `on-tertiary-container` `#f5ac00`, `on-tertiary-fixed` `#281900`, `on-tertiary-fixed-variant` `#604100`
- `error` `#ba1a1a`, `error-container` `#ffdad6`, `on-error` `#ffffff`, `on-error-container` `#93000a`
- `surface` `#fcf8ff`, `surface-bright` `#fcf8ff`, `surface-dim` `#dad7f3`, `surface-container-lowest` `#ffffff`, `surface-container-low` `#f5f2ff`, `surface-container` `#efecff`, `surface-container-high` `#e8e5ff`, `surface-container-highest` `#e2e0fc`, `surface-variant` `#e2e0fc`, `surface-tint` `#2d6197`
- `on-surface` `#1a1a2e`, `on-surface-variant` `#42474f`, `on-background` `#1a1a2e`, `background` → `hsl(var(--background))` (light: #fcf8ff)
- `inverse-surface` `#2f2e43`, `inverse-on-surface` `#f2efff`, `inverse-primary` `#a0c9ff`, `outline` `#727780`, `outline-variant` `#c2c7d1`

Shadcn HSL aliases (flat): `foreground`, `border`, `input`, `ring`, `muted`, `popover`, `card`, `accent`, `destructive`.

`fontFamily`: `headline: [var(--font-headline), Newsreader, serif]`, `body: [var(--font-body), Plus Jakarta Sans, sans-serif]`, `label: [var(--font-body), Plus Jakarta Sans, sans-serif]`.

`borderRadius`: `DEFAULT: 0.125rem`, `lg: 0.25rem`, `xl: 0.5rem`, `full: 0.75rem`, plus `md`/`sm` retained for shadcn.

## Dark-mode HSL mapping (.dark block)

Each HSL triplet in `app/globals.css` `.dark` block traces back to an M3 hex:

| shadcn var | HSL | M3 source |
| --- | --- | --- |
| `--background` | `240 28% 14%` | `#1a1a2e` on-surface |
| `--foreground` | `249 100% 98%` | `#fcf8ff` surface |
| `--card` | `240 20% 22%` | `#2f2e43` inverse-surface |
| `--primary` | `210 100% 81%` | `#a0c9ff` primary-fixed-dim |
| `--primary-foreground` | `209 100% 11%` | `#001c37` on-primary-fixed |
| `--secondary` | `6 100% 83%` | `#ffb4a9` secondary-fixed-dim |
| `--secondary-foreground` | `0 100% 13%` | `#410000` on-secondary-fixed |
| `--accent` | `38 100% 61%` | `#ffba38` tertiary-fixed-dim |
| `--accent-foreground` | `36 100% 8%` | `#281900` on-tertiary-fixed |
| `--destructive` | `5 83% 75%` | derived from error dark role |
| `--border` / `--input` | `240 17% 30%` | derived dark outline |
| `--muted` / `--muted-foreground` | `240 17% 24%` / `215 13% 79%` | derived from surface-dim + outline-variant |

Light mode: `--background 249 100% 98%` (#fcf8ff), `--foreground 240 28% 14%` (#1a1a2e), `--primary 209 100% 19%` (#00355f), `--secondary 359 100% 37%` (#bc0004), `--accent 38 100% 48%` (#f5ac00), `--border 214 14% 79%` (#c2c7d1).

## Legacy classes deleted from globals.css

The entire 642-line editorial layer was replaced. Classes deleted:

- `.hero-section`, `.hero-overlay`, `.hero-title`, `.hero-meta`
- `.breaking-banner`
- `.article-card`, `.article-card--featured`, `.article-card--compact`, `.article-card--horizontal`
- `.main-grid`, `.home-layout`, `.business-grid`
- `.widget`, `.section-header`, `.section-title`
- `.nav-pill`, `.page-layout`, `.container-editorial`
- `.footer` (custom variant)
- Custom CSS vars: `--color-brand*`, `--color-accent*`, `--color-breaking*`, `--color-page-bg`, `--color-bg`, `--color-surface*`, `--color-border`, `--color-text*`, `--color-ad-*`, `--color-premium`, `--color-text-primary/secondary`, `--font-bebas`, `--font-serif`, `--font-sans`
- Legacy `@import url(...Bebas Neue...Newsreader...Sora...)` removed
- `.prose-content` (replaced by `.article-body` which is now the canonical Tiptap wrapper)

Preserved (new globals.css):

- `@tailwind base|components|utilities` directives
- shadcn HSL tokens (light + `.dark`) recalibrated from M3
- `html { scroll-behavior: smooth; }`
- `body { @apply bg-background text-foreground font-body antialiased; }`
- `h1..h6 { @apply font-headline; }`
- `::selection` with M3 primary
- `.scrollbar-hide` utility
- `.article-body` component (Tiptap typography)

File size: 642 → ~125 lines.

## Files touched in the class-migration sweep

| File | Legacy refs removed | Replaced with |
| --- | --- | --- |
| `app/(public)/[slug]/page.tsx` | `container-editorial`, `section-title`, `prose-content`, inline `<style>` block with `--color-*` vars | `max-w-[1200px] mx-auto px-4`, `text-2xl md:text-3xl font-headline font-bold text-on-surface`, `article-body` |
| `app/(public)/categoria/[slug]/page.tsx` | `container-editorial`, inline `fontFamily: var(--font-bebas)`, `var(--color-brand)` fallback | `max-w-[1200px] mx-auto px-4`, `font-headline font-bold text-3xl md:text-4xl` |
| `app/(public)/busca/page.tsx` | `container-editorial`, `article-card`, inline `font-bebas`, `--color-border`, `--color-bg` | `max-w-[1200px] mx-auto px-4`, `group flex gap-4 items-start p-4 rounded-lg border border-outline-variant bg-surface-container-lowest hover:shadow-md transition-shadow`, `font-headline font-bold text-3xl md:text-4xl text-on-surface` |

Pages outside this plan's scope (e.g., `app/(public)/page.tsx`, `app/(public)/anunciantes/page.tsx`) still reference legacy class names — those classes now produce no CSS, so the pages render in a minimally-styled state until plans 01-03 / 01-04 rewrite them. Build does not fail on unknown class names; Tailwind simply emits nothing for them.

## Fonts removed

`app/layout.tsx` no longer imports `Bebas_Neue`, `DM_Sans`, or `DM_Serif_Display`. No file under `app/` or `components/` now loads `next/font/google` for any legacy face. `grep next/font/google app/ components/` returns only `app/layout.tsx` with `Newsreader` + `Plus_Jakarta_Sans`.

## Build log excerpt

```
> foz-foco@1.0.0 build
> prisma generate && next build

✔ Generated Prisma Client (v5.22.0)
   ▲ Next.js 15.5.12
   Creating an optimized production build ...
 ✓ Compiled successfully in 4.2s
   Linting and checking validity of types ...
   Collecting page data ...
   Generating static pages (26/26)
   Finalizing page optimization ...

Route (app)                                 Size  First Load JS
┌ ƒ /                                    3.56 kB         114 kB
├ ƒ /[slug]                              3.11 kB         114 kB
├ ○ /busca                               3.04 kB         133 kB
├ ƒ /categoria/[slug]                    2.79 kB         114 kB
...
+ First Load JS shared by all             102 kB
```

Exit code **0**. `prisma:error Can't reach database server at localhost:5432` appears during static page generation because `DATABASE_URL` was a placeholder — acceptable per plan Task 5; the Next.js compile step itself finished cleanly with zero TypeScript or Tailwind errors.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added shadcn `foreground` HSL alias back to tailwind.config.ts**
- **Found during:** Task 5 build verification
- **Issue:** First build failed with `The text-foreground class does not exist` because the original tailwind.config.ts exposed `foreground: hsl(var(--foreground))` as a flat key and globals.css `body { @apply text-foreground }` depends on it. My first draft of tailwind.config.ts removed that key assuming M3's `on-surface` would suffice, but globals.css still used the shadcn name.
- **Fix:** Re-added `foreground: 'hsl(var(--foreground))'` as a flat color alongside the M3 tokens. Also changed `background: '#fcf8ff'` to `background: 'hsl(var(--background))'` so `bg-background` flips correctly in dark mode (light-mode HSL still resolves to #fcf8ff, matching M3 surface). Documented the rationale inline in tailwind.config.ts.
- **Files modified:** `tailwind.config.ts`
- **Commit:** (this plan's single commit)

**2. [Rule 2 - Missing critical] Replaced `.prose-content` with `.article-body` on /[slug]**
- **Found during:** Task 4 class sweep
- **Issue:** The plan explicitly says to keep `.article-body` for Tiptap HTML, and `app/(public)/[slug]/page.tsx` wrapped post content in `className="prose-content"` backed by a `<style>{...}</style>` block full of `var(--color-*)` / `var(--font-serif)` tokens — all of which are deleted by Task 3. Without migration, post bodies would render as raw unstyled HTML.
- **Fix:** Renamed the wrapper to `className="article-body"` (the canonical Tiptap typography class now shipped by globals.css) and removed the dead CSS from the page's inline `<style>` block.
- **Files modified:** `app/(public)/[slug]/page.tsx`

### Auth Gates

None.

### Deferred Items

- Pages outside this plan's sweep (`app/(public)/page.tsx`, `app/(public)/anunciantes/page.tsx`, `components/**`) still reference deleted legacy classes (`.hero-section`, `.article-card`, `.main-grid`, `.container-editorial`, `.widget`, `.section-title`, `.business-grid`, `.footer`, `font-bebas`, etc.) and legacy CSS vars (`var(--color-brand)`, `var(--color-text)`, `var(--font-bebas)`). This is per plan scope — plans 01-02/01-03/01-04 rewrite Header, Footer, homepage, anunciantes and their underlying components. The build still compiles because unknown Tailwind classes are no-ops, not errors. Visual degradation in those pages is expected between now and plan 01-04.

## Known Stubs

None. This plan installs foundation tokens and fonts; no UI components were stubbed.

## Self-Check: PASSED

- `tailwind.config.ts` modified — FOUND
- `app/layout.tsx` rewritten with Newsreader + Plus_Jakarta_Sans — FOUND
- `app/globals.css` slimmed to ~125 lines with `.article-body` + dark HSL recalibration — FOUND
- `app/(public)/[slug]/page.tsx` swept — FOUND, zero legacy class refs
- `app/(public)/categoria/[slug]/page.tsx` swept — FOUND, zero legacy class refs
- `app/(public)/busca/page.tsx` swept — FOUND, zero legacy class refs
- Build exit code 0 — confirmed
- "Compiled successfully in 4.2s" — confirmed in `.build.log`
