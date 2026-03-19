'use client'

import { memo, useEffect, useRef, useCallback, useState } from 'react'
import Image from 'next/image'
import { Eye } from 'lucide-react'
import { formatNumber } from '@/lib/utils'
import type { FeedItem, Post, Ad } from '@/types'

interface GridViewProps {
  items: FeedItem[]
  onSelectPost: (postIndex: number) => void
  onLoadMore: () => void
  hasMore: boolean
  isValidating: boolean
  isLoading: boolean
}

interface GridThumbnailProps {
  post: Post
  index: number
  onClick: () => void
}

const GridThumbnail = memo(function GridThumbnail({ post, index, onClick }: GridThumbnailProps) {
  const coverUrl = (() => {
    if (post.media && post.media.length > 0) {
      const firstImage = post.media.find(m => m.type === 'image')
      if (firstImage) return firstImage.url
    }
    if (post.coverImage && !/\.(mp4|mov|webm|m4v)(\?.*)?$/i.test(post.coverImage)) {
      return post.coverImage
    }
    return null
  })()

  return (
    <div className="grid-thumb" onClick={onClick}>
      {coverUrl ? (
        <Image
          src={coverUrl}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, 213px"
          quality={60}
          priority={index < 6}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-slate-900" />
      )}

      <div className="grid-thumb-overlay" />

      <div className="grid-thumb-content">
        <span
          className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold text-white mb-1"
          style={{ backgroundColor: post.category.color }}
        >
          {post.category.icon && <span className="mr-0.5">{post.category.icon}</span>}
          {post.category.name}
        </span>
        <h3 className="text-white font-bold text-xs leading-tight line-clamp-2">
          {post.title}
        </h3>
        <div className="flex items-center gap-1 mt-1">
          <Eye className="w-3 h-3 text-white/60" />
          <span className="text-white/60 text-[10px]">{formatNumber(post.views)}</span>
        </div>
      </div>
    </div>
  )
})

function GridBanner({ ad }: { ad: Ad }) {
  const impressionSent = useRef(false)

  useEffect(() => {
    if (impressionSent.current) return
    impressionSent.current = true
    fetch(`/api/ads/${ad.id}/impression`, { method: 'POST' }).catch(() => {})
  }, [ad.id])

  function handleClick() {
    fetch(`/api/ads/${ad.id}/click`, { method: 'POST' }).catch(() => {})
    window.open(ad.targetUrl, '_blank', 'noopener')
  }

  return (
    <div className="grid-banner-active" onClick={handleClick}>
      <Image
        src={ad.imageUrl}
        alt={ad.title}
        width={640}
        height={120}
        className="w-full h-auto"
        sizes="(max-width: 640px) 100vw, 640px"
        quality={80}
      />
    </div>
  )
}

function BannerPlaceholder() {
  return (
    <div className="grid-banner-placeholder">
      <span className="text-white/25 text-xs font-medium">Espaço publicitário</span>
    </div>
  )
}

function BannerSlot({ ads, index }: { ads: Ad[]; index: number }) {
  if (ads.length === 0) return <BannerPlaceholder />
  const ad = ads[index % ads.length]
  return <GridBanner ad={ad} />
}

export function GridView({ items, onSelectPost, onLoadMore, hasMore, isValidating, isLoading }: GridViewProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [bannerAds, setBannerAds] = useState<Ad[]>([])

  // Fetch grid banner ads
  useEffect(() => {
    fetch('/api/ads?position=GRID_BANNER')
      .then(r => r.json())
      .then((ads: Ad[]) => {
        if (Array.isArray(ads)) setBannerAds(ads)
      })
      .catch(() => {})
  }, [])

  // Infinite scroll observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry.isIntersecting && hasMore && !isValidating) onLoadMore()
    },
    [hasMore, isValidating, onLoadMore]
  )

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 })
    if (sentinelRef.current) observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [handleObserver])

  // Separate posts from ads, keep track of original indices
  const postItems: { post: Post; originalIndex: number }[] = []
  items.forEach((item, i) => {
    if (item.type === 'post') {
      postItems.push({ post: item.data as Post, originalIndex: i })
    }
  })

  if (isLoading && postItems.length === 0) {
    return (
      <div className="grid-layout">
        <div className="grid-banner-top">
          <BannerPlaceholder />
        </div>
        <div className="grid-content">
          <div className="grid-view">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="grid-skeleton" />
            ))}
          </div>
        </div>
        <div className="grid-banner-bottom">
          <BannerPlaceholder />
        </div>
      </div>
    )
  }

  return (
    <div className="grid-layout">
      {/* Banner TOPO — fixo */}
      <div className="grid-banner-top">
        <BannerSlot ads={bannerAds} index={0} />
      </div>

      {/* Thumbnails — scrollable entre os banners */}
      <div className="grid-content">
        <div className="grid-view">
          {postItems.map(({ post, originalIndex }, j) => (
            <GridThumbnail
              key={post.id}
              post={post}
              index={j}
              onClick={() => onSelectPost(originalIndex)}
            />
          ))}
        </div>

        {/* Sentinel + loading */}
        <div ref={sentinelRef} className="py-4 flex items-center justify-center">
          {isValidating ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
              <span className="text-white/40 text-xs">Carregando...</span>
            </div>
          ) : !hasMore && postItems.length > 0 ? (
            <p className="text-white/30 text-xs">Você viu tudo por hoje!</p>
          ) : null}
        </div>
      </div>

      {/* Banner INFERIOR — fixo */}
      <div className="grid-banner-bottom">
        <BannerSlot ads={bannerAds} index={1} />
      </div>
    </div>
  )
}
