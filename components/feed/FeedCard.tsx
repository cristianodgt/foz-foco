'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Clock, User, Heart, Share2, ChevronRight } from 'lucide-react'
import { formatRelativeDate } from '@/lib/utils'
import type { Post } from '@/types'

interface FeedCardProps {
  post: Post
  index: number
  onOpen?: (slug: string) => void
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
    if (active) {
      videoRef.current.play().catch(() => {})
    } else {
      videoRef.current.pause()
    }
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

export function FeedCard({ post, index, onOpen = () => {}, onVisible }: FeedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [muted, setMuted] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [slideIndex, setSlideIndex] = useState(0)

  // Build media list: prefer post.media array, fallback to coverImage
  const mediaList: { url: string; type: 'image' | 'video' }[] = (() => {
    if (post.media && post.media.length > 0) return post.media
    if (post.coverImage) {
      const isVideo = /\.(mp4|mov|webm|m4v)(\?.*)?$/i.test(post.coverImage)
      return [{ url: post.coverImage, type: isVideo ? 'video' : 'image' }]
    }
    return []
  })()

  const hasMultiple = mediaList.length > 1
  const currentMedia = mediaList[slideIndex]
  const isCurrentVideo = currentMedia?.type === 'video'

  // Touch swipe state
  const touchStart = useRef<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return
    const diff = touchStart.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) {
      if (diff > 0) setSlideIndex(i => Math.min(i + 1, mediaList.length - 1))
      else setSlideIndex(i => Math.max(i - 1, 0))
    }
    touchStart.current = null
  }

  // Preload on visible
  useEffect(() => {
    if (!onVisible || !cardRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onVisible(post.slug) },
      { threshold: 0.3 }
    )
    observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [onVisible, post.slug])

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
    if (navigator.share) {
      navigator.share({ title: post.title, url }).catch(() => {})
    } else {
      navigator.clipboard.writeText(url).catch(() => {})
    }
  }

  return (
    <div
      ref={cardRef}
      className="feed-item relative overflow-hidden bg-black"
      onClick={() => onOpen(post.slug)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ cursor: 'pointer' }}
    >
      {/* Background media */}
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

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      {/* Slide dots — top center, only if multiple media */}
      {hasMultiple && (
        <div
          style={{
            position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: 5, zIndex: 10,
          }}
          onClick={e => e.stopPropagation()}
        >
          {mediaList.map((_, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); setSlideIndex(i) }}
              style={{
                width: i === slideIndex ? 20 : 6,
                height: 6,
                borderRadius: 999,
                background: i === slideIndex ? '#fff' : 'rgba(255,255,255,0.4)',
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'all 0.25s ease',
              }}
            />
          ))}
        </div>
      )}

      {/* Mute button — only for videos */}
      {isCurrentVideo && (
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

      {/* Like + Share */}
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

      {/* Bottom content */}
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
              onClick={(e) => { e.stopPropagation(); onOpen(post.slug) }}
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
    </div>
  )
}
