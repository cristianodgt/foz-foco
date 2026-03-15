'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { FeedCard } from './FeedCard'
import { AdCard } from './AdCard'
import { ArticleInline } from './ArticleInline'
import { Skeleton } from '@/components/ui/skeleton'
import { useFeed } from '@/hooks/useFeed'
import type { FeedItem } from '@/types'

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

interface FeedContainerProps {
  initialItems?: FeedItem[]
  category?: string
}

export function FeedContainer({ initialItems = [], category }: FeedContainerProps) {
  const { items, isLoading, hasMore, loadMore, isValidating } = useFeed(category)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [openSlug, setOpenSlug] = useState<string | null>(null)

  // Preload cache: slug → article data
  const preloadCache = useRef<Map<string, ArticleData>>(new Map())
  const preloading = useRef<Set<string>>(new Set())

  const allItems = items.length > 0 ? items : initialItems
  const validItems = allItems.filter((item) => item && item.type && item.data)

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry.isIntersecting && hasMore && !isValidating) loadMore()
    },
    [hasMore, isValidating, loadMore]
  )

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 })
    if (loadMoreRef.current) observer.observe(loadMoreRef.current)
    return () => observer.disconnect()
  }, [handleObserver])

  // Disable/enable scroll-snap when article is open
  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.style.scrollSnapType = openSlug ? 'none' : 'y mandatory'
  }, [openSlug])

  function prefetch(slug: string) {
    if (preloadCache.current.has(slug) || preloading.current.has(slug)) return
    preloading.current.add(slug)
    fetch(`/api/posts/${slug}`)
      .then(r => r.json())
      .then(data => {
        preloadCache.current.set(slug, data)
        preloading.current.delete(slug)
      })
      .catch(() => preloading.current.delete(slug))
  }

  function scrollToArticle(slug: string) {
    // After render, scroll feed container so the inline article is visible
    setTimeout(() => {
      const el = document.getElementById(`article-inline-${slug}`)
      if (el && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const elRect = el.getBoundingClientRect()
        const offset = elRect.top - containerRect.top
        containerRef.current.scrollBy({ top: offset, behavior: 'smooth' })
      }
    }, 60)
  }

  function handleOpen(slug: string) {
    if (!preloadCache.current.has(slug)) {
      fetch(`/api/posts/${slug}`)
        .then(r => r.json())
        .then(data => {
          preloadCache.current.set(slug, data)
          setOpenSlug(slug)
          scrollToArticle(slug)
        })
      return
    }
    setOpenSlug(slug)
    scrollToArticle(slug)
  }

  function handleClose() {
    setOpenSlug(null)
  }

  if (isLoading && allItems.length === 0) {
    return (
      <div className="feed-wrapper">
        <div className="feed-container">
          {[1, 2, 3].map((i) => (
            <div key={i} className="feed-item bg-gray-900">
              <Skeleton className="h-full w-full bg-gray-800" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="feed-wrapper">
      <div ref={containerRef} className="feed-container">
        {validItems.map((item, index) => (
          <div key={`${item.type}-${item.data.id}`}>
            {/* The card itself — always 100dvh */}
            <div className="feed-item">
              {item.type === 'post' ? (
                <FeedCard
                  post={item.data}
                  index={index}
                  onOpen={handleOpen}
                  onVisible={prefetch}
                />
              ) : (
                <AdCard ad={item.data} />
              )}
            </div>

            {/* Inline article — only for the open slug, right below its card */}
            {item.type === 'post' && openSlug === item.data.slug && preloadCache.current.has(item.data.slug) && (
              <ArticleInline
                id={`article-inline-${item.data.slug}`}
                post={preloadCache.current.get(item.data.slug)!}
                onClose={handleClose}
              />
            )}
          </div>
        ))}

        <div ref={loadMoreRef} className="feed-item flex items-center justify-center bg-black">
          {isValidating ? (
            <div className="flex flex-col items-center gap-3 text-white/50">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
              <span className="text-sm">Carregando mais notícias...</span>
            </div>
          ) : !hasMore ? (
            <div className="text-white/30 text-sm text-center p-8">
              <p className="text-2xl mb-2">📰</p>
              <p>Você leu tudo por hoje!</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
