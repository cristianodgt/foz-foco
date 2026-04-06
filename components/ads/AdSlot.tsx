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
    h: 180,
    box: 'w-full h-[140px] md:h-[180px]',
    wrapper: 'w-full overflow-hidden',
    sizes: '(max-width: 1200px) 100vw, 1200px',
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

const FEED_BANNERS: BannerSlide[] = [
  {
    bg: 'bg-gradient-to-r from-[#00355f] via-[#0f4c81] to-[#00355f]',
    Icon: Megaphone,
    headline: 'Anuncie no Foz em Foco',
    sub: 'Alcance milhares de leitores locais todos os dias',
    cta: 'Ver planos',
    href: '/anunciantes',
  },
  {
    bg: 'bg-gradient-to-r from-[#1a1a2e] via-[#0f4c81] to-[#1a1a2e]',
    Icon: TrendingUp,
    headline: 'Seu negócio em destaque',
    sub: 'Publicidade digital com resultado real em Foz do Iguaçu',
    cta: 'Saiba mais',
    href: '/anunciantes',
  },
]

const LOCAL_SLIDES: Record<string, BannerSlide[]> = {
  GRID_BANNER_TOP: TOP_BANNERS,
  GRID_BANNER_BOTTOM: BOTTOM_BANNERS,
  FEED_BETWEEN: FEED_BANNERS,
  FEED_TOP: FEED_BANNERS,
  GRID_BANNER: FEED_BANNERS,
  SIDEBAR: [
    {
      bg: 'bg-gradient-to-b from-[#00355f] to-[#1a1a2e]',
      Icon: Sparkles,
      headline: 'Anuncie Aqui',
      sub: 'Espaço publicitário disponível',
      cta: 'Contato',
      href: '/anunciantes',
    },
  ],
  POST_DETAIL: FEED_BANNERS,
}

// ──────────────────────────────── Image Banner Slides ────────────────────────────────

interface ImageBannerSlide {
  src: string
  alt: string
  href: string
}

const TOP_IMAGE_BANNERS: ImageBannerSlide[] = [
  { src: '/banners/banner-top-1.jpeg', alt: 'Anuncie no Foz em Foco', href: '/anunciantes' },
  { src: '/banners/banner-top-2.jpeg', alt: 'Guia Comercial Foz do Iguaçu', href: '/anunciantes' },
  { src: '/banners/banner-top-3.jpeg', alt: 'Alcance milhares de leitores', href: '/anunciantes' },
]

const BOTTOM_IMAGE_BANNERS: ImageBannerSlide[] = [
  { src: '/banners/banner-bot-1.jpeg', alt: 'Espaço Publicitário Premium', href: '/anunciantes' },
  { src: '/banners/banner-bot-2.jpeg', alt: 'Torne-se Anunciante', href: '/anunciantes' },
  { src: '/banners/banner-bot-3.jpeg', alt: 'Seu Negócio Merece Destaque', href: '/anunciantes' },
]

const LOCAL_IMAGE_BANNERS: Record<string, ImageBannerSlide[]> = {
  GRID_BANNER_TOP: TOP_IMAGE_BANNERS,
  GRID_BANNER_BOTTOM: BOTTOM_IMAGE_BANNERS,
}

