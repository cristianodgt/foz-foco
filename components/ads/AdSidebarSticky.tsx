'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import type { Ad } from '@/types'

export function AdSidebarSticky() {
  const [ads, setAds] = useState<Ad[]>([])
  const [current, setCurrent] = useState(0)
  const impressionSent = useRef<Set<string>>(new Set())

  useEffect(() => {
    fetch('/api/ads?position=SIDEBAR')
      .then(r => r.ok ? r.json() : [])
      .then((data: Ad[]) => { if (Array.isArray(data)) setAds(data) })
      .catch(() => {})
  }, [])

  // Rotaciona automaticamente se houver mais de 1
  useEffect(() => {
    if (ads.length <= 1) return
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % ads.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [ads.length])

  const ad = ads[current]

  useEffect(() => {
    if (ad && !impressionSent.current.has(ad.id)) {
      impressionSent.current.add(ad.id)
      fetch(`/api/ads/${ad.id}/impression`, { method: 'POST' }).catch(() => {})
    }
  }, [ad])

  const handleClick = () => {
    if (!ad) return
    fetch(`/api/ads/${ad.id}/click`, { method: 'POST' }).catch(() => {})
    window.open(ad.targetUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="widget" style={{ padding: 0, overflow: 'hidden' }}>
      <div
        className="relative cursor-pointer"
        style={{ height: 250, background: 'var(--color-ad-bg)' }}
        onClick={ad ? handleClick : undefined}
      >
        {ad ? (
          <>
            <Image
              src={ad.imageUrl}
              alt={ad.title}
              fill
              className="object-cover"
              sizes="300px"
            />
            {ads.length > 1 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 6,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: 4,
                }}
              >
                {ads.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setCurrent(i) }}
                    style={{
                      width: i === current ? 16 : 6,
                      height: 6,
                      borderRadius: 3,
                      background: i === current ? 'white' : 'rgba(255,255,255,0.5)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      padding: 0,
                    }}
                  />
                ))}
              </div>
            )}
          </>
        ) : null}
      </div>
      {ad && (
        <div style={{ padding: '6px 12px 8px' }}>
          <p style={{ fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.3 }}>{ad.client}</p>
        </div>
      )}
    </div>
  )
}
