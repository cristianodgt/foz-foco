import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '@/types'

/**
 * Plan 01-03 simplified ArticleCard — premium editorial feel.
 *
 * Three Stitch-aligned variants:
 * - `grid`       — 3-col sub-grid card (image + eyebrow + Newsreader title).
 * - `secondary`  — mobile-b style horizontal (text left, thumb right).
 * - `compact`    — sidebar Últimas-style (small thumb + title).
 *
 * Legacy names (`featured`, `standard`, `horizontal`) kept as aliases so that
 * /[slug] and /categoria/[slug] continue to render.
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
    <Link
      href={`/${post.slug}`}
      className="group block overflow-hidden rounded-2xl bg-surface ring-1 ring-on-surface/5 shadow-[0_2px_12px_-4px_rgba(26,26,46,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-12px_rgba(26,26,46,0.25)] hover:ring-on-surface/10"
    >
      <div className="relative aspect-video overflow-hidden bg-surface-container">
        {cover && (
          <Image
            src={cover}
            alt={post.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
          />
        )}
      </div>
      <div className="p-5 space-y-2">
        <p className="text-[10px] font-bold text-primary tracking-widest uppercase font-label">
          {categoryName}
        </p>
        <h3 className="font-headline font-bold text-lg leading-tight text-on-surface transition-colors group-hover:text-primary">
          {post.title}
        </h3>
      </div>
    </Link>
  )
}

function SecondaryCard({ post }: { post: Post }) {
  const cover = getCover(post)
  const categoryName = post.category?.name || ''

  return (
    <Link
      href={`/${post.slug}`}
      className="group flex gap-4 items-start rounded-2xl p-3 -m-3 transition-colors hover:bg-surface-container/60"
    >
      <div className="flex-1 min-w-0">
        <p className="text-primary text-[10px] font-bold tracking-widest uppercase font-label">
          {categoryName}
        </p>
        <h3 className="mt-1 font-headline text-xl font-bold leading-snug text-on-surface transition-colors group-hover:text-primary">
          {post.title}
        </h3>
      </div>
      <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-2xl bg-surface-container shadow-sm ring-1 ring-on-surface/5">
        {cover && (
          <Image
            src={cover}
            alt={post.title}
            fill
            sizes="96px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
    </Link>
  )
}

function CompactCard({ post }: { post: Post }) {
  const cover = getCover(post)

  return (
    <Link
      href={`/${post.slug}`}
      className="group flex gap-3 items-center rounded-xl p-2 -m-2 transition-colors hover:bg-surface-container/60"
    >
      <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded-xl bg-surface-container shadow-sm ring-1 ring-on-surface/5">
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
      <h4 className="flex-1 text-sm font-headline font-semibold leading-tight text-on-surface transition-colors group-hover:text-primary line-clamp-3">
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
