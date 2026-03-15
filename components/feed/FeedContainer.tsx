'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import Link from 'next/link'
import { Home, Search, Newspaper, Heart, Share2, ChevronUp, ChevronDown } from 'lucide-react'
import { FeedCard } from './FeedCard'
import { AdCard } from './AdCard'
import { ArticleInline } from './ArticleInline'
import { Skeleton } from '@/components/ui/skeleton'
import { useFeed } from '@/hooks/useFeed'
import type { FeedItem, Post } from '@/types'

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
  const { items, isLoading, error, hasMore, loadMore, isValidating } = useFeed(category)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [openSlug, setOpenSlug] = useState<string | null>(null)
  const [visibleSlug, setVisibleSlug] = useState<string | null>(null)
  const [desktopLikes, setDesktopLikes] = useState<Map<string, { liked: boolean; count: number }>>(new Map())

  // Preload cache: slug → article data
  const preloadCache = useRef<Map<string, ArticleData>>(new Map())
  const preloading = useRef<Set<string>>(new Set())

  const allItems = items.length > 0 ? items : initialItems
  const validItems = allItems.filter((item) => item && item.type && item.data)

  const postItems = validItems.filter((i): i is { type: 'post'; data: Post } => i.type === 'post')
  const visibleIndex = visibleSlug ? postItems.findIndex(i => i.data.slug === visibleSlug) : -1
  const desktopLikeState = visibleSlug
    ? desktopLikes.get(visibleSlug) || { liked: false, count: 0 }
    : { liked: false, count: 0 }

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

  function handleVisible(slug: string) {
    setVisibleSlug(slug)
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

  function toggleDesktopLike(slug: string) {
    setDesktopLikes(prev => {
      const next = new Map(prev)
      const cur = next.get(slug) || { liked: false, count: 0 }
      next.set(slug, { liked: !cur.liked, count: cur.liked ? cur.count - 1 : cur.count + 1 })
      return next
    })
  }

  function handleDesktopShare(slug: string) {
    const url = `${window.location.origin}/${slug}`
    if (navigator.share) navigator.share({ url }).catch(() => {})
    else navigator.clipboard.writeText(url).catch(() => {})
  }

  function scrollToPostIndex(index: number) {
    if (!containerRef.current) return
    containerRef.current.scrollTo({ top: index * containerRef.current.clientHeight, behavior: 'smooth' })
  }

  function scrollPrev() {
    if (visibleIndex > 0) scrollToPostIndex(visibleIndex - 1)
  }

  function scrollNext() {
    if (visibleIndex < postItems.length - 1) scrollToPostIndex(visibleIndex + 1)
  }

  if (error && allItems.length === 0) {
    return (
      <div className="feed-wrapper">
        <div className="feed-sidebar" />
        <div className="feed-container">
          <div className="feed-item flex flex-col items-center justify-center bg-black gap-4">
            <p className="text-white/40 text-4xl">📡</p>
            <p className="text-white/50 text-sm text-center px-8">Não foi possível carregar as notícias.<br />Verifique sua conexão e tente novamente.</p>
            <button
              onClick={() => window.location.reload()}
              style={{ background: '#FF3B30', color: '#fff', border: 'none', borderRadius: 999, padding: '10px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
            >
              Tentar novamente
            </button>
          </div>
        </div>
        <div className="feed-actions" />
      </div>
    )
  }

  if (isLoading && allItems.length === 0) {
    return (
      <div className="feed-wrapper">
        <div className="feed-sidebar" />
        <div className="feed-container">
          {[1, 2, 3].map((i) => (
            <div key={i} className="feed-item bg-gray-900">
              <Skeleton className="h-full w-full bg-gray-800" />
            </div>
          ))}
        </div>
        <div className="feed-actions" />
      </div>
    )
  }

  return (
    <div className="feed-wrapper">

      {/* Desktop left sidebar */}
      <div className="feed-sidebar">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
          <Newspaper size={26} style={{ color: '#FF3B30' }} />
        </Link>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
          <Link href="/" className="feed-sidebar-icon active" title="Início">
            <Home size={22} />
          </Link>
          <Link href="/busca" className="feed-sidebar-icon" title="Buscar">
            <Search size={22} />
          </Link>
        </div>
      </div>

      {/* Feed column */}
      <div ref={containerRef} className="feed-container">
        {validItems.map((item, index) => (
          <div key={`${item.type}-${item.data.id}`}>
            <div className="feed-item">
              {item.type === 'post' ? (
                <FeedCard
                  post={item.data}
                  index={index}
                  onOpen={handleOpen}
                  onVisible={handleVisible}
                />
              ) : (
                <AdCard ad={item.data} />
              )}
            </div>

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

      {/* Desktop right actions */}
      <div className="feed-actions">
        <button
          className="feed-action-btn"
          onClick={() => visibleSlug && toggleDesktopLike(visibleSlug)}
          style={{ color: desktopLikeState.liked ? '#FF3B30' : 'rgba(255,255,255,0.85)' }}
        >
          <Heart
            size={28}
            fill={desktopLikeState.liked ? '#FF3B30' : 'none'}
            stroke={desktopLikeState.liked ? '#FF3B30' : 'currentColor'}
            strokeWidth={1.8}
          />
          {desktopLikeState.count > 0 && (
            <span style={{ fontSize: 11, fontWeight: 600 }}>{desktopLikeState.count}</span>
          )}
        </button>

        <button
          className="feed-action-btn"
          onClick={() => visibleSlug && handleDesktopShare(visibleSlug)}
        >
          <Share2 size={26} strokeWidth={1.8} />
        </button>

        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.12)', margin: '8px 0' }} />

        <button
          className="feed-action-btn"
          onClick={scrollPrev}
          disabled={visibleIndex <= 0}
          title="Anterior"
        >
          <ChevronUp size={26} strokeWidth={2} />
        </button>

        <button
          className="feed-action-btn"
          onClick={scrollNext}
          disabled={visibleIndex < 0 || visibleIndex >= postItems.length - 1}
          title="Próxima"
        >
          <ChevronDown size={26} strokeWidth={2} />
        </button>
      </div>

    </div>
  )
}
