'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import type { Ad } from '@/types'

interface AdSectionSponsorProps {
  categorySlug: string
}

export function AdSectionSponsor({ categorySlug }: AdSectionSponsorProps) {
  const [ad, setAd] = useState<Ad | null>(null)

  useEffect(() => {
    fetch('/api/ads?position=SECTION_SPONSOR')
      .then(r => r.ok ? r.json() : [])
      .then((ads: Ad[]) => {
        // Tenta encontrar sponsor desta categoria, senao pega o primeiro ativo
        const match = ads.find(a => a.client.toLowerCase().includes(categorySlug)) || ads[0]
        if (match) setAd(match)
      })
      .catch(() => {})
  }, [categorySlug])

  if (!ad) return null

  return (
    <a
      href={ad.targetUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="ad-section-sponsor"
    >
      <span>patrocinado por</span>
      <div style={{ position: 'relative', height: 20, width: 60 }}>
        <Image
          src={ad.imageUrl}
          alt={ad.client}
          fill
          className="object-contain"
          sizes="60px"
        />
      </div>
      <span style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>{ad.client}</span>
    </a>
  )
}
