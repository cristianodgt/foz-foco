'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Search, Newspaper } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { label: 'Todos', href: '/' },
  { label: 'Política', href: '/categoria/politica' },
  { label: 'Economia', href: '/categoria/economia' },
  { label: 'Segurança', href: '/categoria/seguranca' },
  { label: 'Turismo', href: '/categoria/turismo' },
  { label: 'Cultura', href: '/categoria/cultura' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || menuOpen ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div className="max-w-[640px] mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl">
            <Newspaper className="w-6 h-6 text-orange-400" />
            <span>Foz<span className="text-orange-400">.</span>Foco</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white font-semibold text-sm px-3 py-1.5 rounded-lg hover:bg-white/15 transition-all"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/busca" className="text-white hover:text-white/70 transition-colors p-2 ml-1">
              <Search className="w-4 h-4" />
            </Link>
          </nav>

          {/* Mobile buttons */}
          <div className="flex md:hidden items-center gap-3">
            <Link href="/busca" className="text-white/80 hover:text-white transition-colors p-1">
              <Search className="w-5 h-5" />
            </Link>
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

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-md flex flex-col md:hidden"
          >
            <div className="h-14" /> {/* header space */}
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
              <div className="w-16 h-px bg-white/20 my-2" />
              <Link
                href="/busca"
                onClick={() => setMenuOpen(false)}
                className="text-lg text-white/60 hover:text-white transition-colors flex items-center gap-2"
              >
                <Search className="w-5 h-5" /> Buscar
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
