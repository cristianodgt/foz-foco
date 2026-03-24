'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import type { Ad } from '@/types'

export function StickyBanner() {
  const [ad, setAd] = useState<Ad | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('sidebar-ad-dismissed') === '1') {
      setDismissed(true)
      return
    }
    fetch('/api/ads?position=SIDEBAR')
      .then(r => r.ok ? r.json() : [])
      .then((data: Ad[]) => { if (data[0]) setAd(data[0]) })
      .catch(() => {})
  }, [])

  function handleDismiss() {
    setDismissed(true)
    sessionStorage.setItem('sidebar-ad-dismissed', '1')
  }

  if (!ad || dismissed) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 45,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div style={{ position: 'relative', width: '100%', maxWidth: '640px', height: '60px' }}>
        <a
          href={ad.targetUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          style={{ display: 'block', width: '100%', height: '100%' }}
        >
          <Image
            src={ad.imageUrl}
            alt={ad.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 640px"
          />
          <span
            style={{
              position: 'absolute',
              bottom: 4,
              left: 6,
              fontSize: 10,
              background: 'rgba(0,0,0,0.5)',
              color: 'rgba(255,255,255,0.7)',
              padding: '1px 5px',
              borderRadius: 4,
            }}
          >
            Patrocinado
          </span>
        </a>
        <button
          onClick={handleDismiss}
          aria-label="Fechar anúncio"
          style={{
            position: 'absolute',
            top: 4,
            right: 4,
            background: 'rgba(0,0,0,0.6)',
            border: 'none',
            borderRadius: '50%',
            width: 22,
            height: 22,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white',
          }}
        >
          <X size={12} />
        </button>
      </div>
    </div>
  )
}
