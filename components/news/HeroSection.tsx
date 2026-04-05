import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
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
 * HeroArticle — premium editorial hero card.
 *
 * Mirrors Stitch desktop.html Row 5 hero and mobile-b section 3. Soft frame:
 * rounded-3xl, layered shadow, hairline ring, refined bottom gradient, gentle
 * image zoom on hover, amber Leia mais pill CTA.
 */
export function HeroArticle({ post }: HeroArticleProps) {
  const cover = resolveCover(post)

  return (
    <Link
      href={`/${post.slug}`}
      className="group relative block aspect-[16/9] overflow-hidden rounded-3xl bg-surface-container shadow-[0_10px_40px_-12px_rgba(26,26,46,0.35)] ring-1 ring-on-surface/10 transition-all duration-500 hover:shadow-[0_20px_60px_-12px_rgba(26,26,46,0.5)] hover:ring-on-surface/20"
    >
      {cover ? (
        <Image
          src={cover}
          alt={post.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-container via-primary to-on-surface" />
      )}

      {/* Top vignette for depth */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-on-surface/30 to-transparent" />

      {/* Bottom editorial gradient — refined three-stop */}
      <div className="absolute inset-0 bg-gradient-to-t from-on-surface via-on-surface/75 via-35% to-transparent to-70%" />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 text-white">
        <CategoryBadge
          name={post.category?.name || 'Geral'}
          color={post.category?.color}
          icon={post.category?.icon}
        />
        <h2 className="mt-4 text-2xl md:text-4xl lg:text-5xl font-headline font-bold leading-[1.1] tracking-tight drop-shadow-sm">
          {post.title}
        </h2>
        {post.summary && (
          <p className="mt-3 hidden md:block text-base md:text-lg font-light text-white/85 leading-relaxed line-clamp-2 max-w-3xl">
            {post.summary}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-xs md:text-sm text-white/70 font-label">
            Por {post.author?.name}
            {post.publishedAt ? ` • ${formatRelativeDate(post.publishedAt)}` : ''}
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-tertiary-fixed px-4 py-2 text-xs md:text-sm font-bold text-on-tertiary-fixed font-label shadow-md transition-transform duration-300 group-hover:translate-x-1">
            Leia mais
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

// Legacy alias — old imports use `HeroSection`.
export const HeroSection = HeroArticle
