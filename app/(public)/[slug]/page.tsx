import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { Clock, Eye, User, Share2, ChevronLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { buildMetadata, buildArticleJsonLd } from '@/lib/seo'
import { formatDate, formatNumber } from '@/lib/utils'
import { CategoryBadge } from '@/components/news/CategoryBadge'
import { ArticleCard } from '@/components/news/ArticleCard'
import { AdBannerTop } from '@/components/ads/AdBannerTop'
import { AdBannerBottom } from '@/components/ads/AdBannerBottom'
import { AdSidebarSticky } from '@/components/ads/AdSidebarSticky'
import { TrendingWidget } from '@/components/widgets/TrendingWidget'
import { NewsletterWidget } from '@/components/widgets/NewsletterWidget'
import { ShareButton } from './ShareButton'
import type { Post } from '@/types'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
  return prisma.post.findUnique({
    where: { slug, status: 'PUBLISHED' },
    include: {
      category: true,
      author: { select: { id: true, name: true, avatar: true } },
      tags: true,
    },
  })
}

async function getRelatedPosts(categoryId: string, excludeId: string) {
  return prisma.post.findMany({
    where: { categoryId, status: 'PUBLISHED', id: { not: excludeId } },
    include: {
      category: true,
      author: { select: { id: true, name: true, avatar: true } },
      tags: true,
    },
    orderBy: { publishedAt: 'desc' },
    take: 3,
  })
}

async function getTrendingPosts() {
  return prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      category: true,
      author: { select: { id: true, name: true, avatar: true } },
      tags: true,
    },
    orderBy: { views: 'desc' },
    take: 5,
  })
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return buildMetadata({
    title: post.title,
    description: post.summary,
    image: post.coverImage || undefined,
    url: `/${post.slug}`,
    type: 'article',
  })
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } }).catch(() => {})

  const [relatedPosts, trendingPosts] = await Promise.all([
    getRelatedPosts(post.categoryId, post.id),
    getTrendingPosts(),
  ])

  const coverUrl = post.coverImage && !/\.(mp4|mov|webm)(\?.*)?$/i.test(post.coverImage)
    ? post.coverImage
    : null

  const jsonLd = buildArticleJsonLd({
    title: post.title,
    description: post.summary,
    image: post.coverImage || undefined,
    url: `/${post.slug}`,
    publishedAt: post.publishedAt || post.createdAt,
    authorName: post.author.name,
    categoryName: post.category.name,
  })

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-[1200px] mx-auto px-4" style={{ paddingTop: 24, paddingBottom: 48 }}>
        <AdBannerTop />

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>
          <Link href="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Início</Link>
          <span>/</span>
          <Link href={`/categoria/${post.category.slug}`} style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>{post.category.name}</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-text-secondary)' }} className="line-clamp-1">{post.title}</span>
        </div>

        {/* Main layout: article + sidebar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 40, alignItems: 'start' }} className="article-grid">

          {/* Article */}
          <article>
            {/* Category + meta */}
            <div style={{ marginBottom: 16 }}>
              <CategoryBadge name={post.category.name} color={post.category.color} icon={post.category.icon} />
            </div>

            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', lineHeight: 1.25, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 16 }}>
              {post.title}
            </h1>

            <p style={{ fontSize: '1.05rem', lineHeight: 1.65, color: 'var(--color-text-secondary)', marginBottom: 20, fontWeight: 400 }}>
              {post.summary}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 20, paddingBottom: 20, borderBottom: '1px solid var(--color-border)', marginBottom: 28, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.825rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                <User size={13} /> {post.author.name}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>
                <Clock size={13} /> {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>
                <Eye size={13} /> {formatNumber(post.views)} visualizações
              </span>
              <ShareButton title={post.title} />
            </div>

            {/* Cover image */}
            {coverUrl && (
              <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', borderRadius: 10, marginBottom: 32 }}>
                <Image src={coverUrl} alt={post.title} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 700px" />
              </div>
            )}

            {/* Content */}
            <div className="article-body" dangerouslySetInnerHTML={{ __html: post.content }} />

            {/* Tags */}
            {post.tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 36, paddingTop: 20, borderTop: '1px solid var(--color-border)' }}>
                {post.tags.map(tag => (
                  <span key={tag.id} style={{ background: 'var(--color-surface)', color: 'var(--color-text-muted)', fontSize: '0.775rem', padding: '4px 12px', borderRadius: 20, border: '1px solid var(--color-border)' }}>
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside style={{ position: 'sticky', top: 120 }}>
            <AdSidebarSticky />
            <TrendingWidget posts={trendingPosts as unknown as Post[]} />
            <NewsletterWidget />
          </aside>
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div style={{ marginTop: 56 }}>
            <h2 className="text-2xl md:text-3xl font-headline font-bold text-on-surface" style={{ marginBottom: 24 }}>Veja também</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="related-grid">
              {relatedPosts.map(p => (
                <ArticleCard key={p.id} post={p as unknown as Post} variant="standard" />
              ))}
            </div>
          </div>
        )}

        <AdBannerBottom />
      </div>

      <style>{`
        .article-grid { }
        @media (max-width: 1024px) {
          .article-grid { grid-template-columns: 1fr !important; }
          .article-grid aside { position: static !important; }
          .related-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          .related-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
