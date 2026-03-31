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

  return (
    <div className="ad-banner-wrapper">
      <span className="ad-label-center">Publicidade</span>
      <div
        className="relative w-full cursor-pointer"
        style={{ height: 90, maxWidth: 970, margin: '0 auto' }}
        onClick={ad ? handleClick : undefined}
      >
        {ad ? (
          <Image
            src={ad.imageUrl}
            alt={ad.title}
            fill
            className="object-cover"
            sizes="(max-width: 728px) 100vw, 970px"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'var(--color-ad-bg)', border: '1px dashed var(--color-ad-border)' }}
          >
            <span style={{ fontSize: 12, color: 'var(--color-ad-label)' }}>
              728 x 90 — Espaco publicitario
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
