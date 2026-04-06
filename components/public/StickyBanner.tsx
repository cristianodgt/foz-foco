'use client'

import { useState, useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import type { Ad } from '@/types'

const LOCAL_SLIDES = [
  { src: '/banners/banner-bot-1.jpeg', alt: 'Anuncie no Foz em Foco', href: '/anunciantes' },
  { src: '/banners/banner-bot-2.jpeg', alt: 'Seu negócio em destaque', href: '/anunciantes' },
  { src: '/banners/banner-bot-3.jpeg', alt: 'Portal de notícias de Foz', href: '/anunciantes' },
]

const ROTATION_MS = 4000

export function StickyBanner() {
  const [ad, setAd] = useState<Ad | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const [current, setCurrent] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (sessionStorage.getItem('sticky-banner-dismissed') === '1') {
      setDismissed(true)
      return
    }
    fetch('/api/ads?position=GRID_BANNER_BOTTOM')
      .then(r => r.ok ? r.json() : [])
      .then((data: Ad | Ad[]) => {
        const arr = Array.isArray(data) ? data : [data]
        if (arr[0]?.imageUrl) setAd(arr[0])
      })
      .catch(() => {})
  }, [])

  const next = useCallback(() => setCurrent(i => (i + 1) % LOCAL_SLIDES.length), [])

  useEffect(() => {
    if (ad || dismissed) return
    const id = setInterval(next, ROTATION_MS)
    return () => clearInterval(id)
  }, [ad, dismissed, next])

  function handleDismiss() {
    setDismissed(true)
    sessionStorage.setItem('sticky-banner-dismissed', '1')
  }

  if (!mounted || dismissed) return null

  const slide = LOCAL_SLIDES[current]
  const href = ad ? ad.targetUrl : slide.href
  const imgSrc = ad ? ad.imageUrl : slide.src
  const imgAlt = ad ? ad.title : slide.alt

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 shadow-[0_-4px_24px_-4px_rgba(0,0,0,0.35)]">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block w-full"
        style={{ lineHeight: 0 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={imgAlt}
          style={{ width: '100%', height: '90px', objectFit: 'cover', display: 'block' }}
        />
      </a>

      <span className="absolute bottom-2 left-3 text-[9px] font-bold bg-black/50 text-white/80 px-2 py-0.5 rounded-full font-label tracking-widest pointer-events-none">
        PUBLICIDADE
      </span>

      <button
        onClick={handleDismiss}
        aria-label="Fechar anúncio"
        className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  )
}
