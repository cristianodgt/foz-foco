'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Plus, Edit2, Trash2, Loader2, Eye, MousePointer, ToggleLeft, ToggleRight, X } from 'lucide-react'
import { calculateCTR, formatNumber, formatDateShort } from '@/lib/utils'
import type { Ad } from '@/types'

const emptyForm = {
  title: '', client: '', type: 'NATIVE', position: 'FEED_BETWEEN',
  imageUrl: '', targetUrl: '', frequency: 5, active: true,
  startsAt: new Date().toISOString().split('T')[0],
  endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
}

const AD_POSITION_LABELS: Record<string, string> = {
  FEED_BETWEEN: 'Entre Posts', FEED_TOP: 'Topo do Feed',
  GRID_BANNER_TOP: 'Banner Grid - Topo', GRID_BANNER_BOTTOM: 'Banner Grid - Baixo',
  POST_DETAIL: 'Detalhe do Post', SIDEBAR: 'Sidebar'
}
const AD_TYPE_LABELS: Record<string, string> = {
  BANNER: 'Banner', NATIVE: 'Nativo', INTERSTITIAL: 'Interstitial'
}

export default function CampaignsPage() {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Ad | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<{ msg: string; err?: boolean } | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  function showToast(msg: string, err = false) {
    setToast({ msg, err })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchAds = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ads')
      const data = await res.json()
      setAds(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAds() }, [])

  function openNew() {
    setEditing(null)
    setForm({ ...emptyForm })
    setDialogOpen(true)
  }

  function openEdit(ad: Ad) {
    setEditing(ad)
    setForm({
      title: ad.title, client: ad.client, type: ad.type, position: ad.position,
      imageUrl: ad.imageUrl, targetUrl: ad.targetUrl, frequency: ad.frequency,
      active: ad.active,
      startsAt: new Date(ad.startsAt).toISOString().split('T')[0],
      endsAt: new Date(ad.endsAt).toISOString().split('T')[0],
    })
    setDialogOpen(true)
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'ads')
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) setForm((f) => ({ ...f, imageUrl: data.url }))
    } finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    if (!form.title || !form.imageUrl || !form.targetUrl) {
      showToast('Preencha todos os campos obrigatórios', true)
      return
    }
    setSaving(true)
    try {
      const url = editing ? `/api/ads/${editing.id}` : '/api/ads'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        showToast(editing ? 'Anúncio atualizado' : 'Anúncio criado!')
        setDialogOpen(false)
        fetchAds()
      } else {
        const err = await res.json().catch(() => ({}))
        showToast(err.error || 'Erro ao salvar anúncio', true)
      }
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(ad: Ad) {
    await fetch(`/api/ads/${ad.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !ad.active }),
    })
    fetchAds()
  }

  async function confirmDelete(id: string) {
    await fetch(`/api/ads/${id}`, { method: 'DELETE' })
    setAds((prev) => prev.filter((a) => a.id !== id))
    setDeleteConfirm(null)
    showToast('Anúncio deletado')
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
          background: toast.err ? '#FF3B3020' : '#34C75920',
          border: `1px solid ${toast.err ? '#FF3B30' : '#34C759'}`,
          color: toast.err ? '#FF3B30' : '#34C759',
          padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
        }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--adm-text)', margin: 0 }}>Anúncios</h1>
          <p style={{ fontSize: '12px', color: 'var(--adm-muted)', marginTop: '2px' }}>{ads.length} campanha(s) cadastrada(s)</p>
        </div>
        <button className="adm-btn-primary" onClick={openNew}>
          <Plus size={14} style={{ marginRight: '6px' }} /> Novo Anúncio
        </button>
      </div>

      {/* Table panel */}
      <div className="adm-panel" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <Loader2 size={28} className="animate-spin" style={{ color: 'var(--adm-muted)' }} />
          </div>
        ) : ads.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--adm-muted)', fontSize: '14px' }}>
            Nenhum anúncio cadastrado
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="adm-table">
              <thead>
                <tr>
                  {['Anúncio', 'Tipo/Posição', 'Impressões', 'Cliques', 'CTR', 'Período', 'Status', ''].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ads.map((ad) => (
                  <tr key={ad.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {ad.imageUrl && (
                          <div style={{ position: 'relative', width: '48px', height: '36px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                            <Image src={ad.imageUrl} alt={ad.title} fill style={{ objectFit: 'cover' }} />
                          </div>
                        )}
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--adm-text)' }}>{ad.title}</div>
                          <div style={{ fontSize: '11px', color: 'var(--adm-muted)' }}>{ad.client}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '12px', color: 'var(--adm-text)' }}>{AD_TYPE_LABELS[ad.type]}</div>
                      <div style={{ fontSize: '11px', color: 'var(--adm-muted)' }}>{AD_POSITION_LABELS[ad.position]}</div>
                    </td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--adm-muted)' }}>
                        <Eye size={13} /> {formatNumber(ad.impressions)}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--adm-muted)' }}>
                        <MousePointer size={13} /> {formatNumber(ad.clicks)}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#0A84FF' }}>
                        {calculateCTR(ad.clicks, ad.impressions)}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '11px', color: 'var(--adm-muted)' }}>
                        <div>{formatDateShort(ad.startsAt)}</div>
                        <div>{formatDateShort(ad.endsAt)}</div>
                      </div>
                    </td>
                    <td>
                      <span className="adm-badge" style={{
                        background: ad.active ? '#34C75920' : '#66666620',
                        color: ad.active ? '#34C759' : 'var(--adm-muted)',
                      }}>
                        {ad.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <button className="adm-mini-btn" onClick={() => toggleActive(ad)} title="Ativar/Desativar">
                          {ad.active
                            ? <ToggleRight size={16} style={{ color: '#34C759' }} />
                            : <ToggleLeft size={16} />}
                        </button>
                        <button className="adm-mini-btn" onClick={() => openEdit(ad)}>
                          <Edit2 size={14} />
                        </button>
                        <button className="adm-mini-btn" onClick={() => setDeleteConfirm(ad.id)} style={{ color: '#FF3B30' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div className="adm-panel" style={{ width: '360px', padding: '28px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🗑️</div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--adm-text)', marginBottom: '8px' }}>Deletar anúncio?</div>
            <div style={{ fontSize: '13px', color: 'var(--adm-muted)', marginBottom: '24px' }}>Esta ação não pode ser desfeita.</div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button className="adm-btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancelar</button>
              <button onClick={() => confirmDelete(deleteConfirm)} style={{
                padding: '8px 20px', borderRadius: '8px', border: 'none',
                background: '#FF3B30', color: 'white', fontWeight: 600, fontSize: '13px', cursor: 'pointer',
              }}>Deletar</button>
            </div>
          </div>
        </div>
      )}

      {/* Form modal */}
      {dialogOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        }}>
          <div className="adm-panel" style={{ width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', padding: '28px' }}>
            {/* Modal header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--adm-text)', margin: 0 }}>
                {editing ? 'Editar Anúncio' : 'Novo Anúncio'}
              </h2>
              <button className="adm-mini-btn" onClick={() => setDialogOpen(false)}><X size={16} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Título + Cliente */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="adm-label">Título *</label>
                  <input className="adm-input" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
                </div>
                <div>
                  <label className="adm-label">Cliente *</label>
                  <input className="adm-input" value={form.client} onChange={(e) => setForm((f) => ({ ...f, client: e.target.value }))} />
                </div>
              </div>

              {/* Tipo + Posição */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="adm-label">Tipo</label>
                  <select className="adm-select" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
                    <option value="NATIVE">Nativo</option>
                    <option value="BANNER">Banner</option>
                    <option value="INTERSTITIAL">Interstitial</option>
                  </select>
                </div>
                <div>
                  <label className="adm-label">Posição</label>
                  <select className="adm-select" value={form.position} onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}>
                    <option value="GRID_BANNER_TOP">Banner Grid - Topo</option>
                    <option value="GRID_BANNER_BOTTOM">Banner Grid - Baixo</option>
                    <option value="FEED_BETWEEN">Entre Posts</option>
                    <option value="FEED_TOP">Topo do Feed</option>
                    <option value="POST_DETAIL">Detalhe do Post</option>
                    <option value="SIDEBAR">Sidebar</option>
                  </select>
                </div>
              </div>

              {/* URL destino */}
              <div>
                <label className="adm-label">URL de Destino *</label>
                <input className="adm-input" placeholder="https://" value={form.targetUrl} onChange={(e) => setForm((f) => ({ ...f, targetUrl: e.target.value }))} />
              </div>

              {/* Imagem */}
              <div>
                <label className="adm-label">Imagem *</label>
                {form.imageUrl ? (
                  <div style={{ position: 'relative', height: '120px', borderRadius: '10px', overflow: 'hidden' }}>
                    <Image src={form.imageUrl} alt="preview" fill style={{ objectFit: 'cover' }} />
                    <button
                      onClick={() => setForm((f) => ({ ...f, imageUrl: '' }))}
                      style={{
                        position: 'absolute', top: '8px', right: '8px',
                        background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%',
                        width: '24px', height: '24px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', cursor: 'pointer', color: 'white',
                      }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <label className="adm-upload-zone" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80px' }}>
                    {uploading
                      ? <Loader2 size={20} className="animate-spin" style={{ color: 'var(--adm-muted)' }} />
                      : <span style={{ fontSize: '13px', color: 'var(--adm-muted)' }}>Clique para fazer upload</span>}
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                  </label>
                )}
              </div>

              {/* Frequência + Datas */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="adm-label">Frequência</label>
                  <input className="adm-input" type="number" min={1} value={form.frequency} onChange={(e) => setForm((f) => ({ ...f, frequency: parseInt(e.target.value) }))} />
                </div>
                <div>
                  <label className="adm-label">Início</label>
                  <input className="adm-input" type="date" value={form.startsAt} onChange={(e) => setForm((f) => ({ ...f, startsAt: e.target.value }))} />
                </div>
                <div>
                  <label className="adm-label">Fim</label>
                  <input className="adm-input" type="date" value={form.endsAt} onChange={(e) => setForm((f) => ({ ...f, endsAt: e.target.value }))} />
                </div>
              </div>

              {/* Toggle ativo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label className="adm-toggle">
                  <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />
                  <span className="adm-toggle-track" />
                </label>
                <span style={{ fontSize: '13px', color: 'var(--adm-text)' }}>Ativo</span>
              </div>
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button className="adm-btn-ghost" onClick={() => setDialogOpen(false)}>Cancelar</button>
              <button className="adm-btn-primary" onClick={handleSave} disabled={saving}>
                {saving && <Loader2 size={14} className="animate-spin" style={{ marginRight: '6px' }} />}
                {editing ? 'Salvar' : 'Criar Anúncio'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
