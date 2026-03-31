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
  if (!mounted) return <div style={{ width: 34, height: 34 }} />
  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label="Alternar modo"
      className="hdr-icon"
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
      {/* ── WRAPPER: cria o "espaço" ao redor do card ──────── */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '10px 16px 0',
        background: 'var(--color-page-bg)',
      }}>
        {/* ── CARD FLUTUANTE — inspirado no AVTL ────────────── */}
        <header style={{
          background: 'var(--color-bg)',
          borderRadius: '12px 12px 0 0',
          border: '1px solid var(--color-border)',
          borderBottom: 'none',
          boxShadow: '0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)',
          height: 60,
          padding: 0,
        }}>
          {/* Container centralizado — alinhado ao conteúdo da página */}
          <div style={{
            maxWidth: 1280,
            margin: '0 auto',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: '0 28px',
            gap: 0,
          }}>
          {/* LOGO ─────────────────────────────────────────── */}
          <Link href="/" style={{ flexShrink: 0, textDecoration: 'none', marginRight: 24, display: 'flex', alignItems: 'center' }}>
            {logoUrl ? (
              <Image src={logoUrl} alt="Foz em Foco" width={110} height={34} style={{ objectFit: 'contain', maxHeight: 34, width: 'auto' }} unoptimized />
            ) : (
              <span style={{
                fontFamily: 'var(--font-bebas, "Bebas Neue", sans-serif)',
                fontSize: 21,
                letterSpacing: 3,
                color: 'var(--color-text)',
                lineHeight: 1,
              }}>
                FOZ <span style={{ color: 'var(--color-brand)' }}>EM</span> FOCO
              </span>
            )}
          </Link>

          {/* Separador vertical logo / nav */}
          <div style={{ width: 1, height: 18, background: 'var(--color-border)', flexShrink: 0, marginRight: 4 }} className="hdr-divider" />

          {/* NAV — categorias, scrollável */}
          <nav className="hdr-nav hide-scrollbar" style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 0,
            overflowX: 'auto',
            height: '100%',
            flexShrink: 1,
            minWidth: 0,
          }}>
            {NAV_LINKS.map(link => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hdr-link"
                  style={{
                    flexShrink: 0,
                    padding: '0 13px',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 13,
                    fontWeight: active ? 600 : 400,
                    color: active ? 'var(--color-brand)' : 'var(--color-text-2)',
                    textDecoration: 'none',
                    borderBottom: active ? '2px solid var(--color-brand)' : '2px solid transparent',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.15s',
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* AÇÕES ───────────────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, marginLeft: 16 }}>
            <button onClick={() => setSearchOpen(true)} aria-label="Buscar" className="hdr-icon">
              <Search size={15} />
            </button>

            <ThemeToggle />

            {/* CTA pill */}
            <Link
              href="/anunciantes"
              className="hdr-cta"
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: 'white',
                background: 'var(--color-brand)',
                textDecoration: 'none',
                padding: '7px 18px',
                borderRadius: 100,
                whiteSpace: 'nowrap',
                letterSpacing: 0.2,
                transition: 'background 0.15s, transform 0.1s',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              Anuncie aqui
            </Link>

            {/* Hamburguer — só mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
              className="hdr-icon hdr-mobile"
              style={{ display: 'none' }}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
          </div>
        </header>
      </div>

      {/* ── SEARCH OVERLAY ─────────────────────────────────── */}
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
              style={{ color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none', cursor: 'pointer' }}
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
                      <div style={{ position: 'relative', width: 76, height: 52, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
                        <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '2px 7px',
                        borderRadius: 4, color: 'white', display: 'inline-block', marginBottom: 5,
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
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
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

      {/* ── MOBILE MENU ──────────────────────────────────────── */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: 'rgba(8,22,34,0.98)',
          backdropFilter: 'blur(20px)',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ height: 70 }} />
          <nav style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center', gap: 4, padding: 32,
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
                  textDecoration: 'none', padding: '2px 0',
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
                textDecoration: 'none', padding: '10px 28px', borderRadius: 100,
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

        /* Ícone genérico do header */
        .hdr-icon {
          width: 34px; height: 34px;
          border-radius: 8px;
          border: 1px solid var(--color-border);
          background: transparent;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: var(--color-text-muted);
          transition: color 0.15s, border-color 0.15s, background 0.15s;
          flex-shrink: 0;
        }
        .hdr-icon:hover {
          color: var(--color-brand);
          border-color: var(--color-brand);
          background: var(--color-brand-light);
        }

        /* Link de nav */
        .hdr-link:hover {
          color: var(--color-brand) !important;
          border-bottom-color: var(--color-brand) !important;
        }

        /* CTA pill */
        .hdr-cta:hover {
          background: var(--color-brand-dark) !important;
          transform: translateY(-1px);
        }

        /* Mobile breakpoints */
        @media (max-width: 900px) {
          .hdr-nav { display: none !important; }
          .hdr-mobile { display: flex !important; }
          .hdr-cta { display: none !important; }
        }
      `}</style>
    </>
  )
}
