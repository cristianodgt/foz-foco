import Link from 'next/link'
import Image from 'next/image'
import { CategoryBadge } from './CategoryBadge'
import { formatRelativeDate } from '@/lib/utils'
import type { Post } from '@/types'

interface HeroArticleProps {
  post: Post
}

function resolveCover(post: Post): string | null {
  if (post.coverImage) return post.coverImage
  if (Array.isArray(post.media)) {
    const img = post.media.find((m: { type: string; url: string }) => m.type === 'image')
    if (img) return img.url
  }
  return null
}

/**
 * HeroArticle — inline editorial hero card.
 *
 * Mirrors Stitch desktop.html Row 5 hero article (first tile of the main column)
 * and mobile-b section 3. Fills its parent width, aspect-[16/9], gradient
 * overlay, Newsreader title, amber "Leia mais →" CTA.
 */
export function HeroArticle({ post }: HeroArticleProps) {
  const cover = resolveCover(post)

  return (
    <Link
      href={`/${post.slug}`}
      className="group relative block aspect-[16/9] overflow-hidden rounded-lg"
    >
      {cover ? (
        <Image
          src={cover}
          alt={post.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-container to-on-surface" />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-on-surface via-on-surface/60 to-transparent" />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 text-white">
        <CategoryBadge
          name={post.category?.name || 'Geral'}
          color={post.category?.color}
          icon={post.category?.icon}
        />
        <h2 className="mt-3 text-2xl md:text-4xl font-headline font-bold leading-tight">
          {post.title}
        </h2>
        {post.summary && (
          <p className="mt-3 hidden md:block text-base md:text-lg font-light text-surface-container-high line-clamp-2">
            {post.summary}
          </p>
        )}
        <p className="mt-2 text-xs md:text-sm opacity-80 font-label">
          Por {post.author?.name}
          {post.publishedAt ? ` • ${formatRelativeDate(post.publishedAt)}` : ''}
        </p>
        <span className="mt-4 inline-block font-bold text-tertiary-fixed font-label">
          Leia mais →
        </span>
      </div>
    </Link>
  )
}

// Legacy alias — old imports use `HeroSection`.
export const HeroSection = HeroArticle
