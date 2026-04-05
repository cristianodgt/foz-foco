import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { HeroArticle } from '@/components/news/HeroSection'
import { ArticleCard } from '@/components/news/ArticleCard'
import { Sidebar } from '@/components/layout/Sidebar'
import { MaisLidas } from '@/components/widgets/MaisLidas'
import { GuiaComercialSection } from '@/components/sections/GuiaComercialSection'
import { EventsScroller } from '@/components/sections/EventsScroller'
import { JobsSection } from '@/components/sections/JobsSection'
import { PricingSection } from '@/components/sections/PricingSection'
import { AdSlot } from '@/components/ads/AdSlot'
import type { Post } from '@/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Foz em Foco — Notícias de Foz do Iguaçu',
  description:
    'O portal de notícias de Foz do Iguaçu e região. Informação local, sempre em foco.',
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
      where: {
        position: 'GRID_BANNER',
        active: true,
        startsAt: { lte: now },
        endsAt: { gte: now },
      },
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
  const { allPosts, trendingPosts } = await getHomeData()

  if (!allPosts.length) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-20 text-center text-outline font-label">
        <p>Nenhuma notícia publicada ainda.</p>
      </div>
    )
  }

  const posts = allPosts as unknown as Post[]
  const trending = trendingPosts as unknown as Post[]
  const hero = posts[0]
  const gridPosts = posts.slice(1, 4)
  const secondaryPosts = posts.slice(4, 7)
  const latestPosts = posts.slice(7, 12)

  return (
    <>
      {/* Top leaderboard ad — full-width edge-to-edge */}
      <AdSlot
        format="leaderboard"
        position="GRID_BANNER_TOP"
        className="bg-on-surface"
      />

      {/* Main content 12-col grid */}
      <div className="max-w-[1200px] mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main column — col-span-8 on desktop */}
        <div className="lg:col-span-8 space-y-10">
          {hero && <HeroArticle post={hero} />}

          {/* Desktop 3-col sub-grid */}
          <div className="hidden md:grid grid-cols-3 gap-6">
            {gridPosts.map(post => (
              <ArticleCard key={post.id} post={post} variant="grid" />
            ))}
          </div>

          {/* Mobile secondary list (thumb-right) */}
          <div className="space-y-6 md:hidden">
            {secondaryPosts.map(post => (
              <ArticleCard key={post.id} post={post} variant="secondary" />
            ))}
          </div>

          {/* Inline ad */}
          <AdSlot format="inline" position="INLINE_BANNER" />
        </div>

        {/* Sidebar — desktop only (lg:col-span-4 applied inside component) */}
        <Sidebar trendingPosts={trending} latestPosts={latestPosts} />

        {/* Mobile-only Mais Lidas card, shown after inline ad */}
        <div className="lg:hidden bg-surface-container-lowest rounded-xl p-6 shadow-sm">
          <MaisLidas posts={trending.slice(0, 3)} />
        </div>
      </div>

      {/* Full-width editorial sections */}
      <GuiaComercialSection />
      <EventsScroller />
      <JobsSection />
      <PricingSection variant="home" />

      {/* Bottom leaderboard ad — full-width edge-to-edge */}
      <AdSlot
        format="leaderboard"
        position="GRID_BANNER_BOTTOM"
        className="bg-on-surface"
      />
    </>
  )
}
