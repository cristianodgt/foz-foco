'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Clock, User, Heart, Share2, ChevronRight, X } from 'lucide-react'
import { formatRelativeDate } from '@/lib/utils'
import type { Post } from '@/types'

interface FeedCardProps {
  post: Post
  index: number
  onVisible?: (slug: string) => void
}

function MediaSlide({
  item,
  active,
  muted,
}: {
  item: { url: string; type: 'image' | 'video' }
  active: boolean
  muted: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!videoRef.current) return
    if (active) videoRef.current.play().catch(() => {})
    else videoRef.current.pause()
  }, [active])

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted
  }, [muted])

  if (item.type === 'video') {
    return (
      <video
        ref={videoRef}
        src={item.url}
        muted={muted}
        loop
        playsInline
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
    )
  }
  return (
    <Image
      src={item.url}
      alt=""
      fill
      className="object-cover"
      sizes="(max-width: 640px) 100vw, 640px"
    />
  )
}

export function FeedCard({ post, index, onVisible }: FeedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [muted, setMuted] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [slideIndex, setSlideIndex] = useState(0)

  // Article state
  const [articleContent, setArticleContent] = useState<string | null>(null)
  const [articleTitle, setArticleTitle] = useState('')
  const [articleLoading, setArticleLoading] = useState(false)
  const articleFetched = useRef(false)

  // Build media list
  const mediaList: { url: string; type: 'image' | 'video' }[] = (() => {
    if (post.media && post.media.length > 0) return post.media
    if (post.coverImage) {
      const isVideo = /\.(mp4|mov|webm|m4v)(\?.*)?$/i.test(post.coverImage)
      return [{ url: post.coverImage, type: isVideo ? 'video' : 'image' }]
    }
    return []
  })()

  // Total slides = media + 1 article slot (always last)
  const ARTICLE_SLIDE_IDX = mediaList.length
  const totalSlides = mediaList.length + 1
  const isArticleSlide = slideIndex === ARTICLE_SLIDE_IDX
  const currentMedia = mediaList[slideIndex]
  const isCurrentVideo = currentMedia?.type === 'video'

  // Reset to slide 0 when card scrolls out of view
  useEffect(() => {
    if (!cardRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setSlideIndex(0)
        } else if (onVisible) {
          onVisible(post.slug)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [onVisible, post.slug])

  // Touch swipe
  const touchStart = useRef<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return
    const diff = touchStart.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) {
      if (diff > 0) setSlideIndex(i => Math.min(i + 1, totalSlides - 1))
      else setSlideIndex(i => Math.max(i - 1, 0))
    }
    touchStart.current = null
  }

  function toggleMute(e: React.MouseEvent) {
    e.stopPropagation()
    setMuted(m => !m)
  }

  function handleLike(e: React.MouseEvent) {
    e.stopPropagation()
    setLiked(l => {
      setLikeCount(c => !l ? c + 1 : c - 1)
      return !l
    })
  }

  async function handleShare(e: React.MouseEvent) {
    e.stopPropagation()
    const url = `${window.location.origin}/${post.slug}`
    if (navigator.share) navigator.share({ title: post.title, url }).catch(() => {})
    else navigator.clipboard.writeText(url).catch(() => {})
  }

  async function handleVerMateria(e: React.MouseEvent) {
    e.stopPropagation()

    // Go to article slide immediately
    setSlideIndex(ARTICLE_SLIDE_IDX)

    // Fetch content if not already loaded
    if (articleFetched.current) return
    setArticleLoading(true)
    try {
      const data = await fetch(`/api/posts/${post.slug}`).then(r => r.json())
      setArticleTitle(data.title || post.title)
      setArticleContent(data.content || '')
      articleFetched.current = true
    } finally {
      setArticleLoading(false)
    }
  }

  function handleCloseArticle(e: React.MouseEvent) {
    e.stopPropagation()
    setSlideIndex(0)
  }

  return (
    <div
      ref={cardRef}
      className="feed-item relative overflow-hidden bg-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ cursor: isArticleSlide ? 'default' : 'pointer' }}
    >
      {/* ── MEDIA SLIDES ── */}
      {mediaList.length > 0 ? (
        mediaList.map((item, i) => (
          <div
            key={i}
            style={{
              position: 'absolute', inset: 0,
              opacity: i === slideIndex ? 1 : 0,
              transition: 'opacity 0.3s ease',
              pointerEvents: i === slideIndex ? 'auto' : 'none',
            }}
          >
            <MediaSlide item={item} active={i === slideIndex} muted={muted} />
          </div>
        ))
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-slate-900" />
      )}

      {/* ── ARTICLE SLIDE (always last) ── */}
      <div
        style={{
          position: 'absolute', inset: 0,
          opacity: isArticleSlide ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: isArticleSlide ? 'auto' : 'none',
          background: '#ffffff',
          overflowY: 'auto',
          zIndex: 5,
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Back button */}
        <button
          onClick={handleCloseArticle}
          style={{
            position: 'sticky', top: 0, left: 0,
            zIndex: 10, display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)',
            border: 'none', cursor: 'pointer', color: '#333',
            padding: '14px 16px 10px', width: '100%',
            borderBottom: '1px solid #f0f0f0', fontSize: 13, fontWeight: 600,
          }}
        >
          <X size={16} />
          Fechar matéria
        </button>

        <div style={{ padding: '16px 20px 80px' }}>
          {/* Category */}
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: post.category.color, marginBottom: 12, display: 'inline-flex' }}
          >
            {post.category.icon && <span className="mr-1">{post.category.icon}</span>}
            {post.category.name}
          </span>

          {/* Title */}
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#111', lineHeight: 1.3, margin: '8px 0 6px' }}>
            {articleTitle || post.title}
          </h1>

          {/* Meta */}
          <div style={{ display: 'flex', gap: 12, color: '#888', fontSize: 12, marginBottom: 20, alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <User size={12} /> {post.author.name}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={12} />
              {post.publishedAt ? formatRelativeDate(post.publishedAt) : 'Agora'}
            </span>
          </div>

          {/* Content */}
          {articleLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                border: '3px solid #FF3B30', borderTopColor: 'transparent',
                animation: 'spin 0.8s linear infinite',
              }} />
            </div>
          ) : articleContent ? (
            <div
              className="prose-content"
              style={{ color: '#333', fontSize: 15, lineHeight: 1.75 }}
              dangerouslySetInnerHTML={{ __html: articleContent }}
            />
          ) : (
            <p style={{ color: '#999', textAlign: 'center', padding: '40px 0' }}>Carregando conteúdo...</p>
          )}
        </div>
      </div>

      {/* ── Gradient overlay (media only) ── */}
      {!isArticleSlide && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      )}

      {/* ── DOTS ── */}
      {totalSlides > 1 && !isArticleSlide && (
        <div
          style={{
            position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: 5, zIndex: 10,
          }}
          onClick={e => e.stopPropagation()}
        >
          {Array.from({ length: totalSlides }).map((_, i) => {
            const isArticleDot = i === ARTICLE_SLIDE_IDX
            const isActive = i === slideIndex
            return (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setSlideIndex(i) }}
                style={{
                  width: isActive ? 20 : 6,
                  height: 6,
                  borderRadius: 999,
                  background: isActive
                    ? '#fff'
                    : isArticleDot ? 'rgba(255,107,0,0.7)' : 'rgba(255,255,255,0.4)',
                  border: 'none', cursor: 'pointer', padding: 0,
                  transition: 'all 0.25s ease',
                }}
              />
            )
          })}
        </div>
      )}

      {/* ── Mute button ── */}
      {isCurrentVideo && !isArticleSlide && (
        <button
          onClick={toggleMute}
          style={{
            position: 'absolute', top: 52, right: 14, zIndex: 10,
            background: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer',
            color: '#fff', borderRadius: '50%', width: 38, height: 38,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(6px)', fontSize: 17,
          }}
        >
          {muted ? '🔇' : '🔊'}
        </button>
      )}

      {/* ── Like + Share (media only) ── */}
      {!isArticleSlide && (
        <div className="feed-card-actions" style={{
          position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
          zIndex: 10, flexDirection: 'column', alignItems: 'center', gap: 18,
        }}>
          <button
            onClick={handleLike}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              background: 'none', border: 'none', cursor: 'pointer',
              color: liked ? '#FF3B30' : 'rgba(255,255,255,0.9)',
            }}
          >
            <Heart size={26} fill={liked ? '#FF3B30' : 'none'} stroke={liked ? '#FF3B30' : 'currentColor'} strokeWidth={1.8} />
            {likeCount > 0 && (
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>{likeCount}</span>
            )}
          </button>
          <button
            onClick={handleShare}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            <Share2 size={24} strokeWidth={1.8} />
          </button>
        </div>
      )}

      {/* ── Bottom info + "Ver matéria" (media only) ── */}
      {!isArticleSlide && (
        <div className="absolute inset-x-0 bottom-0 p-5 pb-8" style={{ paddingRight: 64 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <div style={{ marginBottom: 10 }}>
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: post.category.color }}
              >
                {post.category.icon && <span className="mr-1">{post.category.icon}</span>}
                {post.category.name}
              </span>
            </div>

            <h2 className="text-white font-bold text-2xl leading-tight line-clamp-3" style={{ marginBottom: 8 }}>
              {post.title}
            </h2>

            <p className="text-white/75 text-sm leading-relaxed line-clamp-2" style={{ marginBottom: 14 }}>
              {post.summary}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                <span className="flex items-center gap-1 text-white/70 text-xs">
                  <User className="w-3 h-3" /> {post.author.name}
                </span>
                <span className="flex items-center gap-1 text-white/70 text-xs">
                  <Clock className="w-3 h-3" />
                  {post.publishedAt ? formatRelativeDate(post.publishedAt) : 'Agora'}
                </span>
              </div>

              <button
                onClick={handleVerMateria}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: '#FF3B30', color: '#fff',
                  border: 'none', cursor: 'pointer',
                  borderRadius: 999, padding: '8px 16px',
                  fontSize: 13, fontWeight: 700, flexShrink: 0,
                  boxShadow: '0 2px 10px rgba(255,59,48,0.4)',
                }}
              >
                Ver matéria <ChevronRight size={13} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
