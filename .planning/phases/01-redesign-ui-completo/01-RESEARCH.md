# Phase 1 Research — Redesign UI Completo

**Researched:** 2026-04-05
**Domain:** UI fidelity rebuild (Next.js 15 + Tailwind 3.4) mirroring Stitch design contract `8140760864745957946`
**Confidence:** HIGH — all data extracted directly from the 4 Stitch HTMLs and the current repo. Zero external assumptions.

## Summary

Phase 1 rebuilds the entire public-facing UI of `foz-foco.vercel.app` to match a locked Stitch design contract (1 desktop + 3 mobile HTMLs already on disk). Backend is untouched. The prior attempt (commit `b4a69e3`) was rejected because it only swapped CSS tokens without changing JSX structure — this phase MUST rewrite components structurally.

Research confirms: (1) the Stitch HTMLs use a **Material Design 3-inspired Tailwind config** with a very specific palette, Newsreader serif for headlines, and Plus Jakarta Sans body; (2) the current codebase uses a totally different visual system (inline CSS + `#0F4C81` pseudo-token, Sora + Bebas + Newsreader, no M3 tokens); (3) every major public component needs a full rewrite, not a patch. The Post/Ad/Category data contracts remain valid and flow from server components unchanged.

**Primary recommendation:** Extend `tailwind.config.ts` with the Stitch M3 color palette as first-class Tailwind utilities (`primary`, `primary-container`, `tertiary-fixed`, `on-tertiary-container`, etc.), load Newsreader + Plus Jakarta Sans via `next/font/google`, then rewrite each public component as a 1:1 JSX mirror of the corresponding Stitch section. Delete inline style objects in favor of Tailwind utility classes wherever possible.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Design tokens (locked — extracted from Stitch desktop.html tailwind.config):**
- Primary: `#00355f`
- Primary container: `#0f4c81`
- Secondary: `#bc0004`
- Tertiary/Accent: `#f5ac00` (this is actually `on-tertiary-container` in Stitch M3 naming)
- Tertiary fixed: `#ffdeac`
- Surface / background: `#fcf8ff`
- Surface container: `#efecff`
- Surface container high: `#e8e5ff`
- On-surface / on-background: `#1a1a2e`
- Outline: `#727780`
- Outline variant: `#c2c7d1`
- Error: `#ba1a1a`
- Dark mode: manter tokens HSL equivalentes via next-themes (shadcn/ui)

**Typography (locked):**
- Headline font: Newsreader (serif)
- Body/label font: Plus Jakarta Sans (sans)
- Bebas Neue: discard or keep only as optional logo option (planner decides)
- Sora / DM Serif Display / DM Sans: REMOVE — not in Stitch
- Load via `next/font/google`

**Stack & libs (locked):**
- Next.js 15 App Router + React 19 — keep
- Tailwind 3.4 + shadcn/ui Radix — keep
- lucide-react for icons — keep (Stitch uses Material Symbols; map to lucide equivalents)
- next-themes for dark mode — keep
- framer-motion: use only if component already uses it; do NOT introduce new

**Visual source of truth (locked):**
- `.planning/research/stitch/desktop.html` — desktop master
- `.planning/research/stitch/mobile-a.html` — mobile A
- `.planning/research/stitch/mobile-b.html` — mobile B (PRIMARY mobile base)
- `.planning/research/stitch/mobile-c.html` — mobile C
- Planner and executor MUST open these HTMLs and extract real structure — do NOT improvise

**Rollout strategy (locked):**
- One phase, 4 plans (tokens → layout → home → anunciantes+ads)
- Atomic plans, one commit per plan
- Visual verification via Vercel preview (no local dev — Prisma needs DATABASE_URL)
- `npm run build` should pass locally before commit if viable, else via Vercel

**Mobile strategy (locked):**
- Use **mobile-b** as primary base (most complete: feed + Guia Comercial + Anuncie + footer)
- mobile-a and mobile-c serve as reference for alternative sections on other routes

### Claude's Discretion
- Exact filenames of new/renamed components
- CSS internal structure (utility vs component classes) — preference is Tailwind utilities over inline styles
- How to break each plan into smaller tasks
- Which lucide-react icon maps to which Material Symbol
- Exact responsive breakpoints (within Tailwind mobile-first default)
- Whether to keep inline `style={{}}` (current pattern) or migrate to Tailwind classes (preferable where it simplifies)

### Deferred Ideas (OUT OF SCOPE)
- Redesign of `/admin/*` pages
- New engagement features (comments, newsletter popups, push)
- Unit tests for components (verification is visual via Vercel)
- Core Web Vitals optimization
- A/B testing the 3 mobile layouts (use mobile-b as primary now)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| TOK-01 | `app/globals.css` uses Stitch palette | §1.5 Token map; §2.1 current tokens to replace |
| TOK-02 | Newsreader + Plus Jakarta Sans via next/font | §1.6 typography scale; current uses Sora/Bebas (§2.1) |
| TOK-03 | CSS vars reflect new tokens, consumed by components | §1.5; §4 Plan 01-01 |
| TOK-04 | Dark mode with HSL equivalents | Current `globals.css` already has HSL shadcn tokens (lines 64-83) — recalibrate to new palette |
| HDR-01 | Sticky header with logo/nav/actions mirroring desktop Stitch | §1.1 rows 1-4; §2.3 Header = FULL REWRITE |
| HDR-02 | Mobile menu structural per Stitch mobile variants | §1.3 mobile-b header + bottom nav; current drawer is different |
| HDR-03 | "Anuncie aqui" CTA in accent color | §1.1 row 4 uses `bg-tertiary-fixed text-on-tertiary-fixed` |
| HDR-04 | Search overlay integrated into new design | Current Header.tsx has working search — keep logic, restyle shell |
| HOME-01 | Hero with dominant image + large Newsreader title | §1.1 Hero Story markup; currently `HeroSection.tsx` full-width CSS class |
| HOME-02 | 3-col desktop / 1-col mobile grid with editorial cards | §1.1 "3-Column News Grid"; currently `MainGrid` 4-col |
| HOME-03 | Sidebar with 300×250 ad + "Mais Lidas" widget | §1.1 Right Column markup; currently `Sidebar.tsx` sticky aside |
| HOME-04 | "Guia Comercial" tiles | §1.1 Row 6 (6 tiles); §1.3 mobile-b 2×2 grid |
| HOME-05 | "Anuncie" section with 3 pricing cards | §1.1 Row 9 pricing markup |
| HOME-06 | Mobile A variant | §1.2 full map |
| HOME-07 | Mobile B variant (PRIMARY) | §1.3 full map |
| HOME-08 | Mobile C variant | §1.4 full map |
| FTR-01 | Navy footer + CTA publicidade in accent | §1.1 Row 11 + current Footer.tsx has gradient CTA (partial match) |
| FTR-02 | 3-column desktop → 1-col mobile | §1.1 `grid-cols-1 md:grid-cols-4` (actually 4 columns in Stitch) |
| ADS-01 | `<AdSlot>` component with IAB formats | §1.5 slot dimensions; NEW component |
| ADS-02 | Slots visible in home desktop + mobile | §1.7 slot locations |
| ADS-03 | Placeholder visual for unsold slots | §1.1 all slots have dashed border + "[ 728x90 ... ]" placeholder pattern |
| ANUN-01..07 | `/anunciantes` landing aligned with new visuals | Current page (§2.1) exists, reuse structure, restyle |
| RES-01..03 | Responsiveness + dark mode + no regression in category/post | §3 gap analysis |
| BUILD-01..03 | Build passes, Vercel READY, admin untouched | §5 risks |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **GSD Workflow Enforcement** — all edits MUST go through `/gsd:execute-phase` or equivalent. Direct edits outside a GSD workflow are forbidden unless the user explicitly requests bypass.
- **No browser/Chrome** — verification is strictly via Vercel preview URLs, not local browser automation. This is a HARD constraint from the user's memory.
- **Executar sem pedir permissão** — proceed autonomously within the GSD phase boundary.

---

## 1. Stitch Design Contract Analysis

### 1.1 Desktop (`desktop.html`) — 2560 × 9890, max-width `1200px`

Single-page vertical layout with 11 distinct rows. Container is `max-w-[1200px] mx-auto` everywhere.

**Row 1 — Top Bar** (`bg-on-surface text-surface h-8 py-2 px-4`, full-width strip)
- Max-w 1200 flex container. LEFT: date+city `Sábado, 05 de abril de 2026 | Foz do Iguaçu - PR` + weather `sunny 28°C`. RIGHT: social icons (`public share mail`) + `ANUNCIE AQUI` pill `bg-secondary px-3 py-1 rounded-full text-white font-bold`.
- Typography: `text-[11px] font-label tracking-wider uppercase font-medium`.

**Row 2 — Header** (`bg-white h-[80px]`, full-width)
- LEFT: logo block. `<h1 class="text-3xl font-black text-primary-container font-headline tracking-tighter leading-none">FOZ EM FOCO</h1>` + tagline `<p class="text-[10px] font-label uppercase tracking-widest text-outline">O portal de notícias de Foz do Iguaçu</p>`.
- CENTER: search bar `flex-1 max-w-md mx-12` — `input.bg-surface-container rounded-full px-6 py-2 text-sm` + search icon absolute right.
- RIGHT: person + menu icons (`text-primary-container`).

