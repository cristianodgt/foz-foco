'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import type { Ad } from '@/types'

interface AdSponsoredCardProps {
  ad: Ad
}

export function AdSponsoredCard({ ad }: AdSponsoredCardProps) {
  const impressionSent = useRef(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !impressionSent.current) {
          impressionSent.current = true
          fetch(`/api/ads/${ad.id}/impression`, { method: 'POST' }).catch(() => {})
        }
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
    <div
      ref={cardRef}
      className="article-card cursor-pointer"
      style={{ border: '1px solid var(--color-ad-border)', background: 'var(--color-ad-bg)' }}
      onClick={handleClick}
    >
      {/* Imagem */}
      <div className="relative" style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
        <Image
          src={ad.imageUrl}
          alt={ad.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 400px"
        />
        <span
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: 'rgba(0,0,0,0.6)',
            color: 'rgba(255,255,255,0.85)',
            fontSize: 10,
            fontWeight: 500,
            padding: '2px 8px',
            borderRadius: 20,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}
        >
          Patrocinado
        </span>
      </div>

      {/* Conteudo */}
      <div style={{ padding: '12px 14px 14px' }}>
        <p style={{ fontSize: 11, color: 'var(--color-brand)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
          {ad.client}
        </p>
        <h3 className="article-title" style={{ fontSize: 16, marginBottom: 10, lineHeight: 1.3 }}>
          {ad.title}
        </h3>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 12,
            color: 'var(--color-brand)',
            fontWeight: 600,
          }}
        >
          Saiba mais <ExternalLink size={11} />
        </span>
      </div>
    </div>
  )
}
