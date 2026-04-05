# Roadmap: Foz em Foco — Redesign UI v2

## Overview

Redesign 100% de UI/layout do portal público `foz-foco.vercel.app`, espelhando fielmente o contrato visual do projeto Stitch `8140760864745957946` (1 desktop + 3 variantes mobile). Backend Next.js 15 + Prisma + Supabase permanece intacto. Um único phase coarse cobre tudo: tokens, tipografia, header, footer, home, landing /anunciantes, slots publicitários. Verificação é visual (Vercel preview + produção).

## Phases

- [ ] **Phase 1: Redesign UI completo** — Reescrever globals.css e componentes públicos espelhando o Stitch (contrato visual único)

## Phase Details

### Phase 1: Redesign UI completo
**Goal**: Transformar a UI pública de `foz-foco.vercel.app` em uma reprodução fiel do Stitch `8140760864745957946` (tokens, tipografia, layout, slots comerciais), com backend intacto e build Vercel READY.
**Depends on**: Nothing (first phase)
**Requirements**: TOK-01, TOK-02, TOK-03, TOK-04, HDR-01, HDR-02, HDR-03, HDR-04, HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, HOME-06, HOME-07, HOME-08, FTR-01, FTR-02, ADS-01, ADS-02, ADS-03, ANUN-01, ANUN-02, ANUN-03, ANUN-04, ANUN-05, ANUN-06, ANUN-07, RES-01, RES-02, RES-03, BUILD-01, BUILD-02, BUILD-03
**Success Criteria** (what must be TRUE):
  1. Usuário abre `foz-foco.vercel.app` no desktop e vê hero + grid + sidebar + footer estruturalmente idênticos ao Stitch desktop
  2. Usuário abre o site no mobile e vê feed + seções comerciais + CTA "Anuncie aqui" correspondendo a uma das 3 variantes mobile Stitch
  3. Paleta (primary `#00355f`, accent `#f5ac00`, secondary `#bc0004`, surface `#fcf8ff`) e tipografia (Newsreader + Plus Jakarta Sans) são visíveis e consistentes em todas as telas
  4. Slots publicitários IAB aparecem em posições visíveis (topo, sidebar, inline, footer) sem precisar scroll profundo
  5. Landing `/anunciantes` alinha visualmente com o resto do site e apresenta 3 tiers de pricing, stats bar, formatos e depoimentos
  6. Dark mode funciona e build Vercel fica READY sem erros novos
**Plans**: 4 plans (tokens/tipografia, header+footer, home, landing-anunciantes+ads)

Plans:
- [ ] 01-01: Tokens, tipografia e globals.css — base do sistema visual extraída do Stitch
- [ ] 01-02: Header + Footer — reescrita estrutural espelhando desktop + mobile Stitch
- [ ] 01-03: Homepage — hero, grid, sidebar, seções comerciais, variantes mobile
- [ ] 01-04: /anunciantes + componente AdSlot + slots publicitários nas páginas

## Progress

**Execution Order:**
Phases execute in numeric order: 1

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Redesign UI completo | 0/4 | Not started | - |
