# Phase 1: Redesign UI completo — Context

**Gathered:** 2026-04-05
**Status:** Ready for planning
**Source:** Direct brief from user + Stitch project contract

<domain>
## Phase Boundary

Reescrever 100% da UI pública de `foz-foco.vercel.app` espelhando fielmente o projeto Stitch `8140760864745957946` (1 desktop + 3 mobile). Backend Next.js 15 + Prisma + Supabase intocado. O commit anterior b4a69e3 (que apenas trocou tokens CSS) foi rejeitado pelo usuário como superficial — esta fase exige reescrita estrutural dos componentes.

**Scope includes:**
- `app/globals.css` (tokens, tipografia, classes utilitárias editoriais)
- `app/(public)/**` (layouts e páginas públicas)
- `components/layout/*`, `components/public/*`
- `components/news/*`, `components/sections/*`, `components/ads/*`, `components/widgets/*`
- `/anunciantes` landing page
- Componente novo `<AdSlot>` para espaços IAB

**Scope excludes:**
- Schema Prisma, migrações Supabase, APIs server
- `app/admin/**` (telas administrativas)
- Autenticação, CMS Tiptap, busca lógica
- Novas features funcionais (newsletter popup, comentários, etc)

</domain>

<decisions>
## Implementation Decisions

### Design Tokens (locked — extraídos direto do Stitch desktop.html)
- Primary: `#00355f`
- Primary container: `#0f4c81`
- Secondary: `#bc0004`
- Tertiary/Accent: `#f5ac00` (on-tertiary-container no Stitch)
- Tertiary fixed: `#ffdeac`
- Surface / background: `#fcf8ff`
- Surface container: `#efecff`
- Surface container high: `#e8e5ff`
- On-surface / on-background: `#1a1a2e`
- Outline: `#727780`
- Outline variant: `#c2c7d1`
- Error: `#ba1a1a`
- Dark mode: manter tokens HSL equivalentes via next-themes (shadcn/ui)

### Tipografia (locked — do Stitch)
- Headline font: **Newsreader** (serif)
- Body/label font: **Plus Jakarta Sans** (sans)
- Bebas Neue: descartar ou manter só como opcional no logo (decisão do planner)
- Sora / DM Serif Display / DM Sans: **remover** — não estão no Stitch
- Carregar via `next/font/google` para performance

### Stack & bibliotecas (locked)
- Next.js 15 App Router + React 19 — não trocar
- Tailwind 3.4 + shadcn/ui Radix — manter
- lucide-react para ícones — manter (Stitch usa Material Symbols; substituir pelos equivalentes lucide mais próximos)
- next-themes para dark mode — manter
- framer-motion: usar apenas se o componente já usa; não introduzir novo

### Fonte de verdade visual (locked)
- `.planning/research/stitch/desktop.html` — layout desktop completo
- `.planning/research/stitch/mobile-a.html` — variante mobile A
- `.planning/research/stitch/mobile-b.html` — variante mobile B
- `.planning/research/stitch/mobile-c.html` — variante mobile C
- Planner e executor **devem abrir esses HTMLs** e extrair estrutura real (tags, classes Tailwind, spacing, componentes) — não improvisar

### Estratégia de rollout (locked)
- Um único phase, 4 plans (tokens → layout → home → anunciantes+ads)
- Plans atômicos, um commit por plan
- Verificação visual via Vercel preview (sem local dev, Prisma precisa DATABASE_URL)
- Build `npm run build` deve passar localmente antes de cada commit se viável, caso contrário via Vercel

### Mobile strategy (locked)
- Das 3 variantes mobile Stitch, usar **mobile-b** como base principal (é a mais completa: feed + Guia Comercial + Anuncie + footer)
- mobile-a e mobile-c servem como referência para seções alternativas que aparecerem em outras rotas

### Claude's Discretion
- Nomes exatos de arquivos/componentes criados ou renomeados
- Estrutura interna de CSS (utility vs component classes)
- Como quebrar cada plan em tasks menores
- Qual ícone lucide-react mapeia qual Material Symbol
- Responsive breakpoints exatos (dentro de mobile-first padrão Tailwind)
- Se usar CSS-in-JS inline (padrão atual) ou migrar para Tailwind classes (preferível onde simplificar)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design contract (Stitch HTMLs)
- `.planning/research/stitch/desktop.html` — 2560×9890 desktop layout completo (1 tela única com todas as seções)
- `.planning/research/stitch/mobile-a.html` — 780×4608 variante mobile A (hero + secundárias + "Mais Notícias" + Anuncie)
- `.planning/research/stitch/mobile-b.html` — 780×5560 variante mobile B (feed + Guia Comercial + pricing + footer) — **base principal mobile**
- `.planning/research/stitch/mobile-c.html` — 780×5056 variante mobile C (hero + latest + most read)

### Project documents
- `.planning/PROJECT.md` — contexto do produto e core value
- `.planning/REQUIREMENTS.md` — 30 requisitos v1 mapeados a esta fase
- `.planning/ROADMAP.md` — Phase 1 overview e success criteria

### Codebase entry points
- `app/globals.css` — tokens atuais (serão reescritos)
- `app/(public)/layout.tsx` — layout público
- `app/(public)/page.tsx` — homepage (se existir, caso contrário `app/page.tsx`)
- `app/(public)/anunciantes/page.tsx` — landing anunciantes (já editada, reescrever)
- `components/layout/Footer.tsx`
- `components/public/Header.tsx`
- `components/news/*`, `components/sections/*`, `components/widgets/*`, `components/ads/*`
- `tailwind.config.ts` — extender com tokens novos
- `package.json` — deps disponíveis

</canonical_refs>

<specifics>
## Specific Ideas

- O usuário rejeitou explicitamente a abordagem anterior de só trocar tokens. **A estrutura HTML/JSX PRECISA mudar** — novos wrappers, novas sections, novo grid.
- A palavra-chave é "espelhar": abrir o Stitch HTML, ver como é a hierarquia de divs e classes Tailwind, e reproduzir a mesma hierarquia nos componentes React.
- Slots publicitários devem ser visíveis sem scroll (at-least uma unidade acima da dobra no desktop e no mobile).
- CTA "Anuncie aqui" do header e CTA do footer usam o accent `#f5ac00` sobre navy `#1a1a2e` para contraste forte.
- Landing `/anunciantes` é a vitrine comercial — dar peso editorial alto (hero Newsreader grande, stats, 3 tiers visíveis acima da dobra no desktop).
- Dark mode não pode ser deixado para trás — testar tokens HSL no final.

</specifics>

<deferred>
## Deferred Ideas

- Redesign de páginas `/admin/*` (fora de escopo)
- Novos features de engajamento (comentários, newsletter, push)
- Testes unitários de componentes (verificação é visual via Vercel)
- Otimização de Core Web Vitals (fora do escopo imediato)
- A/B testing dos 3 layouts mobile (usar mobile-b como principal agora)

</deferred>

---

*Phase: 01-redesign-ui-completo*
*Context gathered: 2026-04-05 via direct brief + Stitch contract*
