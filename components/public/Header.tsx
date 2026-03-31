'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, Clock, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { formatRelativeDate } from '@/lib/utils'
import type { Post } from '@/types'

const NAV_LINKS = [
  { label: 'Início', href: '/' },
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
  if (!mounted) return <div style={{ width: 32, height: 32 }} />
  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label="Alternar modo escuro"
      className="header-icon-btn"
    >
      {resolvedTheme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
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
      {/* ── HEADER PRINCIPAL — linha única ──────────────────── */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
      }}>
        {/* Acento de marca no topo */}
        <div style={{ height: 3, background: 'var(--color-brand)', width: '100%' }} />

        <div style={{
          maxWidth: 1440,
          margin: '0 auto',
          padding: '0 24px',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          gap: 0,
        }}>
          {/* ── LOGO ──────────────────────────────────────── */}
          <Link
            href="/"
            style={{ flexShrink: 0, textDecoration: 'none', marginRight: 32 }}
          >
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="Foz em Foco"
                width={120}
                height={36}
                className="object-contain"
                unoptimized
              />
            ) : (
              <span style={{
                fontFamily: 'var(--font-bebas, "Bebas Neue", sans-serif)',
                fontSize: 24,
                letterSpacing: 3,
                color: 'var(--color-text)',
                lineHeight: 1,
                display: 'block',
              }}>
                FOZ <span style={{ color: 'var(--color-brand)' }}>EM</span> FOCO
              </span>
            )}
          </Link>

          {/* ── NAV — categorias na mesma linha ──────────── */}
          <nav
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 0,
              overflowX: 'auto',
              height: '100%',
            }}
            className="hide-scrollbar header-nav"
          >
            {NAV_LINKS.map(link => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    flexShrink: 0,
                    padding: '0 14px',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--color-brand)' : 'var(--color-text-2)',
                    textDecoration: 'none',
                    borderBottom: isActive ? '2px solid var(--color-brand)' : '2px solid transparent',
                    transition: 'color 0.15s, border-color 0.15s',
                    whiteSpace: 'nowrap',
                  }}
                  className="header-nav-link"
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* ── UTILITIES (dir.) ─────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 16 }}>
            {/* Busca */}
            <button
              onClick={() => { setSearchOpen(true); setMenuOpen(false) }}
              aria-label="Buscar"
              className="header-icon-btn"
            >
              <Search size={15} />
            </button>

            <ThemeToggle />

            {/* CTA — desktop */}
            <Link
              href="/anunciantes"
              className="anuncie-btn"
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: 'white',
                background: 'var(--color-brand)',
                textDecoration: 'none',
                padding: '7px 16px',
                borderRadius: 6,
                whiteSpace: 'nowrap',
                letterSpacing: 0.3,
                transition: 'background 0.15s',
              }}
            >
              Anuncie aqui
            </Link>

            {/* Hamburguer — só mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
              className="header-icon-btn mobile-only"
              style={{ display: 'none' }}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── SEARCH OVERLAY ──────────────────────────────────── */}
      {searchOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 60,
          background: 'rgba(8,22,34,0.97)',
          backdropFilter: 'blur(20px)',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{
            maxWidth: 720, width: '100%', margin: '0 auto',
            height: 72, display: 'flex', alignItems: 'center',
            padding: '0 24px', gap: 16,
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}>
            <Search size={18} style={{ color: 'var(--color-brand)', flexShrink: 0 }} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar notícias..."
              style={{
                flex: 1, background: 'transparent',
                color: 'white', border: 'none', outline: 'none',
                fontSize: 20, fontFamily: 'var(--font-serif)',
              }}
            />
            <button
              onClick={() => setSearchOpen(false)}
              style={{
                color: 'rgba(255,255,255,0.35)', background: 'none',
                border: 'none', cursor: 'pointer', padding: 4,
              }}
            >
              <X size={22} />
            </button>
          </div>

          <div style={{
            flex: 1, overflowY: 'auto',
            maxWidth: 720, width: '100%', margin: '0 auto',
            padding: '20px 24px',
          }}>
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}>
                <div className="spinner" />
              </div>
            )}
            {!isLoading && query.length >= 2 && results.length === 0 && (
              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', paddingTop: 60, fontSize: 15 }}>
                Nenhum resultado para &ldquo;{query}&rdquo;
              </p>
            )}
            {!isLoading && results.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {results.map(post => (
                  <Link
                    key={post.id}
                    href={`/${post.slug}`}
                    onClick={() => setSearchOpen(false)}
                    style={{
                      display: 'flex', gap: 14, padding: '12px 14px',
                      borderRadius: 8,
                      background: 'rgba(255,255,255,0.04)',
                      textDecoration: 'none',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    {post.coverImage && (
                      <div style={{
                        position: 'relative', width: 76, height: 52,
                        borderRadius: 6, overflow: 'hidden', flexShrink: 0,
                      }}>
                        <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '2px 7px',
                        borderRadius: 3, color: 'white', display: 'inline-block', marginBottom: 5,
                        background: post.category?.color || 'var(--color-brand)',
                      }}>
                        {post.category?.name}
                      </span>
                      <h3 style={{
                        fontSize: 14, fontWeight: 600, color: 'white', lineHeight: 1.3,
                        fontFamily: 'var(--font-serif)',
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>
                        {post.title}
                      </h3>
                      <p style={{
                        fontSize: 11, color: 'rgba(255,255,255,0.28)',
                        marginTop: 4, display: 'flex', alignItems: 'center', gap: 4,
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

      {/* ── MOBILE MENU ─────────────────────────────────────── */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: 'rgba(8,22,34,0.98)',
          backdropFilter: 'blur(20px)',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ height: 63 }} />
          <nav style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center',
            gap: 4, padding: 32,
          }}>
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: 'var(--font-bebas, "Bebas Neue", sans-serif)',
                  fontSize: 34, letterSpacing: 3,
                  color: pathname === link.href ? 'var(--color-brand)' : 'rgba(224,234,242,0.85)',
                  textDecoration: 'none',
                  padding: '2px 0',
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/anunciantes"
              onClick={() => setMenuOpen(false)}
              style={{
                marginTop: 20, fontSize: 13, fontWeight: 600,
                color: 'white', background: 'var(--color-brand)',
                textDecoration: 'none', padding: '10px 28px', borderRadius: 6,
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
          width: 26px; height: 26px;
          border: 2px solid var(--color-brand);
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        .header-icon-btn {
          width: 32px; height: 32px;
          border-radius: 6px;
          border: 1px solid var(--color-border);
          background: transparent;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: var(--color-text-muted);
          transition: color 0.15s, border-color 0.15s, background 0.15s;
          flex-shrink: 0;
        }
        .header-icon-btn:hover {
          color: var(--color-brand);
          border-color: var(--color-brand);
          background: var(--color-brand-light);
        }

        .header-nav-link:hover {
          color: var(--color-brand) !important;
          border-bottom-color: var(--color-brand) !important;
        }

        .anuncie-btn:hover {
          background: var(--color-brand-dark) !important;
        }

        @media (max-width: 900px) {
          .header-nav { display: none !important; }
          .mobile-only { display: flex !important; }
          .anuncie-btn { display: none !important; }
        }

        @media (max-width: 480px) {
          .anuncie-btn { display: none !important; }
        }
      `}</style>
    </>
  )
}
