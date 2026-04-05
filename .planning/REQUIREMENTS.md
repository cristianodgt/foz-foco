# Requirements: Foz em Foco — Redesign UI v2

**Defined:** 2026-04-05
**Core Value:** Portal que parece jornal profissional local E vende publicidade — hierarquia editorial + slots de anúncio visíveis + CTA "Anuncie aqui" sempre acessível.

## v1 Requirements

Escopo único: redesign UI/layout fiel ao Stitch `8140760864745957946`. Backend intacto.

### Design Tokens & Tipografia

- [ ] **TOK-01**: `app/globals.css` usa paleta extraída do Stitch (primary `#00355f`, primary-container `#0f4c81`, secondary `#bc0004`, tertiary/accent `#f5ac00`, surface `#fcf8ff`, on-surface `#1a1a2e`)
- [ ] **TOK-02**: Tipografia carrega Newsreader (headlines) + Plus Jakarta Sans (body) via `next/font` ou `@import`, substituindo Sora/DM-* atuais
- [ ] **TOK-03**: Variáveis CSS (`--color-brand`, `--color-accent`, `--font-serif`, `--font-sans`) refletem os tokens novos e são consumidas pelos componentes
- [ ] **TOK-04**: Dark mode mantido funcional com tokens HSL equivalentes (shadcn/ui tokens alinhados)

### Header (Desktop + Mobile)

- [ ] **HDR-01**: Header sticky com logo "FOZ EM FOCO" (Newsreader ou Bebas), nav de categorias, ações (busca, tema, CTA "Anuncie aqui") espelhando o Stitch desktop
- [ ] **HDR-02**: Menu mobile estrutural conforme variantes Stitch mobile (hamburger + drawer/overlay)
- [ ] **HDR-03**: CTA "Anuncie aqui" visível e destacado em accent color `#f5ac00`
- [ ] **HDR-04**: Busca overlay funcional integrada ao design novo

### Homepage

- [ ] **HOME-01**: Hero principal com imagem dominante + título Newsreader grande + matéria destaque — estrutura do Stitch desktop
- [ ] **HOME-02**: Grid de notícias 3 colunas (desktop) / 1 coluna (mobile) com cards editoriais (Newsreader title, meta info)
- [ ] **HOME-03**: Sidebar desktop com slot publicitário 300×250 + widget "Mais Lidas"
- [ ] **HOME-04**: Seção "Guia Comercial" em tiles (quando aplicável conforme Stitch)
- [ ] **HOME-05**: Seção "Anuncie no Foz em Foco" com 3 planos de pricing como aparece no Stitch
- [ ] **HOME-06**: Variante mobile A: hero + secundárias + "Mais Notícias" + CTA Anuncie
- [ ] **HOME-07**: Variante mobile B: feed + Guia Comercial em grid + pricing lado a lado
- [ ] **HOME-08**: Variante mobile C: hero + latest + most read + footer

### Footer

- [ ] **FTR-01**: Footer navy `#1a1a2e` com bloco CTA publicidade em accent, logo, colunas editorias/institucional, redes sociais, bottom bar
- [ ] **FTR-02**: Footer espelha estrutura 3 colunas do Stitch desktop e colapsa para 1 coluna mobile

### Slots Publicitários

- [ ] **ADS-01**: Componente `<AdSlot>` com formatos IAB (leaderboard 728×90, rectangle 300×250, mobile banner 320×50, inline card)
- [ ] **ADS-02**: Slots visíveis em home desktop (topo + sidebar + inline), home mobile (banner topo + inline + footer)
- [ ] **ADS-03**: Slot placeholder visual para espaços não vendidos (não imagem broken)

### Landing /anunciantes

- [ ] **ANUN-01**: Hero editorial com badge, headline Newsreader, CTAs duplos
- [ ] **ANUN-02**: Stats bar (leitores, pageviews, % local, tempo médio)
- [ ] **ANUN-03**: 3 tiers de pricing (Bronze/Prata/Ouro) com tier "popular" destacado
- [ ] **ANUN-04**: Grid de 6 formatos de anúncio
- [ ] **ANUN-05**: Bloco de depoimentos
- [ ] **ANUN-06**: CTA final em gradient brand
- [ ] **ANUN-07**: Alinhamento visual total com home (mesma paleta, tipografia, spacing)

### Responsividade & Dark Mode

- [ ] **RES-01**: Breakpoints respeitam mobile-first (375px, 768px, 1024px, 1280px)
- [ ] **RES-02**: Todos os componentes redesenhados funcionam em dark mode
- [ ] **RES-03**: Nenhuma regressão em páginas de categoria (`/categoria/[slug]`) e post (`/[slug]`)

### Build & Deploy

- [ ] **BUILD-01**: `npm run build` passa sem erros/warnings novos
- [ ] **BUILD-02**: Deploy Vercel `foz-foco.vercel.app` fica READY após merge
- [ ] **BUILD-03**: Páginas administrativas (`/admin/*`) permanecem intocadas e funcionais

## v2 Requirements

(vazio — tudo é v1)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Schema Prisma / migrações Supabase | Backend intocado, só UI |
| Novas APIs ou rotas server | Fora de escopo |
| Redesign de `/admin/*` | Foco é UI pública |
| Newsletter popup / comentários / SEO extra | Não pedido |
| Testes unitários de componentes | Verificação é visual (Vercel preview) |
| Animações pesadas (framer-motion) | Só transições já existentes |
| Trocar biblioteca de ícones | `lucide-react` já em uso |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| TOK-01 a TOK-04 | Phase 1 | Pending |
| HDR-01 a HDR-04 | Phase 1 | Pending |
| HOME-01 a HOME-08 | Phase 1 | Pending |
| FTR-01 a FTR-02 | Phase 1 | Pending |
| ADS-01 a ADS-03 | Phase 1 | Pending |
| ANUN-01 a ANUN-07 | Phase 1 | Pending |
| RES-01 a RES-03 | Phase 1 | Pending |
| BUILD-01 a BUILD-03 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 30 total
- Mapped to phases: 30
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-05*
*Last updated: 2026-04-05 after initial definition*