**Row 3 — Leaderboard Ad** (`bg-surface py-4 flex justify-center`)
- Slot: `w-[728px] h-[90px] border-2 border-dashed border-outline-variant bg-[#EEEEEE]`, label `absolute top-1 left-2 text-[8px] font-bold bg-tertiary-fixed text-on-tertiary-fixed px-1 rounded-sm` = `PUBLICIDADE`. Fallback text: `[ 728x90 — Espaço disponível: (45) 99999-9999 ]`.

**Row 4 — Navigation** (`bg-primary-container sticky top-0 z-50 shadow-lg`)
- Max-w 1200 flex. Links: HOME / NOTÍCIAS / TURISMO / ECONOMIA / POLÍTICA / ESPORTES / GUIA COMERCIAL / EMPREGOS / IMÓVEIS. Each: `px-5 py-4 text-white font-label text-xs font-bold tracking-widest`. Active: `bg-white/10 border-b-2 border-white`. Hover: `hover:bg-white/5`.
- RIGHT: CTA `bg-tertiary-fixed text-on-tertiary-fixed px-4 py-2 rounded-sm` = `ANUNCIE AQUI` (this is the accent-on-navy CTA).

**Row 5 — Main Content** (`max-w-[1200px] mx-auto py-10 grid grid-cols-12 gap-8`)
- **LEFT col-span-8 `space-y-10`:**
  - **Hero article**: `aspect-[16/9]` image, `bottom-0 p-8 bg-gradient-to-t from-on-surface via-on-surface/60 to-transparent text-white`. Badge: `bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold tracking-widest uppercase`. Title: `text-4xl font-headline font-bold leading-tight`. Meta: `text-sm opacity-80 font-label` (`Por X • 05 Abr 2026`). Excerpt: `text-lg font-light text-surface-container-high`. CTA text: `font-bold text-tertiary-fixed` = `Leia mais →`.
  - **3-col grid** (`grid grid-cols-3 gap-6`): each card is `space-y-3` with `aspect-video` image + `text-[10px] font-bold text-primary tracking-widest uppercase` category label + `font-headline font-bold text-lg leading-tight` title. NO excerpt, NO meta — ultra clean editorial card.
  - **In-feed Ad**: `w-full h-[250px] bg-surface-container border border-outline-variant`, dashed label top-left.

- **RIGHT col-span-4 `space-y-12` (sidebar):**
  - Ad `w-[300px] h-[600px] mx-auto bg-surface-container`.
  - **Mais Lidas section**: title `border-b-4 border-primary inline-block pr-8 pb-2` + `text-xl font-headline font-bold uppercase tracking-tight`. 3 numbered items: `flex gap-4`, number `text-3xl font-black text-surface-variant font-headline italic`, title `font-headline font-bold leading-tight`, views `text-[10px] text-outline font-medium`.
  - Ad `w-[300px] h-[250px]`.
  - **Últimas section**: same border treatment but `border-secondary`. `ul.space-y-4 divide-y divide-outline-variant/20` with `<a class="text-sm font-medium">15:45 — ...</a>`.

**Row 6 — Guia Comercial** (`bg-surface-container py-16`)
- Header: `flex justify-between items-end mb-10`, title `text-3xl font-headline font-bold text-on-surface` + link `text-primary font-bold text-sm`.
- Grid: `grid grid-cols-6 gap-4`. Each tile: `bg-white p-4 h-[120px] rounded-md shadow-sm` flex column center with Material icon `text-primary` + `font-bold text-xs uppercase tracking-wider` label. LAST tile = "Cadastre sua Empresa" variant: `bg-on-tertiary-container/10 border-2 border-dashed border-on-tertiary-container/30`.

**Row 7 — Agenda de Eventos** (`py-16 bg-white`)
- Title `text-3xl font-headline font-bold mb-10`. Horizontal scroller: `flex gap-6 overflow-x-auto pb-8 scrollbar-hide`. Each card: `flex-none w-[300px]`, image `h-[400px] rounded-xl`, date badge `absolute top-4 left-4 bg-white/90 backdrop-blur p-2 rounded min-w-[50px]` (number `text-xl font-black` + month `text-[10px] uppercase text-primary`). Below: title `font-headline font-bold text-xl` + venue `text-sm text-outline`.

**Row 8 — Empregos** (`py-16 bg-surface-container-low`)
- Grid `grid-cols-12 gap-12 items-center`. LEFT col-span-4: title `text-4xl font-headline font-bold text-primary`, paragraph, button `bg-primary text-white px-8 py-3 rounded-md font-bold tracking-widest text-xs uppercase`. RIGHT col-span-8 `space-y-4`: each job card `bg-white p-6 rounded-lg shadow-sm border-l-4 border-primary` (or `border-secondary`) with title + employer + pill badge `text-xs font-bold bg-surface-container px-3 py-1 rounded-full text-primary` (URGENTE/NOVA).

**Row 9 — Anuncie CTA / Pricing** (`py-24 bg-gradient-to-br from-primary via-primary-container to-on-surface text-white`)
- Header center: `text-4xl font-headline font-bold` + subtitle `text-on-primary-container`.
- 3-card grid `grid-cols-3 gap-8`:
  - **Bronze/Ouro** (identical style): `bg-white/10 backdrop-blur-md p-10 rounded-2xl border border-white/20 text-center flex flex-col`. Title `text-xl font-bold`, price `text-3xl font-headline font-black`, features list `text-left space-y-4`, icon `text-green-400`, button `border border-white/40 rounded-md font-bold text-xs uppercase tracking-widest`.
  - **Prata (popular)**: `bg-white text-on-surface p-10 rounded-2xl shadow-2xl transform scale-105 z-10` + badge `absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest` = `MAIS POPULAR`. Price uses `text-primary`, icons use `text-primary`, button `bg-primary text-white`.
- Footer link: `text-tertiary-fixed-dim hover:underline` = WhatsApp CTA.

**Row 10 — Footer Ad Banner** (`py-12 bg-surface`) — another `728×90` slot.

**Row 11 — Footer** (`bg-on-surface text-surface py-20 px-4`)
- `max-w-[1200px] grid grid-cols-1 md:grid-cols-4 gap-12`:
  - **Col 1 — Brand**: logo `text-2xl font-black font-headline text-on-primary-container tracking-tighter` + tagline `text-sm text-outline-variant` + social icons row.
  - **Col 2 — Editorial**: heading `font-bold text-xs uppercase tracking-widest text-on-primary-container` + `ul.space-y-3 text-sm text-outline-variant` (Cidades/Política/Economia/Esporte/Cultura).
  - **Col 3 — Institucional**: same pattern (Sobre Nós/Expediente/Anuncie/Privacidade/Contato).
  - **Col 4 — Newsletter**: heading + paragraph + input row `bg-white/5` + button `bg-on-primary-container`.
- Bottom bar: `mt-20 pt-8 border-t border-white/10 flex justify-between text-[10px] uppercase tracking-widest`.

---

### 1.2 Mobile A (`mobile-a.html`) — 780 × 4608

Strategy: **hero + sectioned feed**, uses body-level `pb-24` to reserve space for fixed bottom nav.

**Sections in order:**
1. **TopAppBar** — `fixed top-0 z-50 bg-[#0F4C81] text-white h-16 px-6 flex justify-between`. LEFT: menu icon button. CENTER: `h1.text-xl font-bold tracking-widest font-serif italic` = `FOZ EM FOCO`. RIGHT: search icon.
2. **Top Ad Banner** — `px-4 py-4`, inner `max-w-[300px] h-[50px] bg-surface-container-high` = `PUBLICIDADE` strip (320×50 mobile banner).
3. **Featured Hero** — `px-4 mb-10`, `aspect-[4/5]` image, gradient overlay `from-black/80`, absolute content: badge `bg-tertiary-container text-on-tertiary-container rounded-full` = `Destaque`, `text-3xl font-headline` title, `text-sm` excerpt line-clamp-2.
4. **Latest News** — `px-4 mb-8`. Section header: `text-2xl font-headline italic border-l-4 border-primary pl-3` = `Latest News` + `text-[10px] font-bold uppercase` link `Ver Tudo`. List items (`space-y-8`): `flex gap-4 items-start`, left column has category `text-tertiary text-[10px] font-bold uppercase` + `font-headline text-lg leading-snug` title + time `text-[10px] flex items-center gap-1 material-symbols-outlined`. Right column `w-24 h-24 shrink-0 rounded-lg overflow-hidden`.
5. **Mid Ad Banner** — `my-8 bg-surface-container-low py-8`, inner `w-[300px] h-[250px]`.
6. **Most Read** — card container `bg-surface-container-lowest rounded-2xl p-6 shadow-sm` containing `divide-y divide-outline-variant/20`. Each item: `flex gap-4` with number `text-3xl font-headline font-black italic text-outline-variant/50` + title `text-lg font-headline leading-tight` + category `text-primary text-[10px] font-bold uppercase`.
7. **Footer** — `bg-[#001c37] text-white pt-12 pb-24 px-6`, centered brand + tagline + 3 social icons + bottom copyright.
8. **BottomNavBar** — `fixed bottom-0 z-50 bg-white/80 backdrop-blur-md border-t h-20 pb-safe flex justify-around`. 5 items: Home (active `text-[#0F4C81] bg-[#d5e3fc]/30 rounded-xl px-3 py-1`), News, Tourism, Guide, Jobs. Each: icon `material-symbols-outlined` + label `text-[10px] font-semibold uppercase tracking-wider`.

