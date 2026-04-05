import Link from 'next/link'
import type { Category } from '@/types'

interface CategoryNavBarProps {
  categories: Pick<Category, 'id' | 'name' | 'slug'>[]
}

// Mirrors desktop.html Row 4 — sticky bg-primary-container nav with DB-driven
// category links. Hidden on mobile (mobile uses MobileBottomNav instead).
export function CategoryNavBar({ categories }: CategoryNavBarProps) {
  return (
    <nav className="hidden md:block sticky top-0 z-40 bg-primary-container shadow-lg">
      <div className="max-w-[1200px] mx-auto">
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
      </div>
    </nav>
  )
}
