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
  const label = message ?? `Espaço disponível • ${phone}`
  return (
    <div
      className={`group relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-surface-container via-surface to-surface-container-high shadow-[0_2px_12px_-4px_rgba(26,26,46,0.08)] ring-1 ring-on-surface/5 ${dim.box}`}
    >
      {/* Dashed inner frame — softer than a hard outline */}
      <div className="pointer-events-none absolute inset-2 rounded-xl border border-dashed border-outline-variant/50" />
      <span className="absolute top-3 left-3 text-[9px] font-bold bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded-full font-label tracking-widest shadow-sm">
        PUBLICIDADE
      </span>
      <div className="text-center px-6">
        <p className="text-[10px] font-bold text-outline uppercase tracking-widest font-label">
          {dim.w} × {dim.h}
        </p>
        <p className="mt-1 text-xs italic text-outline font-label">
          {label}
        </p>
      </div>
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
        className={`relative block overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5 transition-shadow hover:shadow-lg ${dim.box}`}
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
