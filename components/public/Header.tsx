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
  { label: 'Todos', href: '/' },
  { label: 'Cidade', href: '/categoria/cidade' },
  { label: 'Politica', href: '/categoria/politica' },
  { label: 'Esportes', href: '/categoria/esportes' },
  { label: 'Economia', href: '/categoria/economia' },
  { label: 'Turismo', href: '/categoria/turismo' },
  { label: 'Saude', href: '/categoria/saude' },
  { label: 'Cultura', href: '/categoria/cultura' },
  { label: 'Seguranca', href: '/categoria/seguranca' },
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
      aria-label="Alternar modo escuro"
      style={{
        width: 34, height: 34, borderRadius: '50%',
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: 'var(--color-text-2)', flexShrink: 0,
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
  const [scrolled, setScrolled] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { results, isLoading } = useSearch(query)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.logo) setLogoUrl(data.logo) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
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
      <header
        style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: 'var(--color-bg)',
          borderTop: '3px solid var(--color-brand)',
          borderBottom: '1px solid var(--color-border)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
          transition: 'box-shadow 0.2s',
        }}
      >
        {/* LOGO BAR */}
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 28px', height: 60, display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--color-border)' }}>
          <Link href="/" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            {logoUrl ? (
              <Image src={logoUrl} alt="Foz em Foco" width={110} height={36} className="object-contain" unoptimized />
            ) : (
              <span className="logo-bebas">FOZ <span>EM</span> FOCO</span>
            )}
          </Link>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => { setSearchOpen(true); setMenuOpen(false) }}
              aria-label="Buscar"
              style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid var(--color-border)', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text-2)', flexShrink: 0 }}
            >
              <Search size={16} />
            </button>
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
              className="mobile-only-flex"
              style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid var(--color-border)', background: 'var(--color-surface)', display: 'none', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text-2)', flexShrink: 0 }}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* NAV BAR */}
        <nav style={{ maxWidth: 1440, margin: '0 auto', padding: '0 28px', height: 44, display: 'flex', alignItems: 'center', gap: 4, overflowX: 'auto', borderBottom: '2px solid var(--color-brand)' }} className="hide-scrollbar">
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href} className={`nav-pill ${pathname === link.href ? 'active' : ''}`}>
              {link.label}
            </Link>
          ))}
          <div style={{ flex: 1 }} />
          <Link href="/anunciantes" style={{ flexShrink: 0, fontSize: 12, fontWeight: 600, color: 'var(--color-brand)', textDecoration: 'none', padding: '4px 12px', border: '1px solid var(--color-brand)', borderRadius: 20, whiteSpace: 'nowrap' }}>
            Anuncie aqui
          </Link>
        </nav>
      </header>

      {/* SEARCH OVERLAY */}
      {searchOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: 60, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <Search size={20} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
            <input ref={inputRef} type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar noticias..." style={{ flex: 1, background: 'transparent', color: 'white', border: 'none', outline: 'none', fontSize: 16 }} />
            <button onClick={() => setSearchOpen(false)} style={{ color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <X size={22} />
            </button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', maxWidth: 760, width: '100%', margin: '0 auto', padding: '20px 16px' }}>
            {isLoading && <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 48 }}><div className="spinner" /></div>}
            {!isLoading && query.length >= 2 && results.length === 0 && (
              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', paddingTop: 64 }}>Nenhum resultado para &quot;{query}&quot;</p>
            )}
            {!isLoading && results.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {results.map(post => (
                  <Link key={post.id} href={`/${post.slug}`} onClick={() => setSearchOpen(false)} style={{ display: 'flex', gap: 12, padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    {post.coverImage && (
                      <div style={{ position: 'relative', width: 80, height: 54, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                        <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, color: 'white', display: 'inline-block', marginBottom: 4, background: post.category?.color || '#666' }}>{post.category?.name}</span>
                      <h3 style={{ fontSize: 14, fontWeight: 600, color: 'white', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.title}</h3>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={11} />{post.publishedAt ? formatRelativeDate(post.publishedAt) : ''}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MOBILE MENU */}
      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: 60 }} />
          <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 18, padding: 32 }}>
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{ fontFamily: 'var(--font-bebas, "Bebas Neue", sans-serif)', fontSize: 30, letterSpacing: 2, color: pathname === link.href ? 'var(--color-brand)' : 'white', textDecoration: 'none' }}>
                {link.label}
              </Link>
            ))}
            <Link href="/anunciantes" onClick={() => setMenuOpen(false)} style={{ marginTop: 8, fontSize: 14, fontWeight: 600, color: 'var(--color-brand)', textDecoration: 'none', border: '1px solid var(--color-brand)', padding: '8px 20px', borderRadius: 20 }}>
              Anuncie aqui
            </Link>
          </nav>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { width: 28px; height: 28px; border: 2px solid var(--color-brand); border-top-color: transparent; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @media (max-width: 768px) {
          .mobile-only-flex { display: flex !important; }
        }
      `}</style>
    </>
  )
}
