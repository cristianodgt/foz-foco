'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

interface UserData {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  _count: { posts: number }
}

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  ADMIN:      { label: 'Admin',      color: '#FF3B30' },
  EDITOR:     { label: 'Editor',     color: '#0A84FF' },
  JOURNALIST: { label: 'Jornalista', color: '#FF9500' },
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [])

  function getInitials(name: string) {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  }

  function getGradient(name: string) {
    const gradients = [
      'linear-gradient(135deg, #FF3B30, #FF9500)',
      'linear-gradient(135deg, #0A84FF, #34C759)',
      'linear-gradient(135deg, #FF9500, #FFD60A)',
      'linear-gradient(135deg, #34C759, #0A84FF)',
      'linear-gradient(135deg, #FF3B30, #0A84FF)',
    ]
    const i = name.charCodeAt(0) % gradients.length
    return gradients[i]
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--adm-text)', margin: 0 }}>Usuários</h1>
          <p style={{ fontSize: '12px', color: 'var(--adm-muted)', marginTop: '2px' }}>{users.length} usuário(s) cadastrado(s)</p>
        </div>
        <button
          className="adm-btn-primary"
          onClick={() => alert('Em breve: convidar novo usuário')}
        >
          ➕ Convidar usuário
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <Loader2 size={28} className="animate-spin" style={{ color: 'var(--adm-muted)' }} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {users.map(user => {
            const role = ROLE_LABELS[user.role] || { label: user.role, color: '#666' }
            return (
              <div key={user.id} className="adm-user-card">
                {/* Avatar */}
                <div style={{
                  width: '60px', height: '60px', borderRadius: '50%',
                  background: getGradient(user.name),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px', fontWeight: 700, color: 'white',
                  margin: '0 auto 12px',
                }}>
                  {getInitials(user.name)}
                </div>

                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--adm-text)', marginBottom: '4px' }}>{user.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--adm-muted)', marginBottom: '12px' }}>{user.email}</div>

                <span style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: role.color,
                  background: `${role.color}20`,
                  marginBottom: '16px',
                }}>
                  {role.label}
                </span>

                {/* Stats */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr',
                  gap: '1px', background: 'var(--adm-border)',
                  borderRadius: '10px', overflow: 'hidden',
                }}>
                  <div style={{ background: 'var(--adm-surface2)', padding: '10px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--adm-text)' }}>{user._count.posts}</div>
                    <div style={{ fontSize: '10px', color: 'var(--adm-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Publicações</div>
                  </div>
                  <div style={{ background: 'var(--adm-surface2)', padding: '10px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--adm-text)' }}>—</div>
                    <div style={{ fontSize: '10px', color: 'var(--adm-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Visualiz.</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
