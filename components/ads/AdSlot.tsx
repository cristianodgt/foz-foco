'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Megaphone, MapPin, TrendingUp, Sparkles, BarChart3, Users } from 'lucide-react'
import type { Ad, AdPosition } from '@/types'
import type { LucideIcon } from 'lucide-react'

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
    w: 1200,
    h: 150,
    box: 'w-full h-[150px]',
    wrapper: 'w-full overflow-hidden',
    sizes: '100vw',
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

// ──────────────────────────────── CSS Banner Slides ────────────────────────────────

interface BannerSlide {
  bg: string
  Icon: LucideIcon
  headline: string
  sub: string
  cta: string
  href: string
}

const TOP_BANNERS: BannerSlide[] = [
  {
    bg: 'bg-gradient-to-r from-[#00355f] via-[#0f4c81] to-[#00355f]',
    Icon: Megaphone,
    headline: 'Anuncie no Foz em Foco',
    sub: 'Seu negócio em destaque para milhares de leitores',
    cta: 'Saiba mais',
    href: '/anunciantes',
  },
  {
    bg: 'bg-gradient-to-r from-[#1a1a2e] via-[#0f4c81] to-[#1a1a2e]',
    Icon: MapPin,
    headline: 'Guia Comercial Foz do Iguaçu',
    sub: 'Restaurantes • Hotéis • Serviços • Compras',
    cta: 'Explorar',
    href: '/anunciantes',
  },
  {
    bg: 'bg-gradient-to-r from-[#0f4c81] via-[#00355f] to-[#0f4c81]',
    Icon: TrendingUp,
    headline: 'Alcance Milhares de Leitores',
    sub: 'Publicidade digital com resultado real em Foz do Iguaçu',
    cta: 'Ver planos',
    href: '/anunciantes',
  },
]

const BOTTOM_BANNERS: BannerSlide[] = [
  {
    bg: 'bg-gradient-to-r from-[#1a1a2e] via-[#00355f] to-[#1a1a2e]',
    Icon: Sparkles,
    headline: 'Espaço Publicitário Premium',
    sub: 'Visibilidade garantida para sua marca',
    cta: 'Anuncie conosco',
    href: '/anunciantes',
  },
  {
    bg: 'bg-gradient-to-r from-[#00355f] via-[#1a1a2e] to-[#00355f]',
    Icon: BarChart3,
    headline: 'Torne-se Anunciante',
    sub: 'Planos a partir de R$ 299/mês • ROI comprovado',
    cta: 'Ver planos',
    href: '/anunciantes',
  },
  {
    bg: 'bg-gradient-to-r from-[#0f4c81] via-[#1a1a2e] to-[#0f4c81]',
    Icon: Users,
    headline: 'Seu Negócio Merece Destaque',
    sub: 'O maior portal de notícias de Foz do Iguaçu',
    cta: 'Comece agora',
    href: '/anunciantes',
  },
]

const LOCAL_SLIDES: Record<string, BannerSlide[]> = {
  GRID_BANNER_TOP: TOP_BANNERS,
  GRID_BANNER_BOTTOM: BOTTOM_BANNERS,
}

const ROTATION_INTERVAL = 5000

// ──────────────────────────────── Components ────────────────────────────────

interface PlaceholderProps {
  format: AdFormat
  phone?: string
  message?: string
}

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
 * RotatingCSSBanner — cycles through CSS-rendered banner slides with crossfade.
 */
function RotatingCSSBanner({
  slides,
  dim,
}: {
  slides: BannerSlide[]
  dim: Dim
}) {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent(i => (i + 1) % slides.length)
  }, [slides.length])

  useEffect(() => {
    if (slides.length <= 1) return
    const id = setInterval(next, ROTATION_INTERVAL)
    return () => clearInterval(id)
  }, [next, slides.length])

  return (
    <div className={`relative overflow-hidden shadow-lg ${dim.box}`}>
      {slides.map((slide, i) => {
        const Icon = slide.Icon
        return (
          <Link
            key={i}
            href={slide.href}
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ease-in-out ${slide.bg} ${
              i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            aria-hidden={i !== current}
            tabIndex={i === current ? 0 : -1}
          >
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#f5ac00]/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#f5ac00]/5 rounded-full blur-2xl" />
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#f5ac00]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#f5ac00]/20 to-transparent" />
            </div>

            <div className="relative flex items-center gap-6 md:gap-10 px-6 md:px-12 max-w-[1200px] w-full">
              <div className="hidden md:flex w-14 h-14 rounded-2xl bg-[#f5ac00]/15 items-center justify-center flex-shrink-0">
                <Icon className="w-7 h-7 text-[#f5ac00]" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-headline font-bold text-lg md:text-2xl tracking-tight truncate">
                  {slide.headline}
                </h3>
                <p className="text-white/70 text-xs md:text-sm font-label mt-0.5 truncate">
                  {slide.sub}
                </p>
              </div>
              <span className="flex-shrink-0 bg-[#f5ac00] text-[#1a1a2e] px-5 py-2.5 rounded-full text-xs md:text-sm font-bold font-label uppercase tracking-wider shadow-lg hover:brightness-110 transition-all">
                {slide.cta}
              </span>
            </div>
          </Link>
        )
      })}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.preventDefault(); setCurrent(i) }}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === current ? 'bg-[#f5ac00] shadow-sm w-4' : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Banner ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function AdSlot({
  format,
  position,
  className,
  placeholder,
  index = 0,
}: AdSlotProps) {
  const [ad, setAd] = useState<Ad | null>(null)
  const [errored, setErrored] = useState(false)
  const [loaded, setLoaded] = useState(false)
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
        setLoaded(true)
      })
      .catch(() => {
        if (!cancelled) {
          setErrored(true)
          setLoaded(true)
        }
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
      void e
    }
  }

  const outerCls = `${dim.wrapper} ${className ?? ''}`.trim()

  // No real ad — try local CSS rotating banners
  if (loaded && (!ad || errored)) {
    const slides = LOCAL_SLIDES[position]
    if (slides && slides.length > 0) {
      return (
        <div className={outerCls}>
          <RotatingCSSBanner slides={slides} dim={dim} />
        </div>
      )
    }
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

  // Loading skeleton
  if (!loaded) {
    return (
      <div className={outerCls}>
        <div className={`animate-pulse bg-surface-container rounded-2xl ${dim.box}`} />
      </div>
    )
  }

  // Real ad from API
  return (
    <div className={outerCls}>
      <a
        href={ad!.targetUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={handleClick}
        className={`relative block overflow-hidden shadow-md transition-shadow hover:shadow-lg ${
          format === 'leaderboard' ? '' : 'rounded-2xl ring-1 ring-black/5'
        } ${dim.box}`}
        aria-label={ad!.title}
      >
        <Image
          src={ad!.imageUrl}
          alt={ad!.title}
          fill
          className="object-cover"
          sizes={dim.sizes}
        />
      </a>
    </div>
  )
}
