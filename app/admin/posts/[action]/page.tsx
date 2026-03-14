'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import {
  Save, Send, ArrowLeft, Upload, X, Loader2, Tag as TagIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PostEditor } from '@/components/admin/PostEditor'
import { useToast } from '@/hooks/use-toast'
import type { Category } from '@/types'
import Link from 'next/link'

export default function PostFormPage() {
  const params = useParams()
  const action = params.action as string
  const isNew = action === 'novo'
  const router = useRouter()
  const { toast } = useToast()
  const autoSaveRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

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

  const [tagInput, setTagInput] = useState('')

  // Load categories
  useEffect(() => {
    fetch('/api/feed').then(() => {}) // warm up
    prismaFetchCategories()
  }, [])

  async function prismaFetchCategories() {
    const res = await fetch('/api/categories')
    if (res.ok) {
      const data = await res.json()
      setCategories(data)
    }
  }

  // Load existing post
  useEffect(() => {
    if (!isNew) {
      setLoading(true)
      fetch(`/api/admin/posts/${action}`)
        .then((r) => r.json())
        .then((post) => {
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
        })
        .finally(() => setLoading(false))
    }
  }, [action, isNew])

  // Auto-save every 30s
  useEffect(() => {
    if (!isNew) return
    autoSaveRef.current = setInterval(() => {
      if (form.title && form.content) {
        handleSave('DRAFT', true)
      }
    }, 30000)
    return () => {
      if (autoSaveRef.current) clearInterval(autoSaveRef.current)
    }
  }, [form, isNew])

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'covers')
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) setForm((f) => ({ ...f, coverImage: data.url }))
      else toast({ title: 'Erro no upload', variant: 'destructive' })
    } finally {
      setUploading(false)
    }
  }

  function addTag(e: React.KeyboardEvent) {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault()
      if (!form.tags.includes(tagInput.trim())) {
        setForm((f) => ({ ...f, tags: [...f.tags, tagInput.trim()] }))
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

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()

      if (!res.ok) {
        if (!silent) toast({ title: 'Erro ao salvar', description: data.error, variant: 'destructive' })
        return
      }

      if (!silent) {
        toast({ title: status === 'PUBLISHED' ? '🎉 Post publicado!' : '✅ Rascunho salvo' })
        if (isNew) router.push('/admin/posts')
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/posts" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900 flex-1">
          {isNew ? 'Novo Post' : 'Editar Post'}
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleSave('DRAFT')} disabled={saving} size="sm">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-1.5" />}
            Salvar Rascunho
          </Button>
          <Button onClick={() => handleSave('PUBLISHED')} disabled={saving} size="sm">
            <Send className="w-4 h-4 mr-1.5" /> Publicar
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <Label>Título *</Label>
            <Input
              placeholder="Digite o título do post..."
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="text-lg font-medium"
            />
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <Label>Resumo *</Label>
            <Textarea
              placeholder="Resumo do post (aparece no feed)..."
              value={form.summary}
              onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Content Editor */}
          <div className="space-y-2">
            <Label>Conteúdo *</Label>
            <PostEditor
              content={form.content}
              onChange={(html) => setForm((f) => ({ ...f, content: html }))}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Category */}
          <div className="bg-white rounded-xl border p-4 space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm">Detalhes</h3>

            <div className="space-y-2">
              <Label>Categoria *</Label>
              <Select value={form.categoryId} onValueChange={(v) => setForm((f) => ({ ...f, categoryId: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar categoria..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Featured */}
            <div className="flex items-center justify-between">
              <Label className="cursor-pointer">Destaque</Label>
              <Switch
                checked={form.featured}
                onCheckedChange={(v) => setForm((f) => ({ ...f, featured: v }))}
              />
            </div>
          </div>

          {/* Cover image */}
          <div className="bg-white rounded-xl border p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 text-sm">Imagem de Capa</h3>
            {form.coverImage ? (
              <div className="relative">
                <div className="relative h-40 rounded-lg overflow-hidden">
                  <Image src={form.coverImage} alt="Capa" fill className="object-cover" />
                </div>
                <button
                  onClick={() => setForm((f) => ({ ...f, coverImage: '' }))}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                {uploading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">Clique para fazer upload</span>
                    <span className="text-xs text-gray-400">JPG, PNG, WebP — máx. 5MB</span>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
              </label>
            )}
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl border p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
              <TagIcon className="w-4 h-4" /> Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full">
                  {tag}
                  <button onClick={() => setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }))}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <Input
              placeholder="Tag + Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              className="text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