---

### 1.3 Mobile B (`mobile-b.html`) — 780 × 5560 — **PRIMARY MOBILE REFERENCE**

Most complete variant. Sections:

1. **TopAppBar** — `fixed top-0 z-50 bg-surface/80 backdrop-blur-md shadow-sm h-16 px-6 flex justify-between`. LEFT: menu icon `text-blue-900`. CENTER: `h1.font-newsreader text-2xl font-bold italic text-blue-950` = `Foz em Foco`. RIGHT: `<button class="bg-primary text-on-primary text-xs px-4 py-2 font-bold uppercase tracking-wider">Anuncie</button>`.
2. **Top Ad** — `px-4 mb-6` with `bg-surface-container-high h-24 flex items-center justify-center text-[10px] tracking-widest text-outline font-bold` = `PUBLICIDADE` (mobile banner variant).
3. **Hero News** — `px-4 mb-8`. `relative overflow-hidden group` wrapping `img aspect-[4/3]` + `bg-gradient-to-t from-primary/90`. Absolute content: badge `bg-tertiary px-3 py-1 text-[10px] font-bold tracking-widest uppercase`, title `font-newsreader text-3xl font-bold leading-tight`, excerpt `text-sm opacity-90 line-clamp-2`.
4. **Secondary News** — `px-4 space-y-6`. Two cards, each `flex gap-4 items-start`. Text left (category `text-primary text-[10px] font-bold tracking-widest uppercase` + `font-newsreader text-xl font-bold leading-snug`), image right `w-24 h-24 object-cover`.
5. **Patrocinado card** — `bg-surface-container-lowest border-l-4 border-tertiary p-6`. Header row with `text-tertiary text-[10px] uppercase` label + info icon. Title `font-newsreader text-xl font-bold`. Bottom bar `bg-primary/5 p-4 flex justify-between items-center` with CTA text + arrow.
6. **Guia Comercial** — `bg-surface-container-low py-10 px-4`. Header: title `font-newsreader text-3xl font-bold text-primary` + subtitle `text-xs uppercase tracking-widest` + explore icon right. Grid `grid-cols-2 gap-4`. Each tile: `bg-surface-container-high p-4 flex flex-col justify-between aspect-square`, icon top-right, label bottom-left `font-bold text-on-surface`.
7. **Pricing Tiers** — `bg-primary py-12 px-6`. Centered header `font-newsreader text-3xl text-white italic` + divider `w-12 h-1 bg-on-primary-container mx-auto`. Stacked `space-y-6`. Three tiers:
   - **Bronze**: `bg-white/5 border border-white/10 p-6`. Row: `on-primary-container text-xs tracking-[0.2em]` name + `text-white font-newsreader text-2xl italic` price. Description `text-xs text-blue-200`. Button `w-full py-3 bg-white text-primary text-xs font-bold tracking-widest uppercase`.
   - **Prata**: `bg-white p-6 shadow-2xl`. Name/price both `text-primary`. Button `bg-primary text-white`.
   - **Ouro**: `bg-tertiary-container p-6`. Name/price `on-tertiary-container`/white. Button `bg-on-tertiary-container text-tertiary-container`.
8. **Footer** — `bg-blue-950 pt-12 pb-24 px-8 flex flex-col items-center text-center space-y-6`. Brand `font-newsreader text-2xl text-white` + flex-wrap links `text-slate-400 text-xs tracking-wide` + copyright `text-slate-500 text-[10px] uppercase tracking-[0.2em]`.
9. **BottomNavBar** — `fixed bottom-0 py-3 pb-safe bg-white/90 backdrop-blur-xl shadow border-t z-50 flex justify-around`. 4 items: Notícias (active `bg-blue-50 text-blue-900 rounded-xl px-3 py-1`), Turismo, Guia, Empregos.

---

### 1.4 Mobile C (`mobile-c.html`) — 780 × 5056

Hybrid: header has sub-CTA strip + category tab scroller. Sections:

1. **Header** — `bg-[#0F4C81] docked top-0 z-50`. Inner: `flex justify-between px-4 h-14`, brand `h1.text-2xl font-bold font-['Newsreader'] text-white tracking-tight` = `Foz em Foco`, menu button. **Sub-header strip** `bg-tertiary-container py-2 px-4 flex justify-between`: LEFT `text-[10px] font-bold text-on-tertiary-container uppercase tracking-widest` = `ANUNCIE AQUI`, RIGHT icon+text `Divulgue seu negócio` + `campaign` icon.
2. **Leaderboard Ad** — `p-4 bg-surface-container-low`, inner `w-full h-[70px] border border-dashed` placeholder with `(45) 99999-9999` text.
3. **Category Tabs** — `sticky top-0 z-40 bg-white border-b overflow-hidden`. Horizontal scroller `flex items-center gap-6 px-4 overflow-x-auto no-scrollbar py-3`. Active: `text-[#0F4C81] font-bold text-sm border-b-2 border-[#0F4C81] pb-1`.
4. **Hero News Card** — `mt-4 px-4`, `aspect-[16/9]` with gradient + absolute content (badge `bg-primary text-white`, title `text-2xl text-white font-headline font-bold`, meta `text-[10px] flex gap-2`).
5. **Secondary Cards** — `mt-8 px-4 flex flex-col gap-6`. Each: `flex gap-4 items-start`. Image left `w-24 h-24 flex-shrink-0`. Text right: category `text-[10px] font-bold uppercase tracking-widest` (colored per-category: `text-green-700`, `text-secondary`) + `text-lg font-headline font-bold`.
6. **In-Feed Ad** — `mt-8 px-4`. `bg-surface-container-low border border-secondary-container p-6 flex flex-col items-center text-center`. Label `text-[9px] font-bold text-secondary bg-secondary-fixed`, copy `text-sm font-medium`, CTA button `bg-green-600 text-white px-8 py-2 font-bold uppercase tracking-widest text-xs rounded`.
7. **More News** — `mt-8 px-4 flex flex-col gap-6`. Each row: `flex gap-3 items-center` with `w-16 h-16` image + `text-sm font-headline font-semibold leading-tight` title. Compact.
8. **Guia Comercial Strip** — `mt-10 py-6 bg-surface-container-low overflow-hidden`. Header title `text-xs font-bold tracking-widest text-primary uppercase` + link `text-secondary`. Horizontal scroller with `w-20 h-20 bg-white shadow-sm` logo tiles + `text-[9px] font-medium` label below. Last tile is dashed "Cadastre-se" green.
9. **Empregos Strip** — `mt-10 px-4`. Header `text-xs font-bold tracking-widest text-primary uppercase`. `space-y-4` list of `flex items-center justify-between p-3 bg-white border border-surface-container` with title+employer left and CTA button `bg-primary text-white px-3 py-1 text-[10px]` right.
10. **Anuncie CTA** — `mt-10 bg-primary-container p-8 text-center text-white`. Title `text-3xl font-headline font-bold`, subtitle `text-sm italic text-on-primary-container`, 3 mini pricing chips `bg-white/10 px-3 py-2 rounded` (middle scale-110 is "Popular"), WhatsApp button `bg-white text-primary flex gap-2 py-3 rounded-lg font-bold shadow-xl`.
11. **Footer Banner Ad** — `mt-6 px-4 pb-6` with `h-[70px]` placeholder.
12. **Footer** — `bg-[#1A1A2E] pt-12 pb-8 px-6`. Centered brand + 3 social icons + 2-col links grid `grid-cols-2 gap-x-12 gap-y-3 text-sm` + copyright.
13. **Bottom Nav** — `md:hidden fixed bottom-0 bg-white shadow h-16 flex justify-around`. 4 items: Home (active `text-[#0F4C81]` with filled icon), Notícias, Guia, Conta.

---

### 1.5 Extracted Design Tokens Summary

Copy verbatim into `tailwind.config.ts` under `theme.extend.colors`:

```ts
colors: {
  'primary': '#00355f',
  'primary-container': '#0f4c81',
  'primary-fixed': '#d2e4ff',
  'primary-fixed-dim': '#a0c9ff',
  'on-primary': '#ffffff',
  'on-primary-container': '#8ebdf9',
  'on-primary-fixed': '#001c37',
  'on-primary-fixed-variant': '#07497d',
  'secondary': '#bc0004',
  'secondary-container': '#e42018',
  'secondary-fixed': '#ffdad5',
  'secondary-fixed-dim': '#ffb4a9',
  'on-secondary': '#ffffff',
  'on-secondary-container': '#fffbff',
  'on-secondary-fixed': '#410000',
  'on-secondary-fixed-variant': '#930002',
  'tertiary': '#472f00',
  'tertiary-container': '#644400',
  'tertiary-fixed': '#ffdeac',
  'tertiary-fixed-dim': '#ffba38',
  'on-tertiary': '#ffffff',
  'on-tertiary-container': '#f5ac00', // THIS is the accent/amber CTA color
  'on-tertiary-fixed': '#281900',
  'on-tertiary-fixed-variant': '#604100',
  'error': '#ba1a1a',
  'error-container': '#ffdad6',
  'on-error': '#ffffff',
  'on-error-container': '#93000a',
  'surface': '#fcf8ff',
  'surface-bright': '#fcf8ff',
  'surface-dim': '#dad7f3',
  'surface-container-lowest': '#ffffff',
  'surface-container-low': '#f5f2ff',
  'surface-container': '#efecff',
  'surface-container-high': '#e8e5ff',
  'surface-container-highest': '#e2e0fc',
  'surface-variant': '#e2e0fc',
  'surface-tint': '#2d6197',
  'on-surface': '#1a1a2e',
  'on-surface-variant': '#42474f',
  'on-background': '#1a1a2e',
  'background': '#fcf8ff',
  'inverse-surface': '#2f2e43',
  'inverse-on-surface': '#f2efff',
  'inverse-primary': '#a0c9ff',
  'outline': '#727780',
  'outline-variant': '#c2c7d1',
},
borderRadius: {
  DEFAULT: '0.125rem',
  lg: '0.25rem',
  xl: '0.5rem',
  full: '0.75rem',
},
```

