'use client'

import { useEffect, useRef, useCallback } from 'react'
import { FeedCard } from './FeedCard'
import { AdCard } from './AdCard'
import { Skeleton } from '@/components/ui/skeleton'
import { useFeed } from '@/hooks/useFeed'
import type { FeedItem } from '@/types'

interface FeedContainerProps {
  initialItems?: FeedItem[]
  category?: string
}

export function FeedContainer({ initialItems = [], category }: FeedContainerProps) {
  const { items, isLoading, hasMore, loadMore, isValidating } = useFeed(category)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const allItems = items.length > 0 ? items : initialItems

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

  if (isLoading && allItems.length === 0) {
    return (
      <div className="feed-container">
        {[1, 2, 3].map((i) => (
          <div key={i} className="feed-item bg-gray-900">
            <Skeleton className="h-full w-full bg-gray-800" />
          </div>
        ))}
      </div>
    )
  }

  const validItems = allItems.filter((item) => item && item.type && item.data)

  return (
    <div className="feed-container">
      {validItems.map((item, index) => (
        <div key={`${item.type}-${item.data.id}`} className="feed-item">
          {item.type === 'post' ? (
            <FeedCard post={item.data} index={index} />
          ) : (
            <AdCard ad={item.data} />
          )}
        </div>
      ))}

      {/* Trigger for loading more */}
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
  )
}
