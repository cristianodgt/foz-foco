'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { formatRelativeDate, formatNumber } from '@/lib/utils'
import type { Post } from '@/types'

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  PUBLISHED: { label: 'Publicado', cls: 'adm-badge adm-badge-green' },
  DRAFT:     { label: 'Rascunho', cls: 'adm-badge adm-badge-gray' },
  ARCHIVED:  { label: 'Arquivado', cls: 'adm-badge adm-badge-gray' },
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Post | null>(null)
  const { toast } = useToast()

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: '50' })
      if (search) params.set('search', search)
      if (statusFilter !== 'all') params.set('status', statusFilter)
      const res = await fetch(`/api/admin/posts?${params}`)
      const data = await res.json()
      setPosts(data.data || [])
      setTotal(data.total || 0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeout = setTimeout(fetchPosts, 300)
    return () => clearTimeout(timeout)
  }, [search, statusFilter])

  async function deletePost(post: Post) {
    setDeleting(post.id)
    setConfirmDelete(null)
    try {
      const res = await fetch(`/api/admin/posts/${post.id}`, { method: 'DELETE' })
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== post.id))
        toast({ title: 'Notícia deletada' })
      } else {
        toast({ title: 'Erro ao deletar notícia', variant: 'destructive' })
      }
    } finally {
      setDeleting(null)
    }
  }

  async function toggleStatus(post: Post) {
    const newStatus = post.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
    const res = await fetch(`/api/admin/posts/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...post, status: newStatus, tags: post.tags?.map((t: { name: string }) => t.name) || [] }),
    })
    if (res.ok) {
      const updated = await res.json()
      setPosts((prev) => prev.map((p) => (p.id === post.id ? updated : p)))
      toast({ title: newStatus === 'PUBLISHED' ? '✅ Publicado!' : 'Despublicado' })
    }
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--adm-text)', margin: 0 }}>Notícias</h1>
          <p style={{ fontSize: '12px', color: 'var(--adm-muted)', marginTop: '2px' }}>{total} notícia(s) no total</p>
        </div>
        <Link href="/admin/posts/novo" className="adm-btn-primary">✏️ Nova Notícia</Link>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input
          className="adm-input"
          style={{ flex: 1, minWidth: '200px' }}
          placeholder="🔍 Buscar por título..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="adm-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Todos os status</option>
          <option value="PUBLISHED">Publicado</option>
          <option value="DRAFT">Rascunho</option>
          <option value="ARCHIVED">Arquivado</option>
        </select>
      </div>

      {/* Table */}
      <div className="adm-panel" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
            <Loader2 className="animate-spin" size={28} style={{ color: 'var(--adm-muted)' }} />
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--adm-muted)', fontSize: '14px' }}>
            Nenhuma notícia encontrada
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Notícia</th>
                  <th>Categoria</th>
                  <th>Status</th>
                  <th>Engajamento</th>
                  <th>Data</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => {
                  const status = STATUS_CONFIG[post.status] || STATUS_CONFIG.DRAFT
                  return (
                    <tr key={post.id}>
                      {/* Title + thumbnail */}
                      <td style={{ maxWidth: '320px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {post.coverImage ? (
                            <div style={{
                              width: '44px', height: '44px', borderRadius: '8px',
                              backgroundImage: `url(${post.coverImage})`,
                              backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0,
                            }} />
                          ) : (
                            <div style={{
                              width: '44px', height: '44px', borderRadius: '8px',
                              background: 'var(--adm-surface2)', display: 'flex',
                              alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0,
                            }}>📰</div>
                          )}
                          <div style={{ minWidth: 0 }}>
                            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--adm-text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</p>
                            {post.featured && <span style={{ fontSize: '11px', color: '#FF9500' }}>★ Destaque</span>}
                          </div>
                        </div>
                      </td>
                      {/* Category */}
                      <td>
                        {post.category && (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', padding: '3px 9px',
                            borderRadius: '999px', fontSize: '11px', fontWeight: 600, color: 'white',
                            background: post.category.color || '#666',
                          }}>{post.category.name}</span>
                        )}
                      </td>
                      {/* Status */}
                      <td>
                        <span className={status.cls}>{status.label}</span>
                      </td>
                      {/* Engagement */}
                      <td>
                        <span style={{ fontSize: '12px', color: 'var(--adm-muted)' }}>
                          👁 {formatNumber(post.views || 0)}
                        </span>
                      </td>
                      {/* Date */}
                      <td>
                        <span style={{ fontSize: '12px', color: 'var(--adm-muted)' }}>
                          {formatRelativeDate(post.publishedAt || post.createdAt)}
                        </span>
                      </td>
                      {/* Actions */}
                      <td>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => toggleStatus(post)}
                            className="adm-mini-btn"
                            title={post.status === 'PUBLISHED' ? 'Despublicar' : 'Publicar'}
                          >
                            {post.status === 'PUBLISHED' ? '✅' : '⭕'}
                          </button>
                          <Link href={`/admin/posts/${post.id}`} className="adm-mini-btn" style={{ textDecoration: 'none' }}>✏️</Link>
                          <button
                            onClick={() => setConfirmDelete(post)}
                            disabled={deleting === post.id}
                            className="adm-mini-btn danger"
                          >
                            {deleting === post.id ? <Loader2 size={13} className="animate-spin" /> : '🗑️'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => setConfirmDelete(null)}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--adm-surface2)', border: '1px solid var(--adm-border)',
              borderRadius: '16px', padding: '28px', maxWidth: '380px', width: '90%',
            }}
          >
            <div style={{ fontSize: '28px', textAlign: 'center', marginBottom: '12px' }}>🗑️</div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--adm-text)', textAlign: 'center', margin: '0 0 8px' }}>Deletar notícia?</h3>
            <p style={{ fontSize: '13px', color: 'var(--adm-muted)', textAlign: 'center', margin: '0 0 22px' }}>
              &quot;{confirmDelete.title}&quot; será permanentemente removida.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setConfirmDelete(null)} className="adm-btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Cancelar</button>
              <button onClick={() => deletePost(confirmDelete)} className="adm-btn-primary" style={{ flex: 1, justifyContent: 'center', background: '#FF3B30' }}>Sim, deletar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