**Semantic usage map:**

| Token | Used For |
|-------|----------|
| `primary` (`#00355f`) | Section titles `text-primary`, job card `border-primary`, button `bg-primary text-white`, category labels `text-primary` on desktop grid cards |
| `primary-container` (`#0f4c81`) | Sticky desktop nav `bg-primary-container`, logo color `text-primary-container`, mobile header `bg-[#0F4C81]`, mobile CTA section `bg-primary-container` |
| `secondary` (`#bc0004`) | "ANUNCIE AQUI" top-bar pill `bg-secondary`, border accents `border-secondary`, section divider `border-b-4 border-secondary`, URGENTE pill text |
| `on-tertiary-container` (`#f5ac00`) | **THE amber/accent CTA color** — "ANUNCIE AQUI" nav button `bg-tertiary-fixed text-on-tertiary-fixed` (fixed `#ffdeac` bg + `#604100` text, NOT f5ac00). Careful: the f5ac00 is the token NAME but used more for hover states and `on-tertiary-container` role |
| `tertiary-fixed` (`#ffdeac`) | Badge backgrounds `bg-tertiary-fixed` (hero article category badge, nav "ANUNCIE AQUI" pill) |
| `surface` / `background` (`#fcf8ff`) | Page background `bg-surface` — very subtle lavender-white |
| `surface-container` (`#efecff`) | Guia Comercial section `bg-surface-container`, search input `bg-surface-container`, ad placeholder backgrounds |
| `surface-container-high` (`#e8e5ff`) | Sidebar number large digits `text-surface-variant` (close enough), ad backgrounds |
| `surface-container-lowest` (`#ffffff`) | Card backgrounds, "Most Read" container |
| `on-surface` (`#1a1a2e`) | **All dark text** + **Footer background** `bg-on-surface text-surface`, Top bar `bg-on-surface text-surface` |
| `outline` (`#727780`) | Muted meta text `text-outline`, placeholder text |
| `outline-variant` (`#c2c7d1`) | Borders/dividers `border-outline-variant`, dashed ad borders |

**CTA Decision Tree (from Stitch):**
- Red pill `bg-secondary text-white rounded-full` = **top bar urgent CTA** (`ANUNCIE AQUI` tiny pill)
- Amber squared `bg-tertiary-fixed text-on-tertiary-fixed rounded-sm` = **nav bar CTA** (medium)
- Navy solid `bg-primary text-white` = **primary action** (Divulgue sua Vaga, card CTAs)
- White outline `border-white/40` = **ghost card CTAs** on gradient sections
- White solid `bg-white text-primary` = **popular tier CTA** on dark sections

### 1.6 Typography Scale

**Font loading (via `next/font/google`):**
```ts
import { Newsreader, Plus_Jakarta_Sans } from 'next/font/google'
const newsreader = Newsreader({ subsets: ['latin'], variable: '--font-headline', weight: ['400','600','700','800'], style: ['normal','italic'] })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-body', weight: ['300','400','500','600','700','800'] })
```

**Tailwind fontFamily config:**
```ts
fontFamily: {
  headline: ['var(--font-headline)', 'Newsreader', 'serif'],
  body:     ['var(--font-body)', 'Plus Jakarta Sans', 'sans-serif'],
  label:    ['var(--font-body)', 'Plus Jakarta Sans', 'sans-serif'],
}
```

**Type scale extracted from Stitch:**

| Role | Desktop | Mobile | Classes |
|------|---------|--------|---------|
| Logo (header) | 30px | 24px italic | `text-3xl font-black font-headline tracking-tighter leading-none` (desktop) / `text-2xl font-bold italic` (mobile) |
| Hero title | 36px (text-4xl) | 30px (text-3xl) | `font-headline font-bold leading-tight` |
| Section title (editorial) | 30px (text-3xl) | 30px | `font-headline font-bold` |
| Section title (sidebar widget) | 20px (text-xl) | 24px (text-2xl) | `font-headline font-bold uppercase tracking-tight` (desktop) / `font-headline italic border-l-4` (mobile) |
| Card title (grid) | 18px (text-lg) | 20px (text-xl) | `font-headline font-bold leading-tight` |
| Card title (secondary/compact) | 16px (text-base) | 18px (text-lg) | `font-headline font-bold leading-snug` |
| Sidebar numbered title | 16px | 18px (text-lg) | `font-headline font-bold leading-tight` |
| Body / excerpt | 18px (text-lg) | 14px (text-sm) | `font-light` (hero excerpt) or `font-body` |
| Meta (byline, date) | 14px (text-sm) | 10px (`text-[10px]`) | `font-label opacity-80` |
| Category label | 10px (`text-[10px]`) | 10px | `font-bold tracking-widest uppercase` (OR `tracking-wider`) |
| Nav link | 12px (text-xs) | 14px (text-sm) | `font-label font-bold tracking-widest uppercase` (desktop nav) |
| Top-bar strip | 11px (`text-[11px]`) | — | `font-label tracking-wider uppercase font-medium` |
| CTA button | 12px (text-xs) | 12px | `font-bold uppercase tracking-widest` |
| Price (hero pricing card) | 30px (text-3xl) | 24px (text-2xl) | `font-headline font-black` (desktop) / `font-newsreader italic` (mobile) |
| Footer heading | 12px (text-xs) | — | `font-bold uppercase tracking-widest` |
| Footer link | 14px (text-sm) | 12px | `text-outline-variant hover:text-white` |
| Copyright | 10px (`text-[10px]`) | 10px | `uppercase tracking-widest` |

**Recurring classes to memorize:**
- `font-headline font-bold` — every article/card title
- `font-headline italic` — mobile section titles, mobile logo
- `text-[10px] font-bold tracking-widest uppercase` — every category badge/eyebrow label
- `font-label tracking-widest uppercase` — all nav links + copyright + "publicidade" labels
- `leading-tight` (for titles) / `leading-snug` (for compact cards) / `leading-relaxed` (for body)

### 1.7 Section Inventory (consolidated — unique sections across all 4 screens)

| # | Section | Desktop | Mobile A | Mobile B | Mobile C | Notes |
|---|---------|---------|----------|----------|----------|-------|
| 1 | Top-bar (date/weather/social/red CTA pill) | ✓ | ✗ | ✗ | ✗ | desktop-only strip |
| 2 | Main header (logo + search + icons) | ✓ | ✓ (simpler) | ✓ (simpler) | ✓ (simpler) | mobile variants drop search bar into icon |
| 3 | Sub-header "ANUNCIE AQUI" strip | ✗ | ✗ | ✗ | ✓ | mobile-c only |
| 4 | Leaderboard ad slot (728×90 desktop, 320×50 mobile) | ✓ | ✓ | ✓ (h-24 banner) | ✓ (h-70) | every screen has top ad above the fold |
| 5 | Main nav bar (9 categories + CTA button) | ✓ `bg-primary-container` | ✗ | ✗ | ✓ (scrollable tabs `bg-white` sticky) | desktop full horizontal; mobile-c is tab scroller |
| 6 | Hero article (image + gradient + badge + title + excerpt) | ✓ `aspect-16/9` | ✓ `aspect-4/5` | ✓ `aspect-4/3` | ✓ `aspect-16/9` | universal |
| 7 | 3-col editorial grid (compact cards) | ✓ | ✗ | ✗ | ✗ | desktop only |
| 8 | Secondary list (horizontal text+thumb) | ✗ | ✓ | ✓ | ✓ | mobile-only, always `w-24 h-24` thumbnail right |
| 9 | In-feed 300×250 ad | ✓ | ✓ | ✗ | ✓ | widely present |
| 10 | Sidebar w/ 300×600 ad | ✓ | ✗ | ✗ | ✗ | desktop only |
| 11 | "Mais Lidas" numbered widget | ✓ | ✓ (card-wrapped) | ✗ | ✗ | desktop + mobile-a |
| 12 | Sidebar 300×250 ad | ✓ | ✗ | ✗ | ✗ | desktop |
| 13 | "Últimas" linear link list | ✓ | ✗ | ✗ | ✗ | desktop |
| 14 | Patrocinado card (border-l-4 border-tertiary) | ✗ | ✗ | ✓ | ✗ | mobile-b signature |
| 15 | Guia Comercial tiles (6-col desktop / 2×2 mobile-b / horiz scroll mobile-c) | ✓ 6-col | ✗ | ✓ 2×2 | ✓ horiz scroll | appears 3 times |
| 16 | Agenda Eventos horizontal scroller | ✓ | ✗ | ✗ | ✗ | desktop only |
| 17 | Empregos grid (4+8 desktop, vertical mobile) | ✓ | ✗ | ✗ | ✓ (strip) | desktop + mobile-c |
| 18 | Anuncie pricing — 3 cards | ✓ (grid-cols-3, Prata popular) | ✗ | ✓ (stacked) | ✓ (3 mini chips) | 3 variants |
| 19 | Footer 728×90 ad banner | ✓ | ✗ | ✗ | ✓ (h-70) | desktop + mobile-c |
| 20 | Footer editorial (4-col desktop, centered mobile) | ✓ 4-col | ✓ centered | ✓ centered | ✓ centered (2-col links) | universal |
| 21 | Bottom navbar (fixed, 4-5 items) | ✗ | ✓ 5 items | ✓ 4 items | ✓ 4 items | all mobile variants |

