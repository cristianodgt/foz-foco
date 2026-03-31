'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, Clock, Sun, Moon, MapPin } from 'lucide-react'
import { useTheme } from 'next-themes'
import { formatRelativeDate } from '@/lib/utils'
import type { Post } from '@/types'

const NAV_LINKS = [
  { label: 'Tudo', href: '/' },
  { label: 'Cidade', href: '/categoria/cidade' },
  { label: 'Política', href: '/categoria/politica' },
  { label: 'Esportes', href: '/categoria/esportes' },
  { label: 'Economia', href: '/categoria/economia' },
  { label: 'Turismo', href: '/categoria/turismo' },
  { label: 'Saúde', href: '/categoria/saude' },
  { label: 'Cultura', href: '/categoria/cultura' },
  { label: 'Segurança', href: '/categoria/seguranca' },
]

function useSearch(query: string) {
  const [results, setResults] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    if (!query.trim() || query.length < 2) { setResults([]); return }
    const timeout = setTimeout(async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/posts?search=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data.data || [])
      } finally { setIsLoading(false) }
    }, 300)
    return () => clearTimeout(timeout)
  }, [query])
  return { results, isLoading }
}

function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div style={{ width: 36, height: 36 }} />
  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label="Alternar modo escuro"
      style={{
        width: 36, height: 36, borderRadius: 8,
        border: '1px solid var(--color-border)',
        background: 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: 'var(--color-text-muted)',
        transition: 'color 0.15s, border-color 0.15s, background 0.15s',
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.color = 'var(--color-brand)'
        ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--color-brand)'
        ;(e.currentTarget as HTMLElement).style.background = 'var(--color-brand-light)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)'
        ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'
        ;(e.currentTarget as HTMLElement).style.background = 'transparent'
      }}
    >
      {resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}

