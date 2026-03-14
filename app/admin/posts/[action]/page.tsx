'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { Loader2, X, ArrowLeft, Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import type { Category } from '@/types'
import Link from 'next/link'

function generateSlugPreview(title: string) {
  return title
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 50)
}

export default function PostFormPage() {
  const params = useParams()
  const action = params.action as string
  const isNew = action === 'novo'
  const router = useRouter()
  const { toast } = useToast()
  const autoSaveRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const dropRef = useRef<HTMLDivElement>(null)

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [contentType, setContentType] = useState<'foto' | 'video'>('foto')
  const [mediaFiles, setMediaFiles] = useState<{ url: string; type: 'image' | 'video'; name: string }[]>([])
  const [uploading, setUploading] = useState(false)
  const [scheduled, setScheduled] = useState(false)
  const [scheduleDate, setScheduleDate] = useState('')
  const [tagInput, setTagInput] = useState('')

  const [form, setForm] = useState({
    title: '',
    summary: '',
    content: '',
    categoryId: '',
    coverImage: '',
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED',
    featured: false,
    tags: [] as string[],
  })

  // SEO score
  const seoScore = (() => {
    let s = 0
    if (form.title.length >= 30) s++
    if (form.title.length <= 80) s++
    if (form.summary.length >= 60) s++
    if (form.summary.length <= 160) s++
    if (form.content.length > 100) s++
    return s
  })()

  const seoSlug = form.title ? generateSlugPreview(form.title) : 'seu-titulo-aqui'

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    if (!isNew) {
      setLoading(true)
      fetch(`/api/admin/posts/${action}`)
        .then(r => r.json())
        .then(post => {
          setForm({
            title: post.title || '',
            summary: post.summary || '',
            content: post.content || '',
            categoryId: post.categoryId || '',
            coverImage: post.coverImage || '',
            status: post.status || 'DRAFT',
            featured: post.featured || false,
            tags: post.tags?.map((t: { name: string }) => t.name) || [],
          })
          if (post.coverImage) {
            setMediaFiles([{ url: post.coverImage, type: 'image', name: 'capa' }])
          }
        })
        .finally(() => setLoading(false))
    }
  }, [action, isNew])

  useEffect(() => {
    if (!isNew) return
    autoSaveRef.current = setInterval(() => {
      if (form.title && form.content) handleSave('DRAFT', true)
    }, 30000)
    return () => { if (autoSaveRef.current) clearInterval(autoSaveRef.current) }
  }, [form, isNew])

  async function uploadFile(file: File): Promise<{ url: string; type: 'image' | 'video'; name: string } | null> {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', 'posts')
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (!data.url) return null
    return {
      url: data.url,
      type: file.type.startsWith('video') ? 'video' : 'image',
      name: file.name,
    }
  }

  async function handleFilesSelected(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      const results = await Promise.all(Array.from(files).map(uploadFile))
      const successful = results.filter(Boolean) as { url: string; type: 'image' | 'video'; name: string }[]
      setMediaFiles(prev => {
        const updated = [...prev, ...successful]
        // First item becomes the cover
        if (updated.length > 0 && updated[0].type === 'image') {
          setForm(f => ({ ...f, coverImage: updated[0].url }))
        }
        return updated
      })
    } catch {
      toast({ title: 'Erro no upload', variant: 'destructive' })
    } finally {
      setUploading(false)
    }
  }

  function removeMedia(index: number) {
    setMediaFiles(prev => {
      const updated = prev.filter((_, i) => i !== index)
      setForm(f => ({ ...f, coverImage: updated[0]?.type === 'image' ? updated[0].url : f.coverImage }))
      return updated
    })
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    handleFilesSelected(e.dataTransfer.files)
  }

  function addTag(e: React.KeyboardEvent) {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault()
      if (!form.tags.includes(tagInput.trim())) {
        setForm(f => ({ ...f, tags: [...f.tags, tagInput.trim()] }))
      }
      setTagInput('')
    }
  }

  async function handleSave(status: 'DRAFT' | 'PUBLISHED', silent = false) {
    if (!form.title || !form.content || !form.categoryId) {
      if (!silent) toast({ title: 'Preencha título, conteúdo e categoria', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const body = { ...form, status }
      const url = isNew ? '/api/admin/posts' : `/api/admin/posts/${action}`
      const method = isNew ? 'POST' : 'PUT'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) {
        if (!silent) toast({ title: 'Erro ao salvar', description: data.error, variant: 'destructive' })
        return
      }
      if (!silent) {
        toast({ title: status === 'PUBLISHED' ? '🚀 Notícia publicada!' : '💾 Rascunho salvo' })
        if (isNew) router.push('/admin/posts')
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
        <Loader2 className="animate-spin" size={32} style={{ color: 'var(--adm-muted)' }} />
      </div>
    )
  }

  const seoColors = ['#FF3B30', '#FF9500', '#FFD60A', '#34C759', '#34C759']

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '22px' }}>
        <Link href="/admin/posts" style={{ color: 'var(--adm-muted)', textDecoration: 'none', display: 'flex' }}>
          <ArrowLeft size={20} />
        </Link>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--adm-text)', margin: 0, flex: 1 }}>
          {isNew ? 'Nova Notícia' : 'Editar Notícia'}
        </h1>
        <button onClick={() => handleSave('DRAFT')} disabled={saving} className="adm-btn-ghost">
          {saving ? <Loader2 size={14} className="animate-spin" /> : '💾'} Salvar Rascunho
        </button>
        <button onClick={() => handleSave('PUBLISHED')} disabled={saving} className="adm-btn-primary">
          {saving ? <Loader2 size={14} className="animate-spin" /> : '🚀'} Publicar
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '18px', alignItems: 'start' }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Content type toggle */}
          <div className="adm-panel">
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--adm-text)', marginBottom: '12px' }}>📌 Tipo de conteúdo</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div
                className={`adm-type-opt${contentType === 'foto' ? ' selected' : ''}`}
                onClick={() => setContentType('foto')}
              >
                📷 Foto
              </div>
              <div
                className={`adm-type-opt${contentType === 'video' ? ' selected' : ''}`}
                onClick={() => setContentType('video')}
              >
                🎥 Vídeo
              </div>
            </div>
          </div>

          {/* Content fields */}
          <div className="adm-panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--adm-text)' }}>✏️ Conteúdo da notícia</div>

            <div>
              <label className="adm-label">Título *</label>
              <input
                className="adm-input"
                placeholder="Ex: Cataratas batem recorde de visitantes em 2025"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              />
              <div style={{ fontSize: '11px', color: 'var(--adm-muted)', marginTop: '4px', textAlign: 'right' }}>
                {form.title.length}/80 caracteres
              </div>
            </div>

            <div>
              <label className="adm-label">Lead (subtítulo) *</label>
              <textarea
                className="adm-textarea"
                rows={3}
                placeholder="Resumo da notícia em 1-2 frases. Aparece no card do feed."
                value={form.summary}
                onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
              />
              <div style={{ fontSize: '11px', color: 'var(--adm-muted)', marginTop: '4px', textAlign: 'right' }}>
                {form.summary.length}/160 caracteres
              </div>
            </div>

            <div>
              <label className="adm-label">Texto completo</label>
              <textarea
                className="adm-textarea"
                rows={8}
                placeholder="Texto completo da notícia. Aparece na página individual (importante para SEO)."
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="adm-label">Categoria *</label>
                <select
                  className="adm-select"
                  style={{ width: '100%' }}
                  value={form.categoryId}
                  onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                >
                  <option value="">Selecionar...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="adm-label">Tags</label>
                <input
                  className="adm-input"
                  placeholder="Tag + Enter"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={addTag}
                />
              </div>
            </div>

            {form.tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {form.tags.map(tag => (
                  <span key={tag} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    background: 'rgba(255,255,255,0.08)', color: 'var(--adm-text)',
                    borderRadius: '999px', padding: '4px 10px', fontSize: '12px',
                  }}>
                    {tag}
                    <button
                      onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--adm-muted)', padding: 0, display: 'flex' }}
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* SEO Preview */}
          <div className="adm-panel">
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--adm-text)', marginBottom: '12px' }}>🔍 SEO — Como aparece no Google</div>
            <div className="adm-seo-preview">
              <div style={{ fontSize: '11px', color: 'var(--adm-muted)', marginBottom: '4px' }}>fozcidadeemfoco.com.br › noticia › {seoSlug}</div>
              <div style={{ fontSize: '14px', color: '#0A84FF', fontWeight: 600, marginBottom: '4px' }}>
                {form.title ? `${form.title} — FOZ.FOCO` : 'Seu título aparece aqui — FOZ.FOCO'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--adm-muted)', lineHeight: 1.5 }}>
                {form.summary || 'O lead da notícia vira a descrição que aparece no Google. Escreva algo atraente com até 160 caracteres.'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--adm-muted)' }}>Qualidade:</span>
              {[0,1,2,3,4].map(i => (
                <div key={i} style={{
                  width: '28px', height: '5px', borderRadius: '999px',
                  background: i < seoScore ? seoColors[seoScore - 1] : 'rgba(255,255,255,0.1)',
                  transition: 'background 0.3s',
                }} />
              ))}
              <span style={{ fontSize: '11px', color: seoScore >= 4 ? '#34C759' : seoScore >= 2 ? '#FF9500' : '#FF3B30' }}>
                {seoScore >= 4 ? 'Ótimo' : seoScore >= 2 ? 'Médio' : 'Incompleto'}
              </span>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Media upload */}
          <div className="adm-panel">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--adm-text)' }}>🖼️ Mídia</span>
              <span style={{ fontSize: '10px', color: 'var(--adm-muted)' }}>1º item = capa</span>
            </div>

            {/* Uploaded files */}
            {mediaFiles.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
                {mediaFiles.map((m, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '8px 10px', borderRadius: '9px',
                    background: 'rgba(255,255,255,0.03)', border: '1px solid var(--adm-border)',
                  }}>
                    {i === 0 && (
                      <span style={{ fontSize: '10px', color: '#FF9500', background: 'rgba(255,149,0,0.15)', padding: '2px 7px', borderRadius: '999px', flexShrink: 0 }}>CAPA</span>
                    )}
                    {m.type === 'image' ? (
                      <div style={{ position: 'relative', width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                        <Image src={m.url} alt={m.name} fill style={{ objectFit: 'cover' }} />
                      </div>
                    ) : (
                      <div style={{ width: '40px', height: '40px', borderRadius: '6px', background: 'var(--adm-surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>▶️</div>
                    )}
                    <span style={{ fontSize: '11px', color: 'var(--adm-muted)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</span>
                    <button onClick={() => removeMedia(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--adm-muted)', display: 'flex' }}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Drop zone */}
            <div
              ref={dropRef}
              className="adm-upload-zone"
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => document.getElementById('media-input')?.click()}
            >
              {uploading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <Loader2 size={24} className="animate-spin" style={{ color: 'var(--adm-muted)' }} />
                  <span style={{ fontSize: '12px', color: 'var(--adm-muted)' }}>Enviando...</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <Plus size={24} style={{ color: 'var(--adm-muted)' }} />
                  <p style={{ fontSize: '12px', color: 'var(--adm-muted)', margin: 0, textAlign: 'center', lineHeight: 1.5 }}>
                    <strong style={{ color: 'var(--adm-text)' }}>Clique ou arraste</strong><br />
                    {contentType === 'foto' ? 'JPG, PNG, WebP' : 'MP4, MOV, WebM'} — máx. 50MB<br />
                    <span style={{ fontSize: '10px' }}>Vários arquivos permitidos</span>
                  </p>
                </div>
              )}
            </div>
            <input
              id="media-input"
              type="file"
              multiple
              accept={contentType === 'foto' ? 'image/*' : 'video/*,image/*'}
              style={{ display: 'none' }}
              onChange={e => handleFilesSelected(e.target.files)}
            />
          </div>

          {/* Details panel */}
          <div className="adm-panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--adm-text)' }}>📋 Detalhes</div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: 'var(--adm-text)' }}>⭐ Destaque</span>
              <label className="adm-toggle">
                <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} />
                <span className="adm-toggle-slider" />
              </label>
            </div>
          </div>

          {/* Schedule / Publish */}
          <div className="adm-panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--adm-text)' }}>🗓️ Publicação</div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: 'var(--adm-text)' }}>Agendar para depois</span>
              <label className="adm-toggle">
                <input type="checkbox" checked={scheduled} onChange={e => setScheduled(e.target.checked)} />
                <span className="adm-toggle-slider" />
              </label>
            </div>

            {scheduled ? (
              <div>
                <label className="adm-label">Data e hora</label>
                <input
                  type="datetime-local"
                  className="adm-input"
                  value={scheduleDate}
                  onChange={e => setScheduleDate(e.target.value)}
                />
              </div>
            ) : (
              <p style={{ fontSize: '12px', color: 'var(--adm-muted)', margin: 0 }}>
                📡 Será publicado imediatamente no feed
              </p>
            )}

            <button
              onClick={() => handleSave('PUBLISHED')}
              disabled={saving}
              className="adm-btn-primary"
              style={{ justifyContent: 'center', width: '100%' }}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : (scheduled ? '📅' : '🚀')}
              {scheduled ? ' Agendar publicação' : ' Publicar no Feed'}
            </button>
            <button
              onClick={() => handleSave('DRAFT')}
              disabled={saving}
              className="adm-btn-ghost"
              style={{ justifyContent: 'center', width: '100%' }}
            >
              💾 Salvar rascunho
            </button>
          </div>

          {/* Quality tips */}
          <div className="adm-panel" style={{ background: 'rgba(255,149,0,0.04)', borderColor: 'rgba(255,149,0,0.2)' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#FF9500', marginBottom: '10px' }}>💡 Dicas de qualidade</div>
            <div style={{ fontSize: '12px', color: 'var(--adm-muted)', lineHeight: 2 }}>
              ✅ Use imagem <strong style={{ color: 'var(--adm-text)' }}>vertical 9:16</strong><br />
              ✅ Título entre <strong style={{ color: 'var(--adm-text)' }}>50–80 caracteres</strong><br />
              ✅ Lead direto e objetivo<br />
              ✅ Texto completo para SEO<br />
              ⚠️ Evite texto escuro sobre fundo escuro
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
