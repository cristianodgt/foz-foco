'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, LogOut, ChevronDown } from 'lucide-react'

interface TopbarProps {
  onMenuClick: () => void
}

interface UserData {
  name: string
  email: string
  role: string
}

const PAGE_TITLES: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/posts': 'Notícias',
  '/admin/posts/novo': 'Nova Notícia',
  '/admin/campaigns': 'Anúncios',
  '/admin/usuarios': 'Usuários',
  '/admin/settings': 'Configurações',
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const [user, setUser] = useState<UserData | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const pageTitle = Object.entries(PAGE_TITLES).find(([path]) => pathname === path || pathname.startsWith(path + '/'))?.[1] || 'Painel'

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

  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'A'

  return (
    <header style={{
      height: '56px',
      background: 'var(--adm-surface)',
      borderBottom: '1px solid var(--adm-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      flexShrink: 0,
    }}>
      {/* Left: hamburger + title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          onClick={onMenuClick}
          className="lg:hidden"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--adm-muted)', padding: '4px', display: 'flex' }}
        >
          <Menu size={20} />
        </button>
        <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--adm-text)' }}>{pageTitle}</span>
      </div>

      {/* Right: user dropdown */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setMenuOpen(o => !o)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '9px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--adm-border)',
            borderRadius: '9px',
            padding: '6px 10px',
            cursor: 'pointer',
            color: 'var(--adm-text)',
          }}
        >
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FF3B30, #FF9500)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 700,
            color: 'white',
          }}>{initials}</div>
          <span style={{ fontSize: '13px', fontWeight: 500 }}>{user?.name || 'Admin'}</span>
          <ChevronDown size={13} style={{ color: 'var(--adm-muted)' }} />
        </button>

        {menuOpen && (
          <>
            <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
            <div style={{
              position: 'absolute',
              right: 0,
              top: '44px',
              background: 'var(--adm-surface2)',
              border: '1px solid var(--adm-border)',
              borderRadius: '11px',
              minWidth: '180px',
              zIndex: 50,
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}>
              <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--adm-border)' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--adm-text)' }}>{user?.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--adm-muted)', marginTop: '2px' }}>{user?.email}</div>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  width: '100%',
                  padding: '11px 14px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#FF3B30',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
              >
                <LogOut size={14} /> Sair
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
