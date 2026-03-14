'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import type { Ad } from '@/types'

interface AdCardProps {
  ad: Ad
}

export function AdCard({ ad }: AdCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const impressionRegistered = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !impressionRegistered.current) {
            impressionRegistered.current = true
            fetch(`/api/ads/${ad.id}/impression`, { method: 'POST' }).catch(() => {})
          }
        })
      },
      { threshold: 0.5 }
    )

    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [ad.id])

  const handleClick = () => {
    fetch(`/api/ads/${ad.id}/click`, { method: 'POST' }).catch(() => {})
    window.open(ad.targetUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div ref={cardRef} className="feed-item relative overflow-hidden bg-black cursor-pointer" onClick={handleClick}>
      {/* Ad image */}
      <Image
        src={ad.imageUrl}
        alt={ad.title}
        fill
        className="object-cover"
        sizes="(max-width: 480px) 100vw, 480px"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30" />

      {/* Publicidade badge */}
      <div className="absolute top-16 right-4 bg-black/60 backdrop-blur-sm text-white/70 text-xs px-2 py-1 rounded-full font-medium">
        Publicidade
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 pb-8">
        <div className="space-y-3">
          <span className="text-orange-400 text-xs font-semibold uppercase tracking-wider">
            {ad.client}
          </span>
          <h2 className="text-white font-bold text-2xl leading-tight">
            {ad.title}
          </h2>
          <button className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-full text-sm transition-colors">
            Saiba mais <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
