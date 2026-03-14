'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface TopbarProps {
  onMenuClick: () => void
}

interface UserData {
  name: string
  email: string
  role: string
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const [user, setUser] = useState<UserData | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/me')
      .then((r) => r.json())
      .then((data) => setUser(data))
      .catch(() => {})
  }, [])

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin')
  }

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 lg:px-6">
      <button
        onClick={onMenuClick}
        className="text-gray-500 hover:text-gray-700 lg:hidden"
        aria-label="Menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="lg:hidden" />

      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {user?.name || 'Admin'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
              <LogOut className="w-4 h-4 mr-2" /> Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
