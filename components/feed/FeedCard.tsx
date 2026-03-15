'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Clock, User, Heart, Share2, ChevronRight } from 'lucide-react'
import { formatRelativeDate } from '@/lib/utils'
import type { Post } from '@/types'

interface FeedCardProps {
  post: Post
  index: number
  onOpen?: (slug: string) => void
}

export function FeedCard({ post, index, onOpen = () => {} }: FeedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  const isVideo = post.coverImage
    ? /\.(mp4|mov|webm|m4v)(\?.*)?$/i.test(post.coverImage)
    : false

  function toggleMute(e: React.MouseEvent) {
    e.stopPropagation()
    setMuted(m => {
      if (videoRef.current) videoRef.current.muted = !m
      return !m
    })
  }

  function handleLike(e: React.MouseEvent) {
    e.stopPropagation()
    setLiked(l => !l)
    setLikeCount(c => liked ? c - 1 : c + 1)
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
      style={{ cursor: 'pointer' }}
    >
      {/* Background media */}
      {post.coverImage ? (
        isVideo ? (
          <video
            ref={videoRef}
            src={post.coverImage}
            autoPlay muted={muted} loop playsInline
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority={index < 2}
            sizes="(max-width: 480px) 100vw, 480px"
          />
        )
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-slate-900" />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10" />

      {/* Mute button — only for videos */}
      {isVideo && (
        <button
          onClick={toggleMute}
          style={{
            position: 'absolute', top: 56, right: 14, zIndex: 10,
            background: 'rgba(0,0,0,0.45)', border: 'none', cursor: 'pointer',
            color: '#fff', borderRadius: '50%', width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(6px)', fontSize: 16,
          }}
        >
          {muted ? '🔇' : '🔊'}
        </button>
      )}

      {/* Like + Share — right side */}
      <div style={{
        position: 'absolute', right: 14, bottom: 90, zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
      }}>
        <button
          onClick={handleLike}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            background: 'none', border: 'none', cursor: 'pointer',
            color: liked ? '#FF3B30' : 'rgba(255,255,255,0.85)',
          }}
        >
          <Heart size={22} fill={liked ? '#FF3B30' : 'none'} stroke={liked ? '#FF3B30' : 'currentColor'} />
          {likeCount > 0 && (
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>{likeCount}</span>
          )}
        </button>

        <button
          onClick={handleShare}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.85)',
          }}
        >
          <Share2 size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-5 pb-8" style={{ paddingRight: 60 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className="space-y-3"
        >
          {/* Category chip */}
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: post.category.color }}
          >
            {post.category.icon && <span className="mr-1">{post.category.icon}</span>}
            {post.category.name}
          </span>

          {/* Title */}
          <h2 className="text-white font-bold text-2xl leading-tight line-clamp-3">
            {post.title}
          </h2>

          {/* Summary */}
          <p className="text-white/75 text-sm leading-relaxed line-clamp-2">
            {post.summary}
          </p>

          {/* Meta + Ver matéria */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="flex items-center gap-4 text-white/60 text-xs">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {post.author.name}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.publishedAt ? formatRelativeDate(post.publishedAt) : 'Agora'}
              </span>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); onOpen(post.slug) }}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer',
                color: '#fff', borderRadius: 999, padding: '5px 12px',
                fontSize: 12, fontWeight: 600, backdropFilter: 'blur(6px)',
                flexShrink: 0,
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
