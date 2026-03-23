'use client'

import { useEffect, useState } from 'react'
import { Loader2, X, Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

interface UserData {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  active: boolean
  createdAt: string
  _count: { posts: number }
}

interface CurrentUser {
  id: string
  role: string
}

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  ADMIN:  { label: 'Admin',  color: '#FF3B30' },
  EDITOR: { label: 'Editor', color: '#0A84FF' },
}

const emptyForm = { name: '', email: '', password: '', role: 'EDITOR' as 'ADMIN' | 'EDITOR' }

export default function UsuariosPage() {
  const [users, setUsers]         = useState<UserData[]>([])
  const [loading, setLoading]     = useState(true)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [dialogOpen, setDialogOpen]   = useState(false)
  const [editing, setEditing]         = useState<UserData | null>(null)
  const [form, setForm]               = useState(emptyForm)
  const [saving, setSaving]           = useState(false)
  const [error, setError]             = useState('')

  const isAdmin = currentUser?.role === 'ADMIN'

  useEffect(() => {
    fetch('/api/admin/me').then(r => r.json()).then(d => setCurrentUser(d))
    loadUsers()
  }, [])

  function loadUsers() {
    setLoading(true)
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setError('')
    setDialogOpen(true)
  }

  function openEdit(user: UserData) {
    setEditing(user)
    setForm({ name: user.name, email: user.email, password: '', role: user.role as 'ADMIN' | 'EDITOR' })
    setError('')
    setDialogOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const body: Record<string, string> = { name: form.name, email: form.email, role: form.role }
      if (form.password) body.password = form.password
      if (!editing) body.password = form.password // obrigatório no create

      const url    = editing ? `/api/admin/users/${editing.id}` : '/api/admin/users'
      const method = editing ? 'PUT' : 'POST'
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const json   = await res.json()

      if (!res.ok) { setError(json.error || 'Erro ao salvar'); return }
      setDialogOpen(false)
      loadUsers()
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleActive(user: UserData) {
    const res  = await fetch(`/api/admin/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !user.active }),
    })
    if (res.ok) loadUsers()
  }

  async function handleDelete(user: UserData) {
    if (!confirm(`Excluir o usuário "${user.name}"? Esta ação não pode ser desfeita.`)) return
    const res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' })
    const json = await res.json()
    if (!res.ok) { alert(json.error || 'Erro ao excluir'); return }
    loadUsers()
  }

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
    return gradients[name.charCodeAt(0) % gradients.length]
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--adm-text)', margin: 0 }}>Usuários</h1>
          <p style={{ fontSize: '12px', color: 'var(--adm-muted)', marginTop: '2px' }}>{users.length} usuário(s) cadastrado(s)</p>
        </div>
        {isAdmin && (
          <button className="adm-btn-primary" onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={15} /> Novo usuário
          </button>
        )}
      </div>

      {/* Aviso para não-admins */}
      {!isAdmin && !loading && (
        <div style={{
          padding: '12px 16px', borderRadius: '10px', marginBottom: '20px',
          background: 'rgba(255,149,0,0.1)', border: '1px solid rgba(255,149,0,0.3)',
          color: '#FF9500', fontSize: '13px',
        }}>
          🔒 Você tem acesso somente leitura. Apenas administradores podem criar ou editar usuários.
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <Loader2 size={28} className="animate-spin" style={{ color: 'var(--adm-muted)' }} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {users.map(user => {
            const role = ROLE_LABELS[user.role] || { label: user.role, color: '#666' }
            const isSelf = currentUser?.id === user.id
            return (
              <div key={user.id} className="adm-user-card" style={{ opacity: user.active ? 1 : 0.55, position: 'relative' }}>
                {/* Badge inativo */}
                {!user.active && (
                  <span style={{
                    position: 'absolute', top: '10px', right: '10px',
                    fontSize: '10px', fontWeight: 700, padding: '2px 8px',
                    borderRadius: '999px', background: 'rgba(255,59,48,0.15)', color: '#FF3B30',
                  }}>INATIVO</span>
                )}

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

                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--adm-text)', marginBottom: '2px' }}>
                  {user.name} {isSelf && <span style={{ fontSize: '11px', color: 'var(--adm-muted)', fontWeight: 400 }}>(você)</span>}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--adm-muted)', marginBottom: '10px' }}>{user.email}</div>

                <span style={{
                  display: 'inline-block', padding: '4px 12px', borderRadius: '999px',
                  fontSize: '11px', fontWeight: 700, color: role.color, background: `${role.color}20`,
                  marginBottom: '14px',
                }}>
                  {role.label}
                </span>

                {/* Stats */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px',
                  background: 'var(--adm-border)', borderRadius: '10px', overflow: 'hidden', marginBottom: '14px',
                }}>
                  <div style={{ background: 'var(--adm-surface2)', padding: '10px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--adm-text)' }}>{user._count.posts}</div>
                    <div style={{ fontSize: '10px', color: 'var(--adm-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Publicações</div>
                  </div>
                  <div style={{ background: 'var(--adm-surface2)', padding: '10px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--adm-muted)', marginTop: '4px' }}>
                      {new Date(user.createdAt).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--adm-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Membro desde</div>
                  </div>
                </div>

                {/* Ações — só ADMIN vê */}
                {isAdmin && (
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button
                      onClick={() => openEdit(user)}
                      title="Editar"
                      style={{
                        flex: 1, padding: '7px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                        background: 'var(--adm-surface2)', color: 'var(--adm-muted)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '12px',
                      }}
                    >
                      <Pencil size={13} /> Editar
                    </button>
                    <button
                      onClick={() => handleToggleActive(user)}
                      title={user.active ? 'Desativar' : 'Ativar'}
                      disabled={isSelf}
                      style={{
                        padding: '7px 10px', borderRadius: '8px', border: 'none',
                        cursor: isSelf ? 'not-allowed' : 'pointer',
                        background: 'var(--adm-surface2)',
                        color: user.active ? '#FF9500' : '#34C759',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        opacity: isSelf ? 0.4 : 1,
                      }}
                    >
                      {user.active ? <ToggleLeft size={16} /> : <ToggleRight size={16} />}
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      title="Excluir"
                      disabled={isSelf}
                      style={{
                        padding: '7px 10px', borderRadius: '8px', border: 'none',
                        cursor: isSelf ? 'not-allowed' : 'pointer',
                        background: 'rgba(255,59,48,0.1)', color: '#FF3B30',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        opacity: isSelf ? 0.4 : 1,
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Modal criar/editar */}
      {dialogOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={e => { if (e.target === e.currentTarget) setDialogOpen(false) }}>
          <div style={{
            background: 'var(--adm-surface)', borderRadius: '16px', padding: '28px',
            width: '100%', maxWidth: '440px', boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
          }}>
            {/* Título */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
              <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: 'var(--adm-text)' }}>
                {editing ? 'Editar usuário' : 'Novo usuário'}
              </h2>
              <button onClick={() => setDialogOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--adm-muted)' }}>
                <X size={18} />
              </button>
            </div>

            {/* Erro */}
            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: '8px', marginBottom: '16px',
                background: 'rgba(255,59,48,0.1)', color: '#FF3B30', fontSize: '13px',
              }}>{error}</div>
            )}

            {/* Campos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--adm-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>
                  Nome *
                </label>
                <input
                  className="adm-input"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Nome completo"
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--adm-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>
                  Email *
                </label>
                <input
                  className="adm-input"
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="email@exemplo.com"
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--adm-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>
                  Senha {editing ? '(deixe vazio para manter)' : '*'}
                </label>
                <input
                  className="adm-input"
                  type="password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder={editing ? 'Nova senha (opcional)' : 'Mínimo 6 caracteres'}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--adm-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>
                  Papel *
                </label>
                <select
                  className="adm-input"
                  value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value as 'ADMIN' | 'EDITOR' }))}
                >
                  <option value="EDITOR">Editor — Cria e edita notícias</option>
                  <option value="ADMIN">Admin — Acesso total ao sistema</option>
                </select>
              </div>

              {/* Info de permissões */}
              <div style={{
                padding: '10px 14px', borderRadius: '8px',
                background: 'var(--adm-surface2)', fontSize: '12px', color: 'var(--adm-muted)',
              }}>
                {form.role === 'ADMIN'
                  ? '🔑 Admin: acesso total — usuários, categorias, anúncios, configurações e posts.'
                  : '✏️ Editor: pode criar e editar notícias. Sem acesso a usuários, configurações e anúncios.'}
              </div>
            </div>

            {/* Botões */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '22px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDialogOpen(false)}
                style={{
                  padding: '9px 18px', borderRadius: '8px', border: '1px solid var(--adm-border)',
                  background: 'transparent', color: 'var(--adm-muted)', cursor: 'pointer', fontSize: '14px',
                }}
              >
                Cancelar
              </button>
              <button
                className="adm-btn-primary"
                onClick={handleSave}
                disabled={saving || !form.name || !form.email || (!editing && !form.password)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: saving ? 0.7 : 1 }}
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {editing ? 'Salvar' : 'Criar usuário'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
