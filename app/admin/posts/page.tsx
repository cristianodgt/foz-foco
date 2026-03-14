'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Eye, Edit2, Trash2, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { formatDateShort, formatNumber } from '@/lib/utils'
import type { Post } from '@/types'

const STATUS_CONFIG = {
  PUBLISHED: { label: 'Publicado', variant: 'success' as const },
  DRAFT: { label: 'Rascunho', variant: 'warning' as const },
  ARCHIVED: { label: 'Arquivado', variant: 'secondary' as const },
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleting, setDeleting] = useState<string | null>(null)
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

  async function deletePost(slug: string) {
    if (!confirm('Tem certeza que deseja deletar este post?')) return
    setDeleting(slug)
    try {
      const res = await fetch(`/api/posts/${slug}`, { method: 'DELETE' })
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.slug !== slug))
        toast({ title: 'Post deletado', variant: 'default' })
      }
    } finally {
      setDeleting(null)
    }
  }

  async function toggleStatus(post: Post) {
    const newStatus = post.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
    const res = await fetch(`/api/posts/${post.slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      const updated = await res.json()
      setPosts((prev) => prev.map((p) => (p.id === post.id ? updated : p)))
      toast({ title: newStatus === 'PUBLISHED' ? 'Post publicado!' : 'Post despublicado' })
    }
  }

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} post(s) no total</p>
        </div>
        <Button asChild>
          <Link href="/admin/posts/novo"><Plus className="w-4 h-4 mr-2" /> Novo Post</Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por título..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="PUBLISHED">Publicado</SelectItem>
            <SelectItem value="DRAFT">Rascunho</SelectItem>
            <SelectItem value="ARCHIVED">Arquivado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">Nenhum post encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Título</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Categoria</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Views</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Data</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {posts.map((post) => {
                  const status = STATUS_CONFIG[post.status]
                  return (
                    <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 text-sm line-clamp-1">{post.title}</p>
                        {post.featured && (
                          <span className="text-xs text-orange-500 font-medium">★ Destaque</span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: post.category.color }}
                        >
                          {post.category.name}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" /> {formatNumber(post.views)}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-sm text-gray-500">
                          {formatDateShort(post.publishedAt || post.createdAt)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => toggleStatus(post)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              post.status === 'PUBLISHED'
                                ? 'text-green-600 hover:bg-green-50'
                                : 'text-gray-400 hover:bg-gray-100'
                            }`}
                            title={post.status === 'PUBLISHED' ? 'Despublicar' : 'Publicar'}
                          >
                            {post.status === 'PUBLISHED' ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                          </button>
                          <Link
                            href={`/admin/posts/${post.id}`}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => deletePost(post.slug)}
                            disabled={deleting === post.slug}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            {deleting === post.slug ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
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
    </div>
  )
}