export function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { results, isLoading } = useSearch(query)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.logo) setLogoUrl(data.logo) })
      .catch(() => {})
  }, [])

  useEffect(() => { setMenuOpen(false); setSearchOpen(false) }, [pathname])
  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 100)
    else setQuery('')
  }, [searchOpen])
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setSearchOpen(false); setMenuOpen(false) }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: '0 1px 12px rgba(0,0,0,0.07)',
      }}>
        {/* ─ BARRA DE IDENTIDADE ─────────────────────────── */}
        <div style={{
          background: 'var(--color-brand)',
          height: 3,
          width: '100%',
        }} />

        {/* ─ LOGO + UTILITÁRIOS ──────────────────────────── */}
        <div style={{
          maxWidth: 1440,
          margin: '0 auto',
          padding: '0 28px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}>
          {/* Logo */}
          <Link href="/" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            {logoUrl ? (
              <Image src={logoUrl} alt="Foz em Foco" width={130} height={40} className="object-contain" unoptimized />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span style={{
                  fontFamily: 'var(--font-bebas, "Bebas Neue", sans-serif)',
                  fontSize: 26,
                  letterSpacing: 3,
                  color: 'var(--color-text)',
                  lineHeight: 1,
                }}>
                  FOZ <span style={{ color: 'var(--color-brand)' }}>EM</span> FOCO
                </span>
                <span style={{
                  fontSize: 9,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                  fontWeight: 600,
                  marginTop: 1,
                }}>
                  Tríplice Fronteira
                </span>
              </div>
            )}
          </Link>

          {/* Localização — desktop */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11,
              color: 'var(--color-text-muted)',
              fontWeight: 500,
              marginLeft: 4,
            }}
            className="location-label"
          >
            <MapPin size={11} />
            Foz do Iguaçu — PR
          </div>

          <div style={{ flex: 1 }} />

          {/* Anuncie — destaque sutil */}
          <Link
            href="/anunciantes"
            className="anuncie-cta"
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--color-brand)',
              textDecoration: 'none',
              padding: '6px 14px',
              border: '1.5px solid var(--color-brand)',
              borderRadius: 6,
              whiteSpace: 'nowrap',
              transition: 'all 0.15s',
              letterSpacing: 0.3,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--color-brand)'
              ;(e.currentTarget as HTMLElement).style.color = 'white'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent'
              ;(e.currentTarget as HTMLElement).style.color = 'var(--color-brand)'
            }}
          >
            Anuncie aqui
          </Link>

          {/* Search */}
          <button
            onClick={() => { setSearchOpen(true); setMenuOpen(false) }}
            aria-label="Buscar"
            style={{
              width: 36, height: 36, borderRadius: 8,
              border: '1px solid var(--color-border)',
              background: 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--color-text-muted)',
              transition: 'color 0.15s, border-color 0.15s, background 0.15s',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = 'var(--color-brand)'
              ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--color-brand)'
              ;(e.currentTarget as HTMLElement).style.background = 'var(--color-brand-light)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)'
              ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'
              ;(e.currentTarget as HTMLElement).style.background = 'transparent'
            }}
          >
            <Search size={16} />
          </button>

          <ThemeToggle />

          {/* Hamburguer mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            className="mobile-menu-btn"
            style={{
              width: 36, height: 36, borderRadius: 8,
              border: '1px solid var(--color-border)',
              background: 'transparent',
              alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--color-text-2)',
              display: 'none', flexShrink: 0,
            }}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* ─ NAVEGAÇÃO POR CATEGORIAS ───────────────────────── */}
        <div style={{
          borderTop: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
        }}>
          <nav style={{
            maxWidth: 1440,
            margin: '0 auto',
            padding: '0 28px',
            height: 42,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            overflowX: 'auto',
          }} className="hide-scrollbar">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-pill ${pathname === link.href ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* ─ SEARCH OVERLAY ─────────────────────────────────────── */}
      {searchOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 60,
          background: 'rgba(8,30,45,0.96)',
          backdropFilter: 'blur(16px)',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{
            maxWidth: 760, width: '100%', margin: '0 auto',
            height: 70, display: 'flex', alignItems: 'center',
            padding: '0 20px', gap: 16,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}>
            <Search size={20} style={{ color: 'var(--color-brand)', flexShrink: 0 }} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar notícias..."
              style={{
                flex: 1, background: 'transparent',
                color: 'white', border: 'none', outline: 'none',
                fontSize: 18, fontFamily: 'var(--font-sans)',
              }}
            />
            <button
              onClick={() => setSearchOpen(false)}
              style={{
                color: 'rgba(255,255,255,0.4)', background: 'none',
                border: 'none', cursor: 'pointer', padding: 4,
                transition: 'color 0.15s',
              }}
            >
              <X size={24} />
            </button>
          </div>

          <div style={{
            flex: 1, overflowY: 'auto',
            maxWidth: 760, width: '100%', margin: '0 auto',
            padding: '24px 20px',
          }}>
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 64 }}>
                <div className="spinner" />
              </div>
            )}
            {!isLoading && query.length >= 2 && results.length === 0 && (
              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.25)', paddingTop: 64, fontSize: 15 }}>
                Nenhum resultado para &ldquo;{query}&rdquo;
              </p>
            )}
            {!isLoading && results.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {results.map(post => (
                  <Link
                    key={post.id}
                    href={`/${post.slug}`}
                    onClick={() => setSearchOpen(false)}
                    style={{
                      display: 'flex', gap: 14, padding: '12px 16px',
                      borderRadius: 10,
                      background: 'rgba(255,255,255,0.05)',
                      textDecoration: 'none',
                      border: '1px solid rgba(255,255,255,0.06)',
                      transition: 'background 0.15s',
                    }}
                  >
                    {post.coverImage && (
                      <div style={{
                        position: 'relative', width: 80, height: 54,
                        borderRadius: 8, overflow: 'hidden', flexShrink: 0,
                      }}>
                        <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '2px 8px',
                        borderRadius: 4, color: 'white', display: 'inline-block',
                        marginBottom: 6,
                        background: post.category?.color || 'var(--color-brand)',
                      }}>
                        {post.category?.name}
                      </span>
                      <h3 style={{
                        fontSize: 14, fontWeight: 600, color: 'white',
                        lineHeight: 1.3,
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        fontFamily: 'var(--font-serif)',
                      }}>
                        {post.title}
                      </h3>
                      <p style={{
                        fontSize: 11, color: 'rgba(255,255,255,0.3)',
                        marginTop: 5, display: 'flex', alignItems: 'center', gap: 4,
                      }}>
                        <Clock size={11} />
                        {post.publishedAt ? formatRelativeDate(post.publishedAt) : ''}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─ MOBILE MENU ────────────────────────────────────────── */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: 'rgba(8,30,45,0.98)',
          backdropFilter: 'blur(16px)',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ height: 67 }} />
          <nav style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center',
            gap: 6, padding: 32,
          }}>
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: 'var(--font-bebas, "Bebas Neue", sans-serif)',
                  fontSize: 32, letterSpacing: 3,
                  color: pathname === link.href ? 'var(--color-brand)' : 'rgba(255,255,255,0.85)',
                  textDecoration: 'none',
                  padding: '4px 0',
                  transition: 'color 0.15s',
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/anunciantes"
              onClick={() => setMenuOpen(false)}
              style={{
                marginTop: 16, fontSize: 13, fontWeight: 600,
                color: 'var(--color-brand)', textDecoration: 'none',
                border: '1.5px solid var(--color-brand)',
                padding: '8px 24px', borderRadius: 8, letterSpacing: 0.5,
              }}
            >
              Anuncie aqui
            </Link>
          </nav>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 28px; height: 28px;
          border: 2px solid var(--color-brand);
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
          .anuncie-cta { display: none !important; }
          .location-label { display: none !important; }
        }
      `}</style>
    </>
  )
}
