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
import { NewsCarousel } from '@/components/news/NewsCarousel'
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
  const carouselPosts = posts.slice(1, 13)
  const latestPosts = posts.slice(13, 18)

  return (
    <>
      {/* Top leaderboard ad */}
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <AdSlot
          format="leaderboard"
          position="GRID_BANNER_TOP"
        />
      </div>

      {/* Main content 12-col grid */}
      <div className="max-w-[1200px] mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main column — col-span-8 on desktop */}
        <div className="lg:col-span-8 space-y-10">
          {hero && <HeroArticle post={hero} />}

          {/* Auto-rotating news carousel — 3-col desktop, 1-col mobile */}
          <NewsCarousel posts={carouselPosts} perPage={3} interval={5000} />

          {/* Inline ad */}
          <AdSlot format="inline" position="FEED_BETWEEN" />
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

      {/* Bottom leaderboard ad */}
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <AdSlot
          format="leaderboard"
          position="GRID_BANNER_BOTTOM"
        />
      </div>
    </>
  )
}
