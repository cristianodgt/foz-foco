'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { FeedCard } from './FeedCard'
import { AdCard } from './AdCard'
import { ArticleOverlay } from './ArticleOverlay'
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
  const [openIndex, setOpenIndex] = useState<number | null>(null)

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

  const postItems = validItems.filter(item => item.type === 'post')

  const openSlug = openIndex !== null
    ? postItems[openIndex]?.data?.slug ?? null
    : null

  function handleOpen(slug: string) {
    const idx = postItems.findIndex(item => item.data.slug === slug)
    setOpenIndex(idx >= 0 ? idx : null)
  }

  function handleClose() {
    setOpenIndex(null)
  }

  function handleNext() {
    if (openIndex !== null && openIndex < postItems.length - 1) {
      setOpenIndex(openIndex + 1)
    } else {
      setOpenIndex(null)
    }
  }

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

  return (
    <>
      <div className="feed-container">
        {validItems.map((item, index) => (
          <div key={`${item.type}-${item.data.id}`} className="feed-item">
            {item.type === 'post' ? (
              <FeedCard post={item.data} index={index} onOpen={handleOpen} />
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

      {openSlug && (
        <ArticleOverlay
          slug={openSlug}
          onClose={handleClose}
          onNext={handleNext}
          hasNext={openIndex !== null && openIndex < postItems.length - 1}
        />
      )}
    </>
  )
}