---

## 2. Current Codebase Map

### 2.1 Component Inventory

**Layout & Routing:**
| File | Purpose | 'use client' |
|------|---------|--------------|
| `app/layout.tsx` | Root layout, ThemeProvider, metadata | No |
| `app/globals.css` | Tokens + typography + editorial utility classes (hero-section, article-card, main-grid, footer, etc.) — 642 lines | — |
| `app/(public)/layout.tsx` | Wraps Header + BreakingNewsBanner + children + Footer | No |
| `app/(public)/page.tsx` | Homepage — fetches posts/categories/ads/trending via Prisma, composes HeroSection + MainGrid + CategorySection + Sidebar + BusinessDirectory + AdBanners | No (server) |
| `app/(public)/[slug]/page.tsx` | Post detail | — |
| `app/(public)/categoria/[slug]/page.tsx` | Category list | — |
| `app/(public)/busca/page.tsx` | Search results | — |
| `app/(public)/anunciantes/page.tsx` | Advertiser landing — already structured with stats/plans/formats/testimonials | No (server) |
| `tailwind.config.ts` | Current Tailwind config — OLD palette (`primary: #2563EB`, `accent: #F97316`), Inter font, shadcn HSL tokens | — |

**Header / Nav / Footer:**
| File | Purpose | 'use client' | Status |
|------|---------|--------------|--------|
| `components/public/Header.tsx` | Sticky floating header card, logo, scrollable nav pills, search overlay (SWR-like fetch), mobile drawer, theme toggle, amber CTA pill. 417 lines. Uses inline `style={{}}` heavily, Bebas logo | Yes | FULL REWRITE — structure is completely different from Stitch (no top bar strip, no primary-container nav bar, wrong fonts, floating card not in Stitch) |
| `components/layout/Footer.tsx` | Footer with gradient CTA card + 4-col links + social + copyright. Uses `className="footer"` + inline styles | No | FULL REWRITE — current has gradient CTA card (not in desktop Stitch which has pricing section for that), needs navy `bg-on-surface` + 4-col text layout |
| `components/public/StickyBanner.tsx` | Unknown sticky banner | ? | Probably delete or repurpose |
| `components/news/BreakingNewsBanner.tsx` | Red ticker bar | ? | Not in Stitch — consider removing from layout.tsx or keep as optional row |

**News / Editorial:**
| File | Purpose | 'use client' | Status |
|------|---------|--------------|--------|
| `components/news/HeroSection.tsx` | Full-width hero, uses `.hero-section` CSS class, links to post, CategoryBadge + title + excerpt + byline + time | No | FULL REWRITE — Stitch hero is inside 8/12 grid column, rounded-md, different internal structure |
| `components/news/ArticleCard.tsx` | 4 variants: featured / standard / compact / horizontal. Uses `.article-card` CSS + inline styles | No | REWRITE — Stitch cards are simpler: image + eyebrow + title, no excerpt, no byline on grid cards |
| `components/news/CategoryBadge.tsx` | Small colored badge | No | MINOR — adjust to `bg-tertiary-fixed text-on-tertiary-fixed` style, keep API |
| `components/sections/MainGrid.tsx` | 4-col grid with featured (2x2) + 4 cards + ad injection every 4 | No | REWRITE — Stitch has hero + 3-col grid (different structure), 4-col doesn't match |
| `components/sections/CategorySection.tsx` | Category rows with grid/featured-list layouts | No | REWRITE or DELETE — not explicit in Stitch (Stitch has single hero + grid + sections like Guia/Agenda/Empregos/Pricing) |
| `components/layout/Sidebar.tsx` | Sticky aside with AdSidebarSticky + TrendingWidget + NewsletterWidget + 2nd ad | No | REWRITE — Stitch sidebar has 300×600 ad + Mais Lidas (numbered) + 300×250 ad + Últimas list. NO newsletter widget in desktop sidebar (newsletter is in footer) |

**Widgets:**
| File | Purpose | Status |
|------|---------|--------|
| `components/widgets/TrendingWidget.tsx` | "Mais Lidas" widget, probably numbered list | REWRITE — match Stitch: `border-b-4 border-primary` title, 3 items with italic Newsreader numbers |
| `components/widgets/NewsletterWidget.tsx` | Sidebar newsletter form | MOVE to footer (Stitch only has newsletter in footer col-4) or DELETE from sidebar |

**Ads (`components/ads/`):**
| File | Purpose | Status |
|------|---------|--------|
| `AdBannerTop.tsx` | 970×90 top banner, fetches from `/api/ads?position=GRID_BANNER_TOP` | KEEP LOGIC — restyle wrapper to `bg-surface py-4 flex justify-center w-[728px] h-[90px]` placeholder |
| `AdBannerBottom.tsx` | Bottom 728×90 | KEEP LOGIC — restyle |
| `AdInlineBanner.tsx` | Inline within feed | KEEP LOGIC — restyle to `h-[250px] bg-surface-container border border-outline-variant` |
| `AdSidebarSticky.tsx` | 300×250 rotating sidebar ad | KEEP LOGIC — needs a 300×600 variant AND a 300×250 variant |
| `AdSectionSponsor.tsx` | Section sponsor badge | Re-evaluate — may map to Patrocinado card (mobile-b section 5) |
| `AdSponsoredCard.tsx` | Sponsored post in grid | Re-evaluate |
| `BusinessCard.tsx` + `BusinessDirectory.tsx` | Business directory grid | REWRITE directory grid to match Stitch Guia Comercial (6-col desktop, 2-col mobile, icon + label tiles with `bg-white p-4 h-[120px]`) |

**NEW components needed:**
| Component | Purpose | Replaces |
|-----------|---------|----------|
| `<AdSlot>` (new) | Unified IAB slot component with formats: `leaderboard` (728×90), `rectangle` (300×250), `halfpage` (300×600), `mobileBanner` (320×50 / h-24), `inline` (full h-250) | Wraps existing AdBannerTop/Bottom/Inline/SidebarSticky logic OR replaces them |
| `<TopStrip>` (new) | Desktop top bar with date/weather/social + red pill | — |
| `<CategoryNavBar>` (new) | Desktop sticky `bg-primary-container` nav with 9 categories + amber CTA | Extracted from current Header |
| `<MobileBottomNav>` (new) | Fixed bottom nav for mobile (4-5 items) | — |
| `<GuiaComercialGrid>` (new) | 6-col desktop / 2-col mobile icon tiles | Replaces BusinessDirectory layout |
| `<PricingSection>` (new) | 3-tier pricing (Bronze/Prata popular/Ouro) on navy gradient | New section |
| `<EventsScroller>` (new, optional) | Agenda horizontal scroll cards | New |
| `<JobsSection>` (new, optional) | Empregos 4+8 grid | New |
| `<UltimasList>` (new) | Sidebar "Últimas" linear links with divide-y | New |
| `<MaisLidas>` (new) | Numbered list with italic Newsreader digits | Replaces TrendingWidget |

### 2.2 Data contracts (props already flowing in)

From `app/(public)/page.tsx` Prisma fetch, the components already receive:

**`Post` (`types/index.ts`):**
```ts
{ id, title, slug, summary, content, coverImage, media[], status, featured,
  views, categoryId, category: Category, authorId,
  author: { id, name, avatar }, tags: Tag[], publishedAt, createdAt, updatedAt }
```

**`Category`:** `{ id, name, slug, color, icon, order, active, createdAt }`

**`Ad`:** `{ id, title, type, imageUrl, targetUrl, client, position, frequency, impressions, clicks, active, startsAt, endsAt }`
- `AdPosition` enum includes: `GRID_BANNER`, `GRID_BANNER_TOP`, `GRID_BANNER_BOTTOM`, `SIDEBAR`, `INLINE_BANNER`, `SECTION_SPONSOR`, `BREAKING_BANNER`, `POST_DETAIL`, `ARTICLE_TOP`, `FEED_BETWEEN`, `FEED_TOP`.

**What's available for rendering:**
- Hero: `post.title`, `post.coverImage || post.media[0].url`, `post.category.name/color`, `post.summary`, `post.author.name`, `post.publishedAt` (formatted via `formatRelativeDate`).
- Grid cards: same fields, usually drop excerpt + byline per Stitch.
- Sidebar trending: `post.title`, `post.views` (for "X visualizações"), `post.slug`.
- Sidebar últimas: `post.title`, `post.publishedAt` (HH:MM prefix), `post.slug`.
- Ads: `ad.imageUrl`, `ad.targetUrl`, `ad.title`, impression/click tracking already wired to `/api/ads/:id/impression`, `/api/ads/:id/click`.
- Category color: `post.category.color` (hex string) — currently used by CategoryBadge for dynamic backgrounds. In Stitch, category badges use a uniform `bg-tertiary-fixed` treatment, so category color may become secondary (used as text color `text-primary` instead of background fill).

