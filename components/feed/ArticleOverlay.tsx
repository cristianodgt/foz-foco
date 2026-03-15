'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { X, ChevronDown, Clock, Eye, Share2 } from 'lucide-react'
import { formatDate, formatNumber } from '@/lib/utils'
import type { Post } from '@/types'

interface FullPost extends Post {
  content: string
  views: number
  publishedAt: string | null
  createdAt: string
}

interface ArticleOverlayProps {
  slug: string
  onClose: () => void
  onNext: () => void
  hasNext: boolean
}

export function ArticleOverlay({ slug, onClose, onNext, hasNext }: ArticleOverlayProps) {
  const [post, setPost] = useState<FullPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [muted, setMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLoading(true)
    setPost(null)
    if (scrollRef.current) scrollRef.current.scrollTop = 0
    fetch(`/api/posts/${slug}`)
      .then(r => r.json())
      .then(setPost)
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  function toggleMute() {
    setMuted(m => {
      if (videoRef.current) videoRef.current.muted = !m
      return !m
    })
  }

  async function handleShare() {
    const url = `${window.location.origin}/${slug}`
    if (navigator.share) {
      navigator.share({ title: post?.title, url }).catch(() => {})
    } else {
      navigator.clipboard.writeText(url).catch(() => {})
    }
  }

  const isVideo = post?.coverImage
    ? /\.(mp4|mov|webm|m4v)(\?.*)?$/i.test(post.coverImage)
    : false

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: '#000',
      display: 'flex', flexDirection: 'column',
      animation: 'overlaySlideUp 0.28s cubic-bezier(0.32,0.72,0,1)',
    }}>
      <style>{`
        @keyframes overlaySlideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>

      {/* Fixed top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '52px 16px 12px',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, transparent 100%)',
        pointerEvents: 'none',
      }}>
        <button onClick={onClose} style={{
          pointerEvents: 'all',
          background: 'rgba(0,0,0,0.45)', border: 'none', cursor: 'pointer',
          color: '#fff', borderRadius: '50%', width: 38, height: 38,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)',
        }}>
          <X size={18} />
        </button>
        <button onClick={handleShare} style={{
          pointerEvents: 'all',
          background: 'rgba(0,0,0,0.45)', border: 'none', cursor: 'pointer',
          color: '#fff', borderRadius: '50%', width: 38, height: 38,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)',
        }}>
          <Share2 size={16} />
        </button>
      </div>

      {/* Scrollable body */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>

        {/* Cover media */}
        <div style={{ position: 'relative', height: '50vh', background: '#111', flexShrink: 0 }}>
          {loading ? (
            <div style={{ position: 'absolute', inset: 0, background: '#1a1a1a' }} />
          ) : post?.coverImage ? (
            isVideo ? (
              <>
                <video
                  ref={videoRef}
                  src={post.coverImage}
                  autoPlay muted={muted} loop playsInline
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button onClick={toggleMute} style={{
                  position: 'absolute', bottom: 12, right: 12, zIndex: 2,
                  background: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer',
                  color: '#fff', borderRadius: '50%', width: 36, height: 36,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backdropFilter: 'blur(6px)', fontSize: 16,
                }}>
                  {muted ? '🔇' : '🔊'}
                </button>
              </>
            ) : (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                style={{ objectFit: 'cover', opacity: 0.85 }}
                priority
              />
            )
          ) : (
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#1a1a2e,#16213e)' }} />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)' }} />
        </div>

        {/* Article text */}
        <div style={{ background: '#fff', minHeight: '60vh' }}>
          {loading ? (
            <div style={{ padding: 24 }}>
              {[100, 80, 60].map((w, i) => (
                <div key={i} style={{ height: 14, background: '#f0f0f0', borderRadius: 7, marginBottom: 12, width: `${w}%` }} />
              ))}
            </div>
          ) : post ? (
            <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 20px 48px' }}>

              {/* Category chip */}
              <div style={{ marginBottom: 12 }}>
                <span style={{
                  display: 'inline-block', padding: '3px 12px',
                  borderRadius: 999, fontSize: 12, fontWeight: 700,
                  color: '#fff', background: post.category?.color || '#3B82F6',
                }}>
                  {post.category?.icon} {post.category?.name}
                </span>
              </div>

              {/* Title */}
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111', lineHeight: 1.25, margin: '0 0 16px' }}>
                {post.title}
              </h1>

              {/* Meta */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 14, fontSize: 13,
                color: '#777', marginBottom: 20, paddingBottom: 16,
                borderBottom: '1px solid #eee', flexWrap: 'wrap',
              }}>
                <span style={{ fontWeight: 600, color: '#333' }}>{post.author?.name}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={13} />
                  {post.publishedAt ? formatDate(new Date(post.publishedAt)) : formatDate(new Date(post.createdAt))}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Eye size={13} /> {formatNumber(post.views)}
                </span>
              </div>

              {/* Summary */}
              <p style={{ fontSize: 17, color: '#444', lineHeight: 1.7, marginBottom: 22, fontWeight: 500 }}>
                {post.summary}
              </p>

              {/* Content */}
              <div
                className="prose-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
                style={{ fontSize: 16, color: '#222', lineHeight: 1.8 }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 28, paddingTop: 20, borderTop: '1px solid #eee' }}>
                  {post.tags.map((tag: { id: string; name: string }) => (
                    <span key={tag.id} style={{ background: '#f5f5f5', color: '#555', fontSize: 12, padding: '4px 10px', borderRadius: 999 }}>
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Next / Close CTA */}
              <div style={{ marginTop: 40, paddingTop: 24, borderTop: '2px solid #eee', textAlign: 'center' }}>
                {hasNext ? (
                  <button onClick={onNext} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: '#111', color: '#fff', border: 'none', cursor: 'pointer',
                    padding: '14px 28px', borderRadius: 999, fontSize: 15, fontWeight: 700,
                  }}>
                    Próxima matéria <ChevronDown size={18} />
                  </button>
                ) : (
                  <button onClick={onClose} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: '#111', color: '#fff', border: 'none', cursor: 'pointer',
                    padding: '14px 28px', borderRadius: 999, fontSize: 15, fontWeight: 700,
                  }}>
                    Voltar ao feed <X size={16} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>Matéria não encontrada</div>
          )}
        </div>
      </div>
    </div>
  )
}
