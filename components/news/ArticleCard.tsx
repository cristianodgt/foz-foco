import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '@/types'

/**
 * Plan 01-03 simplified ArticleCard.
 *
 * Three Stitch-aligned variants:
 * - `grid`       — 3-col sub-grid card (image + eyebrow + Newsreader title, NO excerpt, NO byline).
 * - `secondary`  — mobile-b style horizontal (text left, thumb right).
 * - `compact`    — sidebar Últimas-style (small thumb + title).
 *
 * Legacy names (`featured`, `standard`, `horizontal`) are accepted as aliases
 * so that /[slug] and /categoria/[slug] (swept in plan 01-01) keep rendering
 * without touching their imports. Rule 3 auto-fix to avoid breaking pages
 * outside this plan's scope.
 */
type Variant = 'grid' | 'secondary' | 'compact' | 'featured' | 'standard' | 'horizontal'

interface ArticleCardProps {
  post: Post
  variant?: Variant
  priority?: boolean
}

function getCover(post: Post): string | null {
  if (post.coverImage && !/\.(mp4|mov|webm)(\?.*)?$/i.test(post.coverImage)) {
    return post.coverImage
  }
  if (Array.isArray(post.media)) {
    const img = post.media.find((m: { type: string; url: string }) => m.type === 'image')
    if (img) return img.url
  }
  return null
}

function GridCard({ post, priority }: { post: Post; priority?: boolean }) {
  const cover = getCover(post)
  const categoryName = post.category?.name || ''

  return (
    <Link href={`/${post.slug}`} className="group block space-y-3">
      <div className="relative aspect-video overflow-hidden rounded-md bg-surface-container">
        {cover && (
          <Image
            src={cover}
            alt={post.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <p className="text-[10px] font-bold text-primary tracking-widest uppercase font-label">
        {categoryName}
      </p>
      <h3 className="font-headline font-bold text-lg leading-tight text-on-surface group-hover:text-primary transition-colors">
        {post.title}
      </h3>
    </Link>
  )
}

function SecondaryCard({ post }: { post: Post }) {
  const cover = getCover(post)
  const categoryName = post.category?.name || ''

  return (
    <Link href={`/${post.slug}`} className="group flex gap-4 items-start">
      <div className="flex-1 min-w-0">
        <p className="text-primary text-[10px] font-bold tracking-widest uppercase font-label">
          {categoryName}
        </p>
        <h3 className="mt-1 font-headline text-xl font-bold leading-snug text-on-surface group-hover:text-primary transition-colors">
          {post.title}
        </h3>
      </div>
      <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-md bg-surface-container">
        {cover && (
          <Image
            src={cover}
            alt={post.title}
            fill
            sizes="96px"
            className="object-cover"
          />
        )}
      </div>
    </Link>
  )
}

function CompactCard({ post }: { post: Post }) {
  const cover = getCover(post)

  return (
    <Link href={`/${post.slug}`} className="group flex gap-3 items-center py-2">
      <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded-md bg-surface-container">
        {cover && (
          <Image
            src={cover}
            alt={post.title}
            fill
            sizes="64px"
            className="object-cover"
          />
        )}
      </div>
      <h4 className="flex-1 text-sm font-headline font-semibold leading-tight text-on-surface group-hover:text-primary transition-colors line-clamp-3">
        {post.title}
      </h4>
    </Link>
  )
}

export function ArticleCard({ post, variant = 'grid', priority }: ArticleCardProps) {
  // Legacy aliases
  if (variant === 'secondary') return <SecondaryCard post={post} />
  if (variant === 'compact') return <CompactCard post={post} />
  if (variant === 'horizontal') return <SecondaryCard post={post} />
  // grid | featured | standard all render as the editorial grid card
  return <GridCard post={post} priority={priority} />
}
