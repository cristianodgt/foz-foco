'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { CategoryBadge } from '@/components/news/CategoryBadge'
import { formatRelativeDate } from '@/lib/utils'
import type { Post } from '@/types'

function useSearch(query: string) {
  const [results, setResults] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([])
      return
    }

    const timeout = setTimeout(async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/posts?search=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data.data || [])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [query])

  return { results, isLoading }
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const { results, isLoading } = useSearch(query)

  return (
    <div className="container-editorial" style={{ paddingTop: 32, paddingBottom: 64 }}>
      {/* Search input */}
      <div style={{ maxWidth: 640, marginBottom: 40 }}>
        <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: '2rem', letterSpacing: '0.05em', color: 'var(--color-text-primary)', marginBottom: 16 }}>
          Buscar notícias
        </h1>
        <div style={{ position: 'relative' }}>
          <Search style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} size={18} />
          <Input
            autoFocus
            placeholder="Digite para buscar..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ paddingLeft: 44, height: 48, fontSize: '1rem' }}
          />
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
          <div style={{ width: 32, height: 32, border: '3px solid var(--color-brand)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* No results */}
      {!isLoading && query.length >= 2 && results.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--color-text-muted)' }}>
          <Search size={40} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <p>Nenhum resultado para <strong>&quot;{query}&quot;</strong></p>
        </div>
      )}

      {/* Results */}
      {!isLoading && results.length > 0 && (
        <div>
          <p style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: 20 }}>
            {results.length} resultado(s) para <strong>&quot;{query}&quot;</strong>
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {results.map(post => (
              <Link
                key={post.id}
                href={`/${post.slug}`}
                style={{ display: 'flex', gap: 16, padding: '16px', borderRadius: 10, border: '1px solid var(--color-border)', background: 'var(--color-bg)', textDecoration: 'none', transition: 'box-shadow 0.15s' }}
                className="article-card"
              >
                {post.coverImage && !/\.(mp4|mov|webm)(\?.*)?$/i.test(post.coverImage) && (
                  <div style={{ position: 'relative', width: 120, height: 80, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                    <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ marginBottom: 8 }}>
                    <CategoryBadge name={post.category.name} color={post.category.color} icon={post.category.icon} size="sm" />
                  </div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.35, color: 'var(--color-text-primary)', marginBottom: 6 }} className="line-clamp-2">
                    {post.title}
                  </h3>
                  <p style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)' }}>
                    {post.publishedAt ? formatRelativeDate(post.publishedAt) : ''}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!query && (
        <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--color-text-muted)' }}>
          <Search size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
          <p>Digite para buscar notícias em Foz do Iguaçu</p>
        </div>
      )}
    </div>
  )
}
