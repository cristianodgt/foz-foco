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
      take: 60,
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
  const compactPosts = posts.slice(13, 22)
  const latestPosts = posts.slice(22, 37)

  return (
    <>
      {/* Top leaderboard ad */}
      <div className="max-w-[1200px] mx-auto px-4 pt-6 pb-4">
        <AdSlot
          format="leaderboard"
          position="GRID_BANNER_TOP"
        />
      </div>

      {/* Main content 12-col grid */}
      <div className="max-w-[1200px] mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main column — col-span-8 on desktop */}
        <div className="lg:col-span-8 space-y-10">
          {hero && <HeroArticle post={hero} />}

          {/* Auto-rotating news carousel — 3-col desktop, 1-col mobile */}
          <NewsCarousel posts={carouselPosts} perPage={3} interval={5000} />

          {/* Inline ad */}
          <AdSlot format="inline" position="FEED_BETWEEN" />

          {/* 9-article editorial grid */}
          {compactPosts.length > 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {compactPosts.map(post => (
                  <ArticleCard key={post.id} post={post} variant="grid" />
                ))}
              </div>
              <div className="flex justify-center pt-2">
                <a
                  href="/noticias"
                  className="inline-flex w-full max-w-96 mx-auto items-center justify-center gap-2 rounded-lg bg-primary h-10 px-4 text-sm font-medium text-on-primary shadow-xs shadow-black/5 transition-[color,box-shadow] duration-200 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  Ver mais notícias
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
              </div>
            </div>
          )}
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
      <div className="max-w-[1200px] mx-auto px-4 pt-4 pb-8">
        <AdSlot
          format="leaderboard"
          position="GRID_BANNER_BOTTOM"
        />
      </div>
    </>
  )
}
