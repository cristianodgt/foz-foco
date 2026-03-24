'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, Clock } from 'lucide-react'
// Logo importada via next/image abaixo
import { motion, AnimatePresence } from 'framer-motion'
import { formatRelativeDate } from '@/lib/utils'
import type { Post } from '@/types'

const NAV_LINKS = [
  { label: 'Todos', href: '/' },
  { label: 'Política', href: '/categoria/politica' },
  { label: 'Economia', href: '/categoria/economia' },
  { label: 'Segurança', href: '/categoria/seguranca' },
  { label: 'Turismo', href: '/categoria/turismo' },
  { label: 'Cultura', href: '/categoria/cultura' },
]

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
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu and search on navigation
  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [pathname])

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
    }
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
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || menuOpen || searchOpen ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div className="max-w-[640px] mx-auto px-3 h-14 flex items-center gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src={logoUrl || '/logo.svg'}
              alt="Foz Cidade em Foco"
              width={72}
              height={28}
              style={{
                objectFit: 'contain',
                filter: logoUrl ? 'none' : 'brightness(0) invert(1)',
              }}
              priority
              unoptimized={!!logoUrl}
            />
          </Link>

          {/* Category strip — horizontally scrollable */}
          <nav
            className="flex-1 flex items-center gap-1.5 overflow-x-auto"
            style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex-shrink-0 text-xs font-semibold px-3 py-1 rounded-full transition-all whitespace-nowrap ${
                  pathname === link.href
                    ? 'bg-orange-400 text-black'
                    : 'text-white/70 hover:text-white bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => { setSearchOpen(true); setMenuOpen(false) }}
              className="text-white/80 hover:text-white transition-colors p-1"
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white/80 hover:text-white transition-colors p-1"
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Search popup */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md flex flex-col"
            style={{ zIndex: 60 }}
          >
            {/* Search input bar */}
            <div className="h-14 flex items-center px-3 gap-2 border-b border-white/10">
              <Search className="w-5 h-5 text-white/40 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar notícias..."
                className="flex-1 bg-transparent text-white placeholder-white/30 text-base outline-none"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-white/50 hover:text-white transition-colors p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto max-w-[640px] w-full mx-auto px-3 py-4">
              {isLoading && (
                <div className="flex justify-center py-12">
                  <div className="w-7 h-7 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {!isLoading && query.length >= 2 && results.length === 0 && (
                <div className="text-center py-16 text-white/30">
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Nenhum resultado para &quot;{query}&quot;</p>
                </div>
              )}

              {!isLoading && results.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs text-white/30">{results.length} resultado(s)</p>
                  {results.map((post) => (
                    <Link
                      key={post.id}
                      href={`/${post.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      {post.coverImage && (
                        <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                          style={{ backgroundColor: post.category?.color || '#666' }}
                        >
                          {post.category?.name}
                        </span>
                        <h3 className="text-sm font-semibold text-white mt-1 line-clamp-2 leading-snug">
                          {post.title}
                        </h3>
                        <p className="text-xs text-white/30 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.publishedAt ? formatRelativeDate(post.publishedAt) : ''}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {!query && (
                <div className="text-center py-16 text-white/20">
                  <Search className="w-14 h-14 mx-auto mb-4 opacity-30" />
                  <p>Digite para buscar notícias</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-md flex flex-col"
          >
            <div className="h-14" />
            <nav className="flex-1 flex flex-col justify-center items-center gap-5 p-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl font-bold text-white hover:text-orange-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
