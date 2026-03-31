import Link from 'next/link'
import Image from 'next/image'
import { Clock, User } from 'lucide-react'
import { CategoryBadge } from './CategoryBadge'
import { formatRelativeDate } from '@/lib/utils'
import type { Post } from '@/types'

interface HeroSectionProps {
  post: Post
}

export function HeroSection({ post }: HeroSectionProps) {
  const coverUrl = post.coverImage ||
    (Array.isArray(post.media) && post.media.find((m: { type: string; url: string }) => m.type === 'image')?.url)

  return (
    <Link href={`/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div className="hero-section">
        {/* Background */}
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1B3A5C, #0A0A0A)' }} />
        )}

        {/* Overlay */}
        <div className="hero-overlay" />

        {/* Content */}
        <div className="hero-content container-editorial">
          <div style={{ marginBottom: 10 }}>
            <CategoryBadge
              name={post.category?.name || 'Geral'}
              color={post.category?.color}
              icon={post.category?.icon}
            />
          </div>
          <h1 className="hero-title" style={{ marginBottom: 12 }}>
            {post.title}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, lineHeight: 1.5, marginBottom: 14, maxWidth: 680, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {post.summary}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
              <User size={13} />
              {post.author?.name}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
              <Clock size={13} />
              {post.publishedAt ? formatRelativeDate(post.publishedAt) : ''}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
