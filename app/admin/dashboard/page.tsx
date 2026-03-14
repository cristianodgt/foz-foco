'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileText, Eye, CheckCircle, Megaphone, TrendingUp, Plus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatNumber, formatRelativeDate } from '@/lib/utils'
import type { DashboardStats } from '@/types'

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType; label: string; value: string | number; color: string
}) {
  return (
    <div className="bg-white rounded-xl p-5 border shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500 font-medium">{label}</span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900">{formatNumber(Number(value))}</p>
    </div>
  )
}

const STATUS_LABELS: Record<string, { label: string; variant: 'success' | 'warning' | 'secondary' }> = {
  PUBLISHED: { label: 'Publicado', variant: 'success' },
  DRAFT: { label: 'Rascunho', variant: 'warning' },
  ARCHIVED: { label: 'Arquivado', variant: 'secondary' },
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((data) => setStats(data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 bg-gray-200 rounded-xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Button asChild>
          <Link href="/admin/posts/novo"><Plus className="w-4 h-4 mr-2" /> Novo Post</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Total de Posts" value={stats?.totalPosts || 0} color="bg-blue-600" />
        <StatCard icon={CheckCircle} label="Publicados" value={stats?.publishedPosts || 0} color="bg-green-600" />
        <StatCard icon={Eye} label="Visualizações" value={stats?.totalViews || 0} color="bg-purple-600" />
        <StatCard icon={Megaphone} label="Anúncios Ativos" value={stats?.activeAds || 0} color="bg-orange-500" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top posts */}
        <div className="bg-white rounded-xl border shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" /> Mais Visualizados
            </h2>
            <Link href="/admin/posts" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {stats?.topPosts.map((post, i) => (
              <div key={post.id} className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-200 w-6 text-center">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{post.title}</p>
                </div>
                <span className="text-xs text-gray-500 flex items-center gap-1 whitespace-nowrap">
                  <Eye className="w-3 h-3" /> {formatNumber(post.views)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent posts */}
        <div className="bg-white rounded-xl border shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" /> Posts Recentes
            </h2>
            <Link href="/admin/posts" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {stats?.recentPosts.map((post) => {
              const statusInfo = STATUS_LABELS[post.status]
              return (
                <div key={post.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{post.title}</p>
                    <p className="text-xs text-gray-400">{formatRelativeDate(post.createdAt)}</p>
                  </div>
                  <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
