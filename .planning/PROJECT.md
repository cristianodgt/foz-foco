# Foz em Foco — Redesign UI v2

## What This Is

Portal de notícias local de Foz do Iguaçu monetizado por venda de espaço publicitário (modelo Portal da Cidade). Notícias atraem tráfego, publicidade gera receita. O produto atual (foz-foco.vercel.app) tem stack Next.js 15 + Prisma + Supabase funcional, mas a camada de UI não reflete o posicionamento editorial/comercial esperado. Este trabalho é um **redesign completo de UI/layout** mantendo backend intacto.

## Core Value

Um portal que parece jornal profissional local E vende publicidade — hierarquia editorial forte + slots de anúncio visíveis em todas as telas + CTA "Anuncie aqui" sempre acessível.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

(Backend funcional já em produção — Next.js 15, Prisma, Supabase, admin, CMS Tiptap, busca, temas. Não é tocado.)

### Active

- [ ] Redesign 100% fiel ao contrato visual Stitch `8140760864745957946` (1 desktop + 3 mobile)
- [ ] Design tokens extraídos do Stitch: primary `#00355f` / primary-container `#0f4c81` / secondary `#bc0004` / accent `#f5ac00` / surface `#fcf8ff` / on-surface `#1a1a2e`
- [ ] Tipografia Newsreader (headlines) + Plus Jakarta Sans (body) — conforme Stitch
- [ ] Estrutura real dos componentes espelhando as 4 telas: hero, grid, sidebar, CTAs, footer, seções comerciais
- [ ] Slots publicitários IAB visíveis (leaderboard, sidebar 300×250, inline, footer banner)
- [ ] Landing `/anunciantes` alinhada ao novo sistema visual

### Out of Scope

- Mudanças em schema Prisma ou lógica de API — redesign é puramente UI/layout
- Migração de CMS, auth ou infra — backend intacto
- Novas funcionalidades (comentários, newsletter popups, etc) — só redesign
- Testes unitários de componentes — foco é UI estrutural, verificação é visual
- Redesign de telas administrativas (`/admin/*`) — apenas público

## Context

- Repo local: `C:\Users\crist\foz-foco-real`
- Repo remoto: `cristianodgt/foz-foco` (main)
- Deploy: Vercel — `foz-foco.vercel.app` (team `cristianodgtmkt-5225s-projects`, project `prj_1BUYQnTT4Od8PyERtVPaxWOSLIOv`)
- Stack: Next.js 15 App Router, React 19, Prisma + Supabase, Tailwind 3.4, shadcn/ui (Radix), next-themes, lucide-react, framer-motion, Tiptap
- Estrutura de rotas públicas: `app/(public)/` — home, categoria, post, anunciantes, etc
- Componentes afetados: `app/globals.css`, `app/(public)/**`, `components/layout/*`, `components/public/*`, `components/news/*`, `components/sections/*`, `components/ads/*`, `components/widgets/*`
- Fonte do contrato visual: projeto Stitch `8140760864745957946` — 4 HTMLs já baixados em `.planning/research/stitch/`
- Stakeholder: Sheley Bertol — feedback de 2026-04-01 rejeitou a versão atual como "mobile parece amador", pediu hero + 2-3 cards, nav visível, footer acessível, tipografia diferenciada
- Feedback crítico de 2026-04-05: redesign anterior (commit b4a69e3) apenas trocou tokens CSS — rejeitado por não alterar estrutura. Esta rodada precisa reescrever componentes.

## Constraints

- **Backend**: Next.js 15 + Prisma + Supabase — intocado, só UI
- **Compatibilidade**: rotas/params existentes preservados, só os JSX/CSS mudam
- **Design**: fidelidade ao Stitch — tokens, spacing, tipografia, layout espelhados, não adaptação superficial
- **Deploy**: Vercel com pipeline atual (prisma generate && next build) — nada de infra nova
- **Idioma**: pt-BR em todas as strings

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Redesign do zero em vez de patch incremental | Patch anterior (b4a69e3) só trocou tokens — usuário rejeitou visualmente | — Pending |
| Stitch project `8140760864745957946` como contrato visual único | Usuário aprovou explicitamente as 4 telas como base | — Pending |
| Fontes: Newsreader + Plus Jakarta Sans (não Sora) | Tokens reais extraídos do Stitch HTML | — Pending |
| Backend intocado | Risco desnecessário, não é parte do problema | — Pending |
| Um único phase coarse cobrindo todo o redesign | Trabalho é coeso, dividir vira churn | — Pending |

---
*Last updated: 2026-04-05 after /gsd:new-project bootstrap*
