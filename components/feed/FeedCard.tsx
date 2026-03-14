'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Clock, User } from 'lucide-react'
import { formatRelativeDate } from '@/lib/utils'
import type { Post } from '@/types'

interface FeedCardProps {
  post: Post
  index: number
}

export function FeedCard({ post, index }: FeedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={cardRef} className="feed-item relative overflow-hidden bg-black">
      {/* Background media (image or video) */}
      {post.coverImage ? (
        /\.(mp4|mov|webm|m4v)(\?.*)?$/i.test(post.coverImage) ? (
          <video
            src={post.coverImage}
            autoPlay
            muted
            loop
            playsInline
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

      {/* Content */}
      <Link href={`/${post.slug}`} className="absolute inset-0 flex flex-col justify-end p-5 pb-8">
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

          {/* Meta */}
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
        </motion.div>
      </Link>
    </div>
  )
}
