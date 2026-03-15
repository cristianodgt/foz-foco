import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { ChevronLeft, Clock, Eye } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { buildMetadata, buildArticleJsonLd } from '@/lib/seo'
import { formatDate, formatNumber } from '@/lib/utils'
import { FeedCard } from '@/components/feed/FeedCard'
import { ShareButton } from './ShareButton'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug, status: 'PUBLISHED' },
    include: {
      category: true,
      author: { select: { id: true, name: true, avatar: true } },
      tags: true,
    },
  })
  return post
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

  // Increment views (fire and forget)
  prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } }).catch(() => {})

  const relatedPosts = await getRelatedPosts(post.categoryId, post.id)
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-white">
        {/* Cover media (image or video) */}
        <div className="relative h-[50vh] bg-gray-900">
          {post.coverImage && (
            /\.(mp4|mov|webm|m4v)(\?.*)?$/i.test(post.coverImage) ? (
              <video
                src={post.coverImage}
                autoPlay
                muted
                loop
                playsInline
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
              />
            ) : (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover opacity-80"
                priority
              />
            )
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Back button */}
          <Link
            href="/"
            className="absolute top-16 left-4 flex items-center gap-1 text-white/80 hover:text-white text-sm font-medium bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Voltar
          </Link>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Category + Meta */}
          <div className="flex items-center gap-3 mb-4">
            <Link
              href={`/categoria/${post.category.slug}`}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: post.category.color }}
            >
              {post.category.icon} {post.category.name}
            </Link>
            <span className="text-gray-400 text-sm flex items-center gap-1">
              <Eye className="w-3 h-3" /> {formatNumber(post.views)}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">{post.title}</h1>

          {/* Author + Date */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b">
            <span className="font-medium text-gray-700">{post.author.name}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
            </span>
            <ShareButton title={post.title} />
          </div>

          {/* Summary */}
          <p className="text-lg text-gray-600 leading-relaxed mb-6 font-medium">{post.summary}</p>

          {/* Content */}
          <div
            className="prose-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t">
              {post.tags.map((tag) => (
                <span key={tag.id} className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-4">
            <div className="max-w-2xl mx-auto px-4 py-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Veja também</h2>
            </div>
            <div className="space-y-0">
              {relatedPosts.map((related, i) => (
                <div key={related.id} style={{ height: '100dvh' }}>
                  <FeedCard post={related as any} index={i} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

