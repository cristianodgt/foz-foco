import Link from 'next/link'
import type { Category } from '@/types'

interface CategoryNavBarProps {
  categories: Pick<Category, 'id' | 'name' | 'slug'>[]
}

// Mirrors desktop.html Row 4 — sticky bg-primary-container nav with DB-driven
// category links + amber ANUNCIE AQUI CTA. Hidden on mobile (mobile uses the
// MobileBottomNav instead).
export function CategoryNavBar({ categories }: CategoryNavBarProps) {
  return (
    <nav className="hidden md:block sticky top-0 z-40 bg-primary-container shadow-lg">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between">
        <ul className="flex items-stretch">
          <li>
            <Link
              href="/"
              className="block px-5 py-4 text-white font-label text-xs font-bold tracking-widest uppercase hover:bg-white/5 transition-colors"
            >
              Home
            </Link>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/categoria/${cat.slug}`}
                className="block px-5 py-4 text-white font-label text-xs font-bold tracking-widest uppercase hover:bg-white/5 transition-colors"
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/anunciantes"
          className="bg-tertiary-fixed text-on-tertiary-fixed px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest m-2 hover:brightness-95 transition-all"
        >
          ANUNCIE AQUI
        </Link>
      </div>
    </nav>
  )
}
