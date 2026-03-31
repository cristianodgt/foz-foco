'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import type { Ad } from '@/types'

export function AdInlineBanner() {
  const [ad, setAd] = useState<Ad | null>(null)
  const impressionSent = useRef(false)

  useEffect(() => {
    fetch('/api/ads?position=INLINE_BANNER')
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

  return (
    <div className="ad-banner-wrapper" style={{ borderRadius: 6, margin: '24px 0' }}>
      <div
        className="relative w-full cursor-pointer"
        style={{ height: 90, borderRadius: 4, overflow: 'hidden' }}
        onClick={ad ? handleClick : undefined}
      >
        {ad ? (
          <Image
            src={ad.imageUrl}
            alt={ad.title}
            fill
            className="object-cover"
            sizes="100vw"
          />
        ) : null}
      </div>
    </div>
  )
}
