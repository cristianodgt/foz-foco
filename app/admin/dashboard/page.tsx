'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatNumber, formatRelativeDate } from '@/lib/utils'
import type { DashboardStats } from '@/types'

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  PUBLISHED: { label: 'Publicado', cls: 'adm-badge adm-badge-green' },
  DRAFT: { label: 'Rascunho', cls: 'adm-badge adm-badge-gray' },
  ARCHIVED: { label: 'Arquivado', cls: 'adm-badge adm-badge-gray' },
}

const STAT_CARDS = [
  { key: 'totalPosts',     label: 'Total de notícias',  icon: '📰', border: '#FF3B30' },
  { key: 'publishedPosts', label: 'Publicadas',          icon: '✅', border: '#34C759' },
  { key: 'totalViews',     label: 'Visualizações',       icon: '👁️', border: '#0A84FF' },
  { key: 'activeAds',      label: 'Anúncios ativos',     icon: '📣', border: '#FFD60A' },
]

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((data) => setStats(data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--adm-text)', margin: 0 }}>Dashboard</h1>
          <p style={{ fontSize: '12px', color: 'var(--adm-muted)', marginTop: '2px' }}>Visão geral do portal</p>
        </div>
        <Link href="/admin/posts/novo" className="adm-btn-primary">✏️ Nova Notícia</Link>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
        {STAT_CARDS.map((card) => {
          const value = stats ? ((stats as unknown as Record<string, number>)[card.key] ?? 0) : 0
          return (
            <div key={card.key} className="adm-stat-card" style={{ borderTopColor: card.border }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', color: 'var(--adm-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{card.label}</span>
                <span style={{ fontSize: '20px' }}>{card.icon}</span>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--adm-text)', lineHeight: 1 }}>
                {loading ? '—' : formatNumber(value)}
              </div>
            </div>
          )
        })}
      </div>

      {/* Two-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '18px' }}>
        {/* Recent news */}
        <div className="adm-panel">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--adm-text)' }}>📰 Últimas notícias</span>
            <Link href="/admin/posts" style={{ fontSize: '12px', color: 'var(--adm-accent)', textDecoration: 'none' }}>Ver todas →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {loading ? (
              [1,2,3,4,5].map(i => (
                <div key={i} style={{ height: '52px', background: 'rgba(255,255,255,0.04)', borderRadius: '9px' }} />
              ))
            ) : !stats?.recentPosts?.length ? (
              <p style={{ color: 'var(--adm-muted)', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>Nenhum post ainda</p>
            ) : stats.recentPosts.map((post) => {
              const st = STATUS_LABELS[post.status] || STATUS_LABELS.DRAFT
              return (
                <div key={post.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--adm-border)',
                }}>
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
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--adm-text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</p>
                    <p style={{ fontSize: '11px', color: 'var(--adm-muted)', margin: '2px 0 0' }}>{formatRelativeDate(post.createdAt)}</p>
                  </div>
                  <span className={st.cls}>{st.label}</span>
                  <Link href={`/admin/posts/${post.id}`} style={{ color: 'var(--adm-muted)', fontSize: '13px', textDecoration: 'none' }}>✏️</Link>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Top posts */}
          <div className="adm-panel">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--adm-text)' }}>🔥 Mais vistos</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {loading ? (
                [1,2,3].map(i => <div key={i} style={{ height: '32px', background: 'rgba(255,255,255,0.04)', borderRadius: '7px' }} />)
              ) : stats?.topPosts?.map((post, i) => (
                <div key={post.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--adm-accent)', width: '18px', flexShrink: 0 }}>{i + 1}</span>
                  <p style={{ fontSize: '12px', color: 'var(--adm-text)', flex: 1, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</p>
                  <span style={{ fontSize: '11px', color: 'var(--adm-muted)', whiteSpace: 'nowrap' }}>👁 {formatNumber(post.views)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="adm-panel">
            <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--adm-text)', marginBottom: '14px' }}>⚡ Ações rápidas</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link href="/admin/posts/novo" className="adm-btn-ghost" style={{ justifyContent: 'center', textDecoration: 'none' }}>✏️ Nova Notícia</Link>
              <Link href="/admin/campaigns" className="adm-btn-ghost" style={{ justifyContent: 'center', textDecoration: 'none' }}>📣 Ver Anúncios</Link>
              <Link href="/admin/settings" className="adm-btn-ghost" style={{ justifyContent: 'center', textDecoration: 'none' }}>⚙️ Configurações</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
