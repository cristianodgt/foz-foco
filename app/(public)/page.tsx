import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { HeroSection } from '@/components/news/HeroSection'
import { MainGrid } from '@/components/sections/MainGrid'
import { CategorySection } from '@/components/sections/CategorySection'
import { Sidebar } from '@/components/layout/Sidebar'
import { AdBannerTop } from '@/components/ads/AdBannerTop'
import { AdBannerBottom } from '@/components/ads/AdBannerBottom'
import { AdInlineBanner } from '@/components/ads/AdInlineBanner'
import { BusinessDirectory } from '@/components/ads/BusinessDirectory'
import type { Post, Ad } from '@/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Foz em Foco — Notícias de Foz do Iguaçu',
  description: 'O portal de notícias de Foz do Iguaçu e região. Informação local, sempre em foco.',
}

async function getHomeData() {
  const now = new Date()

  const [allPosts, categories, sponsoredAd, trendingPosts] = await Promise.all([
    prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        category: true,
        author: { select: { id: true, name: true, avatar: true } },
        tags: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: 40,
    }),
    prisma.category.findMany({ where: { active: true }, orderBy: { order: 'asc' }, take: 6 }),
    prisma.ad.findFirst({
      where: { position: 'GRID_BANNER', active: true, startsAt: { lte: now }, endsAt: { gte: now } },
    }),
    prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        category: true,
        author: { select: { id: true, name: true, avatar: true } },
        tags: true,
      },
      orderBy: { views: 'desc' },
      take: 5,
    }),
  ])

  return { allPosts, categories, sponsoredAd, trendingPosts }
}

export default async function HomePage() {
  const { allPosts, categories, sponsoredAd, trendingPosts } = await getHomeData()

  if (!allPosts.length) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--color-text-muted)' }}>
        <p>Nenhuma notícia publicada ainda.</p>
      </div>
    )
  }

  const hero = allPosts[0] as unknown as Post
  const mainGridPosts = allPosts.slice(1, 14) as unknown as Post[]

  // Posts por categoria
  const postsByCategory = categories.map(cat => ({
    category: cat,
    posts: (allPosts as unknown as Post[]).filter(p => p.category?.slug === cat.slug).slice(0, 5),
  })).filter(c => c.posts.length > 0)

  return (
    <div className="container-editorial" style={{ paddingTop: 24 }}>
      {/* Banner topo */}
      <AdBannerTop />

      {/* Hero */}
      <HeroSection post={hero} />

      {/* Main content + Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 32, marginTop: 32, alignItems: 'start' }} className="home-grid">

        {/* Coluna principal */}
        <div>
          {/* Grid principal com posts recentes */}
          <MainGrid posts={mainGridPosts} sponsoredAd={sponsoredAd as Ad | null} />

          {/* Seções por categoria */}
          {postsByCategory.map((item, i) => (
            <div key={item.category.id}>
              <CategorySection
                title={item.category.name}
                slug={item.category.slug}
                posts={item.posts}
                layout={i % 2 === 0 ? 'grid' : 'featured-list'}
                showSponsor={true}
              />
              {/* Banner inline a cada 2 categorias */}
              {i === 1 && <AdInlineBanner />}
            </div>
          ))}

          {/* Vitrine de estabelecimentos */}
          <BusinessDirectory />
        </div>

        {/* Sidebar */}
        <Sidebar trendingPosts={trendingPosts as unknown as Post[]} />
      </div>

      {/* Banner rodapé */}
      <AdBannerBottom />

      <style>{`
        @media (max-width: 1024px) {
          .home-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
