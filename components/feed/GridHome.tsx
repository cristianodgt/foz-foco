'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFeed } from '@/hooks/useFeed'
import { GridView } from './GridView'
import { FeedContainer } from './FeedContainer'
import type { FeedItem } from '@/types'

interface GridHomeProps {
  initialItems?: FeedItem[]
  category?: string
}

export function GridHome({ initialItems = [], category }: GridHomeProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'reels'>('grid')
  const [startIndex, setStartIndex] = useState(0)
  const gridScrollRef = useRef(0)
  const gridContainerRef = useRef<HTMLDivElement>(null)

  const { items, isLoading, error, hasMore, loadMore, isValidating } = useFeed(category, initialItems)
  const allItems = items.length > 0 ? items : initialItems

  const handleSelectPost = useCallback((itemIndex: number) => {
    // Save grid scroll position (from .grid-content inside GridView)
    const gridContent = gridContainerRef.current?.querySelector('.grid-content')
    if (gridContent) {
      gridScrollRef.current = gridContent.scrollTop
    }
    setStartIndex(itemIndex)
    setViewMode('reels')
    // Push history state so browser back button works
    window.history.pushState({ view: 'reels' }, '')
  }, [])

  const handleBack = useCallback(() => {
    setViewMode('grid')
    // Restore grid scroll position after paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const gridContent = gridContainerRef.current?.querySelector('.grid-content')
        if (gridContent) {
          gridContent.scrollTop = gridScrollRef.current
        }
      })
    })
  }, [])

  // Listen to browser back button
  useEffect(() => {
    const handlePop = () => {
      if (viewMode === 'reels') {
        handleBack()
      }
    }
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [viewMode, handleBack])

  return (
    <AnimatePresence mode="wait">
      {viewMode === 'grid' && (
        <motion.div
          key="grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          ref={gridContainerRef}
          className="grid-home"
        >
          <GridView
            items={allItems}
            onSelectPost={handleSelectPost}
            onLoadMore={loadMore}
            hasMore={hasMore}
            isValidating={isValidating}
            isLoading={isLoading}
          />
        </motion.div>
      )}

      {viewMode === 'reels' && (
        <motion.div
          key="reels"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <FeedContainer
            externalItems={allItems}
            startIndex={startIndex}
            onBack={handleBack}
            externalLoadMore={loadMore}
            externalHasMore={hasMore}
            externalIsValidating={isValidating}
            category={category}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
