'use client'

import Image from 'next/image'
import { X, Clock, Eye, Share2 } from 'lucide-react'
import { formatDate, formatNumber } from '@/lib/utils'

interface ArticleData {
  id: string
  title: string
  slug: string
  summary: string
  content: string
  coverImage?: string | null
  views: number
  publishedAt: string | null
  createdAt: string
  category: { name: string; color: string; icon?: string | null }
  author: { name: string }
  tags: { id: string; name: string }[]
}

interface ArticleInlineProps {
  post: ArticleData
  onClose: () => void
}

export function ArticleInline({ post, onClose }: ArticleInlineProps) {
  const isVideo = post.coverImage
    ? /\.(mp4|mov|webm|m4v)(\?.*)?$/i.test(post.coverImage)
    : false

  async function handleShare() {
    const url = `${window.location.origin}/${post.slug}`
    if (navigator.share) {
      navigator.share({ title: post.title, url }).catch(() => {})
    } else {
      navigator.clipboard.writeText(url).catch(() => {})
    }
  }

  return (
    <div
      style={{
        background: '#fff',
        colorScheme: 'light',
        animation: 'inlineExpand 0.22s ease-out',
        position: 'relative',
      }}
    >
      <style>{`
        @keyframes inlineExpand {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Sticky close bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: '#fff',
        borderBottom: '1px solid #eee',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px',
      }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#111', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>
          {post.title}
        </span>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button onClick={handleShare} style={{
            background: '#f5f5f5', border: 'none', cursor: 'pointer',
            color: '#333', borderRadius: '50%', width: 34, height: 34,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Share2 size={15} />
          </button>
          <button onClick={onClose} style={{
            background: '#111', border: 'none', cursor: 'pointer',
            color: '#fff', borderRadius: '50%', width: 34, height: 34,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Cover */}
      {post.coverImage && (
        <div style={{ position: 'relative', height: '45vw', maxHeight: 280, background: '#111' }}>
          {isVideo ? (
            <video
              src={post.coverImage}
              autoPlay muted loop playsInline
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          )}
        </div>
      )}

      {/* Content */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '20px 18px 48px' }}>

        {/* Category */}
        <div style={{ marginBottom: 10 }}>
          <span style={{
            display: 'inline-block', padding: '3px 12px',
            borderRadius: 999, fontSize: 12, fontWeight: 700,
            color: '#fff', background: post.category?.color || '#3B82F6',
          }}>
            {post.category?.icon} {post.category?.name}
          </span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111', lineHeight: 1.25, margin: '0 0 14px' }}>
          {post.title}
        </h1>

        {/* Meta */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, fontSize: 12,
          color: '#888', marginBottom: 18, paddingBottom: 14,
          borderBottom: '1px solid #eee', flexWrap: 'wrap',
        }}>
          <span style={{ fontWeight: 600, color: '#444' }}>{post.author?.name}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Clock size={12} />
            {post.publishedAt ? formatDate(new Date(post.publishedAt)) : formatDate(new Date(post.createdAt))}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Eye size={12} /> {formatNumber(post.views)}
          </span>
        </div>

        {/* Summary */}
        <p style={{ fontSize: 16, color: '#444', lineHeight: 1.7, marginBottom: 18, fontWeight: 500 }}>
          {post.summary}
        </p>

        {/* Body */}
        <div
          className="prose-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
          style={{ fontSize: 15, color: '#222', lineHeight: 1.8 }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 24, paddingTop: 16, borderTop: '1px solid #eee' }}>
            {post.tags.map(tag => (
              <span key={tag.id} style={{ background: '#f5f5f5', color: '#555', fontSize: 11, padding: '3px 9px', borderRadius: 999 }}>
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Close at bottom */}
        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <button onClick={onClose} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#111', color: '#fff', border: 'none', cursor: 'pointer',
            padding: '12px 24px', borderRadius: 999, fontSize: 14, fontWeight: 700,
          }}>
            <X size={14} /> Fechar matéria
          </button>
        </div>
      </div>
    </div>
  )
}
