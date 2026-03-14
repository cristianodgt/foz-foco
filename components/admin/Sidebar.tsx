'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, ExternalLink } from 'lucide-react'

const NAV: Array<{ section?: string; href?: string; label?: string; icon?: string; badge?: string; exact?: boolean }> = [
  { section: 'Conteúdo' },
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊', exact: true },
  { href: '/admin/posts/novo', label: 'Nova Notícia', icon: '✏️', badge: '+', exact: true },
  { href: '/admin/posts', label: 'Notícias', icon: '📰', exact: true },
  { section: 'Monetização' },
  { href: '/admin/campaigns', label: 'Anúncios', icon: '📣', exact: true },
  { section: 'Gestão' },
  { href: '/admin/usuarios', label: 'Usuários', icon: '👥', exact: true },
  { href: '/admin/settings', label: 'Configurações', icon: '⚙️', exact: true },
]

interface SidebarProps {
  onClose?: () => void
  userName?: string
  userRole?: string
}

export function Sidebar({ onClose, userName = 'Admin', userRole = 'Editor-chefe' }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  const initials = userName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <aside style={{
      width: '220px',
      minHeight: '100vh',
      background: 'var(--adm-surface)',
      borderRight: '1px solid var(--adm-border)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Logo */}
      <div style={{
        padding: '18px 18px 14px',
        borderBottom: '1px solid var(--adm-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        justifyContent: 'space-between',
      }}>
        <Link href="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '9px',
            background: 'linear-gradient(135deg, #FF3B30, #FF9500)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '14px',
            color: 'white',
            letterSpacing: '0.5px',
            flexShrink: 0,
          }}>FC</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--adm-text)', lineHeight: 1.1 }}>FOZ.FOCO</div>
            <div style={{ fontSize: '10px', color: 'var(--adm-muted)' }}>Painel Admin</div>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--adm-muted)', padding: '4px' }}>
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 10px', overflowY: 'auto' }}>
        {NAV.map((item, i) => {
          if (item.section) {
            return <div key={i} className="adm-section-label">{item.section}</div>
          }
          const active = isActive(item.href!, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href!}
              onClick={onClose}
              className={`adm-nav-item${active ? ' active' : ''}`}
            >
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{
                  background: 'var(--adm-accent)',
                  color: 'white',
                  borderRadius: '999px',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 700,
                }}>{item.badge}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom: view site + user chip */}
      <div style={{ padding: '10px', borderTop: '1px solid var(--adm-border)' }}>
        <Link href="/" target="_blank" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          fontSize: '12px',
          color: 'var(--adm-muted)',
          padding: '7px 10px',
          borderRadius: '8px',
          textDecoration: 'none',
          transition: 'color 0.15s',
          marginBottom: '8px',
        }}>
          <ExternalLink size={13} /> Ver site público
        </Link>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 10px',
          borderRadius: '9px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--adm-border)',
        }}>
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FF3B30, #FF9500)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 700,
            color: 'white',
            flexShrink: 0,
          }}>{initials}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--adm-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName}</div>
            <div style={{ fontSize: '10px', color: 'var(--adm-muted)' }}>{userRole}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
