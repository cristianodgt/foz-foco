'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { Ad, AdPosition } from '@/types'

export type AdFormat =
  | 'leaderboard'
  | 'rectangle'
  | 'halfpage'
  | 'mobileBanner'
  | 'inline'

export interface AdSlotProps {
  format: AdFormat
  position: AdPosition
  className?: string
  placeholder?: { phone?: string; message?: string }
  /**
   * Optional index when /api/ads?position= returns multiple ads for the same
   * position. Used by the Sidebar where halfpage and rectangle both fetch
   * SIDEBAR position — halfpage picks [0], rectangle picks [1].
   */
  index?: number
}

interface Dim {
  w: number
  h: number
  box: string
  wrapper: string
  sizes: string
}

const DIMENSIONS: Record<AdFormat, Dim> = {
  leaderboard: {
    w: 728,
    h: 90,
    box: 'w-[728px] max-w-full h-[90px]',
    wrapper: 'flex justify-center',
    sizes: '(max-width: 728px) 100vw, 728px',
  },
  rectangle: {
    w: 300,
    h: 250,
    box: 'w-[300px] h-[250px] mx-auto',
    wrapper: 'flex justify-center',
    sizes: '300px',
  },
  halfpage: {
    w: 300,
    h: 600,
    box: 'w-[300px] h-[600px] mx-auto',
    wrapper: 'flex justify-center',
    sizes: '300px',
  },
  mobileBanner: {
    w: 320,
    h: 90,
    box: 'w-full h-[90px]',
    wrapper: 'flex justify-center',
    sizes: '100vw',
  },
  inline: {
    w: 300,
    h: 250,
    box: 'w-full h-[250px]',
    wrapper: 'flex justify-center',
    sizes: '100vw',
  },
}

interface PlaceholderProps {
  format: AdFormat
  phone?: string
  message?: string
}

/**
 * AdSlotPlaceholder — dashed PUBLICIDADE placeholder (no fetch).
 * Exported for SSR contexts and as a skeleton while AdSlot loads.
 */
export function AdSlotPlaceholder({
  format,
  phone = '(45) 99999-9999',
  message,
}: PlaceholderProps) {
  const dim = DIMENSIONS[format]
  const label = message ?? `[ ${dim.w}×${dim.h} — Espaço disponível: ${phone} ]`
  return (
    <div
      className={`relative border-2 border-dashed border-outline-variant bg-surface-container flex items-center justify-center rounded-sm ${dim.box}`}
    >
      <span className="absolute top-1 left-2 text-[8px] font-bold bg-tertiary-fixed text-on-tertiary-fixed px-1 rounded-sm font-label tracking-widest">
        PUBLICIDADE
      </span>
      <span className="text-outline text-xs italic font-label text-center px-4">
        {label}
      </span>
    </div>
  )
}

/**
 * AdSlot — unified IAB ad slot.
 *
 * Fetches `/api/ads?position={position}`, picks index `index` (default 0),
 * tracks one impression on mount and a click via `/api/ads/:id/click` before
 * opening the ad. Falls back to <AdSlotPlaceholder> on empty / loading / error.
 *
 * The component is a client component because tracking must fire in the
 * browser and the endpoint is position-filtered at request time.
 */
export function AdSlot({
  format,
  position,
  className,
  placeholder,
  index = 0,
}: AdSlotProps) {
  const [ad, setAd] = useState<Ad | null>(null)
  const [errored, setErrored] = useState(false)
  const impressionSent = useRef(false)
  const dim = DIMENSIONS[format]

  useEffect(() => {
    let cancelled = false
    fetch(`/api/ads?position=${position}`)
      .then(r => (r.ok ? r.json() : []))
      .then((data: Ad | Ad[]) => {
        if (cancelled) return
        if (Array.isArray(data)) {
          setAd(data[index] ?? data[0] ?? null)
        } else if (data && typeof data === 'object') {
          setAd(data as Ad)
        }
      })
      .catch(() => {
        if (!cancelled) setErrored(true)
      })
    return () => {
      cancelled = true
    }
  }, [position, index])

  useEffect(() => {
    if (ad && !impressionSent.current) {
      impressionSent.current = true
      fetch(`/api/ads/${ad.id}/impression`, { method: 'POST' }).catch(() => {})
    }
  }, [ad])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ad) return
    const url = `/api/ads/${ad.id}/click`
    try {
      if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
        navigator.sendBeacon(url)
      } else {
        fetch(url, { method: 'POST', keepalive: true }).catch(() => {})
      }
    } catch {
      // swallow — never block navigation on tracking errors
    }
    // let default navigation proceed (target=_blank)
    void e
  }

  const outerCls = `${dim.wrapper} ${className ?? ''}`.trim()

  if (!ad || errored) {
    return (
      <div className={outerCls}>
        <AdSlotPlaceholder
          format={format}
          phone={placeholder?.phone}
          message={placeholder?.message}
        />
      </div>
    )
  }

  return (
    <div className={outerCls}>
      <a
        href={ad.targetUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={handleClick}
        className={`relative block overflow-hidden rounded-sm ${dim.box}`}
        aria-label={ad.title}
      >
        <Image
          src={ad.imageUrl}
          alt={ad.title}
          fill
          className="object-cover"
          sizes={dim.sizes}
        />
      </a>
    </div>
  )
}