**Homepage queries (locked, backend-untouched):**
1. `allPosts` — 40 most recent published posts with category/author/tags
2. `categories` — 6 active categories ordered
3. `sponsoredAd` — 1 ad at `GRID_BANNER`
4. `trendingPosts` — 5 most-viewed posts

This is enough for: hero (allPosts[0]), grid (allPosts[1..14]), Mais Lidas sidebar (trendingPosts), Últimas sidebar (allPosts[14..17] by date), and sponsored inline (sponsoredAd). **No new queries required.**

### 2.3 Rewrite / Adjust / Create Matrix

| Target | Action | Reason |
|--------|--------|--------|
| `app/globals.css` | **REWRITE** | Entire token layer is wrong (`--color-brand: #0F4C81`, Sora font, etc). Reduce to minimal base + font variables + a few custom utilities not expressible in Tailwind |
| `tailwind.config.ts` | **REWRITE (extend)** | Add Stitch M3 colors, add `headline`/`body`/`label` fontFamily, remove Inter default |
| `app/layout.tsx` | **ADJUST** | Load `next/font/google` Newsreader + Plus Jakarta Sans, inject CSS vars |
| `app/(public)/layout.tsx` | **ADJUST** | Wrap children with new section structure (TopStrip + Header + CategoryNavBar + main + Footer + MobileBottomNav). Conditional `BreakingNewsBanner` stays if desired, not in Stitch so probably remove |
| `components/public/Header.tsx` | **FULL REWRITE** | Structure completely different (white bar + search bar + separate nav bar). Keep search overlay logic |
| `components/layout/Footer.tsx` | **FULL REWRITE** | Match 4-col Stitch footer, navy `bg-on-surface`, newsletter form |
| `components/news/HeroSection.tsx` | **FULL REWRITE** | Rounded-md, inside grid column, different text hierarchy + "Leia mais →" amber link |
| `components/news/ArticleCard.tsx` | **REWRITE — simplify** | Desktop 3-col grid cards are image + eyebrow + title only. Mobile secondary is image-right + text-left. Drop `featured`/`standard`/`compact`/`horizontal` variants in favor of `hero`, `grid`, `secondary`, `compact` (with-thumbnail) matching Stitch semantics |
| `components/news/CategoryBadge.tsx` | **ADJUST** | Change default style to `bg-tertiary-fixed text-on-tertiary-fixed` uppercase, but keep optional color prop override |
| `components/news/BreakingNewsBanner.tsx` | **DELETE or hide** | Not in Stitch contract |
| `components/sections/MainGrid.tsx` | **REWRITE** | 12-col grid (8 main + 4 sidebar), hero article inside, 3-col sub-grid, inline ad |
| `components/sections/CategorySection.tsx` | **DELETE or repurpose** | Stitch has dedicated sections (Guia/Eventos/Empregos/Pricing), not looped category sections |
| `components/layout/Sidebar.tsx` | **REWRITE** | 4 blocks: 300×600 ad / Mais Lidas / 300×250 ad / Últimas |
| `components/widgets/TrendingWidget.tsx` | **REWRITE** → rename `MaisLidas` | Numbered list with italic Newsreader 01/02/03, `border-b-4 border-primary` title |
| `components/widgets/NewsletterWidget.tsx` | **DELETE from sidebar, MOVE to footer** | Stitch newsletter is in footer col-4 |
| `components/ads/AdBannerTop.tsx` | **ADJUST (shell only)** | Keep fetch + impression logic, restyle wrapper to match 728×90 + dashed placeholder |
| `components/ads/AdBannerBottom.tsx` | **ADJUST** | Same |
| `components/ads/AdInlineBanner.tsx` | **ADJUST** | Same — restyle to 300×250 in-feed |
| `components/ads/AdSidebarSticky.tsx` | **REWRITE** → 2 variants | Need halfpage (300×600) AND rectangle (300×250) |
| `components/ads/AdSectionSponsor.tsx` | **ADJUST** | Repurpose as "Patrocinado" card (mobile-b border-l-4 border-tertiary) |
| `components/ads/AdSponsoredCard.tsx` | **DELETE or repurpose** | Not explicitly in Stitch |
| `components/ads/BusinessDirectory.tsx` | **REWRITE** | Match Stitch Guia Comercial: 6-col desktop, 2-col mobile-b, horizontal scroll mobile-c |
| `components/ads/BusinessCard.tsx` | **REWRITE** | Simple icon + label tile, not complex card |
| **NEW** `components/ads/AdSlot.tsx` | **CREATE** | Unified `<AdSlot format="leaderboard|rectangle|halfpage|mobileBanner|inline" />` + placeholder fallback |
| **NEW** `components/layout/TopStrip.tsx` | **CREATE** | Desktop-only top bar (date/weather/social/red pill) |
| **NEW** `components/layout/CategoryNavBar.tsx` | **CREATE** | Desktop sticky primary-container nav with 9 categories + amber CTA |
| **NEW** `components/layout/MobileBottomNav.tsx` | **CREATE** | Fixed bottom nav for mobile (4 items) |
| **NEW** `components/sections/GuiaComercialSection.tsx` | **CREATE** | 6-col tiles + responsive collapse |
| **NEW** `components/sections/PricingSection.tsx` | **CREATE** | Navy gradient bg + 3 cards (Prata scaled) |
| **NEW** `components/sections/EventsScroller.tsx` | **OPTIONAL** | Horizontal scroller (only if events data exists; if not, omit — not locked in requirements) |
| **NEW** `components/sections/JobsSection.tsx` | **OPTIONAL** | Same — requires jobs data or can use static placeholder |
| **NEW** `components/widgets/UltimasList.tsx` | **CREATE** | Sidebar linear link list with HH:MM prefix, divide-y |
| `app/(public)/anunciantes/page.tsx` | **REWRITE (styling)** | Structure mostly matches (hero, stats, plans, formats, testimonials, CTA) — restyle with new tokens, Newsreader, Tailwind utilities instead of inline styles |

---

## 3. Gap Analysis (Stitch vs Current)

### What's Missing Entirely (need creation)
- **Top-bar strip** (date/weather/social/red pill) — desktop only, zero equivalent
- **Primary-container sticky nav bar** with 9 categories + amber CTA — current header has inline pill nav on white bg, wrong position
- **Mobile fixed bottom navbar** — current has hamburger drawer only
- **Guia Comercial icon tiles** matching Stitch M3 pattern — current BusinessDirectory is different visually
- **Pricing section with 3 tiers** on homepage — currently only in `/anunciantes` page
- **Agenda de Eventos** horizontal scroller — no equivalent
- **Empregos** section — no equivalent (requires content strategy decision — static? future data?)
- **`<AdSlot>` unified component** — current ads are 5 separate components
- **Mais Lidas numbered widget** with italic Newsreader digits (current TrendingWidget unknown exact styling)
- **Últimas sidebar list** with HH:MM prefix
- **Patrocinado card** (mobile-b signature component with `border-l-4 border-tertiary`)
- **Newsletter form in footer** — currently newsletter is a sidebar widget

### Exists but Wrong Structurally (rewrite)
- **Header**: current is a "floating card" with rounded top, single bar, inline nav. Stitch is a 3-row structure: top strip + clean header bar + primary nav. Must split.
- **Footer**: current has amber gradient CTA card + 4 cols. Stitch desktop footer does NOT have the amber CTA (that lives in the pricing section above). Footer is clean 4-col: Brand / Editorial / Institucional / Newsletter.
- **Hero**: current is full-width breakout with `.hero-section` CSS. Stitch hero is inside `col-span-8` of the main grid, rounded-md.
- **MainGrid**: current is 4-col with featured 2×2. Stitch is: `grid-cols-12` (8 main + 4 sidebar), with the 8-col space containing hero + 3-col sub-grid + inline ad.
- **Sidebar**: current has ad + trending + newsletter + ad. Stitch has 300×600 ad + Mais Lidas + 300×250 ad + Últimas. No newsletter.
- **ArticleCard**: current has 4 variants with excerpt + byline. Stitch grid cards are minimal (image + eyebrow + title, nothing else).
- **BusinessDirectory**: current uses `.business-grid` 6-col but different card styling and hover.
- **Typography**: current uses Sora (body) + Newsreader (headlines) + Bebas (logo). Stitch uses Plus Jakarta Sans (body) + Newsreader (headlines). Drop Sora and Bebas.
- **Token layer**: current CSS vars (`--color-brand: #0F4C81`) are not aligned with Stitch M3 naming (primary/primary-container/on-surface/etc).

### Only Needs Token Swap (minor)
- `CategoryBadge.tsx` — keep API, change default styling classes
- `AdBannerTop/Bottom/Inline` — keep fetch logic, restyle wrapper divs
- `/anunciantes` page structure already matches Stitch intent (hero + stats + plans + formats + testimonials) — restyle only
- `BreakingNewsBanner` — just delete from layout (or keep hidden)

---

## 4. Recommended Plan Breakdown

### Plan 01-01 — Tokens, Tipografia e globals.css (foundation)

**Goal:** Establish the new visual system at the token/font/base level so subsequent plans can use Tailwind utilities directly.

