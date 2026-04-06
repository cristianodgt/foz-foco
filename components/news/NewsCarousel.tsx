'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import type { Post } from '@/types'

function getCover(post: Post): string | null {
  if (post.coverImage && !/\.(mp4|mov|webm)(\?.*)?$/i.test(post.coverImage)) return post.coverImage
  if (Array.isArray(post.media)) {
    const img = post.media.find((m: { type: string; url: string }) => m.type === 'image')
    if (img) return img.url
  }
  return null
}

interface NewsCarouselProps {
  posts: Post[]
  perPage?: number
  interval?: number
}

export function NewsCarousel({ posts, perPage = 3, interval = 5000 }: NewsCarouselProps) {
  const [page, setPage] = useState(0)

  const totalPages = Math.ceil(posts.length / perPage)

  useEffect(() => {
    if (totalPages <= 1) return
    const id = setInterval(() => setPage(p => (p + 1) % totalPages), interval)
    return () => clearInterval(id)
  }, [totalPages, interval])

  const visible = posts.slice(page * perPage, page * perPage + perPage)

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {visible.map(post => {
            const cover = getCover(post)
            return (
              <Link
                key={post.id}
                href={`/${post.slug}`}
                className="group block overflow-hidden rounded-2xl bg-surface ring-1 ring-on-surface/5 shadow-[0_2px_12px_-4px_rgba(26,26,46,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-12px_rgba(26,26,46,0.25)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-surface-container">
                  {cover && (
                    <Image
                      src={cover}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-headline font-bold text-sm leading-snug text-on-surface transition-colors group-hover:text-primary line-clamp-2">
                    {post.title}
                  </h3>
                </div>
              </Link>
            )
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
