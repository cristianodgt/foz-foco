'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { FeedCard } from './FeedCard'
import { AdCard } from './AdCard'
import { Skeleton } from '@/components/ui/skeleton'
import { useFeed } from '@/hooks/useFeed'
import { LayoutGrid } from 'lucide-react'
import type { FeedItem, Ad } from '@/types'

interface FeedContainerProps {
  initialItems?: FeedItem[]
  category?: string
  externalItems?: FeedItem[]
  startIndex?: number
  onBack?: () => void
  externalLoadMore?: () => void
  externalHasMore?: boolean
  externalIsValidating?: boolean
}

export function FeedContainer({
  initialItems = [],
  category,
  externalItems,
  startIndex,
  onBack,
  externalLoadMore,
  externalHasMore,
  externalIsValidating,
}: FeedContainerProps) {
  const useExternal = !!externalItems
  const internalFeed = useFeed(useExternal ? '__skip__' : category)
  const items = useExternal ? externalItems : internalFeed.items
  const isLoading = useExternal ? false : internalFeed.isLoading
  const error = useExternal ? undefined : internalFeed.error
  const hasMore = useExternal ? (externalHasMore ?? false) : internalFeed.hasMore
  const loadMore = useExternal ? (externalLoadMore ?? (() => {})) : internalFeed.loadMore
  const isValidating = useExternal ? (externalIsValidating ?? false) : internalFeed.isValidating

  const loadMoreRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrolledToStart = useRef(false)
  const [feedTopAd, setFeedTopAd] = useState<Ad | null>(null)

  useEffect(() => {
    fetch('/api/ads?position=FEED_TOP')
      .then(r => r.ok ? r.json() : [])
      .then((data: Ad[]) => { if (data[0]) setFeedTopAd(data[0]) })
      .catch(() => {})
  }, [])

  const allItems = items.length > 0 ? items : initialItems

  useEffect(() => {
    if (startIndex != null && startIndex > 0 && containerRef.current && !scrolledToStart.current) {
      scrolledToStart.current = true
      containerRef.current.scrollTo({
        top: startIndex * window.innerHeight,
        behavior: 'instant' as ScrollBehavior,
      })
    }
  }, [startIndex])

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

  if (error && allItems.length === 0) {
    return (
      <div className="feed-wrapper">
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
      </div>
    )
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
      {onBack && (
        <button className="back-to-grid" onClick={onBack} aria-label="Voltar à grade">
          <LayoutGrid size={20} />
        </button>
      )}
      <div ref={containerRef} className="feed-container">
        {feedTopAd && (
          <div className="feed-item">
            <AdCard ad={feedTopAd} />
          </div>
        )}
        {validItems.map((item, index) => (
          <div key={`${item.type}-${item.data.id}-${index}`} className="feed-item">
            {item.type === 'post' ? (
              <FeedCard post={item.data} index={index} />
            ) : (
              <AdCard ad={item.data} />
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
