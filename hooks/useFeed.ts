'use client'

import { useCallback } from 'react'
import useSWRInfinite from 'swr/infinite'
import type { FeedItem } from '@/types'

const fetcher = (url: string) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)
  return fetch(url, { signal: controller.signal })
    .then(r => r.json())
    .finally(() => clearTimeout(timeout))
}

interface FeedPage {
  items: FeedItem[]
  hasMore: boolean
  page: number
}

export function useFeed(category?: string) {
  const getKey = (pageIndex: number, previousPageData: FeedPage | null) => {
    if (previousPageData && !previousPageData.hasMore) return null
    const params = new URLSearchParams({ page: String(pageIndex + 1), limit: '5' })
    if (category) params.set('category', category)
    return `/api/feed?${params}`
  }

  const { data, error, isLoading, size, setSize, isValidating } = useSWRInfinite<FeedPage>(
    getKey,
    fetcher,
    { revalidateFirstPage: false }
  )

  const items = data ? data.flatMap((page) => page.items || []).filter(Boolean) : []
  const hasMore = data ? data[data.length - 1]?.hasMore ?? false : false

  const loadMore = useCallback(() => {
    if (!isValidating && hasMore) setSize(size + 1)
  }, [isValidating, hasMore, setSize, size])

  return { items, isLoading, error, hasMore, loadMore, isValidating }
}
