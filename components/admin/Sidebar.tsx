'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, FileText, Megaphone, Settings, Newspaper, X
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/posts', label: 'Posts', icon: FileText },
  { href: '/admin/campaigns', label: 'Anúncios', icon: Megaphone },
  { href: '/admin/settings', label: 'Configurações', icon: Settings },
]

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-[#1E293B] text-white flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-white/10">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <Newspaper className="w-6 h-6 text-orange-400" />
          <span>Foz<span className="text-orange-400">.</span>Foco</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-white/60 hover:text-white lg:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* View site link */}
      <div className="p-4 border-t border-white/10">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          <Newspaper className="w-4 h-4" />
          Ver site público
        </Link>
      </div>
    </aside>
  )
}
