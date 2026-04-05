'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Newspaper, Compass, Store, Briefcase } from 'lucide-react'

// Mirrors mobile-b.html section 9 — fixed bottom nav with 4 items, visible
// only on mobile (md:hidden).
const ITEMS = [
  { label: 'Notícias', href: '/', icon: Newspaper, match: (p: string) => p === '/' },
  {
    label: 'Turismo',
    href: '/categoria/turismo',
    icon: Compass,
    match: (p: string) => p.startsWith('/categoria/turismo'),
  },
  {
    label: 'Guia',
    href: '/categoria/guia-comercial',
    icon: Store,
    match: (p: string) => p.startsWith('/categoria/guia'),
  },
  {
    label: 'Empregos',
    href: '/categoria/empregos',
    icon: Briefcase,
    match: (p: string) => p.startsWith('/categoria/empregos'),
  },
]

export function MobileBottomNav() {
  const pathname = usePathname() || '/'

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 dark:bg-inverse-surface/90 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border-t border-outline-variant flex justify-around py-3"
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
    >
      {ITEMS.map((item) => {
        const Icon = item.icon
        const active = item.match(pathname)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              active
                ? 'flex flex-col items-center gap-1 bg-blue-50 text-primary-container rounded-xl px-3 py-1'
                : 'flex flex-col items-center gap-1 text-outline hover:text-primary-container transition-colors'
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