const ROTATION_INTERVAL = 3000

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
    <div className={`relative overflow-hidden shadow-[0_8px_32px_-8px_rgba(0,53,95,0.3)] rounded-xl ${dim.box}`}>
      {/* Edge gradient overlays for depth */}
      <div className="absolute inset-0 z-[15] pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/15 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/25 to-transparent" />
        <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-black/10 to-transparent" />
        <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-black/10 to-transparent" />
      </div>

      {slides.map((slide, i) => {
        const Icon = slide.Icon
        return (
          <Link
            key={i}
            href={slide.href}
            className={`absolute inset-0 flex items-center justify-center overflow-hidden transition-opacity duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${slide.bg} ${
              i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            aria-hidden={i !== current}
            tabIndex={i === current ? 0 : -1}
          >
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#f5ac00]/8 rounded-full blur-[80px]" />
              <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-[#f5ac00]/5 rounded-full blur-[60px]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[100px]" />
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#f5ac00]/40 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#f5ac00]/20 to-transparent" />
            </div>

            <div className="relative flex items-center gap-6 md:gap-10 px-6 md:px-12 max-w-[1200px] w-full">
              <div className="hidden md:flex w-16 h-16 rounded-2xl bg-[#f5ac00]/15 backdrop-blur-sm border border-[#f5ac00]/20 items-center justify-center flex-shrink-0 shadow-[0_4px_20px_-4px_rgba(245,172,0,0.3)]">
                <Icon className="w-8 h-8 text-[#f5ac00] drop-shadow-sm" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-headline font-bold text-lg md:text-3xl tracking-tight truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                  {slide.headline}
                </h3>
                <p className="text-white/80 text-xs md:text-base font-label mt-1 truncate drop-shadow-sm">
                  {slide.sub}
                </p>
              </div>
              <span className="flex-shrink-0 bg-[#f5ac00] text-[#1a1a2e] px-6 py-3 rounded-full text-xs md:text-sm font-bold font-label uppercase tracking-wider shadow-[0_4px_16px_-2px_rgba(245,172,0,0.5)] hover:shadow-[0_6px_24px_-2px_rgba(245,172,0,0.6)] hover:scale-105 transition-all duration-300">
                {slide.cta}
              </span>
            </div>
          </Link>
        )
      })}

    </div>
  )
}

/**
 * RotatingImageBanner — cycles through image-based banner slides with crossfade.
 */
function RotatingImageBanner({
  slides,
  dim,
}: {
  slides: ImageBannerSlide[]
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
    <div className={`relative overflow-hidden shadow-[0_8px_32px_-8px_rgba(0,53,95,0.3)] rounded-xl ${dim.box}`}>
      {/* Edge gradient overlays for depth */}
      <div className="absolute inset-0 z-[15] pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute top-0 bottom-0 left-0 w-6 bg-gradient-to-r from-black/8 to-transparent" />
        <div className="absolute top-0 bottom-0 right-0 w-6 bg-gradient-to-l from-black/8 to-transparent" />
      </div>

      {slides.map((slide, i) => (
        <Link
          key={i}
          href={slide.href}
          className={`absolute inset-0 overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
          aria-hidden={i !== current}
          tabIndex={i === current ? 0 : -1}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className={`object-cover transition-transform duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              i === current ? 'scale-100' : 'scale-[1.03]'
            }`}
            sizes={dim.sizes}
            priority={i === 0}
          />
        </Link>
      ))}

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
  const [imgErrored, setImgErrored] = useState(false)
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

  const outerCls = `${dim.wrapper} overflow-hidden ${className ?? ''}`.trim()

  // No real ad (or image load error) — try local image banners first, then CSS fallback
  if (loaded && (!ad || errored || imgErrored)) {
    const imageBanners = LOCAL_IMAGE_BANNERS[position]
    if (imageBanners && imageBanners.length > 0) {
      return (
        <div className={outerCls}>
          <RotatingImageBanner slides={imageBanners} dim={dim} />
        </div>
      )
    }
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
        className={`relative block overflow-hidden transition-all duration-300 ${
          format === 'leaderboard'
            ? 'rounded-xl shadow-[0_8px_32px_-8px_rgba(0,53,95,0.3)] hover:shadow-[0_12px_40px_-8px_rgba(0,53,95,0.4)]'
            : 'rounded-2xl ring-1 ring-black/5 shadow-md hover:shadow-lg'
        } ${dim.box}`}
        aria-label={ad!.title}
      >
        <Image
          src={ad!.imageUrl}
          alt={ad!.title}
          fill
          className="object-cover max-w-full max-h-full"
          sizes={dim.sizes}
          onError={() => setImgErrored(true)}
        />
      </a>
    </div>
  )
}
