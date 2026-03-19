'use client'

import { useState, useEffect, useCallback } from 'react'

interface Category {
  id: string
  name: string
  slug: string
  color: string
  icon: string | null
  order: number
  active: boolean
  _count: { posts: number }
}

const defaultForm = { name: '', slug: '', color: '#3B82F6', icon: '', order: 0, active: true }

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState(defaultForm)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<Category | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)

  const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/categories')
      if (res.ok) setCategories(await res.json())
    } catch { /* ignore */ }
  }, [])

  useEffect(() => { fetchCategories() }, [fetchCategories])

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  function openNew() {
    setEditing(null)
    setForm(defaultForm)
    setDialogOpen(true)
  }

  function openEdit(cat: Category) {
    setEditing(cat)
    setForm({ name: cat.name, slug: cat.slug, color: cat.color, icon: cat.icon || '', order: cat.order, active: cat.active })
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!form.name || !form.slug) { showToast('Nome e slug são obrigatórios', 'err'); return }
    setSaving(true)
    try {
      const url = editing ? `/api/admin/categories/${editing.id}` : '/api/admin/categories'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, icon: form.icon || null, order: Number(form.order) }),
      })
      if (!res.ok) {
        const data = await res.json()
        showToast(data.error || 'Erro ao salvar', 'err')
        return
      }
      showToast(editing ? 'Categoria atualizada!' : 'Categoria criada!')
      setDialogOpen(false)
      fetchCategories()
    } catch {
      showToast('Erro de conexão', 'err')
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(cat: Category) {
    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !cat.active }),
      })
      if (res.ok) {
        showToast(cat.active ? 'Categoria desativada' : 'Categoria ativada')
        fetchCategories()
      }
    } catch { /* ignore */ }
  }

  async function confirmDelete() {
    if (!deleteConfirm) return
    try {
      const res = await fetch(`/api/admin/categories/${deleteConfirm.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        showToast(data.error || 'Erro ao excluir', 'err')
        return
      }
      showToast('Categoria excluída!')
      fetchCategories()
    } catch {
      showToast('Erro de conexão', 'err')
    } finally {
      setDeleteConfirm(null)
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Categorias</h1>
          <p style={{ fontSize: 13, color: 'var(--adm-muted)', marginTop: 2 }}>
            Gerencie as categorias de notícias do portal
          </p>
        </div>
        <button className="adm-btn-primary" onClick={openNew}>+ Nova Categoria</button>
      </div>

      {/* Table */}
      <div className="adm-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="adm-table">
          <thead>
            <tr>
              <th>Cor</th>
              <th>Nome</th>
              <th>Slug</th>
              <th>Ícone</th>
              <th>Ordem</th>
              <th>Notícias</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id}>
                <td>
                  <div style={{
                    width: 24, height: 24, borderRadius: 6,
                    background: cat.color, border: '2px solid rgba(255,255,255,0.1)',
                  }} />
                </td>
                <td style={{ fontWeight: 600 }}>{cat.name}</td>
                <td style={{ color: 'var(--adm-muted)' }}>{cat.slug}</td>
                <td style={{ fontSize: 18 }}>{cat.icon || '—'}</td>
                <td>{cat.order}</td>
                <td>{cat._count.posts}</td>
                <td>
                  <span
                    className={`adm-badge ${cat.active ? 'adm-badge-green' : 'adm-badge-gray'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => toggleActive(cat)}
                  >
                    {cat.active ? 'Ativa' : 'Inativa'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="adm-mini-btn" onClick={() => openEdit(cat)}>✏️</button>
                    <button
                      className="adm-mini-btn danger"
                      onClick={() => setDeleteConfirm(cat)}
                      disabled={cat._count.posts > 0}
                      title={cat._count.posts > 0 ? 'Tem notícias vinculadas' : 'Excluir'}
                      style={cat._count.posts > 0 ? { opacity: 0.3, cursor: 'not-allowed' } : {}}
                    >🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--adm-muted)' }}>
                Nenhuma categoria cadastrada
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Dialog - New/Edit */}
      {dialogOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }} onClick={() => setDialogOpen(false)}>
          <div
            className="adm-panel"
            style={{ width: '100%', maxWidth: 480 }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
              {editing ? 'Editar Categoria' : 'Nova Categoria'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="adm-label">Nome</label>
                <input
                  className="adm-input"
                  value={form.name}
                  onChange={e => {
                    const name = e.target.value
                    setForm(f => ({ ...f, name, ...(!editing ? { slug: generateSlug(name) } : {}) }))
                  }}
                  placeholder="Ex: Política"
                />
              </div>

              <div>
                <label className="adm-label">Slug</label>
                <input
                  className="adm-input"
                  value={form.slug}
                  onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  placeholder="Ex: politica"
                />
              </div>

              <div style={{ display: 'flex', gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <label className="adm-label">Cor</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      type="color"
                      value={form.color}
                      onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                      style={{ width: 42, height: 38, border: 'none', background: 'none', cursor: 'pointer' }}
                    />
                    <input
                      className="adm-input"
                      value={form.color}
                      onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
                <div style={{ width: 100 }}>
                  <label className="adm-label">Ícone</label>
                  <input
                    className="adm-input"
                    value={form.icon}
                    onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                    placeholder="🏛️"
                  />
                </div>
                <div style={{ width: 80 }}>
                  <label className="adm-label">Ordem</label>
                  <input
                    className="adm-input"
                    type="number"
                    value={form.order}
                    onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))}
                  />
                </div>
              </div>

              {/* Preview */}
              <div>
                <label className="adm-label">Preview</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '4px 12px', borderRadius: 999,
                      background: form.color, color: 'white',
                      fontSize: 13, fontWeight: 600,
                    }}
                  >
                    {form.icon && <span>{form.icon}</span>}
                    {form.name || 'Categoria'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button className="adm-btn-ghost" onClick={() => setDialogOpen(false)}>Cancelar</button>
                <button className="adm-btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? 'Salvando...' : editing ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }} onClick={() => setDeleteConfirm(null)}>
          <div
            className="adm-panel"
            style={{ width: '100%', maxWidth: 380, textAlign: 'center' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Excluir categoria?</h3>
            <p style={{ fontSize: 13, color: 'var(--adm-muted)', marginBottom: 20 }}>
              A categoria <strong>&quot;{deleteConfirm.name}&quot;</strong> será excluída permanentemente.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button className="adm-btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancelar</button>
              <button className="adm-btn-primary" onClick={confirmDelete}>Excluir</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 200,
          padding: '12px 20px', borderRadius: 10,
          background: toast.type === 'ok' ? 'var(--adm-green)' : 'var(--adm-accent)',
          color: 'white', fontSize: 13, fontWeight: 600,
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          animation: 'fadeIn 0.2s ease',
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}