**Files to touch:**
- `tailwind.config.ts` — extend with Stitch M3 colors, fontFamily (headline/body/label), borderRadius, keep existing shadcn HSL mapping for dark mode
- `app/globals.css` — REWRITE:
  - Delete all old `--color-brand*` / `--color-accent*` / `--color-breaking` / custom CSS vars from the paleta editorial
  - Delete `.hero-section`, `.hero-overlay`, `.hero-title`, `.breaking-banner`, `.article-card`, `.main-grid`, `.home-layout`, `.business-grid`, `.widget`, `.section-header`, `.section-title`, `.nav-pill`, `.page-layout`, `.container-editorial`, `.footer` custom classes (replaced by Tailwind utilities in new components)
  - Keep minimal base layer: font-family, body bg, h1-h6 defaults, scroll-behavior, selection styles
  - Keep/recalibrate shadcn HSL tokens (`--primary`, `--background`, etc) to match new palette for dark mode support
  - Keep `.hide-scrollbar`, `.article-body` (post detail typography) utilities
  - Add a single `.scrollbar-hide` helper if not in Tailwind
- `app/layout.tsx` — load Newsreader + Plus Jakarta Sans via `next/font/google`, attach variables to `<html>` or `<body>`, add Material Symbols fallback if any component still references them OR plan icon migration to lucide

**Key decisions already made:**
- Palette: from §1.5 — exact values, do not deviate
- Fonts: Newsreader + Plus Jakarta Sans only (Bebas Neue, Sora, DM Serif Display, DM Sans REMOVED)
- Logo font: Newsreader (italic bold, matches mobile-b `font-newsreader italic` and desktop `font-black font-headline tracking-tighter`)
- Dark mode: keep `.dark` class strategy, map shadcn HSL vars to dark equivalents of primary (`#00355f` → lighter variant)
- Border radius scale: DEFAULT 0.125 / lg 0.25 / xl 0.5 / full 0.75rem (Stitch M3 scale)
- Do NOT introduce CSS-in-JS. Tailwind utilities preferred. `style={{}}` inline allowed only for dynamic values (e.g., `post.category.color` where still used).

### Plan 01-02 — Header + Footer (shell layout)

**Goal:** Rebuild the chrome — top strip, header, category nav bar, footer, mobile bottom nav — so all pages get the new shell.

**Files to touch:**
- `components/layout/TopStrip.tsx` — NEW (desktop-only, hidden on mobile via `hidden md:flex`)
- `components/public/Header.tsx` — REWRITE (white bar, logo + search bar + person/menu icons, `bg-white h-[80px] max-w-[1200px]`). Keep existing search overlay logic and theme toggle; move them into new structure. Drop Bebas logo, use Newsreader.
- `components/layout/CategoryNavBar.tsx` — NEW (sticky `bg-primary-container`, 9 categories, amber CTA button, hides on mobile where `MobileBottomNav` takes over)
- `components/layout/MobileBottomNav.tsx` — NEW (fixed bottom, 4 items, `md:hidden`)
- `components/layout/Footer.tsx` — REWRITE (`bg-on-surface text-surface`, 4-col grid, brand/editorial/institucional/newsletter, bottom bar with copyright)
- `components/news/BreakingNewsBanner.tsx` — DELETE or set return null
- `app/(public)/layout.tsx` — compose: `<TopStrip /> <Header /> <CategoryNavBar /> <main>{children}</main> <Footer /> <MobileBottomNav />`

**Key decisions already made:**
- Top strip shows current date in pt-BR + city, weather placeholder (static "28°C sunny" or TODO flag), social icons, red `ANUNCIE AQUI` pill linking to `/anunciantes`
- Header search uses the existing client-side search hook (`useSearch`) → do not refactor the fetch logic
- Amber CTA in nav bar: `bg-tertiary-fixed text-on-tertiary-fixed px-4 py-2 rounded-sm` = `ANUNCIE AQUI`, links to `/anunciantes`
- Mobile header: use mobile-b pattern (menu / italic Newsreader brand / "Anuncie" button) since mobile-b is primary
- Mobile bottom nav items: Notícias (home), Turismo, Guia, Empregos (from mobile-b)
- Footer newsletter form: use existing POST endpoint if any, else static form with `action="#"` and mailto fallback (decide based on codebase scan)
- Icon mapping: use lucide-react equivalents
  - `menu` → `Menu`
  - `search` → `Search`
  - `person` → `User`
  - `sunny` → `Sun`
  - `public` → `Globe`
  - `share` → `Share2`
  - `mail` → `Mail`
  - `send` → `Send`
  - `restaurant` → `UtensilsCrossed`
  - `hotel` → `Hotel` / `Bed`
  - `shopping_bag` → `ShoppingBag`
  - `local_hospital` → `Cross` / `HeartPulse`
  - `build` → `Wrench`
  - `add_circle` → `PlusCircle`
  - `arrow_forward` → `ArrowRight`
  - `explore` → `Compass`
  - `newspaper` → `Newspaper`
  - `work` → `Briefcase`
  - `home` → `Home`

### Plan 01-03 — Homepage (hero + grid + sidebar + sections)

**Goal:** Rebuild `app/(public)/page.tsx` and all section components to mirror the desktop Stitch main content + mobile-b fallback.

**Files to touch:**
- `app/(public)/page.tsx` — REWRITE JSX composition (keep `getHomeData` server fetch unchanged). New composition:
  1. `<AdSlot format="leaderboard" position="GRID_BANNER_TOP" />`
  2. `<main class="max-w-[1200px] mx-auto py-10 grid grid-cols-12 gap-8">`:
     - LEFT `col-span-8 space-y-10`: `<HeroArticle post={hero} />` + `<NewsGrid3 posts={mainGridPosts.slice(0,3)} />` + `<AdSlot format="rectangle" position="INLINE_BANNER" />` + optionally more sections
     - RIGHT `col-span-4 space-y-12`: `<Sidebar trendingPosts={trending} latestPosts={allPosts.slice(0,3)} />`
  3. `<GuiaComercialSection />` — full-width `bg-surface-container py-16`
  4. (optional) `<EventsScroller />` — depends on data availability
  5. (optional) `<JobsSection />` — depends on data availability
  6. `<PricingSection />` — full-width navy gradient (homepage variant, simpler than `/anunciantes`)
  7. `<AdSlot format="leaderboard" position="GRID_BANNER_BOTTOM" />`
- `components/news/HeroSection.tsx` — REWRITE as `HeroArticle` (inline within grid, rounded-md, not full-width)
- `components/news/ArticleCard.tsx` — SIMPLIFY (variants: `grid` = image + eyebrow + title; `secondary` = flex horizontal w/ thumb-right; `compact` = small thumb + title)
- `components/sections/MainGrid.tsx` — DELETE or REWRITE as `NewsGrid3` (pure 3-col grid)
- `components/sections/CategorySection.tsx` — DELETE (not in Stitch)
- `components/layout/Sidebar.tsx` — REWRITE (4 blocks in order: halfpage ad → MaisLidas → rectangle ad → UltimasList)
- `components/widgets/TrendingWidget.tsx` → rename to `MaisLidas.tsx`, REWRITE
- `components/widgets/UltimasList.tsx` — NEW
- `components/widgets/NewsletterWidget.tsx` — DELETE (newsletter lives in footer now)
- `components/sections/GuiaComercialSection.tsx` — NEW
- `components/sections/PricingSection.tsx` — NEW (homepage variant — can be reused on `/anunciantes`)

**Key decisions already made:**
- Grid card count: hero (1) + 3-col grid × 1 row (3) = 4 posts above the fold on desktop. Keeps content density aligned with Stitch.
- NO excerpt or byline on grid cards (ultra clean Stitch style)
- Sidebar data split: `trendingPosts` → Mais Lidas (5 items, display top 3); `allPosts.slice(14,17)` or a dedicated "latest" slice → Últimas (3 items with HH:MM prefix from `publishedAt`)
- Mobile breakpoint: `lg:grid-cols-12` on desktop, `grid-cols-1` on mobile. Sidebar stacks below main on mobile. Hide sidebar ads entirely on mobile (mobile already has inline ads).
- Guia Comercial: on desktop `grid-cols-6`, on mobile-b match `grid-cols-2 aspect-square` tiles. Responsive via `grid-cols-2 md:grid-cols-6`.
- Pricing on homepage: same 3 cards as `/anunciantes` but navy gradient section, scaled-down. Reuse `<PricingSection>` component with a `variant="home" | "landing"` prop.
- Events/Jobs sections: SKIP unless data model supports them. Static content is acceptable as placeholder — planner decides.

### Plan 01-04 — /anunciantes + AdSlot component + slots publicitários

**Goal:** Build the unified `<AdSlot>` component, place slots everywhere, and rebuild the `/anunciantes` landing.

**Files to touch:**
- `components/ads/AdSlot.tsx` — NEW unified component:
  ```tsx
  <AdSlot
    format="leaderboard" | "rectangle" | "halfpage" | "mobileBanner" | "inline"
    position={AdPosition}  // fetches from /api/ads?position=
    placeholder?: { phone?: string; message?: string }
  />
  ```
  Handles fetch + impression + click tracking (move logic from AdBannerTop) OR wraps existing fetchers. Renders dashed placeholder when no ad.
