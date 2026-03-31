'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import type { Ad } from '@/types'

export function AdBannerTop() {
  const [ad, setAd] = useState<Ad | null>(null)
  const impressionSent = useRef(false)

  useEffect(() => {
    fetch('/api/ads?position=GRID_BANNER_TOP')
      .then(r => r.ok ? r.json() : [])
      .then((ads: Ad[]) => { if (ads[0]) setAd(ads[0]) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (ad && !impressionSent.current) {
      impressionSent.current = true
      fetch(`/api/ads/${ad.id}/impression`, { method: 'POST' }).catch(() => {})
    }
  }, [ad])

  const handleClick = () => {
    if (!ad) return
    fetch(`/api/ads/${ad.id}/click`, { method: 'POST' }).catch(() => {})
    window.open(ad.targetUrl, '_blank', 'noopener,noreferrer')
  }

  if (!ad) return null

  return (
    <div className="ad-banner-wrapper">
      <div
        className="relative w-full cursor-pointer"
        style={{ height: 90, maxWidth: 970, margin: '0 auto' }}
        onClick={handleClick}
      >
        <Image
          src={ad.imageUrl}
          alt={ad.title}
          fill
          className="object-cover"
          sizes="(max-width: 728px) 100vw, 970px"
        />
      </div>
    </div>
  )
}
