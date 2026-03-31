import Link from 'next/link'
import Image from 'next/image'
import { Clock, User } from 'lucide-react'
import { CategoryBadge } from './CategoryBadge'
import { formatRelativeDate } from '@/lib/utils'
import type { Post } from '@/types'

type Variant = 'featured' | 'standard' | 'compact' | 'horizontal'

interface ArticleCardProps {
  post: Post
  variant?: Variant
  priority?: boolean
}

function getCover(post: Post): string | null {
  if (post.coverImage && !/\.(mp4|mov|webm)(\?.*)?$/i.test(post.coverImage)) return post.coverImage
  if (Array.isArray(post.media)) {
    const img = post.media.find((m: { type: string; url: string }) => m.type === 'image')
    if (img) return img.url
  }
  return null
}

/* ── FEATURED — imagem grande + titulo + excerpt ── */
function FeaturedCard({ post, priority }: { post: Post; priority?: boolean }) {
  const cover = getCover(post)
  return (
    <Link href={`/${post.slug}`} className="article-card article-card-featured" style={{ display: 'block', textDecoration: 'none', height: '100%' }}>
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: 'var(--color-surface)' }}>
        {cover ? (
          <Image src={cover} alt={post.title} fill className="object-cover" priority={priority} sizes="(max-width: 640px) 100vw, 50vw" />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, var(--color-brand) 0%, #0C1E2C 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 22, letterSpacing: 3, color: 'rgba(255,255,255,0.2)' }}>FOZ EM FOCO</span>
          </div>
        )}
      </div>
      <div style={{ padding: '16px 18px 18px' }}>
        <div style={{ marginBottom: 8 }}>
          <CategoryBadge name={post.category?.name || ''} color={post.category?.color} icon={post.category?.icon} />
        </div>
        <h2 className="article-title line-clamp-3" style={{ fontSize: '1.25rem', marginBottom: 10 }}>{post.title}</h2>
        <p className="article-excerpt line-clamp-2" style={{ marginBottom: 12 }}>{post.summary}</p>
        <div className="article-meta">
          <User size={12} /><span>{post.author?.name}</span>
          <span>·</span>
          <Clock size={12} /><span>{post.publishedAt ? formatRelativeDate(post.publishedAt) : ''}</span>
        </div>
      </div>
    </Link>
  )
}

/* ── STANDARD — imagem + titulo + meta ── */
function StandardCard({ post, priority }: { post: Post; priority?: boolean }) {
  const cover = getCover(post)
  return (
    <Link href={`/${post.slug}`} className="article-card" style={{ display: 'block', textDecoration: 'none' }}>
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: 'var(--color-surface)' }}>
        {cover ? (
          <Image src={cover} alt={post.title} fill className="object-cover" priority={priority} sizes="(max-width: 640px) 100vw, 33vw" />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, var(--color-surface-2) 0%, var(--color-surface) 100%)' }} />
        )}
        <div style={{ position: 'absolute', top: 8, left: 8 }}>
          <CategoryBadge name={post.category?.name || ''} color={post.category?.color} icon={post.category?.icon} size="sm" />
        </div>
      </div>
      <div style={{ padding: '12px 14px 14px' }}>
        <h3 className="article-title line-clamp-2" style={{ fontSize: '1rem', marginBottom: 8 }}>{post.title}</h3>
        <div className="article-meta">
          <Clock size={11} /><span>{post.publishedAt ? formatRelativeDate(post.publishedAt) : ''}</span>
        </div>
      </div>
    </Link>
  )
}

/* ── COMPACT — thumb pequena + titulo inline ── */
function CompactCard({ post }: { post: Post }) {
  const cover = getCover(post)
  return (
    <Link href={`/${post.slug}`} style={{ display: 'flex', gap: 10, textDecoration: 'none', alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
      <div style={{ position: 'relative', width: 72, height: 52, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: 'var(--color-surface)' }}>
        {cover && <Image src={cover} alt={post.title} fill className="object-cover" sizes="72px" />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ marginBottom: 4 }}>
          <CategoryBadge name={post.category?.name || ''} color={post.category?.color} size="sm" />
        </div>
        <h4 className="article-title line-clamp-2" style={{ fontSize: '0.875rem' }}>{post.title}</h4>
        <p className="article-meta" style={{ marginTop: 4 }}>
          <Clock size={11} /><span>{post.publishedAt ? formatRelativeDate(post.publishedAt) : ''}</span>
        </p>
      </div>
    </Link>
  )
}

/* ── HORIZONTAL — thumb direita + titulo + excerpt esquerda ── */
function HorizontalCard({ post }: { post: Post }) {
  const cover = getCover(post)
  return (
    <Link href={`/${post.slug}`} className="article-card" style={{ display: 'flex', gap: 0, textDecoration: 'none', overflow: 'hidden' }}>
      <div style={{ flex: 1, padding: '14px 16px 14px' }}>
        <div style={{ marginBottom: 6 }}>
          <CategoryBadge name={post.category?.name || ''} color={post.category?.color} size="sm" />
        </div>
        <h3 className="article-title line-clamp-2" style={{ fontSize: '1rem', marginBottom: 6 }}>{post.title}</h3>
        <p className="article-excerpt line-clamp-2" style={{ fontSize: 13, marginBottom: 8 }}>{post.summary}</p>
        <div className="article-meta">
          <Clock size={11} /><span>{post.publishedAt ? formatRelativeDate(post.publishedAt) : ''}</span>
        </div>
      </div>
      <div style={{ position: 'relative', width: 140, flexShrink: 0, background: 'var(--color-surface)' }}>
        {cover && <Image src={cover} alt={post.title} fill className="object-cover" sizes="140px" />}
      </div>
    </Link>
  )
}

/* ── EXPORT ── */
export function ArticleCard({ post, variant = 'standard', priority }: ArticleCardProps) {
  if (variant === 'featured') return <FeaturedCard post={post} priority={priority} />
  if (variant === 'compact') return <CompactCard post={post} />
  if (variant === 'horizontal') return <HorizontalCard post={post} />
  return <StandardCard post={post} priority={priority} />
}