- `components/ads/AdBannerTop.tsx` — refactor to use `<AdSlot format="leaderboard" position="GRID_BANNER_TOP" />` OR delete and replace all usages
- `components/ads/AdBannerBottom.tsx` — same
- `components/ads/AdInlineBanner.tsx` — same
- `components/ads/AdSidebarSticky.tsx` — refactor into two: `<AdSlot format="halfpage">` and `<AdSlot format="rectangle">`
- `components/ads/AdSectionSponsor.tsx` — repurpose as `<PatrocinadoCard>` (mobile-b signature)
- `components/ads/AdSponsoredCard.tsx` — DELETE if unused
- `app/(public)/anunciantes/page.tsx` — REWRITE styling (keep structure):
  - Hero editorial with badge, headline Newsreader, dual CTAs
  - Stats bar (Users/Eye/MapPin/TrendingUp) — restyle to match
  - 3 pricing tiers (Bronze/Prata popular/Ouro) — use shared `<PricingSection>` from Plan 01-03 with `variant="landing"` (full-width navy gradient)
  - 6 ad format tiles
  - Testimonials block
  - Final CTA in brand gradient

**Key decisions already made:**
- `AdSlot` placeholder format: dashed `border-2 border-dashed border-outline-variant` box with `bg-surface-container` or `bg-[#EEEEEE]`, absolute `PUBLICIDADE` label top-left `bg-tertiary-fixed text-on-tertiary-fixed text-[8px] font-bold`, center text `[ {W}x{H} — Espaço disponível: (45) 99999-9999 ]` in `text-outline italic font-label`
- Slot dimensions per format:
  - `leaderboard`: `w-[728px] h-[90px]` (desktop) / `h-[90px] max-w-full` (mobile fallback)
  - `rectangle`: `w-[300px] h-[250px]`
  - `halfpage`: `w-[300px] h-[600px]`
  - `mobileBanner`: `w-full h-[90px]` or `h-24` (mobile-b uses h-24)
  - `inline`: `w-full h-[250px]` (in-feed full-width)
- Slot placement:
  - Desktop home: `leaderboard` (top), `halfpage` (sidebar top), `rectangle` (inline in grid), `rectangle` (sidebar bottom), `leaderboard` (bottom)
  - Mobile home: `mobileBanner` (top, h-24), `rectangle` (inline mid), `mobileBanner` (bottom)
- `/anunciantes` does NOT show ad placeholders (it IS the ad sales page)
- Impression/click tracking logic: move to `AdSlot` once, reuse everywhere. Keep endpoint shape (`/api/ads?position=`, `/api/ads/:id/impression`, `/api/ads/:id/click`) unchanged.

---

## 5. Risks & Open Questions

### Risks
1. **Build breaks from deleted CSS classes.** Many pages (`/[slug]`, `/categoria/[slug]`, `/busca`) use `.container-editorial`, `.article-card`, `.section-header`, `.hero-section`, etc. — Plan 01-01 deletes those. Mitigation: (a) keep `.article-body` for post detail, (b) add a shim layer of new utility aliases in `globals.css`, OR (c) plan 01-03/01-04 must also touch category/post/search pages to remove class usage. **Planner must scan `/app/(public)/[slug]`, `/categoria/[slug]`, `/busca` during plan 01-01 and decide migration path.**
2. **Dark mode regression.** Shadcn HSL vars are tuned to old `#0F4C81` primary. Plan 01-01 must recalibrate all dark-mode HSL triplets to match new palette, or dark mode will look inconsistent. REQ-TOK-04 + REQ-RES-02.
3. **Vercel-only verification.** No local dev possible (Prisma needs `DATABASE_URL`). Build failures will only surface on Vercel preview → slow feedback loop. Plans should target `npm run build` passing locally (compile-only, will fail at runtime but succeed at build) before push.
4. **Hardcoded nav categories.** Desktop nav has 9 fixed labels (HOME/NOTÍCIAS/TURISMO/ECONOMIA/POLÍTICA/ESPORTES/GUIA COMERCIAL/EMPREGOS/IMÓVEIS). Current Header has 9 slightly different labels (Início/Cidade/Política/Esportes/Economia/Turismo/Saúde/Cultura/Segurança). **Decision needed:** adopt Stitch labels verbatim (and create missing categories in DB?) or keep current labels? → Recommend keeping current DB slug labels but visually matching Stitch styling, since categories are data-driven.
5. **Material Symbols → lucide-react mapping.** Some Stitch icons have no clean lucide equivalent (`social_leaderboard` ≈ Facebook? `campaign` ≈ Megaphone, `add_circle` ≈ PlusCircle). Planner must do 1:1 mapping per call site. Listed in Plan 01-02.
6. **Events / Jobs sections data.** Stitch shows these on desktop. No data model exists in Prisma schema (out of scope). Decision: render as **static content** or **omit entirely**. Requirements list doesn't mention them (only HOME-04 Guia Comercial and HOME-05 Pricing are locked). Recommend OMITTING events/jobs on homepage — not locked in REQUIREMENTS.md.
7. **Inline styles vs Tailwind.** Current codebase uses `style={{}}` everywhere. Migrating to Tailwind classes touches every line of every component. Time risk. Recommend: full migration where rewriting (new components) but leave `style={{}}` in adjacent unchanged code (e.g., post detail body).
8. **AdSlot refactor scope.** If `AdSlot` unifies all 5 existing ad components, all pages that import AdBannerTop/Bottom/Inline/SidebarSticky need updates. Scope check: home, category, post detail, search. Plan 01-04 must sweep all imports.
9. **"Anuncie aqui" accessibility.** The Stitch amber pill has low contrast (`#f5ac00` background with dark text). Verify WCAG AA compliance; if fail, tweak to `bg-tertiary-fixed` (`#ffdeac`) with `text-on-tertiary-fixed` (`#604100`) which has better contrast and is actually what Stitch uses in the nav bar.

### Open Questions
1. **Q:** Does the current `/api/ads` endpoint return an array or a single ad when filtered by `position`? → Scan during Plan 01-04. Affects `AdSlot` fetch shape.
2. **Q:** Are there existing site settings (logo, tagline, social handles) in DB for `SiteConfig`? → Current Header fetches `/api/admin/settings` for logo. Check if footer should also pull dynamic social links from there.
3. **Q:** Nav bar has `IMÓVEIS` and `EMPREGOS` in Stitch — do corresponding categories exist in DB? If not, either (a) create as empty categories, (b) link to placeholder pages, or (c) drop from nav. → Planner decides in Plan 01-02.
4. **Q:** Should the top bar date be dynamic (via `Date` on server) or static (hardcoded)? → Recommend dynamic using `date-fns` with pt-BR locale (`date-fns` already in dependencies).
5. **Q:** Weather widget in top-bar: real API or static? → Recommend static `"28°C"` with Sun icon as placeholder (not in requirements as data feature).
6. **Q:** BreakingNewsBanner — delete or keep as conditional (if `featured` posts exist with urgent flag)? → Recommend DELETE for fidelity to Stitch. Not in requirements.
7. **Q:** Pricing card values — Stitch shows R$ 290 / R$ 590 / R$ 1.290 (desktop) and R$ 299 / R$ 699 / R$ 1.499 (mobile-b/c). Current `/anunciantes/page.tsx` uses R$ 299 / R$ 699 / R$ 1.999. → Keep current `/anunciantes` values (they're real business data); align homepage pricing section with the same values.

---

## Sources

**Primary (HIGH confidence — read directly):**
- `.planning/research/stitch/desktop.html` (lines 1-486) — complete desktop layout + tailwind.config M3 palette
- `.planning/research/stitch/mobile-a.html` (lines 1-252) — mobile variant A
- `.planning/research/stitch/mobile-b.html` (lines 1-256) — mobile variant B (PRIMARY)
- `.planning/research/stitch/mobile-c.html` (lines 1-338) — mobile variant C
- `app/globals.css` (642 lines) — current token layer to be replaced
- `tailwind.config.ts` — current Tailwind config
- `app/layout.tsx`, `app/(public)/layout.tsx`, `app/(public)/page.tsx`, `app/(public)/anunciantes/page.tsx`
- `components/public/Header.tsx`, `components/layout/Footer.tsx`, `components/layout/Sidebar.tsx`
- `components/news/HeroSection.tsx`, `components/news/ArticleCard.tsx`
- `components/sections/MainGrid.tsx`
- `components/ads/AdBannerTop.tsx`, `components/ads/AdSidebarSticky.tsx`
- `types/index.ts` — Post/Ad/Category contracts
- `package.json` — dependency inventory
- `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, `.planning/phases/01-redesign-ui-completo/01-CONTEXT.md`
- `.planning/config.json` — `nyquist_validation: false` → Validation Architecture section intentionally omitted

**Secondary:** none — this is a fidelity rebuild; authoritative source is the Stitch HTMLs on disk, no web research needed.

## Metadata

**Confidence breakdown:**
- Stitch contract extraction: HIGH — every section/class/token mapped from actual HTML
- Current codebase inventory: HIGH — every target file read or globbed
- Token palette: HIGH — copied verbatim from `desktop.html` `tailwind.config` script block
- Typography scale: HIGH — extracted from actual Stitch classes
- Data contracts: HIGH — `types/index.ts` + `app/(public)/page.tsx` fetch confirmed
- Plan breakdown: HIGH — aligns with locked 4-plan split from CONTEXT.md
- Risks/open questions: MEDIUM — some depend on DB state (categories, site config) not inspected here; planner should resolve during plan phase

**Research date:** 2026-04-05
**Valid until:** 2026-05-05 (30 days — stable fidelity rebuild, Stitch contract is frozen)
