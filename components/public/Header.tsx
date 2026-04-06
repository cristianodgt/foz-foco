'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, Clock, Sun, Moon, User } from 'lucide-react'
import { useTheme } from 'next-themes'
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

function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-9 h-9" />
  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label="Alternar modo"
      className="w-9 h-9 flex items-center justify-center rounded-full text-primary-container hover:bg-surface-container transition-colors"
    >
      {resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}

export function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [logoUrl, setLogoUrl] = useState<string | null>('/logo.png')
  const inputRef = useRef<HTMLInputElement>(null)
  const { results, isLoading } = useSearch(query)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.logo && !data.logo.includes('.svg')) setLogoUrl(data.logo)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [pathname])

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 100)
    else setQuery('')
  }, [searchOpen])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <>
      {/* ───────────── DESKTOP HEADER (mirrors desktop.html Row 2) ───────────── */}
      <header className="hidden md:block bg-white dark:bg-inverse-surface h-20 border-b border-outline-variant">
        <div className="max-w-[1200px] h-full mx-auto px-4 flex items-center justify-between gap-8">
          {/* LOGO */}
          <Link href="/" className="flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Foz em Foco"
              style={{ height: '48px', width: 'auto', display: 'block' }}
            />
          </Link>

          {/* SEARCH BAR */}
          <div className="flex-1 max-w-md mx-12 relative">
            <input
              type="search"
              placeholder="Buscar no portal..."
              onFocus={() => setSearchOpen(true)}
              className="w-full bg-surface-container rounded-full px-6 py-2 text-sm font-body text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container"
              readOnly
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <ThemeToggle />
            <button
              aria-label="Conta"
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
            >
              <User className="w-5 h-5 text-primary-container" />
            </button>
          </div>
        </div>
      </header>

      {/* ───────────── MOBILE HEADER (mirrors mobile-b section 1) ───────────── */}
      <header className="flex md:hidden sticky top-0 z-40 bg-surface/80 backdrop-blur-md shadow-sm h-16 px-6 items-center justify-between">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          className="w-10 h-10 flex items-center justify-center text-primary-container"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <Link href="/" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Foz em Foco"
            style={{ height: '36px', width: 'auto', display: 'block' }}
          />
        </Link>

        <Link
          href="/anunciantes"
          className="bg-tertiary-fixed text-on-tertiary-fixed text-xs px-4 py-2 font-bold uppercase tracking-wider rounded-sm hover:brightness-95 transition-all"
        >
          Anuncie
        </Link>
      </header>

      {/* ───────────── SEARCH OVERLAY (preserved) ───────────── */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] flex flex-col bg-on-surface/95"
          style={{ backdropFilter: 'blur(20px)' }}
        >
          <div className="max-w-[720px] w-full mx-auto h-[72px] flex items-center px-6 gap-4 border-b border-white/10">
            <Search className="w-[18px] h-[18px] text-on-primary-container flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar notícias..."
              className="flex-1 bg-transparent text-white border-0 outline-none text-xl font-headline"
            />
            <button
              onClick={() => setSearchOpen(false)}
              aria-label="Fechar busca"
              className="text-white/40 hover:text-white transition-colors"
            >
              <X className="w-[22px] h-[22px]" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto max-w-[720px] w-full mx-auto px-6 py-5">
            {isLoading && (
              <div className="flex justify-center pt-16">
                <div className="w-7 h-7 border-2 border-on-primary-container border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {!isLoading && query.length >= 2 && results.length === 0 && (
              <p className="text-center text-white/20 pt-16 text-sm">
                Nenhum resultado para &ldquo;{query}&rdquo;
              </p>
            )}
            {!isLoading && results.length > 0 && (
              <div className="flex flex-col gap-2">
                {results.map((post) => (
                  <Link
                    key={post.id}
                    href={`/${post.slug}`}
                    onClick={() => setSearchOpen(false)}
                    className="flex gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                  >
                    {post.coverImage && (
                      <div className="relative w-[76px] h-[52px] rounded overflow-hidden flex-shrink-0">
                        <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded text-white inline-block mb-1"
                        style={{ background: post.category?.color || '#0f4c81' }}
                      >
                        {post.category?.name}
                      </span>
                      <h3 className="text-sm font-semibold text-white leading-tight font-headline line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-[11px] text-white/30 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
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

      {/* ───────────── MOBILE MENU ───────────── */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[55] md:hidden bg-on-surface/95 flex flex-col"
          style={{ backdropFilter: 'blur(20px)' }}
        >
          <div className="h-16" />
          <nav className="flex-1 flex flex-col items-center justify-center gap-2 p-8">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="font-headline text-3xl font-bold text-white hover:text-on-primary-container"
            >
              Início
            </Link>
            <Link
              href="/categoria/cidade"
              onClick={() => setMenuOpen(false)}
              className="font-headline text-3xl font-bold text-white/80 hover:text-on-primary-container"
            >
              Cidade
            </Link>
            <Link
              href="/categoria/politica"
              onClick={() => setMenuOpen(false)}
              className="font-headline text-3xl font-bold text-white/80 hover:text-on-primary-container"
            >
              Política
            </Link>
            <Link
              href="/categoria/economia"
              onClick={() => setMenuOpen(false)}
              className="font-headline text-3xl font-bold text-white/80 hover:text-on-primary-container"
            >
              Economia
            </Link>
            <Link
              href="/categoria/esportes"
              onClick={() => setMenuOpen(false)}
              className="font-headline text-3xl font-bold text-white/80 hover:text-on-primary-container"
            >
              Esportes
            </Link>
            <Link
              href="/anunciantes"
              onClick={() => setMenuOpen(false)}
              className="mt-6 bg-tertiary-fixed text-on-tertiary-fixed px-8 py-3 rounded-sm text-sm font-bold uppercase tracking-widest"
            >
              Anuncie aqui
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}
