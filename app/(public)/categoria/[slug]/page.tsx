import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { buildMetadata } from '@/lib/seo'
import { ArticleCard } from '@/components/news/ArticleCard'
import { AdBannerTop } from '@/components/ads/AdBannerTop'
import { AdBannerBottom } from '@/components/ads/AdBannerBottom'
import { AdSidebarSticky } from '@/components/ads/AdSidebarSticky'
import { TrendingWidget } from '@/components/widgets/TrendingWidget'
import { NewsletterWidget } from '@/components/widgets/NewsletterWidget'
import type { Post } from '@/types'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getCategory(slug: string) {
  return prisma.category.findUnique({ where: { slug, active: true } })
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)
  if (!category) return {}
  return buildMetadata({
    title: `${category.name} — Foz em Foco`,
    description: `Notícias de ${category.name} em Foz do Iguaçu e região`,
    url: `/categoria/${slug}`,
  })
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const category = await getCategory(slug)
  if (!category) notFound()

  const [posts, trendingPosts] = await Promise.all([
    prisma.post.findMany({
      where: { categoryId: category.id, status: 'PUBLISHED' },
      include: {
        category: true,
        author: { select: { id: true, name: true, avatar: true } },
        tags: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: 24,
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

  return (
    <div className="container-editorial" style={{ paddingTop: 24, paddingBottom: 48 }}>
      <AdBannerTop />

      {/* Category header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          {category.icon && <span style={{ fontSize: '1.5rem' }}>{category.icon}</span>}
          <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: '2.5rem', letterSpacing: '0.05em', color: category.color || 'var(--color-brand)' }}>
            {category.name}
          </h1>
        </div>
        <div style={{ height: 3, width: 60, background: category.color || 'var(--color-brand)', borderRadius: 2 }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 40, alignItems: 'start' }} className="cat-layout">
        <div>
          {posts.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', padding: '40px 0' }}>Nenhuma notícia publicada nesta categoria.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="cat-posts-grid">
              {posts.map(post => (
                <ArticleCard key={post.id} post={post as unknown as Post} variant="standard" />
              ))}
            </div>
          )}
        </div>

        <aside style={{ position: 'sticky', top: 120 }}>
          <AdSidebarSticky />
          <TrendingWidget posts={trendingPosts as unknown as Post[]} />
          <NewsletterWidget />
        </aside>
      </div>

      <AdBannerBottom />

      <style>{`
        @media (max-width: 1024px) {
          .cat-layout { grid-template-columns: 1fr !important; }
          .cat-layout aside { position: static !important; }
          .cat-posts-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .cat-posts-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
