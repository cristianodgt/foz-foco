# FOZ.FOCO

Portal de notícias regional - Foz do Iguaçu

---

## Sobre o Projeto

Portal de notícias regional com:
- **Feed vertical** estilo TikTok (scroll fullscreen, um post por vez, mobile-first)
- **Admin dashboard** completo para gerenciar posts manualmente
- **Sistema de anúncios nativos** para monetização
- **Editor de posts** rico com TipTap (imagens, links, formatação)

---

## Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **Linguagem**: TypeScript
- **Estilo**: Tailwind CSS + shadcn/ui
- **Banco**: PostgreSQL (Supabase) + Prisma ORM
- **Storage**: Supabase Storage (imagens)
- **Auth**: JWT + bcrypt
- **Animações**: Framer Motion
- **Cache**: Redis (Upstash)
- **Deploy**: Hostinger (Node.js hosting ou VPS)

---

## Início Rápido

### 1. Clone o repositório
```bash
git clone https://github.com/SEU-USUARIO/foz-foco.git
cd foz-foco
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env.local
nano .env.local
```

**Variáveis obrigatórias:**
```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
JWT_SECRET="seu-secret-aqui"
```

### 4. Configure o banco de dados
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 5. Rode o servidor
```bash
npm run dev
```

Abra http://localhost:3000

---

## Estrutura do Projeto

```
foz-foco/
├── app/                      # Next.js App Router
│   ├── (public)/            # Rotas públicas (feed, posts)
│   │   ├── page.tsx         # Homepage - Feed vertical TikTok
│   │   └── [slug]/          # Página de detalhe do post
│   ├── admin/               # Painel administrativo
│   │   ├── dashboard/       # Dashboard com métricas
│   │   ├── posts/           # Gerenciamento de posts
│   │   ├── campaigns/       # Gestão de anúncios
│   │   └── settings/        # Configurações
│   └── api/                 # API Routes
│       ├── feed/            # Endpoint do feed
│       ├── posts/           # CRUD de posts
│       ├── ads/             # API de anúncios
│       └── admin/           # Rotas admin
│
├── components/              # Componentes React
│   ├── ui/                  # Componentes base (shadcn/ui)
│   ├── public/              # Componentes do site público
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── FeedCard.tsx     # Card do feed vertical (fullscreen)
│   └── admin/               # Componentes admin
│       ├── Sidebar.tsx
│       ├── PostEditor.tsx   # Editor TipTap
│       └── ...
│
├── lib/                     # Bibliotecas e utilitários
│   ├── prisma.ts
│   ├── auth.ts
│   ├── api.ts
│   └── seo.ts
│
├── hooks/                   # React Hooks customizados
│   ├── useSession.ts
│   ├── useFeed.ts           # Feed infinito com swipe
│   └── useToast.ts
│
├── types/                   # TypeScript types
├── prisma/                  # Schema + Seed
└── public/                  # Arquivos estáticos
```

---

## Variáveis de Ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string | Sim |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Sim |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Sim |
| `JWT_SECRET` | Secret para tokens JWT | Sim |
| `UPSTASH_REDIS_REST_URL` | Redis cache URL | Não |
| `UPSTASH_REDIS_REST_TOKEN` | Redis cache token | Não |

---

## Scripts

```bash
npm run dev          # Dev server (localhost:3000)
npm run build        # Build produção
npm run start        # Inicia produção
npm run lint         # ESLint
npm run db:generate  # Gera Prisma Client
npm run db:push      # Sincroniza schema
npm run db:seed      # Dados iniciais
npm run db:studio    # Prisma Studio (GUI)
```

---

## Deploy (Hostinger)

O projeto usa Next.js que precisa de Node.js runtime.
Opções na Hostinger:
1. **Hostinger VPS** - Instalar Node.js + PM2 + Nginx
2. **Hostinger Node.js Hosting** - Se disponível no plano

Alternativa econômica: Railway, Render, ou Vercel (free tier)

---

## Roadmap

- [x] Setup inicial do projeto
- [x] Configuração do banco de dados
- [ ] Feed vertical público (estilo TikTok)
- [ ] Admin dashboard
- [ ] Editor de posts (TipTap)
- [ ] Sistema de anúncios nativos
- [ ] SEO e performance
- [ ] Deploy

---

**Criado em Foz do Iguaçu, PR**
